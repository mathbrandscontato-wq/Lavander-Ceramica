import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {selectProducts,productRoute,escapeHTML,validQuantity,findSpatialBlock} from '../src/catalog.js';
const catalog=JSON.parse(await readFile(new URL('../public/data/CATALOGO_DEMONSTRATIVO.json',import.meta.url)));
const p=catalog.products;
test('nove IDs únicos, ordem canônica e catálogo preservado',()=>{assert.equal(new Set(p.map(x=>x.id)).size,9);assert.deepEqual(selectProducts(p).map(x=>x.id),catalog.home_order);assert.ok(p.every(x=>x.photo_asset==='SOURCE_ASSET_PENDING'&&!x.business_data_approved));});
test('filtros retornam IDs exatos, sem preencher grades',()=>{
  for(const [category,ids] of [['Canecas',[1,3,5,7]],['Pratos',[2,9]],['Tigelas',[4,6]],['Decoração',[8]]])assert.deepEqual(selectProducts(p,{category}).map(x=>x.id),ids.map(n=>`LV-DEMO-0${n}`));
});
test('busca normalizada intersecta categoria e ordena preço determinístico',()=>{assert.deepEqual(selectProducts(p,{category:'Canecas',query:'CANECA',sort:'price-down'}).map(x=>x.id),['LV-DEMO-03','LV-DEMO-07','LV-DEMO-01','LV-DEMO-05']);assert.equal(selectProducts(p,{query:'mao'})[0].id,'LV-DEMO-04');assert.equal(selectProducts(p,{category:'Pratos',query:'caneca'}).length,0);assert.equal(selectProducts(p,{query:'nada corresponde'}).length,0);});
test('elegibilidade e destinos por SKU',()=>{assert.deepEqual(selectProducts(p,{personalizable:true}).map(x=>x.id),['LV-DEMO-01','LV-DEMO-02','LV-DEMO-05']);for(const x of p)assert.equal(productRoute(x),`/${x.is_personalizable_demo?'personalizar':'produto'}/${x.slug}`);});
test('quantidade rejeita negativos, decimais, overflow e texto',()=>{for(const n of [0,-1,1.2,21,'abc','',Infinity])assert.equal(validQuantity(n),false);for(const n of [1,'2',20])assert.equal(validQuantity(n),true);});
test('texto livre é codificado, nunca interpretado como HTML',()=>{assert.equal(escapeHTML('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');});
const rect=(id,left,top,width=100)=>({id,left,top,width,height:100,right:left+width,bottom:top+100});
test('bloco 2×2 usa geometria real, inclusive arrays fora de ordem',()=>{const rects=[rect('d',130,180),rect('b',130,20),rect('a',10,20),rect('c',10,180)];assert.deepEqual(new Set(findSpatialBlock(rects,'a').map(x=>x.id)),new Set(['a','b','c','d']));});
test('grades pequenas e última linha sem agrupamento seguro',()=>{assert.equal(findSpatialBlock([rect('a',0,0)],'a'),null);assert.equal(findSpatialBlock([rect('a',0,0),rect('b',120,0),rect('c',240,0)],'a'),null);assert.equal(findSpatialBlock([rect('a',0,0),rect('b',120,0),rect('c',60,150)],'c'),null);assert.equal(findSpatialBlock([],'missing'),null);});
