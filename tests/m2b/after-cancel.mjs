/** M2b após cancelamento: recompra real e proteção expected_total, sem cobrança. */
const [,,productRaw,round='1']=process.argv,productId=Number(productRaw);
if(!Number.isInteger(productId)||productId<1)throw Error('BAD_PRODUCT_ID');
const host=process.env.M2B_BASE_URL||'http://127.0.0.1:8090';
const session={nonce:process.env.M2B_GUEST_NONCE||null,token:null,cookie:''};
async function req(method,path,body){
 const headers={Accept:'application/json'};
 if(session.token)headers['Cart-Token']=session.token;
 else if(session.nonce)headers.Nonce=session.nonce;
 if(session.cookie)headers.Cookie=session.cookie;
 if(body)headers['Content-Type']='application/json';
 const res=await fetch(host+'/?rest_route='+encodeURIComponent('/wc/store/v1'+path),{
  method,headers,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});
 const token=res.headers.get('Cart-Token');if(token)session.token=token;
 const nonce=res.headers.get('Nonce');if(nonce)session.nonce=nonce;
 for(const cookie of res.headers.getSetCookie?.()||[]){
  const pair=cookie.split(';')[0];
  const name=pair.slice(0,pair.indexOf('='));
  const jar=new Map((session.cookie||'').split('; ').filter(Boolean).map(v=>[v.slice(0,v.indexOf('=')),v.slice(v.indexOf('=')+1)]));
  jar.set(name,pair.slice(pair.indexOf('=')+1));session.cookie=[...jar].map(([k,v])=>k+'='+v).join('; ');
 }
 if(!(res.headers.get('content-type')||'').includes('json'))throw Error('NOT_JSON_'+res.status);
 const data=await res.json();return {http:res.status,data};
}
const cart=await req('GET','/cart');
if(cart.http!==200)throw Error('CART_GET_'+cart.http);
const add=await req('POST','/cart/add-item',{id:productId,quantity:1});
if(add.http<200||add.http>=300)throw Error('REBUY_ADD_'+add.http+'_'+(add.data?.code||''));
const subtotal=String(add.data?.totals?.total_price||'');
if(!subtotal)throw Error('EXPECTED_TOTAL_NOT_FOUND');
const adr={first_name:'Cliente',last_name:'PosCancelamento',address_1:'Endereco de laboratorio',
 city:'Cidade Ficticia',state:'SP',postcode:'01001000',country:'BR',email:'m2brebuy@example.invalid'};
const pay={billing_address:adr,shipping_address:adr,payment_method:'bacs',payment_data:[]};
const tampered=await req('POST','/checkout',{...pay,expected_total:'1'});
const accepted=await req('POST','/checkout',{...pay,expected_total:subtotal});
const result={
 schema:'m2b-post-cancel-v1',round,mode:'real_http_ephemeral',productId,
 post_cancel_product_added: add.http>=200&&add.http<300,
 tampered_total_http:tampered.http,
 tampered_total_error:tampered.data?.code||null,
 valid_total_http:accepted.http,valid_checkout_status:accepted.data?.status||null,
 valid_checkout_order_id:accepted.data?.order_id||null,
 gateway:'bacs_offline',payment_confirmed:false,
 status:(tampered.http===409&&accepted.http>=200&&accepted.http<300&&
     accepted.data?.status==='on-hold')?'PASSOU':'FALHOU'
};
console.log(JSON.stringify(result));
if(result.status!=='PASSOU')process.exitCode=4;
