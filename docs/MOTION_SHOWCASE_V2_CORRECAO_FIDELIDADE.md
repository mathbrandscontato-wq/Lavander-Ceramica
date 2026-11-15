# Lavender Cerâmicas — Correção de fidelidade do showcase V2

**Data:** 14/11/2026
**Motivo:** o showcase V1 havia usado capturas técnicas da implementação Astro M5, visualmente divergentes do protótipo aprovado.

## Fonte visual imutável
- Repositório: mathbrandscontato-wq/Lavander-Ceramica
- **Snapshot visual aprovado:** branch `gh-pages`, commit `8fd5af3ef68210d10369c6d1a42a7911992815ea`
- Evidência de aprovação: `docs/APROVACAO_VISUAL_PROTO_V2_2026-11-04.md` do branch Astro M5
- O workflow faz checkout isolado do SHA e aborta se o commit divergir.
- A implementação Astro M5 continua intacta, servindo somente para validação de build independente.

## Correções implementadas
1. Troca da fonte de captura de `Astro M5` para **protótipo visual aprovado** via servidor estático local, sem deploy.
2. Captura de Home, categoria Canecas, detalhe ilustrativo existente (`/produto/caneca-estante`), Personalizadas e Manifesto.
3. Fonte real Cormorant Garamond e Inter carregada pelo protótipo, não simulada pelo motion.
4. Logotipo SVG original `assets/lavender-logo.svg` no encerramento e no site. Copiado em runtime do snapshot aprovado, sem redesenho.
5. Interações verificadas: filtro da Home; ordenação da categoria; aba informativa de produto. O protótipo não contém uma galeria interativa com miniaturas; portanto não se simula essa função.
6. Produtos e preços continuam explicitamente demonstrativos, como no protótipo.

## Entrega / limitações
- V2: 605 frames, 1080x1920, 30 fps, H.264/MP4, versão sem áudio, prévia leve e áudio sintetizado original.
- O vídeo de referência `ScreenRecording_11-14-2026 17-59-57_1.mp4` não foi disponibilizado no runner. É impossível declarar correspondência audiovisual frame a frame; timings seguem storyboard do briefing.
- A V1 deve ser considerada superada.
- Nenhuma alteração de produção, DNS, Sanity, carrinho, pagamentos ou deploy foi realizada.

## Rotas e origem
| Segmento | URL interna do protótipo (via hash) | Captura |
|--|--|--|
| Hero e Home | `/#/` | `home-hero.png`, `home-shop.png`, `home-filter.png` |
| Categoria | `/#/categoria/canecas` | `category.png`, `category-sort.png` |
| Detalhe ilustrativo | `/#/produto/caneca-estante` | `product.png`, `product-details.png` |
| Personalizadas | `/#/colecoes/personalizadas` | `personalizadas.png` |
| Manifesto | `/#/manifesto` | `manifesto.png` |

## QA
`motion/lavender-showcase/scripts/capture-approved.mjs` valida rotas, assets, fontes e interações.
`motion/lavender-showcase/scripts/qa-approved.mjs` valida fonte/SHAs, 605 frames, 30fps, H264, AAC e dimensões.
