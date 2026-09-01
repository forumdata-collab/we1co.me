#!/usr/bin/env python3
"""LCSD 泳池狀態 scraper → patch index.html → deploy.
Usage: python3 lcsd_closures.py [--deploy]
抓每個泳池的三類資料：
  1. closures    — 暫停開放公告（日期 + 時段 + 受影響池 + 原因）
  2. maintenance — 配合每年維修工程的暫停開放時間（池 → 日期範圍）
  3. cleaning    — 每周大清潔日
寫入 index.html（自動忽略過期公告）。
"""
import re
import json
import os
import sys
import subprocess
import urllib.request
from datetime import date, datetime, timezone, timedelta

POOLS = {"tkoswim": 35, "ktswim": 18, "ltswim": 42, "jvswim": 17}
CONFIG_PATHS = ["/home/ubuntu/we1co.me/districts/sk.js", "/home/ubuntu/we1co.me/districts/kt.js"]
HTML_PATH = CONFIG_PATHS[0]  # backward compat for external imports
COMMON_JS = "/home/ubuntu/we1co.me/common.js"
UA = {"User-Agent": "Mozilla/5.0 (compatible; LCSD-closure-bot/1.0)"}


import time, random, urllib.parse
CF_PROXY = "https://lcsd-proxy.forumdata.workers.dev/?url="
def _cf_token():
    t = os.environ.get("CF_PROXY_TOKEN", "")
    if t: return t
    for p in ["/home/ubuntu/.config/lcsd_proxy_token", "/tmp/cf_proxy_token.txt"]:
        try:
            with open(p) as f: return f.read().strip()
        except (FileNotFoundError, PermissionError): pass
    return ""
def fetch(url):
    # ponytail: CF Anycast IP 隱藏 VM 固定 IP + 600s cache 降頻；fallback 直連防單點
    tok = _cf_token()
    if tok:
        try:
            proxied = CF_PROXY + urllib.parse.quote(url, safe='')
            req = urllib.request.Request(proxied, headers={**UA, "x-proxy-token": tok})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", errors="ignore")
        except Exception:
            pass
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="ignore")


def parse_closures(html):
    """暫停開放公告 (Chinese): 2026/08/29 06:30 - 2026/08/29 14:15 | 跳水池... | 救生員不足 | 備註"""
    closures = []
    date_re = re.compile(
        r"(\d{4}/\d{2}/\d{2})\s+(\d{2}:\d{2})\s*-\s*\d{4}/\d{2}/\d{2}\s+(\d{2}:\d{2})"
    )
    seen = set()
    for m in date_re.finditer(html):
        d, t_start, t_end = m.group(1), m.group(2), m.group(3)
        after = html[m.end():m.end() + 1500]
        pools_match = re.search(r"<td>\s*([^<]{2,60}(?:池|場|台|看台)[^<]*)</td>", after)
        reason, remarks = "", ""
        if pools_match:
            after_pools = after[pools_match.end():]
            reason_match = re.search(r"<td>\s*([^<]{2,40}?)\s*</td>", after_pools)
            if reason_match:
                reason = reason_match.group(1).strip()
                # 3rd column: 備註 (remarks) — skip if it's a date (next row bleeding)
                after_reason = after_pools[reason_match.end():]
                remarks_match = re.search(r"<td>\s*([^<]{1,40})\s*</td>", after_reason)
                if remarks_match:
                    rm_text = remarks_match.group(1).strip()
                    # Skip if it looks like a date (next row bleeding through)
                    if not re.match(r"\d{4}/\d{2}/\d{2}", rm_text):
                        remarks = rm_text
        if pools_match:
            pools = pools_match.group(1).strip().strip(",，")
            key = (d, f"{t_start} - {t_end}", pools)
            if key in seen:
                continue
            seen.add(key)
            closures.append({
                "date": d,
                "time": f"{t_start} - {t_end}",
                "pools": pools,
                "reason": reason or "公告",
                "remarks": remarks,
            })
    today = date.today().strftime("%Y/%m/%d")
    return [c for c in closures if c["date"] >= today]
def parse_closures_en(html):
    """English closures: same date format, English pool names and reasons"""
    closures = []
    date_re = re.compile(
        r"(\d{4}/\d{2}/\d{2})\s+(\d{2}:\d{2})\s*-\s*\d{4}/\d{2}/\d{2}\s+(\d{2}:\d{2})"
    )
    seen = set()
    for m in date_re.finditer(html):
        d, t_start, t_end = m.group(1), m.group(2), m.group(3)
        after = html[m.end():m.end() + 1500]
        pools_match = re.search(
            r"<td>\s*([^<]{2,60}(?:pool|stand|area|slide)[^<]*)</td>",
            after, re.IGNORECASE,
        )
        reason, remarks = "", ""
        if pools_match:
            after_pools = after[pools_match.end():]
            reason_match = re.search(r"<td>\s*([^<]{2,40}?)\s*</td>", after_pools)
            if reason_match:
                reason = reason_match.group(1).strip()
                after_reason = after_pools[reason_match.end():]
                remarks_match = re.search(r"<td>\s*([^<]{1,40})\s*</td>", after_reason)
                if remarks_match:
                    rm_text = remarks_match.group(1).strip()
                    if not re.match(r"\d{4}/\d{2}/\d{2}", rm_text):
                        remarks = rm_text
        if pools_match:
            pools = pools_match.group(1).strip().strip(",，")
            key = (d, f"{t_start} - {t_end}", pools)
            if key in seen:
                continue
            seen.add(key)
            closures.append({
                "date": d,
                "time": f"{t_start} - {t_end}",
                "pools": pools,
                "reason": reason or "Notice",
                "remarks": remarks,
            })
    today = date.today().strftime("%Y/%m/%d")
    return [c for c in closures if c["date"] >= today]



def parse_maintenance(html):
    """每年維修工程: 戶外泳池：11月1日至翌年4月15日 / 室內泳池：1月2日至2月21日"""
    maint = []
    # 先抽「配合每年維修工程的暫停開放時間」區塊
    start = html.find("配合每年維修工程")
    if start < 0:
        return []
    # 到「每周大清潔」或結尾為止
    end = html.find("每周大清潔", start)
    if end < 0:
        end = min(start + 5000, len(html))
    seg = html[start:end]
    # 剝離標籤，保留文字
    text = re.sub(r"<[^>]+>", "", seg)
    text = re.sub(r"&nbsp;?", " ", text)
    text = re.sub(r"\s+", " ", text)
    # 匹配 "XX池：M月D日至翌年M月D日" 或 "XX池：M月D日至M月D日"，或 "池A、池B、池C：..."
    # 先切走 header「配合每年維修工程的暫停開放時間」
    text = text.replace("配合每年維修工程的暫停開放時間", "")
    re_pool = re.compile(r"([\u4e00-\u9fff、，, ]+(?:池|場))\s*(?:\([^)]+\))?\s*[：:]\s*(\d{1,2})月(\d{1,2})日\s*至\s*(翌年)?\s*(\d{1,2})月(\d{1,2})日")
    seen = set()
    for m in re_pool.finditer(text):
        pool_list, sm, sd, ny, em, ed = m.groups()
        # 池名單拆開（「訓練池、習泳池、跳水池」→ 每個池一條）
        for pool in re.split(r"[、，,]", pool_list):
            pool = pool.strip()
            if not pool or not pool.endswith(("池", "場")):
                continue
            k = (pool, sm, sd, em, ed)
            if k in seen:
                continue
            seen.add(k)
            maint.append({
                "pool": pool, "start": f"{sm}/{sd}", "end": f"{em}/{ed}",
                "nextYear": bool(ny),
            })
    # Bare date without pool name (e.g. ltswim: "11月1日至翌年3月31日" → whole facility)
    if not maint:
        m2 = re.search(r"(\d{1,2})月(\d{1,2})日\s*至\s*(翌年)?\s*(\d{1,2})月(\d{1,2})日", text)
        if m2:
            sm, sd, ny, em, ed = m2.groups()
            maint.append({"pool": "全場", "start": f"{sm}/{sd}", "end": f"{em}/{ed}", "nextYear": bool(ny)})
    return maint


def parse_cleaning(html):
    """每周大清潔: 逢星期X (公眾假期→星期Y)，限於大清潔行動段落"""
    # Search ALL occurrences — the first hit may be in schedule/sidebar fragments (e.g. ltswim)
    import re as _re2
    for m0 in _re2.finditer(r"每周大清潔行動", html):
        seg = html[m0.start():m0.start() + 1500]
        # Strip tags for robust matching — HTML inserts <span>/line breaks between 逢 and 星期
        stripped = re.sub(r"<[^>]+>", "", seg)
        stripped = re.sub(r"&nbsp;?", " ", stripped)
        stripped = re.sub(r"\s+", " ", stripped)
        m = _re2.search(r"逢\s*星期([一二三四五六日天])\s*(?:\(星期([一二三四五六日天])\s*[※*]?\s*\))?", stripped)
        if m:
            return {"day": m.group(1), "fallback": m.group(2) or ""}
    return None


def pool_data(swp_id):
    url_tc = f"https://www.lcsd.gov.hk/clpss/tc/webApp/Swimming.do?swpId={swp_id}"
    url_en = f"https://www.lcsd.gov.hk/clpss/en/webApp/Swimming.do?swpId={swp_id}"
    html_tc = fetch(url_tc)
    html_en = fetch(url_en)
    closures_tc = parse_closures(html_tc)
    closures_en = parse_closures_en(html_en)
    # Merge: match by (date, time) to add English fields
    en_map = {(c["date"], c["time"]): c for c in closures_en}
    for c in closures_tc:
        key = (c["date"], c["time"])
        if key in en_map:
            c["poolsEn"] = en_map[key]["pools"]
            c["reasonEn"] = en_map[key]["reason"]
            c["remarksEn"] = en_map[key].get("remarks", "")
        else:
            c["poolsEn"] = c["pools"]
            c["reasonEn"] = c["reason"]
            c["remarksEn"] = c.get("remarks", "")
    return {
        "closures": closures_tc,
        "maintenance": parse_maintenance(html_tc),
        "cleaning": parse_cleaning(html_tc),
    }


def patch_configs(all_data):
    # Patch LAST_UPDATE in common.js (shared across all pages)
    if os.path.exists(COMMON_JS):
        hkt = timezone(timedelta(hours=8))
        sync_time = datetime.now(hkt).strftime('%Y-%m-%d %H:%M')
        with open(COMMON_JS, encoding='utf-8') as f:
            cjs = f.read()
        cjs_new, n = re.subn(r"const LAST_UPDATE='[^']*'", f"const LAST_UPDATE='{sync_time}'", cjs)
        if n > 0:
            with open(COMMON_JS, 'w', encoding='utf-8') as f:
                f.write(cjs_new)
            print(f"Patched LAST_UPDATE in common.js ({sync_time})")
    # Patch closures/maintenance/cleaning in district config files
    for html_path in CONFIG_PATHS:
      if not os.path.exists(html_path):
        continue
      with open(html_path, encoding="utf-8") as f:
        html = f.read()
      patched_any = False
      for pool_id, data in all_data.items():
        start = html.find(f'id:"{pool_id}"')
        if start < 0:
          continue
        c_start = html.find("closures:", start)
        if c_start < 0:
          continue
        pos = c_start + len("closures:")
        ch = html[pos]
        depth, i = 1, pos + 1
        while depth > 0 and i < len(html):
          if html[i] == ch: depth += 1
          elif html[i] == ("]" if ch == "[" else "}"): depth -= 1
          i += 1
        # Extend i to swallow any stale duplicate maintenance/cleaning that accumulated from prior buggy runs
        # Look ahead for the next real delimiter: ,facilities: or ,schedule: or ,sessions:
        for delim in (",facilities:", ",schedule:", ",sessions:", ",status:", ",id:"):
            nxt = html.find(delim, i)
            if nxt != -1:
                # swallow everything (including duplicate maintenance/cleaning) up to delim
                # but keep the comma+delim itself
                dup_seg = html[i:nxt]
                # only swallow if it looks like duplicate maintenance/cleaning
                if "maintenance:" in dup_seg or "cleaning:" in dup_seg:
                    i = nxt  # keep the leading comma for flat+delim
                break
        flat = (
          "closures:" + json.dumps(data["closures"], ensure_ascii=False)
          + ",maintenance:" + json.dumps(data.get("maintenance", []), ensure_ascii=False)
          + ",cleaning:" + json.dumps(data.get("cleaning"), ensure_ascii=False)
        )
        html = html[:c_start] + flat + html[i:]
        patched_any = True
      if patched_any:
        with open(html_path, "w", encoding="utf-8") as f:
          f.write(html)
        print(f"Patched {os.path.basename(html_path)}")
    for pool_id, data in all_data.items():
      print(f"{pool_id}: {len(data['closures'])} 公告, {len(data['maintenance'])} 維修, 清潔日={data['cleaning']}")


def deploy():
    env = {**os.environ,
           "CLOUDFLARE_API_TOKEN": os.environ.get("CF_WORKERS_TOKEN", ""),
           "CLOUDFLARE_ACCOUNT_ID": os.environ.get("CF_ACCOUNT_ID", "")}
    r = subprocess.run(
        ["wrangler", "pages", "deploy", ".",
         "--project-name=we1co-sai-kung", "--branch=main", "--commit-dirty=true"],
        env=env,
        capture_output=True, text=True, timeout=120,
    )
    print(r.stdout[-600:] or r.stderr[-600:])
    if r.returncode != 0:
        print(f"WARN: wrangler deploy failed: {r.stderr[-300:]}", file=sys.stderr)



def fetch_holidays():
    """Fetch 1823.gov.hk holidays → ["YYYY/MM/DD", ...]. Stdlib, no deps."""
    try:
        req = urllib.request.Request(
            "https://www.1823.gov.hk/common/ical/en.json",
            headers={**UA}
        )
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read().decode('utf-8-sig'))
        vevents = data['vcalendar'][0]['vevent']
        dates = sorted(set(
            v['dtstart'][0][:4] + '/' + v['dtstart'][0][4:6] + '/' + v['dtstart'][0][6:8]
            for v in vevents
            if v['dtstart'][0][:4] >= str(date.today().year)
        ))
        return dates
    except Exception as e:
        print(f"fetch_holidays skip: {e}", file=sys.stderr)
        return None

def patch_holidays(days):
    if not days: return
    js = f"const HK_HOLIDAYS={json.dumps(days, ensure_ascii=False)};"
    for html_path in CONFIG_PATHS:
        if not os.path.exists(html_path): continue
        with open(html_path, encoding='utf-8') as f: html = f.read()
        # replace existing
        new, n = re.subn(r'const HK_HOLIDAYS=\[[^\]]*\];', js, html)
        if n == 0:
            # insert before FACILITIES
            for marker in ['const FACILITIES=[', 'const OTHER_FACILITIES=[', 'const PLAYROOMS=[']:
                idx = new.find(marker)
                if idx >= 0:
                    new = new[:idx] + js + "\n\n" + new[idx:]
                    break
        if n > 0 or 'const HK_HOLIDAYS=' in new:
            with open(html_path, 'w', encoding='utf-8') as f: f.write(new)
            print(f"HK_HOLIDAYS patched in {os.path.basename(html_path)} ({len(days)} dates)")

if __name__ == "__main__":
    try:
        all_data = {}
        for pid, swp in POOLS.items():
            all_data[pid] = pool_data(swp)
            if pid != list(POOLS.keys())[-1]:
                time.sleep(random.uniform(0.8, 2.5))
        patch_configs(all_data)
        if "--deploy" in sys.argv:
            deploy()
        print("PASS")
        # Refresh HK holidays (for cleaning fallback holiday check)
        hdays = fetch_holidays()
        if hdays: patch_holidays(hdays)
    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

