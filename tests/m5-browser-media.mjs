import {chromium} from 'playwright-core';
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const BASE='http://127.0.0.1:4321';
const bin=execFileSync('sh',['-c','command -v google-chrome || command -v chromium'],{encoding:'utf8'}).trim();
const browser=await chromium.launch({executablePath:bin,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
const pages=[
 {path:'/',name:'home',count:10,background:'.home-custom__backdrop'},
 {path:'/categoria/canecas/',name:'canecas',count:9},
 {path:'/colecoes/personalizadas/',name:'personalizadas',count:8},
 {path:'/produto/amostra-tecnica/',name:'produto',count:0,background:'[data-gallery-stage]'},
 {path:'/manifesto/',name:'manifesto',count:0,background:'.manifesto__photo'}
];
mkdirSync('m5-browser-evidence',{recursive:true});
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  for(const route of pages){
   await page.goto(BASE+route.path,{waitUntil:'networkidle'});
   const images=await page.locator('img[src^="/assets/"]').evaluateAll(nodes=>nodes.map(n=>({
      src:n.getAttribute('src'),
      alt:n.getAttribute('alt'),
      loaded:n.complete && n.naturalWidth>0
   })));
   const ok=images.length===route.count && images.every(n=>n.loaded && n.alt && n.alt.includes('ilustrativ'));
   results.push({name:route.name,width,kind:'img_load_and_disclaimer',ok,found:images.length,expected:route.count});
   if(route.background){
    const bg=await page.locator(route.background).evaluate(n=>getComputedStyle(n).backgroundImage);
    const okBg=bg.includes('/assets/') && bg.includes('.webp');
    results.push({name:route.name,width,kind:'background_provisional',ok:okBg,bg:bg.slice(0,180)});
   }
   await page.screenshot({path:'m5-browser-evidence/'+route.name+'-'+width+'.png',fullPage:true});
  }
  await page.close();
 }
} finally {await browser.close();}
const failed=results.filter(x=>!x.ok);
writeFileSync('m5-browser-evidence/m5-media.json',JSON.stringify({checked:results.length,failed:failed.length,results},null,2));
console.log(JSON.stringify({checked:results.length,passed:results.length-failed.length,failed:failed.length,failures:failed},null,2));
if(failed.length)process.exitCode=1;
