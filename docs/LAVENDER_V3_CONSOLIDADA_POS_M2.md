# MATH BRANDS | PROJETO 001 — LAVENDER CERÂMICAS
## V3 CONSOLIDADA PÓS-M2 · 21/10/2026 — RASCUNHO DE ARQUITETURA (SEM APROVAÇÃO DE PLATAFORMA)

### Documento de origem e controle de mudanças
**Original integral consultado e preservado:** Lavender_Ceramicas_Plano_Ecommerce_Infraestrutura_V3.docx, Math Brands, 20/10/2026, dez páginas, Biblioteca /Projeto Piloto - Sites. **Não sobrescrever o DOCX original.**
O original tem seções 01–15 e bibliografia F1–F11. Esta consolidação atualiza riscos/evidências posteriores, preserva os compromissos comerciais e detalha critérios; não reinterpreta a Especificação Visual V2/VIS-01 a VIS-10 nem constitui aprovação de novos layouts.
**Prova vinculada:** [M2_PROVA_TECNICA_ECOMMERCE.md](M2_PROVA_TECNICA_ECOMMERCE.md). PRs originais [#1](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/pull/1) e [#2](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/pull/2) ficam intactos.

## 01. Resumo executivo (preservado)
Converter o protótipo Lavender em loja autoral de peças únicas lançadas em drops, com compra/pagamento online de peças prontas, Correios no Brasil, catálogo editorial e personalizados encaminhados ao WhatsApp. A Marina aprovou a direção acolhedora de conteúdo e organização do protótipo, **não comprovou checkout, taxas, domínio, hospedagem ou conteúdos ilustrativos**. Preservar exatamente header, footer, hero artesanal, categorias, vitrine de nove produtos na Home, banner simplificado, Manifesto e versões mobile expressamente aprovadas.
**Evidência nova:** contratos JS e Astro passaram; Woo real efêmero confirmou estoque 1→0 e baixa repetida mantendo 0, mas após cancelamento manual permaneceu 0. Portanto **M2 é parcialmente validada, não pronta para produção**.

## 02. Registro de decisões e autoridade
| Tema | Autoridade | Estado em 21/10 | Regra |
|---|---|---|---|
| Layout V2 e VIS-01…VIS-10 | Matheus / direção criativa | APROVADO VISUALMENTE | Sem redesign por engenharia. |
| Venda direta de peça pronta | Marina | CONFIRMADO | Checkout online, pagamento real só após plataforma autorizada. |
| Peça única e drops | Marina | CONFIRMADO | Estoque 1 por SKU; horário e calendário auditados. |
| Personalizados | Marina | CONFIRMADO | Modelos elegíveis existentes → texto → WhatsApp, sem compra em checkout comum. |
| Envio Correios Brasil | Marina | CONFIRMADO | Precificação e contrato de logística não validados. |
| Foto/paleta/fonte/vídeo definitivos | Marina | A RECEBER | Sem inventar assets/valores ou titularidade. |
| Sanity existente | Fundação técnica | PRESERVADO | CMS editorial, projeto t4nkzeaq e dataset production sem alterações pela M2. |
| Astro + WooCommerce | Engenharia | CANDIDATO M2 | Prova inicial parcial; transações em aberto. |
| Nuvemshop | Engenharia/comercial | CANDIDATA NÃO TESTADA | Nenhuma compra ou contrato. |
| Telas carrinho/checkout | Matheus | DESIGN COMPLEMENTAR PENDENTE | Não declarar homologadas. |
| Conta recebedora, domínio, fornecedores, custos | Marina | A DECIDIR | Bloqueia publicação. |

## 03. Mudança de escopo, aditivo e custos
O serviço original de site/catálogo promocional não absorve automaticamente cobrança, estoque transacional, dados pessoais, logística, suporte, updates, segurança e operação. Preparar aditivo de escopo e custos recorrentes antes de produção; titularidade da infraestrutura da Marina, sem serviços pagos sem autorização. Preservar custo da M2: GitHub Actions e imagens efêmeras dentro das franquias/plano disponíveis, sem contratar serviço; consumo de minutos do GitHub não foi quantificado como R$ 0 garantido.

## 04. Arquitetura funcional — fluxos e estados
**Peça única/drop:** documento editorial revisado → SKU único e associação ao produto comercial → coleção/datas → liberação autorizada → página pública → compra com estoque remoto transacional → pagamento verificado pelo servidor → pedido pago → embalagem/postagem → rastreio → entrega. Não confiar no browser ou callback de redirecionamento para confirmar pagamento.
**Personalização:** peça elegível do catálogo → quantidade permitida → texto de ideia → WhatsApp → viabilidade, valor e prazo acordados com Marina. Não inserir pedido personalizado no checkout normal por inferência.
**Estados mínimos preservados:**
- Drop: rascunho / agendado / publicado / encerrado; liberar somente quando data E aprovação permitem.
- Produto: rascunho / futuro / disponível / reservado / esgotado / arquivado; unidade única impede overselling.
- Pedido: criado / aguardando pagamento / pago / cancelado / reembolsado / enviado / entregue.
- Pagamento: iniciado / pendente / aprovado / recusado / expirado / estornado.
- Personalização: solicitação gerada / atendimento externo.
**Incidentes:** múltiplas peças no pedido devem reservar em conjunto; Pix pendente não libera antes da política de expiração; aprovação tardia exige reconciliação; cancelamento/chargeback não repõe cegamente após expedição; horários no banco em UTC com apresentação America/Sao_Paulo.
**Ponto M2:** redução manual Woo duplicada não diminuiu estoque duas vezes, mas cancelamento manual **não repôs** unidade. Não confundir com fluxo nativo do checkout, ainda sem prova. Reposição/expiração viram gate explícito.

## 05. Contratos de dados, CMS e drops
**Identidade:** Sanity product.productId = WooCommerce product.sku (mesmo valor imutável, não título nem slug). Uma peça = SKU único não reutilizável. Sanity é autoridade de descrição, fotos, direitos, alt, categoria, tags, coleção, ordem, elegibilidade, aprovação e texto. WooCommerce candidato exclusivo para price, status comercial, quantidade, reservas, pedidos e financeiro. Falha, duplicação de SKU, moeda divergente, ausência de preços ou de estoque transacional devem bloquear oferta comprável. Não usar priceAmount/stockStatus editorial no cálculo de valores reais.
**Contrato editorial mínimo preservado:** id, slug, sku, nome, descrição, cuidados/material confirmados, category/collection/drop_id/sort_order, imagens/licenças/alt, publish_at/status, personalizável/modelos autorizados, revisão/aprovação. 
**Contrato comercial obrigatório:** preço BRL real, quantidade real, preço de transação, estados de estoque e reserva, peso/dimensões embaladas, impostos/condições fiscais, order_id e referência de pagamento; dados ligados por SKU. Checar servidor a cada compra, cache editorial não equivale a estoque em tempo real.
**Estado atual Sanity:** productType inclui productId, priceAmount e stockStatus; collectionType não tem calendário nativo de drops. Criar migração editorial de campos de drop somente após decisão da plataforma, com compatibilidade e sem mexer no Sanity production agora. Não criar painel novo.
**Sanity dataset público:** documento publicado, ainda que publicationStatus=pending, é acessível por API; manter não aprovado como draft real, não inserir segredos, endereços nem pedidos no CMS.
**Adaptador M2:** src/lib/commerce/m2Contract.mjs e wooRead.mjs, incluindo reconcileCatalogReadOnly para projeção e divergências sem escrita remota; consulta REST Woo somente server-side com HTTPS, Basic Auth e credenciais externas ao GitHub; não há API de compra nem sincronização bidirecional. Sincronização definitiva e reconciliação entre painel editorial/comercial continuam a desenhar.

## 06. Rotas e contratos visuais (V2 prevalece)
| Rota | VIS/contrato | Obrigação de implementação | Pendente |
|---|---|---|---|
| / | VIS-01/VIS-02 | Hero aprovado, 9 peças e banner de personalizados; não inserir newsletter/favoritos inferidos de mockup. | Dados reais, vídeo autorizado. |
| /loja | Vitrine atual | Filtros, busca, ordenação e estoque reais; não redesenhar. | Dados completos, QA. |
| /colecoes e /colecoes/:slug | Coleções | Drops existentes, períodos e peças; sem promessas falsas. | Regras e agendamento. |
| /categoria/:slug | VIS-08 | Grid, tags e sequência conforme aprovação; fonte única. | Conciliação de catálogo real. |
| /produto/:slug | VIS-03/VIS-04 | Fotos, estoque real, quantidade 1 e compra, estados indisponíveis. | BFF e checkout. |
| /encomendas | Coleção personalizável | Somente peças elegíveis e CTA para atendimento. | Catálogo elegível. |
| /personalizar/:slug | VIS-05 | Modelo existente + descrição + WhatsApp. | Dados e telefone autorizado. |
| /manifesto | VIS-06/VIS-07 | Conteúdo confirmado, editorial e responsivo. | Texto/ativos Marina. |
| /carrinho, /checkout | COMPLEMENTAR | Reserva/validação server-side/frete/pagamento; design novo sujeito a aceite. | Bloqueador de UI comercial. |
| /pedido/:id ou rota do provedor | COMPLEMENTAR | Mostrar status verificado sem expor terceiros. | Segurança/UX. |
| /privacidade e políticas | COMPLIANCE | Texto revisto para comércio eletrônico. | Jurídico/Marina. |

**Globais:** geometria do header/logotipo, link Loja/Coleções/Encomendas/Sobre e footer com ilustração, políticas reais; ícone de conta só se autenticação aprovada. Todos os CTAs apontam para destino legítimo, sem hash decorativo ou simulação rotulada como realidade.
**Media:** poster/hero com vídeo autorizado, lazy loading contextual, WCAG 2.2 AA, pausa/reduced motion; imagens próprias e direitos verificados.

## 07. Plataformas e viabilidade financeira
**Astro + Sanity + Woo:** permite reproduzir a interface; reutiliza componentes da fundação e Sanity da Marina. Custa hospedagem WordPress/PHP e banco, camadas seguras de API, pagamento, logs, backup, manutenção e testes de concorrência. M2 confirmou somente contrato/estoque básico; risco operacional ainda ALTO.
**Nuvemshop:** plataforma comercial consolidada com gestão integrada; pode ser mais simples para Marina. Integrar Astro headless, preservar Sanity como autoridade editorial e respeitar checkout da plataforma é HIPÓTESE, não prova; edição de código e limitações de template precisam de teste. SKU por variante/estoque pela API documentados; ações administrativas e taxa podem diferir conforme plano.
**Shopify:** alternativa do original, sem prova M2; tarifa USD, condições brasileiras, fidelidade e custos a confirmar.
**Front próprio + motor externo:** liberdade editorial máxima, esforço/risco superior; só se duas primeiras falharem.
**Custos 12/24 meses com preços públicos 20–21/10/2026:** Nuvemshop Essencial mensal R$69 → R$828/12 e R$1.656/24; Impulso mensal R$164 → R$1.968/12 e R$3.936/24. Plano anual muda valores; taxas Pix/cartão, app, frete, domínio e custo inicial NÃO incluídos. Woo base não exige licença, mas TCO depende de cotações: 12× e 24× (hosting + manutenção + plugins/integrações) + implantação + taxas + domínio + backup. Sanity Growth Trial/Free, cotas e upgrade precisam de revalidação sem contratação.
**Resultado M2:** não há vencedor. Critérios definitivos: concorrência SKU1; checkout, frete, Pix/cartão e reservas; fidelidade VIS; simplicidade de operação Marina; controle de titularidade; TCO fechado 12/24m.

## 08. Contrato de infraestrutura e GitHub First
- DNS próprio da Marina e TLS válido, redirecionamentos sem apontamentos órfãos; prévia de agência separada do site final.
- Astro é interface; Sanity CMS aprovado editorialmente; motor comercial deve ficar atrás de servidor/BFF autenticado e transacional. GitHub Pages isolado não serve para pedidos reais.
- Nenhuma credencial Woo/Sanity de escrita, dados pessoais, cartões, gateway ou segredo no JavaScript público ou GitHub. M2 gerou credenciais descartáveis apenas no runner.
- CI: testes, tipagem/schema, lint ou sintaxe, build sem deploy. Workflow experimental acionado pela alteração do próprio workflow, não a cada documentação.
- Homologação isolada, noindex + controle de acesso verdadeiro; backup e restauração exercitada antes da produção.
- PRs #1/#2 abertos em draft, main/gh-pages preservadas, sem deploy ou merge M2.
**Prova atual:** Actions [CI leve](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39613612849) e [Woo efêmero](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39614461523) concluídas. Evidência com limitações em [M2](M2_PROVA_TECNICA_ECOMMERCE.md).

## 09. Pagamentos, frete e logística
**Pagamento:** processador selecionado com titularidade Marina, Pix/cartão homologados, cálculo integral servidor (preço, frete, total), verificação de webhook por assinatura/origem documentada, idempotência em base durável, eventos fora de ordem e atraso conciliados, estorno/reembolso/chargeback documentados. Nenhum número/CVV armazenado pela loja. Retorno visual não comprova pagamento aprovado. Checkout e conta recebedora ainda NÃO TESTADOS.
**Correios:** avaliar módulo de plataforma/intermediador vs APIs contratuais; confirmar origem, caixa com proteção cerâmica, peso/dimensões embalados, múltiplas unidades, seguro/avaria, forma de postagem, prazo e rastreio. CEP e indisponibilidade do serviço precisam de estados acessíveis e impedimento de cobrança com frete não cotado. Teste real BLOQUEADO por falta de credenciais/contrato/fornecedor decidido.

## 10. Segurança, LGPD, fiscalidade e operação comercial
Direitos do consumidor, informações do fornecedor, preço+frete claros, atendimento, arrependimento/trocas/devoluções, avaria, privacidade e políticas sob revisão apropriada (Decreto 7.962/2013). Não declarar exceções de produtos personalizados sem jurídico. Definir controlador/operadores, retenção, canal LGPD, cookies/pixels, minimização de dados, retenção de logs e segurança de administração. Fiscalidade e NF/pessoa física-jurídica por contador. Nada validado por M2 transacional. Sanity não pode armazenar pedidos nem dados privados no dataset público.

## 11. Performance, WCAG e QA visual
WCAG 2.2 AA aplicável; HTML semântico, foco visível, teclado, labels, feedback e erro de checkout; vídeos com poster/pausa e reduced motion; fotos comprimidas e responsivas, fontes com licenças. Core Web Vitals medidos em homologação e p75 somente com dados reais; SEO com URLs estáveis, sitemap, Product/Offer estruturados APENAS dados comerciais verdadeiros. Nunca usar preço/review/estoque de mockup.
Comparar implementação em viewport e dataset equivalentes à prancha VIS; lado a lado/sobreposição/regressão classificada e aceite final Matheus. A M2 NÃO executou QA visual.

## 12. Marcos M0–M7 (gates preservados)
| Marco | Entrega | Gate |
|---|---|---|
| M0 Escopo | Aditivo, responsabilidades, custos e páginas complementares | Math Brands/Marina concordam |
| M1 Materiais | Paleta, logo, fotos/licenças, vídeo, produtos reais, política de frete | Matheus valida |
| **M2 Prova** | Astro/Sanity/Woo mínimo, testes estoque1, pagamentos/frete em sandbox e alternativa Nuvemshop | **PARCIAL; bloqueio checkout concorrente e cancelamento** |
| M3 UI | Layouts V2, componentes, catálogo e Manifesto | QA VIS desktop/tablet/mobile |
| M4 Motor | Gestão drops, admin, reserva, pedidos, checkout, frete e pagamentos | Concorrência e falhas reais |
| M5 Homologação | Sandboxes autorizados, políticas, segurança, WCAG, backup/restore | Marina e equipe |
| M6 Publicação | DNS/HTTPS em conta Marina, release controlado, rollback | Autorização expressa |
| M7 Entrega | Guia, transferência, treino drop, suporte | Marina opera sem programador |

## 13. Testes de bloqueio à publicação
- P0: duas compras concorrentes do mesmo SKU unitário; só uma ganha, sem venda duplicada.
- P0: reserva/pagamento Pix pendente/recusado/aprovado fora de ordem, expiração/reversão, reembolso.
- P0: webhook real validado e armazenado com idempotência; sem pedido em duplicidade.
- P0: frete CEP válido/inválido/serviço indisponível, peso/caixa e seguro.
- P0: conteúdo pendente sem oferta, drop fora de horário indisponível.
- P0: checkout acessível teclado/mobile, sem erro crítico e com dados reais confiáveis.
- P0: TLS válido, backup restaurado, fornecedor/contratos LGPD e domínio Marina, autorização de produção.
- M2 comprovou parte do SKU e da redução; **os cenários acima continuam pendentes**.

## 14. Pendências e responsáveis (originais preservados)
| Entrega/decisão | Responsável | Bloqueio |
|---|---|---|
| Paleta, fontes, marca, fotos e direitos | Marina + direção criativa | UI final |
| Vídeo artesanal e Manifesto validado | Marina / Math Brands | Conteúdo |
| Drops reais: SKU, datas, preços, 1 unidade | Marina | Catálogo transacional |
| Peso, embalagem, frete, avarias, origem | Marina | Checkout |
| Personalizados: peça única ou modelo reproduzível | Marina | Estoque e fluxo |
| Meio de pagamento, titularidade e testes sandbox | Marina + engenharia | Transações |
| Plataforma, custos 12/24m, hospedagem | Math Brands + Marina | Decisão arquitetura |
| Telas novas carrinho/checkout | Matheus | Aceite visual |
| Termos/privacidade/fiscalidade | Marina + jurídico/contador | Publicação |
| DNS/domínio/autorização | Marina | Produção |
| Concorrência, reserva e cancelamento reprovado M2 | Engenharia/QA | M4/M5 |
| Sanity/Woo autoridade SKU e manutenção dupla | Engenharia + Marina | Operação |
| QA, logs, backups, HTTPS e suporte | Engenharia/QA | Publicação |

## 15. Entrega e responsabilidades
**Math Brands:** implementar escopo contratado, conservar fielmente V2, executar QA e homologação, preparar integração sob titularidade e decisão Marina, documentar operações, recuperação e código. **Marina:** fornecer materiais/dados verdadeiros, aprovar custos/provedores/políticas, administrar drops, expedição e atendimento. **Fornecedores:** planos, disponibilidade e termos próprios.
**Critério de sucesso do V3 original:** Marina publica drop de peça real, cliente conclui pagamento seguro, sem oversell, recebe cotação/confirmação confiáveis, personalização por WhatsApp, interface fiel. **Não demonstrado ainda na M2.**

## 16. Matriz de reaproveitamento (adendo pós-M2)
| Origem | Reuso aprovado para experimento | Dependência |
|---|---|---|
| PR #1 / Astro | Shell/componentes Header/Footer/ProductCard/HeroMedia, catálogo/rotas, testes | Layout não homologado visualmente nesta M2 |
| PR #1 / Sanity | Studio, schema product/category/collection, leitura pública aprovada, guardas editoriais | Não alterar dataset production |
| PR #2 / Protótipo A | Referência comparativa de UI; dados e fotos somente demonstração | Não misturar branches ou dados fictícios produtivos |
| M2 / m2Contract.mjs | SKU, moeda/centavos, estados de drops, fail-closed | Preview não transacionável |
| M2 / wooRead.mjs | Leitura Woo REST server-only com injeção de fetch | BFF, autorização e infraestrutura ainda ausentes |
| M2 / PHP runner | Observação de Woo real efêmero: preço e redução | Real checkout concorrente ainda não provado |
| V2 / VIS | Fonte de verdade visual | Medição original e validação Matheus |

## 17. Histórico das alterações versus original de 20/10/2026
- 01–03: status M2 e preservação da mudança de escopo/aditivo.
- 04–05: explicitação de autoridade por campo e incerteza da reposição do estoque.
- 06: rotas e componentes sem mudanças criativas; complementares continuam pendentes.
- 07: custos 12/24m, Sanity mantido e comparação sem vencedor.
- 08–11: HTTPS/segurança server-only, privacidade, Correios, visual QA e restrições de credenciais.
- 12–14: marcos e gates agora ancorados em workflows, não em intenções; novos bloqueadores Woo.
- 15: responsabilidades mantidas; critério de sucesso ainda NÃO ATINGIDO.
- 16–17: novos anexos de reaproveitamento e rastreabilidade.
**Não eliminamos requisitos da V3 original.** Referências F1–F11 continuam válidas como fontes históricas; preços podem mudar e devem ser cotados novamente.

### Fontes originais preservadas (F1–F11)
F1 https://www.nuvemshop.com.br/planos-e-precos ; F2 https://atendimento.nuvemshop.com.br/pt_BR/dominios/como-usar-um-dominio-proprio-na-nuvemshop ; F3 https://www.nuvemshop.com.br/planos-e-precos ; F4 https://www.shopify.com/br/precos ; F5 https://woocommerce.com/document/configuring-woocommerce-settings/products/ ; F6 https://www.mercadopago.com.br/developers/pt/reference/online-payments/checkout-pro-orders/overview ; F7 https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/payment-notifications ; F8 https://www.correios.com.br/atendimento/developers/manuais/manual-api-preco-1 ; F9 https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm ; F10 https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-sobre-seguranca-da-informacao-para-agentes-de-tratamento-de-pequeno-porte ; F11 https://developers.google.com/search/docs/appearance/structured-data/product?hl=pt-br .

**Gate final:** esta V3 é consolidação técnica **não é autorização de produção, não aprova tecnologia definitiva e não altera o design.**
