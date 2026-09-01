#!/usr/bin/env python3
"""Fetch RVM status from EPD API → write rvm_status.json → deploy.
Usage: python3 rvm_sync.py [--deploy]
Runs at 09:00/12:00/17:00 via cron.
"""
import json
import os
import subprocess
import sys
import urllib.request
from datetime import datetime, timezone, timedelta

API_URL = 'https://albarvm.teamnote.work/api/rvm/'
HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Origin': 'https://albarvm.teamnote.work',
    'Referer': 'https://albarvm.teamnote.work/',
}
# Our 8 RVM locations (name_zht from the API)
OUR_NAMES = {'彩明商場','新都城中心三期','PopCorn','寶林商場','The LOHAS','TKO Spot','怡明邨','海悅豪園商場'}
JSON_PATH = '/home/ubuntu/we1co.me/rvm_status.json'


def fetch_rvm_data():
    req = urllib.request.Request(API_URL, data=b'{}', headers=HEADERS, method='POST')
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode())


def build_status(data):
    """Map API status to our 4-color categories:
    green=提供服務, orange=快將滿溢(>=80%滿), red=已滿, grey=維護中/非服務時間"""
    machines = {}
    for rvm in data.get('rvms', []):
        name = rvm.get('name_zht', '')
        if name not in OUR_NAMES:
            continue
        status = rvm.get('status', '')
        svc = rvm.get('service_status', 0)
        maint = rvm.get('under_maintenance', False)

        if maint or svc == 1:
            cat = 'maintenance'
        elif status == 'Full':
            cat = 'full'
        elif status in ('<=20%', '<=5%'):
            cat = 'nearly_full'
        else:
            cat = 'operating'

        machines[name] = {
            'status': status,
            'cat': cat,
            'service_hour': rvm.get('service_hour_en', ''),
            'last_emptied': rvm.get('last_emptied_at', ''),
        }
    return machines


def write_json(machines):
    hkt = timezone(timedelta(hours=8))
    now = datetime.now(hkt).strftime('%Y-%m-%d %H:%M')
    payload = {'lastSync': now, 'machines': machines}
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    # Silent on success - only errors reported


def deploy():
    env = {
        'CLOUDFLARE_API_TOKEN': os.environ.get('CF_WORKERS_TOKEN', ''),
        'CLOUDFLARE_ACCOUNT_ID': os.environ.get('CF_ACCOUNT_ID', ''),
    }
    r = subprocess.run(
        ['wrangler', 'pages', 'deploy', '/home/ubuntu/we1co.me',
         '--project-name=we1co-sai-kung', '--branch=main'],
        env={**os.environ, **env},
        capture_output=True, text=True, timeout=120,
    )
    print(r.stdout[-600:] or r.stderr[-600:])


if __name__ == '__main__':
    try:
        data = fetch_rvm_data()
        machines = build_status(data)
        write_json(machines)
        if '--deploy' in sys.argv:
            deploy()
        # PASS - silent
    except Exception as e:
        print(f'FAIL: {e}', file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
