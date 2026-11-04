# M5 — Fotografias ilustrativas provisórias

**Autorização da direção criativa: 03/11/2026.** Fotos ilustrativas geradas estão permitidas para preencher o site e depois serão substituídas por imagens reais fornecidas pela Marina, sem depender de aprovação intermediária para cada fotografia.

### Proveniência
Os 12 arquivos WebP de `public/assets/` são **os mesmos blobs já existentes no protótipo V2** (`feat/prototipo-a-catalogo-interativo`, commit `3840722312a1e614adec4fcd8ca71348c4921293`). Foram reutilizados pelo SHA Git, sem recompressão, alterações ou URLs externas. São arquivos gerados para demonstração, não fotografias dos quatro produtos reais.

- `hero.webp`: pôster ilustrativo da Home, enquanto o vídeo final não for fornecido
- `custom-banner.webp`: imagem de fundo das peças personalizáveis
- `manifesto.webp`: editorial do Manifesto
- `product-01.webp` a `product-09.webp`: nove posições de catálogo e quatro posições da galeria de demonstração

### Política de transparência
- Todas as imagens exibidas são provisórias e identificadas como ilustrativas nos textos alternativos ou avisos da página.
- **Não vincular essas imagens aos produtos Caneca Estante, Booknook, Copinhos de Mel ou Caneca Friends como se fossem fotos dos SKUs.** Estes itens têm nome e preços informados, mas fotografias/quantidades individuais ainda não estão confirmadas.
- Não cadastrar imagens provisórias no Sanity production como fotografias oficiais sem consentimento; não usar em uma ficha de produto real nem no checkout definitivo de um SKU real.
- Substituição prevista por imagens reais via CMS com campo de crédito/alt acessível, depois da validação da Marina.
- Layout, hero, tipografia, filtros e fluxo de compra não foram alterados nesta etapa. Sem merge ou deploy.

### Testes
Reexecutar `npm test` e build Astro, conferir que os 12 arquivos são WebP reais e preservar `noindex` da prévia. A comparação das composições VIS originais continua separada do simples carregamento das imagens.
