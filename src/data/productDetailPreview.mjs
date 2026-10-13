/**
 * P05: material técnico, sem SKU real, preço, estoque, avaliação ou oferta.
 * NÃO publicar como peça real e não sincronizar com o Sanity.
 */
export const detailPreview = Object.freeze({
  id:'p05-preview',
  slug:'amostra-tecnica',
  title:'Peça demonstrativa',
  category:'Canecas',
  priceStatus:'A confirmar',
  description:'Estrutura de informações em homologação. Nome, material, dimensões, cuidados, disponibilidade e fotografias serão preenchidos somente após validação da proprietária.',
  images:Object.freeze([
    {id:'front',name:'Vista frontal',tone:'clay'},
    {id:'side',name:'Vista lateral',tone:'sand'},
    {id:'top',name:'Vista superior',tone:'cream'},
    {id:'detail',name:'Detalhe da superfície',tone:'terra'},
  ]),
  tabs:Object.freeze([
    {id:'descricao',label:'Descrição',content:'Descrição comercial pendente de validação. A composição desta área segue a prancha A2/A3.'},
    {id:'detalhes',label:'Detalhes',content:'Detalhes da peça serão preenchidos apenas com informações confirmadas.'},
    {id:'cuidados',label:'Cuidados',content:'Orientações de uso e conservação aguardam confirmação técnica.'},
  ]),
});
