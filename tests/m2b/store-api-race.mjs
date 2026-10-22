/**
 * M2b HTTP real: duas sessões Store API Cart-Token distintas.
 * Não declara pagamentos confirmados, concorrência perfeita nem teste de gateway.
 * Falha se a mesma peça terminar em dois pedidos que reivindiquem estoque.
 */
const [,,productRaw,round='1']=process.argv;
const productId=Number(productRaw),root=process.env.M2B_BASE_URL||'http://127.0.0.1:8090';
if(!Number.isInteger(productId)||productId<1)throw Error('ID_DE_PRODUTO_INVALIDO');
// WordPress efemero em plain permalinks: ?rest_route evita resposta HTML 200 da homepage.
const endpoint=root+'/?rest_route=';
async function request(method,path,session,body){
  const headers={'Accept':'application/json'};
  if(body!==undefined)headers['Content-Type']='application/json';
  if(session.token)headers['Cart-Token']=session.token;
  else if(session.nonce)headers['Nonce']=session.nonce;
  if(session.cookie)headers['Cookie']=session.cookie;
  const response=await fetch(endpoint+encodeURIComponent('/wc/store/v1'+path),{method,headers,body:body!==undefined?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});
  const newToken=response.headers.get('Cart-Token');
  if(newToken)session.token=newToken;
  const newNonce=response.headers.get('Nonce');
  if(newNonce)session.nonce=newNonce;
  const rawCookies=typeof response.headers.getSetCookie==='function'?response.headers.getSetCookie():[];
  if(rawCookies.length){
    const jar=new Map((session.cookie||'').split('; ').filter(Boolean).map(v=>{const i=v.indexOf('=');return [v.slice(0,i),v.slice(i+1)];}));
    for(const raw of rawCookies){const part=raw.split(';')[0],i=part.indexOf('=');if(i>0)jar.set(part.slice(0,i),part.slice(i+1));}
    session.cookie=[...jar].map(([a,b])=>a+'='+b).join('; ');
  }
  const contentType=response.headers.get('content-type')||'';
  if(!contentType.includes('json'))throw Error('STORE_API_NOT_JSON_'+response.status+'_'+contentType);
  let payload;try{payload=await response.json()}catch{throw Error('STORE_API_BAD_JSON_'+response.status);}
  return {http:response.status,body:payload};
}
const address=(who)=>({first_name:'Cliente',last_name:who,company:'',address_1:'Rua Exemplo, 1',
  address_2:'',city:'Cidade Ficticia',state:'SP',postcode:'01001000',country:'BR',
  email:'m2b'+who+'@example.invalid',phone:''});
async function prepare(who){
 const session={token:null,nonce:process.env.M2B_GUEST_NONCE||null,cookie:'',name:who};
 const initial=await request('GET','/cart',session);
 if(initial.http!==200)throw Error('CART_GET_FALHOU_'+who+':'+initial.http);
 if(!session.token&&!session.nonce)throw Error('SEM_NONCE_OU_CART_TOKEN_'+who);
 const added=await request('POST','/cart/add-item',session,{id:productId,quantity:1});
 if(added.http!==200)throw Error('CARRINHO_'+who+'_FALHOU_'+added.http+'_CODE_'+(added.body.code||'none'));
 const expected=added.body?.totals?.total_price||null;
 const present=Array.isArray(added.body?.items)&&added.body.items.some(item=>Number(item.id)===productId);
 if(!present)throw Error('CART_ITEM_MISSING_'+who+'_body_keys_'+Object.keys(added.body||{}).join(','));
 return {session,expected:String(expected),initialHttp:initial.http,cartHttp:added.http};
}
const first=await prepare('A'),second=await prepare('B');
if(first.session.token && second.session.token && first.session.token===second.session.token)throw Error('CART_TOKENS_IGUAIS');
if(!first.session.token&&!second.session.token && (!first.session.cookie||first.session.cookie===second.session.cookie))throw Error('SESSOES_NAO_ISOLADAS_POR_COOKIE');
const payloadFor=(who,expected)=>({
 billing_address:address(who),shipping_address:address(who),
 payment_method:'bacs',payment_data:[],...(expected?{expected_total:expected}:{})
});
const t0=Date.now();
// Requisições concorrentes reais, sem sleeps artificiais entre POSTs.
const [one,two]=await Promise.allSettled([
 request('POST','/checkout',first.session,payloadFor('A',first.expected)),
 request('POST','/checkout',second.session,payloadFor('B',second.expected)),
]);
function clean(which,settled){
 if(settled.status==='rejected')return {buyer:which,http:0,transport_error:String(settled.reason?.name||'error')};
 const {http,body}=settled.value;
 return {buyer:which,http,order_id:body?.order_id||null,status:body?.status||null,
  error_code:body?.code||null,payment_status:body?.payment_result?.payment_status||null};
}
const results=[clean('A',one),clean('B',two)];
// 2 pedidos com status do checkout considerado ativo no método OFFLINE: alertar e falhar.
const active=['on-hold','processing','completed'];
const claims=results.filter(x=>x.http>=200&&x.http<300&&active.includes(x.status));
const reported={schema:'m2b-store-api-v1',round,mode:'real_http_ephemeral',
  independent_sessions:true,session_mechanism:first.session.token&&second.session.token?'cart-token':'nonce-cookie',product_id:productId,initial_stock:1,
  cart_totals:[first.expected,second.expected],server_cart_total_available:!!first.expected&&!!second.expected,parallel_checkout_start_ms:t0,
  parallel_checkout_elapsed_ms:Date.now()-t0,results,
  active_orders_claimed_by_store_api:claims.length,
  status:claims.length>1?'FALHOU':claims.length===1?'PARCIALMENTE_COMPROVADO':'NAO_EXECUTADO',
  note:'bacs offline: on-hold nao constitui pagamento confirmado; ordem real e estoque devem ser confrontados no PHP/DB'};
console.log(JSON.stringify(reported));
if(claims.length>1)process.exitCode=4;
if(results.every(x=>x.http===0))process.exitCode=5;
