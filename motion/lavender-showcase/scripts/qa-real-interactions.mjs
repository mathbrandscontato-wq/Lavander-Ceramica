import fs from 'node:fs';
import cp from 'node:child_process';
const root='motion/lavender-showcase',cap=root+'/public/captures',out=root+'/out';
const report=JSON.parse(fs.readFileSync(cap+'/interaction-report.json','utf8'));
const approved='gh-pages@8fd5af3ef68210d10369c6d1a42a7911992815ea';
if(report.status!=='PASS'||report.source!==approved)throw Error('Unapproved screenshot provenance');
if(!report.fonts.some(x=>x.includes('Cormorant Garamond'))||!report.fonts.some(x=>x.includes('Inter')))throw Error('Brand font missing');
const actions=['explorar','filtrar-canecas','abrir-produto','cuidados','voltar-home','personalizar','sobre'];
const expectedRoutes=['/loja','/loja','/produto/caneca-estante','/produto/caneca-estante','/','/colecoes/personalizadas','/manifesto'];
if(report.actions.length!==actions.length)throw Error('Expected seven real browser clicks');
for(let i=0;i<actions.length;i++){
  const a=report.actions[i];
  if(a.id!==actions[i]||!a.verified||a.afterRoute!==expectedRoutes[i])
    throw Error('Actual browser click did not reach expected state: '+actions[i]);
  if(!(a.point.x>=0&&a.point.x<=1440&&a.point.y>=0))
    throw Error('Actual click target geometry not captured: '+actions[i]);
}
if(!report.productCount||report.productCount.initial<=report.productCount.filtered)
 throw Error('Category filter did not produce a visible card change');
const stateNames=['v5-home','v5-loja','v5-loja-canecas','v5-produto','v5-cuidados','v5-home-return','v5-personalizadas','v5-manifesto'];
for(const name of stateNames){
 const s=report.states[name];
 if(!s||s.pageHeight<900||!fs.existsSync(cap+'/'+s.file)||fs.statSync(cap+'/'+s.file).size<1000)
   throw Error('Missing real full-page screenshot: '+name);
}
function probe(file){
 return JSON.parse(cp.execFileSync('ffprobe',['-v','error','-show_entries','stream=width,height,nb_frames,r_frame_rate,codec_name','-show_entries','format=duration','-of','json',file],{encoding:'utf8'}));
}
const video=probe(out+'/Lavender_Ceramicas_Site_Showcase_V5_sem_audio.mp4');
const stream=video.streams.find(s=>s.codec_name==='h264');
if(!stream||stream.width!==1080||stream.height!==1920||stream.r_frame_rate!=='30/1'
 ||Number(stream.nb_frames)!==605||Math.abs(Number(video.format.duration)-605/30)>.06)
 throw Error('Invalid 605-frame H264 render');
const audio=probe(out+'/Lavender_Ceramicas_Site_Showcase_V5.mp4');
if(!audio.streams.some(s=>s.codec_name==='aac'))throw Error('Original click audio track missing');
const result={
 status:'PASS',version:'V5-real-website-interactions',visualSource:approved,
 video:{resolution:'1080x1920',fps:30,frames:605,durationSeconds:605/30,codec:'H.264',audio:'AAC original soundtrack + seven synthesized click sounds'},
 interactionEvidence:report.actions.map(x=>({id:x.id,label:x.label,actualBrowserClick:true,from:x.from,to:x.to,target:x.point,route:x.afterRoute,verified:x.verified})),
 categoryFilter:report.productCount,fullPageScreenshots:stateNames,
 fonts:report.fonts,
 workflow:'Playwright directly clicked the real approved SPA buttons, links and tabs and recorded all before/after states; Remotion adds visible cursor movement and scrolling.',
 userFeedbackResolved:'Interactions are visibly clicked; camera magnification is secondary.',
 limitation:'This is an approved-prototype demonstrator with illustrative product photos and prices, not a production checkout.',
 hosting:'No deployment, merge or commercial site changes.'
};
fs.writeFileSync(out+'/QA_REPORT_V5.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
