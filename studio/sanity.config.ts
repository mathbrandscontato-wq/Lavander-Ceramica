import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes} from './schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
  throw new Error('Configure SANITY_STUDIO_PROJECT_ID no Studio. Não inclua credenciais no GitHub.');
}

export default defineConfig({
  name: 'lavender-studio',
  title: 'Lavender Cerâmicas — Painel',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {types: schemaTypes},
});
