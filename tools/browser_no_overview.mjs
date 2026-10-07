import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const root='D:/blender/FuelWatch',online=process.argv.includes('--online'),label=online?'online':'local';
process.env.TEMP=root+'/work/remove-overview-oct07';process.env.TMP=process.env.TEMP;
const require=createRequire('C:/Users/73405/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const ctx=await chromium.launchPersistentContext(root+'/work/remove-overview-oct07/'+label+'-profile',{headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',viewport:{width:1440,height:1050},args:['--disable-crash-reporter','--disable-breakpad','--use-angle=swiftshader']});
const page=ctx.pages()[0],errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 console.log('Direct navigation browser opened');await page.goto(online?'https://jyb635050-ai.github.io/fuelwatch-ph/?view=20261007-direct':'file:///D:/blender/FuelWatch/index.html');
 await page.waitForFunction(()=>typeof ready!=='undefined'&&ready&&map.queryRenderedFeatures({layers:['points']}).length>=10500,null,{timeout:60000});
 assert.equal(await page.locator('[data-section="overview"]').count(),0);assert.equal(await page.locator('.utility-card,.utility-grid').count(),0);
 const nav=async id=>page.locator(`.nav-shell [data-section="${id}"]`).click();
 assert.equal(await page.locator('.nav-shell button').count(),6);
 const results={};
 for(const id of ['water','electricity','lpg','broadband','mobile','water']){
  await nav(id);
  const network=['broadband','mobile'].includes(id);
  assert.equal(await page.locator('.network-dashboard').isVisible(),network);
  assert.equal(await page.locator('.utility-dashboard').isVisible(),!network);
  const rows=network?'.network-row':'.supplier-row';assert(await page.locator(rows).count()>0);results[id]=await page.locator(rows).count();
 }
 await page.getByLabel('水电供应商',{exact:true}).selectOption('Balanga Water District');assert.equal(await page.locator('.supplier-row').count(),4);
 await page.screenshot({path:root+'/docs/no-overview-'+label+'-water.png'});
 await nav('broadband');await page.getByLabel('网络供应商',{exact:true}).selectOption('SKY');assert.equal(await page.locator('.network-row').count(),7);
 await nav('fuel');assert(await page.locator('.workspace').isVisible());assert.equal(await page.locator('.network-dashboard').isVisible(),false);
 await page.waitForFunction(()=>map.queryRenderedFeatures({layers:['points']}).length>=10500);const stations=await page.evaluate(()=>map.queryRenderedFeatures({layers:['points']}).length);
 await page.screenshot({path:root+'/docs/no-overview-'+label+'-map.png'});
 await page.setViewportSize({width:390,height:844});await nav('mobile');await page.screenshot({path:root+'/docs/no-overview-'+label+'-mobile.png',fullPage:true});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);assert.deepEqual(errors,[]);
 const result={overviewTab:0,overviewCards:0,navTabs:6,categoryRows:results,providerFilters:true,returnedMapStations:stations,mobileOverflow:overflow,errors};await writeFile(root+'/docs/no-overview-'+label+'-results.json',JSON.stringify(result,null,2));console.log('PASS direct categories '+JSON.stringify(result));
}finally{await ctx.close();}
