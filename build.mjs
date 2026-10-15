import {readFile,writeFile,mkdir,cp,rm,readdir} from 'node:fs/promises';
const root=import.meta.dirname;
await rm(root+'/dist',{recursive:true,force:true});await mkdir(root+'/dist',{recursive:true});
await cp(root+'/src',root+'/dist/src',{recursive:true});await cp(root+'/public',root+'/dist',{recursive:true});
await cp(root+'/index.html',root+'/dist/index.html');
const catalog=JSON.parse(await readFile(root+'/public/data/CATALOGO_DEMONSTRATIVO.json','utf8'));
let css=await readFile(root+'/src/styles.css','utf8');
const assets={};
async function collect(dir){for(const item of await readdir(dir,{withFileTypes:true})){const file=dir+'/'+item.name;if(item.isDirectory())await collect(file);else if(/\.(svg|webp|woff)$/.test(file)){const path=file.slice((root+'/public').length);const type=file.endsWith('.svg')?'image/svg+xml':file.endsWith('.webp')?'image/webp':'font/woff';assets[path]=`data:${type};base64,${(await readFile(file)).toString('base64')}`;}}}
await collect(root+'/public/assets');
for(const [path,url] of Object.entries(assets))if(path.endsWith('.woff'))css=css.replaceAll(path,url);
const media=JSON.parse(await readFile(root+'/public/data/media.json','utf8'));
for(const key of Object.keys(media))media[key]=assets[media[key]]||media[key];
const core=(await readFile(root+'/src/catalog.js','utf8')).replace(/^export /gm,'')+'\nconst esc=escapeHTML;';
const motion=(await readFile(root+'/src/preview.js','utf8')).replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
const app=(await readFile(root+'/src/app.js','utf8')).replace(/^import .*;\n/gm,'').replace("await import('./preview.js')",'await Promise.resolve({attachPreview})');
let html=await readFile(root+'/index.html','utf8');
html=html.replace('<link rel="stylesheet" href="/src/styles.css">',`<style>${css}</style>`)
 .replace(/<link rel="preload"[^>]+>/g,'')
 .replace('<script type="module" src="/src/app.js"></script>',`<script>window.LAVENDER_OFFLINE=true;window.LAVENDER_CATALOG=${JSON.stringify(catalog)};window.LAVENDER_MEDIA=${JSON.stringify(media)};window.LAVENDER_ASSETS=${JSON.stringify({'/assets/lavender-logo.svg':assets['/assets/lavender-logo.svg']})};(async()=>{\n${core}\n${motion}\n${app}\n})();</script>`);
await writeFile(root+'/dist/Lavender_Previa_Estrutural.html',html);
console.log('Build concluído: dist/index.html e dist/Lavender_Previa_Estrutural.html. Sem publicação.');
