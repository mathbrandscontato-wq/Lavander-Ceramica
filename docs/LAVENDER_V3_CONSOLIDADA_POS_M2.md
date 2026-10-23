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

---

# REVISÃO INCREMENTAL PÓS-M2b / M2c — 21/10/2026
**Controle:** anexo acrescido sem substituir as seções 01–17 ou o Plano V3 original de 20/10. Origem: [M2B_VALIDACAO_TRANSACIONAL.md](M2B_VALIDACAO_TRANSACIONAL.md) e [M2C_PAGAMENTOS_FRETE_PLATAFORMAS.md](M2C_PAGAMENTOS_FRETE_PLATAFORMAS.md). PR #3 permanece base de evidências, intacto.

## 18. Conclusões transacionais auditáveis
M2b executou três rodadas Store API com **duas sessões independentes (Cart Token)** competindo por uma única peça fictícia. Em cada rodada: um checkout HTTP 200 / `on-hold`, outro HTTP 403 com `woocommerce_product_not_enough_stock`, estoque real 1→0 e nunca negativo. O estado `checkout-draft` do segundo comprador **não constitui segunda venda**. Todos os resultados foram confrontados com ordens e estoque via WP-CLI/WooCommerce real.

Depois, pedido `on-hold` foi cancelado por transição nativa: estoque 0→1. Novo comprador finalizou uma encomenda `on-hold`; checkout com `expected_total=1` recebeu HTTP 409, enquanto o preço correto de 14990 centavos foi aceito. O cancelamento subsequente retornou a unidade ao estoque. Esse ciclo passou nas três rodadas. Evidência: [Actions 39701256935](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39701256935). Outro run de disputa inicial: [39700976006](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39700976006).

**Resolução do apontamento M2-03:** a M2 tinha observado estoque não reposto após redução de estoque **manual** seguida de cancelamento. Na M2b, a transição **nativa** de `on-hold` para `cancelled` recompôs o estoque em todas as rodadas (inclusive após recompra). Isso não demonstra que todas as variações futuras de fluxo financeiro terão o mesmo comportamento; reserva, expiração automática e pagamento atrasado continuam não executados.

**Sem pagamentos reais:** BACS foi usado exclusivamente como método offline de laboratório. `payment_status=success` no retorno da Store API representa o êxito do processamento deste meio offline; `on-hold` exige confirmação humana da transferência, não equivale a Pix aprovado.

## 19. Alteração de maturidade e arquitetura
A topologia candidata permanece:
- Astro = interface pública, componentes e layout V2/VIS, sem alterações criativas.
- Sanity = metadados editoriais aprovados; `productId` identifica SKU; produção intocada.
- WooCommerce = candidato de preço, estoque e pedidos; Store API comprovada **parcialmente** para BACS local.
- BFF = futura camada segura para autenticação, validação de valores, cotação de frete, erros e segredos; **ainda não implementada/homologada**.
- Nuvemshop = candidata não testada em conta real; sua ausência não constitui reprovação.

A confiança na hipótese de **proteção de SKU1 no WooCommerce configurado em laboratório** passou de baixa-moderada (M2) a **moderada** (M2b). A confiança na **escolha da plataforma final** continua **insuficiente**, dado o pagamento/frete não homologados, custo de manutenção e operação por Marina não testados.

**Contratos observados:** estoque `1→0`, não-negatividade, uma única encomenda ativa, rejeição HTTP 403 ao comprador concorrente, preço validado no backend através de `expected_total` com rejeição HTTP 409, recomposição de unidade com cancelamento nativo e recompra posterior. **Ainda não observados:** ordens com Pix pendente, assinatura de webhook, sincronização live Sanity→Woo, retenção por expiração, preço recalculado após atualização simultânea e Correios.

## 20. Finanças, frete e Nuvemshop — continuidade M2c
**Pagamentos B (gate): BLOQUEADO.** Necessária conta sandbox autorizada, API e integração de gateway Pix/cartão, webhook autenticado, persistência idempotente, notificação duplicada/fora de ordem e conciliação tardia.
**Correios C (gate): BLOQUEADO.** Necessária opção contratada/integrador autorizado, peso e dimensões embaladas, cálculo e erro de cotação, CEP fictício, seguro/avaria e rastreio real.
**Nuvemshop:** documentação oficial confirma catálogo, estoque e operação comercial; **não se testou** headless com Astro/Sanity, checkout e consistência visual. Comparação assimétrica não permite vencedor.
**Custos estimados apenas de mensalidades públicas Nuvemshop (21/10/2026):** Essencial R$69/mês → R$828 em 12 meses/R$1.656 em 24; Impulso R$164/mês → R$1.968 em 12/R$3.936 em 24. Descontos no anual, tarifas de transação, app, serviços, domínio, operação e implantação não inclusos. WooCommerce não tem cotação suficiente: TCO depende de hosting PHP/DB, BFF, manutenção, backups, ferramentas, taxa de gateway e suporte. Não afirmar custo zero.
**Decisão:** plataforma final, contratos e despesas continuam com Marina/Math Brands, sem contratação.

## 21. Gates atualizados para M3, M4 e M5
| Marco | Entrada mínima | Situação |
|---|---|---|
| M3 UI e catálogo | Pranchas VIS, assets oficiais, conteúdo confirmado; preservar header/footer e 9 peças | **A preparar;** V2 permanece fonte de verdade. |
| M4 motor comercial | Gate A demonstrado no laboratório; definir provedor, integração e revalidar estoque sob gateway; BFF seguro | **PARCIAL/BLOQUEADO** por gateway e plataforma. |
| M5 homologação | Sandbox Pix/cartão, frete, timeout/expiração, reversões, autenticação webhooks, Sanity→Woo, auditoria WCAG/QA | **BLOQUEADO** até contratos e contas autorizados. |
| M6 produção | Aceite Matheus/Marina, custo/contrato, domínio/HTTPS, backup testado, políticas e autorização expressa | **NÃO AUTORIZADO**. |

## 22. Pendências novas e responsáveis
| Prioridade | Pendência | Responsável | Evidência necessária |
|---|---|---|---|
| P0 | Pagamento Pix/cartão sandbox, expiração, confirmação tardia | Engenharia + Marina/fornecedor | Eventos assinados, idempotência e pedidos conciliados |
| P0 | Correios: cotação, erro/timeout e embalagens reais | Marina + Engenharia | Respostas autênticas e bloqueios em caso de falha |
| P0 | Mecanismo de reserva por tempo (pending/draft e WP-Cron) | Engenharia + QA | Teste de cron/retenção em Woo real |
| P1 | Validar painel Sanity e Woo para cadastrar drop e administrar pedido | Marina + UX/Engenharia | Tarefas reais de uso em ambiente de teste |
| P1 | Avaliar Nuvemshop com requisitos equivalentes | Eng./Comercial | Ensaio de design, SKU único, checkout e custo 12/24m |
| P1 | Congelar versões Docker/plugin e automatizar regressão | DevOps | Versões identificadas, CI repetível |
| P1 | Revisão visual checkout/carrinho/estados adicionais | Matheus | Pranchas complementares/aceite |
| P2 | Otimizações extras e monitoramento ampliado | Engenharia | Pós-validação de riscos P0/P1 |

## 23. Registro incremental de alterações
- Seções 01–17 da V3 pós-M2 preservadas integralmente.
- Acréscimo 18: resultados reais de checkout HTTP, cancelamento, recompra e valor falsificado, com limites claros.
- Acréscimo 19: confiança arquitetural ajustada e contratos comprovados versus pendentes.
- Acréscimo 20: continuidade M2c, fornecedores e custo temporal, sem decisão de plataforma.
- Acréscimo 21: atualização dos critérios de entrada dos marcos M3–M5 sem publicação.
- Acréscimo 22: matriz de responsabilidades e pendências P0/P1.
- Os PRs #1, #2 e #3, o Plano V3 original e o Sanity de produção foram preservados, assim como `main` e `gh-pages`.

**STATUS DA V3:** rascunho técnico consolidado pós-M2b; NÃO é autorização de merge, pagamento ou publicação.

---

# REVISÃO INCREMENTAL PÓS-M2c — 22/10/2026
**Documentos-base:** [M2C_RESERVAS_E_EXPIRACAO.md](M2C_RESERVAS_E_EXPIRACAO.md), [M2C_PAGAMENTOS_FRETE_PLATAFORMAS.md](M2C_PAGAMENTOS_FRETE_PLATAFORMAS.md). Não substituir a V3 original de 20/10, seções 01–23, PRs #1–#4 ou identidade visual VIS.

## 24. Evidência nova de reserva e expiração
WooCommerce real efêmero com SKU1, `pending`, prazo de 1 minuto. Primeira reserva held=1/estoque físico=1; segunda bloqueada; cancelamento libera; duplicata idempotente; após 67 segundos reais o hold expirou; outro pedido reservou a mesma unidade; cancelamento do anterior não liberou novo hold; final held=0/estoque=1. [Workflow aprovado](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39860801388).

**Risco P0:** pedido antigo permaneceu `pending` após a reserva expirar. Não foi executado WP-Cron de cancelamento nem webhook bancário tardio. Política de conciliação de pagamento/estoque deve ser testada e documentada. Não inferir overselling ou homologação financeira a partir de um hold.

## 25. Gates de continuidade
| Gate | Status | Próxima evidência |
|---|---|---|
| A: estoque1/hold | PASSOU somente em laboratório M2b/M2c | Regressão sob gateway final, escala e timeout |
| B: Pix/cartão e webhooks | BLOQUEADO | Sandbox com credenciais autorizadas, idempotência, pagamento tardio |
| C: frete Correios | BLOQUEADO | Cotação autêntica, origem, embalagens, falhas |
| D: Marina administrar drops/pedidos | NÃO EXECUTADO | Roteiro de tarefas em sistema comercial de teste |
| E: checkout e carrinho VIS | PENDENTE | Design aprovado expressamente |
| F: domínio/HTTPS/produção | NÃO AUTORIZADO | Contrato, backup, QA, liberação expressa |

## 26. Plataforma e custo
Comparação documental Nuvemshop atualizada em 22/10, com SKU/estoque API, temas Twig, NubeSDK e preços mensais anunciados de R$69 Essencial e R$164 Impulso. Custos nominais de assinatura 12/24 meses na revisão M2c, não incluem integração/serviços/taxas. WooCommerce requer orçamento de manutenção PHP/DB/BFF, backups e integrações. **Não há plataforma definitivamente aprovada.**

## 27. Histórico
Nova branch M2c acrescentou APENAS ensaio isolado, CI experimental, documentação de reserva e aditivos; o site, layouts, Sanity production, main, gh-pages e PRs anteriores permaneceram preservados. **Documento técnico não autoriza merge, contratação ou publicação.**

---

# ADITIVO M2d — CANCELAMENTO DE PENDENTES E CONCILIAÇÃO (22/10/2026)
**V3 original, pranchas VIS e seções 01–27 preservados.** Evidência: [M2D_CANCELAMENTO_E_CONCILIACAO.md](M2D_CANCELAMENTO_E_CONCILIACAO.md) e [Actions 39862947526](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39862947526).

## 28. Prova incremental M2d
WooCommerce real descartável, handler nativo `wc_cancel_unpaid_orders` acionado explicitamente via WP-CLI. Em 68 segundos reais, pedido fictício `pending` de origem marcada `store-api` foi cancelado e reserva liberada; pedido novo e pedido administrativo foram preservados; novo comprador reservou; segunda chamada não removeu nova reserva. **Não foi executado agendador autônomo nem checkout HTTP originando esse pedido na própria M2d.** M2b e M2c contêm provas anteriores e complementares. A regra de pagamento tardio foi testada como condição fictícia, **não representa webhook real**.

## 29. Política obrigatória de pagamento tardio (P0)
Depois que reserva expira, pedido pode permanecer pendente até executar handler do WooCommerce. O recebimento de pagamento atrasado deve exigir autenticação de webhook, reconsulta ao gateway, verificação de valores/moeda/titularidade, idempotência persistente e confronto entre status do pedido, unidade em estoque e reservas de outros compradores. Pedido já cancelado ou unidade realocada → **não permitir despacho automático**; conciliar e avaliar reembolso/atendimento. Sem prova Pix/cartão, não declarar fluxo homologado. Se não existir gateway autorizado, manter bloqueio de produção.

## 30. Gates e responsáveis pós-M2d
| Prioridade | Pendência | Responsável | Comprovação requerida |
|---|---|---|---|
| P0 | Gateway autorizado, webhook autenticado e idempotência durável | Engenharia+provedor+Marina | Teste completo sandbox |
| P0 | Pagamento tardio, duplicata, evento fora de ordem | QA+engenharia | Nunca despachar 2 compradores pela mesma unidade |
| P0 | Execução real agendada de cancelamento | DevOps+QA | Action Scheduler/WP-Cron dispara sem WP-CLI; logs, restart/retries |
| P0 | Correios, erro de frete e embalagens | Marina+engenharia | Tarifas, prazos e indisponibilidade do integrador |
| P1 | Gestão de drops na rotina da Marina | Marina+UX | Tarefas guiadas em ambiente homologado |
| P1 | Comparação Nuvemshop e TCO real | Engenharia+comercial | Piloto autorizado; 12/24m com cotações |
| P1 | Checkout/carrinho e responsividade VIS | Direção criativa+QA | Aceite visual registrado |

**Não houve alteração em main, gh-pages, Sanity de produção ou site oficial. A V3 continua sem autorização de merge/deploy.**

---

# ADITIVO M2e — WP-CRON HTTP (22/10/2026)
**Rastreabilidade:** [M2E_AUDITORIA_WP_CRON.md](M2E_AUDITORIA_WP_CRON.md), workflows [39864739239](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39864739239), [39865109396](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39865109396) e [39865516385](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39865516385). Preserva V3 original e seções anteriores.

## 31. Conclusão nova — agendamento ainda não confiável
Evento `woocommerce_cancel_unpaid_orders` registrado via `wp_schedule_single_event` para 75 s futuros; após 79 s reais, evento permaneceu na fila e o pedido antigo continuou `pending`, mesmo recebendo requisição ao `wp-cron.php` no ambiente descartável. Terceira tentativa demonstrou lock presente antes da chamada, mas sua limpeza no laboratório não resolveu; causa definitiva não isolada.
- **Status agendamento HTTP: FALHOU.** Não é possível afirmar defeito do WooCommerce; o laboratório pode ter configurado a entrega incorretamente.
- **Status handler nativo M2d: PASSOU**, porém acionado de forma explícita no WP-CLI. Os dois resultados não se contradizem.
- **Status Action Scheduler / execução autônoma em hospedagem real: NÃO EXECUTADO**.
- **Status pagamento tardio e estoque sob gateway real: BLOQUEADO**.

## 32. Novo gate P0
Antes da homologação comercial, exigir prova de scheduler funcional com logs, monitoramento e rotina de host compatível. Verificar lock, callbacks, entregas WP-Cron/Action Scheduler, tempo efetivo e recuperação de fila atrasada. Sem escolher hospedagem antes da comparação Woo/Nuvemshop e disponibilidade real do servidor. Se scheduler falhar, o pagamento tardio aumenta risco operacional; não autorizar produção.

**Arquivos acrescentados:** `tests/m2e`, workflow, auditoria M2e, checklist sandboxes e checkpoint. **Nenhum merge, deploy, contratação ou modificação em Sanity/produção.**

---

# ADITIVO M2f — CRON EXTERNO VALIDADO NO LABORATÓRIO (23/10/2026)
**Fonte:** [M2F_CRON_EXTERNO_VALIDACAO.md](M2F_CRON_EXTERNO_VALIDACAO.md) e [M2f Actions Woo](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39933526052). Seções anteriores e Plano V3 original preservados.

## 33. Resolução do bloqueio técnico M2e, sem extrapolação à produção
No Docker da M2e, eventos não foram consumidos em três tentativas de cron HTTP. M2f reproduziu o problema com evento mínimo e demonstrou uma solução operacional **apenas no laboratório**: desativação de tentativas automáticas de loopback via `DISABLE_WP_CRON`, limpeza de lock descartável e disparo HTTP externo de `wp-cron.php`. A execução simples PASSOU e o cancelamento Woo de pedido vencido PASSOU, preservando pedidos novos/admin. Hipótese mais forte: endereço de loopback inválido entre host e contêineres e locks temporários; não há prova de causa isolada única.

## 34. Gate do agendador revisado
- **Entrega HTTP externa no laboratório:** PASSOU.
- **Agendador confiável na infraestrutura comercial definitiva:** NÃO EXECUTADO; permanece **P0 antes de publicar**.
- **Reconciliação Pix e pagamento tardio:** BLOQUEADO sem sandbox; cron não constitui webhook/autorização financeira.
- **Frete Correios e painéis da Marina:** BLOQUEADO/NÃO EXECUTADO.

A hospedagem comercial deve suportar tarefas de sistema, monitoramento de jobs, restauração de backups e HTTPS; verificar compatibilidade antes de escolher tecnologia e antes de ativar cron do sistema. Não aplicar limpeza de locks como rotina produtiva.

**Status:** avanço experimental confirmado; o e-commerce ainda não está homologado para compras e publicação, e a plataforma final não foi escolhida.

---

# ADITIVO M2g — CONTRATOS FINANCEIROS E FRETE SEM CONEXÃO PRODUTIVA (23/10/2026)
Fonte: [M2G_CONTRATOS_PAGAMENTO_FRETE.md](M2G_CONTRATOS_PAGAMENTO_FRETE.md) e [Actions 39954937643](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39954937643).
**Não substitui V3 original ou aditivos anteriores.** Código M2g fica exclusivamente na branch experimental, sem checkout, endpoint, credencial, implantação ou alteração do Sanity.

## 35. Testes de contratos executados
A implementação de referência de segurança para assinatura Mercado Pago usa manifesto `id;request-id;ts`, HMAC-SHA256 e comparação em tempo constante, com casos negativos de entrada falsa e timestamp vencido. Políticas de pagamento rejeitam liberação automática da peça quando pedido cancelado, valor divergente, estado desconhecido ou SKU realocado. Validação de frete exige CEP de oito dígitos, peso e dimensões positivos e recusa preço não numérico/inválido.

**Evidência:** 56 testes Node passaram (9 novos M2g), sintaxe aprovada e build Astro sem problemas. O retorno para produtos simulados indica `autoFulfill:false` e `checkoutAllowed:false` deliberadamente. Não há chamadas HTTP reais a fornecedores.

## 36. Plataformas e controle de riscos
WooCommerce segue candidato comercial por provas anteriores de estoque, pedido e cron no laboratório; Nuvemshop não passou por piloto equivalente e continua opção válida. Preferir plugin oficial/estável do fornecedor sobre criar processador financeiro próprio, após avaliar compatibilidade, custos e segurança. Nenhum gateway homologado.
Pagamento real precisa de conta/sandbox autorizada, servidor HTTPS, credencial armazenada fora do repositório, consulta ao gateway, idempotência persistente, reconciliação de pagamento tardio e testes Pix/cartão. Frete real precisa de origem da Marina, dados de embalagem e conta/integrador autorizado. Sem isso: Gate B/C **BLOQUEADO**.

## 37. Aceites
Matheus valida checkout/carrinho complementares e fidelidade VIS; Marina valida fornecedor, cadastro comercial, origem, embalagens, estoque inicial, políticas e operação. CI local aprovado não implica aceite da cliente nem lançamento de loja.

---

# ADITIVO M3 — AUDITORIA RESPONSIVA DE PRÉVIA (23/10/2026)
Evidência: [docs/M3_QA_RESPONSIVO_PREVIA.md](M3_QA_RESPONSIVO_PREVIA.md), [GitHub Actions 39960395633](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39960395633).
**178 testes de navegador passaram, zero falhas**, sobre cinco páginas estáticas com dados falsos, nas larguras 320, 390, 768 e 1440px. Incluiu filtros, ordenação, galeria, abas, landmarks, links/âncoras, overflow e screenshots 390/1440. Artefato com dez capturas, retenção 7 dias, acesso privado no GitHub.

**Não equivale a aprovação visual:** o menu mobile é ainda um pseudo-elemento sem interação, as pranchas VIS ainda não são comparadas pixel a pixel e faltam arquivos originais de marca/peças. Carrinho/checkout continuam sem telas e operação homologadas. Esses quatro riscos estão registrados e atribuídos.

**Marco M3:** contrato técnico de prévia PASSOU; aceite visual, conteúdo/ativos, navegação acessível mobile e páginas comerciais PENDENTES. Não selecionar plataforma, mesclar branches ou publicar loja com base nessas capturas.

---

# ADITIVO M3b — NAVEGAÇÃO MOBILE FUNCIONAL EM PREVIEW (23/10/2026)
Fonte: [M3B_NAVEGACAO_MOBILE.md](M3B_NAVEGACAO_MOBILE.md), [Actions 39961453154](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39961453154).
A inconsistência mobile de navegação identificada na M3 recebeu proposta técnica reversível: botão Menu com `aria-expanded`, painel com quatro rotas existentes, controles touch/teclado e fechamento por Esc com devolução de foco. **198 verificações passaram, nenhuma falhou**, incluindo testes responsivos 320/390/768/1440px e capturas de prévia.
**A proposta ainda exige revisão visual de Matheus** antes de ser incorporada às telas aprovadas. Os conflitos VIS/B1 de composição mobile e o material visual definitivo continuam abertos. Não alterar elementos comerciais sem autorização; não há checkout, gateway, frete ou publicação nesta etapa.
