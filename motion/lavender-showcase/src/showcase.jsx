import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

/**
 * LAVENDER / SITE SHOWCASE V4 — DIRECTED FROM THE ACTUAL PROVIDED REFERENCE
 *
 * Reference analyzed: ScreenRecording_11-14-2026 17-59-57_1.mp4
 * 605 frames, 30 fps, 20.1667 s.
 *
 * Rather than independent slide animations, the reference has a repeatable
 * choreography: immersive site -> rapid optical pullback -> compositional
 * reveal -> optical dive -> close-up exploration -> smooth scroll/panel
 * transitions -> wide reveal -> brand interlude -> zoom-return loop.
 *
 * Only the official approved Lavender prototype screenshots / brand SVG
 * are used here. Nothing from the reference reel is copied into this film.
 */

const BG='#faf7f2', INK='#191d39', PURPLE='#6844b8', FPS=30;
const L=605;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const progress=(f,a,b)=>clamp((f-a)/(b-a));
const smooth=t=>t*t*(3-2*t);
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const glow=(f,at,radius)=>Math.max(0,1-Math.abs(f-at)/radius);

/* Natural tangents: there is no stop at a mid-keyframe. */
function spline(keys,frame){
  if(frame<=keys[0][0])return keys[0].slice(1);
  if(frame>=keys[keys.length-1][0])return keys[keys.length-1].slice(1);
  const k=keys.findIndex((v,i)=>i+1<keys.length&&frame<=keys[i+1][0]);
  const a=keys[k],b=keys[k+1],prev=keys[Math.max(0,k-1)],next=keys[Math.min(keys.length-1,k+2)];
  const length=b[0]-a[0],t=clamp((frame-a[0])/length),t2=t*t,t3=t2*t;
  return [1,2,3].map(i=>{
    const m0=(b[i]-prev[i])/(b[0]-prev[0]);
    const m1=(next[i]-a[i])/(next[0]-a[0]);
    return (2*t3-3*t2+1)*a[i]+(t3-2*t2+t)*m0*length+
      (-2*t3+3*t2)*b[i]+(t3-t2)*m1*length;
  });
}

/*
 * Source change is a short optical zoom-through (speed + small blur)
 * instead of the 32-frame ghosted dissolves of V3.
 * Beat timing follows the actual reference's macro motion:
 * 0-1.8 close / 1.8-3.3 pullback / 3.3-5.5 approach /
 * 5.5-8.9 close hero / 8.9-13.9 exploring UI /
 * 13.9-15.2 reveal / 15.2-16.6 branding /
 * 16.6-20.17 return to opening pose.
 */
const scenes=[
  {
    id:'hero',start:0,end:269,source:'home-hero',
    camera:[
      [0,1.84,-60,110],[38,1.90,-125,70],
      [57,1.30,-60,130],[75,.74,0,260],
      [92,.66,0,165],[122,.81,-10,166],
      [151,1.20,-55,132],[175,2.08,-215,30],
      [207,2.30,35,-115],[234,2.42,325,-160],
      [257,2.65,310,-608],[269,2.75,285,-792]
    ]
  },
  {
    id:'vitrine',start:259,end:330,source:'home-shop',alt:'home-filter',switchAt:294,
    camera:[[259,2.31,-95,186],[285,2.37,-180,94],[309,2.49,60,-95],[330,2.58,190,-282]]
  },
  {
    id:'categoria',start:319,end:376,source:'category',alt:'category-sort',switchAt:348,
    camera:[[319,2.12,85,176],[346,2.27,190,5],[376,2.53,40,-248]]
  },
  {
    id:'produto',start:366,end:413,source:'product',alt:'product-details',switchAt:390,
    camera:[[366,2.09,-95,119],[392,2.34,-10,-20],[413,2.45,-256,-182]]
  },
  {
    id:'personalizadas',start:403,end:431,source:'personalizadas',
    camera:[[403,1.72,110,130],[419,1.94,45,-34],[431,1.67,-80,-116]]
  },
  {
    id:'manifesto',start:421,end:444,source:'manifesto',
    camera:[[421,1.65,-80,48],[433,1.52,15,10],[444,1.08,0,130]]
  },
  {
    id:'revelacao',start:434,end:461,source:'home-hero',
    camera:[[434,.95,30,143],[446,.71,0,162],[461,.58,0,185]]
  },
  {
    id:'retorno',start:500,end:L,source:'home-hero',
    camera:[[500,.58,0,185],[521,.84,0,167],[547,1.38,-56,120],
      [579,1.79,-170,92],[605,1.84,-60,110]]
  }
];
const motionCuts=[261,321,368,407,425,437];

function SiteWindow({source,transform,opacity=1,blur=0,mask}){
  return <div style={{
    position:'absolute',top:'50%',left:'50%',width:1440,height:950,
    marginLeft:-720,marginTop:-475,borderRadius:18,overflow:'hidden',
    background:BG,border:'1px solid rgba(104,68,184,.12)',
    boxShadow:'0 45px 100px rgba(42,30,57,.18),0 10px 28px rgba(42,30,57,.08)',
    opacity,transform,transformOrigin:'center',
    filter:blur>0.1?`blur(${blur.toFixed(2)}px)`:'none',
    ...(mask?{clipPath:mask}:{}),
    willChange:'transform,opacity,filter',backfaceVisibility:'hidden'
  }}>
    <div style={{height:50,background:'#fdfaf7',borderBottom:'1px solid #e8e1e9',
      display:'flex',alignItems:'center',gap:9,paddingLeft:22}}>
      {['#d8c6e9','#e5d6c6','#c8afca'].map((c,i)=>
        <span key={i} style={{width:10,height:10,borderRadius:10,background:c}}/>)}
      <div style={{color:'#736c76',fontSize:14,textAlign:'center',flex:1,paddingRight:62}}>
        lavender.mathbrands.com.br
      </div>
    </div>
    <Img src={staticFile('captures/'+source+'.png')} style={{
      display:'block',width:1440,height:900,objectFit:'cover'
    }}/>
  </div>;
}

function Scene({scene,frame}){
  const [scale,x,y]=spline(scene.camera,frame);
  const transform=`perspective(2100px) translate3d(${x}px,${y}px,0px) scale(${scale})`;
  const i=scenes.indexOf(scene);
  const fadeIn=i===0||i===scenes.length-1?1:smooth(progress(frame,scene.start,scene.start+10));
  const fadeOut=i===scenes.length-1?1:1-smooth(progress(frame,scene.end-10,scene.end));
  const alpha=fadeIn*fadeOut;
  const blur=Math.max(
    ...motionCuts.map(c=>glow(frame,c,10)*8),
    glow(frame,61,10)*4,glow(frame,170,10)*5,
    glow(frame,507,10)*11
  );
  const switchP=scene.alt?smooth(progress(frame,scene.switchAt-9,scene.switchAt+12)):0;
  return <AbsoluteFill style={{opacity:alpha,overflow:'hidden'}}>
    <SiteWindow source={scene.source} transform={transform} blur={blur}/>
    {scene.alt&&switchP>0&&
      <SiteWindow source={scene.alt} transform={transform} blur={blur}
        mask={`circle(${mix(0,145,switchP).toFixed(3)}% at 62% 51%)`}/>}
  </AbsoluteFill>;
}

function Backdrop({frame}){
  const p=frame/L;
  const wideA=smooth(progress(frame,54,79))*(1-smooth(progress(frame,155,179)));
  const wideB=smooth(progress(frame,427,442))*(1-smooth(progress(frame,455,468)));
  const wide=Math.max(wideA,wideB);
  return <AbsoluteFill style={{background:BG,overflow:'hidden'}}>
    <div style={{position:'absolute',top:130,left:-320,width:1120,height:1120,borderRadius:1200,
      background:'radial-gradient(circle,rgba(216,198,233,.49),rgba(216,198,233,0) 69%)',
      transform:`translate3d(${p*52}px,${-p*40}px,0)`}}/>
    <div style={{position:'absolute',bottom:-160,right:-335,width:1110,height:1110,borderRadius:1200,
      background:'radial-gradient(circle,rgba(228,211,197,.43),rgba(228,211,197,0) 70%)',
      transform:`translateX(${p*-48}px)`}}/>
    <div style={{position:'absolute',top:250,left:-180,right:-180,textAlign:'center',opacity:wide*.07,
      fontFamily:'Georgia, serif',fontSize:165,letterSpacing:10,color:INK}}>
      LAVENDER
    </div>
    <div style={{position:'absolute',left:80,right:80,top:109,height:1,background:'rgba(104,68,184,.12)'}}/>
    <div style={{position:'absolute',left:80,right:80,bottom:140,height:1,background:'rgba(104,68,184,.12)'}}/>
  </AbsoluteFill>;
}

function BrandInterlude({frame}){
  const inP=smooth(progress(frame,453,463));
  const outP=smooth(progress(frame,496,510));
  const alpha=inP*(1-outP);
  const p=smooth(progress(frame,463,487));
  const zoomReturn=smooth(progress(frame,496,508));
  if(alpha<=0.001)return null;
  return <AbsoluteFill style={{background:INK,opacity:alpha,overflow:'hidden',
    justifyContent:'center',alignItems:'center'}}>
    <div style={{width:830,height:830,borderRadius:'50%',position:'absolute',
      border:'1px solid rgba(230,220,245,.19)',opacity:.72,
      transform:`scale(${mix(.62,1.06,p)+zoomReturn*.22})`}}/>
    <div style={{textAlign:'center',opacity:smooth(progress(frame,466,476)),
      transform:`translate3d(0,${mix(68,0,p)}px,0) scale(${mix(.91,1.08,zoomReturn)})`,
      filter:zoomReturn>0?`blur(${zoomReturn*9}px)`:'none'}}>
      <Img src={staticFile('lavender-logo.svg')} style={{width:640,height:310,objectFit:'contain',
        filter:'brightness(0) invert(1)',display:'block',margin:'auto'}}/>
      <div style={{width:85,height:1,background:'rgba(230,220,245,.55)',
        margin:'32px auto 22px'}}/>
      <div style={{fontFamily:'Arial,Helvetica,sans-serif',color:'#e6dcf5',
        letterSpacing:'.06em',fontSize:18}}>
        Design e desenvolvimento por Math Brands
      </div>
    </div>
  </AbsoluteFill>;
}

export const LavenderShowcase=()=>{
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{fontFamily:'Arial,Helvetica,sans-serif',background:BG}}>
    <Backdrop frame={frame}/>
    {scenes.filter(s=>frame>=s.start&&frame<s.end).map(s=>
      <Scene key={s.id} scene={s} frame={frame}/>)}
    <BrandInterlude frame={frame}/>
    <div style={{position:'absolute',bottom:88,left:85,right:85,
      display:'flex',justifyContent:'space-between',alignItems:'center',gap:30,
      fontSize:13,letterSpacing:'.10em',color:'rgba(104,68,184,.59)',fontWeight:500}}>
      <span>LAVENDER · CERÂMICAS</span>
      <span>PRÉVIA VISUAL · IMAGENS ILUSTRATIVAS</span>
    </div>
  </AbsoluteFill>;
};
