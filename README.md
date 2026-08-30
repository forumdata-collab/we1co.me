# we1co.me — 西貢區康樂設施即時資訊整合網頁

> 免費、無廣告、免安裝的社區儀表板，一站式查閱西貢區四大民生設施運作狀況。

🌐 **Live site:** https://we1co.me/

## 功能

| 設施 | 數量 | 數據源 | 更新頻率 |
|------|------|--------|----------|
| 🏊 公眾游泳池 | 2 所（將軍澳/觀塘） | 康文署開放數據 | 每日 6 次（06:15/09:15/12:15/15:15/18:15/21:15） |
| 🎮 兒童遊戲室 | 3 間 | 康文署（靜態場次表） | — |
| 📚 公共圖書館 | 2 間 | 康文署（靜態開放時間） | — |
| ♻️ 塑膠樽回收機 | 8 部 | 環保署 EPD API | 每日 6 次（同上） |

- 即時顯示開放/即將開始/已結束/暫停/維修狀態
- 自動標記暫停開放公告（救生員不足、學校水運會等）、每年維修工程、每周大清潔日
- 天氣模組：香港天文台即時氣溫、濕度及惡劣天氣警示（八號風球/黑雨）
- 繁體中文 / 簡體中文 / English 三語切換
- 手機、平板、電腦響應式設計
- 分享按鈕（原生 Web Share / 複製連結）

## 架構

```
we1co.me/
├── index.html          單檔前端（無框架、無 build step）
├── lcsd_closures.py    康文署泳池公告爬蟲 → patch index.html → deploy
├── rvm_sync.py         環保署回收機 API → rvm_status.json → deploy
├── rvm_status.json     回收機即時狀態（由 rvm_sync.py 生成）
└── .gitignore
```

## 自動化

- **Cron (system):** `15 6,9,12,15,18,21 * * *` 執行 `lcsd_closures.py --deploy`
- **Cron (Hermes):** 同上時段執行 `rvm_sync.py`
- 兩者均透過 `wrangler pages deploy` 推送至 Cloudflare Pages

## 本地開發

```bash
# 抓取康文署公告並寫入 index.html（不部署）
python3 lcsd_closures.py

# 抓取環保署回收機狀態（不部署）
python3 rvm_sync.py

# 部署到 Cloudflare Pages
python3 lcsd_closures.py --deploy
python3 rvm_sync.py --deploy
```

## 數據準確性

所有動態狀態均直接對接政府官方開放數據：
- **康文署 (LCSD)** — 泳池暫停開放公告、每年維修、大清潔日
- **環境保護署 (EPD)** — 逆向自動售賣機（入樽機）即時容量與運作狀態
- **香港天文台 (HKO)** — 即時天氣及警示

## 免責聲明

本網頁為非官方、非牟利社區工具，資料以官方來源為準。如發現資訊有誤，請以康文署/環保署官方公告為準。
