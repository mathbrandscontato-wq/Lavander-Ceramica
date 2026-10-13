import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {detailPreview} from '../src/data/productDetailPreview.mjs';
import {manifestoPreview} from '../src/data/manifestoPreview.mjs';

const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('P05 não representa produto real nem oferece preço/pagamento/estoque confirmados',()=>{
  assert.equal(detailPreview.slug,'amostra-tecnica');
  assert.equal(detailPreview.images.length,4);
  assert.ok(!('priceAmount' in detailPreview));
  assert.ok(!('stockQuantity' in detailPreview));
  assert.ok(!('customerReviews' in detailPreview));
});

test('P05 segue anatomia da V3 com galeria, aba, quadro técnico e CTA inerte',()=>{
  const component=read('src/components/product/DetailPreview.astro');
  assert.match(component,/detail__thumbnails/);
  assert.match(component,/detail__information/);
  assert.match(component,/detail__specs/);
  assert.match(component,/data-gallery-index/);
  assert.match(component,/role="tablist"/);
  assert.match(component,/aria-disabled="true"/);
  assert.doesNotMatch(component,/https:\/\/wa\.me/);
  assert.doesNotMatch(component,/fetch\(/);
  assert.doesNotMatch(component,/checkout|mercadopago|addToCart/i);
});

test('P05 usa uma única rota de homologação, não cria SKUs fictícios',()=>{
  const route=read('src/pages/produto/[slug].astro');
  assert.match(route,/getStaticPaths/);
  assert.match(route,/detailPreview\.slug/);
  assert.match(route,/pageClass="internal-page product-page"/);
});

test('P07 mantém copy proposta não aprovada e ordem semântica texto antes da foto',()=>{
  assert.equal(manifestoPreview.title,'Manifesto');
  assert.equal(manifestoPreview.editorialStatus,'pending');
  assert.equal(manifestoPreview.paragraphs.length,4);
  const page=read('src/pages/manifesto.astro');
  assert.ok(page.indexOf('manifesto__text')<page.indexOf('manifesto__photo'));
  assert.match(page,/Fotografia editorial original pendente/);
  assert.match(page,/não foi aprovado como depoimento/i);
});

test('P07 tem composição de duas metades desktop e coluna móvel conforme A5/B4',()=>{
  const css=read('src/styles/manifesto.css');
  assert.match(css,/grid-template-columns:1fr 1fr/);
  assert.match(css,/flex-direction:column/);
  assert.match(css,/@media\(max-width:760px\)/);
});

test('rotas novas têm capturas e testes em CI, mantendo privacidade e sem deploy',()=>{
  const workflow=read('.github/workflows/quality.yml');
  assert.match(workflow,/dist\/produto\/amostra-tecnica\/index\.html/);
  assert.match(workflow,/dist\/manifesto\/index\.html/);
  assert.match(workflow,/lavender-p05-p07-capturas/);
  assert.match(workflow,/retention-days: 7/);
  assert.doesNotMatch(workflow,/cloudflare\/pages|wrangler pages deploy/);
});
