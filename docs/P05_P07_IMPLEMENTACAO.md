# Etapa P05 / P07 — implementação visual de homologação

Data: 13/10/2026. P03 e P04 tiveram **estrutura aprovada pela Math Brands**; isso não é aceite visual definitivo e não resolve M01, fontes, imagens, taxonomia nem CON-04 (9×8 Canecas).

## Fonte de referência
- V3 §08 e contrato tabela 16: **P05 Detalhe comum**, VIS-03/A2, VIS-04/A3; B2 mostra somente a alternativa WhatsApp no mobile.
- V3 §10 e contrato tabela 18: **P07 Manifesto**, VIS-06/A5 desktop e VIS-07/B4 mobile.
- Os desenhos ilustram posições e opções. Não certificam preço, estoque, entregas, especificações, avaliações ou decisão comercial.

## P05 — `/produto/amostra-tecnica/`
- Template Astro em `src/components/product/DetailPreview.astro`. Galeria de miniaturas verticais e estágio ampliado no desktop; imagem larga e miniaturas horizontais no mobile.
- Miniaturas/setas mudam o estado da demonstração; abas de conteúdo são funcionais com teclado (esquerda/direita), controles nativos, foco e ARIA.
- Breadcrumb usa rota de categoria existente. Nome "Peça demonstrativa", preço, estoque e especificações explicitamente **a confirmar**.
- Quantidade **desativada** (não há estoque real). Avaliações reais inexistentes são omitidas.
- CTAs roxos permanecem **somente apresentação, com `aria-disabled`**, sem endpoint, carrinho, WhatsApp ou formulário.
- Fonte de dados `src/data/productDetailPreview.mjs` é isolada da API e do Sanity; não representa SKU. Só rota `amostra-tecnica` é gerada enquanto não existem produtos reais.
- Gate: sem aprovar variante comercial, nem mobile do fluxo online (a B2 ilustra WhatsApp), até decisão explícita.

## P07 — `/manifesto/`
- Container editorial A5 com título e quatro parágrafos à esquerda + media à direita, 50/50 em desktop. Em mobile B4, texto integral vem antes da imagem no DOM e no layout.
- Conteúdo retirado da **proposta editorial que aparece na A5** e salvo em `src/data/manifestoPreview.mjs` com `editorialStatus: pending`. **Não é depoimento literal nem copy aprovada pela Marina.**
- Fotografia permanece um placeholder estético claramente identificado, sem substituir pelo cenário da prancha como se fosse imagem original licenciada.
- Elementos de redes sociais só serão habilitados após validação dos destinos; não inventar links, informações biográficas, promessas ou claims.
- Gate: G2 exige ativos/medidas M01; G3/G4 exigem aprovação do texto e fotografia.

## Contratos globais
- A Home, P03 e P04 não recebem alteração nesta etapa. Estilo de P05/P07 é isolado em `src/styles/internal-page.css`, `product-detail.css` e `manifesto.css`.
- `BaseLayout` mantém Header/Footer únicos, sem redesign nem flow comercial.
- `robots.txt`/noindex não são autenticação: ambas as rotas continuam **somente em branch privada**, sem build hospedado.
- Sem contato com Marina, sem convites, sem publicação ou merge na `main`.

## QA necessário
- [ ] GitHub Actions: testes e build do Astro, tipos/build Sanity e rotas novas.
- [ ] Capturas 1440: P05 vs A2/A3; P07 vs A5.
- [ ] Captura mobile 390 da P07 vs B4 (sem homologação comercial da P05).
- [ ] Teste de galeria, abas e overflow real por navegador; screenshots não substituem teste de interação.
- [ ] Comparar e corrigir diferenças B0/B1; registrar B2/B3. Aceite estrutural pela Math Brands após revisão.
