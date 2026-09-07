import {writeFile,appendFile} from 'node:fs/promises';
const query='[out:json][timeout:180];area["ISO3166-1"="PH"][admin_level=2]->.ph;nwr[amenity=fuel](area.ph);out center tags;';
const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:new URLSearchParams({data:query})});
if(!response.ok) throw Error(`Overpass HTTP ${response.status}`);
const raw=await response.json();
await writeFile('docs/overpass-source.json',JSON.stringify(raw),{flag:'wx'});
const norm=s=>s.trim().replace(/\s+/g,' ').toLowerCase();
const canonical=new Map(Object.entries({'petron':'Petron','shell':'Shell','caltex':'Caltex','seaoil':'Seaoil','phoenix':'Phoenix','flying v':'Flying V','total':'TotalEnergies','totalenergies':'TotalEnergies','jetti':'Jetti','ptt':'PTT','unioil':'Unioil','petro gazz':'Petro Gazz'}));
const freq={};for(const e of raw.elements){const b=norm(e.tags?.brand||'');if(b)freq[b]=(freq[b]||0)+1;}
const ranked=Object.keys(freq).sort((a,b)=>freq[b]-freq[a]);
for(const b of ranked){if(canonical.has(b))continue;if(new Set(canonical.values()).size>=39)break;canonical.set(b,b.replace(/\b\w/g,c=>c.toUpperCase()));}
const excluded=ranked.filter(b=>!canonical.has(b));
const stations=raw.elements.map(e=>({id:`${e.type}/${e.id}`,lat:e.lat??e.center?.lat,lon:e.lon??e.center?.lon,brand:canonical.get(norm(e.tags?.brand||''))||'Unknown',name:e.tags?.name||'',city:e.tags?.['addr:city']||e.tags?.['addr:municipality']||''}));
if(stations.length<10500||stations.some(s=>!Number.isFinite(s.lat)||!Number.isFinite(s.lon)))throw Error('Station count/coordinates invalid');
await writeFile('data/stations.json',JSON.stringify(stations),{flag:'wx'});
await writeFile('docs/brand-normalization.json',JSON.stringify({canonical:Object.fromEntries(canonical),unclassified:excluded,reason:'At most 40 displayed brands including Unknown; raw brand tags preserved in source evidence.'},null,2),{flag:'wx'});
if(excluded.length)await appendFile('BLOCKED.md',`\n- 未分类品牌归 Unknown（原标签保留在 docs/overpass-source.json）：${excluded.join(', ')}。不是已验证的品牌别名。\n`);
console.log(`stations=${stations.length}; missing coordinates=${stations.filter(s=>!Number.isFinite(s.lat)||!Number.isFinite(s.lon)).length}; brands=${new Set(stations.map(s=>s.brand)).size}`);
await appendFile('PROGRESS.md',`\n轮次 2：全量抓取完成，${stations.length} 站；归一化审计见 docs/brand-normalization.json。验收脚本在任务 2 创建后补跑 stations。\n`);
