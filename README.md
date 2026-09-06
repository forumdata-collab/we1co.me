# we1co.me — 西貢 / 觀塘 即時康樂設施資訊

> 免費、無廣告、免安裝的社區儀表板，一站式查閱西貢區及觀塘區各類康樂設施運作狀況。

🌐 **Live sites:** [we1co.me](https://we1co.me/)（西貢）・ [we1co.me/kt](https://we1co.me/kt)（觀塘）

## 設施覆蓋

| 區域 | 設施 | 數量 | 數據源 | 更新頻率 |
|------|------|------|--------|----------|
| 🟢 西貢 | 🏊 泳池 | 2 所 | 康文署 LCSD | 每日 6 次 |
| | 🎮 兒童遊戲室 | 3 間 | 康文署（靜態場次表）| — |
| | 🏟️ 運動場 | 1 所（400m 跑道）| 康文署 XLSX | 每日 6 次 |
| | 📚 圖書館 | 2 間 | 康文署（靜態時間表）| — |
| | ♻️ 入樽機 | 8 部 | 環保署 EPD API | 每日 6 次 |
| 🔵 觀塘 | 🏊 泳池 | 3 所 | 康文署 LCSD | 每日 6 次 |
| | 🎮 兒童遊戲室 | 4 間 | 康文署（靜態場次表）| — |
| | 🏟️ 體育館 | 9 所 | 康文署（靜態時間表）| — |
| | 🎾 網球場 | 6 所 | 康文署（靜態時間表）| — |
| | 🚲 單車場 | 2 所 | 康文署（靜態時間表）| — |
| | ⚽ 足球場 | 2 所 | — | — |

## 功能

- **即時狀態**：營運中 / 即將開始 / 休館 / 已結束 / 部分開放 / 維修中 / 清潔中
- **「即將開始」1 小時 lead-time**：僅距離開場 ≤1 小時顯示「即將開始」，否則顯示「休館」
- **自動公告**：暫停開放（救生員不足、學校水運會等）、每年維修、每周大清潔日
- **預告暫停**：即使公告時段未到亦提前顯示，方便用戶規劃行程
- **天氣模組**：天文台即時氣溫、濕度及惡劣天氣警示（八號風球 / 黑雨）
- **三語切換**：繁體中文 / 簡體中文 / English
- **響應式設計**：手機、平板、電腦均可正常瀏覽

## 架構（2026-09-01 重構後）

```
we1co.me/
├── common.css              共用樣式
├── common.js               共用邏輯（i18n / parseRange / sessionStatus / renderPools / renderPlayrooms / renderAll）
├── districts/
│   ├── sk.js               西貢區數據 + 區專屬 renderers（renderLibraries / renderSportGround / renderRVM）
│   └── kt.js               觀塘區數據 + 區專屬 renderers（renderSportsCentres / renderTennisCourts / renderCyclingTracks）
├── index.html              西貢區頁面殼（~3KB）
├── kt.html                 觀塘區頁面殼（~4KB）
├── lcsd_closures.py        康文署泳池公告爬蟲 → patch districts/*.js + common.js → deploy
├── sport_ground_sync.py    康文署運動場 XLSX → sport_ground_status.json → deploy
├── rvm_sync.py             環保署 API → rvm_status.json → deploy
├── watchdog.sh             三個 sync log 監察 → Telegram 報警
├── guard.py                JS 語法檢查 + closure pool name alias 驗證
├── sanity_test.js          20 項功能測試
└── DEBUG.md                已知問題排查手冊
```

## 自動化

| 時間 | 腳本 | 用途 |
|------|------|------|
| 06:15/09:15/12:15/15:15/18:15/21:15 | `lcsd_closures.py --deploy` | 泳池公告 + bump `?v=` |
| 06:16/09:16/12:16/15:16/18:16/21:16 | `sport_ground_sync.py --deploy` | 運動場狀態 |
| 07:20–22:20（每小時）| `rvm_sync.py --deploy` | 入樽機即時狀態 |
| 08:00/11:00/14:00/17:00/20:00/23:00 | `we1co-watchdog`（Hermes cron）| 狀態監察 |

所有 deploy 透過 `wrangler pages deploy` 推送至 Cloudflare Pages。

## 本地開發

```bash
# JS 語法 + closure alias 驗證
python3 guard.py && node sanity_test.js

# 抓取公告（不部署）
python3 lcsd_closures.py

# 抓取運動場 XLSX（不部署）
python3 sport_ground_sync.py

# 抓取回收機狀態（不部署）
python3 rvm_sync.py

# 一次過：抓取 + 部署
python3 lcsd_closures.py --deploy
python3 sport_ground_sync.py --deploy
python3 rvm_sync.py --deploy
```

## 數據準確性

所有動態狀態均直接對接政府官方開放數據：

- **康文署 (LCSD)** — 泳池暫停開放公告、每年維修、大清潔日
- **康文署 (LCSD)** — 運動場 XLSX 時段表
- **環境保護署 (EPD)** — 逆向自動售賣機（入樽機）即時容量與運作狀態
- **香港天文台 (HKO)** — 即時天氣及警示

## 免責聲明

本網頁為非官方、非牟利社區工具，資料以官方來源為準。如發現資訊有誤，請以康文署/環保署官方公告為準。
