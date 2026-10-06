import json,datetime,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf8')
REVIEW='2026-10-06'
def read(name):return json.loads((ROOT/'data'/name).read_text('utf-8-sig'))
def canonical(provider):
 if 'Maynilad' in provider:return 'Maynilad'
 if provider.lower()=='meralco':return 'Meralco'
 return provider
coverage=read('research-coverage-20261006.json');rows=[];gaps=[]
for filename,service in [('research-water-20261006.json','water'),('research-electricity-20261006.json','electricity')]:
 for r in read(filename)['rows']:
  cls=r.get('category','unverified');kind=r.get('price_kind') or r.get('charge_kind','published tariff')
  kindlabels={'minimum monthly':'最低月费（首档包含量）','average basic reference':'平均基本收费参考','published_category_reference':'该类别月度公开参考','energy_rate_excluding_fixed_and_demand':'每度电费部分（另有固定/需量费）','generation_component_only':'仅发电分项，不是完整电价','generation_only':'仅发电分项，不是完整电价'}
  rr=dict(service=service,provider=canonical(r['provider']),region=r['region'],customer_class=cls,customer_label=r.get('category_label'),price=r.get('price'),unit=r.get('unit'),price_kind=kindlabels.get(kind,kind),effective_date=r.get('effective_date'),period=r.get('period') or r.get('tariff_period'),publication_date=r.get('source_date') or r.get('published_date'),observed_at=r.get('observed_at',REVIEW),source_url=r['source_url'],scope=r.get('scope') or ('水表 '+r['meter_size'] if r.get('meter_size') else r.get('category_label') or '仅为注明类别和地区的官方参考，不能代表每一张账单'),notes=r.get('notes',''),tariffs=(r.get('tariff',[]) if isinstance(r.get('tariff',[]),list) else [dict(label=k,value=v,unit=('PHP/kW' if k.endswith('_per_kw') else 'PHP/customer/month' if k.endswith('_per_customer_month') else 'PHP/kWh'),charge_kind='separate component') for k,v in r.get('tariff',{}).items()]),status=r.get('status','manual-verified'))
  if r.get('price') is None:
   gaps.append(dict(service=service,provider=rr['provider'],source_url=rr['source_url'],reason=r.get('notes','缺少可确认整体费率')))
  rows.append(rr)
for b in read('research-electricity-20261006.json').get('blockers',[]):
 if b['provider']=='Nationwide':continue
 gaps.append(dict(service='electricity',provider=b['provider'],source_url=b['source_url'],reason=b['reason']))
 if b['provider'] not in {r['provider'] for r in rows} or b.get('category') or b['provider']=='Meralco':
  rows.append(dict(service='electricity',provider=b['provider'],region=b.get('region','供区详见官网'),customer_class=b.get('category','commercial-unverified' if b['provider']=='Meralco' else 'unverified'),customer_label=None,price=None,unit=None,price_kind='缺少可确认的该类费率',period=None,effective_date=None,publication_date=None,observed_at=REVIEW,source_url=b['source_url'],scope='未从官网确证数值，不使用第三方补价',notes=b['reason'],tariffs=[],status='unavailable'))
for r in coverage.get('lpg_observations',[]):
 rr=dict(service='lpg',provider='DOE 地区LPG监测',region=r['region'],customer_class='household-11kg',customer_label='家庭11kg瓶装LPG',price=None,min=r.get('min'),max=r.get('max'),unit=r.get('unit','PHP / 11 kg cylinder'),price_kind='DOE地区调查范围（历史）',effective_date=None,period=r.get('period') or r.get('as_of') or r.get('monitoring_month'),publication_date=None,observed_at=r.get('observed_at',REVIEW),source_url=r['source_url'],scope=r.get('scope','家庭11kg瓶装LPG调查，不是天然气或指定店家报价'),notes=r.get('notes') or r.get('conditions',''),status='historical',tariffs=[])
 if r.get('period_end'):rr['notes']=str(rr['notes'])+'；监测截至 '+r['period_end']
 rows.append(rr)
# Existing live collectors remain separate from manually read company schedules.
for c in read('utility-prices.json')['categories']:
 for o in c['observations']:
  cls='average-basic' if c['id']=='water' else 'residential' if c['id']=='electricity' else 'household-11kg'
  p='DOE 地区LPG监测' if c['id']=='lpg' else canonical(o['provider']);key=(c['id'],p,cls,o.get('value'),o.get('unit'))
  if any((r['service'],r['provider'],r['customer_class'],r['price'],r['unit'])==key for r in rows):continue
  rows.append(dict(service=c['id'],provider=p,region=o['region'],customer_class=cls,customer_label=None,price=o.get('value'),min=o.get('min'),max=o.get('max'),unit=o['unit'],price_kind='既有采集器公开参考',effective_date=o.get('as_of'),period=None,publication_date=None,observed_at=c['checked_at'],source_url=o['source_url'],scope=o['scope'],notes=c['message'],tariffs=[],status=c['status']))
directories=[]
for d in coverage.get('directories',[]):
 if isinstance(d,str):directories.append(dict(title='官方全国供应商目录',source_url=d,notes='名录不等于当期完整价格覆盖'))
 else:directories.append(d)
if not directories:directories=[dict(title='DOE 全国配电供应商目录（2024-12）',source_url='https://prod-cms.doe.gov.ph/documents/d/epimb/program-partners-distribution-utilities-pdf',notes='历史目录含多类供方，不等于当前全部活跃公司或完整电价')]
summary={s:dict(providers=len({r['provider'] for r in rows if r['service']==s}),numeric_providers=len({r['provider'] for r in rows if r['service']==s and(r['price'] is not None or r.get('min') is not None)}),rows=sum(r['service']==s for r in rows)) for s in ['water','electricity','lpg']}
result=dict(reviewed_at=REVIEW,scope='官网研究子集；非全国完整费率普查。各地区、用户类别、最低费和分项不得直接比价。',rows=rows,gaps=gaps,directories=directories,summary=summary)
(ROOT/'data/provider-prices.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n','utf8')
(ROOT/'data/provider-bundle.js').write_text('window.ENERGY_PROVIDERS='+json.dumps(result,ensure_ascii=False).replace('<','\\u003c')+';\n','utf8')
print('PASS provider aggregation '+json.dumps(summary,ensure_ascii=False))
