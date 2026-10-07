"""Collect displayed telecom offers from official product pages; no inferred price dates."""
import sys,os,json,re,datetime,subprocess,concurrent.futures
from pathlib import Path
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding='utf8')
ROOT=Path(__file__).resolve().parent.parent;os.chdir(ROOT)
DAY=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).date().isoformat()
class Node:
 def __init__(self,tag='',attrs=None):self.tag=tag;self.attrs=dict(attrs or []);self.children=[]
 def text(self):return ' '.join(c.text() if isinstance(c,Node) else c for c in self.children)
 def find(self,predicate):
  for c in self.children:
   if isinstance(c,Node):
    if predicate(c):yield c
    yield from c.find(predicate)
 def cls(self,value):return value in self.attrs.get('class','').split()
class Tree(HTMLParser):
 def __init__(self,body):
  super().__init__(convert_charrefs=True);self.root=Node();self.stack=[self.root];self.feed(body)
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs);self.stack[-1].children.append(n)
  if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:self.stack.append(n)
 def handle_startendtag(self,tag,attrs):self.stack[-1].children.append(Node(tag,attrs))
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):
  if not any(n.tag in {'script','style'} for n in self.stack):self.stack[-1].children.append(data)
def norm(s):return re.sub(r'\s+',' ',s).strip()
def fetch(url):
 body=subprocess.check_output(['curl.exe' if os.name=='nt' else 'curl','-f','-sS','-L','--user-agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','--retry','1','--max-time','30',url],stderr=subprocess.PIPE).decode('utf8','replace')
 return Tree(body).root
def row(provider,plan,service,price,period,url,**extra):
 assert price>0
 return dict(provider=provider,plan=plan,service=service,price=price,currency='PHP',billing_period=period,observed_at=DAY,date_kind='observed',source_url=url,region='Philippines · subject to supplier address/network coverage',status='observed',setup_fee=None,lock_in_months=None,**extra)
def pldt(root,url):
 tables=[n for n in root.find(lambda n:n.tag=='table') if norm(n.text()).startswith('Plans Comparison Fiber Unli 1299')]
 if len(tables)!=1:raise ValueError('Unique Fiber Unli comparison table missing')
 trs=list(tables[0].find(lambda n:n.tag=='tr'))
 heads=[norm(n.text()) for n in trs[0].find(lambda n:n.tag=='th')][1:]
 speedrow=next(t for t in trs if norm(t.text()).startswith('Internet Speed'))
 speeds=[norm(n.text()) for n in speedrow.find(lambda n:n.tag in {'td','th'})][1:]
 if len(heads)!=len(speeds) or len(heads)<3:raise ValueError('Plan/speed columns inconsistent')
 out=[]
 for plan,speed in zip(heads,speeds):
  m=re.fullmatch(r'Fiber Unli (\d+)',plan);s=re.fullmatch(r'([\d.]+) (Mbps|Gbps)',speed)
  if not m or not s:raise ValueError('Unsupported plan/speed cell')
  r=row('PLDT',plan,'broadband',int(m[1]),'month',url,speed_mbps=float(s[1])*(1000 if s[2]=='Gbps' else 1),data_allowance='Unlimited fiber',conditions='Home fiber. Speed is up to the stated maximum; installation and eligibility must be confirmed. Plan 1299 is for new broadband applications.')
  if 'contract period of 36 months' in norm(root.text()):r['lock_in_months']=36
  out.append(r)
 return out
def globe(root,url):
 tables=list(root.find(lambda n:n.cls('tablelx')))
 if len(tables)!=1:raise ValueError('Unique UNLISurf comparison missing')
 heads=list(tables[0].find(lambda n:n.cls('tdHeader')))
 prices=[]
 for h in heads:
  m=re.fullmatch(r'UNLISurf (\d+)',norm(h.text()))
  if not m:raise ValueError('Unclear UNLISurf price header')
  prices.append(int(m[1]))
 specs=re.findall(r'Up to (\d+)Mbps Valid for (\d+) days',norm(tables[0].text()))
 if len(prices)!=len(specs) or len(prices)<3:raise ValueError('UNLISurf columns inconsistent')
 return [row('Globe',f'GFiber Prepaid UNLISurf {p}','broadband',p,f'{days} days',url,speed_mbps=int(speed),data_allowance='Unlimited fiber',lockup_note='No lock-up advertised',conditions='Prepaid reload only. Installation is a separate initial cost; check address coverage and current installation offer.') for p,(speed,days) in zip(prices,specs)]
def converge(root,url):
 out=[]
 for card in root.find(lambda n:n.attrs.get('data-slot')=='card'):
  txt=norm(card.text());s=re.search(r'Up to (\d+) Mbps',txt);p=re.search(r'₱\s*([\d,]+)/mo',txt)
  if not(s and p):continue
  names=[norm(n.text()) for n in card.find(lambda n:n.tag=='h3')];name=next((n for n in names if not re.search(r'Mbps|₱',n)),None)
  if not name:raise ValueError('Plan label missing')
  out.append(row('Converge','Super FiberX '+name,'broadband',int(p[1].replace(',','')),'month',url,speed_mbps=int(s[1]),data_allowance='Fiber connection · fair-use/contract terms on supplier site',conditions='Residential advertised monthly rate. Speed is up to the stated maximum. Installation, contract and address eligibility must be confirmed.'))
 if len(out)<3:raise ValueError('Insufficient complete Super FiberX cards')
 return out
def smart(root,url):
 spec=next(root.find(lambda n:n.attrs.get('id')=='product-specification'),None)
 if spec is None:raise ValueError('Product specification missing')
 txt=norm(spec.text());d=re.search(r'Validity: (\d+) Days',txt,re.I);g=re.search(r'(\d+) GB SHAREABLE DATA FOR ALL SITES',txt,re.I)
 # Take the actual product price only, excluding navigation and crossed-out prices.
 price=next(root.find(lambda n:n.cls('sales')),None)
 if price is None:raise ValueError('Actual sales price missing')
 m=re.search(r'₱\s*([\d,.]+)',norm(price.text()))
 if not(m and d and g):raise ValueError('Incomplete product price/data/validity')
 return [row('Smart','POWER ALL 99','mobile',float(m[1].replace(',','')),d[1]+' days',url,data_gb=int(g[1]),data_allowance=g[1]+' GB all-sites shareable data; unlimited TikTok advertised',conditions='Official Smart store Smart Bro listing; eligible SIM/account required. Confirm availability in the supplier app. Additional SIM/device cost not included.')]
def dito(root,url):
 out=[]
 for card in root.find(lambda n:n.cls('card') and n.cls('swiper-slide')):
  title=next(card.find(lambda n:n.tag=='h3'),None)
  if not title or not re.fullmatch(r'LEVEL-UP (129|169|199|299|499|999)',norm(title.text())):continue
  txt=norm(card.text());g=re.search(r'DATA ALLOCATION (\d+)GB',txt);p=re.search(r'₱\s*(\d+) Valid for (\d+) days',txt,re.I)
  if not(g and p):raise ValueError('Missing basic Level-Up plan parameters')
  out.append(row('DITO',norm(title.text()),'mobile',int(p[1]),p[2]+' days',url,data_gb=int(g[1]),data_allowance=g[1]+' GB data allocation; see official call/text/rollover terms',conditions='Standard prepaid Level-Up pack. Excludes 5G Double Data and app-specific Socials variants. Account, handset and coverage eligibility apply.'))
  minutes=re.search(r'(\d+) mins calls to other mobile networks',txt,re.I)
  if minutes and re.search(r'Unli DITO to DITO calls',txt,re.I):
   out[-1].update(calls_text='DITO网内无限 + '+minutes[1]+'分钟其他手机网络 / Unlimited on-net + '+minutes[1]+' off-net mobile minutes',voice_sms_source_url=url,voice_sms_observed_at=DAY,voice_sms_status='observed')
  if re.search(r'Unli Text to all mobile networks',txt,re.I):out[-1]['sms_text']='全网手机短信无限 / Unlimited all-net SMS'
 if len(out)<3:raise ValueError('Insufficient standard Level-Up cards')
 return out
SOURCES=[('PLDT','https://www.pldthome.com/internet',pldt),('Globe','https://gfiberprepaid.globe.com.ph/',globe),('Converge','https://www.convergeict.com/super-fiberx',converge),('Smart','https://store.smart.com.ph/smart-bro/power-all-99/1601900800.html',smart),('DITO','https://dito.ph/prepaid/level-up',dito)]
def collect(source):
 provider,url,parse=source
 try:
  rows=parse(fetch(url),url);seen=set()
  for r in rows:
   k=(r['provider'],r['plan'],r['billing_period']);assert k not in seen;seen.add(k)
  return dict(provider=provider,source_url=url,checked_at=DAY,status='observed',rows=rows)
 except Exception as e:
  oldpath=ROOT/'data/network-prices.json';old=json.loads(oldpath.read_text('utf8')) if oldpath.exists() else {'rows':[]}
  rows=[dict(r,status='fetch-failed') for r in old['rows'] if r['provider']==provider and r.get('status')!='manual-verified']
  return dict(provider=provider,source_url=url,checked_at=DAY,status='fetch-failed',rows=rows,error=str(e)[:200])
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:collected=list(pool.map(collect,SOURCES))
 result={'checked_at':DAY,'date_note':'observed_at is the date the official product page was read, not a tariff effective date. Prices are advertised offers, subject to supplier confirmation.','rows':[r for c in collected for r in c['rows']],'providers':[{k:v for k,v in c.items() if k!='rows'} for c in collected]}
 Path('data/network-prices.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n','utf8')
 Path('data/network-bundle.js').write_text('window.FUELWATCH_NETWORK='+json.dumps(result,ensure_ascii=False).replace('<','\\u003c')+';\n','utf8')
 Path('data/network-snapshots').mkdir(exist_ok=True);snapshot=Path('data/network-snapshots')/(DAY+'.json')
 if not snapshot.exists():snapshot.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n','utf8')
 print(json.dumps({'rows':len(result['rows']),'providers':result['providers']},ensure_ascii=False))
