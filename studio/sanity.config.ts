import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes} from './schemaTypes';
import {ptBRLocale} from '@sanity/locale-pt-br';
import {GettingStartedTool} from './tools/GettingStartedTool';
import {guardPublishAction} from './actions/guardPublishAction';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 't4nkzeaq';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

// O projeto foi criado na conta autorizada da cliente; esses IDs são públicos.
// Nada é publicado no site a partir desta configuração isoladamente.
export default defineConfig({
  name: 'lavender-studio',
  title: 'Lavender Cerâmicas | Administração',
  projectId,
  dataset,
  plugins: [
    ptBRLocale(),
    structureTool({
      title: 'Gerenciar conteúdo',
      structure: (S) =>
        S.list()
          .title('Conteúdo da Lavender')
          .items([
            S.listItem()
              .id('products')
              .title('Peças e produtos')
              .child(S.documentTypeList('product').title('Peças cadastradas')),
            S.documentTypeListItem('category').title('Categorias'),
            S.documentTypeListItem('collection').title('Coleções'),
            S.listItem()
              .id('siteContent')
              .title('Textos e contatos do site')
              .child(S.document().schemaType('siteContent').documentId('siteContent')),
          ]),
    }),
  ],
  tools: [
    {
      name: 'orientacoes',
      title: 'Comece aqui',
      component: GettingStartedTool,
    },
  ],
  document: {
    actions: (previous, context) =>
      context.schemaType === 'product' || context.schemaType === 'siteContent'
        ? previous.map((action) => action.action === 'publish' ? guardPublishAction(action, context.schemaType) : action)
        : previous,
  },
  schema: {types: schemaTypes},
});
