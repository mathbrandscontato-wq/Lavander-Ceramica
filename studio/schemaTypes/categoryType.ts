import {defineField, defineType} from 'sanity';

export const categoryType = defineType({
  name: 'category',
  title: 'Categorias de peças',
  type: 'document',
  fields: [
    defineField({name:'name',title:'Nome da categoria',type:'string',validation:Rule=>Rule.required()}),
    defineField({name:'slug',title:'Endereço da categoria',type:'slug',options:{source:'name'},validation:Rule=>Rule.required()}),
    defineField({name:'description',title:'Texto de apresentação (validado)',type:'text',rows:3}),
    defineField({name:'sortOrder',title:'Ordem no catálogo',type:'number',initialValue:0}),
  ],
  preview:{select:{title:'name'}},
});
