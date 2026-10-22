# MATH BRANDS | LAVENDER CERÂMICAS — M2d
## Cancelamento de pedidos não pagos, reservas e conciliação de pagamento tardio

**Data:** 22/10/2026 · **Branch:** `experiment/m2d-pending-reconciliation` · **Base:** `d453d10709023e931e74b5532d2f8f107c7cfd67` (M2c/PR #5)
**Escopo:** GitHub First, WooCommerce real somente em containers efêmeros, sem Codex, Sanity de produção, checkout produtivo, Pix, cartão ou Correios reais.

### Resultado e evidências verificáveis
**Workflow:** [GitHub Actions 39862947526 — PASSOU](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39862947526).
**Código:** `tests/m2d/unpaid-handler.php` e `tests/m2d/compose.yaml`, workflow `.github/workflows/m2d-unpaid.yml`. Artefato `m2d-unpaid-handler-results` retido por cinco dias.
**Contexto:** PHP/WooCommerce/MariaDB efêmeros, SKU e ordens fictícias, hold configurado em 1 minuto, intervalo de 68 segundos reais. A função **nativa** `wc_cancel_unpaid_orders` foi acionada pelo hook `woocommerce_cancel_unpaid_orders` via WP-CLI, no laboratório. **O WP-Cron/Action Scheduler automático não foi executado**. Sem manipular timestamps.

| ID | Cenário | Estado | Evidência |
|---|---|---|---|
| M2d-01 | Pedido `pending`, recente e elegível, antes de 1 min | **PASSOU** | Continua `pending` após chamada precoce do handler |
| M2d-02 | Pedido `pending` criado como `store-api`, depois de 68 s | **PASSOU** | `stale_status_after_native_handler=cancelled` |
| M2d-03 | Pedido `pending` criado recentemente | **PASSOU** | `fresh_status_after_native_handler=pending` |
| M2d-04 | Pedido `pending` com origem administrativa | **PASSOU** | `admin_status_after_native_handler=pending` |
| M2d-05 | Liberação da reserva ao cancelar | **PASSOU** | `stale_held_after_handler=0` |
| M2d-06 | Novo comprador reserva após cancelamento | **PASSOU** | `new_buyer_held=1` |
| M2d-07 | Acionamento repetido do handler | **PASSOU** | Pedido novo permanece `pending`, held permanece 1 |
| M2d-08 | Limpeza do laboratório | **PASSOU** | `final_held=0`, banco descartado |
| M2d-09 | Política conservadora para evento pago tardio | **PASSOU EM SIMULAÇÃO DE REGRA** | Para pedido cancelado: `manual_reconciliation_no_auto_fulfillment`; **não houve webhook** |
| M2d-10 | Agendador autônomo executa hook sem WP-CLI | **NÃO EXECUTADO** | Acionamento manual do hook não prova execução de scheduler |
| M2d-11 | Checkout HTTP cria pedido com origem `store-api` | **NÃO EXECUTADO NESTA ETAPA** | `set_created_via('store-api')` foi configurado artificialmente no teste; M2b testou checkout HTTP com método offline |
| M2d-12 | Pix/cartão e confirmação de gateway | **BLOQUEADO** | Provedor e sandbox autorizados indisponíveis |
| M2d-13 | Assinatura de webhook, duplicata, replay, evento fora de ordem | **BLOQUEADO** | Não validado contra provedor; não aceitar reducer de mock como prova |
| M2d-14 | Frete Correios e erro de cotação real | **BLOQUEADO** | Integrador, dados de embalagem e permissões pendentes |
| M2d-15 | Administração de drops Sanity/Woo e piloto Nuvemshop | **NÃO EXECUTADO** | Não alterar Sanity production nem criar loja contratada |

### Constatação sobre a arquitetura e risco P0
A M2c mostrou reserva expirada após 67 segundos enquanto o pedido anterior ainda estava `pending`; a M2d demonstrou que o handler nativo, **quando acionado**, cancela pedidos elegíveis já vencidos e libera o hold. A combinação reduz o risco de estoque bloqueado indefinidamente, mas **não estabelece uma garantia de entrega única quando Pix chega depois da expiração**.

**Contrato de segurança a exigir no checkout real:**
1. Receber notificação somente no endpoint server-side via HTTPS, validar assinatura com SDK/mecanismo oficial do provedor selecionado e consultar o recurso diretamente no gateway; não confiar no retorno do navegador.
2. Validar valor em centavos, moeda, beneficiário, identificador do pedido, status real e referência externa.
3. Usar controle transacional persistente de idempotência de eventos e reconciliar versões/duplicatas/ordens fora de sequência. Evitar escrever segredo em logs, Sanity público ou front-end.
4. Antes de `payment_complete` ou liberação para postagem, checar se o pedido original ainda é elegível e se estoque/unidade NÃO foi concedido a outro comprador.
5. Se pedido cancelado/expirado tiver pagamento tardio confirmado, **não marcar automaticamente como vendável nem enviar a peça**; registrar disputa para intervenção humana e definir reembolso, contato ou solução aprovada pela Marina.
6. Testar esta política em **sandbox real e com provider-specific webhook** antes da implantação. O ensaio de decisão simulada M2d não é produto nem garantia.

### Fontes externas oficiais
- WooCommerce: `wc_cancel_unpaid_orders` agenda chamadas e seleciona por `get_created_via()` para origens `checkout`/`store-api`; fontes criadas via admin/REST não são canceladas por padrão: https://woocommerce.github.io/code-reference/files/woocommerce-includes-wc-order-functions.html
- WooCommerce Checkout Store API: https://developer.woocommerce.com/docs/apis/store-api/resources-endpoints/checkout
- Mercado Pago: webhooks de teste/prod, validação da assinatura `x-signature` e reentregas: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks

### Arquitetura e riscos restantes
**WooCommerce:** mais evidência positiva para mecanismos nativos de hold e cancellation; decisão comercial ainda não autorizada. É necessária hospedagem PHP/DB, servidor/BFF, monitoramento, backups, suporte, política de retries e integração com provedor.
**Sanity:** CMS editorial existente e dataset de produção intocados, não usar como fonte de pagamentos ou estoque transacional.
**Nuvemshop:** candidata não ensaiada. A ausência de piloto não significa incompatibilidade; é necessário comparar fidelidade VIS, catálogo/drops, painel para Marina, checkout, frete e TCO em 12/24 meses, incluindo custos de integração.

### Gates para próxima fase
- **A estoque:** passou nas condições delimitadas de M2b, M2c e handler M2d, **não homologado com meio de pagamento produtivo**.
- **B pagamento:** BLOQUEADO; sandbox Pix/cartão, webhook assinado, confirmação tardia, idempotência e testes de estorno.
- **C logística:** BLOQUEADO; cotação Correios/autorizada, dimensões reais, indisponibilidade e prazo.
- **D uso pela Marina:** NÃO EXECUTADO; CMS, drops, estoque e pedidos com rotina validada.
- **E telas de checkout:** PENDENTE de aceite visual; preservar V2/VIS.
- **F produção:** NÃO AUTORIZADO.

**Decisão pós-M2d:** M2d aprovada no escopo experimental. A próxima etapa útil não é criar mais infraestrutura financeira simulada: é obter sandbox de um provedor autorizado, definir frete, fazer o piloto equivalente da Nuvemshop e formalizar custo/responsabilidade. Nenhuma contratação ou alteração comercial ocorreu.
