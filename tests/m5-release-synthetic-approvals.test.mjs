import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {evaluateReadiness} from '../scripts/prepublication-readiness.mjs';

// This suite uses a disposable filesystem only. It never talks to Woo, payment
// providers, Sanity or the published storefront.
const required=['VIS-FIDELITY','BRAND-ASSETS','CATALOG-DROPS','CHECKOUT-UX','PLATFORM-TCO',
 'PAYMENT-END-TO-END','FREIGHT-END-TO-END','SANITY-OPERATIONS','LEGAL-COMMERCIAL',
 'HOST-DNS-HTTPS','BACKUP-RESTORE','SECURITY-REPO','ACCESSIBILITY-PERFORMANCE',
 'SEO-FINAL','HANDOFF','FINAL-AUTHORIZATION'];
function fixture(run){
 const root=mkdtempSync(path.join(tmpdir(),'lavender-no-go-'));
 try{
  mkdirSync(path.join(root,'release'),{recursive:true});
  const gates=required.map(id=>({id,owner:'Fixture QA',requirement:'Teste isolado',
   critical:true,status:'APROVADO',evidence:'Evidência sintética — NÃO é aceite comercial'}));
  const save=()=>writeFileSync(path.join(root,'release/approval-gates.json'),
   JSON.stringify({schema:'lavender-release-approval-v1',project:'Lavender Cerâmicas',gates}));
  save();
  run({root,gates,save});
 }finally{rmSync(root,{recursive:true,force:true});}
}
test('even sixteen synthetically approved gates do not authorize release without built routes and checkout',()=>{
 fixture(({root})=>{
  const r=evaluateReadiness({root,visibility:'private'});
  assert.equal(r.approvals.approved,16);
  assert.equal(r.decision,'NO_GO');
  assert.ok(r.findings.some(x=>x.id==='CART'));
  assert.ok(r.findings.some(x=>x.id==='CHECKOUT'));
  assert.ok(r.findings.some(x=>x.id.startsWith('ROUTE-')));
  assert.deepEqual(r.safety,{deployed:false,charged:false,productionSanityModified:false});
 });
});
test('a missing real approval remains a blocker even if all other gates claim approval',()=>{
 fixture(({root,gates,save})=>{
  const final=gates.find(g=>g.id==='FINAL-AUTHORIZATION');
  final.status='PENDENTE';final.evidence='';save();
  const r=evaluateReadiness({root,visibility:'private'});
  assert.equal(r.decision,'NO_GO');
  assert.equal(r.approvals.approved,15);
  assert.ok(r.findings.some(x=>x.id==='GATE-FINAL-AUTHORIZATION'));
 });
});
test('blank evidence cannot validate a claimed payment approval',()=>{
 fixture(({root,gates,save})=>{
  gates.find(g=>g.id==='PAYMENT-END-TO-END').evidence=' \n ';save();
  const r=evaluateReadiness({root,visibility:'private'});
  assert.equal(r.decision,'NO_GO');
  assert.ok(r.findings.some(x=>x.id==='EVIDENCE-PAYMENT-END-TO-END'));
 });
});
