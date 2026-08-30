#!/usr/bin/env python3
import re, pathlib, subprocess, tempfile, sys, os
errors = []
for path in ['/home/ubuntu/we1co.me/index.html', '/home/ubuntu/we1co.me/kt.html']:
    t = pathlib.Path(path).read_text(encoding='utf-8')
    scripts = re.findall(r'<script>([\s\S]*?)</script>', t)
    js = "\n".join(scripts)
    # Guard 1: subPools filter before declaration
    idx = js.find('function renderPools')
    if idx >= 0:
        seg = js[idx:js.find('function renderPlayrooms', idx)] if 'function renderPlayrooms' in js[idx:] else js[idx:idx+4000]
        let_pos = seg.find('let subPools')
        filt_pos = seg.find('subPools.filter')
        if let_pos >= 0 and filt_pos >= 0 and filt_pos < let_pos:
            errors.append(f"{path}: subPools.filter before let subPools (ReferenceError)")
    # Guard 2: JS syntax
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
        f.write('var document={getElementById:()=>({innerHTML:"",textContent:""})};\nvar window={};\n' + js)
        fname = f.name
    r = subprocess.run(['node', '--check', fname], capture_output=True, text=True)
    if r.returncode != 0:
        errors.append(f"{path}: JS syntax FAIL: {r.stderr[:300]}")
    os.unlink(fname)

if errors:
    for e in errors:
        print(f"❌ {e}")
    sys.exit(1)
print("✅ guards PASS")
