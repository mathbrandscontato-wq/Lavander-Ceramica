import {defineField,defineType} from 'sanity';

export const productType = defineType({
  name: 'product',
  title: 'Produtos',
  type: 'document',
  groups:[
    {name:'principal',title:'Peça',default:true},
    {name:'catalogo',title:'Organização'},
    {name:'comercial',title:'Informações comerciais'},
    {name:'personalizacao',title:'Personalização'},
  ],
  fields:[
    defineField({name:'productId',title:'Código único da peça',type:'string',group:'principal',
      description:'ID estável, não renomear após o primeiro cadastro.',validation:Rule=>Rule.required()}),
    defineField({name:'name',title:'Nome do produto',type:'string',group:'principal',validation:Rule=>Rule.required()}),
    defineField({name:'slug',title:'Endereço do produto',type:'slug',group:'principal',
      options:{source:'name',maxLength:96},validation:Rule=>Rule.required()}),
    defineField({name:'publicationStatus',title:'Aprovação para aparecer no site',type:'string',group:'principal',
      description:'Comece como Pendente. Somente mudar para Aprovado após conferir fotos, direitos de uso, texto, categoria e preço. O botão Publicar do Sanity é diferente desta aprovação.',
      options:{layout:'radio',list:[
        {title:'Pendente (não exibir)',value:'pending'},
        {title:'Aprovado para o catálogo',value:'approved'},
      ]},initialValue:'pending',validation:Rule=>Rule.required()}),
    defineField({name:'approvalSource',title:'Referência da aprovação',type:'string',group:'principal',
      description:'Exemplo: conferido pela Marina em DD/MM/AAAA. Não incluir dados pessoais sensíveis.',
      validation:Rule=>Rule.custom((value,ctx)=>{
        if(ctx.document?.publicationStatus!=='approved') return true;
        return typeof value==='string' && value.trim().length>0 || 'Informe a confirmação da aprovação antes de exibir no site.';
      })}),
    defineField({name:'images',title:'Fotografias da peça',type:'array',group:'principal',
      of:[{type:'image',options:{hotspot:true},fields:[
        defineField({name:'alt',title:'Descrição da fotografia (acessibilidade)',type:'string',validation:Rule=>Rule.required()}),
        defineField({name:'credits',title:'Crédito e direito de uso (interno)',type:'string'}),
      ]}],
      validation:Rule=>Rule.min(1)}),
    defineField({name:'shortDescription',title:'Descrição curta validada',type:'text',rows:3,group:'principal'}),
    defineField({name:'description',title:'Descrição completa validada',type:'text',rows:5,group:'principal'}),
    defineField({name:'category',title:'Categoria',type:'reference',to:[{type:'category'}],group:'catalogo',validation:Rule=>Rule.required()}),
    defineField({name:'collections',title:'Coleções',type:'array',of:[{type:'reference',to:[{type:'collection'}]}],group:'catalogo'}),
    defineField({name:'tags',title:'Etiquetas de filtro aprovadas',type:'array',of:[{type:'string'}],group:'catalogo'}),
    defineField({name:'sortOrder',title:'Ordem de apresentação',type:'number',initialValue:0,group:'catalogo'}),
    defineField({name:'priceMode',title:'Como exibir o preço',type:'string',group:'comercial',
      options:{list:[
        {title:'Ainda não confirmado — manter como rascunho',value:'unconfirmed'},
        {title:'Valor confirmado',value:'fixed'},
        {title:'Sob consulta — somente se aprovado',value:'on_request'},
      ],layout:'radio'},
      initialValue:'unconfirmed',validation:Rule=>Rule.required()}),
    defineField({name:'priceAmount',title:'Preço em reais — somente se confirmado',type:'number',group:'comercial',
      hidden:({document})=>document?.priceMode!=='fixed',
      validation:Rule=>Rule.custom((value,context)=>{
        if(context.document?.priceMode!=='fixed') return true;
        return (typeof value==='number'&&Number.isFinite(value)&&value>0) || 'Informe um preço real positivo.';
      })}),
    defineField({name:'stockStatus',title:'Disponibilidade confirmada?',type:'string',group:'comercial',
      options:{list:[
        {title:'Não confirmada',value:'unconfirmed'},
        {title:'Disponível',value:'available'},
        {title:'Indisponível',value:'unavailable'},
      ]},initialValue:'unconfirmed'}),
    defineField({name:'care',title:'Cuidados — conteúdo validado',type:'text',rows:3,group:'comercial'}),
    defineField({name:'specifications',title:'Especificações — conteúdo validado',type:'text',rows:4,group:'comercial'}),
    defineField({name:'personalizable',title:'Aceita personalização?',type:'boolean',group:'personalizacao',initialValue:false}),
    defineField({name:'allowedModels',title:'Peças elegíveis como modelos',type:'array',group:'personalizacao',
      description:'Selecionar somente referências de produtos existentes. A elegibilidade também será verificada no site.',
      hidden:({document})=>document?.personalizable!==true,
      of:[{type:'reference',to:[{type:'product'}],options:{filter:'personalizable == true'}}]}),
  ],
  preview:{
    select:{title:'name',subtitle:'publicationStatus',media:'images.0'},
    prepare:({title,subtitle,media})=>({title:title||'Sem nome',subtitle:subtitle==='approved'?'Aprovado para catálogo':'Pendente',media}),
  },
});
