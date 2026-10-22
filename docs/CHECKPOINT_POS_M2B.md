# LAVENDER | CHECKPOINT PÓS-M2b (21/10/2026)
**Branch:** `experiment/m2b-transactional-validation`, a partir de `b3018e0c0aa5982c41129fbfc8a2357de07be5f3` (M2 PR #3).
**Commit de evidências M2b e revisão V3:** `b5a1b162cd1c6275a07831043aa3f2f36e1c94d2`.
**Commit-base CI leve:** `31dccb0a5f38660624aee3785d9651234338cd2e`.
**Commit HEAD definitivo:** consultar o PR draft/branch (este próprio documento é incluído no commit posterior). **Não usar SHA histórico em lugar do HEAD.**

## Arquitetura e confiança
Astro interface V2/VIS; Sanity editorial intacto; Woo candidato comercial com SKU Sanity `productId` = Woo `sku` e BFF futuro. **Confiança moderada para estoque único em laboratório com BACS fictício; insuficiente para escolher plataforma em produção.** Nuvemshop continua candidata ainda não ensaiada.

## Comprovado
- WooCommerce real efêmero com **3 rodadas de checkout HTTP em duas sessões Cart Token independentes**: uma encomenda `on-hold`, outra rejeitada HTTP 403 (sem estoque), estoque 1→0 sem negativo.
- **Cancelamento nativo 0→1; recompra pós-cancelamento; segundo cancelamento com estoque final 1**, em todas as rodadas.
- **Preço manipulado `expected_total=1` foi recusado (409)**; valor correto 14990 centavos foi aceito, sem pagamento real.
- Workflow completo PASSOU: https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39701256935
- Primeira prova de concorrência PASSOU: https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39700976006
- Registro de tentativas prévias e causas em `docs/M2B_VALIDACAO_TRANSACIONAL.md`; nenhuma delas constitui defeito comprovado do Woo.

## Falhou / bloqueado / não executado
- **M2-03 antigo (redução manual):** não repôs estoque; fluxo nativo novo repôs. Diferença explicada pelo método, sem generalizar.
- **BLOQUEADO:** sandbox Pix e cartão, webhooks autênticos persistentes, cotação de frete Correios e dados de embalagem.
- **NÃO EXECUTADO:** expiração de reserva/pending via cron, pagamentos tardios, Nuvemshop ao vivo, fluxo administrativo Sanity/Woo com Marina, carga em produção, checkout real com gateway.
- **PENDENTE:** design do checkout/carrinho e revisão visual, contrato de custos, plataforma final e autorização de publicação.

## Arquivos afetados
Novos: `tests/m2b/{compose.yaml,setup-lab.php,store-api-race.mjs,verify-orders.php,after-cancel.mjs}`; workflows `m2b-transactions.yml` e `m2b-light.yml`; docs `M2B_VALIDACAO_TRANSACIONAL.md`, `M2C_PAGAMENTOS_FRETE_PLATAFORMAS.md`, este checkpoint.
Modificado somente na nova branch: `docs/LAVENDER_V3_CONSOLIDADA_POS_M2.md` (acréscimo pós-M2b/M2c; histórico 01–17 preservado). **Nenhum código de UI original, Sanity production, main ou gh-pages alterado.**

## Próximo movimento mínimo
1. Ler primeiro docs M2b, M2c, revisão V3 e este checkpoint. Não refazer testes de SKU1/price-cents sem mudança técnica relevante.
2. Testar pending/hold expirado com cron, idempotência de cancelamento, pagamentos pendentes/tardios em sandbox aprovado e cotação de frete autorizada.
3. Testar Nuvemshop sob os mesmos requisitos, inclusive fidelidade V2 e custos 12/24 meses. Só então decidir arquitetura.
4. Validar operação Marina, novos layouts checkout/carrinho e revisão QA visual. Preservar GATES B–F.
5. **Sem merge, deploy, contratação, alteração do Sanity de produção ou ação financeira até autorização.**

**Estado final:** M2b checkout unitário com método offline **PASSOU no laboratório**; M2c comercial segue **BLOQUEADO/PENDENTE**. Este arquivo é passagem de contexto, não autorização de produção.
