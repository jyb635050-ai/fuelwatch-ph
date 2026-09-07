import {readFile,writeFile,appendFile} from 'node:fs/promises';
const data={};for(const key of ['stations','prices','history'])data[key]=JSON.parse(await readFile(`data/${key}.json`,'utf8'));
await writeFile('data/bundle.js','window.FUELWATCH='+JSON.stringify(data).replace(/</g,'\\u003c')+';\n',{flag:'wx'});
await appendFile('PROGRESS.md','\n轮次 4：地图页与本地 bundle 完成，MapLibre GeoJSON 聚合；品牌多选、3 油品、弹窗来源、15km 附近比价、缺价灰点。双击不 fetch 本地 JSON；CDN/底图仍需联网。\n');
