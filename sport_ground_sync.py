#!/usr/bin/env python3
"""Fetch TKO Sports Ground timetable from LCSD XLSX → write sport_ground_status.json.
Usage: python3 sport_ground_sync.py [--deploy]
Parses Main Field + Secondary Field timetables (A/L/B/M codes) + Notices sheet.
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request
from datetime import date, datetime, timezone, timedelta

FID = 1060
BASE_URL = "https://www.lcsd.gov.hk/file_upload_clpss/leisure_facilities/lsb/jogging"
JSON_PATH = "/home/ubuntu/we1co.me/sport_ground_status.json"
UA = {"User-Agent": "Mozilla/5.0 (compatible; sport-ground-sync/1.0)"}
STATUS_MAP = {
    "A": {"en": "Open", "zh": "開放"},
    "L": {"en": "Limited lanes", "zh": "部分線道"},
    "B": {"en": "Closed (booking)", "zh": "預訂暫停"},
    "M": {"en": "Closed", "zh": "關閉"},
}
NOTICE_COL = {"B": "date_range", "C": "facilities", "D": "reason", "E": "remarks"}


def fetch_xlsx(month=None):
    """Download XLSX for given month via CF proxy, fallback to previous month."""
    now = datetime.now(timezone(timedelta(hours=8)))
    if month is None:
        month = now.strftime("%Y%m")
    prev = (now.replace(day=1) - timedelta(days=1)).strftime("%Y%m")
    # Also try next month (for cross-month tomorrow)
    nxt = (now.replace(day=1) + timedelta(days=32)).replace(day=1).strftime("%Y%m")
    urls = [
        f"{BASE_URL}/{FID}_{month}.xlsx",
        f"{BASE_URL}/{FID}_{prev}.xlsx",
        f"{BASE_URL}/{FID}_{nxt}.xlsx",
    ]
    # Try CF proxy first
    try:
        import urllib.parse as urlparse
        token = None
        for p in ["/home/ubuntu/.config/lcsd_proxy_token", "/tmp/cf_proxy_token.txt"]:
            try:
                with open(p) as f: token = f.read().strip(); break
            except: pass
        if not token:
            token = os.environ.get("CF_PROXY_TOKEN", "")
        proxy_base = "https://lcsd-proxy.forumdata.workers.dev/?url="
        if token:
            for url in urls:
                try:
                    proxied = proxy_base + urlparse.quote(url, safe='')
                    req = urllib.request.Request(proxied, headers={**UA, "x-proxy-token": token})
                    with urllib.request.urlopen(req, timeout=30) as r:
                        data = r.read()
                        with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as f:
                            f.write(data)
                            print(f"Fetched via CF proxy: {url}")
                            return f.name
                except Exception as e:
                    print(f"  skip CF {url}: {e}")
    except Exception:
        pass
    for url in urls:
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
                with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as f:
                    f.write(data)
                    print(f"Fetched: {url}")
                    return f.name
        except Exception as e:
            print(f"  skip {url}: {e}")
    raise RuntimeError("Cannot fetch XLSX")


def parse_timetable(ws, today_day=None):
    """Parse timetable sheet: row 8=dates, row 9+=time slots × status codes.
    Returns dict: {time_slot: {day_num: code}} + list of date headers.
    """
    dates = {}  # col_letter -> day_num
    timetable = {}  # time_slot -> {day_num: code}

    # Row 8: date headers
    for cell in ws[8]:
        if cell.value and isinstance(cell.value, str) and "\n" in cell.value:
            lines = cell.value.strip().split("\n")
            try:
                day_num = int(lines[0])
            except ValueError:
                continue
            dates[cell.column_letter] = day_num

    # Row 9+: time slots (col B = time, col C+ = status codes)
    for row in ws.iter_rows(min_row=9, max_row=ws.max_row, values_only=False):
        # row[0] is col A (empty), row[1] is col B (time)
        time_cell = row[1] if len(row) > 1 else row[0]
        if not time_cell.value:
            continue
        time_slot = str(time_cell.value).strip()
        codes = {}
        for cell in row[2:]:
            if cell.column_letter in dates and cell.value:
                code = str(cell.value).strip().upper()
                if code in STATUS_MAP:
                    codes[dates[cell.column_letter]] = code
        if codes:
            timetable[time_slot] = codes

    return timetable, dates


def parse_notices(ws):
    """Parse Notices sheet for closure information."""
    notices = []
    for row in ws.iter_rows(min_row=3, max_row=ws.max_row, values_only=False):
        vals = {}
        for cell in row:
            if cell.value and cell.column_letter in NOTICE_COL:
                vals[NOTICE_COL[cell.column_letter]] = str(cell.value).strip()
        if vals.get("date_range") and vals.get("facilities"):
            notices.append(vals)
    return notices


def get_current_status(timetable, dates, notices, day_num):
    """Get status for each time slot for given day based on A/L/B/M codes."""
    now_hkt = datetime.now(timezone(timedelta(hours=8)))
    current_minutes = now_hkt.hour * 60 + now_hkt.minute

    result = []
    for time_slot, day_codes in timetable.items():
        # Normalize time range format (some have extra spaces)
        time_slot_clean = time_slot.strip()
        m = re.match(r"(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})", time_slot_clean)
        if not m:
            continue
        sh, sm, eh, em = int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4))
        start_min = sh * 60 + sm
        end_min = eh * 60 + em

        code = day_codes.get(day_num, "")
        status = STATUS_MAP.get(code, {"en": "Unknown", "zh": "未知"})

        # Check if in current time window
        is_current = start_min <= current_minutes < end_min

        result.append({
            "time": time_slot,
            "code": code,
            "status_zh": status["zh"],
            "status_en": status["en"],
            "is_current": is_current,
        })

    # Check notices for today's closures
    today_str = date.today().strftime("%Y/%m/%d")
    closures = []
    for n in notices:
        dr = n.get("date_range", "")
        # Match date patterns like "2026/09/07,14,21,28  06:30-22:30"
        date_part = dr.split("  ")[0] if "  " in dr else dr
        time_part = dr.split("  ")[1] if "  " in dr else ""

        # Extract individual dates
        date_section = date_part.split(",")[0] if "," in date_part else date_part
        # Check if today matches any pattern
        m = re.match(r"(\d{4}/\d{2}/\d{2})", date_section)
        if m:
            base_date = m.group(1)
            # Check comma-separated days: "2026/09/07,14,21,28"
            parts = date_section.split(",")
            for p in parts:
                p = p.strip()
                # Could be "2026/09/07" or just "14" (day within same month)
                if re.match(r"\d{4}/\d{2}/\d{2}", p):
                    if p == today_str:
                        closures.append({
                            "facilities": n.get("facilities", ""),
                            "reason": n.get("reason", ""),
                            "time": time_part,
                        })
                        break
                elif re.match(r"\d{1,2}$", p):
                    # Day number within current month
                    expected = f"{base_date[:7]}/{int(p):02d}"
                    if expected == today_str:
                        closures.append({
                            "facilities": n.get("facilities", ""),
                            "reason": n.get("reason", ""),
                            "time": time_part,
                        })
                        break

    return result, closures


def main():
    try:
        xlsx_path = fetch_xlsx()
        try:
            import openpyxl
        except ImportError:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl", "-q"])
            import openpyxl

        wb = openpyxl.load_workbook(xlsx_path)
        today_day = date.today().day

        # Also try next month XLSX for cross-month tomorrow
        nxt = (datetime.now(timezone(timedelta(hours=8))).replace(day=1) + timedelta(days=32)).replace(day=1).strftime("%Y%m")
        wb2 = None
        try:
            nxt_path = fetch_xlsx(nxt)
            if nxt_path: wb2 = openpyxl.load_workbook(nxt_path)
        except: pass

        # Parse both sheets
        main_ws = wb[wb.sheetnames[0]]
        sec_ws = wb[wb.sheetnames[1]]
        notice_ws = wb[wb.sheetnames[2]] if len(wb.sheetnames) > 2 else None

        main_timetable, main_dates = parse_timetable(main_ws)
        sec_timetable, sec_dates = parse_timetable(sec_ws)
        # Merge next month timetable (cross-month tomorrow)
        if wb2:
            for nm_ws in [wb2[wb2.sheetnames[0]], wb2[wb2.sheetnames[1]] if len(wb2.sheetnames)>1 else None]:
                if not nm_ws: continue
                nm_tt, nm_dates = parse_timetable(nm_ws)
                # nm_dates maps col→day_num (1,2,3... for next month)
                # We want day_num 1 (tomorrow=Sep 1) → map to our day 1
                for ts, codes in nm_tt.items():
                    if ts in (main_timetable if nm_ws == wb2[wb2.sheetnames[0]] else sec_timetable):
                        target = main_timetable if nm_ws == wb2[wb2.sheetnames[0]] else sec_timetable
                        for dn, code in codes.items():
                            target.setdefault(ts, {})[dn] = code
        notices = parse_notices(notice_ws) if notice_ws else []

        # Extract XLSX date from sheet title (e.g. "2026年8月")
        title_cell = main_ws['B1']
        xlsx_date = ""
        if title_cell.value:
            dm = re.search(r"(\d{4})年(\d{1,2})月", str(title_cell.value))
            if dm:
                xlsx_date = f"{dm.group(1)}年{dm.group(2)}月"

        # Extract file modified date from XLSX internal metadata (docProps/core.xml)
        xlsx_file_date = ""
        try:
            import zipfile
            with zipfile.ZipFile(xlsx_path) as zf:
                if 'docProps/core.xml' in zf.namelist():
                    core_xml = zf.read('docProps/core.xml').decode('utf-8', errors='ignore')
                    # Look for dcterms:modified or created
                    mod_match = re.search(r'<dcterms:modified[^>]*>([^<]+)</dcterms:modified>', core_xml)
                    if mod_match:
                        # Parse ISO format like 2026-08-29T10:30:00Z
                        raw = mod_match.group(1).strip()
                        dt_match = re.match(r'(\d{4})-(\d{2})-(\d{2})', raw)
                        if dt_match:
                            xlsx_file_date = f"{dt_match.group(1)}-{dt_match.group(2)}-{dt_match.group(3)}"
        except Exception:
            pass

        tomorrow_day = today_day + 1
        # Check if tomorrow exceeds current month's days
        import calendar
        now_hkt = datetime.now(timezone(timedelta(hours=8)))
        days_in_month = calendar.monthrange(now_hkt.year, now_hkt.month)[1]
        if tomorrow_day > days_in_month:
            tomorrow_day = 1  # wrap to next month (day 1)

        # Today
        main_status, main_closures = get_current_status(main_timetable, main_dates, notices, today_day)
        sec_status, sec_closures = get_current_status(sec_timetable, sec_dates, notices, today_day)

        # Tomorrow
        main_status_tm, _ = get_current_status(main_timetable, main_dates, notices, tomorrow_day)
        sec_status_tm, _ = get_current_status(sec_timetable, sec_dates, notices, tomorrow_day)

        # Maintenance overrides — ponytail: hardcode fid=1060 weekly closure
        # Correct weekday: Mon=0 ... Sun=6 in Python
        _wd = now_hkt.weekday()
        is_main_maint = _wd == 0
        is_sec_maint = _wd == 4
        # Maintenance: only fill M into slots WITHOUT a valid XLSX code (A/B/L).
        # XLSX is authoritative — don't override existing bookings or open slots.
        if is_main_maint:
            for s in main_status:
                if s["code"] not in ("A", "B", "L"):
                    s["code"] = "M"
                    s["status_zh"] = "關閉"
                    s["status_en"] = "Closed"
                s["is_current"] = False
        if is_sec_maint:
            for s in sec_status:
                if s["code"] not in ("A", "B", "L"):
                    s["code"] = "M"
                    s["status_zh"] = "關閉"
                    s["status_en"] = "Closed"
                s["is_current"] = False
        # Also check tomorrow's maintenance for tomorrow slots
        _wd_tom = (now_hkt + timedelta(days=1)).weekday()
        if _wd_tom == 0:
            for s in main_status_tm:
                if s["code"] not in ("A", "B", "L"):
                    s["code"] = "M"
                    s["status_zh"] = "關閉"
                    s["status_en"] = "Closed"
        if _wd_tom == 4:
            for s in sec_status_tm:
                if s["code"] not in ("A", "B", "L"):
                    s["code"] = "M"
                    s["status_zh"] = "關閉"
                    s["status_en"] = "Closed"
        # Overall: maintenance forces closed for that field, mixed → partial
        all_codes_main = set(d.get(today_day, "") for d in main_timetable.values())
        all_codes_sec = set(d.get(today_day, "") for d in sec_timetable.values())
        # Override with maintenance
        if is_main_maint:
            all_codes_main = {"M"}
        if is_sec_maint:
            all_codes_sec = {"M"}
        all_codes = all_codes_main | all_codes_sec
        all_codes.discard("")
        if is_main_maint and is_sec_maint:
            overall = "closed"
        elif is_main_maint or is_sec_maint:
            overall = "partial"
        elif not all_codes:
            overall = "unknown"
        elif "A" in all_codes or "L" in all_codes:
            overall = "partial" if len(all_codes) > 1 else "open"
        elif "B" in all_codes or "M" in all_codes:
            overall = "closed"
        else:
            overall = "unknown"

        sync_time = datetime.now(now_hkt.tzinfo).strftime("%Y-%m-%d %H:%M")

        result = {
            "lastSync": sync_time,
            "today": today_day,
            "todayDate": date.today().strftime("%Y/%m/%d"),
            "tomorrow": tomorrow_day,
            "tomorrowDate": (now_hkt + timedelta(days=1)).strftime("%Y/%m/%d"),
            "overall": overall,
            "mainField": main_status,
            "secondaryField": sec_status,
            "mainFieldTomorrow": main_status_tm,
            "secondaryFieldTomorrow": sec_status_tm,
            "closures": main_closures,
            "maintenance": {"main": "逢星期一", "sec": "逢星期五"},
            "noticeUrl": f"https://www.lcsd.gov.hk/clpss/tc/webApp/Facility/Details.do?fid={FID}",
            "xlsxUrl": f"{BASE_URL}/{FID}_{now_hkt.strftime('%Y%m')}.xlsx",
            "xlsxDate": xlsx_date,
            "xlsxFileDate": xlsx_file_date,
        }

        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        os.unlink(xlsx_path)
        print(f"sport_ground_status.json: {overall}, {len(main_status)} main slots, {len(sec_status)} sec slots, {len(notices)} notices, synced {sync_time}")
        print("PASS")

    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
