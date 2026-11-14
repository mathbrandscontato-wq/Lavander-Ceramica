import React from 'react';
import {AbsoluteFill, Img, interpolate, Easing, staticFile, useCurrentFrame} from 'remotion';

const CW=1080, CH=1920;
const BG='#faf7f2', PURPLE='#6844b8';
const curve=Easing.bezier(.22,1,.36,1);
const shots=[
  {id:'01',title:'Close imersivo',from:0,to:45,source:'home-hero',fromScale:1.73,toScale:1.58,fromX:340,toX:240,fromY:90,toY:140,tilt:0},
  {id:'02',title:'Revelação de interface',from:45,to:111,source:'home-hero',fromScale:1.3,toScale:.69,fromX:140,toX:0,fromY:180,toY:0,tilt:-1.3},
  {id:'03',title:'Hero e tipografia',from:111,to:192,source:'home-hero',fromScale:.79,toScale:1.28,fromX:0,toX:240,fromY:-80,toY:100,tilt:1.25},
  {id:'04',title:'Scroll vitrine',from:192,to:273,source:'home-shop',altSource:'home-filter',fromScale:1.03,toScale:1.14,fromX:70,toX:-75,fromY:90,toY:-110,tilt:-.55},
  {id:'05',title:'Canecas e filtros',from:273,to:351,source:'category',altSource:'category-filter',fromScale:.84,toScale:1.14,fromX:-100,toX:90,fromY:40,toY:-100,tilt:.8},
  {id:'06',title:'Detalhe e galeria',from:351,to:426,source:'product',altSource:'product-gallery',fromScale:.93,toScale:1.26,fromX:60,toX:-175,fromY:40,toY:130,tilt:-.7},
  {id:'07a',title:'Peças personalizadas',from:426,to:480,source:'personalizadas',fromScale:.8,toScale:1.1,fromX:-55,toX:105,fromY:60,toY:-50,tilt:.75},
  {id:'07b',title:'Manifesto editorial',from:480,to:534,source:'manifesto',fromScale:.8,toScale:1.12,fromX:95,toX:-60,fromY:20,toY:-80,tilt:-.85},
];
function norm(frame,from,to){return Math.max(0,Math.min(1,(frame-from)/(to-from)));}
function mix(from,to,t){return from+(to-from)*t;}
function easingProgress(frame,from,to){return curve(norm(frame,from,to));}
function Screenshot({filename}){
  return <Img src={staticFile('captures/'+filename+'.png')} style={{width:'100%',height:'100%',objectFit:'contain',display:'block'}}/>;
}
// The screenshots are real 1440x900 Chromium viewports. Chrome is an audiovisual frame.
function BrowserFrame({filename,transform,shadow=true,clipStyle,opacity=1}){
  return <div style={{
    position:'absolute',top:'50%',left:'50%',width:1440,height:950,
    marginLeft:-720,marginTop:-475,
    borderRadius:18,overflow:'hidden',background:BG,
    border:'1px solid rgba(104,68,184,.13)',
    boxShadow:shadow?'0 48px 115px rgba(60,34,81,.19),0 12px 37px rgba(60,34,81,.11)':'none',
    transform,transformOrigin:'center center',opacity,
    backfaceVisibility:'hidden',willChange:'transform',...clipStyle
  }}>
    <div style={{height:50,display:'flex',alignItems:'center',gap:9,paddingLeft:22,background:'#fdfaf7',borderBottom:'1px solid #e8e1e9'}}>
      {['#d8c6e9','#e5d6c6','#c8afca'].map((color,k)=><span key={k} style={{width:10,height:10,borderRadius:'50%',background:color}}/>)}
      <div style={{fontFamily:'Arial, sans-serif',fontSize:14,letterSpacing:'.015em',color:'#736c76',margin:'auto',paddingRight:96}}>lavender.mathbrands.com.br</div>
    </div>
    <div style={{width:1440,height:900,overflow:'hidden'}}><Screenshot filename={filename}/></div>
  </div>;
}
function BaseBackground({frame}){
  const drift=Math.sin(frame/605*Math.PI*2);
  return <AbsoluteFill style={{background:BG,overflow:'hidden'}}>
    <div style={{position:'absolute',left:-420,top:70,width:1150,height:1150,borderRadius:'50%',background:'radial-gradient(circle, rgba(216,198,233,.53), rgba(216,198,233,0) 70%)',transform:`translate3d(${drift*45}px,${-drift*28}px,0)`}}/>
    <div style={{position:'absolute',right:-460,bottom:-350,width:1150,height:1150,borderRadius:'50%',background:'radial-gradient(circle, rgba(227,213,199,.47), rgba(227,213,199,0) 69%)'}}/>
    <div style={{position:'absolute',top:105,left:80,right:80,height:1,background:'rgba(104,68,184,.12)'}}/>
    <div style={{position:'absolute',bottom:140,left:80,right:80,height:1,background:'rgba(104,68,184,.12)'}}/>
  </AbsoluteFill>;
}
function Shot({shot,frame}){
 const local=frame-shot.from, dur=shot.to-shot.from;
 const p=easingProgress(local,0,dur);
 const sc=mix(shot.fromScale,shot.toScale,p), x=mix(shot.fromX,shot.toX,p), y=mix(shot.fromY,shot.toY,p);
 const tilt=shot.tilt*Math.sin(Math.PI*p);
 // Spatial match cuts with a foreground travel, not long generic fades.
 const entrance=norm(frame,shot.from-7,shot.from+7),exit=norm(frame,shot.to-7,shot.to+1);
 let visibility=1,translate=0;
 if(shot.from!==0&&local<7){visibility=entrance;translate=(1-curve(entrance))*55;}
 if(shot.to!==534&&local>dur-7){visibility=1-exit;translate=-curve(exit)*38;}
 const transform=`perspective(1700px) translate3d(${x+translate}px, ${y}px,0px) rotateY(${tilt}deg) scale(${sc})`;
 const phase=norm(p,(shot.id==='04'?.57:shot.id==='05'?.51:.55)-.07,(shot.id==='04'?.57:shot.id==='05'?.51:.55)+.07);
 return <AbsoluteFill style={{opacity:visibility,overflow:'hidden'}}>
   <BrowserFrame filename={shot.source} transform={transform}/>
   {shot.altSource&&<BrowserFrame filename={shot.altSource} transform={transform} clipStyle={{clipPath:`inset(0 0 0 ${Math.round((1-curve(phase))*100)}%)`}}/>}
 </AbsoluteFill>;
}
function Closing({frame}){
 const local=frame-534,p=easingProgress(local,0,55),appear=norm(local,0,15);
 return <AbsoluteFill style={{justifyContent:'center',alignItems:'center',background:BG,overflow:'hidden'}}>
   <div style={{width:660,height:660,borderRadius:660,position:'absolute',top:480,left:210,
     border:'1px solid rgba(104,68,184,.23)',transform:`scale(${mix(.64,1.16,p)})`,opacity:Math.max(0,1-p*.75)}}/>
   <div style={{textAlign:'center',transform:`translateY(${mix(110,-25,p)}px) scale(${mix(.94,1,p)})`,opacity:appear}}>
     <div style={{fontFamily:"Georgia, 'Times New Roman', serif",fontSize:103,letterSpacing:'-.03em',fontWeight:400,color:PURPLE,lineHeight:1}}>LAVENDER</div>
     <div style={{fontFamily:'Arial, sans-serif',fontSize:24,letterSpacing:'.48em',fontWeight:400,color:PURPLE,marginTop:24,paddingLeft:12}}>CERÂMICAS</div>
     <div style={{width:90,height:1,background:'#b5a4b8',margin:'86px auto 34px'}}/>
     <div style={{fontFamily:'Arial, sans-serif',fontSize:20,letterSpacing:'.05em',color:'#6b666f'}}>Design e desenvolvimento por Math Brands</div>
   </div>
 </AbsoluteFill>;
}
export const LavenderShowcase=()=>{
 const frame=useCurrentFrame();
 return <AbsoluteFill style={{width:CW,height:CH,fontFamily:'Arial,Helvetica,sans-serif'}}>
   <BaseBackground frame={frame}/>
   {shots.filter(x=>frame>=x.from-7&&frame<x.to+1).map(shot=>
      <Shot key={shot.id} shot={shot} frame={frame}/>
   )}
   {frame>=534&&<Closing frame={frame}/>}
   <div style={{position:'absolute',bottom:86,left:90,right:90,display:'flex',justifyContent:'space-between',fontSize:14,letterSpacing:'.12em',color:'rgba(104,68,184,.65)',fontWeight:500}}>
      <span>LAVENDER · CERÂMICAS</span><span>PRÉVIA VISUAL · IMAGENS ILUSTRATIVAS</span>
   </div>
 </AbsoluteFill>;
};
