import {defineField,defineType} from 'sanity';

/**
 * Singleton editorial: altera somente o conteúdo textual, nunca a estrutura
 * de telas definida na especificação aprovada.
 */
export const siteContentType = defineType({
  name: 'siteContent',
  title: 'Textos e contatos',
  type: 'document',
  groups: [
    {name:'home',title:'Home',default:true},
    {name:'manifesto',title:'Manifesto'},
    {name:'contato',title:'Rodapé e contato'},
    {name:'aprovacao',title:'Aprovação editorial'},
  ],
  fields: [
    defineField({name:'homeHeroTitle',title:'Título aprovado da Home',type:'string',group:'home',
      description:'Preserve o texto validado no design. Mudanças devem passar pela direção criativa.'}),
    defineField({name:'homeHeroSupportingText',title:'Descrição curta da Home',type:'text',rows:3,group:'home'}),
    defineField({name:'personalizedBannerTitle',title:'Título do banner de personalizados',type:'string',group:'home'}),
    defineField({name:'personalizedBannerText',title:'Texto do banner',type:'text',rows:3,group:'home'}),
    defineField({name:'manifestoTitle',title:'Título da página Manifesto',type:'string',group:'manifesto',initialValue:'Manifesto'}),
    defineField({name:'manifestoCopy',title:'Texto aprovado do Manifesto',type:'text',rows:12,group:'manifesto',
      description:'O texto das pranchas é proposta editorial, não depoimento da proprietária. Confirmar antes de aprovar.',
      validation:Rule=>Rule.required()}),
    defineField({name:'footerMicrotext',title:'Texto curto do rodapé',type:'text',rows:3,group:'contato'}),
    defineField({name:'contactEmail',title:'E-mail comercial público (opcional)',type:'email',group:'contato',
      description:'Não usar um e-mail pessoal sem autorização para divulgação pública.'}),
    defineField({name:'instagramUrl',title:'Instagram oficial (opcional)',type:'url',group:'contato',
      validation:Rule=>Rule.uri({scheme:['https']})}),
    defineField({name:'editorialStatus',title:'Aprovação para publicação',type:'string',group:'aprovacao',
      options:{layout:'radio',list:[
        {title:'Pendente — não publicar',value:'pending'},
        {title:'Aprovado pela direção e pela proprietária',value:'approved'},
      ]},initialValue:'pending',validation:Rule=>Rule.required()}),
    defineField({name:'approvalSource',title:'Registro da aprovação',type:'string',group:'aprovacao',
      description:'Somente informar quando houver confirmação formal. Não inventar aprovações.',
      validation:Rule=>Rule.custom((value,context)=>{
        if(context.document?.editorialStatus!=='approved') return true;
        return typeof value==='string'&&value.trim().length>0 || 'Registre a origem da aprovação.';
      })}),
  ],
  preview:{prepare:()=>({title:'Textos e contatos do site'})},
});
