# we1co.me — 常见 bug 与 debug 指南

## 架构速览

| 文件 | 作用 | 被谁修改 |
|------|------|----------|
| `index.html` / `kt.html` | 瘦壳，引入 JS/CSS，含 `?v=<epoch>` cache-buster | `lcsd_closures.py --deploy`（bump ?v） |
| `common.js` | 共享逻辑（天气、i18n、renderPools、poolSubStatuses） | `lcsd_closures.py`（patch LAST_UPDATE） |
| `districts/sk.js` | 西贡区数据（泳池 closures/maintenance/cleaning/设施/假日） | `lcsd_closures.py --deploy` |
| `districts/kt.js` | 观塘区数据（同上） | `lcsd_closures.py --deploy` |
| `sport_ground_status.json` | 运动场状态 | `sport_ground_sync.py --deploy` |
| `rvm_status.json` | 回收机状态 | `rvm_sync.py --deploy` |

---

## Bug #1：cron deploy 了但用户看不到新数据

**症状**：stale watchdog 报告 warning；或者用户说"泳池全绿但其实有通告"。

**根因**：index.html 的 `?v=<epoch>` 是 2026-09-01 的旧值。浏览器 + CF edge 按 URL（含 query）缓存 JS/CSS，旧 ?v = 永远不更新。

**修复**（已在 lcsd_closures.py）：
- `HTML_PATHS = ["index.html", "kt.html"]`
- `patch_configs()` 里每次 deploy 自动 bump `?v=<epoch>`

**验证**：
```bash
grep -oE '\?v=[0-9]+' index.html
# 应显示最近几分钟的 epoch
```

---

## Bug #2：泳池状态显示全开，但 LCSD 官网说关了

**症状**：we1co.me 显示"营运中"，但 LCSD 官网显示某池暂停。

**排查步骤**：
```bash
# 1. 检查 sk.js 是否有该泳池的今日通告
curl -sL 'https://we1co.me/districts/sk.js' | python3 -c "
import sys, re, json
js = sys.stdin.read()
m = re.search(r'id:\"tkoswim\".*?closures:(\[.*?\]),maintenance:', js, re.S)
closures = json.loads(m.group(1))
for c in closures:
    if c['date'] == '2026/09/05':
        print(c['time'], '|', c['pools'], '|', c['reason'])
"

# 2. 检查 common.js 的 poolSubStatuses 是否能匹配
# 常见原因：pool 名不匹配（见 Bug #3）

# 3. 检查浏览器是否用了旧 JS（看 ?v= 值）
curl -sL 'https://we1co.me/' | grep -oE '\?v=[0-9]+'
```

---

## Bug #3：closure pool 名不匹配 facility 名

**症状**：stale watchdog 报告 `"closure pool 'X' 唔 match 任何 facility 名"`。

**原因**：LCSD 官方用「嬉水池 (2)」，we1co 用「嬉水池 2&3」。alias map 要同步改两处。

**修复**（两处都要改，保持一致）：
```python
# guard.py — ALIAS_MAP
ALIAS_MAP = {
    'jvswim': {
        '嬉水池 (2)': ['嬉水池 2&3'],
        '嬉水池 (3)': ['嬉水池 2&3'],
        '嬉水池 (4)': ['嬉水池 4'],  # ← 加这行
    },
}
```
```js
// common.js — poolSubStatuses
const alias = f.id === 'jvswim'
  ? {'嬉水池 (2)':['嬉水池 2&3'], '嬉水池 (3)':['嬉水池 2&3'], '嬉水池 (4)':['嬉水池 4']}
  : {};
```

**验证**：
```bash
cd ~/we1co.me && python3 guard.py && node sanity_test.js
```

**流程**：改两文件 → `guard.py` PASS → `lcsd_closures.py --deploy` → 验证 live。

---

## Bug #4：sport_ground_sync / rvm_sync deploy 了但 stale

**症状**：watchdog 报 `sport_ground_sync.log: stale` 或 `rvm_sync.log: stale`。

**根因**：这些脚本调 `wrangler pages deploy`，但不 patch HTML。只要 lcsd_closures.py 之前 bump 了 ?v=，后续 deploy 自然包含新 HTML。stale 说明上一次 deploy 失败了。

**排查**：
```bash
tail -20 ~/we1co.me/sport_ground_sync.log
tail -20 ~/we1co.me/rvm_sync.log
# 看最后一条 PASS/FAIL
```

---

## Bug #5：watchdog 06:00 误报所有泳池 stale

**症状**：凌晨 6 点 watchdog 报三个 log 都 stale 7-8 小时。

**根因**：watchdog 06:00 跑，但 lcsd/sport 第一轮 sync 在 06:15/06:16。06:00 时日志还是前一天 21:xx 的（>4h stale 阈值）。

**修复**：watchdog 排程改到 `0 8,11,14,17,20,23`（08:00 后所有 morning sync 已跑完）。

---

## Bug #6：wrangler deploy 报 403 / 422

**排查**：
```bash
# 检查 env
grep -E "CF_WORKERS_TOKEN|CF_ACCOUNT_ID" ~/.hermes/.env | head -2

# 正确的 export 方式（cron 必须）
export $(grep -E "^(CF_WORKERS_TOKEN|CF_ACCOUNT_ID)=" ~/.hermes/.env | xargs)
export CLOUDFLARE_API_TOKEN="$CF_WORKERS_TOKEN"
export CLOUDFLARE_ACCOUNT_ID="$CF_ACCOUNT_ID"

# 检查 wrangler 版本
which wrangler && wrangler --version
```

---

## Bug #7：lcsd_closures.py wrangler 找不到

**根因**：cron 环境 PATH 缺少 `~/.npm-global/bin`。

**cron 正确格式**：
```bash
PATH=/home/ubuntu/.npm-global/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

---

## 部署 checklist

每次修改 JS/JS 都要：
1. 改完 `guard.py` 先验语法：`python3 guard.py && node sanity_test.js`
2. 部署：`lcsd_closures.py --deploy`（自动 bump ?v= + deploy）
3. 验证 live：`curl -sL 'https://we1co.me/' | grep -oE 'v=[0-9]+'`

---

## crontab 一览（2026-09-05 更新）

| 时间 | 脚本 | 用途 |
|------|------|------|
| 15 6,9,12,13,14,15,18,19,21 | `lcsd_closures.py --deploy` | 泳池通告 + bump ?v= |
| 0 14 | `lcsd_closures.py --deploy` | 14:00 通告更新（用户要求） |
| 45 12,13,14 | `lcsd_closures.py --deploy` | 额外泳池通告 |
| 16 6,9,12,15,18,19,21 + 46 12 + 45 6 | `sport_ground_sync.py --deploy` | 运动场状态 |
| 20 7-22 | `rvm_sync.py --deploy` | 回收机状态 |
| 0 8,11,14,17,20,23 | `we1co-watchdog`（Hermes cron） | 状态检查 |
