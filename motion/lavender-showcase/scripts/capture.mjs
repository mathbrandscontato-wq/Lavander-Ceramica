import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';

const URL=process.env.LAVENDER_CAPTURE_ORIGIN || 'http://127.0.0.1:4321';
const CAPTURES=path.resolve('motion/lavender-showcase/public/captures');
await fs.mkdir(CAPTURES,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2,reducedMotion:'reduce'});
const evidence={origin:URL,viewport:'1440x900 @2x',routes:[],interactions:[],screenshots:[],prototype:{status:'not-checked'},warnings:[]};
page.on('pageerror',e=>evidence.warnings.push('Page JS: '+e.message));
async function go(route,title){
  const response=await page.goto(URL+route,{waitUntil:'networkidle',timeout:45000});
  if(!response?.ok())throw new Error('Rota '+route+': HTTP '+response?.status());
  await page.locator('body').waitFor({state:'visible'});
  await page.evaluate(async()=>{await document.fonts.ready;window.scrollTo(0,0)});
  await page.waitForTimeout(180);
  const actualTitle=await page.title();
  const h1=await page.locator('h1').first().textContent().catch(()=>null);
  if(!h1)throw new Error('Rota sem h1: '+route);
  evidence.routes.push({route,http:response.status(),title:actualTitle,h1:h1.trim()});
  console.log('OK '+route+' '+title+' '+h1.trim());
}
async function grab(name){
  await page.screenshot({path:path.join(CAPTURES,name+'.png'),animations:'disabled'});
  evidence.screenshots.push(name+'.png');
  console.log('CAPTURA '+name);
}
try {
  await go('/','Home');
  await grab('home-hero');
  await page.locator('#pecas').scrollIntoViewIfNeeded();
  await page.evaluate(()=>window.scrollBy(0,-70));
  await page.waitForTimeout(240);
  await grab('home-shop');
  const homeFilter=page.locator('[data-filter="canecas"]');
  await homeFilter.click();
  if(await homeFilter.getAttribute('aria-pressed')!=='true')throw Error('Filtro Home não aplicou');
  const countHome=await page.locator('.product-card:not([hidden])').count();
  evidence.interactions.push({route:'/',type:'filter',value:'canecas',visibleCards:countHome,status:'verified'});
  await grab('home-filter');
  await page.locator('#personalizadas').scrollIntoViewIfNeeded();
  await grab('home-personalizadas');

  await go('/categoria/canecas/','Canecas');
  await grab('category');
  await page.locator('[data-listing-filter="frases"]').click();
  const visible=await page.locator('[data-preview-category]:visible').count();
  if(visible<=0||visible>=9)throw Error('Filtro da categoria sem efeito');
  evidence.interactions.push({route:'/categoria/canecas/',type:'filter',value:'frases',visibleCards:visible,status:'verified'});
  await grab('category-filter');
  await page.locator('[data-listing-sort]').selectOption('name');
  evidence.interactions.push({route:'/categoria/canecas/',type:'sort',value:'name',status:'verified'});

  await go('/produto/amostra-tecnica/','Produto demonstrativo');
  await grab('product');
  const stage=page.locator('[data-gallery-stage]');
  const prior=await stage.getAttribute('style');
  await page.locator('[data-gallery-index="1"]').click();
  const after=await stage.getAttribute('style');
  if(prior===after)throw Error('Galeria não mudou a imagem');
  evidence.interactions.push({route:'/produto/amostra-tecnica/',type:'gallery',value:'index-1',status:'verified'});
  await grab('product-gallery');

  await go('/colecoes/personalizadas/','Personalizadas');
  await grab('personalizadas');
  await go('/manifesto/','Manifesto');
  await grab('manifesto');

  const reference=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  try {
    const resp=await reference.goto('https://lavender.mathbrands.com.br',{waitUntil:'domcontentloaded',timeout:12000});
    if(resp?.ok()){
      const refH1=await reference.locator('h1').first().textContent().catch(()=>null);
      evidence.prototype={status:'reachable',http:resp.status(),referenceH1:refH1?.trim()||null,comparability:'Different gh-pages snapshot; not pixel-identical'};
      await reference.screenshot({path:path.join(CAPTURES,'approved-prototype-reference.png')});
    }else evidence.prototype={status:'unavailable',http:resp?.status()||null};
  }catch(e){evidence.prototype={status:'unavailable',reason:String(e.message).slice(0,200)};}
  await reference.close();
  evidence.result='PASS';
}catch(e){
  evidence.result='FAIL';evidence.failure=String(e.stack||e);
  console.error(e);process.exitCode=1;
}finally{
  await fs.writeFile(path.join(CAPTURES,'capture-report.json'),JSON.stringify(evidence,null,2));
  await browser.close();
}
