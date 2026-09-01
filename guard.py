#!/usr/bin/env python3
import re, pathlib, subprocess, tempfile, sys, os
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

if errors:
    for e in errors:
        print(f"❌ {e}")
    sys.exit(1)
print("✅ guards PASS")
