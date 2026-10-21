import {sku,m2Error,combineEditorialCommerce} from './m2Contract.mjs';
// Apenas backend/server da prova M2. Nunca empacotar consumerSecret em Astro estático.
export function makeWooReader({baseUrl,key,secret,fetchImpl=fetch,allowLocalHttp=false}={}){
 if(!baseUrl||!key||!secret)throw m2Error('WOO_CONFIG_REQUIRED');
 let host;try{host=new URL(baseUrl)}catch{throw m2Error('WOO_URL_INVALID')}
 const isLocal=['localhost','127.0.0.1','[::1]'].includes(host.hostname);
 if(host.protocol!=='https:'&&!(allowLocalHttp&&isLocal&&host.protocol==='http:'))
   throw m2Error('WOO_HTTPS_REQUIRED');
 if(host.username||host.password||host.hash||host.search)throw m2Error('WOO_URL_INVALID');
 const auth='Basic '+Buffer.from(key+':'+secret).toString('base64');
 return async (value)=>{
   const id=sku(value),u=new URL(host.origin+host.pathname.replace(/\/$/,'')+'/wp-json/wc/v3/products');
   u.searchParams.set('sku',id);u.searchParams.set('per_page','2');
   let response;try{
     response=await fetchImpl(u.toString(),{headers:{Authorization:auth,Accept:'application/json'},
       cache:'no-store',signal:AbortSignal.timeout(8000)});
   }catch{throw m2Error('WOO_UNAVAILABLE')}
   if(!response.ok)throw m2Error('WOO_UNAVAILABLE');
   let data;try{data=await response.json()}catch{throw m2Error('WOO_BAD_RESPONSE')}
   if(!Array.isArray(data)||data.length!==1)throw m2Error('WOO_AMBIGUOUS_SKU');
   if(data[0]?.sku!==id)throw m2Error('SKU_MISMATCH');
   return data[0];
 };
}
export async function loadM2Product(editorial,reader){
 if(editorial?.publicationStatus!=='approved')throw m2Error('EDITORIAL_NOT_APPROVED');
 return combineEditorialCommerce(editorial,await reader(sku(editorial.productId)));
}

/**
 * Sincronizacao de LEITURA para a prova M2: projeção e divergências sem escrita remota.
 * Produtos bloqueados não são enviados à vitrine. Não substitui filas nem reconciliador durável.
 */
export async function reconcileCatalogReadOnly(editorials,readWooBySku) {
  if(!Array.isArray(editorials)) throw m2Error('EDITORIAL_INVALID');
  const products=[],blocked=[],seen=new Set();
  for(const e of editorials){
    if(e?.publicationStatus!=='approved')continue;
    const id=e?.productId;
    if(seen.has(id)) {blocked.push({sku:id||null,code:'SKU_DUPLICATE'});continue;}
    seen.add(id);
    try {products.push(await loadM2Product(e,readWooBySku));}
    catch(err){blocked.push({sku:id||null,code:err?.code||'COMMERCE_UNAVAILABLE'});}
  }
  return Object.freeze({products,blocked,mode:'read_only',commercialAuthority:'woocommerce',editorialAuthority:'sanity'});
}
