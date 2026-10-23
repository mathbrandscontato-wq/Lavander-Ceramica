# LAVENDER — CHECKPOINT M2g (23/10/2026)
**Branch:** `experiment/m2g-payment-shipping-contracts`. **Base:** `4ee382577b1c5c662ca5a240efe17d780e02240b` (PR #8 / M2f). **Commit final:** consultar PR draft/HEAD atual para evitar SHA autorreferencial.

## Comprovado
[GitHub Actions 39954937643](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39954937643): **56 testes Node passaram, zero falhas**, incluindo nove casos M2g; sintaxe dos módulos e build Astro passaram.
- `src/lib/commerce/m2gPaymentContracts.mjs`: assinatura HMAC Mercado Pago com valor sintético e política de conciliação sem qualquer ação financeira.
- `src/lib/commerce/m2gFreightContracts.mjs`: validações de CEP, medidas, peso, preço e indisponibilidade **apenas por mocks**.
- `tests/m2g-payment-freight-contracts.test.mjs` e `.github/workflows/m2g-contracts.yml`: CI econômico, sem deploy, gateway ou tokens.
- `docs/M2G_CONTRATOS_PAGAMENTO_FRETE.md`: matriz, documentos oficiais, critérios e dependências.
- V3 recebeu aditivo pós-M2g; original preservado.

## NÃO comprovado / bloqueios
- Mercado Pago ou outro gateway conectado; Pix/cartão sandbox, webhooks reais autenticados, idempotência persistente, cancelamentos tardios e dados contábeis: **BLOQUEADO**.
- Melhor Envio/Correios sandbox e cotação real de origem/embalagem: **BLOQUEADO**.
- Gestão de drops por Mariana, comparação prática com Nuvemshop, custos TCO 12/24 meses e checkout VIS adicional: **PENDENTES**.
- Domínio/HTTPS, publicação produtiva e dados da loja não foram modificados.

## Instrução para próxima equipe
Não refazer testes M2b–M2g sem mudança material. Obter dados comerciais e acesso sandbox somente por meio seguro, na titularidade da cliente. Preferir integração oficialmente suportada no Woo ou Nuvemshop conforme decisão comprovada; não publicar helper Node em Astro estático nem inventar checkout. Rodar Pix/cartão real de teste, notificação assinada e duplicada, pagamento tardio após realocação, cálculo de frete e falhas, painel Marina e QA visual antes do lançamento. Conservar `main`, `gh-pages` e PRs anteriores até plano de merge revisado.
