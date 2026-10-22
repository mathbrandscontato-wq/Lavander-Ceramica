# MATH BRANDS | LAVENDER CERÂMICAS
## M2e — Auditoria de entrega de eventos WP-Cron e prontidão para homologação comercial
**Data:** 22/10/2026. **Natureza:** laboratório real WordPress/WooCommerce/MariaDB descartáveis em GitHub Actions. **Status do novo gate:** **FALHOU** — entrega agendada por HTTP NÃO comprovada.
**Base:** PR #6 M2d, commit `e07aacefd16755dd74183a1cc2523190f7ce95f8`. Fonte de design V2/VIS e V3 original preservadas.

### 1. Contexto — evidência anterior não revogada
- M2b [39701256935](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39701256935): compras concorrentes na Store API, cancelamento e recompra com BACS fictício PASSARAM dentro do laboratório.
- M2c [39860801388](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39860801388): reserva pending SKU1, cancelamento e expiração natural após 67 s PASSARAM.
- M2d [39862947526](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39862947526): **manipulador** `woocommerce_cancel_unpaid_orders`, acionado diretamente via WP-CLI e `do_action`, cancelou pedido elegível vencido, preservando o recente e o administrativo. Isso **NÃO** provou WP-Cron ou Action Scheduler espontâneo.

### 2. Nova tentativa M2e e resultados
WP/Woo real efêmero, peça fictícia, preço fictício, estoque 1, reserva pending de 1 minuto, pedido com `created_via='store-api'` **simulado**. Um evento `woocommerce_cancel_unpaid_orders` foi agendado via API real do WordPress (`wp_schedule_single_event`) para 75 s depois. Após 79 s de relógio real, duas ordens de controle foram criadas; uma requisição HTTP ao `wp-cron.php` tentou entregar o evento, sem chamada manual ao handler. Verificação Woo via WP-CLI avaliou o estado persistido.

| Run | Status | Evidência |
|---|---|---|
| [39864739239](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39864739239) | **FALHOU** | URL usava identificador `doing_wp_cron` sem lock correspondente; evento permaneceu na fila. Falha do procedimento de teste identificada. |
| [39865109396](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39865109396) | **FALHOU** | URL corrigida para `wp-cron.php` sem identificador manual; evento ainda persistiu e ordem stale ficou pending. |
| [39865516385](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39865516385) | **FALHOU** | Diagnóstico de eventos e transient de lock; evento devido em 22:32:40 UTC ainda listado às 22:32:47 UTC após chamada HTTP. Pedido permaneceu pending. |

**Constatações da terceira tentativa:** `wp_next_scheduled` retornou um evento devido; antes da chamada, `doing_cron` tinha valor definido. O lock foi limpo **somente no contêiner efêmero**, mas a chamada HTTP ainda não processou a fila. A causa final **NÃO FOI DETERMINADA**. Pode envolver corrida de locks, bootstrap WP, comportamento de cron/servidor ou configuração do harness; não imputar defeito ao WooCommerce sem isolar a causa. O protocolo de teste programou o evento via fixture: ele **não** demonstra agendamento automático iniciado pelo Woo, apenas uma tentativa de entrega WP-Cron por HTTP.

### 3. Matriz M2e
| Cenário | Estado verificável | Implicação |
|---|---|---|
| Evento cron registrado e com vencimento real | **PASSOU** | Registro persistido, horário de vencimento observado. |
| Requisição HTTP local a `wp-cron.php` respondeu | **PASSOU (transporte)** | HTTP 2xx por si só não prova execução. |
| Evento de cancelamento consumido na fila | **FALHOU** | Continuou presente após requisição. |
| Pedido pendente vencido cancelado pelo cron HTTP | **FALHOU** | Permanecia pending. |
| Reserva vencida reconciliada por agendamento HTTP | **NÃO COMPROVADO** | M2c observou expiração natural do hold, não cancelamento agendado. |
| Pedidos novos/admin preservados | **PASSOU** | Permaneceram pending, mas sem cancelamento do antigo. |
| Ação nativa Woo via WP-CLI (M2d) | **PASSOU anteriormente** | Não substitui prova do scheduler. |
| Action Scheduler autônomo ou cron de servidor em hospedagem real | **NÃO EXECUTADO** | Host definitivo ainda não escolhido. |
| Pix, cartão, webhook real e Correios | **BLOQUEADO** | Sem sandboxes/contratos autorizados. |

### 4. Bloqueador, correção recomendada e decisão
**P0-Gate scheduler:** não confiar em WP-Cron como única forma de cancelar pedidos pendentes. Antes da publicação, desenvolver uma prova mínima específica com diagnóstico de bootstrap, logs PHP do wp-cron, locks transitórios, callbacks efetivamente inscritos, `wp cron event run` como controle de diferenciação e teste do Action Scheduler nativo **sem alegar sucesso antes de rodar**. Em homologação, definir tarefa cron explícita no servidor compatível; medir tempo efetivo de execução e detectar fila atrasada. Não desativar tarefas nem limpar locks de produção sem estratégia segura.
**P0-Gate pagamentos:** mesmo um cron confiável não resolve pagamento atrasado; exige gateway sandbox, webhooks autenticados, idempotência persistente e política de conciliação que impeça envio duplicado da mesma unidade.
**P0-Gate Correios:** integrador autorizado e dados reais de embalagem/cálculo continuam bloqueados.
**P1-Gate operacional:** comparar piloto Nuvemshop sem viés, manter Sanity e documentar rotinas da Marina, com custo total 12/24 meses.

### 5. Artefatos e preservação
- Workflow `.github/workflows/m2e-wp-cron.yml`; fixture/testes `tests/m2e/*`; cada run produziu artefatos sanitizados com retenção 5 dias.
- Checklist de dependências externas: [M2E_PREPARACAO_GATEWAY_FRETE_OPERACAO.md](M2E_PREPARACAO_GATEWAY_FRETE_OPERACAO.md).
- Sem merge, deploy, pagamento, contratação, edição do Sanity de produção ou alteração visual no Astro.
- Resultados FALHOU permanecem no GitHub; **não** declarar M2e aprovada por HTTP 200 ou por testes anteriores.

**CONCLUSÃO:** M2e detectou bloqueio real de entrega agendada no laboratório. Resolver isoladamente antes de decidir arquitetura comercial ou publicar.
