#!/usr/bin/env python3
import re, pathlib, subprocess, tempfile, sys, os, json
errors = []

# Guard 1: subPools filter before declaration (in common.js)
common = pathlib.Path('/home/ubuntu/we1co.me/common.js').read_text(encoding='utf-8')
idx = common.find('function renderPools')
if idx >= 0:
    seg_end = common.find('function renderPlayrooms', idx) if 'function renderPlayrooms' in common[idx:] else idx+4000
    seg = common[idx:seg_end]
    let_pos = seg.find('let subPools')
    filt_pos = seg.find('subPools.filter')
    if let_pos >= 0 and filt_pos >= 0 and filt_pos < let_pos:
        errors.append("common.js: subPools.filter before let subPools (ReferenceError)")

# Guard 2: JS syntax for all JS files
js_files = [
    '/home/ubuntu/we1co.me/common.js',
    '/home/ubuntu/we1co.me/districts/sk.js',
    '/home/ubuntu/we1co.me/districts/kt.js',
]
for path in js_files:
    js = pathlib.Path(path).read_text(encoding='utf-8')
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
        f.write('var document={getElementById:()=>({innerHTML:"",textContent:"",classList:{toggle:()=>{},contains:()=>false}}),querySelectorAll:()=>[],querySelector:()=>({style:{}}),documentElement:{},title:"",body:{style:{}}};\nvar window={addEventListener:()=>{}};\n' + js)
        fname = f.name
    r = subprocess.run(['node', '--check', fname], capture_output=True, text=True)
    if r.returncode != 0:
        errors.append(f"{os.path.basename(path)}: JS syntax FAIL: {r.stderr[:300]}")
    os.unlink(fname)

# Guard 3: closure pools names must resolve to facility names (direct or via alias map)
# Mirrors poolSubStatuses alias logic — catches LCSD renaming pools silently breaking status
ALIAS_MAP = {
    'ktswim': {'戶外泳池': ['副池', '日光浴場'], '室內泳池': ['主池', '訓練池', '習泳池 1&2']},
    'jvswim': {'嬉水池 (2)': ['嬉水池 2&3'], '嬉水池 (3)': ['嬉水池 2&3']},
}
# 公告有時會提及非 sub-pool 設施（看台/觀眾席），唔係狀態追蹤對象，忽略
IGNORE_POOLS = {'觀眾看台', '看台', '觀眾席'}
for dist_file in ['/home/ubuntu/we1co.me/districts/sk.js', '/home/ubuntu/we1co.me/districts/kt.js']:
    js = pathlib.Path(dist_file).read_text(encoding='utf-8')
    # Extract each pool object block: id, facilities[], closures[]
    for m in re.finditer(r'id:"([^"]+)"[^}]*?closures:(\[.*?\]),maintenance:', js, re.S):
        pid, closures_json = m.group(1), m.group(2)
        fac_m = re.search(r'facilities:(\[.*?\]),', js[m.end():], re.S)
        fac_names = []
        if fac_m:
            fac_names = re.findall(r'name:"([^"]+)"', fac_m.group(1))
        try:
            closures = json.loads(closures_json)
        except Exception:
            continue
        alias = ALIAS_MAP.get(pid, {})
        for c in closures:
            for p in re.split(r'[,，]', c.get('pools', '')):
                p = p.strip()
                if not p or p in IGNORE_POOLS:
                    continue
                resolved = alias.get(p, [p])
                if not any(r in fac_names for r in resolved):
                    errors.append(f"{dist_file.split('/')[-1]} [{pid}] closure pool '{p}' 唔 match 任何 facility 名: {fac_names}")

if errors:
    for e in errors:
        print(f"❌ {e}")
    sys.exit(1)
print("✅ guards PASS")
