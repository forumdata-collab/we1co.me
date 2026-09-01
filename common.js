// common.js — 共用邏輯：天氣模組 + i18n utils + render 函數 + init
// 依賴: window.DISTRICT + I18N/NAME_L10N/SUB_L10N/HK_HOLIDAYS（由 districts/<區>.js 提供，須先載入）


// 天氣模組 — HKO 官方 Open Data API (CORS enabled)
let severeWarnings=[]; // 八號風球以上 / 黑雨 — 庫館用 (zh)
let severeWarningsEn=[]; // (en)
let thunderWarnings=[]; // 雷暴警告 — 泳池用 (zh)
let thunderWarningsEn=[]; // (en)
var currentLang=window.currentLang||'zh';
function wWarn(){ // 按 currentLang 揀警告
  return currentLang==='en'?{severe:severeWarningsEn,thunder:thunderWarningsEn}:{severe:severeWarnings,thunder:thunderWarnings};
}
(function(){
  const API='https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc';
  const WARN_API_TC='https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=tc';
  const WARN_API_EN='https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=en';
  const ICON_BASE='https://d28gfsrd1pujc.cloudfront.net/frontend_images/mod_sp_weather/images/';
  // warnsum API: {CODE:{name, code, actionCode, type, issueTime, updateTime}}
  // Only ACTIVE warnings returned; type is already bilingual human-readable.
  function parseWarnings(wd){
    const severe=[], thunder=[];
    for(const k in (wd||{})){
      const w=wd[k]; if(!w) continue;
      if(w.actionCode==='CANCEL') continue; // 已取消
      const label=w.type||w.name||k;
      if(k==='WTS') thunder.push(label);    // 雷暴警告 → 泳池用
      else severe.push(label);              // 其餘（T1-T10、暴雨、酷熱等）→ severe
    }
    return {severe, thunder};
  }
  function renderTopWeather(icon,t,h){
    const el=document.getElementById('topWeather');
    if(!el) return;
    const w=wWarn();
    let warnHtml='';
    // 嚴重警告（T8/9/10、黑雨）→ 黃色醒目 badge；其他 → 紅色
    const critical=w.severe.filter(s=>/八號|九號|十號|黑色暴雨|Signal No\. [89]|Black Rainstorm/.test(s));
    const normal=w.severe.filter(s=>!critical.includes(s));
    if(critical.length){
      warnHtml+=`<span style="margin-left:8px;display:inline-flex;align-items:center;gap:3px;background:#facc15;color:#713f12;padding:2px 8px;border-radius:4px;font-size:.65rem;font-weight:700;border:1px solid #eab308">⚠ ${critical.join('、')}</span>`;
    }
    if(normal.length){
      warnHtml+=`<span style="margin-left:8px;color:#fecaca;background:#991b1b;padding:1px 6px;border-radius:4px;font-size:.6rem;font-weight:600">⚠ ${normal.join('、')}</span>`;
    }
    if(w.thunder.length){
      warnHtml+=`<span style="margin-left:8px;display:inline-flex;align-items:center;gap:3px;background:#facc15;color:#713f12;padding:2px 8px;border-radius:4px;font-size:.65rem;font-weight:700;border:1px solid #eab308"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg> ${w.thunder.join('、')}</span>`;
    }
    el.innerHTML=
      `<img src="${ICON_BASE}weather_${icon}.png" alt="" style="height:16px;vertical-align:middle;margin-right:4px">`+
      `<span style="font-weight:700">${t??'--'}°C</span>`+
      `<span style="opacity:.8;margin-left:6px">💧${h??'--'}%</span>`+
      warnHtml;
  }
  async function fetchWeather(){
    let icon='50', t='--', h='--';
    try{
      const r=await fetch(API);
      const d=await r.json();
      const temps=(d.temperature?.data)||[];
      const hums=(d.humidity?.data)||[];
      t=(temps.find(x=>x.place==='香港天文台')||temps[0]||{}).value ?? '--';
      h=(hums.find(x=>x.place==='香港天文台')||hums[0]||{}).value ?? '--';
      icon=(d.icon&&d.icon[0])||'50';
      renderTopWeather(icon,t,h);
    }catch(e){
      const el=document.getElementById('topWeather');
      if(el) el.textContent='天氣資料暫不可用';
    }
    // 惡劣天氣警示（黑雨 / 八號風球以上）— 庫館用 (雙語)
    try{
      const [w1,w2]=await Promise.all([fetch(WARN_API_TC),fetch(WARN_API_EN)]);
      const [wd1,wd2]=await Promise.all([w1.json(),w2.json()]);
      const r1=parseWarnings(wd1), r2=parseWarnings(wd2);
      severeWarnings=r1.severe;
      severeWarningsEn=r2.severe;
      thunderWarnings=r1.thunder;
      thunderWarningsEn=r2.thunder;
    }catch(e){ severeWarnings=[]; severeWarningsEn=[]; thunderWarnings=[]; thunderWarningsEn=[]; }
    // 警示載入後重繪右上角（T1 等信號）— reuse first fetch data
    renderTopWeather(icon,t,h);
    // 雷暴橫幅顯示/隱藏
    const banner=document.getElementById('thunderBanner');
    if(banner){
      const w=wWarn();
      if(w.thunder.length){
        banner.style.display='block';
        const suffix=currentLang==='en'?' — Pools may close':' — 泳池可能暫停開放';
        banner.innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg> ⛈ ${w.thunder.join('、')}${currentLang==='en'?' in effect':'生效中'}${suffix}`;
        // Defer height calc to next frame so browser finishes layout
        requestAnimationFrame(()=>{
          const _bh=banner.offsetHeight||32;
          document.querySelector('.nav-bar').style.top=_bh+'px';
          document.body.style.paddingTop=(_bh+24)+'px';
        });
      }else{
        banner.style.display='none';
        document.querySelector('.nav-bar').style.top='24px';
        document.body.style.paddingTop='80px';
      }
    }
  // 警示更新後重繪（district-agnostic，async 內執行避免 TDZ）
  if(typeof renderAll==='function') renderAll();
}
fetchWeather();
  setInterval(fetchWeather,600000); // 10分鐘更新（HKO rhrread 每10分鐘更新）
})();


var currentLang='zh';
const t=k=>I18N[currentLang][k]||I18N.zh[k]||k;
const lname=id=>(NAME_L10N[id]&&NAME_L10N[id][currentLang])||id;
const tl=(cat,k)=>{if(currentLang==='zh')return k;const m=SUB_L10N[cat];return (m&&m[k])||k;};
const LDAY={zh:["星期日","星期一","星期二","星期三","星期四","星期五","星期六","公眾假期"],en:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Public Holiday"],cn:["星期日","星期一","星期二","星期三","星期四","星期五","星期六","公众假期"]};
const LSESS={zh:["早上","中午","下午","晚上"],en:["AM","Noon","PM","PM"],cn:["早上","中午","下午","晚上"]};
function trSession(s,lang){
 // 翻譯時段前置詞："早上 9:00 - 9:45" → "9:00 - 9:45 AM"
 if(lang==='zh') return s;
 let m=s.match(/^(早上|中午|下午|晚上)\s*(.+)$/);
 if(!m) return s;
 let map={早上:'AM',中午:'12:00',下午:'PM',晚上:'PM'};
 let pre=map[m[1]]||'';
 return m[2]+(pre==='AM'||pre==='PM'?' '+pre:'');
}
function trDay(d,lang){
 if(lang==='zh') return d;
 let map={星期一:'Mon',星期二:'Tue',星期三:'Wed',星期四:'Thu',星期五:'Fri',星期六:'Sat',星期日:'Sun','公眾假期':'PH'};
 return map[d]||d;
}
// 地址：多語言 + Google Maps 連結
function addr(f){
 const zh=f.address||'';
 const en=f.addrEn||zh;
 const a=currentLang==='en'?en:(currentLang==='cn'?(f.addrCn||zh):zh);
 const q=encodeURIComponent(zh);
 return `<a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;border-bottom:1px dotted #94a3b8">${a} <small style="font-size:.6rem">📍</small></a>`;
}
function addrRVM(r){
 const q=encodeURIComponent(r.addr);
 const a=currentLang==='en'?(r.addrEn||r.addr):r.addr;
 return `<a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;border-bottom:1px dotted #94a3b8">${a}</a>`;
}

function hkNow(){return new Date()} // server already HKT, no +8h
function hkMinutes(d){return d.getHours()*60+d.getMinutes()}
// parseMaintNote: 保養日(每月第N及第M個星期X HH:MM-HH:MM)首節改 HH:MM
function parseMaintNote(note){
  const m=note.match(/保養日\(每月(.+?)及(.+?)個(.+?) ([0-9:]+)-([0-9:]+)\)首節改 ([0-9:]+)/);
  if(!m)return null;
  const ord={第一:1,第二:2,第三:3,第四:4};
  const wd={星期一:1,星期二:2,星期三:3,星期四:4,星期五:5,星期六:6,星期日:0};
  const toMin=s=>{const[h,mm]=s.split(':').map(Number);return h*60+mm;};
  return{weeks:[ord[m[1]],ord[m[2]]],weekday:wd[m[3]],winEnd:toMin(m[5]),shift:toMin(m[6])};
}
// isMaintDay: 今日係咪某個保養日（第N個星期X）？date預設今日
function isMaintDay(obj,date){
  if(!obj)return false;
  const d=date||new Date();
  if(d.getDay()!==obj.weekday)return false;
  const off=(obj.weekday-new Date(d.getFullYear(),d.getMonth(),1).getDay()+7)%7;
  const occ=1+Math.floor((d.getDate()-(1+off))/7);
  return obj.weeks.includes(occ);
}
// Reusable official-link button (replaces 3× duplicated template)
function officialLink(url,labelKey){return url?`<a href="${url}" target="_blank" rel="noopener" style="display:block;text-align:center;margin-top:12px;padding:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:.78rem;color:#1e3a8a;text-decoration:none">${t(labelKey)}</a>`:'';}
function parseRange(s){
// s like "早上 9:00 - 9:45" or "下午 12:30 - 13:15" or "24小時" or "06:30 - 12:00"
if(!s) return null;
if(s.includes("24小時")) return {start:0,end:1440}
let m=s.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
if(!m) return null;
let sh=parseInt(m[1]), sm=parseInt(m[2]), eh=parseInt(m[3]), em=parseInt(m[4]);
let isPM=s.includes("下午")||s.includes("晚上")||s.includes("傍晚")||s.includes("晚");
let isNoon=s.includes("中午");
if(isPM){
 if(sh!==12&&sh<12) sh+=12;
 if(eh!==12&&eh<12) eh+=12;
}else if(isNoon){
 if(sh===12) sh=12;
 if(eh<12) eh+=12;
}
let start=sh*60+sm, end=eh*60+em;
if(end<=start) end=1440; // 跨午夜：00:00 視為當日結束
return {start:start,end:end}
}
function sessionStatus(range, nowM){
if(!range) return {text:"—",cls:"done"};
if(nowM < range.start) return {text:t('soon'),cls:"soon"};
if(nowM >= range.start && nowM < range.end) return {text:t('open'),cls:"open"};
return {text:t('done'),cls:"done"};
}
function facilityOverallStatus(sessions, nowM){
let hasOpen=false, hasSoon=false;
for(let s of sessions){
 let r=parseRange(s);
 let st=sessionStatus(r, nowM);
 if(st.cls==="open") hasOpen=true;
 if(st.cls==="soon") hasSoon=true;
}
if(hasOpen) return {text:t('open'),cls:"status-open"};
if(hasSoon) return {text:t('soon'),cls:"status-upcoming"};
return {text:t('closed'),cls:"status-closed"};
}

function toggleCard(el){el.parentElement.classList.toggle('collapsed')}
function inMaintenance(m, now){
  const y=now.getFullYear();
  const [sm,sd]=m.start.split('/').map(Number);
  const [em,ed]=m.end.split('/').map(Number);
  const d=now.getDate(), mo=now.getMonth()+1;
  if(m.nextYear){
    // 跨年：11/1 至 4/15
    if(mo>sm || (mo===sm&&d>=sd) || mo<em || (mo===em&&d<=ed)) return true;
  }else{
    if(mo>sm||(mo===sm&&d>=sd)) { if(mo<em||(mo===em&&d<=ed)) return true; }
    else if(mo===em&&d<=ed) return true;
  }
  return false;
}
// 今日是否清潔日（含公眾假期 fallback：如清潔日撞正假期則改 fallback 日）
function isCleaningDay(cleaning, now){
  if(!cleaning||!cleaning.day) return false;
  const CN=['日','一','二','三','四','五','六'];
  const todayCN=CN[now.getDay()];
  if(todayCN===cleaning.day) return true;
  if(cleaning.fallback && todayCN===cleaning.fallback){
    const wd={一:1,二:2,三:3,四:4,五:5}[cleaning.day];
    if(wd==null) return false;
    const y=now.getFullYear(), m=now.getMonth();
    for(let d=1;d<=31;d++){
      const dt=new Date(y,m,d);
      if(dt.getMonth()!==m) break;
      if(dt.getDay()===wd){
        const ds=`${y}/${String(m+1).padStart(2,'0')}/${String(d).padStart(2,'0')}`;
        if(typeof HK_HOLIDAYS!=='undefined' && HK_HOLIDAYS.includes(ds)) return true;
      }
    }
  }
  return false;
}

// 從閉館公告 + 每年維修 + 清潔日 自動推導子設施狀態
function poolSubStatuses(f, todayStr, now){
  let closedSet=new Set();
  let reasonMap={};
  const nm=hkMinutes(now);
  if(f.closures){
    f.closures.filter(c=>c.date===todayStr).forEach(c=>{
      // 公告有時間範圍：只要公告未完結（end > now），即使未開始都預告暫停
      const r=parseRange(c.time);
      if(r && nm<r.end){
        const reason=currentLang==='en'?(c.reasonEn||c.reason):c.reason;
        c.pools.split(/[,，]/).map(s=>s.trim()).forEach(p=>{
          closedSet.add(p);
          reasonMap[p]=reason;
        });
      }
    });
  }
  // 每年維修
  if(f.maintenance){
    const alias=f.id==='ktswim'?{'戶外泳池':['副池','日光浴場'],'室內泳池':['主池','訓練池','習泳池 1&2']}:{};
    // ltswim/jvswim 全場維修 (kt.html)
    if(f.id==='ltswim'||f.id==='jvswim') alias['全場']=f.facilities?f.facilities.map(x=>x.name):[];
    f.maintenance.forEach(m=>{
      if(inMaintenance(m,now)){
        const targets=alias[m.pool]||[m.pool];
        targets.forEach(p=>closedSet.add(p));
      }
    });
  }
  // 每周大清潔：10:00 至第二節結束 → 全場關閉（第三節重開）
  let cleaningActive=false;
  if(f.cleaning && isCleaningDay(f.cleaning, now)){
    const CLEAN_START=10*60;
    let cleanEnd=18*60;
    if(f.schedule && f.schedule.summer && f.schedule.summer[1]){
      const r2=parseRange(f.schedule.summer[1].time);
      if(r2) cleanEnd=r2.end;
    }
    if(nm>=CLEAN_START && nm<cleanEnd){
      (f.facilities||[]).forEach(x=>closedSet.add(x.name));
      cleaningActive=true;
    }
  }
  return f.facilities.map(x=>{
    if(closedSet.has(x.name)){
      return {...x, status:'closed', note:reasonMap[x.name]?`${t('closureReason')} ${reasonMap[x.name]}`:(cleaningActive?t('cleaningNote'):t('closedNote'))};
    }
    return x;
  });
}

// Reusable official-link button (replaces 3× duplicated template)

// 時段 shape 統一：index 用 schedule.summer 物件陣列，kt 用 sessions 字串陣列
function sessList(f){return f.sessions||(f.schedule&&f.schedule.summer)||[];}
function sessTime(s){return typeof s==='string'?s:s.time;}
function sessName(s){return typeof s==='string'?'':(s.session||'');}
function sessLabel(s){const n=sessName(s);return (n?trSession(n,currentLang)+' ':'')+trSession(sessTime(s),currentLang);}

function renderPools(){
 const now=hkNow(), nm=hkMinutes(now);
 const FSTATUS={open:{t:t('open'),c:'open'},soon:{t:t('soon'),c:'soon'},maintenance:{t:t('maint'),c:'done'},closed:{t:t('closed_today'),c:'suspended'}};
 const todayStr=`${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`;
 return (DISTRICT.pools||[]).map(f=>{
   let st = facilityOverallStatus(sessList(f).map(sessTime), nm);
   let weatherHtml='';
   const ww=wWarn();
   const poolCritical=ww.severe.filter(s=>/八號|九號|十號|黑色暴雨|Signal No\. [89]|Black Rainstorm/.test(s));
   if(poolCritical.length || ww.thunder.length){
     const allWarnings=[...poolCritical, ...ww.thunder];
     weatherHtml=`<div class="notice" style="background:#fee2e2;border-color:#fecaca;color:#991b1b">⚠️ ${t('weatherWarn')}：${allWarnings.join('、')} — ${currentLang==='en'?'Pool may close':currentLang==='cn'?'泳池可能暫停開放':'泳池可能暫停開放'}</div>`;
   }
   let closureHtml=weatherHtml;
   if(f.closures){
     closureHtml+=f.closures.filter(c=>{if(c.date>todayStr)return true;if(c.date!==todayStr)return false;const cr=parseRange(c.time);return cr&&nm<cr.end}).map(c=>{
     const p=currentLang==='en'?(c.poolsEn||c.pools):c.pools;
     const r=currentLang==='en'?(c.reasonEn||c.reason):c.reason;
     const rm=currentLang==='en'?(c.remarksEn||c.remarks||''):(c.remarks||'');
     const rmHtml=rm?` <span style="opacity:.8">（${rm}）</span>`:'';
     return `<div class="notice" style="background:#fee2e2;border-color:#fecaca;color:#991b1b">⚠️ ${t('closure')}（${c.date} ${c.time}）：${p} — ${t('closureReason')} ${r}${rmHtml}</div>`
     }).join('');
   }
   if(f.cleaning&&isCleaningDay(f.cleaning, now)){
     closureHtml+=`<div class="notice" style="background:#e0e7ff;border-color:#c7d2fe;color:#3730a3">🧹 ${t('cleaningDay')}（${f.cleaning.day}${f.cleaning.fallback?' → '+f.cleaning.fallback:''}）</div>`;
   }
   let subPools=poolSubStatuses(f, todayStr, now);
   const subPoolAllClosed=subPools.length>0&&subPools.every(x=>x.status==='closed');
   let sessions=sessList(f).map(s=>{
    let r=parseRange(sessTime(s));
    let ss=sessionStatus(r,nm);
    if(f.cleaning&&isCleaningDay(f.cleaning, now)){
      const CLEAN_START=10*60; let cleanEnd=18*60;
      const s2=sessList(f)[1]; if(s2){ const r2=parseRange(sessTime(s2)); if(r2) cleanEnd=r2.end; }
      if(r && r.start<cleanEnd && r.end>CLEAN_START) ss={text:t('cleaningClosed'),cls:'suspended'};
    }
    if(f.closures){
      const crs=f.closures.filter(c=>c.date===todayStr).map(c=>parseRange(c.time)).filter(Boolean);
      const allAffected=crs.some(cr=>r&&r.start<cr.end&&r.end>cr.start&&nm>=cr.start&&nm<cr.end)&&subPoolAllClosed;
      if(allAffected && !ss.cls.startsWith('suspended')) ss={text:t('closed_today'),cls:'suspended'};
    }
    return `<div class="session"><span class="session-time">${sessLabel(s)}</span><span class="session-status ${ss.cls}">${ss.text}</span></div>`
   }).join("");
    if(st.cls==="soon"||st.text===t('soon')){
     subPools=subPools.map(x=>x.status==='open'?{...x,status:'soon'}:x);
   }
   const subClosed=subPools.filter(x=>x.status==='closed').length;
   if(subClosed>0 && subClosed<subPools.length) st={text:t('partial'),cls:"status-partial"};
   else if(subClosed===subPools.length) st={text:t('closed_today'),cls:"status-suspended"};
   if(st.cls==="status-closed"||st.cls==="status-suspended"){
     subPools=subPools.map(x=>({...x, status:'closed', note:x.note||t('closedNote')}));
   }
   let pools=subPools.map(x=>{
     let fs=FSTATUS[x.status]||FSTATUS.closed;
     return `<div class="detail-row" style="flex-direction:column;align-items:flex-start;gap:2px"><div style="display:flex;justify-content:space-between;width:100%;align-items:center"><span class="detail-label">${tl('pool',x.name)} <small style="color:#94a3b8">${x.spec}</small></span><span class="session-status ${fs.c}">${fs.t}</span></div>${x.note?`<small style="color:#92400e;font-size:.75rem;text-align:right;width:100%">${tl('note',x.note)}</small>`:''}</div>`
   }).join("");
   let official=officialLink(f.officialUrl,'view');
   return `<div class="card collapsed" id="${f.id}"><div class="facility-header" onclick="toggleCard(this)"><div><div class="facility-name">${lname(f.id)}</div><div class="facility-address">${addr(f)}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="status-badge ${st.cls}">${st.text}</span><span class="expand-hint" data-expand="${t('expand')}" data-collapse="${t('collapse')}"></span></div></div><div class="facility-body">${pools}<div class="schedule-section"><div class="schedule-title">${t('hours')}</div>${sessions}</div>${closureHtml}${official}</div></div>`
 }).join("");
}

function renderPlayrooms(){
 const now=hkNow(), nm=hkMinutes(now);
 return (DISTRICT.playrooms||[]).map(p=>{
   let maint=parseMaintNote(p.note);
   let isMaint=isMaintDay(maint);
   let maintNow=isMaint && nm < maint.shift;
   let st=maintNow?{text:t('maint'),cls:'status-maint'}:facilityOverallStatus(p.sessions, nm);
   let html=p.sessions.map(s=>{
     let r=parseRange(s);
     let ss=sessionStatus(r,nm);
     if(isMaint && r && r.start<maint.shift){ss={text:t('maint'),cls:'maint'};}
     return `<div class="session"><span class="session-time">${trSession(s,currentLang)}</span><span class="session-status ${ss.cls}">${ss.text}</span></div>`
   }).join("");
   let official=officialLink(p.officialUrl,'view');
   return `<div class="card collapsed" id="${p.id}"><div class="facility-header" onclick="toggleCard(this)"><div><div class="facility-name">${lname(p.id)}</div><div class="facility-address">${addr(p)} · ${tl('pool',p.theme)} · ${p.area}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="status-badge ${st.cls}">${st.text}</span><span class="expand-hint" data-expand="${t('expand')}" data-collapse="${t('collapse')}"></span></div></div><div class="facility-body"><div class="schedule-section"><div class="schedule-title">${t('hours45')}</div>${html}</div><div class="notice">${tl('note',p.note)}</div>${official}</div></div>`
 }).join("");
}

function safeRender(elId, fn){
  const el=document.getElementById(elId);
  if(!el) return;
  try{
    el.innerHTML=fn();
  }catch(e){
    console.error(elId,e);
    if(!el.innerHTML.trim()) el.innerHTML='<div class="notice" style="color:#b45309">⚠️ 數據暫時無法顯示，將自動重試</div>';
  }
}
function renderAll(){
 (DISTRICT.renderers||[]).forEach(function(r){
   var fn = typeof r[1]==='function' ? r[1] : (typeof window!=='undefined'?window[r[1]]:undefined) || (typeof globalThis!=='undefined'?globalThis[r[1]]:undefined);
   if(fn) safeRender(r[0], fn);
 });
 const cards=document.querySelectorAll('.card');
 cards.forEach((c,i)=>{ c.style.animationDelay=(i*0.06)+'s'; c.style.animation='cardIn .35s ease both'; });
 updateClock();
}
function updateClock(){
 const now=hkNow();
 const y=now.getFullYear();
 const mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][now.getMonth()];
 const d=now.getDate();
 const wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()];
 const hh=String(now.getHours()).padStart(2,'0');
 const mm=String(now.getMinutes()).padStart(2,'0');
 document.getElementById('topDate').textContent=`${y}-${mon}-${d} (${wd}) ${hh}:${mm}`;
}
function toggleSection(id){
 document.getElementById(id).classList.toggle('collapsed');
}

const LAST_UPDATE='2026-09-01 10:27';
function updateSyncAgo(){
  const [d,t]=LAST_UPDATE.split(' ');
  const [y,m,dd]=d.split('-').map(Number);
  const [hh,mm]=t.split(':').map(Number);
  const syncTime=new Date(y,m-1,dd,hh,mm);
  const diff=Math.floor((Date.now()-syncTime)/60000);
  const ago=diff<1?'剛剛':diff<60?diff+'分鐘前':diff<1440?Math.floor(diff/60)+'小時前':Math.floor(diff/1440)+'天前';
  document.getElementById('lastSyncAgo').textContent='('+ago+')';
}
function renderFooter(){
  document.querySelector('#footer-updated').innerHTML=t('lastUpd')+'：<span id="lastUpdate">'+LAST_UPDATE+'</span> <span id="lastSyncAgo" style="color:#16a34a;font-weight:600"></span> · '+t('src');
  document.querySelector('#footer-links').innerHTML='<a href="https://ko-fi.com/forumdata" target="_blank" rel="noopener" style="color:#f59e0b;text-decoration:none">☕ '+t('buyCoffee')+'</a><span style="margin:0 6px">·</span><a href="mailto:youre@we1co.me" style="color:#64748b;text-decoration:none">✉️ '+t('contactAuthor')+'</a><span style="margin:0 6px">·</span><button id="shareBtn" style="color:#1e3a8a;background:none;border:none;cursor:pointer;text-decoration:underline">🔗 '+t('share')+'</button>';
  const rb=document.getElementById('hardRefreshBtn');
  if(rb){rb.innerHTML=t('hardRefresh');rb.title=currentLang==='en'?'Force refresh (clear cache)':'強制重新整理 (清除快取)';}
  updateSyncAgo();
  document.getElementById('backToTop').setAttribute('aria-label', t('backToTop'));
  document.getElementById('shareBtn').onclick=()=>{
    const url=location.href;
    const title=document.title;
    if(navigator.share){navigator.share({title,url}).catch(()=>{});}
    else{navigator.clipboard.writeText(url).then(()=>{const b=document.getElementById('shareBtn');b.textContent='✅ '+t('copied');setTimeout(()=>b.textContent='🔗 '+t('share'),1500);});}
  };
}
setInterval(()=>{renderAll()},60000);
document.getElementById('lastUpdate').textContent=LAST_UPDATE;
updateSyncAgo();
setInterval(updateSyncAgo,30000);
renderFooter();
setInterval(updateClock,1000);
updateClock();
document.getElementById('backToTop').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
document.querySelectorAll('.index-item').forEach(a=>a.addEventListener('click',e=>{
 e.preventDefault();
 const el=document.getElementById(a.getAttribute('href').slice(1));
 if(el){const off=88+document.getElementById('quickNav').getBoundingClientRect().height+8;
  window.scrollTo({top:el.getBoundingClientRect().top+scrollY-off,behavior:'smooth'});}
}));
window.addEventListener('scroll',()=>{document.getElementById('backToTop').classList.toggle('visible',window.scrollY>300)});
document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',e=>{
 e.preventDefault();
 currentLang=b.dataset.lang;
 document.querySelectorAll('.lang-btn').forEach(x=>x.classList.toggle('active',x===b));
 document.documentElement.lang=currentLang==='zh'?'zh-HK':currentLang==='cn'?'zh-CN':'en';
 document.querySelector('.nav-title').textContent=t('title');
 document.title=t('title')+' | we1co.me';
 const secMap=DISTRICT.secMap||{};
 document.querySelectorAll('section.collapsible h2').forEach(h=>{
   const id=h.closest('section').id;
   const v=secMap[id];
   if(v) h.innerHTML=(typeof v==='function'?v():v)+' <span class="toggle"></span>';
 });
 const navItems=document.querySelectorAll('.index-item');
 const navTxt=typeof DISTRICT.navTxt==='function'?DISTRICT.navTxt():(DISTRICT.navTxt||[]);
 navItems.forEach((el,i)=>{ if(navTxt[i]) el.textContent=navTxt[i]; });
 renderFooter();
 document.querySelectorAll('.card').forEach(c=>c.classList.toggle('collapsed',c.classList.contains('collapsed')));
 renderAll();
 const ww=wWarn();
 const banner=document.getElementById('thunderBanner');
 if(banner&&ww.thunder.length){
   banner.innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg> ⛈ ${ww.thunder.join('、')}${currentLang==='en'?' in effect':'生效中'}${currentLang==='en'?' — Pools may close':' — 泳池可能暫停開放'}`;
 }
}));
// async data loaders（由 district config 提供 loadRVM/loadSportGround）
if(typeof loadRVM==='function') loadRVM();
if(typeof loadSportGround==='function') loadSportGround();
