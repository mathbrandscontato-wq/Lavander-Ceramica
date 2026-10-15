import {findSpatialBlock} from './catalog.js';

// Progressive enhancement, exclusivo de /loja. Nenhuma informação depende dele.
export function attachPreview(grid) {
  const preference=matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const controller=new AbortController(),signal=controller.signal;
  let timer=0, animations=[], active=null, disposed=false;
  function reset(){clearTimeout(timer);timer=0;animations.forEach(a=>a.cancel());animations=[];if(active){delete active.dataset.previewMode;active.classList.remove('preview-active');active=null;}}
  function begin(card){
    reset();if(!preference.matches||disposed)return;
    const image=card.querySelector('.media img');
    if(!image?.complete||!image.naturalWidth)return; // Sem animar mídias ausentes.
    timer=setTimeout(()=>{
      if(!card.isConnected||!preference.matches)return;
      const all=[...grid.querySelectorAll('[data-product-id]')];
      const rects=all.map(c=>({id:c.dataset.productId,...rect(c.querySelector('.media'))}));
      const block=findSpatialBlock(rects,card.dataset.productId);
      // Um bloco 2×2 pode existir, mas os títulos/links entre as duas linhas
      // tornam uma máscara única insegura. Só a geometria não autoriza cobri-los.
      const blockHasContent=block&&all.some(c=>{
        const label=c.querySelector('h2').getBoundingClientRect();
        const bounds=union(block);return intersects(bounds,label);
      });
      active=card;card.dataset.previewMode='simplified';
      card.dataset.previewReason=blockHasContent?'text-between-rows':block?'interactive-neighbours':'irregular-or-small-grid';
      card.classList.add('preview-active');
      animations.push(image.animate([{transform:'scale(1)',clipPath:'inset(2% round 8px)'},{transform:'scale(1.12)',clipPath:'inset(0% round 8px)'}],{duration:360,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'}));
    },125);
  }
  grid.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse'&&e.pointerType!=='pen')return;const card=e.target.closest('[data-product-id]');if(card&&!card.contains(e.relatedTarget))begin(card);},{signal});
  grid.addEventListener('pointerout',e=>{const card=e.target.closest('[data-product-id]');if(card&&!card.contains(e.relatedTarget))reset();},{signal});
  grid.addEventListener('focusin',reset,{signal});
  grid.addEventListener('click',reset,{signal});
  window.addEventListener('scroll',reset,{signal,capture:true,passive:true});
  window.addEventListener('resize',reset,{signal,passive:true});
  window.addEventListener('blur',reset,{signal});
  document.addEventListener('visibilitychange',reset,{signal});
  preference.addEventListener('change',reset,{signal});
  const observer=new ResizeObserver(reset);observer.observe(grid);
  return ()=>{disposed=true;reset();controller.abort();observer.disconnect();};
}
function rect(node){const r=node.getBoundingClientRect();return {left:r.left,top:r.top,width:r.width,height:r.height,right:r.right,bottom:r.bottom};}
function union(rects){return {left:Math.min(...rects.map(r=>r.left)),top:Math.min(...rects.map(r=>r.top)),right:Math.max(...rects.map(r=>r.right)),bottom:Math.max(...rects.map(r=>r.bottom))};}
function intersects(a,b){return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;}
