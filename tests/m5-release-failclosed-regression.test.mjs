import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { evaluateReadiness } from '../scripts/prepublication-readiness.mjs';

const required = [
  'VIS-FIDELITY','BRAND-ASSETS','CATALOG-DROPS','CHECKOUT-UX','PLATFORM-TCO',
  'PAYMENT-END-TO-END','FREIGHT-END-TO-END','SANITY-OPERATIONS',
  'LEGAL-COMMERCIAL','HOST-DNS-HTTPS','BACKUP-RESTORE','SECURITY-REPO',
  'ACCESSIBILITY-PERFORMANCE','SEO-FINAL','HANDOFF','FINAL-AUTHORIZATION'
];

function fixture(run) {
  const root = mkdtempSync(path.join(tmpdir(), 'lavender-release-safety-'));
  const put = (name, data = '') => {
    const target = path.join(root, name);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, data);
  };
  const gates = required.map(id => ({
    id, owner: 'Responsável de teste', requirement: 'Verificação documentada',
    critical: true, status: 'APROVADO', evidence: 'Evidência fictícia de fixture'
  }));
  const save = () => put('release/approval-gates.json', JSON.stringify({
    schema: 'lavender-release-approval-v1', project: 'Lavender Cerâmicas', gates
  }));
  for (const name of [
    'index.html', 'categoria/canecas/index.html',
    'colecoes/personalizadas/index.html',
    'produto/amostra-tecnica/index.html', 'manifesto/index.html'
  ]) put('dist/' + name, '<html></html>');
  put('src/pages/carrinho.astro', '');
  put('src/pages/checkout.astro', '');
  put('studio/package-lock.json', '{}');
  put('package-lock.json', '{}');
  save();
  try { run({ root, gates, save, put }); }
  finally { rmSync(root, { recursive: true, force: true }); }
}

test('approved-looking fixture cannot pass with a missing mandatory gate', () => fixture(({root,gates,save}) => {
  gates.splice(gates.findIndex(g => g.id === 'FINAL-AUTHORIZATION'), 1);
  save();
  const result = evaluateReadiness({root, visibility:'private'});
  assert.equal(result.decision, 'NO_GO');
  assert.ok(result.findings.some(f => f.id === 'MISSING-GATE-FINAL-AUTHORIZATION'));
}));

test('approved-looking fixture cannot pass with a downgraded mandatory gate', () => fixture(({root,gates,save}) => {
  gates.find(g => g.id === 'PAYMENT-END-TO-END').critical = false;
  save();
  const result = evaluateReadiness({root, visibility:'private'});
  assert.equal(result.decision, 'NO_GO');
  assert.ok(result.findings.some(f => f.id === 'NONCRITICAL-GATE-PAYMENT-END-TO-END'));
}));

test('approved-looking fixture cannot pass with blank evidence or owner', () => fixture(({root,gates,save}) => {
  gates.find(g => g.id === 'FREIGHT-END-TO-END').evidence = '  ';
  gates.find(g => g.id === 'HANDOFF').owner = '  ';
  save();
  const result = evaluateReadiness({root, visibility:'private'});
  assert.equal(result.decision, 'NO_GO');
  assert.ok(result.findings.some(f => f.id === 'EVIDENCE-FREIGHT-END-TO-END'));
  assert.ok(result.findings.some(f => f.id === 'METADATA-HANDOFF'));
}));

test('approved-looking fixture cannot pass with preview SEO protections still enabled', () => fixture(({root,put}) => {
  put('dist/index.html', '<meta name="robots" content="noindex,nofollow">');
  put('dist/robots.txt', 'User-agent: *\\nDisallow: /\\n');
  const result = evaluateReadiness({root, visibility:'private'});
  assert.equal(result.decision, 'NO_GO');
  assert.ok(result.findings.some(f => f.id === 'NOINDEX'));
  assert.ok(result.findings.some(f => f.id === 'ROBOTS'));
}));
