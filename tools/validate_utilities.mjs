import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../data/utility-prices.json',import.meta.url),'utf8'));
const trusted=new Set(['www.mayniladwater.com.ph','meralcomain.s3.ap-southeast-1.amazonaws.com','doe.gov.ph','d24qbtp4vooyzi.cloudfront.net']);
assert.deepEqual(data.categories.map(c=>c.id),['water','electricity','lpg','natural-gas']);
const today=new Date().toISOString().slice(0,10);
for(const c of data.categories){
 assert(trusted.has(new URL(c.source_url).hostname));
 assert(c.checked_at<=today);
 assert(['reference','historical','unavailable','fetch-failed'].includes(c.status));
 for(const o of c.observations){
  assert(trusted.has(new URL(o.source_url).hostname));
  assert(/^\d{4}-\d{2}-\d{2}$/.test(o.as_of)&&o.as_of<=c.checked_at);
  assert(o.provider&&o.region&&o.scope&&o.unit);
  if(o.value!=null)assert(Number.isFinite(o.value)&&o.value>0);
  else assert(Number.isFinite(o.min)&&o.min>0&&o.min<=o.common&&o.common<=o.max);
 }
 if(c.status==='unavailable')assert.equal(c.observations.length,0);
 if(c.id==='electricity')for(const o of c.observations)assert(o.scope.includes('residential')&&o.scope.includes('unverified'));
 if(c.id==='lpg')for(const o of c.observations)assert(o.unit.includes('11 kg')&&o.scope.includes('not natural gas'));
}
assert.equal(data.categories.find(c=>c.id==='natural-gas').observations.length,0,'No verified retail natural-gas tariff in this release');
console.log('PASS utilities: 4 separate categories; official source hosts; dated observations; tariff classes explicit; natural gas blank');
