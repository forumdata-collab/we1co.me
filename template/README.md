# we1co — 康體設施即時狀態 · 香港各區復用模版

## 一頁看明 — 由通知到渲染

```
LCSD 官網 (swpId/HTML)  +  LCSD XLSX (sport ground)  +  EPD RVM API
          │                        │                       │
      lcsd_closures.py       sport_ground_sync.py       rvm_sync.py
          │   (CF Proxy 600s cache)   │                (ALBA EPD)
          └──────────┬────────────────┘
         patch_html() 寫入 district.json / sport_ground_status.json / rvm_status.json
                     │
              wrangler pages deploy → Cloudflare Pages
                     │
          index.html (單檔 JS) fetch *.json → renderAll()
                     │
          游泳池·運動場·遊戲室·圖書館·回收機 + 天氣/語言/索引/收合
```

## 核心邏輯（必抄）

* **游泳池**：`parse_closures()` 抓 `日期 時間 | 受影響池/設施 | 原因 | 備註`，`parse_maintenance()` 抓「配合每年維修→M月D日…翌年」區段，`parse_cleaning()` 抓「每周大清潔 逢星期X」。前端 `poolSubStatuses()` 合併 `closures + maintenance + cleaning` 推出 `營運中/部分開放/暫停開放`，時間窗 `06:30-14:15` 只在範圍內閉池。
* **運動場**：`sport_ground_sync.py` 經 CF Proxy 拉 XLSX（`1060_YYYYMM.xlsx`，月頭 fallback 上月），`openpyxl` 解析 `A=開放 L=部分線道 B=預訂 M=關閉` 三 sheet（主場/副場/公告），寫 `sport_ground_status.json`。前端 time×venue 網格，縱軸時間、橫軸主場/副場。
* **RVM**：`rvm_sync.py` POST `albarvm.teamnote.work/api/rvm/` 過濾 `OUR_NAMES`，`cat ∈ {operating,nearly_full,full,maintenance}`。
* **前端通用**：`I18N / NAME_L10N / SUB_L10N + tl()/t()/lname()/addr()` 三語；`index-grid + collapsible + back-to-top + top-bar 天氣`；`setInterval(renderAll,60000) + loadRVM()/loadSportGround()`；`renderPools()/renderSportGround()/renderPlayrooms()/renderLibraries()/renderRVM()`。

## 一區一配置 — 10 分鐘新區部署

1. 複製 `template/district.yaml`，改 `district / domain / pools.swpId / sport_grounds.fid / rvm.filter`。
2. 複製 `template/scraper_skeleton.py`（= `lcsd_closures.py` 泛化版）並重命名 `FID→district`。
3. 跑 `python3 scraper.py --deploy`（會同時寫 `index.html` + `kt.html` 雙頁）。
4. 加 cron：`crontab -e` 補 `20 6,9,12,15,18,21 * * * rvm_sync.py --deploy`、`25 ... sport_ground_sync.py --deploy`（與 `lcsd_closures` 錯峰 5 分防 burst WAF），`@reboot` 起 Hermes gateway 令 system+Hermes 雙 cron 同活。

## 本 repo 已落地

* `index.html` — 西貢主頁（泳池 + 運動場 + 遊戲室 + 圖書館 + RVM + 天氣/語言/索引/收合/X分鐘前）
* `kt.html` — 觀塘對照頁（同模板，分頻 6×/day）
* `lcsd-proxy/` — CF Worker 600s cache + `x-proxy-token` 鎖，VM IP 從此 Anycast 隱身
* `rvm_sync.py / sport_ground_sync.py / lcsd_closures.py` — 三 scraper，`HTML_PATHS` 雙頁同步 `patch_html()`，失敗 fallback 直連
* `crontab` — `15/20/25 6,9,12,15,18,21` 三檔錯峰；`sport_ground_status.json`、`rvm_status.json` 實時寫入

`skipped: 獨立後端/DB/地圖 (單檔 JSON+Pages 已夠, add when 區數>10 或需搜尋/地圖時再上)`
