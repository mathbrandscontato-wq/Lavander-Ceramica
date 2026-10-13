import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {homePreviewCards} from '../src/data/homePreview.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path,root),'utf8');

test('Home P01 continua com uma única origem de nove produtos de referência',()=>{
  const page=read('src/pages/index.astro');
  assert.equal(homePreviewCards.length,9);
  assert.equal((page.match(/<ProductCard/g)||[]).length,1);
  assert.match(page,/homePreviewCards\.map/);
  assert.match(page,/data-home-grid/);
});

test('grid 4+5 é apenas visual no estado todos e reordena quando filtrado',()=>{
  const css=read('src/styles/home.css');
  const page=read('src/pages/index.astro');
  assert.match(css,/:nth-child\(-n\+4\)/);
  assert.match(css,/:nth-child\(n\+5\)/);
  assert.match(css,/data-filter-active="true"/);
  assert.match(page,/grid\.dataset\.filterActive/);
  assert.match(page,/card\.hidden = !visible/);
});

test('overlay do header é uma decisão por rota, não global',()=>{
  const layout=read('src/layouts/BaseLayout.astro');
  const page=read('src/pages/index.astro');
  assert.match(layout,/headerOverlay=false/);
  assert.match(layout,/overlay=\{headerOverlay\}/);
  assert.match(page,/<BaseLayout headerOverlay/);
});

test('não habilita compra e não incorpora blocos de aviso no fluxo visual',()=>{
  const page=read('src/pages/index.astro');
  assert.match(page,/home-reference-notice sr-only/);
  assert.match(page,/home-custom__button/);
  assert.doesNotMatch(page,/<form.*checkout/);
  assert.doesNotMatch(page,/onclick=["'].*compr/);
});
