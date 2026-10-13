import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('layout genérico continua sem cabeçalho sobreposto por padrão', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  assert.match(layout, /headerOverlay=false/);
  assert.match(layout, /pageClass=''/);
});

test('P03 e P04 usam escopo visual exclusivo, sem regressão para Home P01', () => {
  const category = read('src/pages/categoria/canecas.astro');
  const collection = read('src/pages/colecoes/personalizadas.astro');
  const listing = read('src/styles/listing.css');
  assert.match(category, /pageClass="catalog-page catalog-page--category"/);
  assert.match(collection, /pageClass="catalog-page catalog-page--collection"/);
  assert.match(listing, /body\.catalog-page \.site-header/);
  assert.match(listing, /body\.catalog-page--collection \.listing__heading/);
  assert.match(listing, /body\.catalog-page \.site-footer/);
});

test('A6 preserva 4 + 5, A7 quatro colunas e ajuste responsivo não inventa produtos', () => {
  const css = read('src/styles/listing.css');
  assert.match(css, /listing__grid--category\s*>\s*:nth-child\(-n\+4\)/);
  assert.match(css, /listing__grid--category\s*>\s*:nth-child\(n\+5\)/);
  assert.match(css, /listing__grid--collection\s*\{grid-template-columns:repeat\(4/);
  assert.match(css, /@media\(max-width:760px\)/);
});

test('snapshot privado de aprovação usa viewport perto da altura das pranchas A6/A7', () => {
  const workflow = read('.github/workflows/quality.yml');
  assert.match(workflow, /--window-size=1440,1200 --screenshot=p03-canecas/);
  assert.match(workflow, /--window-size=1440,1200 --screenshot=p04-personalizadas/);
  assert.match(workflow, /retention-days: 7/);
});
