# MATH BRANDS / LAVENDER — CHECKPOINT PÓS-M2 (21/10/2026)

**Branch:** experiment/m2-astro-sanity-woocommerce.
**Commit-base:** 05964aa99477916e03d84e70ee241cdd52811228 (chore/initial-foundation).
**Commit de consolidação V3:** bcf6c16e281b4b42dc393cae42064d358d067421.
**Commit final:** consultar HEAD atual da branch ou head_sha do PR draft: https://github.com/mathbrandscontato-wq/Lavander-Ceramica/tree/experiment/m2-astro-sanity-woocommerce. O SHA do próprio commit que contém este checkpoint não pode ser inscrito nele antes de existir.
**PRs #1 e #2:** intactos, drafts, não mesclados. **Sem deploy.**

### Arquitetura candidata e confiança
Astro = interface fiel à V2; Sanity existente = autoridade de conteúdo editorial; WooCommerce candidato = preço/estoque/pedidos; chave compartilhada Sanity productId == Woo sku; leitura Woo somente em servidor com HTTPS. **Confiança baixa-moderada, decisão não aprovada.** Nuvemshop segue candidata não testada. **Não criar backend financeiro ou novo CMS.**

### Arquivos M2 criados
- src/lib/commerce/m2Contract.mjs
- src/lib/commerce/wooRead.mjs
- tests/m2-commerce-contract.test.mjs
- tests/m2/compose.yaml
- tests/m2/woo-probe.php
- .github/workflows/m2-light.yml
- .github/workflows/m2-experimental.yml
- docs/M2_PROVA_TECNICA_ECOMMERCE.md
- docs/LAVENDER_V3_CONSOLIDADA_POS_M2.md
- docs/CHECKPOINT_CODEX_POS_M2.md

**Modificado:** apenas workflow M2 experimental na própria branch durante correção de permissões. Arquivos anteriores Astro/Sanity, PR #1/#2, main e gh-pages não foram alterados.

### O que foi efetivamente comprovado
- CI Node (catálogo anterior + 8 testes M2), sintaxe e build Astro: [PASSOU](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39613612849).
- WooCommerce 11.2.1 real em WP/MariaDB efêmeros: SKU único fictício, preço 149.90, estoque 1→0, repetição da redução manteve 0: [PASSOU limitado](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39614461523).
- **Alerta:** cancelamento do pedido gerado manualmente manteve estoque em 0; não extrapolar ao checkout Woo completo. Primeiras duas execuções falharam por permissão de WP-CLI e foram corrigidas; histórico preservado.
- Mocks: eventos duplicados/fora de ordem, cálculo apenas demonstrativo, estados de drops; **não são provas transacionais**.

### O que permanece pendente
**P0:** dois checkouts concorrentes reais com estoque 1; reserva, cancelamento, timeout e estoque; gateway Pix/cartão sandbox e webhook com assinatura/persistência; cotação Correios com provedor autorizado; estabilidade do server/BFF. **P1:** teste editorial real Sanity+SKU Woo sem modificar production; contraste de tema/checkout Nuvemshop com o design V2; preço total 12/24m; QA de telas VIS e novo checkout; lockfiles e deploy isolado quando autorizado.

### Decisões
Aprovado: direção criativa V2; compra online de peças prontas únicas em drops; personalizados por WhatsApp; envios Correios; Sanity editorial existente e GitHub First. **Não aprovado:** plataforma vencedora, assinatura, hospedagem, gateway, domínio, layout de checkout, integrar produção, publicação ou merge.

### Instruções mínimas para próxima atualização (Codex futuro)
1. Ler PRIMEIRO docs/M2_PROVA_TECNICA_ECOMMERCE.md e docs/LAVENDER_V3_CONSOLIDADA_POS_M2.md; consultar PR #1 para reuso Astro/Sanity, #2 só como referência visual, sem misturar branches.
2. Não repetir a investigação já documentada de SKU/preço e baixa Woo; avançar apenas nos gaps P0 com serviços isolados autorizados.
3. Preservar VIS e Sanity production; implementar servidor seguro apenas após plataforma escolhida.
4. Não fazer merge nem deploy sem revisão/autorização expressa.
5. Reexecutar Node tests/build/schemas, experimento Woo e principalmente checkout concorrente, timeout, webhook, frete e regressão visual antes de qualquer integração.

**Status:** M2 parcial com evidência real; M3/M4 bloqueados pelos gates comerciais/transacionais. Checkpoint informativo, não instrução de publicação.
