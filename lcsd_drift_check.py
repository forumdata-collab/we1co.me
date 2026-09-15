#!/usr/bin/env python3
"""LCSD 兩周巡查：抓官網 playroom/sport centre 頁面，對比本地 sk.js/kt.js 數據。
發現 sessions/note/closure 變動 → Telegram 通知（不自動改數據，避免誤覆蓋）。
Usage: python3 lcsd_drift_check.py [--notify]
"""
import re, json, os, sys, urllib.request, urllib.parse
from datetime import datetime, timezone, timedelta

sys.path.insert(0, '/home/ubuntu/we1co.me')
import lcsd_closures as lc

# 要巡查的設施頁（ftid=15 兒童遊戲室；ftid=2 體育館主頁）
FACILITY_PAGES = {
    "sk": {
        "playrooms": lc.PLAYROOM_DISTRICTS["sk"]["tc"],
        # 西貢區體育館列表頁（did=8）
        "sport_centres": "https://www.lcsd.gov.hk/clpss/tc/webApp/Facility/SearchResult.do?ftid=2&did=8",
    },
}

CONFIG_FILES = {
    "sk": "/home/ubuntu/we1co.me/districts/sk.js",
    "kt": "/home/ubuntu/we1co.me/districts/kt.js",
}

TG_NOTIFY_URL = None  # set below from env/file


def load_tg_token():
    global TG_NOTIFY_URL
    tok = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat = os.environ.get("TELEGRAM_CHAT_ID", "6709930151")
    if not tok:
        for p in ["/home/ubuntu/.config/telegram_bot_token", "/tmp/tg_bot_token.txt"]:
            try:
                with open(p) as f:
                    tok = f.read().strip()
                if tok:
                    break
            except Exception:
                pass
    if tok:
        TG_NOTIFY_URL = f"https://api.telegram.org/bot{tok}/sendMessage"
        return chat
    return None


def notify(msg):
    if not TG_NOTIFY_URL:
        print(f"[NOTIFY-SKIP] {msg}")
        return
    chat = load_tg_token() or "6709930151"
    # Telegram has 4096 char limit; truncate and escape
    if len(msg) > 4000:
        msg = msg[:3950] + "…（已截斷）"
    # Escape markdown special chars that cause 400
    for ch in ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']:
        msg = msg.replace(ch, f'\\{ch}')
    payload = json.dumps({"chat_id": chat, "text": msg, "parse_mode": "MarkdownV2"}).encode()
    req = urllib.request.Request(
        TG_NOTIFY_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            r.read()
        print(f"[NOTIFY-OK] {msg[:80]}")
    except Exception as e:
        print(f"[NOTIFY-FAIL] {e}: {msg[:120]}", file=sys.stderr)


def extract_playroom_sessions(html):
    """從 LCSD playroom 頁提取 {name: {sessions:[...], note:...}}
    只取第一組標準時段（公眾假期之前），匹配 sk.js 存儲格式"""
    out = {}
    clean = re.sub(r'<[^>]+>', ' ', html)
    clean = re.sub(r'&(?:nbsp|amp|quot|rsquo|lsquo|gt|lt|#\d+);', ' ', clean)
    clean = re.sub(r'\s+', ' ', clean)
    # 每個場地以「場地名稱」開頭
    blocks = re.split(r'場地名稱\s*', clean)
    for b in blocks[1:]:
        name_m = re.match(r'([\u4e00-\u9fff]{2,12})\s+(?:地址|遊戲室主題)', b)
        if not name_m:
            continue
        short = name_m.group(1).strip()
        name = short + '兒童遊戲室'
        
        # 只取第一組 sessions（到第一個「公眾假期」或「備註」為止）
        # 忽略後續的週末/假期時段
        main_section = re.split(r'公眾假期|備註[：:]', b)[0]
        
        sess = []
        for sm in re.finditer(r'(早上|中午|下午|晚上)\s*(\d{1,2})時(?:正)?(?:(\d+)分)?(?:至|到|-)(\d{1,2})時(?:正)?(?:(\d+)分)?', main_section):
            period, sh, sm_min, eh, em_min = sm.group(1), int(sm.group(2)), sm.group(3), int(sm.group(4)), sm.group(5)
            start = f"{sh:02d}:{sm_min or '00'}"
            end = f"{eh:02d}:{em_min or '00'}"
            sess.append(f"{period} {start} - {end}")
        
        # Note: 取第一個備註
        note_m = re.search(r'備註[：:]\s*(.*?)(?=查詢電話|$)', b, re.S)
        note = note_m.group(1).strip()[:200] if note_m else ""
        out[name] = {"sessions": sess, "note": note}
    return out


def load_local_playrooms(config_path):
    """從 sk.js/kt.js 讀 PLAYROOMS array（JS object keys 未加引號，需預處理）"""
    js = open(config_path, encoding='utf-8').read()
    m = re.search(r'const PLAYROOMS=(\[.*?\]);', js, re.S)
    if not m:
        return {}
    raw = m.group(1)
    # Quote unquoted JS keys so json.loads can parse
    fixed = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)', r'\1"\2"\3', raw)
    try:
        arr = json.loads(fixed)
    except Exception as e:
        print(f"WARN: PLAYROOMS JSON parse fail in {config_path}: {e}", file=sys.stderr)
        return {}
    return {p["name"]: {"sessions": p.get("sessions", []), "note": p.get("note", "")} for p in arr}


def normalize_sessions(sessions):
    """Convert session strings to sorted (startMin, endMin) pairs — kills padding/12h-vs-24h false positives."""
    out = []
    for s in sessions:
        m = re.match(r'(早上|中午|下午|晚上|傍晚)?\s*(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})', s)
        if not m:
            continue
        period, sh, sm, eh, em = m.group(1), int(m.group(2)), int(m.group(3)), int(m.group(4)), int(m.group(5))
        if period in ('下午', '晚上', '傍晚') and sh < 12:
            sh += 12
        if period in ('下午', '晚上', '傍晚') and eh < 12:
            eh += 12
        out.append((sh * 60 + sm, eh * 60 + em))
    return sorted(set(out))


def normalize_note(note):
    """Extract a canonical maintenance key from either note format.
    Strips the closure paragraph (handled separately by PLAYROOM_CLOSURES)
    and normalizes 中文數字/上午下午 long-form to the compact form."""
    if not note:
        return ""
    # Drop closure announcement paragraphs (synced by lcsd_closures.py separately)
    note = re.split(r'(將於二零|will be temporarily|暫時關閉)', note)[0]
    # Format A (compact): 保養日(每月第二及第四個星期二 07:00-13:00)首節改 13:30
    m = re.search(r'保養日\(每月(.+?)及(.+?)個(.+?)\s*([0-9]+):([0-9]+)[-–]([0-9]+):([0-9]+)\)首節改\s*([0-9]+):([0-9]+)', note)
    if m:
        wd = re.sub(r'^星期', '', m.group(3))
        return f"maint|{m.group(1)}|{m.group(2)}|{wd}|{m.group(6)}:{m.group(7)}|{m.group(8)}:{m.group(9)}"
    # Format C (long-form official): 定期保養日(每月第二及第四個星期二上午7時至下午1時)的首節開放時間為下午1時30分
    cn = {'零': '零', '一': '一', '二': '二', '三': '三', '四': '四', '五': '五', '六': '六', '七': '七',
          '八': '八', '九': '九', '十': '十', '十一': '十一', '十二': '十二', '1': '一', '2': '二', '3': '三', '4': '四'}
    m = re.search(r'保養日\(每月(.+?)及(.+?)個星期(.+?)(上午|下午)?(\d{1,2})時(?:(\d+)分)?至(上午|下午)?(\d{1,2})時(?:(\d+)分)?\)的首節開放時間為(上午|下午)?(\d{1,2})時(?:(\d+)分)?', note)
    if m:
        def to24(p, h):
            h = int(h)
            return (h + 12) if p == '下午' and h < 12 else h
        winS = to24(m.group(4), m.group(5)) * 60 + int(m.group(6) or 0)
        winE = to24(m.group(7), m.group(8)) * 60 + int(m.group(9) or 0)
        shift = to24(m.group(10), m.group(11)) * 60 + int(m.group(12) or 0)
        wd = re.sub(r'^星期', '', m.group(3))
        return f"maint|{m.group(1)}|{m.group(2)}|{wd}|{winE//60:02d}:{winE%60:02d}|{shift//60:02d}:{shift%60:02d}"
    # Unrecognized — compare raw (trimmed), still better than nothing
    return re.sub(r'\s+', '', note)[:80]


def diff_playrooms(remote, local):
    changes = []
    for name, rdata in remote.items():
        if name not in local:
            changes.append(f"🆕 新場地: {name}")
            continue
        ldata = local[name]
        if normalize_sessions(rdata["sessions"]) != normalize_sessions(ldata["sessions"]):
            changes.append(f"⏰ *{name}* 時段變動\n  官網: {len(rdata['sessions'])}節\n  本站: {len(ldata['sessions'])}節")
        rn, ln = normalize_note(rdata["note"]), normalize_note(ldata["note"])
        if rn and rn != ln:
            changes.append(f"📝 *{name}* 備註變動\n  官網: {rdata['note'][:60]}…")
    for name in local:
        if name not in remote:
            changes.append(f"❌ 官網已移除: {name}")
    return changes


def main():
    chat = load_tg_token()
    all_changes = []
    for dist, pages in FACILITY_PAGES.items():
        cfg = CONFIG_FILES.get(dist)
        if not cfg or not os.path.exists(cfg):
            continue
        # Playrooms
        try:
            html = lc.fetch(pages["playrooms"])
            remote_pr = extract_playroom_sessions(html)
            local_pr = load_local_playrooms(cfg)
            ch = diff_playrooms(remote_pr, local_pr)
            if ch:
                all_changes.append(f"*{dist.upper()} 兒童遊戲室*")
                all_changes.extend(ch)
        except Exception as e:
            all_changes.append(f"⚠️ {dist} playroom fetch fail: {e}")

    if all_changes:
        msg = "🔍 *LCSD 兩周巡查發現變動*\n\n" + "\n".join(all_changes)
        msg += "\n\n請檢查並手動更新 districts/*.js"
        notify(msg)
        print(f"DRIFT DETECTED: {len(all_changes)} items")
    else:
        print("NO DRIFT")


if __name__ == "__main__":
    main()
