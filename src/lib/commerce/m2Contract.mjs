/** M2: contrato experimental. NÃO processa pedidos, dinheiro ou webhooks reais. */
export function m2Error(code){return Object.assign(new Error(code),{code});}
export function sku(value){
 if(typeof value!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9._-]{1,79}$/.test(value))throw m2Error('SKU_INVALID');
 return value;
}
export function moneyInCents(value){
 if(typeof value!=='string'||!/^(0|[1-9][0-9]{0,8})(\.[0-9]{1,2})?$/.test(value))throw m2Error('PRICE_INVALID');
 const [whole,fraction='']=value.split('.');
 const cents=Number(whole)*100+Number((fraction+'00').slice(0,2));
 if(!Number.isSafeInteger(cents)||cents<=0)throw m2Error('PRICE_INVALID');
 return cents;
}
export function combineEditorialCommerce(editorial,commerce){
 if(editorial?.publicationStatus!=='approved')throw m2Error('EDITORIAL_NOT_APPROVED');
 const id=sku(editorial.productId);
 if(commerce?.sku!==id)throw m2Error('SKU_MISMATCH');
 if(commerce.currency&&commerce.currency!=='BRL')throw m2Error('CURRENCY_MISMATCH');
 const priceCents=moneyInCents(commerce.price);
 const available=commerce.status==='publish' && commerce.manage_stock===true &&
   Number.isInteger(commerce.stock_quantity) && commerce.stock_quantity>0 &&
   commerce.stock_status==='instock' && commerce.backorders==='no' &&
   commerce.sold_individually===true && commerce.purchasable===true;
 return Object.freeze({sku:id,slug:editorial.slug,name:editorial.name,
   categoryId:editorial.categoryId,images:editorial.images,
   priceCents,currency:'BRL',available,stockQuantity:available?commerce.stock_quantity:0,
   wooProductId:commerce.id,personalizable:editorial.personalizable===true});
}
export function previewQuote(lines,products){
 if(!Array.isArray(lines)||lines.length===0)throw m2Error('EMPTY_CART');
 const bySku=new Map(products.map(p=>[p.sku,p]));
 const seen=new Set();let subtotalCents=0;
 for(const line of lines){
   const id=sku(line?.sku),qty=line?.quantity;
   if(seen.has(id))throw m2Error('DUPLICATE_SKU');
   seen.add(id);
   if(qty!==1)throw m2Error('UNIQUE_QUANTITY');
   const product=bySku.get(id);
   if(!product?.available||product.stockQuantity<1)throw m2Error('UNAVAILABLE');
   subtotalCents+=product.priceCents;
   if(!Number.isSafeInteger(subtotalCents))throw m2Error('PRICE_INVALID');
 }
 return Object.freeze({subtotalCents,currency:'BRL',transactable:false});
}
export function dropState(drop,isoNow){
 const now=Date.parse(isoNow),open=Date.parse(drop?.publishAt);
 const end=drop?.closeAt?Date.parse(drop.closeAt):Infinity;
 if(!Number.isFinite(now)||!Number.isFinite(open)||Number.isNaN(end)||end<=open)throw m2Error('DROP_DATE_INVALID');
 if(drop.status==='draft')return 'draft';
 if(drop.status==='closed')return 'closed';
 if(!['scheduled','published'].includes(drop.status))throw m2Error('DROP_STATE_INVALID');
 if(now<open)return 'scheduled';
 if(now>=end)return 'closed';
 return drop.status==='published'?'published':'awaiting_editorial_publication';
}
// Contrato de teste EM MEMÓRIA: não equivale a webhook autenticado/idempotente em produção.
export function mockEvent(state,event){
 const seen=new Set(state?.seen||[]);
 if(typeof event?.id!=='string'||!event.id||!Number.isInteger(event.sequence)||
   !['pending','paid','failed','cancelled'].includes(event.status))throw m2Error('EVENT_INVALID');
 if(seen.has(event.id))return {state,action:'duplicate_ignored'};
 seen.add(event.id);
 if(event.sequence<(state.sequence||0))return {state:{...state,seen:[...seen]},action:'stale_ignored'};
 if(['cancelled','failed'].includes(state.status)&&event.status==='paid')
   return {state:{...state,seen:[...seen]},action:'requires_manual_reconciliation'};
 return {state:{status:event.status,sequence:event.sequence,seen:[...seen]},action:'recorded_mock'};
}
