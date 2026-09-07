import {readFile,writeFile} from 'node:fs/promises';
const p=JSON.parse(await readFile('data/prices.json','utf8'));p.rows[0].source_url='';await writeFile('docs/negative-prices.json',JSON.stringify(p),{flag:'wx'});
