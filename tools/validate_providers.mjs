import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../data/provider-prices.json',import.meta.url),'utf8'));
const hosts=new Set(['baguiowaterdistrict.gov.ph','balangawater.gov.ph','cagayandeoro.gov.ph','d24qbtp4vooyzi.cloudfront.net','mediafiles.manilawater.com','meralcomain.s3.ap-southeast-1.amazonaws.com','morepower.com.ph','neeco1.org','negrospower.ph','panabowaterdistrict.gov.ph','pcwd.gov.ph','ppcwater.gov.ph','web.davao-water.gov.ph','www.akelco.com.ph','www.baciwa.gov.ph','www.beneco.com.ph','www.casureco1.com','www.casureco2.com.ph','www.ccwd.gov.ph','www.clarkelectric.ph','www.davaolight.com','www.emcwd.gov.ph','www.mayniladwater.com.ph','www.mcwd.gov.ph','www.mnwd.gov.ph','www.omeco.com.ph','www.surseco2.com.ph','www.visayanelectric.com','zaneco.ph']);
for(const r of data.rows){
 const url=new URL(r.source_url);assert.equal(url.protocol,'https:');assert(hosts.has(url.hostname),'Unreviewed source domain: '+url.hostname);
 assert(['water','electricity','lpg'].includes(r.service));assert(r.provider&&r.region&&r.customer_class&&r.price_kind&&r.scope);
 assert(/^\d{4}-\d{2}-\d{2}$/.test(r.observed_at));assert(r.observed_at<=data.reviewed_at);
 if(r.price!==null)assert(Number.isFinite(r.price)&&r.price>0);
 if(r.min!=null)assert(r.min>0&&r.max>=r.min);
 if(r.service==='water'&&r.price_kind.includes('最低'))assert(/month/.test(r.unit));
 if(r.provider==='Negros Power')assert(/发电/.test(r.price_kind));
 assert(Array.isArray(r.tariffs));for(const t of r.tariffs)if(t.value!=null)assert(t.value>0);
}
for(const s of ['water','electricity','lpg']){const rows=data.rows.filter(r=>r.service===s);assert.equal(new Set(rows.map(r=>r.provider)).size,data.summary[s].providers);assert.equal(rows.length,data.summary[s].rows);}
assert(data.gaps.length>0);assert(data.directories.every(d=>new URL(d.source_url).protocol==='https:'));
console.log('PASS providers: dated official sources, positive numeric tariffs, explicit gaps and separate units; '+JSON.stringify(data.summary));
