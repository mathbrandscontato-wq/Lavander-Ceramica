import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {evaluateReadiness} from '../scripts/prepublication-readiness.mjs';

function withManifest(gates, run) {
  const root=mkdtempSync(path.join(tmpdir(),'lavender-gate-integrity-'));
  try {
    mkdirSync(path.join(root,'release'),{recursive:true});
    writeFileSync(path.join(root,'release/approval-gates.json'),JSON.stringify({
      schema:'lavender-release-approval-v1',project:'Lavender Cerâmicas',gates
    }));
    run(root);
  } finally { rmSync(root,{recursive:true,force:true}); }
}
const gate=(id, overrides={})=>({
  id,owner:'Responsável de teste',requirement:'Validação obrigatória',
  critical:true,status:'PENDENTE',evidence:'',...overrides
});

test('duplicated approval identifiers cannot be counted as distinct approvals',()=>{
  withManifest([gate('FINAL-AUTHORIZATION'),gate('FINAL-AUTHORIZATION',{status:'APROVADO',evidence:'fixture'})],root=>{
    assert.throws(()=>evaluateReadiness({root,visibility:'private'}),/DUPLICATE_GATE_ID/);
  });
});

test('unknown approval status is a blocker, not an implicit approval',()=>{
  withManifest([gate('FINAL-AUTHORIZATION',{status:'APROVADO_PARCIAL'})],root=>{
    const result=evaluateReadiness({root,visibility:'private'});
    assert.equal(result.decision,'NO_GO');
    assert.ok(result.findings.some(f=>f.id==='STATUS-FINAL-AUTHORIZATION'));
  });
});

test('missing manifest schema is rejected before evaluating readiness',()=>{
  const root=mkdtempSync(path.join(tmpdir(),'lavender-gate-schema-'));
  try {
    mkdirSync(path.join(root,'release'),{recursive:true});
    writeFileSync(path.join(root,'release/approval-gates.json'),JSON.stringify({gates:[]}));
    assert.throws(()=>evaluateReadiness({root}),/INVALID_GATE_SCHEMA/);
  } finally {rmSync(root,{recursive:true,force:true});}
});
