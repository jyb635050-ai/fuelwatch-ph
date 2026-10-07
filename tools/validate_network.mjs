import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../data/network-prices.json',import.meta.url),'utf8'));
const hosts={PLDT:'www.pldthome.com',Globe:['gfiberprepaid.globe.com.ph','www.globe.com.ph'],Converge:'www.convergeict.com',Smart:'store.smart.com.ph',DITO:'dito.ph',SKY:'www.mysky.com.ph',TNT:'tntph.com'};
const seen=new Set();
for(const r of data.rows){
 assert([hosts[r.provider]].flat().includes(new URL(r.source_url).hostname));assert.equal(new URL(r.source_url).protocol,'https:');
 assert(Number.isFinite(r.price)&&r.price>0);assert.equal(r.currency,'PHP');
 assert(['month','3 days','7 days','15 days','30 days'].includes(r.billing_period));assert(['mobile','broadband'].includes(r.service));
 assert(/^\d{4}-\d{2}-\d{2}$/.test(r.observed_at)&&r.observed_at<=data.checked_at);assert.equal(r.date_kind,'observed');
 assert(['observed','fetch-failed','manual-verified'].includes(r.status));assert(r.conditions&&r.region&&r.plan);
 if(r.service==='broadband')assert(r.speed_mbps>0||(r.speed_mbps===null&&r.status==='manual-verified'&&/Day.*Night/.test(r.plan)&&r.conditions.includes('07:00')&&r.conditions.includes('19:00')));else {assert(r.data_gb>0);assert(r.calls_text&&r.sms_text);if(r.voice_sms_source_url){assert(new URL(r.voice_sms_source_url).protocol==='https:');assert(r.voice_sms_observed_at<=data.checked_at);}}
 if(r.status==='manual-verified')assert.equal(r.observed_at,'2026-10-06');
 const key=[r.provider,r.plan,r.billing_period].join('|');assert(!seen.has(key));seen.add(key);
}
assert.equal(data.providers.length,7);for(const p of data.providers)assert(['observed','fetch-failed','manual-verified'].includes(p.status));
console.log(`PASS network: ${data.rows.length} dated official offers; ${data.providers.length} provider checks; billing periods distinct; no inferred effective dates`);

assert(data.voice_sms);assert(data.voice_sms.reviewed_at<=data.checked_at);for(const r of data.voice_sms.regular_rows){assert(r.price>0&&r.currency==='PHP');assert(['PHP/minute','PHP/SMS'].includes(r.unit));assert(['Globe','DITO'].includes(r.provider));assert([hosts[r.provider]].flat().includes(new URL(r.source_url).hostname));assert(r.observed_at<=data.checked_at);assert.equal(r.effective_date,null);if(r.published_at)assert.equal(r.status,'historical-reference');}
console.log('PASS calls/SMS: separate package benefits and '+data.voice_sms.regular_rows.length+' sourced per-unit references; historical dates retained');
