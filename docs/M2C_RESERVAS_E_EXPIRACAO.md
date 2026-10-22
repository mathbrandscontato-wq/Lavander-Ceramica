# MATH BRANDS | LAVENDER CERÂMICAS — M2c: RESERVAS E EXPIRAÇÃO
**Data:** 22/10/2026 · **Branch:** experiment/m2c-stock-reservation-expiry · **Base:** aa51a357 (M2b/PR #4).
**Status:** **PASSOU** na prova delimitada de reservas nativas WooCommerce. **Não homologou pagamento, cron de cancelamento, Sanity ou publicação.**

## Ambiente e evidência
WordPress/PHP, WooCommerce real, MariaDB em containers efêmeros no GitHub Actions, sem rede externa além da instalação do plugin, dados reais ou pagamento. SKU fictício M2C-RESERVA-001, estoque único 1, backorders proibidos, venda individual, `woocommerce_hold_stock_minutes=1`. Em vez de adulterar relógio/banco, esperou-se **67 segundos reais**. O teste rodou via WP-CLI, com funções nativas Woo `wc_reserve_stock_for_order`, `wc_get_held_stock_quantity` e `WC_Order::update_status`. É prova de **reserva em pedido pending**, não repetição do checkout HTTP da M2b.

**Evidência:** [Actions 39860801388 — PASSOU](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39860801388). Artefato de evidências `m2c-woo-reservations` com retenção de cinco dias; código em `tests/m2c/reservation-expiry.php`.

## Matriz de resultado verificável
| Cenário | Estado | Resultado |
|---|---|---|
| Reservar peça SKU1 e manter estoque físico | PASSOU | held=1, estoque físico=1 |
| Segundo pedido pending tenta reservar a mesma peça | PASSOU | Rejeitado: `woocommerce_product_not_enough_stock` |
| Cancelamento do primeiro pedido | PASSOU | held passa a 0 |
| Cancelamento repetido | PASSOU | held continua 0 |
| Nova reserva pelo pedido seguinte | PASSOU | held=1 |
| Reserva de 1 minuto expirou após 67s | PASSOU | held passou a 0 sem alterar estoque físico |
| Pedido antigo continuou pending após expiração | COMPROVADO, risco P0 | `expired_order_still_pending=true` |
| Novo pedido reserva a unidade após expirar | PASSOU | held=1 |
| Cancelar pedido antigo não libera reserva atual | PASSOU | hold do novo pedido permanece 1 |
| Limpeza e encerramento | PASSOU | held=0 e estoque físico final=1 |
| Execução real do WP-Cron cancelando pedidos vencidos | NÃO EXECUTADO | Expiração da **reserva** ≠ cancelamento automático de pedido |
| Webhook Pix atrasado após expiração/segundo comprador | BLOQUEADO | Sandbox autorizado não disponível |
| Cotação Correios | BLOQUEADO | Contrato e parâmetros de embalagem não confirmados |
| Painel Marina/Sanity→Woo fim a fim | NÃO EXECUTADO | Produção preservada |

**Achado crítico:** WooCommerce pode liberar uma reserva vencida mesmo que o pedido anterior continue em `pending`. Em pagamentos reais, deve existir conciliação explícita entre confirmação do gateway, estado do pedido, reserva/estoque e política de restituição. Não aceitar confirmação atrasada cegamente, sob risco de venda duplicada. Esta prova NÃO demonstrou que o WooCommerce faria uma venda duplicada, nem provou que um WP-Cron falhou.

## O que M2b já havia comprovado e não foi reexecutado
Três rodadas HTTP Store API com dois compradores independentes: um `on-hold` e um HTTP 403 sem estoque, sem dois pedidos comerciais ativos; cancelamento nativo e recompra; preço adulterado devolveu HTTP 409. Ver [M2b Actions 39701256935](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39701256935). BACS offline fictício **não confirma Pix/cartão**.

## Bloqueadores e próximos gates
- **A estoque:** passou para os ensaios M2b/M2c em Woo isolado; novo teste sob gateway e escala será exigido.
- **B pagamento:** bloqueado, requer sandbox Pix/cartão, webhooks autenticados, idempotência durável, eventos fora de ordem, expiração e pagamento tardio.
- **C frete:** bloqueado por falta de contrato Correios/integrador, embalagem/peso/origem.
- **D administração:** não executado; rotina da Marina entre Sanity editorial e Woo comercial (ou Nuvemshop) ainda precisa ser validada.
- **E design:** checkout/carrinho adicionais sem aceite visual.
- **F produção:** não autorizado. **Sem merge, deploy ou alteração de Sanity.**

## Comparação e decisão
A Nuvemshop foi confrontada apenas documentalmente em [M2C_PAGAMENTOS_FRETE_PLATAFORMAS.md](M2C_PAGAMENTOS_FRETE_PLATAFORMAS.md), com preços e limitações verificadas em 22/10/2026. Sem loja de ensaio, ela não deve ser considerada inferior. Woo tem provas empíricas pontuais; custo total de PHP/DB/BFF, suporte, backup e gateway não está cotado. **Arquitetura definitiva ainda não escolhida.**

## Continuidade
1. Validar por teste isolado o scheduler Woo para cancelamento de `pending` e comparar com expiração da reserva (são eventos diferentes).
2. Executar sandbox Pix/cartão sob permissão e chaves de teste em segredos do runner, jamais versionados; reproduzir confirmação tardia, webhook duplicado e reordenado.
3. Simular falha de cotação em ambiente de frete autorizado e confirmar parâmetros de embalagem.
4. Fazer piloto Nuvemshop autorizado com estoque unitário, drops, checkout, integração Sanity/Astro, UX e custo total 12/24m.
5. Somente após gates, aprovar novas telas, infraestrutura e publicação.

**Rastreabilidade:** `.github/workflows/m2c-reservations.yml`, `tests/m2c/compose.yaml`, `tests/m2c/reservation-expiry.php`. Todos os dados de produção, PRs #1–#4 e VIS aprovados foram preservados.
