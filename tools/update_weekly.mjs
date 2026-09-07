import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,appendFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const SOURCE='https://gaswatchph.com/';
const HASH='cabd0d72a74f79132c7a4d537595d0cf31447407ed0fe92188203969551a90a9';
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const brands=new Map(['PTT','Flying V','Seaoil','Unioil','Petron','Shell','Caltex','Phoenix'].map(b=>[b,b]));brands.set('Total','TotalEnergies');brands.set('TotalEnergies','TotalEnergies');
export function effectiveWeek(now=new Date()) {const local=new Date(now.getTime()+8*3600000);local.setUTCHours(0,0,0,0);local.setUTCDate(local.getUTCDate()-(local.getUTCDay()+5)%7);return local.toISOString().slice(0,10);}
export function parseSource(html,now=new Date()) {
 const chip=html.match(/data-snap=["']chip["'][^>]*>\s*As of ([A-Za-z]+) (\d{1,2}), (\d{4})\s*</i);
 assert(chip,'Missing unambiguous snapshot date');const month=months.findIndex(m=>m.toLowerCase()===chip[1].toLowerCase());assert(month>=0,'Unknown month');
 const as_of=`${chip[3]}-${String(month+1).padStart(2,'0')}-${chip[2].padStart(2,'0')}`;
 assert.equal(new Date(as_of+'T00:00:00Z').toISOString().slice(0,10),as_of,'Invalid source date');
 assert.equal(as_of,effectiveWeek(now),'Source has not published the current effective week; refusing to relabel old prices');
 const table=html.match(/<table\b[^>]*>\s*<caption>Metro Manila diesel and unleaded prices by brand[\s\S]*?<\/table>/i)?.[0];
 assert(table,'NCR snapshot table not found');assert(/RON 91/i.test(html),'RON91 grade evidence missing');
 const caption=table.match(/data-snap=["']week["'][^>]*>([^<]+)/)?.[1];assert(caption,'Week caption missing');
 // Cross-check table start date against the date chip; tolerate ranges crossing a month/year boundary.
 const start=caption.match(/week of ([A-Za-z]+) (\d{1,2})/i);assert(start&&months[month].toLowerCase().startsWith(start[1].toLowerCase())&&Number(start[2])===Number(chip[2]),'Table and snapshot dates disagree');assert(caption.includes(chip[3]),'Caption year does not match');
 const rows=[],seen=new Set();for(const m of table.matchAll(/<tr>\s*<th scope=["']row["']>([^<]+)<\/th>\s*<td[^>]*>\s*(\d+(?:\.\d+)?)\s*<\/td>\s*<td[^>]*>\s*(\d+(?:\.\d+)?)\s*<\/td>\s*<\/tr>/gi)){
 const brand=brands.get(m[1].trim());if(!brand)continue;for(const[i,fuel]of ['diesel','ron91'].entries()){const price=Number(m[i+2]);assert(Number.isFinite(price)&&price>0,'Invalid published price');const key=brand+'|'+fuel;assert(!seen.has(key),'Duplicate published brand/grade');seen.add(key);rows.push({brand,region:'NCR',fuel,price,source_url:SOURCE,as_of});}}
 assert(rows.length>=15,'Insufficient verified price rows; no partial replacement');return {as_of,rows:rows.sort((a,b)=>a.brand.localeCompare(b.brand)||a.fuel.localeCompare(b.fuel))};
}
export function planUpdate(current,history,candidate,collectedAt) {
 assert(candidate.as_of>=current.as_of,'Refusing older snapshot');
 if(candidate.as_of===current.as_of)return null; // Weekly immutable snapshot; never rewrite a prior week.
 assert(!history.snapshots.some(s=>s.as_of===candidate.as_of),'Snapshot already exists');
 const updated={snapshots:[...history.snapshots,{...candidate,reconstructed:false,collected_at:collectedAt}].sort((a,b)=>a.as_of.localeCompare(b.as_of))};return {prices:candidate,history:updated};
}
async function main(){
 const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));process.chdir(root);
 assert.equal(createHash('sha256').update(await readFile('docs/acceptance.mjs')).digest('hex'),HASH,'Frozen acceptance was modified');
 // curl is bundled on Windows and GitHub Ubuntu; it worked where Node fetch returned HTTP 406.
 const html=execFileSync(process.platform==='win32'?'curl.exe':'curl',['--fail','--silent','--show-error','--location','--retry','2','--max-time','60',SOURCE],{encoding:'utf8',maxBuffer:8*1024*1024});
 const now=new Date(),candidate=parseSource(html,now),current=JSON.parse(await readFile('data/prices.json','utf8')),history=JSON.parse(await readFile('data/history.json','utf8'));
 const update=planUpdate(current,history,candidate,now.toISOString().slice(0,10));
 if(!update){console.log(`NO_CHANGE: verified source week ${candidate.as_of} is already recorded; ${current.rows.length} existing rows retained`);return;}
 if(process.argv.includes('--check')){console.log(`READY: ${candidate.as_of}; verified rows=${candidate.rows.length}; prior snapshots=${history.snapshots.length}; no files changed`);return;}
 // New user request authorizes weekly replacement of these generated data files; backups precede replacement.
 const backup=`data/update-backups/${current.as_of}-${now.toISOString().replace(/[:.]/g,'-')}`;await mkdir(backup,{recursive:true});
 for(const file of ['prices.json','history.json','bundle.js'])await writeFile(`${backup}/${file}`,await readFile(`data/${file}`),{flag:'wx'});
 await mkdir('data/snapshots',{recursive:true});await writeFile(`data/snapshots/${candidate.as_of}.json`,JSON.stringify(update.history.snapshots.find(s=>s.as_of===candidate.as_of),null,2)+'\n',{flag:'wx'});
 const stations=JSON.parse(await readFile('data/stations.json','utf8'));
 await writeFile('data/prices.json',JSON.stringify(update.prices,null,2)+'\n');await writeFile('data/history.json',JSON.stringify(update.history,null,2)+'\n');await writeFile('data/bundle.js','window.FUELWATCH='+JSON.stringify({stations,...update}).replace(/</g,'\\u003c')+';\n');
 execFileSync(process.execPath,['docs/acceptance.mjs','all'],{stdio:'inherit'});
 await appendFile('PROGRESS.md',`\nAutomatic price update ${now.toISOString()}: source=${SOURCE}, week=${candidate.as_of}, rows=${candidate.rows.length}; prior snapshot retained; frozen acceptance passed.\n`);
 console.log(`UPDATED: ${candidate.as_of}; rows=${candidate.rows.length}; history=${update.history.snapshots.length}`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error('UPDATE_BLOCKED: '+e.message);process.exitCode=1;});
