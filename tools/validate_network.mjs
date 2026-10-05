import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../data/network-prices.json',import.meta.url),'utf8'));
const hosts={PLDT:'www.pldthome.com',Globe:'gfiberprepaid.globe.com.ph',Converge:'www.convergeict.com',Smart:'store.smart.com.ph',DITO:'dito.ph'};
const seen=new Set();
for(const r of data.rows){
 assert.equal(new URL(r.source_url).hostname,hosts[r.provider]);assert.equal(new URL(r.source_url).protocol,'https:');
 assert(Number.isFinite(r.price)&&r.price>0);assert.equal(r.currency,'PHP');
 assert(['month','7 days','30 days'].includes(r.billing_period));assert(['mobile','broadband'].includes(r.service));
 assert(/^\d{4}-\d{2}-\d{2}$/.test(r.observed_at)&&r.observed_at<=data.checked_at);assert.equal(r.date_kind,'observed');
 assert(['observed','fetch-failed'].includes(r.status));assert(r.conditions&&r.region&&r.plan);
 if(r.service==='broadband')assert(r.speed_mbps>0);else assert(r.data_gb>0);
 const key=[r.provider,r.plan,r.billing_period].join('|');assert(!seen.has(key));seen.add(key);
}
assert.equal(data.providers.length,5);for(const p of data.providers)assert(['observed','fetch-failed'].includes(p.status));
console.log(`PASS network: ${data.rows.length} dated official offers; ${data.providers.length} provider checks; billing periods distinct; no inferred effective dates`);
