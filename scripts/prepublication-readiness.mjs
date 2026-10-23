
import {readFileSync,existsSync,mkdirSync,writeFileSync,appendFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const THIS=fileURLToPath(import.meta.url);
const ROOT=path.resolve(path.dirname(THIS),'..');
const routes=['index.html','categoria/canecas/index.html','colecoes/personalizadas/index.html',
 'produto/amostra-tecnica/index.html','manifesto/index.html'];
function read(root,name){
 const f=path.join(root,name);
 return existsSync(f)?readFileSync(f,'utf8'):'';
}
export function evaluateReadiness({root=ROOT,visibility='unknown'}={}){
 const approval=JSON.parse(read(root,'release/approval-gates.json'));
 if(approval.schema!=='lavender-release-approval-v1'||!Array.isArray(approval.gates))throw Error('INVALID_GATE_SCHEMA');
 const findings=[];
 function add(id,severity,description){findings.push({id,severity,description});}
 const seen=new Set();
 for(const g of approval.gates){
  if(!g.id||seen.has(g.id))throw Error('DUPLICATE_GATE_ID');
  seen.add(g.id);
  if(g.status==='APROVADO'&&!String(g.evidence||'').trim())
   add('EVIDENCE-'+g.id,'BLOCKER','Aceite informado sem evidência');
  if(g.critical&&g.status!=='APROVADO')
   add('GATE-'+g.id,'BLOCKER',g.requirement+' (responsável: '+g.owner+')');
 }
 for(const name of routes){
  if(!existsSync(path.join(root,'dist',name)))
   add('ROUTE-'+name,'BLOCKER','Build não contém rota: '+name);
 }
 const home=read(root,'dist/index.html');
 const content=['src/pages/index.astro','src/components/layout/Header.astro',
  'src/components/layout/Footer.astro','src/components/product/DetailPreview.astro',
  'src/data/homePreview.mjs'].map(s=>read(root,s)).join('\n')+'\n'+home;
 const labels=['Preço a confirmar','LOGO A VETORIZAR','Foto pendente',
  'Fotografia original pendente','Peça ilustrativa','Ação comercial em definição'];
 const hits=labels.filter(v=>content.includes(v));
 if(hits.length)add('PLACEHOLDERS','BLOCKER','Textos demonstrativos: '+hits.join(', '));
 if(read(root,'src/data/homePreview.mjs').includes('isHomePreview = true'))
  add('DEMO-CATALOG','BLOCKER','Catálogo Astro permanece fictício');
 if(!existsSync(path.join(root,'src/pages/carrinho.astro'))&&
    !existsSync(path.join(root,'src/pages/carrinho/index.astro')))
  add('CART','BLOCKER','Rota comercial de carrinho ausente');
 if(!existsSync(path.join(root,'src/pages/checkout.astro'))&&
    !existsSync(path.join(root,'src/pages/checkout/index.astro')))
  add('CHECKOUT','BLOCKER','Rota comercial de checkout ausente');
 if(/name=["']robots["'][^>]*noindex/i.test(home))
  add('NOINDEX','BLOCKER','Prévia ainda noindex; manter assim até a publicação aprovada');
 const robots=read(root,'dist/robots.txt')||read(root,'public/robots.txt');
 if(/^Disallow:\s*\/\s*$/m.test(robots))
  add('ROBOTS','BLOCKER','Prévia bloqueada em robots.txt; não retirar antes da publicação');
 if(!existsSync(path.join(root,'package-lock.json')))
  add('LOCK-ASTRO','WARNING','Sem package-lock.json; fixar antes de deploy');
 if(!existsSync(path.join(root,'studio/package-lock.json')))
  add('LOCK-STUDIO','WARNING','Sem studio/package-lock.json; fixar antes de deploy');
 if(visibility==='public')add('PUBLIC-REPO','WARNING',
  'Repositório GitHub público; documentação antiga afirma que é privado. Auditar exposição e permissões.');
 if(visibility==='unknown')add('VISIBILITY-UNKNOWN','WARNING','Visibilidade GitHub não comprovada neste ambiente.');
 const blockers=findings.filter(x=>x.severity==='BLOCKER').length;
 return {schema:'lavender-prepublish-report-v1',decision:blockers?'NO_GO':'TECHNICAL_GO_REVIEW_REQUIRED',
  blockers,warnings:findings.filter(x=>x.severity==='WARNING').length,
  approvals:{total:approval.gates.length,approved:approval.gates.filter(x=>x.status==='APROVADO').length},
  routesExamined:routes,findings,safety:{deployed:false,charged:false,productionSanityModified:false}};
}
export function markdownReport(r){
 return ['# Lavender — gate automático de pré-publicação',
  '','**Decisão: '+r.decision+'**','',
  'Bloqueios: '+r.blockers+'; avisos: '+r.warnings+
   '; gates aprovados: '+r.approvals.approved+'/'+r.approvals.total+'.','',
  '| Prioridade | ID | Diagnóstico |','|---|---|---|',
  ...r.findings.map(x=>'| '+x.severity+' | '+x.id+' | '+x.description.replaceAll('|','/')+' |'),
  '','Sem merge, deploy, cobrança, alteração de DNS ou Sanity. O aceite humano permanece obrigatório.'
 ].join('\n')+'\n';
}
if(process.argv[1]&&path.resolve(process.argv[1])===THIS){
 const p=process.env.GITHUB_EVENT_REPOSITORY_PRIVATE;
 const r=evaluateReadiness({visibility:p==='true'?'private':p==='false'?'public':'unknown'});
 const out=path.join(ROOT,'.prepublication');
 mkdirSync(out,{recursive:true});
 writeFileSync(path.join(out,'readiness.json'),JSON.stringify(r,null,2)+'\n');
 const md=markdownReport(r);
 writeFileSync(path.join(out,'READINESS.md'),md);
 if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,md);
 console.log(JSON.stringify({decision:r.decision,blockers:r.blockers,warnings:r.warnings,approvals:r.approvals}));
 if(process.argv.includes('--enforce')&&r.blockers)process.exitCode=2;
}
