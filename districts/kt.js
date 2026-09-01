// districts/kt.js — 觀塘區 config。必須喺 common.js 之前載入。
const I18N={
 zh:{title:"觀塘區康樂設施運作情況",pools:"🏊 游泳池",playrooms:"🎮 兒童遊戲室",sports:"🏟️ 體育館",tennis:"🎾 網球場",football:"⚽ 足球場",cycling:"🚲 單車場",other:"🎯 其他設施",open:"營運中",soon:"即將開始",done:"已結束",closed:"休館",partial:"部分開放",maint:"維修中",closed_today:"暫停開放",cleaningClosed:"暫停清潔中",hours:"開放時段",today:"今日",lastUpd:"最後更新",src:"數據來源：康文署 · 觀塘區議會",view:"查看康文署官網 →",expand:"[展開 +]",collapse:"[收合 −]",sync:"最近同步",closure:"暫停開放公告",closureReason:"因",upcoming:"即將開放",mainPool:"主池",closedNote:"今日暫停",cleaningNote:"是日為清潔日，目前暫停，時間為上午10時至第二節開放時段完結為止，而泳池會於同日第三節重開。",cleaningDay:"今日為每周大清潔日",weatherWarn:"天氣警示",sun:"日",mon:"一",tue:"二",wed:"三",thu:"四",fri:"五",sat:"六",holiday:"公眾假期",buyCoffee:"請我飲咖啡",contactAuthor:"聯絡作者",share:"分享",backToTop:"返回頂部",hardRefresh:"🔄 強制重新整理",copied:"已複製",artificial:"人造草地",natural:"天然草地"},
 en:{title:"Kwun Tong Leisure Facilities Status",pools:"🏊 Swimming Pools",playrooms:"🎮 Playrooms",sports:"🏟️ Sports Centres",tennis:"🎾 Tennis Courts",football:"⚽ Football Pitches",cycling:"🚲 Cycling Tracks",other:"🎯 Other Facilities",open:"Open",soon:"Opening Soon",done:"Closed",closed:"Closed",partial:"Partially Open",maint:"Maintenance",closed_today:"Suspended",cleaningClosed:"Cleaning",hours:"Opening Sessions",today:"Today",lastUpd:"Last updated",src:"Data: LCSD · Kwun Tong DC",view:"View LCSD official page →",expand:"[Expand +]",collapse:"[Collapse −]",sync:"Last synced",closure:"Closure Notice",closureReason:"due to",upcoming:"Opens Soon",mainPool:"Main Pool",closedNote:"Suspended today",cleaningNote:"Cleaning day today. Pool suspended from 10:00 to end of session 2. Reopens in session 3.",cleaningDay:"Weekly cleaning day",weatherWarn:"Weather Warning",sun:"Sun",mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",holiday:"Public Holiday",buyCoffee:"Buy me a coffee",contactAuthor:"Contact author",share:"Share",backToTop:"Back to top",hardRefresh:"🔄 Force Refresh",copied:"Copied",artificial:"Artificial Turf",natural:"Natural Grass"},
 cn:{title:"观塘区康乐设施运作情况",pools:"🏊 游泳池",playrooms:"🎮 兒童遊戲室",sports:"🏟️ 体育馆",tennis:"🎾 网球场",football:"⚽ 足球场",cycling:"🚲 单车场",other:"🎯 其他设施",open:"营运中",soon:"即将开始",done:"已结束",closed:"休馆",partial:"部分开放",maint:"维修中",closed_today:"暂停开放",cleaningClosed:"暂停清洁中",hours:"开放时段",today:"今日",lastUpd:"最后更新",src:"数据来源：康文署 · 观塘区议会",view:"查看康文署官网 →",expand:"[展开 +]",collapse:"[收合 −]",sync:"最近同步",closure:"暂停开放公告",closureReason:"因",upcoming:"即将开放",mainPool:"主池",closedNote:"今日暂停",cleaningNote:"是日为清洁日，目前暂停，时间为上午10时至第二节开放时段完结为止，而泳池会于同日第三节重开。",cleaningDay:"今日为每周大清洁日",weatherWarn:"天气警示",sun:"日",mon:"一",tue:"二",wed:"三",thu:"四",fri:"五",sat:"六",holiday:"公众假期",buyCoffee:"请我喝咖啡",contactAuthor:"联系作者",share:"分享",backToTop:"返回顶部",hardRefresh:"🔄 强制重新整理",copied:"已复制",artificial:"人造草地",natural:"天然草地"}
};
const NAME_L10N={
 ktswim:{zh:"觀塘游泳池",en:"Kwun Tong Swimming Pool",cn:"观塘游泳池"},
 ltswim:{zh:"藍田游泳池",en:"Lam Tin Swimming Pool",cn:"蓝田游泳池"},
 jvswim:{zh:"佐敦谷游泳池",en:"Jordan Valley Swimming Pool",cn:"佐敦谷游泳池"},
 "ct-kb":{zh:"九龍灣公園單車場",en:"Kowloon Bay Park Cycling Track",cn:"九龙湾公园单车场"},
 "ct-klt":{zh:"功樂道遊樂場單車場",en:"Kung Lok Road Recreation Ground Cycling Track",cn:"功乐道游乐场单车场"},
 "sc-cwr":{zh:"彩榮路體育館",en:"Choi Wing Road Sports Centre",cn:"彩荣路体育馆"},
 "sc-chd":{zh:"振華道體育館",en:"Chun Wah Road Sports Centre",cn:"振华道体育馆"},
 "sc-hks":{zh:"曉光街體育館",en:"Hiu Kwong Street Sports Centre",cn:"晓光街体育馆"},
 "sc-kwb":{zh:"九龍灣體育館",en:"Kowloon Bay Sports Centre",cn:"九龙湾体育馆"},
 "sc-lts":{zh:"藍田（南）體育館",en:"Lam Tin (South) Sports Centre",cn:"蓝田（南）体育馆"},
 "sc-lym":{zh:"鯉魚門體育館",en:"Lei Yue Mun Sports Centre",cn:"鲤鱼门体育馆"},
 "sc-ntk":{zh:"牛頭角道體育館",en:"Ngau Tau Kok Road Sports Centre",cn:"牛头角道体育馆"},
 "sc-shs":{zh:"瑞和街體育館",en:"Shui Wo Street Sports Centre",cn:"瑞和街体育馆"},
 "sc-slb":{zh:"順利邨體育館",en:"Shun Lee Estate Sports Centre",cn:"顺利邨体育馆"},
 "tc-hms":{zh:"曉明街網球場",en:"Hiu Ming Street Tennis Court",cn:"晓明街网球场"},
 "tc-hlp":{zh:"康寧道公園網球場",en:"Hong Ning Road Park Tennis Court",cn:"康宁道公园网球场"},
 "tc-sfd":{zh:"茜發道網球場",en:"Sin Fat Road Tennis Court",cn:"茜发道网球场"},
 "tc-jvp":{zh:"佐敦谷遊樂場網球場",en:"Jordan Valley Playground Tennis Court",cn:"佐敦谷游乐场网球场"},
 "tc-psp":{zh:"坪石遊樂場網球場",en:"Ping Shek Playground Tennis Court",cn:"坪石游乐场网球场"},
 "tc-slp":{zh:"順利邨公園網球場",en:"Shun Lee Estate Park Tennis Court",cn:"顺利邨公园网球场"},
 "fp-art":{zh:"人造草地足球場",en:"Artificial Turf Football Pitch",cn:"人造草地足球场"},
 "fp-nat":{zh:"天然草地足球場",en:"Natural Grass Football Pitch",cn:"天然草地足球场"}
,"playroom-kt-cwr":{zh:"彩榮路體育館兒童遊戲室",en:"Choi Wing Road Sports CentrePlayroom",cn:"彩榮路体育馆儿童游戏室"},"playroom-kt-lts":{zh:"藍田（南）體育館兒童遊戲室",en:"Lam Tin (South) Sports CentrePlayroom",cn:"蓝田（南）体育馆儿童游戏室"},"playroom-kt-lym":{zh:"鯉魚門體育館兒童遊戲室",en:"Lei Yue Mun Sports CentrePlayroom",cn:"鲤鱼门体育馆儿童游戏室"},"playroom-kt-slb":{zh:"順利邨體育館兒童遊戲室",en:"Shun Lee Estate Sports CentrePlayroom",cn:"顺利邨体育馆儿童游戏室"}};
const SUB_L10N={
  pool:{主池:"Main Pool",訓練池:"Training Pool","習泳池 1":"Teaching Pool 1","習泳池 2":"Teaching Pool 2",習泳池:"Teaching Pool",跳水池:"Diving Pool",戲水池:"Splash Pool","嬉水池 1":"Children's Pool 1","嬉水池 2 (滑水梯)":"Children's Pool 2 (Water Slide)",日光浴場:"Sunbathing Area",副池:"Secondary Pool","習泳池 1&2":"Teaching Pools 1&2",奇妙水世界:"Wonder Water World",極限運動:"Extreme Sports",海洋世界:"Ocean World"},
  theme:{動物王國:"Animal Kingdom",天空:"Sky",海洋世界:"Ocean World",森林:"Forest",奇妙水世界:"Wonder Water World",極限運動:"Extreme Sports"},
  rvm:{彩明商場:"Choi Ming Shopping Centre","新都城中心三期":"Metro City Plaza Phase 3",PopCorn:"PopCorn",寶林商場:"Po Lam Shopping Centre","The LOHAS":"The LOHAS","TKO Spot":"TKO Spot",怡明邨:"Yee Ming Estate","海悅豪園商場":"Marina Garden Shopping Arcade"},
  note:{"保養日(每月第二及第四個星期二 07:00-13:00)首節改 13:30":"Maintenance day (2nd & 4th Tue 07:00-13:00): first session moves to 13:30","保養日(每月第一及第三個星期二 07:00-13:00)首節改 13:30":"Maintenance day (1st & 3rd Tue 07:00-13:00): first session moves to 13:30","保養日(每月第二及第四個星期一 07:00-13:00)首節改 14:15":"Maintenance day (2nd & 4th Mon 07:00-13:00): first session moves to 14:15"}
};

const POOLS=[
{id:"ktswim",name:"觀塘游泳池",address:"九龍觀塘翠屏道2號",addrEn:"2 Tsui Ping Road, Kwun Tong, Kowloon",addrCn:"九龙观塘翠屏道 2 号",phone:"2717 9022 / 2347 8140",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Swimming.do?swpId=18",sessions:["06:30 - 12:00","13:00 - 18:00","19:00 - 22:00"],closures:[{"date": "2026/09/11", "time": "07:30 - 16:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/12", "time": "07:30 - 15:00", "pools": "主池", "reason": "游泳比賽", "remarks": "", "poolsEn": "Main pool", "reasonEn": "Competition", "remarksEn": ""}, {"date": "2026/09/15", "time": "07:30 - 15:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/18", "time": "07:30 - 15:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/19", "time": "07:30 - 15:00", "pools": "主池", "reason": "游泳比賽", "remarks": "", "poolsEn": "Main pool", "reasonEn": "Competition", "remarksEn": ""}, {"date": "2026/09/22", "time": "07:30 - 15:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/25", "time": "07:30 - 16:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/28", "time": "07:30 - 16:00", "pools": "主池", "reason": "學校水運會", "remarks": "", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}, {"date": "2026/09/29", "time": "07:30 - 14:00", "pools": "主池", "reason": "學校水運會", "remarks": "在十一月中至翌年四月中期間會提供暖水游泳池設施。", "poolsEn": "Main pool", "reasonEn": "School Swimming Gala", "remarksEn": ""}],maintenance:[{"pool": "戶外泳池", "start": "11/1", "end": "4/15", "nextYear": true}, {"pool": "室內泳池", "start": "1/2", "end": "2/21", "nextYear": false}],cleaning:{"day": "三", "fallback": "五"},facilities:[{name:"主池",spec:"50.03米 x 25米，水深 1.4-1.9米",status:"open"},{name:"訓練池",spec:"25米 x 30米，水深 1.2米",status:"open"},{name:"副池",spec:"50米 x 21米，水深 1.1-1.4米",status:"open"},{name:"習泳池 1&2",spec:"25米 x 12.5米，水深 0.7-0.9米",status:"open"},{name:"日光浴場",spec:"戶外",status:"open"}],schedule:{summer:[{session:"第一節",time:"06:30 - 12:00"},{session:"第二節",time:"13:00 - 18:00"},{session:"第三節",time:"19:00 - 22:00"}],cleaning:"每周大清潔：上午10時至第二節結束，第三節重開"}},
{id:"ltswim",name:"藍田游泳池",address:"九龍藍田慶田街1號藍田綜合大樓1樓",addrEn:"Lam Tin, Kowloon",addrCn:"九龙蓝田",phone:"2205 6535, 2205 6711",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Swimming.do?swpId=42",sessions:["06:30 - 12:00","13:00 - 18:00","19:00 - 22:00"],closures:[],maintenance:[{"pool": "全場", "start": "4/16", "end": "6/5", "nextYear": false}],cleaning:{"day": "四", "fallback": "一"},facilities:[{name:"訓練池",spec:"25米 x 25米，水深 1.2-1.4米",status:"open"},{name:"習泳池",spec:"25米 x 10米，水深 0.7-0.9米",status:"open"},{name:"日光浴場",spec:"戶外",status:"open"}],schedule:{summer:[{session:"第一節",time:"06:30 - 12:00"},{session:"第二節",time:"13:00 - 18:00"},{session:"第三節",time:"19:00 - 22:00"}],cleaning:"每周大清潔：上午10時至第二節結束，第三節重開"}},
{id:"jvswim",name:"佐敦谷游泳池",address:"九龍牛頭角彩霞道6號",addrEn:"Jordan Valley, Kowloon",addrCn:"九龙佐敦谷",phone:"2305 5919, 2305 5920",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Swimming.do?swpId=17",sessions:["06:30 - 12:00","13:00 - 18:00","19:00 - 22:00"],closures:[{"date": "2026/09/01", "time": "06:30 - 12:00", "pools": "嬉水池 (2), 嬉水池 (3)", "reason": "其他", "remarks": "", "poolsEn": "Leisure Pool (2), Leisure Pool (3)", "reasonEn": "Others", "remarksEn": ""}, {"date": "2026/09/01", "time": "13:00 - 18:00", "pools": "訓練池 , 嬉水池 (2), 嬉水池 (3)", "reason": "其他", "remarks": "", "poolsEn": "Training Pool, Leisure Pool (2), Leisure Pool (3)", "reasonEn": "Others", "remarksEn": ""}, {"date": "2026/09/01", "time": "19:00 - 22:00", "pools": "嬉水池 (2), 嬉水池 (3)", "reason": "其他", "remarks": "", "poolsEn": "Leisure Pool (2), Leisure Pool (3)", "reasonEn": "Others", "remarksEn": ""}],maintenance:[{"pool": "全場", "start": "11/1", "end": "3/31", "nextYear": true}],cleaning:{"day": "二", "fallback": "四"},facilities:[{name:"訓練池",spec:"25米 x 11米，水深 1-1.4米",status:"open"},{name:"嬉水池 1",spec:"不規則形狀，水深 0.6米",status:"open"},{name:"嬉水池 2&3",spec:"不規則形狀，水深 0.2-0.6米",status:"open"},{name:"嬉水池 4",spec:"不規則形狀，水深 0.2-0.3米",status:"open"}],schedule:{summer:[{session:"第一節",time:"06:30 - 12:00"},{session:"第二節",time:"13:00 - 18:00"},{session:"第三節",time:"19:00 - 22:00"}],cleaning:"每周大清潔：上午10時至第二節結束，第三節重開"}}
];

const PLAYROOMS=[
{id:"playroom-kt-cwr",name:"彩榮路體育館兒童遊戲室",address:"九龍觀塘彩榮路58號",addrEn:"58 Choi Wing Road, Kwun Tong",addrCn:"九龙观塘彩荣路58号",theme:"動物王國",area:"350m²",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Facility/Details.do?ftid=15&did=6&fcid=",sessions:["早上 9:00 - 9:45","早上 10:00 - 10:45","早上 11:00 - 11:45","中午 12:00 - 12:45","下午 13:30 - 14:15","下午 14:30 - 15:15","下午 15:30 - 16:15","下午 16:30 - 17:15","晚上 18:00 - 18:45","晚上 19:00 - 19:45","晚上 20:00 - 20:45","晚上 21:00 - 21:45"],note:"保養日(每月第一及第三個星期一 09:00-15:00)首節改 15:30"},
{id:"playroom-kt-lts",name:"藍田（南）體育館兒童遊戲室",address:"九龍觀塘藍田碧雲道170號",addrEn:"170 Pik Wan Road, Lam Tin, Kwun Tong",addrCn:"九龙观塘蓝田碧云道170号",theme:"天空",area:"130m²",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Facility/Details.do?ftid=15&did=6&fcid=",sessions:["早上 9:00 - 9:45","早上 10:00 - 10:45","早上 11:00 - 11:45","中午 12:00 - 12:45","下午 13:30 - 14:15","下午 14:30 - 15:15","下午 15:30 - 16:15","下午 16:30 - 17:15","晚上 18:00 - 18:45","晚上 19:00 - 19:45","晚上 20:00 - 20:45","晚上 21:00 - 21:45"],note:"保養日(每月第二及第四個星期三 09:00-15:00)首節改 15:30"},
{id:"playroom-kt-lym",name:"鯉魚門體育館兒童遊戲室",address:"九龍油塘鯉魚門徑6號鯉魚門市政大廈2樓",addrEn:"2/F, Lei Yue Mun Municipal Services Building, 6 Lei Yue Mun Path, Yau Tong",addrCn:"九龙油塘鲤鱼门径6号鲤鱼门市政大厦2楼",theme:"海洋世界",area:"150m²",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Facility/Details.do?ftid=15&did=6&fcid=",sessions:["早上 9:00 - 9:45","早上 10:00 - 10:45","早上 11:00 - 11:45","中午 12:00 - 12:45","下午 13:00 - 13:45","下午 14:30 - 15:15","下午 15:30 - 16:15","下午 16:30 - 17:15","晚上 17:30 - 18:15","晚上 19:00 - 19:45","晚上 20:00 - 20:45","晚上 21:00 - 21:45"],note:"保養日(每月第二及第四個星期一 09:00-15:00)首節改 15:30"},
{id:"playroom-kt-slb",name:"順利邨體育館兒童遊戲室",address:"九龍觀塘順利邨道33號",addrEn:"33 Shun Lee Estate Road, Kwun Tong",addrCn:"九龙观塘顺利邨道33号",theme:"森林",area:"167m²",officialUrl:"https://www.lcsd.gov.hk/clpss/tc/webApp/Facility/Details.do?ftid=15&did=6&fcid=",sessions:["早上 9:00 - 9:45","早上 10:00 - 10:45","早上 11:00 - 11:45","中午 12:00 - 12:45","下午 13:00 - 13:45","下午 14:30 - 15:15","下午 15:30 - 16:15","下午 16:30 - 17:15","晚上 17:30 - 18:15","晚上 19:00 - 19:45","晚上 20:00 - 20:45","晚上 21:00 - 21:45"],note:"保養日(每月第一及第三個星期一 09:00-15:00)首節改 15:30"}
];

const SPORTS_CENTRES=[
{id:"sc-cwr",name:"彩榮路體育館",address:"觀塘彩榮路58號",addrEn:"58 Choi Wing Road, Kwun Tong",addrCn:"观塘彩荣路58号",phone:"2721 5918",sessions:["07:00 - 23:00"],maintNote:"每月第1及第3個星期一 09:00–15:00"},
{id:"sc-chd",name:"振華道體育館",address:"牛頭角振華道50號樂雅苑停車場頂樓",addrEn:"R/F, Lok Nga Court Carpark, 50 Chun Wah Road, Ngau Tau Kok",addrCn:"牛头角振华道50号乐雅苑停车场顶楼",phone:"2318 1767",sessions:["07:00 - 23:00"],maintNote:"每月第1及第3個星期一 09:00–15:00"},
{id:"sc-hks",name:"曉光街體育館",address:"九龍觀塘曉光街2號",addrEn:"2 Hiu Kwong Street, Kwun Tong, Kowloon",addrCn:"九龙观塘晓光街2号",phone:"2347 0384",sessions:["07:00 - 23:00"],maintNote:"每月第2及第4個星期一 09:00–15:00"},
{id:"sc-kwb",name:"九龍灣體育館",address:"九龍灣啟樂街15號",addrEn:"15 Kai Lok Street, Kowloon Bay",addrCn:"九龙湾启乐街15号",phone:"2750 9539",sessions:["07:00 - 23:00"],maintNote:"每月第1及第3個星期一 09:00–15:00"},
{id:"sc-lts",name:"藍田（南）體育館",address:"九龍觀塘藍田碧雲道170號",addrEn:"170 Pik Wan Road, Lam Tin, Kwun Tong, Kowloon",addrCn:"九龙观塘蓝田碧云道170号",phone:"2379 9254",sessions:["07:00 - 23:00"]},
{id:"sc-lym",name:"鯉魚門體育館",address:"九龍油塘鯉魚門徑6號鯉魚門市政大廈2–5樓",addrEn:"2-5/F, Lei Yue Mun Municipal Services Building, 6 Lei Yue Mun Path, Yau Tong, Kowloon",addrCn:"九龙油塘鲤鱼门径6号鲤鱼门市政大厦2–5楼",phone:"2349 3954",sessions:["07:00 - 23:00"],maintNote:"每月第2及第4個星期一 09:00–15:00"},
{id:"sc-ntk",name:"牛頭角道體育館",address:"九龍牛頭角道183號牛頭角市政大廈2–4樓",addrEn:"2-4/F, Ngau Tau Kok Municipal Services Building, 183 Ngau Tau Kok Road, Kowloon",addrCn:"九龙牛头角道183号牛头角市政大厦2–4楼",phone:"2756 3466",sessions:["07:00 - 23:00"],maintNote:"每月第2及第4個星期一 09:00–15:00"},
{id:"sc-shs",name:"瑞和街體育館",address:"九龍觀塘瑞和街9號瑞和街市政大廈8–9樓",addrEn:"8-9/F, Shui Wo Street Municipal Services Building, 9 Shui Wo Street, Kwun Tong, Kowloon",addrCn:"九龙观塘瑞和街9号瑞和街市政大厦8–9楼",phone:"2797 3350",sessions:["07:00 - 23:00"],maintNote:"每月第1及第3個星期一 09:00–15:00"},
{id:"sc-slb",name:"順利邨體育館",address:"九龍觀塘順利邨道33號",addrEn:"33 Shun Lee Estate Road, Kwun Tong, Kowloon",addrCn:"九龙观塘顺利邨道33号",phone:"2951 4136",sessions:["07:00 - 23:00"],maintNote:"每月第1及第3個星期一 09:00–15:00"}
];

const TENNIS_COURTS=[
{id:"tc-hms",name:"曉明街網球場",address:"觀塘曉明街17號",addrEn:"17 Hiu Ming Street, Kwun Tong",addrCn:"观塘晓明街17号"},
{id:"tc-hlp",name:"康寧道公園網球場",address:"康寧道",addrEn:"Hong Ning Road",addrCn:"康宁道"},
{id:"tc-sfd",name:"茜發道網球場",address:"觀塘茜發道",addrEn:"Sin Fat Road, Kwun Tong",addrCn:"观塘茜发道"},
{id:"tc-jvp",name:"佐敦谷遊樂場網球場",address:"牛頭角彩霞道",addrEn:"Choi Ha Road, Ngau Tau Kok",addrCn:"牛头角彩霞道"},
{id:"tc-psp",name:"坪石遊樂場網球場",address:"觀塘彩石里",addrEn:"Choi Shek Lane, Kwun Tong",addrCn:"观塘彩石里"},
{id:"tc-slp",name:"順利邨公園網球場",address:"觀塘順利邨道",addrEn:"Shun Lee Estate Road, Kwun Tong",addrCn:"观塘顺利邨道"}
];

const CYCLING_TRACKS=[
{id:"ct-kb",name:"九龍灣公園單車場",address:"九龍九龍灣啟禮道",addrEn:"Kai Lai Road, Kowloon Bay",addrCn:"九龙九龙湾启礼道",hours:"07:00 - 23:00",phone:"2750 0849 / 2343 6123",facilities:"洗手間、更衣室、貯物櫃、21個停車位"},
{id:"ct-klt",name:"功樂道遊樂場單車場",address:"九龍觀塘功樂道",addrEn:"Kung Lok Road, Kwun Tong",addrCn:"九龙观塘功乐道",hours:"07:00 - 23:00",phone:"2797 3681",facilities:"洗手間"}
];

const FOOTBALL_PITCHES=[
{id:"fp-art",name:"人造草地足球場",type:"artificial",venues:[{name:"順利邨公園",addr:"觀塘順利邨道"},{name:"九龍灣公園",addr:"九龍灣啟禮道"}]},
{id:"fp-nat",name:"天然草地足球場",type:"natural",venues:[{name:"九龍灣運動場",addr:"九龍灣啟樂街1號"},{name:"晒草灣遊樂場",addr:"藍田茜發道"},{name:"偉樂街臨時足球場",addr:"觀塘偉樂街"},{name:"九龍灣公園",addr:"九龍灣啟禮道"}]}
];

const HK_HOLIDAYS=["2026/01/01", "2026/02/17", "2026/02/18", "2026/02/19", "2026/04/03", "2026/04/04", "2026/04/06", "2026/04/07", "2026/05/01", "2026/05/25", "2026/06/19", "2026/07/01", "2026/09/26", "2026/10/01", "2026/10/19", "2026/12/25", "2026/12/26", "2027/01/01", "2027/02/06", "2027/02/08", "2027/02/09", "2027/03/26", "2027/03/27", "2027/03/29", "2027/04/05", "2027/05/01", "2027/05/13", "2027/06/09", "2027/07/01", "2027/09/16", "2027/10/01", "2027/10/08", "2027/12/25", "2027/12/27"];

const OTHER_FACILITIES=[
{name:"美式桌球",nameEn:"American Billiards",nameCn:"美式台球",addr:"鯉魚門體育館（油塘鯉魚門徑6號鯉魚門市政大廈2樓）",addrEn:"2/F, Lei Yue Mun Municipal Services Building, 6 Lei Yue Mun Path, Yau Tong",addrCn:"鲤鱼门市政大厦2楼（油塘鲤鱼门径6号）"},
{name:"攀石牆",nameEn:"Climbing Wall",nameCn:"攀岩墙",addr:"室內：鯉魚門體育館；室外：順利邨體育館",addrEn:"Indoor: Lei Yue Mun SC; Outdoor: Shun Lee Estate SC",addrCn:"室内：鲤鱼门体育馆；室外：顺利邨体育馆"},
{name:"門球及高爾夫球發球道",nameEn:"Gateball & Golf Driving Range",nameCn:"门球及高尔夫球发球道",addr:"順利邨體育館（觀塘順利邨道）",addrEn:"Shun Lee Estate Sports Centre (Shun Lee Estate Road)",addrCn:"顺利邨体育馆（观塘顺利邨道）"},
{name:"棒球練習場",nameEn:"Baseball Practice Area",nameCn:"棒球练习场",addr:"晒草灣遊樂場（藍田茜發道）",addrEn:"Sai Tso Wan Recreation Ground (Sin Fat Road, Lam Tin)",addrCn:"晒草湾游乐场（蓝田茜发道）"},
{name:"單車場",nameEn:"Cycling Area",nameCn:"单车场",addr:"九龍灣公園（九龍灣啟禮道）",addrEn:"Kowloon Bay Park (Kai Lai Road)",addrCn:"九龙湾公园（九龙湾启礼道）"},
{name:"體操訓練場",nameEn:"Gymnastics Training Area",nameCn:"体操训练场",addr:"順利邨體育館（觀塘順利邨道）",addrEn:"Shun Lee Estate Sports Centre (Shun Lee Estate Road)",addrCn:"顺利邨体育馆（观塘顺利邨道）"},
{name:"散手訓練場",nameEn:"Karate Training Area",nameCn:"散手训练场",addr:"鯉魚門體育館（油塘鯉魚門徑6號）",addrEn:"Lei Yue Mun Sports Centre (6 Lei Yue Mun Path, Yau Tong)",addrCn:"鲤鱼门体育馆（油塘鲤鱼门径6号）"},
];

function renderSportsCentres(){
 const now=hkNow(), nm=hkMinutes(now);
 return SPORTS_CENTRES.map(f=>{
   let st = facilityOverallStatus(f.sessions, nm);
   let notice='';
   if(f.maintNote){
     notice=`<div class="notice">🔧 ${currentLang==='en'?'Maintenance':currentLang==='cn'?'保养':'保養'}：${f.maintNote}</div>`;
   }
   let sessions=f.sessions.map(s=>{
     let r=parseRange(s);
     let ss=sessionStatus(r,nm);
     return `<div class="session"><span class="session-time">${s}</span><span class="session-status ${ss.cls}">${ss.text}</span></div>`
   }).join("");
   return `<div class="card collapsed" id="${f.id}"><div class="facility-header" onclick="toggleCard(this)"><div><div class="facility-name">${lname(f.id)}</div><div class="facility-address">${addr(f)}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="status-badge ${st.cls}">${st.text}</span><span class="expand-hint" data-expand="${t('expand')}" data-collapse="${t('collapse')}"></span></div></div><div class="facility-body"><div class="schedule-section"><div class="schedule-title">${t('hours')}</div>${sessions}</div>${notice}</div></div>`
 }).join("");
}
function renderTennisCourts(){
 return TENNIS_COURTS.map(f=>{
   // Tennis courts are outdoor, no specific session times in source data → show as open/closed based on generic 07:00-23:00
   const now=hkNow(), nm=hkMinutes(now);
   const st=facilityOverallStatus(["07:00 - 23:00"], nm);
   return `<div class="card collapsed" id="${f.id}"><div class="facility-header" onclick="toggleCard(this)"><div><div class="facility-name">${lname(f.id)}</div><div class="facility-address">${addr(f)}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="status-badge ${st.cls}">${st.text}</span><span class="expand-hint" data-expand="${t('expand')}" data-collapse="${t('collapse')}"></span></div></div><div class="facility-body"><div class="detail-row"><span class="detail-label">${t('hours')}</span><span>07:00 - 23:00</span></div></div></div>`
 }).join("");
}

function renderCyclingTracks(){
 return CYCLING_TRACKS.map(f=>{
   const now=hkNow(), nm=hkMinutes(now);
   const st=facilityOverallStatus([f.hours], nm);
   const a=currentLang==='en'?(f.addrEn||f.addr):(currentLang==='cn'?(f.addrCn||f.addr):f.addr);
   return `<div class="card collapsed" id="${f.id}"><div class="facility-header" onclick="toggleCard(this)"><div><div class="facility-name">${lname(f.id)}</div><div class="facility-address">${a}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="status-badge ${st.cls}">${st.text}</span><span class="expand-hint" data-expand="${t('expand')}" data-collapse="${t('collapse')}"></span></div></div><div class="facility-body"><div class="detail-row"><span class="detail-label">${t('hours')}</span><span>${f.hours}</span></div><div class="detail-row"><span class="detail-label">${currentLang==='en'?'Phone':currentLang==='cn'?'电话':'電話'}</span><span>${f.phone}</span></div><div class="detail-row"><span class="detail-label">${currentLang==='en'?'Facilities':currentLang==='cn'?'設施':'設施'}</span><span>${f.facilities}</span></div></div></div>`
 }).join("");
}

function renderFootballPitches(){
 return FOOTBALL_PITCHES.map(f=>{
   const venues=f.venues.map(v=>`<div class="detail-row"><span class="detail-label">• ${v.name}</span><span style="font-size:.78rem;color:#64748b">${v.addr}</span></div>`).join("");
   return `<div class="card collapsed" id="${f.id}"><div class="facility-header" onclick="toggleCard(this)"><div><div class="facility-name">${lname(f.id)}</div><div class="facility-address">${currentLang==='en'?(f.type==='artificial'?'Artificial Turf':'Natural Grass'):(currentLang==='cn'?(f.type==='artificial'?'人造草地':'天然草地'):(f.type==='artificial'?'人造草地':'天然草地'))}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="expand-hint" data-expand="${t('expand')}" data-collapse="${t('collapse')}"></span></div></div><div class="facility-body">${venues}</div></div>`
 }).join("");
}

function renderOtherFacilities(){
 return OTHER_FACILITIES.map(f=>{
   const nm=currentLang==='en'?(f.nameEn||f.name):(currentLang==='cn'?(f.nameCn||f.name):f.name);
   const a=currentLang==='en'?(f.addrEn||f.addr):(currentLang==='cn'?(f.addrCn||f.addr):f.addr);
   return `<div class="card collapsed"><div class="facility-header" onclick="toggleCard(this)"><div><div class="facility-name">${nm}</div><div class="facility-address">${a}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="expand-hint" data-expand="${t('expand')}" data-collapse="${t('collapse')}"></span></div></div><div class="facility-body"></div></div>`
 }).join("");
}


window.DISTRICT={
 pools:POOLS,
 playrooms:PLAYROOMS,
 renderers:[
  ['pools','renderPools'],
  ['playrooms','renderPlayrooms'],
  ['sports-centres','renderSportsCentres'],
  ['tennis-courts','renderTennisCourts'],
  ['cycling-tracks','renderCyclingTracks'],
  ['football-pitches','renderFootballPitches'],
  ['other-facilities','renderOtherFacilities']
 ],
 secMap:{swim:()=>t('pools'),playroom:()=>t('playrooms'),sports:()=>t('sports'),tennis:()=>t('tennis'),cycling:()=>t('cycling'),football:()=>t('football'),other:()=>t('other')},
 navTxt:()=>[t('pools')+' (3)',t('playrooms')+' (4)',t('sports')+' (9)',t('tennis')+' (6)',t('cycling')+' (2)',t('football')+' (2)',t('other')]
};