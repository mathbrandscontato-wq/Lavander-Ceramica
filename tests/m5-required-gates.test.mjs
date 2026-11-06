import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { evaluateReadiness } from '../scripts/prepublication-readiness.mjs';

function check(gates) {
  const root=mkdtempSync(path.join(tmpdir(),'lavender-required-gates-'));
  try {
    mkdirSync(path.join(root,'release'),{recursive:true});
    writeFileSync(path.join(root,'release/approval-gates.json'),JSON.stringify({
      schema:'lavender-release-approval-v1',project:'Lavender Cerâmicas',gates
    }));
    return evaluateReadiness({root,visibility:'private'});
  } finally { rmSync(root,{recursive:true,force:true}); }
}
test('missing mandatory release gate cannot produce technical GO',()=>{
  const r=check([]);
  assert.equal(r.decision,'NO_GO');
  assert.ok(r.findings.some(f=>f.id==='MISSING-GATE-PAYMENT-END-TO-END'));
  assert.ok(r.findings.some(f=>f.id==='MISSING-GATE-FINAL-AUTHORIZATION'));
});
test('downgrading mandatory payment gate to noncritical is blocked',()=>{
  const r=check([{id:'PAYMENT-END-TO-END',owner:'QA',requirement:'Sandbox real',
    critical:false,status:'APROVADO',evidence:'laboratory only'}]);
  assert.equal(r.decision,'NO_GO');
  assert.ok(r.findings.some(f=>f.id==='NONCRITICAL-GATE-PAYMENT-END-TO-END'));
});
