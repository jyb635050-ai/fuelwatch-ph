import{createRequire}from'node:module';import{writeFile}from'node:fs/promises';
const root='D:/blender/FuelWatch';process.env.TEMP=root+'/work/network-oct05';process.env.TMP=process.env.TEMP;
const require=createRequire('C:/Users/73405/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const{chromium}=require('playwright');const online=process.argv.includes('--online'),label=online?'online':'local';
const ctx=await chromium.launchPersistentContext(root+'/work/network-oct05/'+label+'-profile',{headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',viewport:{width:1440,height:1050},args:['--disable-crash-reporter','--disable-breakpad','--use-angle=swiftshader']});
const page=ctx.pages()[0],errors=[];page.on('pageerror',e=>errors.push(e.message));
const shot=async name=>{await page.waitForTimeout(400);await page.screenshot({path:root+'/docs/network-'+label+'-'+name+'.png',fullPage:true});};
try{
 await page.goto(online?'https://jyb635050-ai.github.io/fuelwatch-ph/?network=20261005':'file:///D:/blender/FuelWatch/index.html');
 await page.waitForFunction(()=>typeof ready!=='undefined'&&ready&&map.queryRenderedFeatures({layers:['points']}).length>=10500,null,{timeout:60000});
 if(!(await page.title()).startsWith('各种能源价格网站'))throw Error('Wrong site title');if((await page.locator('.nav-shell').innerText()).includes('天然气'))throw Error('Empty natural-gas tab retained');
 const rendered=await page.evaluate(()=>map.queryRenderedFeatures({layers:['points']}).length);await shot('map');
 await page.getByRole('button',{name:'宽带价格',exact:true}).click();if(await page.locator('.network-row').count()!==12)throw Error('12 broadband offers expected');await shot('broadband');
 await page.getByLabel('网络供应商',{exact:true}).selectOption('Globe');if(await page.locator('.network-row').count()!==3)throw Error('Provider filter');
 await page.getByLabel('计费周期',{exact:true}).selectOption('month');if(await page.locator('.network-row').count()!==0)throw Error('Periods must not be conflated');
 await page.getByLabel('网络供应商',{exact:true}).selectOption('');if(await page.locator('.network-row').count()!==9)throw Error('Monthly broadband count');
 await page.getByRole('button',{name:'电信价格',exact:true}).click();if(await page.locator('.network-row').count()!==7)throw Error('7 mobile offers expected');
 await page.getByLabel('计费周期',{exact:true}).selectOption('7 days');if(await page.locator('.network-row').count()!==1||!(await page.locator('.network-row').innerText()).includes('Smart'))throw Error('Mobile validity filter');
 await page.getByRole('button',{name:'价格总览',exact:true}).click();if(await page.locator('.utility-card').count()!==5)throw Error('Five overview panels expected');if(await page.locator('.network-dashboard').isVisible())throw Error('Network panel should close');await shot('overview');
 await page.getByRole('button',{name:'宽带价格',exact:true}).click();await page.setViewportSize({width:390,height:844});await shot('mobile');
 const mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(mobileOverflow||errors.length)throw Error(JSON.stringify({mobileOverflow,errors}));
 const result={title:await page.title(),rendered,broadband:12,mobile:7,providers:5,naturalGasRemoved:true,periodFilterVerified:true,mobileOverflow,errors};console.log('PASS network browser '+JSON.stringify(result));await writeFile(root+'/docs/network-'+label+'-results.json',JSON.stringify(result,null,2),{flag:'wx'});
}finally{await ctx.close();}
