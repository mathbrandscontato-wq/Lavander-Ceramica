# P02–P04 · Catálogo — etapa seguinte após P01 R1

Data 13/10/2026. Referência matriz: `Lavender_Ceramicas_Especificacao_Implementacao_V3_Revisada.docx`, ANEXO A6/A7 e ANEXO B5/B6.

## P02 — Loja geral
- Arquitetura da listagem preparada com o componente compartilhado `src/components/catalog/CatalogListing.astro`.
- **Rota `/loja` ainda não disponibilizada**: a V3 informa que o título, o mapeamento da página e a organização precisam ser confirmados por Matheus. Não foi inventada prancha exclusiva.
- Estados futuros: vazio, carregamento e erro de dados; somente após integração dos produtos reais.

## P03 — Categoria Canecas (`/categoria/canecas`)
- Baseline VIS-08: desktop A6, mobile B5.
- Breadcrumb, título editorial, texto de apoio, contador de posições, 5 filtros contextuais e seletor funcional de ordem demonstrativa.
- Grade desktop **4 + 5**, mobile responsivo técnico em 2 colunas, sem esconder o nono item por conta própria.
- **CON-04** continua aberto: A6 demonstra 9 produtos, B5 oito, com títulos e ordem diferentes. O protótipo mantém 9 posições fictícias sem nome/preço/sku reais. Homologação mobile bloqueada.
- **CON-05**: taxonomia demonstrativa Frases, Personalizadas, Ilustradas, Clássicas. Exigir categorias/tags confirmadas antes do catálogo real.
- Em lugar de "Mais relevantes" (algoritmo não aprovado), o protótipo usa "Ordem da prancha" e ordenação efetiva A–Z. A alteração da opção visual deve ser submetida ao diretor antes do aceite da tela.

## P04 — Peças Personalizadas (`/colecoes/personalizadas`)
- Baseline VIS-09 A7 / VIS-10 B6: filtros acima do título central, resumo centralizado, quatro colunas desktop e duas no mobile, sem hero lateral.
- Oito **posições ilustrativas** apenas. Nenhuma foi definida como SKU elegível ou produto real.
- Informativo inferior limita a personalização às peças existentes, sem afirmar opções de cores, tamanhos ou prazos não aprovados.
- CTA "Conheça o processo" e "Fale sobre a sua ideia" têm apenas aparência de botões desabilitados; **não acionam formulário, contato ou WhatsApp** sem decisão de rota e política comercial.

## Contratos de compartilhamento
- `src/data/catalogPreview.mjs` é isolado do `src/lib/sanityCatalog.mjs`; **nunca enviar amostras ao CMS**.
- `CatalogListing.astro` utiliza `ProductCard.astro` também presente na Home. Uma única base futura do Sanity abastecerá estas telas, sem duplicação de preço ou ID.
- `sortOrder` é determinístico, e filtros reordenam a grade sem lacunas. Preço é "Preço a confirmar".
- P02/P03/P04 não criam checkout, autenticação, API de pedidos, favoritos ou conteúdo de publicação.
- Header e Footer globais preservados; no layout o header sobreposto aplica-se somente à Home.

## Validação
- [ ] Testes automatizados para 9/8 posições, URLs e classificação de filtros.
- [ ] Build Astro + build Studio em GitHub Actions.
- [ ] Capturas P03/P04 Desktop 1440x, comparação manual com A6 e A7.
- [ ] Capturas mobile como **prévia não homologada**, sem decidir oitavo/nono produto.
- [ ] Medição M01, fotos, logo, tipografias, contagem real e aprovação visual por Matheus.
- [ ] **Sem deploy, sem merge, sem contato com Marina.**
