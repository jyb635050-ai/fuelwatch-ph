import io,json,re,subprocess,datetime,hashlib,sys,os
from pathlib import Path
sys.path.insert(0,str(Path('.utility-deps').resolve()))
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parent.parent
os.chdir(ROOT)
sys.stdout.reconfigure(encoding='utf-8')
NOW=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8)))
DAY=NOW.date().isoformat()
MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December']
def get(url):
    return subprocess.check_output(['curl.exe' if os.name=='nt' else 'curl','-f','-sS','-L','--retry','1','--max-time','30',url],stderr=subprocess.PIPE)
def pdf(url):return '\n'.join(p.extract_text() or '' for p in PdfReader(io.BytesIO(get(url))).pages)
def text(url):return re.sub('<[^>]+>',' ',get(url).decode('utf-8','replace'))
old=json.loads(Path('data/utility-prices.json').read_text('utf-8')) if Path('data/utility-prices.json').exists() else {'categories':[]}
previous={c['id']:c for c in old['categories']}
def base(id,title,url):return {'id':id,'title':title,'source_url':url,'checked_at':DAY,'observations':[],'status':'unavailable','message':'No verified retail reference is available.'}
water=base('water','Water','https://www.mayniladwater.com.ph/press-releases/')
electric=base('electricity','Electricity','https://company.meralco.com.ph/node/15339')
lpg=base('lpg','LPG / bottled gas','https://doe.gov.ph/data-and-prices/lpg-monitor/ncr-lpg-prices')
ng=base('natural-gas','Natural gas','https://doe.gov.ph/oil-industry-management-bureau-s-year-end-comprehensive-report-fy2025')
ng['message']='No verified public shop-level natural-gas retail tariff found. LPG and LNG prices are not substituted.'
def run(category,fn):
    try:fn(category)
    except Exception as e:
        if previous.get(category['id'],{}).get('observations'):
            prior=previous[category['id']];category['observations']=prior['observations'];category['source_url']=prior['source_url'];category['status']='fetch-failed';category['message']='Official fetch/parse failed. Last verified observation retained with its original date.'
        else:category['message']='Official source could not be verified; no price published.'
        category['error']=str(e)[:250]
def scrape_water(c):
    try:landing=' '.join(p['link'] for p in json.loads(get('https://www.mayniladwater.com.ph/wp-json/wp/v2/posts?search=fcda&per_page=10&_fields=link')))
    except Exception:landing='' # Only fall back to the previously verified dated official notice.
    links=re.findall(r'https://www\.mayniladwater\.com\.ph/notice-to-maynilad-customers-foreign-currency-differential-adjustment-fcda-effective-([a-z]+)-(\d+)-(\d{4})/',landing)
    candidates=[]
    for m,d,y in links:
        if m.title() in MONTHS:
            dt=datetime.date(int(y),MONTHS.index(m.title())+1,int(d))
            if dt<=NOW.date():candidates.append((dt,m,d,y))
    candidates.append((datetime.date(2026,10,1),'october','1','2026')) # Verified official notice; retain its actual date if archive discovery fails.
    if not candidates:raise ValueError('No dated FCDA notice discovered')
    dt,m,d,y=max(candidates)
    url=f'https://www.mayniladwater.com.ph/notice-to-maynilad-customers-foreign-currency-differential-adjustment-fcda-effective-{m}-{d}-{y}/'
    body=text(url)
    match=re.search(r'Average Basic Charge of\s*(?:[P₱]|&[^;]+;|\s)*([\d,.]+)\s*/cu',body,re.I)
    if not match:raise ValueError('Average basic-charge amount not verified')
    value=float(match[1].replace(',',''));assert value>0
    c.update(source_url=url,status='reference' if (NOW.date()-dt).days<=92 else 'historical',message='Maynilad average basic charge; not a shop tariff or final bill. Consumption bands, FCDA, environmental/sewerage charges and taxes affect the bill.')
    c['observations']=[{'provider':'Maynilad','region':'Greater Manila West Zone','value':value,'unit':'PHP/m³','as_of':dt.isoformat(),'scope':'Average basic charge in dated FCDA notice; excludes bill-specific additions','source_url':url}]
def scrape_electric(c):
    candidates=[]
    for offset in range(3):
        month=(NOW.year*12+NOW.month-1)-offset;y,mi=divmod(month,12);m=MONTHS[mi]
        url=f'https://meralcomain.s3.ap-southeast-1.amazonaws.com/{y}-{mi+1:02d}/english_press_release-_meralco_{m.lower()}_{y}_rates.pdf'
        try:
            body=pdf(url)
            match=re.search(r'overall rate for a typical household to\s*(?:P|₱)\s*([\d.]+)',body,re.I)
            if not match:continue
            date=re.search(r'MANILA,\s*PHILIPPINES,\s*(\d+)\s+([A-Z]+)\s+(\d{4})',body)
            if not date or date[2].title()!=m or int(date[3])!=y:continue
            value=float(match[1]);assert value>0
            c.update(status='reference' if offset==0 else 'historical',source_url=url,message='Typical residential household reference, NOT the commercial rate for a shop. Business contracts, demand and bill components differ.')
            c['observations']=[{'provider':'Meralco','region':'Meralco service area','value':value,'unit':'PHP/kWh','as_of':datetime.date(y,mi+1,int(date[1])).isoformat(),'scope':'Typical residential overall rate; business tariff unverified','source_url':url}];return
        except Exception:continue
    raise ValueError('No dated supported official rate document')
def scrape_lpg(c):
    page=get(c['source_url']).decode('utf-8','replace')
    links=re.findall(r'href=["\']([^"\']+(?:pdf|PDF)[^"\']*)["\']',page)
    dated=[]
    for url in links:
        from urllib.parse import unquote
        decoded=unquote(url)
        for mi,m in enumerate(MONTHS,1):
            match=re.search(r'NCR[ _]+'+m+r'[ _]+(\d{4})[ _]+LPG',decoded,re.I)
            if match and datetime.date(int(match[1]),mi,1)<=NOW.date():dated.append((int(match[1]),mi,url.replace('&amp;','&')))
    if not dated:raise ValueError('No dated NCR LPG PDF link found')
    y,mi,url=max(dated);body=pdf(url)
    date=re.search(r'Date of Monitoring:\s*([A-Za-z]+)\s+(\d+)\s*[-–]\s*(\d+),\s*(\d{4})',body)
    if not date:raise ValueError('Missing LPG monitoring period')
    # The table's overall summary occurs immediately before Date of Monitoring. Ignore per-city ranges.
    summary=body[:date.start()].splitlines()[-1].strip()
    amounts=re.match(r'([\d,]+\.\d+)\s*-\s*([\d,]+\.\d+)\s+([\d,]+\.\d+)',summary)
    if not amounts:raise ValueError('Unambiguous overall LPG range not found')
    lo,hi,common=[float(x.replace(',','')) for x in amounts.groups()];assert 0<lo<=common<=hi
    asof=datetime.date(int(date[4]),MONTHS.index(date[1].title())+1,int(date[2])).isoformat()
    end=datetime.date(int(date[4]),MONTHS.index(date[1].title())+1,int(date[3])).isoformat()
    c.update(status='historical' if end<DAY else 'reference',source_url=url,message='DOE surveyed NCR household 11 kg LPG cylinders; price range, not a quote from an individual shop. Delivery/deposit may differ.')
    c['observations']=[{'provider':'DOE NCR survey','region':'NCR','min':lo,'max':hi,'common':common,'unit':'PHP / 11 kg cylinder','as_of':asof,'period_end':end,'scope':'Household 11 kg LPG survey; not natural gas','source_url':url}]
run(water,scrape_water);run(electric,scrape_electric);run(lpg,scrape_lpg)
run(ng,lambda c:get(c['source_url']))
result={'checked_at':DAY,'categories':[water,electric,lpg,ng]}
Path('data/utility-prices.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n','utf-8')
Path('data/utility-bundle.js').write_text('window.FUELWATCH_UTILITIES='+json.dumps(result,ensure_ascii=False).replace('<','\\u003c')+';\n','utf-8')
Path('data/utility-snapshots').mkdir(exist_ok=True)
archive=Path('data/utility-snapshots')/(DAY+'.json')
if not archive.exists():archive.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n','utf-8')
print(json.dumps({'checked_at':DAY,'categories':[{k:c[k] for k in ['id','status','observations']} for c in result['categories']]},ensure_ascii=False))
