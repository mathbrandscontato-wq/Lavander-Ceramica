// Original instrumental: fully synthesized, no copyrighted samples.
import {writeFile,mkdir} from 'node:fs/promises';
const sr=48000, seconds=605/30, total=Math.round(sr*seconds),wav=Buffer.alloc(44+total*2);
wav.write('RIFF',0);wav.writeUInt32LE(36+total*2,4);wav.write('WAVEfmt ',8);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
wav.writeUInt32LE(sr,24);wav.writeUInt32LE(sr*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);
wav.write('data',36);wav.writeUInt32LE(total*2,40);
const scene=[1.5,3.7,6.4,9.1,11.7,14.2,17.8];
function smooth(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)}
for(let i=0;i<total;i++){
 const t=i/sr,fade=smooth(t/1.0)*smooth((seconds-t)/1.15),mod=.7+.3*Math.sin(t*.21);
 let v=(Math.sin(Math.PI*2*174.61*t)*.009+Math.sin(Math.PI*2*261.63*t)*.007+Math.sin(Math.PI*2*349.23*t)*.004+Math.sin(Math.PI*2*523.25*t)*.002)*mod*fade;
 for(const cut of scene){const d=t-cut;if(d>=0&&d<.24){const env=Math.pow(1-d/.24,2);v+=Math.sin(2*Math.PI*(680-260*d)*d)*env*.014;}}
 wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2);
}
await mkdir('motion/lavender-showcase/out',{recursive:true});
await writeFile('motion/lavender-showcase/out/original-score.wav',wav);
console.log('Original score written',seconds,'s');
