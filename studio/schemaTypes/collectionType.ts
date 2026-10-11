import {defineField, defineType} from 'sanity';

export const collectionType = defineType({
  name:'collection',
  title:'Coleções',
  type:'document',
  fields:[
    defineField({name:'name',title:'Nome',type:'string',validation:Rule=>Rule.required()}),
    defineField({name:'slug',title:'Endereço',type:'slug',options:{source:'name'},validation:Rule=>Rule.required()}),
    defineField({name:'description',title:'Texto aprovado da coleção',type:'text',rows:3}),
    defineField({name:'sortOrder',title:'Ordem',type:'number',initialValue:0}),
  ],
  preview:{select:{title:'name'}},
});
