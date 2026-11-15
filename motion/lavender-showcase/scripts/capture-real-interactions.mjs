import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';

// The actual, approved reference site, checked against an immutable git SHA in CI.
const ORIGIN=process.env.LAVENDER_CAPTURE_ORIGIN||'http://127.0.0.1:4532';
const APPROVED='gh-pages@8fd5af3ef68210d10369c6d1a42a7911992815ea';
const ROOT=path.resolve('motion/lavender-showcase');
const CAP=path.join(ROOT,'public/captures');
await fs.mkdir(CAP,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2,reducedMotion:'reduce'});
const data={version:'V5',source:APPROVED,viewport:{width:1440,height:900},states:{},actions:[],pages:[],fonts:[],errors:[],status:'PENDING'};
page.on('pageerror',e=>data.errors.push(String(e.message)));

async function prepare(){
  await page.evaluate(async()=>{
    for(const image of document.images)image.loading='eager';
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).filter(i=>i.src).map(i=>i.decode().catch(()=>{})));
  });
}
async function route(expected){
  await page.waitForFunction(p=>(location.hash.slice(1)||'/')===p,expected,{timeout:16000});
  await page.locator('#main').waitFor({state:'visible',timeout:12000});
  data.pages.push({route:expected,heading:(await page.locator('#main h1').first().textContent())?.trim()});
}
async function snap(name){
  await prepare();
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(160);
  const h=await page.evaluate(()=>Math.max(document.body.scrollHeight,document.documentElement.scrollHeight));
  await page.screenshot({path:path.join(CAP,name+'.png'),fullPage:true,animations:'disabled',timeout:60000});
  const state={file:name+'.png',pageHeight:h,route:await page.evaluate(()=>location.hash.slice(1)||'/')};
  data.states[name]=state;
  console.log('CAPTURE',name,JSON.stringify(state));
}
async function target(locator){
  await locator.scrollIntoViewIfNeeded({timeout:15000});
  const rect=await locator.boundingBox();
  if(!rect||rect.width<3||rect.height<3)throw Error('Clickable target bounding box missing');
  const scrollY=await page.evaluate(()=>window.scrollY);
  const x=Math.round(rect.x+rect.width/2);
  const y=Math.round(rect.y+rect.height/2+scrollY);
  if(x<0||x>1440)throw Error('Control center beyond horizontal viewport');
  return {x,y,width:Math.round(rect.width),height:Math.round(rect.height),scrollY};
}
async function click(id,from,to,locator,assertFn,label){
  const before=await target(locator);
  const href=await locator.getAttribute('href');
  const dataRoute=await locator.getAttribute('data-route');
  const text=(await locator.textContent()||'').trim().replace(/\s+/g,' ').slice(0,80);
  await locator.click({timeout:15000});
  await assertFn();
  const afterRoute=await page.evaluate(()=>location.hash.slice(1)||'/');
  await snap(to);
  data.actions.push({id,label,from,to,point:before,href,dataRoute,text,afterRoute,verified:true});
  console.log('REAL_CLICK',id,JSON.stringify(data.actions.at(-1)));
}

try{
  let response=await page.goto(ORIGIN+'/#/',{waitUntil:'networkidle',timeout:60000});
  if(!response?.ok())throw Error('Approved snapshot did not load '+response?.status());
  await route('/');
  const fonts=await page.evaluate(()=>Array.from(document.fonts).filter(f=>f.status==='loaded').map(f=>f.family));
  if(!fonts.some(f=>f.includes('Cormorant Garamond'))||!fonts.some(f=>f.includes('Inter')))throw Error('Approved fonts not loaded: '+fonts);
  if(!await page.locator('.header .brand-logo').first().isVisible())throw Error('Approved SVG logo missing');
  data.fonts=fonts;
  await snap('v5-home');

  // 1. Real hero CTA click. DO NOT change page via direct navigation.
  await click('explorar','v5-home','v5-loja',
    page.locator('.hero-content a[data-route="/loja"]'),
    async()=>route('/loja'),'Explorar a loja');

  // 2. Actual live category filtering, verified through product count and aria.
  const beforeCount=await page.locator('#product-grid .product-card').count();
  await click('filtrar-canecas','v5-loja','v5-loja-canecas',
    page.locator('.listing .chips [data-filter="Canecas"]'),
    async()=>{
      await page.waitForFunction(()=>document.querySelector('.listing .chips [data-filter="Canecas"]')?.getAttribute('aria-pressed')==='true');
      const n=await page.locator('#product-grid .product-card').count();
      if(n<1||n>=beforeCount)throw Error('Filtering did not change cards: '+beforeCount+' -> '+n);
      data.productCount={initial:beforeCount,filtered:n};
    },'Filtrar Canecas');

  // 3. Open the actual "Caneca Estante" product from the filtered listing.
  await click('abrir-produto','v5-loja-canecas','v5-produto',
    page.locator('#product-grid a[data-route="/produto/caneca-estante"]').first(),
    async()=>route('/produto/caneca-estante'),'Abrir Caneca Estante');

  // 4. Real product information tab. Captured full-page before/after so
  // Remotion can smoothly scroll the real page (not a fabricated UI).
  await click('cuidados','v5-produto','v5-cuidados',
    page.locator('[data-tab="care"]'),
    async()=>{
      if(await page.locator('#panel-care').isHidden())throw Error('Cuidados tab did not open');
      if(await page.locator('[data-tab="care"]').getAttribute('aria-selected')!=='true')
        throw Error('Care tab aria state not activated');
    },'Abrir aba Cuidados');

  // 5. Real navigation via the original brand logo back to home.
  await click('voltar-home','v5-cuidados','v5-home-return',
    page.locator('.header .brand[data-route="/"]').first(),
    async()=>route('/'),'Voltar à Home');

  // 6. Home section below the product grid: scroll and click custom CTA.
  await click('personalizar','v5-home-return','v5-personalizadas',
    page.locator('.custom-box a[data-route="/colecoes/personalizadas"]'),
    async()=>route('/colecoes/personalizadas'),'Abrir Peças Personalizadas');

  // 7. Navigate to the editorial / manifesto page via the live header link.
  await click('sobre','v5-personalizadas','v5-manifesto',
    page.locator('.nav-desktop a[data-route="/manifesto"]'),
    async()=>route('/manifesto'),'Abrir Manifesto');

  const order=['explorar','filtrar-canecas','abrir-produto','cuidados','voltar-home','personalizar','sobre'];
  if(order.some((id,i)=>data.actions[i]?.id!==id))throw Error('Storyboard click order incomplete');
  if(Object.keys(data.states).length!==8)throw Error('Missing visual states');
  data.status='PASS';
} catch(e){
  console.error(e);
  data.status='FAIL';data.failure=String(e.stack||e);process.exitCode=1;
}finally{
  await fs.writeFile(path.join(CAP,'interaction-report.json'),JSON.stringify(data,null,2));
  await fs.writeFile(path.join(ROOT,'src/interaction-data.json'),JSON.stringify(data,null,2));
  await browser.close();
}
