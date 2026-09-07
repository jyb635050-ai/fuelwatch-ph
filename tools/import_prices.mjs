import {readFile,writeFile,appendFile} from 'node:fs/promises';
const html=await readFile('docs/gaswatch-source.html','utf8');
const rows=[];for(const m of html.matchAll(/<tr><th scope="row">([^<]+)<\/th><td[^>]*>([\d.]+)<\/td><td[^>]*>([\d.]+)<\/td><\/tr>/g)){
 if(['Jetti','Cleanfuel'].includes(m[1]))continue;
 for(const [i,fuel] of ['diesel','ron91'].entries())rows.push({brand:m[1]==='Total'?'TotalEnergies':m[1],region:'NCR',fuel,price:Number(m[i+2]),source_url:'https://gaswatchph.com/',as_of:'2026-09-01'});
}
const readable=await readFile('docs/gaswatch-readable.txt','utf8');
if(!readable.includes('86.01')||!readable.includes('Prem 95'))throw Error('RON95 evidence missing');
rows.push({brand:'Shell',region:'NCR',fuel:'ron95',price:86.01,source_url:'https://gaswatchph.com/',as_of:'2026-09-01'});
if(rows.length!==19)throw Error(`Unexpected source rows ${rows.length}`);
const prices={as_of:'2026-09-01',rows};
await writeFile('data/prices.json',JSON.stringify(prices,null,2),{flag:'wx'});
await writeFile('data/history.json',JSON.stringify({snapshots:[{...prices,reconstructed:false,collected_at:'2026-09-07'}]},null,2),{flag:'wx'});
const stations=JSON.parse(await readFile('data/stations.json','utf8'));
await appendFile('BLOCKED.md','\n- 价格仅核实 NCR 的 9 品牌柴油/91 和 Shell 95，共 19 行。其他地区全部缺价；其他品牌及非 Shell 的 95 缺价。Jetti/Cleanfuel 发布值恰为总体均价，保守不收录。缺价品牌清单：'+[...new Set(stations.map(s=>s.brand))].filter(b=>!rows.some(r=>r.brand===b)).join(', ')+'。\n- 没有可验证的历史周价格快照，不用调价额反推历史品牌均价。数据自 2026-09-01 周开始累积。\n- 为避免覆盖正式价格文件，负向验收使用独立副本传参，正式价格保持不变。\n');
await appendFile('PROGRESS.md','\n轮次 3：价格来源网页与 Jina 文本已存档；提取 19 条当周 NCR 参考价，首周快照已创建。地区仅按明确 NCR 城市标签匹配，无法判定地区的站点不赋价。\n');
