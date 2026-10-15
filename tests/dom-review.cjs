// QA opcional de integração DOM: define JSDOM_PATH para a instalação de teste.
// Não substitui renderização/QA visual de um navegador.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM,VirtualConsole}=require(process.env.JSDOM_PATH||'jsdom');
const vc=new VirtualConsole();let errors=[];vc.on('jsdomError',e=>errors.push(e));vc.on('error',(...a)=>console.error(...a));
const html=fs.readFileSync(require('node:path').join(__dirname,'../dist/Lavender_Previa_Estrutural.html'),'utf8');
const dom=new JSDOM(html,{url:'file:///Lavender.html#/loja',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.ResizeObserver=class{observe(){}disconnect(){}};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};}});
const w=dom.window,d=w.document;
const settle=()=>new Promise(r=>setTimeout(r,30));
const click=el=>{assert.ok(el,'controle deve existir');el.click();};
const route=async(path)=>{w.location.hash=path;await settle();};
const cards=()=>d.querySelectorAll('#product-grid [data-product-id]');
(async()=>{
 await settle();assert.equal(cards().length,9);console.log('PASSOU: Loja com nove produtos');
 for(const [cat,count] of [['Canecas',4],['Pratos',2],['Tigelas',2],['Decoração',1],['Todos',9]]){click(d.querySelector(`[data-filter="${cat}"]`));await settle();assert.equal(cards().length,count);assert.equal(d.querySelector(`[data-filter="${cat}"]`).getAttribute('aria-pressed'),'true');}console.log('PASSOU: filtros e aria-pressed');
 click(d.querySelector('[data-filter="Pratos"]'));const search=d.querySelector('#catalog-search');search.value='caneca';search.dispatchEvent(new w.Event('input',{bubbles:true}));await settle();assert.equal(cards().length,0);click(d.querySelector('[data-action="clear"]'));await settle();assert.equal(cards().length,9);console.log('PASSOU: busca, interseção, vazio e limpar');
 const sort=d.querySelector('#sort');sort.value='price-down';sort.dispatchEvent(new w.Event('change',{bubbles:true}));await settle();assert.equal(cards()[0].dataset.productId,'LV-DEMO-06');console.log('PASSOU: ordenação no DOM');
 await route('/');assert.equal(cards().length,9);await route('/categoria/canecas');assert.equal(cards().length,4);await route('/colecoes/personalizadas');assert.equal(cards().length,3);console.log('PASSOU: Home, categoria e coleção');
 await route('/produto/caneca-estante');assert.ok(d.querySelector('#product-form'));let form=d.querySelector('#product-form');form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await route('/demo/carrinho');assert.equal(d.querySelectorAll('.cart-list li').length,1);await route('/demo/checkout');assert.ok(d.querySelector('#checkout-form'));d.querySelector('#checkout-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle();assert.match(d.querySelector('h1').textContent,/Pedido fictício/);console.log('PASSOU: produto, carrinho, checkout e confirmação');
 await route('/personalizar/caneca-personalizada');assert.equal(d.querySelectorAll('input[name=model]').length,3);d.querySelector('#idea').value='<script>não executar</script>';d.querySelector('#product-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await route('/demo/carrinho');assert.match(d.querySelector('.cart-list').textContent,/sob orçamento/);assert.equal(d.querySelector('.cart-list script'),null);await route('/demo/checkout');assert.equal(d.querySelector('#checkout-form'),null);console.log('PASSOU: personalização sem pagamento e texto seguro');
 for(const path of ['/produto/caneca-personalizada','/personalizar/caneca-estante','/inexistente']){await route(path);assert.match(d.querySelector('h1').textContent,/não encontrada/);}console.log('PASSOU: rotas inválidas e elegibilidade');
 await route('/manifesto');assert.match(d.querySelector('h1').textContent,/Manifesto/);assert.ok(d.querySelector('.brand-logo'));assert.ok(d.querySelector('.footer-art img'));console.log('PASSOU: Manifesto e assets globais presentes');
 assert.equal(errors.length,0,errors.map(e=>e.message).join('\n'));console.log('PASSOU: zero exceções JS no DOM emulado');w.close();
})().catch(e=>{console.error(e);w.close();process.exitCode=1;});
