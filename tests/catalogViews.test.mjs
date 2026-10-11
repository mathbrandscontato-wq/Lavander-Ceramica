import test from 'node:test';
import assert from 'node:assert/strict';
import {sortProducts,filterProducts,catalogFacets} from '../src/lib/catalogViews.mjs';

const inventory=[
  {productId:'p2',name:'Tigela',categoryId:'tigelas',sortOrder:20,collectionIds:['personalizadas'],tags:['ceramica']},
  {productId:'p1',name:'Caneca',categoryId:'canecas',sortOrder:10,collectionIds:['personalizadas'],tags:['presentes']},
  {productId:'p3',name:'Prato',categoryId:'pratos',collectionIds:['cotidiano'],tags:['ceramica']},
];

test('ordena produtos sem alterar a fonte única de dados',()=>{
  const result=sortProducts(inventory);
  assert.deepEqual(result.map(item=>item.productId),['p1','p2','p3']);
  assert.equal(inventory[0].productId,'p2');
});

test('filtra exclusivamente por categoria cadastrada',()=>{
  assert.deepEqual(filterProducts(inventory,{categoryId:'canecas'}).map(p=>p.productId),['p1']);
});

test('coleções e tags podem ser combinadas sem inventar resultados',()=>{
  assert.deepEqual(filterProducts(inventory,{collectionId:'personalizadas',tag:'ceramica'}).map(p=>p.productId),['p2']);
});

test('categoria desconhecida retorna lista vazia',()=>{
  assert.deepEqual(filterProducts(inventory,{categoryId:'nao-cadastrada'}),[]);
});

test('lista categorias existentes sem repetição',()=>{
  assert.deepEqual(catalogFacets([...inventory,inventory[1]]),['canecas','pratos','tigelas']);
});
