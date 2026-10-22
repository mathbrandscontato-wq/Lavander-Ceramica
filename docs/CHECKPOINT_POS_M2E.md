# LAVENDER — CHECKPOINT PÓS-M2e | 22/10/2026
**Branch:** `experiment/m2e-wp-cron-delivery` baseada no commit `e07aacefd16755dd74183a1cc2523190f7ce95f8` (M2d, PR #6). **HEAD atual:** consultar branch/PR draft; não inscrever SHA autorreferencial.

## Resultado real
**M2e FALHOU**: três runs de WordPress/WooCommerce real efêmero tentaram entregar um evento `woocommerce_cancel_unpaid_orders` agendado para 75 s depois via WP-Cron HTTP após aguardar 79 s. Evento persistiu, pedido stale permaneceu pending. [Runs 39864739239](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39864739239), [39865109396](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39865109396) e [39865516385](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39865516385). Causa final não isolada; lock observado, ajuste de URL e limpeza de lock efêmero não bastaram. Não classificar como defeito Woo nem homologar scheduler.

**M2d PASSOU** cancelamento via handler nativo disparado por WP-CLI; **M2c PASSOU** expiração natural de hold; **M2b PASSOU** checkout concorrente BACS fictício. Essas provas não comprovam entrega automática.

## Arquivos
Novos `tests/m2e/{compose.yaml,setup-cron.php,setup-controls.php,verify-cron.php}`, `.github/workflows/m2e-wp-cron.yml`, `docs/M2E_AUDITORIA_WP_CRON.md`, `docs/M2E_PREPARACAO_GATEWAY_FRETE_OPERACAO.md`, `docs/CHECKPOINT_POS_M2E.md`. Alterada somente V3 consolidada na branch, com aditivo sem perda de requisitos.

## Próximos gates
- P0: isolar execução WP-Cron/Action Scheduler com logs/cron runner e depois provar agendador real do host escolhido. Não repetir testes extensos até formular hipótese específica.
- P0: Pix/cartão sandbox, webhook autenticado, pagamento tardio, idempotência; **BLOQUEADO** por serviços externos.
- P0: Correios integrado e embalagens; **BLOQUEADO**.
- P1: piloto Nuvemshop e custo 12/24m, administração Marina e aceite visual do checkout.
**Tecnologia definitiva não decidida. Proibidos merge, deploy e alterações de produção.**
