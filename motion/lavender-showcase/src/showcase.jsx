import React from 'react';
import {AbsoluteFill, Img, Easing, staticFile, useCurrentFrame} from 'remotion';

/**
 * Lavender / Site Showcase V3 — continuous camera and motivated transitions.
 * Reference: user-provided Instagram motion example; its phone interface is NOT
 * used as footage or a graphic element. This adapts the motion vocabulary only:
 * connected camera movement, scale changes, typographic hierarchy and iris.
 *
 * Visual source is exclusively the approved gh-pages commit (asserted in CI).
 * All navigable website UI is captured live with Playwright.
 */
const BG='#faf7f2', PURPLE='#6844b8', LAVENDER='#e8dff4';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ratio=(frame,a,b)=>clamp((frame-a)/(b-a));
const smooth=t=>t*t*(3-2*t);
const cameraTrack=(keys,frame)=> {
  // Hermite spline with nonzero tangents: does NOT stop at intermediate keys.
  let idx=keys.findIndex((key,i)=>i<keys.length-1&&frame<=keys[i+1][0]);
  if(idx===-1) idx=keys.length-2;
  const a=keys[idx],b=keys[idx+1],duration=b[0]-a[0];
  const t=clamp((frame-a[0])/duration),t2=t*t,t3=t2*t;
  const prev=keys[Math.max(0,idx-1)],next=keys[Math.min(keys.length-1,idx+2)];
  return [1,2,3].map(k=>{
    const m0=(b[k]-prev[k])/(b[0]-prev[0]);
    const m1=(next[k]-a[k])/(next[0]-a[0]);
    return (2*t3-3*t2+1)*a[k]+(t3-2*t2+t)*m0*duration+
           (-2*t3+3*t2)*b[k]+(t3-t2)*m1*duration;
  });
};
const transitions=[197,273,351,426,480,531];
const scenes=[
  {
    id:'home',start:0,end:213,source:'home-hero',
    // zoom out / move into editorial headline / leave with momentum
    camera:[[0,1.64,445,195],[37,1.36,338,143],[96,.75,0,0],[147,.93,90,-8],[213,1.19,150,-95]]
  },
  {
    id:'shop',start:181,end:289,source:'home-shop',alt:'home-filter',switchAt:239,
    camera:[[181,1.13,185,156],[221,1.10,105,-12],[266,1.19,75,-126],[289,1.25,90,-158]]
  },
  {
    id:'category',start:257,end:367,source:'category',alt:'category-sort',switchAt:319,
    camera:[[257,.85,-92,190],[299,1.02,70,72],[338,1.17,210,-37],[367,1.26,256,-90]]
  },
  {
    id:'product',start:335,end:442,source:'product',alt:'product-details',switchAt:392,
    camera:[[335,.88,198,-20],[373,1.08,155,38],[413,1.18,-40,165],[442,1.22,-123,190]]
  },
  {
    id:'personalized',start:410,end:496,source:'personalizadas',
    camera:[[410,.80,-90,164],[453,.96,40,70],[481,1.08,100,-26],[496,1.13,146,-55]]
  },
  {
    id:'manifesto',start:464,end:545,source:'manifesto',
    camera:[[464,.82,260,120],[502,.96,210,27],[529,1.08,198,-70],[545,1.15,215,-110]]
  }
];
const transitionFrames=16;
const entrance=Easing.bezier(.45,0,.2,1);

const SiteFrame=({filename,transform,opacity=1,mask})=>
  <div style={{
    position:'absolute',top:'50%',left:'50%',width:1440,height:950,
    marginLeft:-720,marginTop:-475,borderRadius:18,
    overflow:'hidden',background:BG,opacity,
    border:'1px solid rgba(104,68,184,.11)',
    boxShadow:'0 45px 110px rgba(60,34,81,.18),0 10px 30px rgba(60,34,81,.1)',
    transform,transformOrigin:'center',
    backfaceVisibility:'hidden',willChange:'transform,opacity',
    ...(mask?{clipPath:mask}:{})
  }}>
    <div style={{height:50,display:'flex',alignItems:'center',gap:9,paddingLeft:22,background:'#fdfaf7',borderBottom:'1px solid #e8e1e9'}}>
      {['#d8c6e9','#e5d6c6','#c8afca'].map((color,k)=><span key={k} style={{width:10,height:10,borderRadius:10,background:color}}/>)}
      <div style={{fontFamily:'Arial, sans-serif',fontSize:14,color:'#736c76',margin:'auto',paddingRight:96}}>lavender.mathbrands.com.br</div>
    </div>
    <div style={{width:1440,height:900,overflow:'hidden'}}>
      <Img src={staticFile('captures/'+filename+'.png')} style={{width:1440,height:900,objectFit:'cover'}}/>
    </div>
  </div>;

function Scene({scene,frame}){
  const [scale,x,y]=cameraTrack(scene.camera,frame);
  // Tiny constant environmental drift keeps the frame alive without jitter.
  const breathing=Math.sin((frame+scene.start)/52)*1.9;
  const transform=`perspective(2200px) translate3d(${x+breathing}px,${y}px,0) scale(${scale})`;

  const index=scenes.indexOf(scene);
  let alpha=1;
  if(index>0)alpha*=entrance(ratio(frame,transitions[index-1]-transitionFrames,transitions[index-1]+transitionFrames));
  if(index<transitions.length)alpha*=1-entrance(ratio(frame,transitions[index]-transitionFrames,transitions[index]+transitionFrames));
  if(frame<scene.start||frame>=scene.end)alpha=0;

  // State changes reveal through a curved iris, never an instantaneous split.
  const p=scene.alt?entrance(ratio(frame,scene.switchAt-8,scene.switchAt+11)):0;
  const radius=lerp(0,155,p);
  return <AbsoluteFill style={{opacity:alpha,overflow:'hidden',pointerEvents:'none'}}>
    <SiteFrame filename={scene.source} transform={transform}/>
    {scene.alt&&p>0&&<SiteFrame filename={scene.alt} transform={transform}
      mask={`circle(${radius}% at 65% 52%)`}/>}
  </AbsoluteFill>;
}

function Background({frame}){
  const t=frame/605;
  return <AbsoluteFill style={{background:BG,overflow:'hidden'}}>
    <div style={{position:'absolute',left:-375,top:95,width:1100,height:1100,borderRadius:'50%',
      background:'radial-gradient(circle,rgba(216,198,233,.52),rgba(216,198,233,0) 69%)',
      transform:`translate3d(${55*t}px,${-27*t}px,0)`}}/>
    <div style={{position:'absolute',right:-430,bottom:-300,width:1020,height:1020,borderRadius:'50%',
      background:'radial-gradient(circle,rgba(227,213,199,.46),rgba(227,213,199,0) 72%)',
      transform:`translate3d(${-38*t}px,${22*t}px,0)`}}/>
    <div style={{position:'absolute',top:105,left:80,right:80,height:1,background:'rgba(104,68,184,.12)'}}/>
    <div style={{position:'absolute',bottom:140,left:80,right:80,height:1,background:'rgba(104,68,184,.12)'}}/>
  </AbsoluteFill>;
}

function TransitionAccent({frame}){
  // A subtle moving glint punctuates each continuous dissolve. Unlike the V2
  // independent scale resets it is intentionally short and never masks UI.
  const transition=transitions.find(c=>Math.abs(frame-c)<=11);
  if(transition===undefined)return null;
  const p=ratio(frame,transition-11,transition+11);
  const strength=Math.sin(Math.PI*p)*.14;
  return <AbsoluteFill style={{pointerEvents:'none',opacity:strength,
    background:'linear-gradient(123deg,transparent 36%,rgba(236,222,252,.45) 50%,transparent 64%)',
    transform:`translateX(${lerp(-480,480,p)}px)`}}/>;
}

function Closing({frame}){
  const p=entrance(ratio(frame,529,556));
  const logo=entrance(ratio(frame,548,580));
  const caption=entrance(ratio(frame,565,590));
  const radius=lerp(0,1700,p);
  return <AbsoluteFill style={{overflow:'hidden',pointerEvents:'none'}}>
    <div style={{position:'absolute',left:'50%',top:'50%',width:radius*2,height:radius*2,
      marginLeft:-radius,marginTop:-radius,borderRadius:'50%',background:BG,
      boxShadow:'0 0 0 2px rgba(104,68,184,.075)'}}/>
    <div style={{position:'absolute',top:615,left:215,width:650,height:650,borderRadius:'50%',
      border:'1px solid rgba(104,68,184,.16)',opacity:logo*(1-logo*.7),
      transform:`scale(${lerp(.72,1.10,logo)})`}}/>
    <div style={{position:'absolute',top:782,left:150,width:780,textAlign:'center',
      opacity:logo,transform:`translate3d(0,${lerp(75,0,logo)}px,0) scale(${lerp(.94,1,logo)})`}}>
      <Img src={staticFile('lavender-logo.svg')} style={{width:650,height:330,objectFit:'contain',display:'block',margin:'auto'}}/>
      <div style={{width:90,height:1,background:'#b5a4b8',margin:'64px auto 30px',opacity:caption}}/>
      <div style={{fontSize:20,letterSpacing:'.035em',color:'#6b666f',opacity:caption}}>
        Design e desenvolvimento por Math Brands
      </div>
    </div>
  </AbsoluteFill>;
}

export const LavenderShowcase=()=>{
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{fontFamily:'Arial,Helvetica,sans-serif',background:BG}}>
    <Background frame={frame}/>
    {scenes.filter(scene=>frame>=scene.start&&frame<scene.end).map(scene=>
      <Scene key={scene.id} scene={scene} frame={frame}/>)}
    <TransitionAccent frame={frame}/>
    {frame>=529&&<Closing frame={frame}/>}
    <div style={{position:'absolute',bottom:86,left:90,right:90,display:'flex',justifyContent:'space-between',
      fontSize:14,letterSpacing:'.12em',color:'rgba(104,68,184,.65)',fontWeight:500}}>
      <span>LAVENDER · CERÂMICAS</span><span>PRÉVIA VISUAL · IMAGENS ILUSTRATIVAS</span>
    </div>
  </AbsoluteFill>;
};
