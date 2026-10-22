# MATH BRANDS | LAVENDER CERÂMICAS — M2b VALIDAÇÃO TRANSACIONAL
**Emissão:** 21/10/2026 (logs de execução UTC 22/10) · **GitHub First** · **Somente laboratório isolado**
**Branch:** `experiment/m2b-transactional-validation` · **Base:** `experiment/m2-astro-sanity-woocommerce`, commit `b3018e0c0aa5982c41129fbfc8a2357de07be5f3`.
**Sem merge, deploy, Sanity de produção, dinheiro real ou conta da Marina.**

## 1. Veredito técnico
**M2b PARCIALMENTE COMPROVADA; GATE A de concorrência PASSOU no laboratório offline testado.**
Três disputas reais de checkout, com duas sessões Store API com Cart-Token independentes, revelaram somente um pedido ativo (`on-hold`) e rejeição do segundo (HTTP 403 `woocommerce_product_not_enough_stock`). Em todas as rodadas, estoque 1→0 sem negativo, cancelamento nativo devolveu 0→1; nova sessão conseguiu recomprar, total adulterado foi rejeitado (HTTP 409) e pedido válido voltou a `on-hold`. **Nenhum pagamento foi confirmado**: BACS offline fictício e resposta `payment_status=success` representam êxito no processamento do método offline, não liquidação bancária.

**Limite da evidência:** 3 rodadas não substituem ensaios de carga nem garantem proteção sob toda configuração de produção/gateway. O Woo e as opções reais ainda não foram homologados.

## 2. Ambiente, método e rastreabilidade
- Runner GitHub Actions Ubuntu com Node 22; WordPress PHP 8.3/Apache, MariaDB 11 e WooCommerce instalado no momento do teste (versão conferível nos logs).
- Contêineres e banco descartáveis; porta HTTP vinculada a 127.0.0.1; credenciais aleatórias geradas/mascaradas em runtime; dataset Sanity de produção **não acessado nem modificado**.
- SKU por rodada: M2B-UNICO-001/002/003, fictícios, BRL 149,90, estoque 1, `manage_stock=true`, `backorders=no`, `sold_individually=true`, produto virtual para não depender de frete.
- Store API **real** por `/?rest_route=/wc/store/v1/*` (WordPress efêmero sem pretty permalinks). Cart Tokens independentes, carrinhos com 1 unidade cada e duas chamadas POST /checkout lançadas via `Promise.allSettled` na mesma rodada, separadas por aproximadamente 201–352 ms de duração total de disputa.
- Método fictício `bacs` deixa encomenda em `on-hold`. Consultas WP-CLI/WooCommerce DB conferiram todos os pedidos, incluindo `checkout-draft` que **não** é uma venda válida.
- Após primeiro cancelamento nativo, novo comprador conseguiu executar checkout. O servidor rejeitou `expected_total=1` (HTTP 409 `woocommerce_rest_checkout_total_mismatch`); `expected_total=14990` foi aceito. Segundo cancelamento devolveu estoque a 1.
- O script verifica que a quantidade de pedidos `on-hold/processing/completed` por SKU nunca é maior do que 1 e que estoque não é negativo.

**Workflow final PASSOU:** https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39701256935
**Primeira prova com disputa PASSOU:** https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39700976006
**Evidências sanitizadas:** artefato `m2b-http-woo-evidence` do workflow final (5 dias de retenção).

## 3. Resultados observados, rodada a rodada
| Rodada | Dois checkouts simultâneos | Estoque após disputa | Cancelamento nativo | Recompra / preço adulterado | Estado |
|---|---|---|---|---|---|
| 1 | HTTP 200 on-hold + HTTP 403 sem estoque | 0 (inicial 1) | Reposição a 1 | Recompra 200; esperado falso 409; segunda reposição a 1 | **PASSOU** |
| 2 | HTTP 200 on-hold + HTTP 403 sem estoque | 0 (inicial 1) | Reposição a 1 | Recompra 200; esperado falso 409; segunda reposição a 1 | **PASSOU** |
| 3 | HTTP 200 on-hold + HTTP 403 sem estoque | 0 (inicial 1) | Reposição a 1 | Recompra 200; esperado falso 409; segunda reposição a 1 | **PASSOU** |

Os registros Woo indicaram um `checkout-draft` para a tentativa rejeitada; draft não constitui pedido comercial pago e foi excluído da contagem de vendas ativas. Ordem de chegada pode alternar entre A e B.

## 4. Conciliação da falha M2-03
Na M2 original, redução manual via `wc_reduce_stock_levels` seguida de cancelamento manteve estoque 0. Na M2b, o **fluxo nativo de checkout on-hold → cancelled** restaurou estoque para 1 em seis cancelamentos (um da primeira compra e outro da recompra por rodada). Assim, a divergência anterior decorre **do cenário manual observado**, sem comprovar defeito do checkout nativo. Ainda faltam expiração automática e reconciliação de pagamento tardio.

## 5. Matriz completa de testes
| Cenário | Status | Base verificável / limite |
|---|---|---|
| M2b-01A: dois carrinhos/sessões independentes via Store API | **PASSOU** | Cart Tokens diferentes nas três rodadas; POST HTTP real. |
| M2b-01B: máximo um pedido ativo e estoque não-negativo | **PASSOU** | 1 on-hold + 403 sem estoque, estoque 0, WP-CLI verificou. |
| M2b-01C: preço cobrado por servidor via `expected_total` | **PASSOU** | 409 no total falso; valor correto 14990 centavos aceito. |
| M2b-02A: cancelamento nativo e reposição | **PASSOU** | 0→1 em todas as rodadas, duas vezes por rodada. |
| M2b-02B: segundo comprador após cancelamento | **PASSOU** | Checkout 200/on-hold depois de liberação. |
| M2b-02C: reserva pendente e expiração via cron | **NÃO EXECUTADO** | BACS on-hold não equivale a pending com tempo de retenção; não simular cron para alegar prova. |
| M2b-02D: cancelamento duplicado idempotente, falha financeira, pagamento tardio | **NÃO EXECUTADO** | Exigiria casos novos/estado real de gateway. |
| M2b-03: mapeamento Sanity↔Woo SKU, indisponibilidade, atraso editorial | **PARCIALMENTE COMPROVADO** | M2 Node mocks e adaptação read-only já testados; **sem conexão real Sanity**. |
| M2b-04: falhas HTTP e proteção contra 2 pedidos ativos | **PASSOU** | HTTP 403 e 409 observados; invariantes conferidas no Woo. |
| M2b-04: duplicatas/replay de webhooks reais, timeout e reenvio | **NÃO EXECUTADO** | Sem gateway/endpoint autorizado. |
| M2b-04: isolamento de produção, artefatos e cleanup | **PASSOU** | Laboratório local com credenciais descartáveis, destruição de volumes e artefatos com 5 dias de retenção. |
| Pix/cartão em sandbox | **BLOQUEADO** | Sem credenciais/conta autorizada. |
| Frete Correios | **BLOQUEADO** | Sem serviço de cotação habilitado e dados das embalagens. |
| Nuvemshop em ambiente comparativo real | **NÃO EXECUTADO** | Sem loja de teste autorizada, não reprovar por isso. |

## 6. Histórico de tentativas e diagnósticos
As execuções preliminares **não** constituem prova de falha do estoque:
- [39700118424](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39700118424): resposta do carrinho sem Cart Token no caminho REST inicial.
- [39700345171](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39700345171): retorno HTML não-JSON/total ausente no endpoint com permalinks plain.
- [39700605359](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39700605359): retorno HTML 200 não equivalia ao JSON da Store API.
- [39700784389](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39700784389): rota REST corrigida, porém POST add-item retornou corretamente HTTP 201 e teste assumia apenas 200.
- [39700976006](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39700976006): três disputas HTTP passaram, cancelamento nativo restituiu estoque.
- [39701256935](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39701256935): teste completo com recompra e preço alterado passou.

Falhas de harness foram corrigidas apenas na branch isolada; nenhuma foi escondida, alterada retroativamente ou tratada como diagnóstico de defeito comercial.

## 7. Segurança e limitações
- WooCommerce continua candidato comercial para preço, estoque e pedidos; Astro visual e Sanity editorial preservados.
- O laboratório usou BACS fictício sem conta bancária; `on-hold` = aguardando pagamento e não comprovante de Pix/cartão.
- Não se validou webhook assinado, persistência/idempotência financeira, chargeback, confirmação tardia, nem condições de infraestrutura de produção.
- A reserva `checkout-draft` e a expiração automática do `pending` ainda precisam de teste específico, assim como concorrência com Pix pendente.
- As imagens Docker foram selecionadas por tags e o plugin por versão atual no runner, sem pinagem por digest; fixar versões antes de homologação final.
- O laboratório é restrito a loopback, sem HTTPS por ser descartável; produção exigirá TLS válido e BFF server-side com segregação de segredos.

## 8. Arquitetura e próximos gates
**Arquitetura candidata:** Astro + Sanity (conteúdo) + WooCommerce (dados comerciais) + camada server-side protegida. **Confiança técnica aumentou para moderada somente no GATE A em laboratório; recomendação final de plataforma CONTINUA EM ABERTO**.
**GATE A:** PASSOU para o cenário BACS/estoque unitário ensaiado; validar novamente com gateway efetivo e carga representativa antes da publicação.
**GATES B/C:** BLOQUEADOS (Pix/cartão e Correios).
**GATE D:** NÃO EXECUTADO (rotina Marina, dois painéis editoriais/comerciais).
**GATE E:** PENDENTE (checkout e novas páginas ainda não aprovadas visualmente).
**GATE F:** BLOQUEADO (produção sem autorização).

**Próxima etapa segura:** M2c com sandboxes e contas explicitamente autorizadas, Nuvemshop em ambiente comparável e teste real de expiração/retomada de pedido, antes de M4/M5. Não executar merge nem deploy.
