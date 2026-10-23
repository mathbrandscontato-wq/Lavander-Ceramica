
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {evaluateReadiness} from '../scripts/prepublication-readiness.mjs';
const routeFiles=['index.html','categoria/canecas/index.html','colecoes/personalizadas/index.html',
 'produto/amostra-tecnica/index.html','manifesto/index.html'];
function fixture(status='PENDENTE'){
 const root=mkdtempSync(path.join(os.tmpdir(),'lavender-gate-'));
 const write=(file,data)=>{
  mkdirSync(path.dirname(path.join(root,file)),{recursive:true});
  writeFileSync(path.join(root,file),data);
 };
 write('release/approval-gates.json',JSON.stringify({schema:'lavender-release-approval-v1',
  gates:[{id:'TEST-GATE',owner:'QA',requirement:'Aceite humano',critical:true,status,
   evidence:status==='APROVADO'?'teste:comprovado':''}]}));
 for(const route of routeFiles)write('dist/'+route,'<html lang="pt-BR"></html>');
 write('dist/robots.txt','User-agent: *\nAllow: /\n');
 write('src/pages/carrinho.astro','preview');
 write('src/pages/checkout.astro','preview');
 write('src/data/homePreview.mjs','export const preview=false;');
 write('package-lock.json','{}');write('studio/package-lock.json','{}');
 return root;
}
test('bloqueia gate humano pendente',()=>{
 const dir=fixture();
 try{const r=evaluateReadiness({root:dir,visibility:'private'});
 assert.equal(r.decision,'NO_GO');assert.ok(r.findings.some(x=>x.id==='GATE-TEST-GATE'));}
 finally{rmSync(dir,{recursive:true,force:true});}
});
test('aprovação com prova é somente go técnico, sem deploy',()=>{
 const dir=fixture('APROVADO');
 try{const r=evaluateReadiness({root:dir,visibility:'private'});
 assert.equal(r.decision,'TECHNICAL_GO_REVIEW_REQUIRED');
 assert.equal(r.safety.deployed,false);}
 finally{rmSync(dir,{recursive:true,force:true});}
});
test('noindex, catálogo de demonstração e repo público bloqueiam/avisam',()=>{
 const dir=fixture('APROVADO');
 try{
 writeFileSync(path.join(dir,'dist/index.html'),'<meta name="robots" content="noindex">');
 writeFileSync(path.join(dir,'src/data/homePreview.mjs'),'export const isHomePreview = true;');
 const r=evaluateReadiness({root:dir,visibility:'public'});
 assert.equal(r.decision,'NO_GO');
 assert.ok(r.findings.some(x=>x.id==='NOINDEX'));
 assert.ok(r.findings.some(x=>x.id==='DEMO-CATALOG'));
 assert.ok(r.findings.some(x=>x.id==='PUBLIC-REPO'));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('não permite ID duplicado',()=>{
 const dir=fixture('APROVADO');
 try{
 const json={schema:'lavender-release-approval-v1',gates:[
  {id:'SAME',critical:true,status:'APROVADO',evidence:'evidencia'},
  {id:'SAME',critical:true,status:'APROVADO',evidence:'evidencia'}]};
 writeFileSync(path.join(dir,'release/approval-gates.json'),JSON.stringify(json));
 assert.throws(()=>evaluateReadiness({root:dir}),/DUPLICATE_GATE_ID/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
