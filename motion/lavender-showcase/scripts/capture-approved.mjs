import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';

// EXACT visual snapshot approved on 04/11/2026, not the technical Astro branch.
const URL=process.env.LAVENDER_CAPTURE_ORIGIN || 'http://127.0.0.1:4532';
const SNAPSHOT='gh-pages@8fd5af3ef68210d10369c6d1a42a7911992815ea';
const CAPTURES=path.resolve('motion/lavender-showcase/public/captures');
await fs.mkdir(CAPTURES,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2,reducedMotion:'reduce'});
const evidence={
  origin:URL,visualSource:SNAPSHOT,viewport:'1440x900 @2x',
  routes:[],interactions:[],screenshots:[],warnings:[],result:'PENDING',
  comparison:{
    source:'approved gh-pages snapshot',
    note:'The reference source is captured directly from exact approved commit; Astro is excluded from video imagery.'
  }
};
page.on('pageerror',e=>evidence.warnings.push('Page JS: '+e.message));
async function goto(route,label){
  const response=await page.goto(URL+'/#'+route,{waitUntil:'networkidle',timeout:45000});
  if(!response?.ok())throw new Error('HTTP error '+route+': '+response?.status());
  await page.locator('#main').waitFor({state:'visible',timeout:12000});
  await page.waitForFunction(()=>document.querySelector('#main h1')?.textContent?.trim().length>0,{timeout:12000});
  await page.evaluate(async()=>{
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).filter(i=>i.src).map(i=>i.decode().catch(()=>{})));
    window.scrollTo({top:0,behavior:'instant'});
  });
  await page.waitForTimeout(120);
  const h1=(await page.locator('#main h1').first().textContent()).trim();
  evidence.routes.push({route,http:response.status(),title:await page.title(),h1});
  console.log('APPROVED PAGE '+label+' '+route+' h1='+h1);
}
async function shot(filename){
  await page.screenshot({path:path.join(CAPTURES,filename+'.png'),animations:'disabled'});
  evidence.screenshots.push(filename+'.png');
  console.log('SHOT '+filename);
}
try{
  await goto('/','Home');
  if(!await page.locator('.header .brand-logo').first().isVisible())throw Error('Official approved logo was not loaded');
  const fonts=await page.evaluate(()=>Array.from(document.fonts).filter(f=>f.status==='loaded').map(f=>f.family));
  if(!fonts.some(f=>f.includes('Cormorant Garamond'))||!fonts.some(f=>f.includes('Inter')))throw Error('Approved typography did not load: '+fonts.join(','));
  evidence.fonts=fonts;
  await shot('home-hero');

  await page.locator('.home-catalog').scrollIntoViewIfNeeded();
  await page.evaluate(()=>window.scrollBy({top:-50,behavior:'instant'}));
  await shot('home-shop');
  const homeFilter=page.locator('.home-heading [data-filter="Canecas"]');
  await homeFilter.click();
  if(await homeFilter.getAttribute('aria-pressed')!=='true')throw Error('Approved home filter malfunction');
  const visibleHome=await page.locator('.home-catalog .product-card').count();
  if(visibleHome<1||visibleHome>=9)throw Error('Approved home filter did not affect grid');
  evidence.interactions.push({route:'/',type:'filter',value:'Canecas',visibleProducts:visibleHome,status:'VERIFIED'});
  await shot('home-filter');
  await page.locator('.custom-banner').scrollIntoViewIfNeeded();
  await shot('home-personalizadas');

  await goto('/categoria/canecas','Canecas');
  await shot('category');
  await page.locator('#sort').selectOption('name');
  evidence.interactions.push({route:'/categoria/canecas',type:'sort',value:'name',status:'VERIFIED'});
  await shot('category-sort');

  await goto('/produto/caneca-estante','Detail page (approved demonstrative product)');
  await shot('product');
  await page.locator('[data-tab="care"]').click();
  if(await page.locator('#panel-care').isHidden())throw Error('Approved details tabs did not switch');
  evidence.interactions.push({route:'/produto/caneca-estante',type:'tab',value:'care',status:'VERIFIED'});
  await shot('product-details');

  await goto('/colecoes/personalizadas','Personalizadas');
  await shot('personalizadas');
  await goto('/manifesto','Manifesto');
  await shot('manifesto');

  evidence.result='PASS';
}catch(e){evidence.result='FAIL';evidence.failure=String(e.stack||e);console.error(e);process.exitCode=1;}
finally{
  await fs.writeFile(path.join(CAPTURES,'capture-report.json'),JSON.stringify(evidence,null,2));
  await browser.close();
}
