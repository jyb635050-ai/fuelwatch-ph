"""Retain dated manual research separately from automatic page parsing."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
path = ROOT/'data/network-prices.json'
data = json.loads(path.read_text('utf-8-sig'))
research = json.loads((ROOT/'data/research-coverage-20261006.json').read_text('utf-8-sig'))
data['rows'] = [r for r in data['rows'] if r.get('status') != 'manual-verified']
data['providers'] = [r for r in data['providers'] if r.get('status') != 'manual-verified']
for offer in research['network_offers']:
    row = dict(offer, status='manual-verified', date_kind='observed')
    key = (row['provider'], row['plan'], row['billing_period'])
    assert not any((r['provider'], r['plan'], r['billing_period']) == key for r in data['rows'])
    data['rows'].append(row)
for provider in ['SKY', 'TNT']:
    row = next(r for r in data['rows'] if r['provider'] == provider)
    data['providers'].append(dict(provider=provider, source_url=row['source_url'], status='manual-verified', observed_at=row['observed_at']))
data['checked_at'] = max(data['checked_at'], research['observed_at'])
path.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', 'utf8')
(ROOT/'data/network-bundle.js').write_text('window.FUELWATCH_NETWORK='+json.dumps(data, ensure_ascii=False).replace('<', '\\u003c')+';\n', 'utf8')
print(f"PASS merged network: {len(data['rows'])} offers; manual dates retained")
