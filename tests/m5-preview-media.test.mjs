
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const files=['hero.webp','custom-banner.webp','manifesto.webp',
 ...Array.from({length:9},(_,i)=>'product-'+String(i+1).padStart(2,'0')+'.webp')];
test('M5: doze mídias WebP ilustrativas têm bytes reais',()=>{
 for(const name of files){
  const file='public/assets/'+name;
  assert.ok(existsSync(file),'Faltando: '+file);
  const bytes=readFileSync(file);
  assert.ok(bytes.length>10_000,'Imagem pequena: '+file);
  assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF');
  assert.equal(bytes.subarray(8,12).toString('ascii'),'WEBP');
 }
});
test('M5: nove cards têm imagens ilustrativas sem preço de venda',async()=>{
 const {homePreviewCards}=await import('../src/data/homePreview.mjs');
 assert.equal(homePreviewCards.length,9);
 for(const item of homePreviewCards){
  assert.ok(item.imageSrc.startsWith('/assets/product-'));
  assert.ok(item.imageAlt.includes('ilustrativa provisória'));
  assert.ok(existsSync('public'+item.imageSrc));
  assert.equal(Object.hasOwn(item,'priceAmount'),false);
 }
});
test('M5: componentes de prévia não apresentam foto sintética como item real',()=>{
 for(const [file,markers] of [
   ['src/pages/index.astro',['/assets/hero.webp','Imagem ilustrativa provisória']],
   ['src/components/catalog/CatalogListing.astro',['/assets/product-','Imagem ilustrativa provisória']],
   ['src/pages/manifesto.astro',['Imagem ilustrativa provisória']],
   ['src/components/product/DetailPreview.astro',['/assets/product-','Imagem ilustrativa provisória']]
 ]){
   const source=readFileSync(file,'utf8');
   for(const marker of markers)assert.ok(source.includes(marker),'Ausente em '+file+': '+marker);
 }
});
