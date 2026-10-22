# MATH BRANDS / LAVENDER — CHECKPOINT PÓS-M2c
**Data:** 22/10/2026. **Branch:** experiment/m2c-stock-reservation-expiry; base `aa51a357e37aaf3c977362e37ac7a3501e07046c`. **Commit final:** consultar HEAD/PR draft (não há SHA autorreferencial).

**O que PASSOU:** [Woo efêmero — Actions 39860801388](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39860801388): reserva pending SKU1, segunda reserva negada, cancelamento e duplicata, 67s de expiração real, novo comprador reservado, cancelamento do pedido antigo sem liberar a reserva atual; held=0, estoque=1 ao final. M2b checkout HTTP concorrente/BACS/409 já havia passado em [39701256935](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39701256935).

**Risco novo COMPROVADO:** pedido original permanece `pending` após o hold expirar. Não equivale a venda duplicada; exige política de pagamentos tardios/expiração de pedido e teste do scheduler.

**BLOQUEADO:** Pix/cartão, webhooks assinados e idempotência persistente, Correios com contrato e embalagem. **NÃO EXECUTADO:** cron real cancelando pedido, pagamento tardio, piloto Nuvemshop, fluxo administrativo com Marina. **PENDENTE:** aceites visuais checkout/carrinho, contratos/custos e plataforma final.

**Arquitetura:** Astro + Sanity editorial preservados, Woo comercial permanece candidato com evidência limitada. Nuvemshop também candidata; preços públicos revisados em 22/10. Não selecionar por assimetria de provas.

**Arquivos:** `tests/m2c/{compose.yaml,reservation-expiry.php}`, `.github/workflows/m2c-reservations.yml`, `docs/M2C_RESERVAS_E_EXPIRACAO.md`, revisão incremental de `docs/M2C_PAGAMENTOS_FRETE_PLATAFORMAS.md`, revisão incremental de `docs/LAVENDER_V3_CONSOLIDADA_POS_M2.md` e este arquivo.

**Próximos passos:** ensaio scheduler, sandbox autorizado Pix/Correios, comparação empírica Nuvemshop, operação Marina e aceite VIS; sem repetição de M2b/M2c sem mudança relevante. **Não fazer merge, deploy, publicação, assinatura ou mudança no Sanity de produção.**
