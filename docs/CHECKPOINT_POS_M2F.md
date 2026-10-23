# LAVENDER | CHECKPOINT PÓS-M2f — 23/10/2026
**Branch:** `experiment/m2f-cron-diagnostics`, a partir de `d72a299bd51ec0692113f7253a3d655d065aff44` (PR #7). **HEAD final:** conferir no PR da M2f.

**PASSOU no laboratório:**
- [39933299909](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39933299909): cron HTTP simples efetivamente executado sem fallback CLI.
- [39933526052](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39933526052): evento WooCommerce de cancelamento via `wp-cron.php`, pedido vencido `cancelled`, recentes/admin intactos.
- Método: `DISABLE_WP_CRON=true` e limpeza de lock só no ambiente Docker descartável; agendamento via API WordPress e HTTP externo. Site URL local `127.0.0.1:8090` dentro do Docker é **suspeita consistente** de loopback interno falho, não causa única formalmente provada.

**FALHOU anteriormente:** M2e [três runs](M2E_AUDITORIA_WP_CRON.md); teste trivial M2f [39933022255](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39933022255). Falhas preservadas e explicadas; não reescrever histórico.

**Gates não encerrados:** cron real no host a contratar, gateway Pix/cartão e webhooks idempotentes/assinados, frete real Correios, experiência administrativa Marina, aceite do checkout e custos/contratos 12/24 meses. Ainda não publicar e-commerce.

**Arquivos:** `tests/m2f/{compose.yaml,cron-probe-plugin.php}`, `.github/workflows/m2f-cron-diagnostics.yml`, `docs/M2F_CRON_EXTERNO_VALIDACAO.md`, aditivo à V3 e este checkpoint. Configurações e MU plugin são exclusivos do laboratório, não integram código/site publicado.

**Preservação:** `main`, `gh-pages`, design V2/VIS, Sanity de produção e PRs anteriores sem alterações. Nenhum merge/deploy, gateway real ou transação financeira.
