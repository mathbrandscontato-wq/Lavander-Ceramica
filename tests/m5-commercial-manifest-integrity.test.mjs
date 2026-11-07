import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { evaluateReadiness } from '../scripts/prepublication-readiness.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(readFileSync(path.join(root,'release/approval-gates.json'),'utf8'));

test('release manifest keeps all sixteen mandatory critical gates unique',()=>{
  const ids=['VIS-FIDELITY','BRAND-ASSETS','CATALOG-DROPS','CHECKOUT-UX','PLATFORM-TCO',
    'PAYMENT-END-TO-END','FREIGHT-END-TO-END','SANITY-OPERATIONS','LEGAL-COMMERCIAL',
    'HOST-DNS-HTTPS','BACKUP-RESTORE','SECURITY-REPO','ACCESSIBILITY-PERFORMANCE',
    'SEO-FINAL','HANDOFF','FINAL-AUTHORIZATION'];
  assert.equal(manifest.project,'Lavender Cerâmicas');
  assert.deepEqual(manifest.gates.map(g=>g.id).sort(),ids.sort());
  assert.ok(manifest.gates.every(g=>g.critical===true));
});

test('plugin laboratory progress never silently approves payments or shipping',()=>{
  for(const id of ['PAYMENT-END-TO-END','FREIGHT-END-TO-END']){
    const gate=manifest.gates.find(g=>g.id===id);
    assert.equal(gate.status,'PENDENTE',id);
    assert.equal(gate.evidence,'',id);
  }
  const result=evaluateReadiness({root,visibility:'public'});
  assert.equal(result.decision,'NO_GO');
  assert.ok(result.findings.some(f=>f.id==='GATE-PAYMENT-END-TO-END'));
  assert.ok(result.findings.some(f=>f.id==='GATE-FREIGHT-END-TO-END'));
  assert.ok(result.findings.some(f=>f.id==='GATE-FINAL-AUTHORIZATION'));
});
