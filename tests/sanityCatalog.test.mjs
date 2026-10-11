import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchApprovedProducts,publicCatalogEndpoint,PUBLIC_PRODUCTS_QUERY} from '../src/lib/sanityCatalog.mjs';

test('consulta retorna somente registros de produto aprovados',()=>{
  assert.match(PUBLIC_PRODUCTS_QUERY,/publicationStatus == "approved"/);
  assert.match(PUBLIC_PRODUCTS_QUERY,/drafts/);
  assert.match(PUBLIC_PRODUCTS_QUERY,/category->slug\.current/);
});

test('endpoint usa identificador público e consulta codificada',()=>{
  const url=publicCatalogEndpoint({projectId:'t4nkzeaq',dataset:'production'});
  assert.match(url,/t4nkzeaq\.api\.sanity\.io/);
  assert.ok(new URL(url).searchParams.get('query')?.includes('approved'));
  assert.throws(()=>publicCatalogEndpoint({projectId:'bad.project'}));
});

test('produto pendente não é exibido mesmo se vier da API',async()=>{
  let called=false;
  const rows=[{productId:'p1',slug:'caneca-lavender',name:'Caneca',categoryId:'canecas',
    publicationStatus:'approved',images:[{url:'https://cdn.sanity.io/images/a.jpg',alt:'Caneca'}],
    priceMode:'fixed',priceAmount:89,currency:'BRL'}];
  const fetchImpl=async()=>{called=true;return {ok:true,json:async()=>({result:[
    ...rows,{productId:'p2',publicationStatus:'pending'}
  ]})}};
  const result=await fetchApprovedProducts({fetchImpl});
  assert.ok(called);
  assert.equal(result.length,1);
  assert.equal(result[0].productId,'p1');
});

test('API indisponível interrompe build em vez de mostrar produto inventado',async()=>{
  const fetchImpl=async()=>({ok:false,status:503});
  await assert.rejects(fetchApprovedProducts({fetchImpl}),/HTTP 503/);
});
