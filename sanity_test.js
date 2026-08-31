#!/usr/bin/env node
// we1co.me sanity test v2 — 只測 top-level 函數 + regex 抽 parseThunder
const fs = require('fs');
const vm = require('vm');
const file = process.argv[2] || 'index.html';
const html = fs.readFileSync(file, 'utf-8');
const scripts = html.match(/<script>([\s\S]*?)<\/script>/g).map(s=>s.replace(/<\/?script>/g,''));
const code = scripts.join('\n');

// 抽 top-level 函數: 行掃描, 搵 'function X(' 開頭, 收集到配對大括號
const funcs = {};
const lines = code.split('\n');
for(let i=0;i<lines.length;i++){
  const m = lines[i].match(/^\s*function\s+(\w+)\(/);
  if(!m) continue;
  const name = m[1];
  // 用縮排判斷 top-level: 行首冇縮排
  if(lines[i].startsWith(' ') || lines[i].startsWith('\t')) continue;
  let depth=0, body=[], started=false;
  for(let j=i;j<lines.length;j++){
    const l = lines[j];
    // count braces ignoring strings roughly
    for(const ch of l){
      if(ch==='{'){ depth++; started=true; }
      if(ch==='}') depth--;
    }
    body.push(l);
    if(depth===0 && started) break;
  }
  funcs[name]=body.join('\n');
  i += body.length-1;
}
// parseThunder 喺 IIFE 內, 用 regex 抽出 function body
const ptm = code.match(/  function parseThunder\(wd\)\{[\s\S]*?\n  \}/);
if(ptm) funcs.parseThunder = ptm[0];

const need = ['parseRange','sessionStatus','poolSubStatuses','facilityOverallStatus','renderPools','parseThunder','inMaintenance','parseMaintNote','hkMinutes','isCleaningDay'];
const missing = need.filter(n=>!funcs[n]);
if(missing.length){ console.log('MISSING funcs:', missing); process.exit(1); }

const t = (k)=>({soon:'即將開始',open:'營運中',done:'已結束',closed_today:'暫停開放',closureReason:'因',cleaningClosed:'暫停清潔中',cleaningNote:'x',closedNote:'今日暫停',partial:'部分開放'}[k]||k);
let currentLang='zh';
const tl=(a,b)=>b;
const trSession=(s)=>s;
const trDay=(d)=>d;
const FSTATUS={open:{t:t('open'),c:'open'},soon:{t:t('soon'),c:'soon'},maintenance:{t:t('maint'),c:'done'},closed:{t:t('closed_today'),c:'suspended'}};
const severeWarnings=[], thunderWarnings=[];
const hkNow=()=>new Date('2026-08-31T18:00:00+08:00');

const sandbox = {console, Date, Math, Set, JSON, t, tl, trSession, trDay, FSTATUS, severeWarnings, thunderWarnings, currentLang, hkNow,
  hkMinutes:(d)=>d.getHours()*60+d.getMinutes(),
  isCleaningDay:funcs.isCleaningDay, inMaintenance:funcs.inMaintenance,
  parseMaintNote:funcs.parseMaintNote,
  lname:(id)=>id, addr:()=>'', officialLink:()=>'', trTime:()=>'', LDAY:{}};
vm.createContext(sandbox);
// 依賴順序: parseRange → sessionStatusAt → poolSubStatuses → facilityOverallStatus → renderPools
const depOrder = ['parseRange','sessionStatus','isCleaningDay','inMaintenance','parseMaintNote','poolSubStatuses','facilityOverallStatus','renderPools'];
const codeToRun = depOrder.map(n=>funcs[n]).join('\n') + '\n;__f={parseRange,sessionStatus,poolSubStatuses,facilityOverallStatus,renderPools,isCleaningDay,inMaintenance,parseMaintNote};';
vm.runInContext(codeToRun, sandbox);
// parseThunder 單獨跑 (只用 t 唔依賴其他)
try{ vm.runInContext(funcs.parseThunder + '\n;__f.parseThunder=parseThunder;', sandbox); }catch(e){ console.log('parseThunder load fail:', e.message); }
const f = sandbox.__f;

let pass=0, fail=0;
function ok(name, cond, extra){
  if(cond){ pass++; console.log('  ✅ '+name); }
  else { fail++; console.log('  ❌ '+name+(extra?' :: '+extra:'')); }
}

const TKO = {id:'tkoswim',name:'將軍澳',schedule:{summer:[{session:'第一節',time:'06:30 - 12:00'},{session:'第二節',time:'13:00 - 18:00'},{session:'第三節',time:'19:00 - 22:00'}]},
  closures:[{date:'2026/08/31',time:'19:00 - 22:00',pools:'跳水池, 戲水池, 嬉水池 1',reason:'救生員不足',reasonEn:'Insufficient Lifeguard'}],
  cleaning:{day:'一',fallback:'二'},
  facilities:[{name:'主池',spec:'50米',status:'open'},{name:'跳水池',spec:'12米',status:'open'},{name:'戲水池',spec:'1米',status:'open'}]};

console.log('── parseRange ──');
ok('06:30 - 12:00', JSON.stringify(f.parseRange('06:30 - 12:00'))==='{"start":390,"end":720}');
ok('19:00 - 22:00', JSON.stringify(f.parseRange('19:00 - 22:00'))==='{"start":1140,"end":1320}');
ok('null input → null', f.parseRange(null)===null);

console.log('── sessionStatus (每節獨立判斷) ──');
const sessions=[{session:'一',time:'06:30 - 12:00'},{session:'二',time:'13:00 - 18:00'},{session:'三',time:'19:00 - 22:00'}];
let r=f.sessionStatus(f.parseRange('06:30 - 12:00'), 18*60);
ok('18:00 第一節已過 → 已結束', r.text==='已結束' && r.cls==='done', JSON.stringify(r));
r=f.sessionStatus(f.parseRange('19:00 - 22:00'), 18*60);
ok('18:00 第三節未開始 → soon', r.text==='即將開始' && r.cls==='soon');
r=f.sessionStatus(f.parseRange('13:00 - 18:00'), 15*60);
ok('15:00 第二節中 → 營運中', r.text==='營運中' && r.cls==='open');
r=f.sessionStatus(f.parseRange('06:30 - 12:00'), 23*60);
ok('23:00 全日完 → 已結束', r.text==='已結束');
r=f.sessionStatus(f.parseRange('19:00 - 22:00'), 19*60+53);
ok('19:53 第三節 → 營運中', r.text==='營運中', JSON.stringify(r));

console.log('── poolSubStatuses 預告暫停 ──');
sandbox.currentLang='zh';
const now18=new Date('2026-08-31T18:00:00+08:00');
let subs=f.poolSubStatuses(TKO,'2026/08/31',now18);
const jd=subs.find(x=>x.name==='跳水池');
const zc=subs.find(x=>x.name==='主池');
ok('18:00 跳水池 → 預告暫停', jd.status==='closed', JSON.stringify(jd));
ok('跳水池 note 含原因', jd.note && jd.note.includes('救生員不足'), jd.note);
ok('18:00 主池 → open', zc.status==='open');
const now10=new Date('2026-08-31T10:00:00+08:00');
let subs2=f.poolSubStatuses(TKO,'2026/08/31',now10);
ok('10:00 跳水池 → 預告暫停(公告未完結)', subs2.find(x=>x.name==='跳水池').status==='closed');
const now23=new Date('2026-08-31T23:30:00+08:00');
let subs3=f.poolSubStatuses(TKO,'2026/08/31',now23);
ok('23:30 公告已完結 → 跳水池恢復', subs3.find(x=>x.name==='跳水池').status==='open');

console.log('── parseThunder (新格式) ──');
if(f.parseThunder){
  const wd1={details:[{warningStatementCode:'WTS',contents:['天文台在8月31日下午5時07分發出雷暴警告，有效時間至今日下午7時正，預料狂風雷暴。']}]};
  let th=f.parseThunder(wd1);
  ok('WTS 提取 + 有效時間', th.length===1 && th[0].includes('雷暴警告') && th[0].includes('下午7時正'), JSON.stringify(th));
  const wd2={details:[{warningStatementCode:'WTS',contents:['天文台在8月31日下午5時07分發出之雷暴警告，有效時間延長至今日下午9時正，預料局部狂風雷暴。']}]};
  th=f.parseThunder(wd2);
  ok('「延長至」提取', th.length===1 && th[0].includes('今日下午9時正'), JSON.stringify(th));
  const wd3={details:[{warningStatementCode:'WTS',contents:['天文台取消雷暴警告。']}]};
  th=f.parseThunder(wd3);
  ok('取消 → 唔顯示', th.length===0);
  const wd4={details:[{warningStatementCode:'WTCSGNL',contents:['一號戒備信號']}]};
  th=f.parseThunder(wd4);
  ok('熱帶氣旋唔入 thunder', th.length===0);
  const wd5={details:[{warningStatementCode:'WTS',contents:['雷暴警告']}]};
  th=f.parseThunder(wd5);
  ok('無有效時間 → 只有警告名', th.length===1 && th[0]==='雷暴警告');
} else ok('parseThunder 可執行', false);

console.log(`\n===== RESULT: ${pass} pass, ${fail} fail (${file}) =====`);
process.exit(fail>0?1:0);
