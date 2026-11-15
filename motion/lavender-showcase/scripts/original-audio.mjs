// Lavender V5 original instrumental + soft, synchronized tactile click sounds.
// All samples synthesized mathematically. No recorded/copyrighted samples.
import {writeFile,mkdir,readFile} from 'node:fs/promises';
const capture=JSON.parse(await readFile('motion/lavender-showcase/public/captures/interaction-report.json','utf8'));
if(capture.status!=='PASS'||capture.actions.length!==7)throw Error('No validated browser clicks');
const frames={explorar:53,'filtrar-canecas':112,'abrir-produto':175,cuidados:264,'voltar-home':330,personalizar:440,sobre:506};
const clicks=capture.actions.map(a=>frames[a.id]/30);
if(clicks.some(x=>!Number.isFinite(x)))throw Error('Unmapped audio click');
const sr=48000,seconds=605/30,total=Math.round(sr*seconds),wav=Buffer.alloc(44+total*2);
wav.write('RIFF',0);wav.writeUInt32LE(36+total*2,4);wav.write('WAVEfmt ',8);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
wav.writeUInt32LE(sr,24);wav.writeUInt32LE(sr*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);
wav.write('data',36);wav.writeUInt32LE(total*2,40);
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
for(let i=0;i<total;i++){
 const t=i/sr, fade=sm(t/.65)*sm((seconds-t)/.8);
 const low=(Math.sin(2*Math.PI*174.61*t)*.012+
   Math.sin(2*Math.PI*261.63*t)*.006+
   Math.sin(2*Math.PI*349.23*t)*.004)*(.72+.28*Math.sin(t*.33));
 let v=low*fade;
 for(const c of clicks){
   const d=t-c;
   if(d>=0&&d<.065){
     // Tactile click: low soft body, fast transient with bounded high register.
     const env=Math.exp(-91*d);
     const body=Math.sin(2*Math.PI*(410-250*d)*d)*.065;
     const tick=Math.sin(2*Math.PI*1550*d)*.035+Math.sin(i*.213)*Math.sin(i*.037)*.017;
     v+=(body+tick)*env;
   }
 }
 wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2);
}
await mkdir('motion/lavender-showcase/out',{recursive:true});
await writeFile('motion/lavender-showcase/out/original-score.wav',wav);
console.log('V5 original score and',clicks.length,'actual-browser click sound cues');
