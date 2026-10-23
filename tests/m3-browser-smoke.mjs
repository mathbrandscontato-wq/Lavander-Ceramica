
import {chromium} from 'playwright-core';
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const base=process.env.M3_BASE_URL||'http://127.0.0.1:4321';
const routes=[
 {url:'/',label:'home',cards:9},
 {url:'/categoria/canecas/',label:'canecas',cards:9},
 {url:'/colecoes/personalizadas/',label:'personalizadas',cards:8},
 {url:'/produto/amostra-tecnica/',label:'produto'},
 {url:'/manifesto/',label:'manifesto'}
];
const executablePath=process.env.CHROME_PATH||execFileSync('sh',['-c','command -v google-chrome || command -v chromium'],{encoding:'utf8'}).trim();
const browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const checks=[],blocked=[];
const folder=path.resolve('m3-qa-evidence');
mkdirSync(folder,{recursive:true});
function record(name,ok,detail=''){checks.push({name,status:ok?'PASSOU':'FALHOU',detail});}
try{
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  for(const route of routes){
   const resp=await page.goto(base+route.url,{waitUntil:'networkidle'});
   record(route.label+' '+width+' HTTP',resp?.status()===200);
   record(route.label+' '+width+' lang',await page.locator('html').getAttribute('lang')==='pt-BR');
   record(route.label+' '+width+' noindex',(await page.locator('meta[name="robots"]').getAttribute('content')||'').includes('noindex'));
   record(route.label+' '+width+' h1',(await page.locator('h1').count())===1);
   record(route.label+' '+width+' main',(await page.locator('main#conteudo').count())===1);
   const size=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-window.innerWidth,
     total:document.documentElement.scrollWidth,viewport:window.innerWidth}));
   record(route.label+' '+width+' overflow',size.overflow<=2,JSON.stringify(size));
   if(route.cards){
    const selector=route.label==='home'?'[data-home-grid] .product-card':'[data-listing-grid] .listing__item';
    const found=await page.locator(selector).count();
    record(route.label+' '+width+' cards',found===route.cards,'found='+found+' expected='+route.cards);
   }
   if(width===390||width===1440){
    await page.screenshot({path:path.join(folder,route.label+'-'+width+'.png'),fullPage:true});
   }
   if(width===390&&route.label==='home'){
    const nav=await page.locator('header nav a:visible').count();
    if(nav===0)blocked.push({id:'M3-MOBILE-NAV',state:'BLOQUEADO POR DESIGN',
      cause:'Menu mobile é um pseudo-elemento sem navegação acessível e versão VIS ainda não aprovada'});
   }
  }
  await page.close();
 }
 const p=await browser.newPage({viewport:{width:1440,height:900}});
 await p.goto(base+'/',{waitUntil:'networkidle'});
 await p.locator('[data-filter="canecas"]').click();
 const homeVisible=await p.locator('[data-home-grid] .product-card:visible').count();
 record('filtro Home muda número de cards',homeVisible>0&&homeVisible<9,'shown='+homeVisible);
 record('filtro Home aria-pressed',await p.locator('[data-filter="canecas"]').getAttribute('aria-pressed')==='true');
 await p.locator('[data-filter="todos"]').click();
 record('filtro Home restaura nove',await p.locator('[data-home-grid] .product-card:visible').count()===9);
 await p.goto(base+'/categoria/canecas/',{waitUntil:'networkidle'});
 await p.locator('[data-listing-filter="frases"]').click();
 const categoryVisible=await p.locator('[data-listing-grid] .listing__item:visible').count();
 record('filtro categoria funciona',categoryVisible>0&&categoryVisible<9,'shown='+categoryVisible);
 await p.locator('[data-listing-sort]').selectOption('name');
 record('ordenação preserva filtro',await p.locator('[data-listing-grid] .listing__item:visible').count()===categoryVisible);
 await p.goto(base+'/produto/amostra-tecnica/',{waitUntil:'networkidle'});
 const imageBefore=await p.locator('[data-gallery-stage]').getAttribute('aria-label');
 await p.locator('[data-gallery-forward]').click();
 const imageAfter=await p.locator('[data-gallery-stage]').getAttribute('aria-label');
 record('galeria alterna imagem',Boolean(imageBefore&&imageAfter&&imageBefore!==imageAfter));
 if(await p.locator('[data-detail-tab]').count()>1){
  await p.locator('[data-detail-tab]').nth(1).click();
  record('segunda aba ativada',await p.locator('[data-detail-tab]').nth(1).getAttribute('aria-selected')==='true');
  record('painel da segunda aba visível',await p.locator('[data-panel]').nth(1).isVisible());
 }else record('abas de detalhe presentes',false);
 for(const route of routes){
  await p.goto(base+route.url,{waitUntil:'domcontentloaded'});
  const links=await p.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')).filter(Boolean));
  for(const href of new Set(links)){
   const url=new URL(href,base+route.url);
   if(url.origin!==base)continue;
   const response=await fetch(url.origin+url.pathname);
   record('link '+route.label+' '+href,response.status===200,'HTTP '+response.status);
   if(url.hash){
    const anchor=url.hash.slice(1);
    await p.goto(url.origin+url.pathname,{waitUntil:'domcontentloaded'});
    const found=await p.evaluate(id=>Boolean(document.getElementById(decodeURIComponent(id))),anchor);
    record('âncora '+route.label+' '+href,found);
    await p.goto(base+route.url,{waitUntil:'domcontentloaded'});
   }
  }
 }
 await p.close();
 blocked.push(
  {id:'M3-ASSETS',state:'BLOQUEADO',cause:'Fotografias/vídeo/logo/fontes finais e direitos de uso pendentes'},
  {id:'M3-VIS',state:'BLOQUEADO',cause:'Referências VIS originais não estão armazenadas como assets comparáveis neste repositório'},
  {id:'M3-CHECKOUT',state:'BLOQUEADO',cause:'Telas comerciais adicionais não aprovadas; sem checkout real'});
}finally{await browser.close();}
const failed=checks.filter(x=>x.status==='FALHOU');
const output={schema:'m3-preview-browser-qa-v1',scope:'preview-local-ficticio',
 total:checks.length,passed:checks.length-failed.length,failed:failed.length,
 blocked,checks,conclusion:failed.length?'FALHOU':'PASSOU_NO_ESCOPO_DE_PREVIA'};
writeFileSync(path.join(folder,'m3-results.json'),JSON.stringify(output,null,2));
console.log(JSON.stringify({total:output.total,passed:output.passed,failed:output.failed,
 blocked:blocked.length,failures:failed,conclusion:output.conclusion},null,2));
if(failed.length)process.exitCode=1;
