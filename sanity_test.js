#!/usr/bin/env node
// we1co.me sanity test v3 — reads common.js (post-refactor)
const fs = require('fs');
const vm = require('vm');
const district = process.argv[2] || 'sk';
const code = fs.readFileSync('common.js', 'utf-8');

// Extract top-level functions: scan lines for 'function X(' at column 0, collect to matching brace
const funcs = {};
const lines = code.split('\n');
for(let i=0;i<lines.length;i++){
  const m = lines[i].match(/^\s*function\s+(\w+)\(/);
  if(!m) continue;
  const name = m[1];
  // top-level only: no leading whitespace
  if(lines[i].startsWith(' ') || lines[i].startsWith('\t')) continue;
  let depth=0, body=[], started=false;
  for(let j=i;j<lines.length;j++){
    const l = lines[j];
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
// parseWarnings inside IIFE — regex extract
const pwm = code.match(/  function parseWarnings\(wd\)\{[\s\S]*?\n  \}/);
if(pwm) funcs.parseWarnings = pwm[0];

const need = ['parseRange','sessionStatus','poolSubStatuses','facilityOverallStatus','renderPools','parseWarnings','inMaintenance','parseMaintNote','hkMinutes','isCleaningDay'];
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
  lname:(id)=>id, addr:()=>'', officialLink:()=>'', trTime:()=>'', LDAY:{},
  // stubs needed by renderPools
  window:{}, globalThis:{},
  document:{getElementById:()=>({innerHTML:'',textContent:'',classList:{toggle:()=>{},contains:()=>false}}),querySelectorAll:()=>[],querySelector:()=>({style:{}}),documentElement:{},title:'',body:{style:{}}},
  navigator:{}, location:{href:''}, setTimeout, setInterval:()=>0, clearInterval:()=>{}, addEventListener:()=>{},
  // I18N stubs needed by t/lname/tl
  I18N:{zh:{open:'營運中',soon:'即將開始',done:'已結束',closed_today:'暫停開放',partial:'部分開放',maint:'維修中',cleaningClosed:'暫停清潔中',hours:'開放時段',hours45:'開放時段 (每節 45-60分)',view:'查看康文署官網 →',expand:'[展開 +]',collapse:'[收合 −]',closure:'暫停開放公告',closedNote:'今日暫停',cleaningNote:'x',weatherWarn:'天氣警示'},en:{},cn:{}},
  NAME_L10N:{}, SUB_L10N:{},
};
vm.createContext(sandbox);
// Load in dependency order
const depOrder = ['parseRange','sessionStatus','isCleaningDay','inMaintenance','parseMaintNote','poolSubStatuses','facilityOverallStatus','renderPools'];
const codeToRun = depOrder.map(n=>funcs[n]).join('\n') + '\n;__f={parseRange,sessionStatus,poolSubStatuses,facilityOverallStatus,renderPools,isCleaningDay,inMaintenance,parseMaintNote};';
vm.runInContext(codeToRun, sandbox);
// parseWarnings standalone
try{ vm.runInContext(funcs.parseWarnings + '\n;__f.parseWarnings=parseWarnings;', sandbox); }catch(e){ console.log('parseWarnings load fail:', e.message); }
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

console.log('── parseWarnings (warnsum 新格式) ──');
if(f.parseWarnings){
  const wd1={WTCSGNL:{name:'熱帶氣旋警告信號',code:'TC1',actionCode:'ISSUE',type:'一號戒備信號'}};
  let r=f.parseWarnings(wd1);
  ok('T1 → severe 有一號戒備信號', r.severe.length===1 && r.severe[0]==='一號戒備信號', JSON.stringify(r));
  ok('T1 → thunder 為空（無雷暴）', r.thunder.length===0, JSON.stringify(r.thunder));
  const wd2={WTS:{name:'雷暴警告',code:'THUNDER',actionCode:'ISSUE',type:'雷暴警告'}};
  r=f.parseWarnings(wd2);
  ok('WTS → thunder 有雷暴警告', r.thunder.length===1 && r.thunder[0]==='雷暴警告', JSON.stringify(r));
  const wd3={WTS:{name:'雷暴警告',code:'THUNDER',actionCode:'CANCEL',type:'雷暴警告'}};
  r=f.parseWarnings(wd3);
  ok('CANCEL → 唔顯示', r.thunder.length===0 && r.severe.length===0, JSON.stringify(r));
  const wd4={WTCSGNL:{name:'熱帶氣旋警告信號',code:'TC8',actionCode:'ISSUE',type:'八號烈風或暴風信號'},WTS:{name:'雷暴警告',code:'THUNDER',actionCode:'ISSUE',type:'雷暴警告'}};
  r=f.parseWarnings(wd4);
  ok('T8+雷暴 → 分開兩組', r.severe[0]==='八號烈風或暴風信號' && r.thunder[0]==='雷暴警告', JSON.stringify(r));
  const wd5={WTCSGNL:{name:'Tropical Cyclone Warning Signal',code:'TC1',actionCode:'ISSUE',type:'Standby Signal No. 1'}};
  r=f.parseWarnings(wd5);
  ok('EN T1 → Standby Signal No. 1', r.severe[0]==='Standby Signal No. 1', JSON.stringify(r));
  r=f.parseWarnings(null);
  ok('null 輸入 → 空陣列', r.severe.length===0 && r.thunder.length===0);
} else ok('parseWarnings 可執行', false);

console.log(`\n===== RESULT: ${pass} pass, ${fail} fail (common.js) =====`);
process.exit(fail>0?1:0);
