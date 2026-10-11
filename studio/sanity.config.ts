import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes} from './schemaTypes';

// O project ID não é segredo. A conta Sanity pertence à cliente.
// Variáveis de ambiente podem substituir os valores em homologação.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 't4nkzeaq';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'lavender-studio',
  title: 'Lavender Cerâmicas — Painel',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {types: schemaTypes},
});
