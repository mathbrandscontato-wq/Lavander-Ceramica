import test from 'node:test';
import assert from 'node:assert/strict';
import {combineEditorialCommerce,moneyInCents,previewQuote,dropState,mockEvent} from '../src/lib/commerce/m2Contract.mjs';
import {makeWooReader,loadM2Product,reconcileCatalogReadOnly} from '../src/lib/commerce/wooRead.mjs';
const editorial={productId:'M2-SKU-001',slug:'ficticio-m2',name:'Peça fictícia M2',
  publicationStatus:'approved',priceAmount:1,stockStatus:'available'};
const woo={id:123,sku:'M2-SKU-001',status:'publish',price:'149.90',currency:'BRL',
 manage_stock:true,stock_quantity:1,stock_status:'instock',
 backorders:'no',sold_individually:true,purchasable:true};
test('SKU único e preço cobrado vêm de WooCommerce, não de Sanity',()=>{
 const x=combineEditorialCommerce(editorial,woo);
 assert.equal(x.priceCents,14990);
 assert.equal(previewQuote([{sku:x.sku,quantity:1}],[x]).subtotalCents,14990);
 assert.equal(previewQuote([{sku:x.sku,quantity:1}],[x]).transactable,false);
});
test('bloqueia divergência de SKU, conteúdo não aprovado e preço malformado',()=>{
 assert.throws(()=>combineEditorialCommerce(editorial,{...woo,sku:'M2-DIFERENTE'}),{code:'SKU_MISMATCH'});
 assert.throws(()=>combineEditorialCommerce({...editorial,publicationStatus:'pending'},woo),{code:'EDITORIAL_NOT_APPROVED'});
 for(const v of ['0','5,50','-1.00','2.999','1234567890',null])assert.throws(()=>moneyInCents(v),{code:'PRICE_INVALID'});
 assert.equal(moneyInCents('0.99'),99);
});
test('sem estoque gerenciado ou com backorders sempre indisponível',()=>{
 for(const p of [{manage_stock:false},{stock_quantity:0},{backorders:'yes'},{stock_status:'outofstock'},{sold_individually:false}]){
   assert.equal(combineEditorialCommerce(editorial,{...woo,...p}).available,false);
 }
});
test('simulador não autoriza duas unidades ou SKU repetido',()=>{
 const x=combineEditorialCommerce(editorial,woo);
 assert.throws(()=>previewQuote([{sku:x.sku,quantity:2}],[x]),{code:'UNIQUE_QUANTITY'});
 assert.throws(()=>previewQuote([{sku:x.sku,quantity:1},{sku:x.sku,quantity:1}],[x]),{code:'DUPLICATE_SKU'});
 assert.throws(()=>previewQuote([{sku:x.sku,quantity:1}],[{...x,available:false}]),{code:'UNAVAILABLE'});
});
test('drop agendado não entra no ar antecipadamente',()=>{
 const d={status:'scheduled',publishAt:'2026-11-01T12:00:00Z',closeAt:'2026-11-02T12:00:00Z'};
 assert.equal(dropState(d,'2026-11-01T11:59:59Z'),'scheduled');
 assert.equal(dropState(d,'2026-11-01T12:01:00Z'),'awaiting_editorial_publication');
 assert.equal(dropState({...d,status:'published'},'2026-11-01T12:01:00Z'),'published');
 assert.equal(dropState({...d,status:'published'},'2026-11-02T12:00:00Z'),'closed');
});
test('webhooks somente simulados: duplicata, fora de ordem, pago após cancelamento',()=>{
 const init={status:'pending',sequence:1,seen:[]};
 const first=mockEvent(init,{id:'fake1',sequence:2,status:'paid'});
 assert.equal(first.state.status,'paid');
 assert.equal(mockEvent(first.state,{id:'fake1',sequence:2,status:'paid'}).action,'duplicate_ignored');
 assert.equal(mockEvent(first.state,{id:'fake-old',sequence:1,status:'pending'}).action,'stale_ignored');
 assert.equal(mockEvent({status:'cancelled',sequence:2,seen:[]},{id:'fake-late',sequence:3,status:'paid'}).action,'requires_manual_reconciliation');
});
test('Woo reader exige HTTPS externo, cabeçalho servidor e retorno SKU exato',async()=>{
 assert.throws(()=>makeWooReader({baseUrl:'http://example.com',key:'fake',secret:'fake'}),{code:'WOO_HTTPS_REQUIRED'});
 let captured;
 const reader=makeWooReader({baseUrl:'https://example.invalid',key:'fake',secret:'fake',
  fetchImpl:async(u,o)=>{captured={u,o};return {ok:true,json:async()=>[woo]}}});
 assert.equal((await loadM2Product(editorial,reader)).priceCents,14990);
 assert.match(captured.u,/sku=M2-SKU-001/);
 assert.ok(captured.o.headers.Authorization.startsWith('Basic '));
});
test('Woo falha fechado em indisponibilidade, retorno vazio e conteúdo pendente',async()=>{
 const down=makeWooReader({baseUrl:'https://example.invalid',key:'fake',secret:'fake',fetchImpl:async()=>{throw Error('down')}});
 await assert.rejects(()=>loadM2Product(editorial,down),{code:'WOO_UNAVAILABLE'});
 const missing=makeWooReader({baseUrl:'https://example.invalid',key:'fake',secret:'fake',
   fetchImpl:async()=>({ok:true,json:async()=>[]})});
 await assert.rejects(()=>loadM2Product(editorial,missing),{code:'WOO_AMBIGUOUS_SKU'});
 let called=false;
 await assert.rejects(()=>loadM2Product({...editorial,publicationStatus:'pending'},async()=>{called=true;return woo}),{code:'EDITORIAL_NOT_APPROVED'});
 assert.equal(called,false);
});

test('conciliação somente leitura: mantém SKU autorizado e isola divergências',async()=>{
 let calls=0;
 const out=await reconcileCatalogReadOnly([
  editorial,{...editorial,productId:'M2-MISSING'}, {...editorial,productId:'M2-SKU-001'}, {...editorial,productId:'M2-PENDING',publicationStatus:'pending'}],
  async id=>{calls++;if(id==='M2-SKU-001')return woo;throw Object.assign(Error('none'),{code:'WOO_UNAVAILABLE'});}
 );
 assert.equal(out.products.length,1);
 assert.deepEqual(out.blocked.map(x=>x.code),['WOO_UNAVAILABLE','SKU_DUPLICATE']);
 assert.equal(out.mode,'read_only');
 assert.equal(calls,2);
});
