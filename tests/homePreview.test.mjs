import test from 'node:test';
import assert from 'node:assert/strict';
import {homePreviewCards,homePreviewFilters,isHomePreview} from '../src/data/homePreview.mjs';

test('P01 mantém 9 posições ilustrativas 4+5, sem dados comerciais',()=>{
 assert.equal(isHomePreview,true);
 assert.equal(homePreviewCards.length,9);
 assert.equal(homePreviewCards.filter(c=>c.row===1).length,4);
 assert.equal(homePreviewCards.filter(c=>c.row===2).length,5);
 for(const card of homePreviewCards){
  assert.match(card.id,/^amostra-/);
  assert.ok(!('priceAmount' in card));
  assert.ok(!('href' in card));
 }
});

test('todas as categorias das 9 posições possuem filtro',()=>{
 const ids=new Set(homePreviewFilters.map(f=>f.id));
 assert.ok(ids.has('todos'));
 for(const card of homePreviewCards) assert.ok(ids.has(card.categoryId));
});
