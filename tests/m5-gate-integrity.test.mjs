import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { evaluateReadiness } from '../scripts/prepublication-readiness.mjs';

function fixture(gate) {
 const root=mkdtempSync(join(tmpdir(),'lavender-release-gates-'));
 mkdirSync(join(root,'release'),{recursive:true});
 writeFileSync(join(root,'release','approval-gates.json'),JSON.stringify({
  schema:'lavender-release-approval-v1',project:'Lavender Cerâmicas',gates:[gate]
 }));
 return root;
}
function check(gate,expected) {
 const root=fixture(gate);
 try {
  const result=evaluateReadiness({root,visibility:'private'});
  assert.equal(result.decision,'NO_GO');
  assert.ok(result.findings.some(f=>f.id===expected&&f.severity==='BLOCKER'),expected);
 } finally {rmSync(root,{recursive:true,force:true});}
}
const base={id:'CHECKOUT-UX',critical:true,owner:'Math Brands',requirement:'Aceite mobile/desktop',status:'PENDENTE',evidence:''};

test('gate approved without evidence is blocked',()=>{
 check({...base,status:'APROVADO'},'EVIDENCE-CHECKOUT-UX');
});
test('unknown status cannot bypass critical gate',()=>{
 check({...base,status:'CONCLUIDO'},'STATUS-CHECKOUT-UX');
});
test('gate missing accountable owner is blocked',()=>{
 check({...base,owner:'   '},'METADATA-CHECKOUT-UX');
});
test('gate missing explicit criticality is blocked',()=>{
 const {critical,...rest}=base;
 check(rest,'CRITICALITY-CHECKOUT-UX');
});
test('even with approved gate, missing commercial routes prevent GO',()=>{
 const root=fixture({...base,status:'APROVADO',evidence:'review-approval'});
 try {
  const result=evaluateReadiness({root,visibility:'private'});
  assert.equal(result.decision,'NO_GO');
  assert.ok(result.findings.some(f=>f.id==='CART'));
  assert.ok(result.findings.some(f=>f.id==='CHECKOUT'));
 } finally {rmSync(root,{recursive:true,force:true});}
});
