import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import capture from './interaction-data.json';

// V5: actual verified browser actions, not invented interactions or slides.
const PAPER='#faf7f2', PURPLE='#6844b8';
const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
const progress=(frame,a,b)=>clamp((frame-a)/(b-a));
const smooth=t=>t*t*(3-2*t);
const ease=t=>1-Math.pow(1-t,3);
const mix=(a,b,t)=>a+(b-a)*t;
const pointFor=id=>capture.actions.find(a=>a.id===id)?.point||{x:720,y:460};
const viewportHeight=900;

const steps=[
  {source:'v5-home',start:0,end:70,action:'explorar',click:53,scroll:'top',fromScale:.92,toScale:1.16},
  {source:'v5-loja',start:62,end:129,action:'filtrar-canecas',click:112,scroll:'top',fromScale:.97,toScale:1.20},
  {source:'v5-loja-canecas',start:121,end:193,action:'abrir-produto',click:175,scroll:'target',fromScale:1.06,toScale:1.25},
  {source:'v5-produto',start:185,end:280,action:'cuidados',click:264,scroll:'target',fromScale:.90,toScale:1.21},
  {source:'v5-cuidados',start:272,end:347,action:'voltar-home',click:330,scroll:'back-to-top',fromScale:1.14,toScale:1.10},
  {source:'v5-home-return',start:339,end:458,action:'personalizar',click:440,scroll:'target',fromScale:.88,toScale:1.23},
  {source:'v5-personalizadas',start:450,end:524,action:'sobre',click:506,scroll:'top',fromScale:.96,toScale:1.19},
  {source:'v5-manifesto',start:516,end:571,action:null,click:null,scroll:'editorial',fromScale:1.01,toScale:1.11}
];

function scrollFor(step,frame){
  const state=capture.states[step.source];
  if(!state)return 0;
  const max=Math.max(0,state.pageHeight-viewportHeight);
  const p=pointFor(step.action);
  const aim=clamp(p.y-510,0,max);
  if(step.scroll==='top')return 0;
  if(step.scroll==='target'){
    const a=step.source==='v5-home-return'?step.start+21:step.start+24;
    const b=step.source==='v5-home-return'?step.click-18:step.click-17;
    return mix(0,aim,smooth(progress(frame,a,b)));
  }
  if(step.scroll==='back-to-top'){
    const prev=pointFor('cuidados');
    const previousScroll=clamp(prev.y-510,0,max);
    return mix(previousScroll,0,smooth(progress(frame,step.start+19,step.click-17)));
  }
  if(step.scroll==='editorial')
    return mix(0,Math.min(max,480),smooth(progress(frame,step.start+8,step.start+44)));
  return 0;
}

function Cursor({x,y,clickFrame,frame}){
  const press=clickFrame!==null?Math.max(0,1-Math.abs(frame-clickFrame)/6):0;
  const tick=frame-(clickFrame??-9999);
  const ring=clickFrame!==null&&tick>=-2&&tick<=13;
  const rp=progress(frame,clickFrame-2,clickFrame+13);
  return <>
    {ring&&<div style={{
      position:'absolute',left:x-26,top:y-26,width:52,height:52,
      borderRadius:'50%',border:'2px solid rgba(104,68,184,.82)',
      background:'rgba(224,205,249,.22)',opacity:1-rp,
      transform:'scale('+mix(.43,1.75,ease(rp))+')',pointerEvents:'none'
    }}/>}
    <svg viewBox="0 0 35 45" width="35" height="45" style={{
      position:'absolute',left:x-3,top:y-3,
      transform:'scale('+(1-press*.18)+')',
      filter:'drop-shadow(0 2px 3px rgba(30,19,37,.28))',pointerEvents:'none'
    }}>
      <path d="M3 3L3 34L11.7 25.6L18.2 40L25.3 36.4L18.7 22L31.7 20.8Z"
        fill="#fff" stroke="#3e2b5a" strokeWidth="2.1" strokeLinejoin="round"/>
    </svg>
  </>;
}

function Browser({step,frame,scroll,transform}){
  const state=capture.states[step.source];
  if(!state)return null;
  const aim=pointFor(step.action);
  const travel=smooth(progress(frame,step.start+13,(step.click??step.end)-7));
  const targetY=step.action?aim.y-scroll:480;
  const px=mix(1120,aim.x,travel);
  const py=mix(378,clamp(targetY,28,862),travel);
  return <div style={{
    position:'absolute',top:'50%',left:'50%',width:1440,height:950,
    marginLeft:-720,marginTop:-475,transform,transformOrigin:'center',
    background:PAPER,borderRadius:18,overflow:'hidden',
    border:'1px solid rgba(104,68,184,.14)',
    boxShadow:'0 45px 120px rgba(40,29,55,.20),0 13px 30px rgba(35,21,49,.10)',
    willChange:'transform,opacity',backfaceVisibility:'hidden'
  }}>
    <div style={{
      position:'relative',height:50,display:'flex',alignItems:'center',
      gap:9,paddingLeft:23,borderBottom:'1px solid #e8e1e9',background:'#fdfaf7'
    }}>
      {['#d8c6e9','#e5d6c6','#c8afca'].map((c,i)=><span key={i}
        style={{width:10,height:10,borderRadius:20,background:c}}/>)}
      <div style={{position:'absolute',left:410,right:410,textAlign:'center',
        fontSize:14,color:'#756c79',whiteSpace:'nowrap'}}>
        lavender.mathbrands.com.br
      </div>
    </div>
    <div style={{width:1440,height:900,position:'relative',overflow:'hidden',background:PAPER}}>
      <Img src={staticFile('captures/'+state.file)} style={{
        position:'absolute',top:-scroll,left:0,display:'block',
        width:1440,height:state.pageHeight,objectFit:'fill'
      }}/>
      {step.action&&<Cursor x={px} y={py} clickFrame={step.click} frame={frame}/>}
    </div>
  </div>;
}

function Shot({step,frame}){
  const position=steps.indexOf(step);
  const next=steps[position+1];
  const alphaIn=position===0?1:smooth(progress(frame,step.start,step.start+8));
  const alphaOut=next?1-smooth(progress(frame,next.start,next.start+8)):1;
  const scroll=scrollFor(step,frame);
  const aim=pointFor(step.action);
  const p=smooth(progress(frame,step.start+15,(step.click??step.end)-7));
  const scale=mix(step.fromScale,step.toScale,p);
  const x=-(aim.x-720)*scale*.78*p;
  const y=-(aim.y-scroll-450)*scale*.73*p;
  const ambient=Math.sin((frame+position*25)/42)*2;
  const transform='translate3d('+(x+ambient)+'px,'+y+'px,0) scale('+scale+')';

  return <AbsoluteFill style={{overflow:'hidden',opacity:alphaIn*alphaOut,pointerEvents:'none'}}>
    <Browser step={step} frame={frame} scroll={scroll} transform={transform}/>
  </AbsoluteFill>;
}

function Background({frame}){
  const t=frame/605;
  return <AbsoluteFill style={{background:PAPER,overflow:'hidden'}}>
    <div style={{position:'absolute',top:120,left:-440,width:1050,height:1150,
      borderRadius:'50%',background:'radial-gradient(circle,rgba(216,198,233,.46),transparent 70%)',
      transform:'translate3d('+(t*65)+'px,'+(-t*20)+'px,0)'}}/>
    <div style={{position:'absolute',bottom:-250,right:-490,width:1100,height:1100,
      borderRadius:'50%',background:'radial-gradient(circle,rgba(227,213,199,.44),transparent 70%)'}}/>
    <div style={{position:'absolute',left:90,right:90,top:96,height:1,background:'rgba(104,68,184,.13)'}}/>
    <div style={{position:'absolute',left:90,right:90,bottom:139,height:1,background:'rgba(104,68,184,.13)'}}/>
  </AbsoluteFill>;
}
function Closing({frame}){
  const start=561;
  const alpha=smooth(progress(frame,start,start+13));
  const p=ease(progress(frame,start,595));
  return <AbsoluteFill style={{background:PAPER,opacity:alpha,
    justifyContent:'center',alignItems:'center',overflow:'hidden'}}>
    <div style={{position:'absolute',width:800,height:800,borderRadius:'50%',
      border:'1px solid rgba(104,68,184,.13)',
      transform:'scale('+mix(.65,1.18,p)+')',opacity:1-p*.75}}/>
    <div style={{
      opacity:smooth(progress(frame,start+10,582)),
      transform:'translate3d(0,'+mix(58,0,p)+'px,0) scale('+mix(.92,1,p)+')',textAlign:'center'
    }}>
      <Img src={staticFile('lavender-logo.svg')} style={{
        display:'block',objectFit:'contain',width:640,height:320,margin:'auto'
      }}/>
      <div style={{width:80,height:1,background:'#b7a5c0',margin:'54px auto 26px'}}/>
      <div style={{color:'#66616a',fontSize:20,letterSpacing:'.025em'}}>
        Design e desenvolvimento por Math Brands
      </div>
    </div>
  </AbsoluteFill>;
}
export const LavenderShowcase=()=>{
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{width:1080,height:1920,fontFamily:'Arial, sans-serif',background:PAPER}}>
    <Background frame={frame}/>
    {steps.filter(s=>frame>=s.start&&frame<s.end).map(s=>
      <Shot key={s.source} step={s} frame={frame}/>)}
    {frame>=561&&<Closing frame={frame}/>}
    <div style={{position:'absolute',bottom:78,left:86,right:86,
      display:'flex',alignItems:'center',justifyContent:'space-between',gap:18,
      fontSize:14,letterSpacing:'.10em',color:'rgba(104,68,184,.69)'}}>
      <span>LAVENDER · CERÂMICAS</span><span>PRÉVIA · IMAGENS ILUSTRATIVAS</span>
    </div>
  </AbsoluteFill>;
};
