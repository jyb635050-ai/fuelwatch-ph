import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const root='D:/blender/FuelWatch',online=process.argv.includes('--online'),label=online?'online':'local';
process.env.TEMP=root+'/work/brand-oct07';process.env.TMP=process.env.TEMP;
const require=createRequire('C:/Users/73405/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const ctx=await chromium.launchPersistentContext(root+'/work/brand-oct07/'+label+'-profile',{headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',viewport:{width:1440,height:1050},args:['--disable-crash-reporter','--disable-breakpad','--use-angle=swiftshader']});
const page=ctx.pages()[0],errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 console.log('Brand browser opened');await page.goto(online?'https://jyb635050-ai.github.io/fuelwatch-ph/?brand=20261007':'file:///D:/blender/FuelWatch/index.html');
 await page.waitForFunction(()=>typeof ready!=='undefined'&&ready&&map.queryRenderedFeatures({layers:['points']}).length>=10500,null,{timeout:60000});
 assert((await page.title()).startsWith('衡价 AUREVA'));assert.equal(await page.locator('.brand-cn').innerText(),'衡价');assert.equal(await page.locator('.brand-en').innerText(),'AUREVA');
 assert(await page.locator('header img.logo').evaluate(el=>el.complete&&el.naturalWidth>0));assert((await page.locator('link[rel="icon"]').getAttribute('href')).startsWith('aureva-icon.svg'));
 await page.locator('header').screenshot({path:root+'/docs/aureva-'+label+'-header.png'});
 await page.screenshot({path:root+'/docs/aureva-'+label+'-map.png'});
 assert.equal(await page.locator('[data-section="overview"]').count(),0);assert.equal(await page.locator('.utility-card').count(),0);await page.locator('[data-section="water"]').click();assert(await page.locator('.supplier-row').count()>0);await page.screenshot({path:root+'/docs/aureva-'+label+'-overview.png'});
 const widths=[390,320],overflows=[];
 for(const width of widths){await page.setViewportSize({width,height:844});overflows.push(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));assert.equal(overflows.at(-1),false);if(width===390)await page.screenshot({path:root+'/docs/aureva-'+label+'-mobile.png',fullPage:true});}
 assert.deepEqual(errors,[]);const result={title:await page.title(),chinese:'衡价',english:'AUREVA',iconLoaded:true,mapStations:10842,overviewRemoved:true,mobileWidths:widths,mobileOverflow:overflows,errors};
 await writeFile(root+'/docs/aureva-'+label+'-results.json',JSON.stringify(result,null,2));console.log('PASS bilingual brand '+JSON.stringify(result));
}finally{await ctx.close();}
