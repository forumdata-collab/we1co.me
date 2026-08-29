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
from datetime import date

POOLS = {"tkoswim": 35, "ktswim": 18}
HTML_PATH = "/home/ubuntu/we1co.me/index.html"
UA = {"User-Agent": "Mozilla/5.0 (compatible; LCSD-closure-bot/1.0)"}


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="ignore")


def parse_closures(html):
    """暫停開放公告 (Chinese): 2026/08/29 06:30 - 2026/08/29 14:15 | 跳水池... | 救生員不足"""
    closures = []
    date_re = re.compile(
        r"(\d{4}/\d{2}/\d{2})\s+(\d{2}:\d{2})\s*-\s*\d{4}/\d{2}/\d{2}\s+(\d{2}:\d{2})"
    )
    for m in date_re.finditer(html):
        d, t_start, t_end = m.group(1), m.group(2), m.group(3)
        after = html[m.end():m.end() + 600]
        pools_match = re.search(r"<td>\s*([^<]{2,60}(?:池|場|台|看台)[^<]*)</td>", after)
        # 原因：pools td 之後嘅下一個非空 td（唔限關鍵詞，如「游泳比賽」「學校水運會」）
        reason = ""
        if pools_match:
            after_pools = after[pools_match.end():]
            reason_match = re.search(r"<td>\s*([^<]{2,40}?)\s*</td>", after_pools)
            if reason_match:
                reason = reason_match.group(1).strip()
        if pools_match:
            pools = pools_match.group(1).strip().strip(",，")
            closures.append({
                "date": d,
                "time": f"{t_start} - {t_end}",
                "pools": pools,
                "reason": reason or "公告",
            })
    today = date.today().strftime("%Y/%m/%d")
    return [c for c in closures if c["date"] >= today]
def parse_closures_en(html):
    """English closures: same date format, English pool names and reasons"""
    closures = []
    date_re = re.compile(
        r"(\d{4}/\d{2}/\d{2})\s+(\d{2}:\d{2})\s*-\s*\d{4}/\d{2}/\d{2}\s+(\d{2}:\d{2})"
    )
    for m in date_re.finditer(html):
        d, t_start, t_end = m.group(1), m.group(2), m.group(3)
        after = html[m.end():m.end() + 600]
        pools_match = re.search(
            r"<td>\s*([^<]{2,60}(?:pool|stand|area|slide)[^<]*)</td>",
            after, re.IGNORECASE,
        )
        reason = ""
        if pools_match:
            after_pools = after[pools_match.end():]
            reason_match = re.search(r"<td>\s*([^<]{2,40}?)\s*</td>", after_pools)
            if reason_match:
                reason = reason_match.group(1).strip()
        if pools_match:
            pools = pools_match.group(1).strip().strip(",，")
            closures.append({
                "date": d,
                "time": f"{t_start} - {t_end}",
                "pools": pools,
                "reason": reason or "Notice",
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
    re_pool = re.compile(r"([\u4e00-\u9fff、，, ]+(?:池|場))\s*[：:]\s*(\d{1,2})月(\d{1,2})日\s*至\s*(翌年)?\s*(\d{1,2})月(\d{1,2})日")
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
    return maint


def parse_cleaning(html):
    """每周大清潔: 逢星期X (公眾假期→星期Y)，限於大清潔行動段落"""
    start = html.find("每周大清潔行動")
    if start < 0:
        return None
    seg = html[start:start + 1500]
    m = re.search(r"逢\s*星期([一二三四五六日天])\s*(?:\(星期([一二三四五六日天])\s*\*?\))?", seg)
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
        else:
            c["poolsEn"] = c["pools"]
            c["reasonEn"] = c["reason"]
    return {
        "closures": closures_tc,
        "maintenance": parse_maintenance(html_tc),
        "cleaning": parse_cleaning(html_tc),
    }


def patch_html(all_data):
    with open(HTML_PATH, encoding="utf-8") as f:
        html = f.read()
    for pool_id, data in all_data.items():
        start = html.find(f'id:"{pool_id}"')
        if start < 0:
            raise RuntimeError(f"找不到 {pool_id} 的資料區塊")
        c_start = html.find("closures:", start)
        if c_start < 0:
            raise RuntimeError(f"找不到 {pool_id} 的 closures")
        # 讀取完整 JSON 值（[ ] 或 { } 開頭），容忍雙重包裝
        pos = c_start + len("closures:")
        ch = html[pos]
        depth, i = 1, pos + 1
        while depth > 0 and i < len(html):
            if html[i] == ch: depth += 1
            elif html[i] == ("]" if ch == "[" else "}"): depth -= 1
            i += 1
        # 扁平化：closures:[...],maintenance:[...],cleaning:{...}
        flat = (
            "closures:" + json.dumps(data["closures"], ensure_ascii=False)
            + ",maintenance:" + json.dumps(data.get("maintenance", []), ensure_ascii=False)
            + ",cleaning:" + json.dumps(data.get("cleaning"), ensure_ascii=False)
        )
        html = html[:c_start] + flat + html[i:]
    with open(HTML_PATH, "w", encoding="utf-8") as f:
        f.write(html)
    for pool_id, data in all_data.items():
        print(f"{pool_id}: {len(data['closures'])} 公告, {len(data['maintenance'])} 維修, 清潔日={data['cleaning']}")


def deploy():
    env = {
        "CLOUDFLARE_API_TOKEN": subprocess.check_output(
            ["bash", "-lc", "echo -n $CF_WORKERS_TOKEN"]).decode(),
        "CLOUDFLARE_ACCOUNT_ID": subprocess.check_output(
            ["bash", "-lc", "echo -n $CF_ACCOUNT_ID"]).decode(),
    }
    r = subprocess.run(
        ["wrangler", "pages", "deploy", "/home/ubuntu/we1co.me",
         "--project-name=we1co-sai-kung", "--branch=main"],
        env={**os.environ, **env},
        capture_output=True, text=True, timeout=120,
    )
    print(r.stdout[-600:] or r.stderr[-600:])


if __name__ == "__main__":
    try:
        all_data = {pid: pool_data(swp) for pid, swp in POOLS.items()}
        patch_html(all_data)
        if "--deploy" in sys.argv:
            deploy()
        print("PASS")
    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
