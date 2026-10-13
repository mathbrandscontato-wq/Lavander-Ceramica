import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {canecasPreview,personalizadasPreview,canecasFilters,personalizadasFilters} from '../src/data/catalogPreview.mjs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('Canecas mantém nove posições da A6, sem confundir com oito da B5',()=>{
  assert.equal(canecasPreview.length,9);
  assert.deepEqual(canecasPreview.map(x=>x.sortOrder),[1,2,3,4,5,6,7,8,9]);
  assert.equal(new Set(canecasPreview.map(x=>x.id)).size,9);
  assert.ok(canecasPreview.every(x=>x.categoryId==='canecas'));
});

test('Personalizadas mantém oito posições da A7 sem marcar SKUs falsos como elegíveis',()=>{
  assert.equal(personalizadasPreview.length,8);
  assert.equal(new Set(personalizadasPreview.map(x=>x.id)).size,8);
  assert.ok(personalizadasPreview.every(x=>!('personalizable' in x)&&!('priceAmount' in x)&&!('href' in x)));
});

test('as tags demonstrativas só representam categorias presentes nos itens',()=>{
  for (const [items,options] of [[canecasPreview,canecasFilters],[personalizadasPreview,personalizadasFilters]]){
    assert.ok(options.some(f=>f.id==='todos'));
    const ids=new Set(options.map(x=>x.id));
    for (const item of items)assert.ok(ids.has(item.filter));
  }
});

test('P03 e P04 usam mesmo componente e mantêm CTA comercial inativo',()=>{
  const p03=read('src/pages/categoria/canecas.astro');
  const p04=read('src/pages/colecoes/personalizadas.astro');
  const cmp=read('src/components/catalog/CatalogListing.astro');
  assert.match(p03,/CatalogListing/);
  assert.match(p04,/CatalogListing/);
  assert.match(cmp,/data-listing-grid/);
  assert.match(cmp,/aria-pressed/);
  assert.match(cmp,/data-listing-sort/);
  assert.match(cmp,/aria-disabled="true"/);
  assert.doesNotMatch(cmp,/https:\/\/wa\.me/);
});

test('catálogo de homologação não contém preços, fotos, URLs comerciais ou pedido',()=>{
  for (const item of [...canecasPreview,...personalizadasPreview]){
    assert.ok(item.id.startsWith('a6-')||item.id.startsWith('a7-'));
    assert.ok(!Object.hasOwn(item,'priceAmount'));
    assert.ok(!Object.hasOwn(item,'imageSrc'));
    assert.ok(!Object.hasOwn(item,'sku'));
  }
});

test('CSS de catálogo preserva 4+5 na categoria e 4 colunas nas coleções',()=>{
  const css=read('src/styles/listing.css');
  assert.match(css,/listing__grid--category\s*>\s*:nth-child\(-n\+4\)/);
  assert.match(css,/listing__grid--category\s*>\s*:nth-child\(n\+5\)/);
  assert.match(css,/listing__grid--collection\s*\{grid-template-columns:repeat\(4/);
  assert.match(css,/@media\(max-width:760px\)/);
});
