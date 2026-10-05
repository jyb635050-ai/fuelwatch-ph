/* Telecom offers use their own billing periods; no invented monthly equivalents. */
(()=>{
 const data=window.FUELWATCH_NETWORK||{rows:[],providers:[],checked_at:null};
 const nav=document.querySelector('.nav-shell'),dashboard=document.querySelector('.utility-dashboard');
 const section=document.createElement('section');section.className='network-dashboard';section.hidden=true;dashboard.after(section);
 const titles={broadband:'宽带价格',mobile:'电信价格'};const buttons={};let service='broadband',provider='',period='';
 const money=n=>'₱'+Number(n).toLocaleString('en-PH',{maximumFractionDigits:2});
 const periodName=p=>p==='month'?'每月':p.replace(' days','天有效期');
 const rowsFor=s=>data.rows.filter(r=>r.service===s);
 for(const kind of ['broadband','mobile']){
  const button=document.createElement('button');button.dataset.section=kind;button.textContent=titles[kind];button.setAttribute('aria-pressed','false');button.onclick=()=>open(kind);nav.append(button);buttons[kind]=button;
  const summary=document.createElement('article');summary.className='utility-card network-summary';const count=rowsFor(kind).length,providers=new Set(rowsFor(kind).map(r=>r.provider)).size;
  summary.innerHTML=`<h3>${titles[kind]}</h3><span class="utility-state">官网套餐参考</span><div class="utility-value">${count} 个套餐</div><p>${providers} 家供应商 · 不同周期分组显示</p><p>采集 ${esc(data.checked_at||'暂无')} · 非实测账单</p><button>查看${titles[kind]} →</button>`;summary.querySelector('button').onclick=()=>open(kind);dashboard.querySelector('.utility-grid').append(summary);
 }
 nav.querySelectorAll('button:not([data-section="broadband"]):not([data-section="mobile"])').forEach(button=>button.addEventListener('click',()=>{section.hidden=true;Object.values(buttons).forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});}));
 function open(kind){service=kind;provider='';period='';window.FUELWATCH_UPGRADE.switchSection('overview');dashboard.hidden=true;section.hidden=false;nav.querySelectorAll('button').forEach(b=>{const active=b.dataset.section===kind;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});draw();}
 function draw(){
  const offers=rowsFor(service),providers=[...new Set(offers.map(r=>r.provider))].sort(),periods=[...new Set(offers.map(r=>r.billing_period))];
  section.innerHTML=`<div class="network-heading"><h2>${titles[service]}</h2><p>菲律宾供应商官网公开套餐。价格单位、网络覆盖、流量和最高速率不同，请按需要比较。</p><p class="network-date">最近检查 ${esc(data.checked_at||'暂无')} · 采集日期不是调价生效日 · 每日自动检查</p></div><div class="network-controls"><label>供应商 <select aria-label="网络供应商"><option value="">全部供应商</option>${providers.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('')}</select></label><label>计费周期 <select aria-label="计费周期"><option value="">全部周期（分组显示）</option>${periods.map(p=>`<option value="${esc(p)}">${esc(periodName(p))}</option>`).join('')}</select></label></div><p class="network-caution">标价仅为套餐费用，不包含未核实的安装费、设备费或其他附加费用；地址覆盖、SIM、合约和促销资格以官网确认结果为准。历史采集值不会冒充今日新价。</p><div class="network-results" aria-live="polite"></div><details class="network-method"><summary>数据范围与采集失败说明</summary><p>收录 PLDT、Globe、Converge、Smart、DITO 能明确关联标价与套餐参数的公开页面。不是全市场、全套餐覆盖；个性化优惠和登录后报价不猜测。抓取失败时保留原采集日期并显示失败标记。</p>${data.providers.map(p=>`<p>${esc(p.provider)}：${p.status==='observed'?'官网采集成功':'官网采集失败；旧值或暂无数据'} · <a href="${esc(p.source_url)}" target="_blank" rel="noopener">官方套餐页 ↗</a></p>`).join('')}</details>`;
  const filters=section.querySelectorAll('select');filters[0].value=provider;filters[1].value=period;filters[0].onchange=e=>{provider=e.target.value;results();};filters[1].onchange=e=>{period=e.target.value;results();};results();
 }
 function results(){
  const rows=rowsFor(service).filter(r=>(!provider||r.provider===provider)&&(!period||r.billing_period===period)),target=section.querySelector('.network-results');
  const groups=[...new Set(rows.map(r=>r.billing_period))].sort((a,b)=>a==='month'?-1:b==='month'?1:parseInt(a)-parseInt(b));
  target.innerHTML=`<p class="network-count">${rows.length} 个已收录套餐</p>`+(rows.length?groups.map(p=>`<section class="network-group"><h3>${esc(periodName(p))}${p==='month'?' · 月费宽带':' · 预付套餐'}</h3><p class="network-group-note">本组仅按标价从低到高排列；速率、流量与合约不同，低标价不等于更适合。</p><div class="network-table"><div class="network-table-head"><span>供应商 / 套餐</span><span>公开标价</span><span>速率 / 流量</span><span>日期 / 来源</span></div>${rows.filter(r=>r.billing_period===p).sort((a,b)=>a.price-b.price||a.provider.localeCompare(b.provider)).map(r=>`<article class="network-row"><div><b>${esc(r.provider)}</b><span>${esc(r.plan)}</span><details><summary>适用条件与费用</summary><p>覆盖：${esc(r.region)}</p><p>安装/设备费用：${r.setup_fee==null?'未统一核实，另向供应商确认':esc(money(r.setup_fee))}</p><p>锁约：${r.lock_in_months==null?(r.lockup_note?'官网注明无锁约':'未核实，详见官网'):esc(r.lock_in_months)+'个月'}</p><p>${esc(r.conditions)}</p></details></div><div class="network-price"><strong>${money(r.price)}</strong><span>${esc(periodName(r.billing_period))}</span></div><div>${r.speed_mbps!=null?'<b>最高 '+esc(r.speed_mbps)+' Mbps</b>':'<b>'+esc(r.data_gb)+' GB</b>'}<span>${esc(r.data_allowance)}</span></div><div><span class="network-state">${r.status==='fetch-failed'?'抓取失败 · 保留原采集值':'官网采集参考'}</span><span>采集 ${esc(r.observed_at)}</span><a href="${esc(r.source_url)}" target="_blank" rel="noopener">查看官方套餐 ↗</a></div></article>`).join('')}</div></section>`).join(''):'<p>此筛选没有收录的套餐。</p>');
 }
 window.ENERGY_NETWORK={open,data};
})();
