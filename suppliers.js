(()=>{
 const data=window.ENERGY_PROVIDERS||{rows:[],gaps:[],reviewed_at:null};
 document.querySelector('.utility-heading>p').innerHTML='自动来源检查 '+esc(window.FUELWATCH_UTILITIES.checked_at)+'<br>补充人工核验 '+esc(data.reviewed_at)+' · PHP';
 const nav=document.querySelector('.nav-shell'),detail=document.querySelector('.utility-detail');
 const money=n=>'₱'+Number(n).toLocaleString('en-PH',{maximumFractionDigits:4});
 const categories={water:'水价供应商',electricity:'电价供应商',lpg:'煤气区域调查'};
 const labels={'commercial-industrial':'商业 / 工业','commercial-A':'商业 A','commercial-B':'商业 B','commercial-unverified':'商业（未核实）',unverified:'用户类别待核实','household-11kg':'家庭11kg瓶装LPG',residential:'住宅',commercial:'商业',industrial:'工业','commercial/industrial':'商业 / 工业',government:'政府/公共','average-basic':'平均基本收费',low_voltage:'低压',high_voltage:'高压'};
 const text=v=>Array.isArray(v)?v.join('；'):v||'';let active='water',provider='',customer='',area='';
 function open(service){active=service;provider='';customer='';area='';render();}
 function render(){
  const offers=data.rows.filter(r=>r.service===active),companies=[...new Set(offers.map(r=>r.provider))].sort(),types=[...new Set(offers.map(r=>r.customer_class))].sort(),areas=[...new Set(offers.map(r=>r.region))].sort();
  const gaps=data.gaps.filter(r=>r.service===active);
  detail.innerHTML=`<div class="supplier-heading"><h3>${esc(categories[active])}</h3><p>${companies.length} 家已调查供应商（${new Set(offers.filter(r=>r.price!=null||r.min!=null).map(r=>r.provider)).size}家有数值，含分项） · ${offers.length} 条费率口径 · 人工官网核验 ${esc(data.reviewed_at||'未完成')}</p></div><p class="supplier-explanation">水电通常按服务区供给。不同地区、住宅/商业、最低月费、每单位费率和电价分项不能直接排名；请先按供应商及用户类别查表。旧文件保留原日期，不当成本月新价。</p><div class="supplier-controls"><label>供应商 <select aria-label="水电供应商"><option value="">全部供应商</option>${companies.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('')}</select></label><label>用户类别 <select aria-label="用户类别"><option value="">全部类别</option>${types.map(t=>`<option value="${esc(t)}">${esc(labels[t]||t)}</option>`).join('')}</select></label><label>服务地区 <select aria-label="服务地区"><option value="">全部地区</option>${areas.map(a=>`<option value="${esc(a)}">${esc(a)}</option>`).join('')}</select></label></div><div class="supplier-results" aria-live="polite"></div><details class="supplier-gaps"><summary>已调查但仍缺价格证据（${gaps.length}项）</summary>${gaps.map(g=>`<p><b>${esc(g.provider)}</b>：${esc(text(g.reason||g.notes))}${g.source_url?` · <a href="${esc(g.source_url)}" target="_blank" rel="noopener">官网 ↗</a>`:''}</p>`).join('')||'<p>新增缺口以调查记录为准；不代表全国已经齐全。</p>'}</details><details class="supplier-method"><summary>全国目录与核验方式</summary><p>这里只汇总能读到官方费率的公司及未解决条目，不是全国完整价格库。价格人工核验日期与官网可访问检查日期分开；新增公司的复杂阶梯/图像价表尚不能承诺每日自动解析新价。既有Maynilad/Meralco及DOE监测仍按原采集器检查。</p>${(data.directories||[]).map(d=>`<p><a href="${esc(d.source_url)}" target="_blank" rel="noopener">${esc(d.title||d.name)}</a> · ${esc(text(d.notes))}</p>`).join('')}</details>`;
  const selects=detail.querySelectorAll('select');selects[0].value=provider;selects[1].value=customer;selects[0].onchange=e=>{provider=e.target.value;results();};selects[1].onchange=e=>{customer=e.target.value;results();};selects[2].value=area;selects[2].onchange=e=>{area=e.target.value;results();};results();
 }
 function results(){
  const rows=data.rows.filter(r=>r.service===active&&(!provider||r.provider===provider)&&(!customer||r.customer_class===customer)&&(!area||r.region===area));
  detail.querySelector('.supplier-results').innerHTML=`<p class="supplier-count">${rows.length} 条符合筛选的官方记录</p>`+rows.map(r=>{
   const price=r.price==null?(r.min!=null?money(r.min)+'–'+money(r.max):'暂无可核实数字'):money(r.price);
   const date=r.effective_date||r.period||r.publication_date||'源文件未注明生效期';
   const tariffs=r.tariffs||[];
   return `<article class="supplier-row"><div><h4>${esc(r.provider)}</h4><p>${esc(r.region)}</p><span class="supplier-class">${esc(r.customer_label||labels[r.customer_class]||r.customer_class)}</span></div><div><div class="supplier-price">${esc(price)}</div><p>${esc(r.unit||'详见价目文件')}</p><p class="supplier-kind">${esc(r.price_kind||'公开费率参考')}</p></div><div><p>适用 / 文件日期：${esc(date)}</p><p>官网核验：${esc(r.observed_at||data.reviewed_at)}</p><a href="${esc(r.source_url)}" target="_blank" rel="noopener">查看官方价目 / 公告 ↗</a></div><div class="supplier-scope"><p>${esc(r.scope)}</p><details><summary>阶梯、附加费与证据口径</summary><p>${esc(text(r.notes))}</p>${tariffs.length?'<div class="supplier-tariffs">'+tariffs.map(t=>`<p>${esc(t.label||((t.from_m3??'')+'–'+(t.to_m3??'以上')+' m³'))}：${t.value==null?'未确认':esc(money(t.value))} ${esc(t.unit||'')} · ${esc(t.charge_kind||'')}</p>`).join('')+'</div>':''}<p>旧价目是否继续适用、实际账单和商业合同请向供方确认。</p></details></div></article>`;
  }).join('')||(rows.length? '':'<p>此条件未收录可核实价格。</p>');
 }
 for(const service of ['water','electricity','lpg']){
  const rows=data.rows.filter(r=>r.service===service);if(!rows.length)continue;
  const count=new Set(rows.map(r=>r.provider)).size;
  const tab=nav.querySelector(`[data-section="${service}"]`);tab.addEventListener('click',()=>open(service));

 }
 window.ENERGY_PROVIDER_VIEW={data,open};
})();
