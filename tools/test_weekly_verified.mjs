import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';import{parseSource,effectiveWeek,planUpdate}from'./update_weekly.mjs';
const html=await readFile('docs/weekly-source-fixture.html','utf8');
const parsed=parseSource(html,new Date('2026-09-07T04:00:00Z'));assert.equal(parsed.rows.length,18);assert(parsed.rows.every(r=>r.region==='NCR'&&r.source_url.startsWith('https://')));
assert.throws(()=>parseSource(html,new Date('2026-09-08T04:00:00Z')),/current effective week/);
assert.throws(()=>parseSource(html.replaceAll('As of September 1, 2026','As of September 8, 2026'),new Date('2026-09-08T04:00:00Z')),/dates disagree/);
assert.throws(()=>parseSource(html.replaceAll('83.24','N/A').replaceAll('84.62','N/A').replaceAll('86.22','N/A'),new Date('2026-09-07T04:00:00Z')),/Insufficient/);
const current=JSON.parse(await readFile('data/prices.json','utf8')),history=JSON.parse(await readFile('data/history.json','utf8'));
assert.equal(planUpdate(current,history,parsed,'2026-09-07'),null);
// Date-only synthetic transition for logic verification; no fabricated prices are published.
const candidate={...parsed,as_of:'2026-09-08',rows:parsed.rows.map(r=>({...r,as_of:'2026-09-08'}))};const next=planUpdate(current,history,candidate,'2026-09-08');assert.equal(next.history.snapshots.length,history.snapshots.length+1);assert.deepEqual(next.history.snapshots[0],history.snapshots[0]);assert(!next.prices.rows.some(r=>r.fuel==='ron95'));
assert.equal(effectiveWeek(new Date('2026-09-07T15:59:00Z')),'2026-09-01');assert.equal(effectiveWeek(new Date('2026-09-07T16:00:00Z')),'2026-09-08');
console.log('PASS weekly: 18 real rows; stale date rejected; inconsistent dates rejected; incomplete table rejected; same-week idempotent; history preserved; missing grade not carried forward; Manila week boundary');
