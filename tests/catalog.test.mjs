import test from 'node:test';
import assert from 'node:assert/strict';
import {validateCatalog} from '../src/lib/catalog.mjs';

const valid = (overrides = {}) => ({
  productId: 'produto-001',
  slug: 'caneca-lavender',
  name: 'Caneca Lavender',
  categoryId: 'canecas',
  images: [{url: '/assets/peça-de-teste.jpg', alt: 'Caneca artesanal de teste'}],
  publicationStatus: 'approved',
  priceMode: 'on_request',
  ...overrides,
});

test('somente produtos aprovados entram na vitrine', () => {
  const result = validateCatalog([
    valid({publicationStatus: 'pending'}),
    valid(),
  ]);
  assert.equal(result.length, 1);
});

test('produto aprovado exige imagem e alt', () => {
  assert.throws(() => validateCatalog([valid({images: [{url: '/a.jpg'}]})]), /Imagens/);
});

test('não permite slug repetido em produtos aprovados', () => {
  assert.throws(() => validateCatalog([
    valid(), valid({productId: 'produto-002'}),
  ]), /duplicado/);
});

test('não permite preço fixo inventado ou zerado', () => {
  assert.throws(() => validateCatalog([valid({priceMode: 'fixed', priceAmount: 0, currency: 'BRL'})]), /Preço/);
});

test('preço fixo real exige moeda BRL explícita', () => {
  assert.equal(validateCatalog([valid({priceMode: 'fixed', priceAmount: 89.9, currency: 'BRL'})]).length, 1);
});

test('produto não aprovado não provoca publicação acidental', () => {
  assert.deepEqual(validateCatalog([{publicationStatus: 'pending', name: 'Rascunho'}]), []);
});

test('rejeita dataset com formato inválido', () => {
  assert.throws(() => validateCatalog({items: []}), TypeError);
});
