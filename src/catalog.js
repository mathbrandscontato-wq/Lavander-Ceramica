export const CATEGORIES = ['Todos', 'Canecas', 'Pratos', 'Tigelas', 'Decoração'];
export const categorySlug = name => ({Canecas:'canecas',Pratos:'pratos',Tigelas:'tigelas','Decoração':'decoracao'})[name];
export const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
export function selectProducts(products, {category='Todos', query='', sort='canonical', personalizable=false}={}) {
  const needle = normalize(query.trim());
  const selected = products.filter(p => (!personalizable || p.is_personalizable_demo)
    && (category === 'Todos' || p.category_demo === category)
    && (!needle || normalize(p.display_name_demo + ' ' + p.category_demo).includes(needle)));
  return selected.sort((a,b) => {
    const tie = a.home_order - b.home_order;
    if (sort === 'name') return a.display_name_demo.localeCompare(b.display_name_demo,'pt-BR') || tie;
    if (sort === 'price-up') return a.price_brl_demo-b.price_brl_demo || tie;
    if (sort === 'price-down') return b.price_brl_demo-a.price_brl_demo || tie;
    return tie;
  });
}
export const productRoute = p => `/${p.is_personalizable_demo ? 'personalizar' : 'produto'}/${p.slug}`;
export const money = n => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validQuantity(value) {const n=Number(value);return Number.isInteger(n) && n>=1 && n<=20;}
// O limite 20 serve somente ao teste de controles; não representa estoque.
export function findSpatialBlock(rects, activeId) {
  const active=rects.find(r=>r.id===activeId);if(!active)return null;
  const close=(a,b)=>Math.abs(a-b)<3;
  const rows=[];
  for(const rect of [...rects].sort((a,b)=>a.top-b.top||a.left-b.left)) {
    let row=rows.find(r=>close(r[0].top,rect.top));if(!row){row=[];rows.push(row);}row.push(rect);
  }
  rows.forEach(r=>r.sort((a,b)=>a.left-b.left));
  const index=rows.findIndex(r=>r.some(x=>x.id===activeId));
  for(const otherIndex of [index+1,index-1]) {
    const row=rows[index],other=rows[otherIndex];if(!other)continue;
    const at=row.findIndex(r=>r.id===activeId);
    for(const offset of [1,-1]) {
      const peer=row[at+offset];if(!peer)continue;
      const below=other.find(r=>close(r.left,active.left)&&close(r.width,active.width));
      const diagonal=other.find(r=>close(r.left,peer.left)&&close(r.width,peer.width));
      if(below&&diagonal)return [active,peer,below,diagonal];
    }
  }
  return null;
}
