# MATH BRANDS / LAVENDER — CHECKPOINT PÓS-M2d (22/10/2026)
**Branch:** `experiment/m2d-pending-reconciliation`, base `d453d10709023e931e74b5532d2f8f107c7cfd67` (PR #5). **Commit final:** consultar HEAD da branch/PR draft. **Sem merge/deploy/Sanity produção**.

**PASSOU no laboratório:** [M2d Actions 39862947526](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39862947526): handler Woo cancela ordem `pending` vencida 68 s após criada, preserva ordem nova e origem admin, libera reserva, permite novo comprador e não remove reserva atual ao repetir handler. Espera real 68 s; produto/pedidos falsos. Origem `store-api` foi simulada com `set_created_via`; não executar outro checkout M2b por redundância.

**Limites:** o handler foi disparado manualmente via WP-CLI; WP-Cron/Action Scheduler autônomo NÃO foi provado. Política `manual_reconciliation_no_auto_fulfillment` após pagamento tardio foi simulada; nenhum evento do provedor real foi recebido. Cuidado: cancelar `pending` e expirar reserva são processos distintos; duplicidade/reordenação de webhook com pagamento Pix tardio continua sem teste real.

**Arquitetura candidata:** Astro + Sanity CMS editorial preservados; WooCommerce motor comercial candidato com estoque1, checkout offline, reserva e cancelamento comprovados apenas nos ensaios isolados. Nuvemshop candidata não executada; plataforma final SEM aprovação.

**Bloqueios:** Gate B pagamentos/autenticidade/webhook/idempotência; C Correios/cotação; D Marina/2 painéis; E checkout visual; F produção. Não há chaves comerciais autorizadas nem custos contratados.

**Arquivos adicionados:** `tests/m2d/{compose.yaml,unpaid-handler.php}`, `.github/workflows/m2d-unpaid.yml`, `docs/M2D_CANCELAMENTO_E_CONCILIACAO.md`, `docs/CHECKPOINT_POS_M2D.md`; aditivo em `docs/LAVENDER_V3_CONSOLIDADA_POS_M2.md`.

**Próxima prova com valor real:** autorizar uma sandbox de gateway (Pix/cartão + webhooks assinados), um integrador de Correios e um piloto Nuvemshop com custos e direitos de uso; executar agendador Woo sem gatilho manual. Conservar PRs anteriores e design VIS. **Não publicar sem autorização expressa.**
