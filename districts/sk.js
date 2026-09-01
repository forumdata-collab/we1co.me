// districts/sk.js — 西貢區 config。必須喺 common.js 之前載入。
const I18N={
 zh:{title:"西貢區康樂設施運作情況",pools:"🏊 游泳池",playrooms:"🎮 兒童遊戲室",library:"📚 圖書館",rvm:"♻️ 塑膠樽回收機",open:"營運中",soon:"即將開始",done:"已結束",closed:"休館",partial:"部分開放",maint:"維修中",closed_today:"暫停開放",cleaningClosed:"暫停清潔中",rvm_open:"提供服務",rvm_soon:"即將開放",rvm_closed:"非服務時間",rvm_full:"已滿",rvm_nearly_full:"快將滿溢",rvm_maint:"維護中",hours:"開放時段",hours45:"開放時段 (每節 45-60分)",libhours:"開放時間",today:"今日",lastUpd:"最後更新",src:"數據來源：康文署 · 環保署",view:"查看康文署官網 →",viewLib:"查看公共圖書館官網 →",expand:"[展開 +]",collapse:"[收合 −]",sync:"最近同步",closure:"暫停開放公告",closureReason:"因",upcoming:"即將開放",mainPool:"主池",closedNote:"今日暫停",cleaningNote:"是日為清潔日，目前暫停，時間為上午10時至第二節開放時段完結為止，而泳池會於同日第三節重開。",cleaningDay:"今日為每周大清潔日",weatherWarn:"天氣警示",libMayClose:"圖書館可能暫停開放，請留意官方公告",sun:"日",mon:"一",tue:"二",wed:"三",thu:"四",fri:"五",sat:"六",holiday:"公眾假期",buyCoffee:"請我飲咖啡",contactAuthor:"聯絡作者",share:"分享",backToTop:"返回頂部",hardRefresh:"🔄 強制重新整理",copied:"已複製",mainField:"主場",secField:"副場",todayLabel:"今天",tomorrowLabel:"明天",expiredLabel:"已結束",xlsxDateLabel:"資料期",xlsxFileDateLabel:"表格更新日期",maintNotice:"定期保養日（即場地關閉）",viewTimetable:"查看時間表",rvmOfficialMap:"入樽機官方地圖"},
 en:{title:"Sai Kung Leisure Facilities Status",pools:"🏊 Swimming Pools",playrooms:"🎮 Children's Playrooms",library:"📚 Library",rvm:"♻️ Bottle Recycling Machines",open:"Open",soon:"Opening Soon",done:"Closed",closed:"Closed",partial:"Partially Open",maint:"Maintenance",closed_today:"Suspended",cleaningClosed:"Cleaning",rvm_open:"In Service",rvm_soon:"Opening Soon",rvm_closed:"Out of Hours",rvm_full:"Full",rvm_nearly_full:"Nearly Full",rvm_maint:"Maintenance",hours:"Opening Sessions",hours45:"Sessions (45-60 min each)",libhours:"Opening Hours",today:"Today",lastUpd:"Last updated",src:"Data: LCSD · EPD",view:"View LCSD official page →",viewLib:"View library official page →",expand:"[Expand +]",collapse:"[Collapse −]",sync:"Last synced",closure:"Closure Notice",closureReason:"due to",upcoming:"Opens Soon",closedNote:"Suspended today",cleaningNote:"Cleaning day today. Pool suspended from 10:00 to end of session 2. Reopens in session 3.",cleaningDay:"Weekly cleaning day",weatherWarn:"Weather Warning",libMayClose:"Libraries may be closed — check official notices",sun:"Sun",mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",holiday:"Public Holiday",buyCoffee:"Buy me a coffee",contactAuthor:"Contact author",share:"Share",backToTop:"Back to top",hardRefresh:"🔄 Force Refresh",copied:"Copied",mainField:"Main Field",secField:"Secondary Field",todayLabel:"Today",tomorrowLabel:"Tomorrow",expiredLabel:"Ended",xlsxDateLabel:"Data Period",xlsxFileDateLabel:"Table Updated",maintNotice:"Regular Maintenance (venue closed)",viewTimetable:"View Timetable",rvmOfficialMap:"Official Recycling Machine Map"},
 cn:{title:"西贡区康乐设施运作情况",pools:"🏊 游泳池",playrooms:"🎮 儿童游戏室",library:"📚 图书馆",rvm:"♻️ 塑胶瓶回收机",open:"营运中",soon:"即将开始",done:"已结束",closed:"休馆",partial:"部分开放",maint:"维修中",closed_today:"暂停开放",cleaningClosed:"暂停清洁中",rvm_open:"提供服务",rvm_soon:"即将开放",rvm_closed:"非服务时间",rvm_full:"已满",rvm_nearly_full:"快将满溢",rvm_maint:"维护中",hours:"开放时段",hours45:"开放时段 (每节 45-60分)",libhours:"开放时间",today:"今日",lastUpd:"最后更新",src:"数据来源：康文署 · 环保署",view:"查看康文署官网 →",viewLib:"查看公共图书馆官网 →",expand:"[展开 +]",collapse:"[收合 −]",sync:"最近同步",closure:"暂停开放公告",closureReason:"因",upcoming:"即将开放",mainPool:"主池",closedNote:"今日暂停",cleaningNote:"是日为清洁日，目前暂停，时间为上午10时至第二节开放时段完结为止，而泳池会于同日第三节重开。",cleaningDay:"今日为每周大清洁日",weatherWarn:"天气警示",libMayClose:"图书馆可能暂停开放，请留意官方公告",sun:"日",mon:"一",tue:"二",wed:"三",thu:"四",fri:"五",sat:"六",holiday:"公众假期",buyCoffee:"请我喝咖啡",contactAuthor:"联系作者",share:"分享",backToTop:"返回顶部",hardRefresh:"🔄 强制重新整理",copied:"已复制",mainField:"主场",secField:"副场",todayLabel:"今天",tomorrowLabel:"明天",expiredLabel:"已结束",xlsxDateLabel:"资料期",xlsxFileDateLabel:"表格更新日期",maintNotice:"定期保养日（即场地关闭）",viewTimetable:"查看时间表",rvmOfficialMap:"入樽机官方地图"}
};
const NAME_L10N={
 tkoswim:{zh:"將軍澳游泳池",en:"Tseung Kwan O Swimming Pool",cn:"将军澳游泳池"},
 ktswim:{zh:"觀塘游泳池",en:"Kwun Tong Swimming Pool",cn:"观塘游泳池"},
 "playroom-tko1":{zh:"坑口體育館兒童遊戲室",en:"Hang Hau Sports Centre Playroom",cn:"坑口体育馆儿童游戏室"},
 "playroom-tko2":{zh:"香港單車館兒童遊戲室",en:"Hong Kong Velodrome Playroom",cn:"香港单车馆儿童游戏室"},
 "playroom-tko3":{zh:"調景嶺體育館兒童遊戲室",en:"Tiu Keng Leng Sports Centre Playroom",cn:"调景岭体育馆儿童游戏室"},
 tkolib:{zh:"將軍澳公共圖書館",en:"Tseung Kwan O Public Library",cn:"将军澳公共图书馆"},
 tklib:{zh:"調景嶺公共圖書館",en:"Tiu Keng Leng Public Library",cn:"调景岭公共图书馆"}
};
const SUB_L10N={
  pool:{主池:"Main Pool",訓練池:"Training Pool","習泳池 1":"Teaching Pool 1","習泳池 2":"Teaching Pool 2",跳水池:"Diving Pool",戲水池:"Splash Pool","嬉水池 1":"Children's Pool 1","嬉水池 2 (滑水梯)":"Children's Pool 2 (Water Slide)",日光浴場:"Sunbathing Area",副池:"Secondary Pool","習泳池 1&2":"Teaching Pools 1&2",奇妙水世界:"Wonder Water World",極限運動:"Extreme Sports",海洋世界:"Ocean World"},
  rvm:{彩明商場:"Choi Ming Shopping Centre","新都城中心三期":"Metro City Plaza Phase 3",PopCorn:"PopCorn",寶林商場:"Po Lam Shopping Centre","The LOHAS":"The LOHAS","TKO Spot":"TKO Spot",怡明邨:"Yee Ming Estate","海悅豪園商場":"Marina Garden Shopping Arcade"},
  note:{"保養日(每月第二及第四個星期二 07:00-13:00)首節改 13:30":"Maintenance day (2nd & 4th Tue 07:00-13:00): first session moves to 13:30","保養日(每月第一及第三個星期二 07:00-13:00)首節改 13:30":"Maintenance day (1st & 3rd Tue 07:00-13:00): first session moves to 13:30","保養日(每月第二及第四個星期一 07:00-13:00)首節改 14:15":"Maintenance day (2nd & 4th Mon 07:00-13:00): first session moves to 14:15"}
};
const HK_HOLIDAYS=["2026/01/01", "2026/02/17", "2026/02/18", "2026/02/19", "2026/04/03", "2026/04/04", "2026/04/06", "2026/04/07", "2026/05/01", "2026/05/25", "2026/06/19", "2026/07/01", "2026/09/26", "2026/10/01", "2026/10/19", "2026/12/25", "2026/12/26", "2027/01/01", "2027/02/06", "2027/02/08", "2027/02/09", "2027/03/26", "2027/03/27", "2027/03/29", "2027/04/05", "2027/05/01", "2027/05/13", "2027/06/09", "2027/07/01", "2027/09/16", "2027/10/01", "2027/10/08", "2027/12/25", "2027/12/27"];

const FACILITIES=[
{id:"tkoswim",name:"將軍澳游泳池",address:"將軍澳運隆路 9 號",addrEn:"9 Wan Lung Road, Tseung Kwan O",addrCn:"将军澳运隆路 9 号",phone:"2706 7646 / 2706 6767",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Swimming.do?swpId=35",closures:[{"date": "2026/09/01", "time": "06:30 - 14:15", "pools": "跳水池, 戲水池, 嬉水池 1", "reason": "救生員不足", "remarks": "不適用", "poolsEn": "Diving Pool , Toddlers' Pool, Leisure Pool 1", "reasonEn": "Insufficient Lifeguard", "remarksEn": "N/A"}, {"date": "2026/09/18", "time": "07:30 - 17:00", "pools": "主池, 觀眾看台", "reason": "學校水運會", "remarks": "", "poolsEn": "Main Pool , Spectator Stand", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/20", "time": "08:00 - 20:00", "pools": "主池, 習泳池 1, 跳水池, 觀眾看台", "reason": "游泳比賽", "remarks": "", "poolsEn": "Main Pool , Teaching Pool 1, Diving Pool , Spectator Stand", "reasonEn": "Competition", "remarksEn": ""}, {"date": "2026/09/25", "time": "07:30 - 15:00", "pools": "主池, 觀眾看台", "reason": "學校水運會", "remarks": "", "poolsEn": "Main Pool , Spectator Stand", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/27", "time": "08:00 - 20:00", "pools": "主池, 習泳池 1, 跳水池, 觀眾看台", "reason": "游泳比賽", "remarks": "", "poolsEn": "Main Pool , Teaching Pool 1, Diving Pool , Spectator Stand", "reasonEn": "Competition", "remarksEn": ""}, {"date": "2026/09/30", "time": "07:30 - 15:00", "pools": "主池, 觀眾看台", "reason": "學校水運會", "remarks": "在十一月中至翌年四月中期間會提供暖水游泳池設施。", "poolsEn": "Main Pool , Spectator Stand", "reasonEn": "School Swimming Gala", "remarksEn": ""}],maintenance:[{"pool": "主池", "start": "5/4", "end": "6/23", "nextYear": false}, {"pool": "訓練池", "start": "11/1", "end": "4/15", "nextYear": true}, {"pool": "習泳池", "start": "11/1", "end": "4/15", "nextYear": true}, {"pool": "跳水池", "start": "11/1", "end": "4/15", "nextYear": true}, {"pool": "戲水池", "start": "11/1", "end": "4/15", "nextYear": true}, {"pool": "嬉水池", "start": "11/1", "end": "4/15", "nextYear": true}],cleaning:{"day": "一", "fallback": "二"},facilities:[{name:"主池",spec:"50米 x 25米，水深 2-2.2米",status:"open"},{name:"訓練池",spec:"25米 x 12米",status:"open"},{name:"習泳池 1",spec:"20米 x 12米",status:"open"},{name:"習泳池 2",spec:"20米 x 12米",status:"open"},{name:"跳水池",spec:"12米 x 11米，水深 4.4-4.5米",status:"open"},{name:"戲水池",spec:"不規則形狀，水深 0.1-0.3米",status:"open"},{name:"嬉水池 1",spec:"不規則形狀，水深 0-0.95米",status:"open"},{name:"嬉水池 2 (滑水梯)",spec:"不規則形狀，水深 0.9-1.1米",status:"open"},{name:"日光浴場",spec:"戶外",status:"open"}],schedule:{summer:[{session:"第一節",time:"06:30 - 12:00"},{session:"第二節",time:"13:00 - 18:00"},{session:"第三節",time:"19:00 - 22:00"}],cleaning:"每周大清潔：上午10時至第二節結束，第三節重開"},status:"open"},
{id:"ktswim",name:"觀塘游泳池",address:"九龍觀塘翠屏道 2 號",addrEn:"2 Tsui Ping Road, Kwun Tong, Kowloon",addrCn:"九龙观塘翠屏道 2 号",phone:"2717 9022 / 2347 8140",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Swimming.do?swpId=18",closures:[{"date": "2026/09/11", "time": "07:30 - 16:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/12", "time": "07:30 - 15:00", "pools": "主池", "reason": "游泳比賽", "remarks": "", "poolsEn": "Main pool", "reasonEn": "Competition", "remarksEn": ""}, {"date": "2026/09/15", "time": "07:30 - 15:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/18", "time": "07:30 - 15:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/19", "time": "07:30 - 15:00", "pools": "主池", "reason": "游泳比賽", "remarks": "", "poolsEn": "Main pool", "reasonEn": "Competition", "remarksEn": ""}, {"date": "2026/09/22", "time": "07:30 - 15:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/25", "time": "07:30 - 16:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/28", "time": "07:30 - 16:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/29", "time": "07:30 - 14:00", "pools": "主池", "reason": "學校水運會", "remarks": "在十一月中至翌年四月中期間會提供暖水游泳池設施。", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}],maintenance:[{"pool": "戶外泳池", "start": "11/1", "end": "4/15", "nextYear": true}, {"pool": "室內泳池", "start": "1/2", "end": "2/21", "nextYear": false}],cleaning:{"day": "三", "fallback": "五"},facilities:[{name:"主池",spec:"50.03米 x 25米",status:"open"},{name:"訓練池",spec:"25米 x 30米",status:"open"},{name:"副池",spec:"50米 x 21米",status:"open"},{name:"習泳池 1&2",spec:"25米 x 12.5米",status:"open"},{name:"日光浴場",spec:"戶外",status:"open"}],schedule:{summer:[{session:"第一節",time:"06:30 - 12:00"},{session:"第二節",time:"13:00 - 18:00"},{session:"第三節",time:"19:00 - 22:00"}],cleaning:"每周大清潔：上午10時至第二節結束，第三節重開"},status:"open"}
];
const PLAYROOMS=[
{id:"playroom-tko1",name:"坑口體育館兒童遊戲室",address:"將軍澳培成路 38 號 西貢將軍澳政府綜合大樓 1 樓",addrEn:"1/F, Sai Kung Tseung Kwan O Government Complex, 38 Pui Shing Road, Tseung Kwan O",addrCn:"将军澳培成路 38 号 西贡将军澳政府综合大楼 1 楼",theme:"奇妙水世界",area:"226m²",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Facility/Details.do?ftid=15&did=8&fcid=",sessions:["早上 9:00 - 9:45","早上 10:00 - 10:45","早上 11:30 - 12:15","下午 12:30 - 13:15","下午 13:30 - 14:15","下午 15:15 - 16:00","下午 16:15 - 17:00","下午 18:00 - 18:45","晚上 19:00 - 19:45","晚上 20:00 - 20:45","晚上 21:00 - 21:45"],note:"保養日(每月第二及第四個星期二 07:00-13:00)首節改 13:30"},
{id:"playroom-tko2",name:"香港單車館兒童遊戲室",address:"將軍澳寶康路 105-107 號",addrEn:"105-107 Po Hong Road, Tseung Kwan O",addrCn:"将军澳宝康路 105-107 号",theme:"極限運動",area:"286m²",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Facility/Details.do?ftid=15&did=8&fcid=",sessions:["早上 9:00 - 10:00","早上 10:15 - 11:15","中午 12:15 - 13:15","下午 13:30 - 14:15","下午 14:30 - 15:30","下午 16:30 - 17:15","下午 17:30 - 18:30","晚上 19:30 - 20:15","晚上 20:30 - 21:30"],note:"保養日(每月第一及第三個星期二 07:00-13:00)首節改 13:30"},
{id:"playroom-tko3",name:"調景嶺體育館兒童遊戲室",address:"將軍澳翠嶺路 2 號",addrEn:"2 Tsui Ling Road, Tseung Kwan O",addrCn:"将军澳翠岭路 2 号",theme:"海洋世界",area:"226m²",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Facility/Details.do?ftid=15&did=8&fcid=",sessions:["早上 9:00 - 9:45","早上 10:00 - 10:45","早上 11:30 - 12:15","下午 12:30 - 13:15","下午 14:15 - 15:00","下午 15:15 - 16:00","下午 16:15 - 17:00","晚上 18:00 - 18:45","晚上 19:00 - 19:45","晚上 20:00 - 20:45","晚上 21:00 - 21:45"],note:"保養日(每月第二及第四個星期一 07:00-13:00)首節改 14:15"}
];
const LIBRARIES=[{id:"tkolib",name:"將軍澳公共圖書館",address:"將軍澳寶林運隆路 9 號",addrEn:"9 Wan Lung Road, Po Lam, Tseung Kwan O",addrCn:"将军澳宝林运隆路 9 号",phone:"2706 7646",officialUrl:"https://www.hkpl.gov.hk/tc/locations/sai-kung/library/tseung-kwan-o.html",weekly:[{day:"星期一",time:"12:00-20:00"},{day:"星期二",time:"09:00-20:00"},{day:"星期三",time:"09:00-20:00"},{day:"星期四",time:"09:00-20:00"},{day:"星期五",time:"09:00-20:00"},{day:"星期六",time:"09:00-20:00"},{day:"星期日",time:"09:00-17:00"},{day:"公眾假期",time:"09:00-17:00"}]},
{id:"tklib",name:"調景嶺公共圖書館",address:"將軍澳翠嶺路 4 號",addrEn:"4 Chui Ling Road, Tseung Kwan O, N.T.",addrCn:"将军澳翠岭路 4 号",phone:"2706 7646",officialUrl:"https://www.hkpl.gov.hk/tc/locations/sai-kung/library/tiu-keng-leng.html",weekly:[{day:"星期一",time:"09:00-22:00"},{day:"星期二",time:"09:00-22:00"},{day:"星期三",time:"09:00-22:00"},{day:"星期四",time:"12:00-22:00"},{day:"星期五",time:"09:00-22:00"},{day:"星期六",time:"09:00-20:00"},{day:"星期日",time:"09:00-17:00"},{day:"公眾假期",time:"09:00-17:00"}]}];
const RVM_FACILITIES=[
{name:"彩明商場",addr:"調景嶺彩明街1號彩明商場一期3樓 (近 3-4號電梯)",addrEn:"3/F, Phase 1, Choi Ming Shopping Centre, 1 Choi Ming Street, Tiu Keng Leng",hours:"06:00-00:00"},
{name:"新都城中心三期",addr:"將軍澳貿業路8號1樓(近116號舖)",addrEn:"1/F, Metro City Plaza Phase 3, 8 Mau Yip Road, Tseung Kwan O (near Shop 116)",hours:"10:00-22:00"},
{name:"PopCorn",addr:"唐俊街9號 PopCorn 2 一樓(近寶盈花園天橋)",addrEn:"1/F, PopCorn 2, 9 Tong Chun Street, Tseung Kwan O (near footbridge to Verbena Heights)",hours:"06:00-00:00"},
{name:"寶林商場",addr:"寶琳北路18號3樓(智郵站旁)",addrEn:"3/F, Po Lam Shopping Centre, 18 Po Lam Road North, Tseung Kwan O (next to iPostal)",hours:"07:00-00:00"},
{name:"The LOHAS",addr:"康城路1號3樓(近336號舖)",addrEn:"3/F, The LOHAS, 1 Lohas Park Road, Tseung Kwan O (near Shop 336)",hours:"24小時"},
{name:"TKO Spot",addr:"唐明街2號1樓(近1號扶手電梯)",addrEn:"1/F, TKO Spot, 2 Tong Ming Street, Tseung Kwan O (near Escalator 1)",hours:"09:00-22:00"},
{name:"怡明邨",addr:"至善街6號怡情樓地下",addrEn:"G/F, Yee Ching House, Yee Ming Estate, 6 Chi Shin Street, Tseung Kwan O",hours:"07:00-22:00"},
{name:"海悅豪園商場",addr:"培成路18號 UG/F(近UG02-03)",addrEn:"UG/F, Marina Garden Shopping Arcade, 18 Pui Shing Road, Tseung Kwan O (near UG02-03)",hours:"24小時"}
];


function renderLibraries(){
 const now=hkNow(); let day=now.getDay();
 let today=LDAY[currentLang][day];
 return LIBRARIES.map(l=>{
   let todayRow=l.weekly.find(w=>w.day===LDAY.zh[day]);
   let nm=hkMinutes(now);
   let r=todayRow?parseRange(todayRow.time):null;
   let st=r?sessionStatus(r,nm):{text:t('closed'),cls:"status-closed"};
   // 是日已結束（時段完結後）→ 休館，同泳池/運動場一致
   if(st.cls==="done") st={text:t('closed'),cls:"status-closed"};
   let badgeCls = st.cls==="open"?"status-open":st.cls==="soon"?"status-upcoming":"status-closed";
   let badgeText = st.text===t('open')?t('open'):st.text;
   let rows=l.weekly.map(w=>{
     let isToday=w.day===LDAY.zh[day];
     return `<div class="session" style="${isToday?'background:#f0fdf4;border-radius:6px;padding:6px 8px':''}"><span class="session-time">${trDay(w.day,currentLang)} ${w.time}${isToday?' ← '+t('today'):''}</span><span class="session-status ${isToday?st.cls:'done'}">${isToday?badgeText:''}</span></div>`
   }).join("");
   let official=officialLink(l.officialUrl,'viewLib');
   let warnHtml='';
   const lw=wWarn();
   // 一號/三號戒備信號期間圖書館照常開放 → 只顯示嚴重天氣（T8/9/10、黑雨）
   const libCritical=lw.severe.filter(s=>/八號|九號|十號|黑色暴雨|Signal No\. [89]|Black Rainstorm/.test(s));
   if(libCritical.length){
     warnHtml=`<div class="notice" style="background:#fee2e2;border-color:#fecaca;color:#991b1b">⚠️ ${t('weatherWarn')}：${libCritical.join('、')} — ${t('libMayClose')}</div>`;
   }
   return `<div class="card collapsed" id="${l.id}"><div class="facility-header" onclick="toggleCard(this)"><div><div class="facility-name">${lname(l.id)}</div><div class="facility-address">${addr(l)}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="status-badge ${badgeCls}">${badgeText}</span><span class="expand-hint" data-expand="${t('expand')}" data-collapse="${t('collapse')}"></span></div></div><div class="facility-body"><div class="schedule-section"><div class="schedule-title">${t('libhours')}</div>${rows}</div>${warnHtml}${official}</div></div>`
 }).join("");
}
let rvmData=null;
let sportGroundData=null;
async function loadRVM(){
 try{const r=await fetch('rvm_status.json');if(r.ok)rvmData=await r.json();}catch(e){}
 renderAll();
}
async function loadSportGround(){
 try{const r=await fetch('sport_ground_status.json?v='+Date.now());if(r.ok)sportGroundData=await r.json();}catch(e){}
 renderAll();
}
function renderSportGround(){
 if(!sportGroundData) return '<div class="notice">載入中... / Loading...</div>';
 const sd=sportGroundData;
 // 即時計算 overall：依目前時間兩場地嘅 code 推導（唔用 sync 時嘅靜態值）
 function fieldNow(slots){
   if(!slots||!slots.length) return 'none'; // 無數據
   const nowM=hkNow().getHours()*60+hkNow().getMinutes();
   const cur=slots.find(x=>{const m=x.time.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);if(!m)return false;const s=parseInt(m[1])*60+parseInt(m[2]),e=parseInt(m[3])*60+parseInt(m[4]);return nowM>=s&&nowM<e;});
   if(!cur) return 'closed'; // 無現行時段 = 是日已結束
   return(cur.code==='A'||cur.code==='L')?'open':'closed';
 }
 const mNow=fieldNow(sd.mainField), sNow=fieldNow(sd.secondaryField);
 let overall;
 if(mNow==='closed'&&sNow==='closed') overall={text:t('closed'),cls:'status-closed'}; // 休館（是日結束）
 else if(mNow==='open'&&sNow==='open') overall={text:t('open'),cls:'status-open'};
 else overall={text:t('partial'),cls:'status-partial'};
 // 唔再用 closures 覆蓋 overall：公告只係個別時段暫停，唔代表全場關閉（fieldNow 已按現行時段 code 判斷）
 // Helper: code → CSS class (M=dark red, B=light red)
 const codeClsMap={A:'code-a',L:'code-l',B:'code-b',M:'code-m'};
 const codeZh={A:'開放',L:'部分線道',B:'預訂暫停',M:'關閉'};
 const codeEn={A:'Open',L:'Limited',B:'Booking',M:'Closed'};
 const isZh=currentLang==='zh', isEn=currentLang==='en';
 function codeTag(c,timeStr,isToday){
   if(!c) return '';
   let txt=isZh?(codeZh[c]||c):isEn?(codeEn[c]||c):(codeZh[c]||c);
   // compute real-time current/expired from client clock — only today column breathes/greys
   if(timeStr && isToday){
     let m2=timeStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
     if(m2){
       let sH=parseInt(m2[1])*60+parseInt(m2[2]), eH=parseInt(m2[3])*60+parseInt(m2[4]);
       let nowM=hkNow().getHours()*60+hkNow().getMinutes();
       if(nowM>=sH && nowM<eH && (c==='A'||c==='L')) return `<span class="code-a-active">${txt}</span>`;
       if(nowM>=eH && (c==='A'||c==='L')) return `<span class="code-expired">${t("expiredLabel")}</span>`;
     }
   }
   let cls=codeClsMap[c]||'code-a';
   return `<span class="${cls}">${txt}</span>`;
 }
 // Build today+tomorrow grid
 let tmLabel=isZh?' tomorrow':(isEn?' tomorrow':'明日');
 let todayLabel=(sd.todayDate||'today').replace(/^\d{4}\//,'');
 let tomLabel=(sd.tomorrowDate||'').replace(/^\d{4}\//,'');
 let header=`<div style="display:grid;grid-template-columns:80px 1fr 1fr 1fr 1fr;gap:4px;margin-bottom:8px;font-size:.65rem;color:#94a3b8;text-align:center"><div>⏰</div><div style="border-bottom:2px solid #0ea5e9;padding:4px">🏟️ ${t("mainField")}</div><div style="border-bottom:2px solid #0ea5e9;padding:4px">⚽ ${t("secField")}</div><div style="border-bottom:2px solid #94a3b8;padding:4px">🏟️ ${t("mainField")}</div><div style="border-bottom:2px solid #94a3b8;padding:4px">⚽ ${t("secField")}</div></div><div style="display:grid;grid-template-columns:80px 1fr 1fr 1fr 1fr;gap:4px;margin-bottom:6px;font-size:.60rem;color:#94a3b8;text-align:center"><div></div><div style="color:#0ea5e9">${todayLabel} ${t("todayLabel")}</div><div style="color:#0ea5e9">${todayLabel} ${t("todayLabel")}</div><div style="color:#94a3b8">${tomLabel} ${t("tomorrowLabel")}</div><div style="color:#94a3b8">${tomLabel} ${t("tomorrowLabel")}</div></div>`;
 let allTimes=[...new Set([...(sd.mainField||[]).map(x=>x.time), ...(sd.secondaryField||[]).map(x=>x.time)])].sort();
 let tm=new Map();
 (sd.mainField||[]).forEach(x=> tm.set('m:'+x.time, x));
 (sd.secondaryField||[]).forEach(x=> tm.set('s:'+x.time, x));
 let grid='';
 // Build tomorrow maps
 let tm2=new Map();
 (sd.mainFieldTomorrow||[]).forEach(x=> tm2.set('m:'+x.time, x));
 (sd.secondaryFieldTomorrow||[]).forEach(x=> tm2.set('s:'+x.time, x));
 allTimes.forEach(ts=>{
   let mm=tm.get('m:'+ts), ss=tm.get('s:'+ts);
   let mm2=tm2.get('m:'+ts), ss2=tm2.get('s:'+ts);
   // real-time is_current from client clock (today only)
   let sH, eH, nowM, cur=false;
   let mm2t=ts.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
   if(mm2t){ sH=parseInt(mm2t[1])*60+parseInt(mm2t[2]); eH=parseInt(mm2t[3])*60+parseInt(mm2t[4]); nowM=hkNow().getHours()*60+hkNow().getMinutes(); cur=nowM>=sH && nowM<eH; }
   let hl=cur?'background:#f0fdf4;border-radius:6px;padding:2px 4px;margin:1px 0':'';
   grid+=`<div style="display:grid;grid-template-columns:80px 1fr 1fr 1fr 1fr;gap:6px;padding:4px 0;border-bottom:1px solid #f1f5f9;font-size:.72rem;align-items:center;${hl}"><span style="color:#475569;font-size:.70rem;white-space:nowrap">${ts}</span><span style="text-align:center">${codeTag(mm?mm.code:'',ts,true)}</span><span style="text-align:center">${codeTag(ss?ss.code:'',ts,true)}</span><span style="text-align:center">${codeTag(mm2?mm2.code:'',null,false)}</span><span style="text-align:center">${codeTag(ss2?ss2.code:'',null,false)}</span></div>`;
 });
 // Legend
 let legend='<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;font-size:.68rem;color:#64748b"><span class="code-a" style="display:inline-flex;align-items:center;gap:3px">A 開放</span><span class="code-l" style="display:inline-flex;align-items:center;gap:3px">L 部分線道</span><span class="code-b" style="display:inline-flex;align-items:center;gap:3px">B 預訂暫停</span><span class="code-m" style="display:inline-flex;align-items:center;gap:3px">M 關閉</span></div>';
 // Closures
 let closures=(sd.closures||[]).map(c=>`<div class="notice" style="border-left:4px solid #dc2626">⚠️ ${t('closure')}（${c.date||''}）— ${c.facilities||''} ${c.reason||''} ${c.time||''}</div>`).join('');
 // 定期保養日恆常告示
 let maintInfo='';
 if(sd.maintenance){
   let m=sd.maintenance;
   maintInfo=`<div class="notice" style="background:#fee2e2;border-color:#fecaca">🧹 ${t("maintNotice")}：${t("mainField")} ${m.main} · ${t("secField")} ${m.sec}</div>`;
 }
 // Address with Google Maps
 let gmapUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('將軍澳寶康路109號 Tseung Kwan O Sports Ground');
 // Official link + last updated
 let xlsxDate=sd.xlsxDate?` · ${t("xlsxDateLabel")}：${sd.xlsxDate}`:'';
 let xlsxFileDate=sd.xlsxFileDate?`<div style="font-size:.7rem;color:#94a3b8;margin-top:2px">${t("xlsxFileDateLabel")}：${sd.xlsxFileDate}</div>`:'';
 let official=`<div style="text-align:center;margin-top:10px"><a href="${sd.noticeUrl||'#'}" target="_blank" rel="noopener" style="font-size:.8rem;color:#1e3a8a;text-decoration:underline">${t("viewTimetable")} →${xlsxDate}</a>${xlsxFileDate}</div>`;
 return `<div class="card collapsed" id="sportground-card"><div class="facility-header" onclick="toggleCard(this)"><div><div class="facility-name">將軍澳運動場</div><div class="facility-address"><a href="${gmapUrl}" target="_blank" rel="noopener" style="color:#1e3a8a;text-decoration:none">將軍澳寶康路109號 📍</a> · 400m跑道</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="status-badge ${overall.cls}">${overall.text}</span><span class="expand-hint" data-expand="${t('expand')}" data-collapse="${t('collapse')}"></span></div></div><div class="facility-body">${closures}${maintInfo}<div class="schedule-section" style="margin-top:0;padding-top:0;border-top:none">${header}${grid}</div>${legend}${official}</div></div>`;
}
function renderRVM(){
 const now=hkNow(), nm=hkMinutes(now);
 const items=RVM_FACILITIES.map(r=>{
   let cls='rvm-status-operating', txt=t('rvm_open');
   // 先計時段：非服務時間一律顯示「非服務時間」（24小時例外）
   let inHours=true;
   if(r.hours!=='24小時'){
     const rng=parseRange(r.hours);
     const st=sessionStatus(rng,nm);
     inHours=st.cls==='open'||st.cls==='soon';
   }
   if(!inHours){cls='rvm-status-maintenance';txt=t('rvm_closed');}
   else if(rvmData && rvmData.machines && rvmData.machines[r.name]){
     const m=rvmData.machines[r.name];
     if(m.cat==='full'){cls='rvm-status-full';txt=t('rvm_full')||'已滿';}
     else if(m.cat==='nearly_full'){cls='rvm-status-nearly-full';txt=t('rvm_nearly_full')||'快將滿溢';}
     else if(m.cat==='maintenance'){cls='rvm-status-maintenance';txt=t('rvm_maint')||'維護中';}
     else{cls='rvm-status-operating';txt=t('rvm_open');}
   }else{
     cls='rvm-status-operating';txt=t('rvm_open');
   }
   return `<div class="rvm-item"><div class="rvm-info"><div class="rvm-name">${tl('rvm',r.name)}</div><div class="rvm-address">${addrRVM(r)}</div><div class="rvm-hours">${r.hours}</div></div><span class="rvm-status ${cls}">${txt}</span></div>`
 }).join("");
 const syncTime=rvmData?rvmData.lastSync:now.toLocaleString('zh-HK',{hour12:false}).replace(/\//g,'-');
 return `<div class="rvm-card"><div class="rvm-grid">${items}</div><div class="rvm-sync">${t('sync')}：${syncTime}</div><div style="text-align:center;margin-top:8px"><a href="https://www.hkrvms3.com.hk/hk/" target="_blank" rel="noopener" style="font-size:.75rem;color:#1e3a8a;text-decoration:underline">hkrvms3.com.hk — ${t("rvmOfficialMap")} ↗</a></div></div>`;
}

window.DISTRICT={
 pools:FACILITIES,
 playrooms:PLAYROOMS,
 renderers:[
  ['facilities','renderPools'],
  ['sportground-grid','renderSportGround'],
  ['playrooms','renderPlayrooms'],
  ['libraries','renderLibraries'],
  ['rvm-facilities','renderRVM']
 ],
 secMap:{swim:()=>t('pools'),sportground:()=>currentLang==='en'?'🏟️ Tseung Kwan O Sports Ground':(currentLang==='cn'?'🏟️ 将军澳运动场':'🏟️ 將軍澳運動場'),playroom:()=>t('playrooms'),library:()=>t('library'),rvm:()=>t('rvm')},
 navTxt:()=>[t('pools')+' (2)',currentLang==='en'?'🏟️ Sports Ground (1)':(currentLang==='cn'?'🏟️ 运动场 (1)':'🏟️ 運動場 (1)'),t('playrooms')+' (3)',t('library')+' (2)',t('rvm')+' (8)']
};