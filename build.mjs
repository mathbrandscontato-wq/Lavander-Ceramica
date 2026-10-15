import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
const root=import.meta.dirname;
await rm(root+'/dist',{recursive:true,force:true});await mkdir(root+'/dist',{recursive:true});
await cp(root+'/src',root+'/dist/src',{recursive:true});await cp(root+'/public',root+'/dist',{recursive:true});
await cp(root+'/index.html',root+'/dist/index.html');
const catalog=JSON.parse(await readFile(root+'/public/data/CATALOGO_DEMONSTRATIVO.json','utf8'));
const css=await readFile(root+'/src/styles.css','utf8');
const core=(await readFile(root+'/src/catalog.js','utf8')).replace(/^export /gm,'');
const motion=(await readFile(root+'/src/preview.js','utf8')).replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
const app=(await readFile(root+'/src/app.js','utf8')).replace(/^import .*;\n/gm,'').replace("await import('./preview.js')",'await Promise.resolve({attachPreview})');
let html=await readFile(root+'/index.html','utf8');
html=html.replace('<link rel="stylesheet" href="/src/styles.css">',`<style>${css}</style>`)
 .replace('<script type="module" src="/src/app.js"></script>',`<script>window.LAVENDER_OFFLINE=true;window.LAVENDER_CATALOG=${JSON.stringify(catalog)};window.LAVENDER_MEDIA={};(async()=>{\n${core}\n${motion}\n${app}\n})();</script>`);
await writeFile(root+'/dist/Lavender_Previa_Estrutural.html',html);
console.log('Build concluído: dist/index.html e dist/Lavender_Previa_Estrutural.html. Sem publicação.');
