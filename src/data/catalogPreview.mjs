/**
 * P03/P04 — somente posições de homologação visual dos anexos A6/A7/B5/B6.
 * Estes objetos NÃO representam SKUs, valores, fotos, estoque ou ofertas reais.
 * Não importar ao Sanity, nem utilizar em produção.
 */
export const canecasPreview = Object.freeze([
  {id:'a6-01', name:'Caneca · posição 01', categoryId:'canecas', kind:'caneca', filter:'personalizadas', sortOrder:1},
  {id:'a6-02', name:'Caneca · posição 02', categoryId:'canecas', kind:'caneca', filter:'frases', sortOrder:2},
  {id:'a6-03', name:'Caneca · posição 03', categoryId:'canecas', kind:'caneca', filter:'classicas', sortOrder:3},
  {id:'a6-04', name:'Caneca · posição 04', categoryId:'canecas', kind:'caneca', filter:'ilustradas', sortOrder:4},
  {id:'a6-05', name:'Caneca · posição 05', categoryId:'canecas', kind:'caneca', filter:'ilustradas', sortOrder:5},
  {id:'a6-06', name:'Caneca · posição 06', categoryId:'canecas', kind:'caneca', filter:'classicas', sortOrder:6},
  {id:'a6-07', name:'Caneca · posição 07', categoryId:'canecas', kind:'caneca', filter:'personalizadas', sortOrder:7},
  {id:'a6-08', name:'Caneca · posição 08', categoryId:'canecas', kind:'caneca', filter:'frases', sortOrder:8},
  {id:'a6-09', name:'Caneca · posição 09', categoryId:'canecas', kind:'caneca', filter:'frases', sortOrder:9},
]);
export const canecasFilters = Object.freeze([
  {id:'todos',label:'Todas'},
  {id:'frases',label:'Frases'},
  {id:'personalizadas',label:'Personalizadas'},
  {id:'ilustradas',label:'Ilustradas'},
  {id:'classicas',label:'Clássicas'},
]);

export const personalizadasPreview = Object.freeze([
  {id:'a7-01',name:'Peça personalizável · posição 01',categoryId:'canecas',kind:'caneca',filter:'canecas',sortOrder:1},
  {id:'a7-02',name:'Peça personalizável · posição 02',categoryId:'pratos',kind:'prato',filter:'pratos',sortOrder:2},
  {id:'a7-03',name:'Peça personalizável · posição 03',categoryId:'pratos',kind:'prato',filter:'pratos',sortOrder:3},
  {id:'a7-04',name:'Peça personalizável · posição 04',categoryId:'tigelas',kind:'tigela',filter:'tigelas',sortOrder:4},
  {id:'a7-05',name:'Peça personalizável · posição 05',categoryId:'cumbucas',kind:'tigela',filter:'cumbucas',sortOrder:5},
  {id:'a7-06',name:'Peça personalizável · posição 06',categoryId:'canecas',kind:'caneca',filter:'canecas',sortOrder:6},
  {id:'a7-07',name:'Peça personalizável · posição 07',categoryId:'pratos',kind:'prato',filter:'pratos',sortOrder:7},
  {id:'a7-08',name:'Peça personalizável · posição 08',categoryId:'canecas',kind:'caneca',filter:'canecas',sortOrder:8},
]);
export const personalizadasFilters = Object.freeze([
  {id:'todos',label:'Todos'},
  {id:'canecas',label:'Canecas'},
  {id:'pratos',label:'Pratos'},
  {id:'tigelas',label:'Tigelas'},
  {id:'cumbucas',label:'Cumbucas'},
]);
