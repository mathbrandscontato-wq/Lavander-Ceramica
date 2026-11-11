# M5 — Compatibilidade dos plugins oficiais com checkout HTTP Woo

Este workflow amplia a M2b usando os três plugins ativos no mesmo WordPress descartável.
WooCommerce, Mercado Pago e Melhor Envio instalados pelo WordPress.org, sem nenhuma conta comercial externa.
Executa três rodadas de checkout real da Store API em sessões concorrentes com BACS offline fictício para estoque unitário, cancelamento nativo e tentativa de recompra. Nenhum valor é cobrado.
Aceite: não haverá dois pedidos ativos para o mesmo SKU único; o valor adulterado deve ser rejeitado, cancelamento deve restaurar e recompra deve funcionar.
Importante: aprovação desse teste NÃO comprova Pix/cartão reais nem cálculo de frete em um item não virtual, pois BACS é offline e o item da fixture é virtual.
Sem deploy, conta da Marina, credenciais, domínio, pedidos comerciais ou mudança em Sanity.

## Evidência complementar com os três plugins ativos — 04/11/2026 UTC
[GitHub Actions 41755279678 — PASSOU](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/41755279678). WordPress efêmero com WooCommerce 11.2.1 + Mercado Pago 8.9.7 + Melhor Envio 3.0.8, todos ativos. **Sem credenciais, sem cobrança, item virtual de teste e BACS offline.**

Três rodadas independentes de Checkout Store API com clientes fictícios e Cart-Token isolados:
- Em cada rodada, **somente um pedido `on-hold` HTTP 200** e outra sessão **HTTP 403 `woocommerce_product_not_enough_stock`**, estoque 1→0; nenhum oversell detectado.
- Cancelamento Woo nativo repôs a unidade 0→1; recompra HTTP 200; alteração maliciosa de `expected_total` foi rejeitada com **HTTP 409** `woocommerce_rest_checkout_total_mismatch`.
- `payment_status: success` no método **BACS offline** é sinalização interna de gateway; **NÃO é dinheiro liquidado**. Nenhum Pix/cartão real, frete cotado, webhook ou estorno foi executado.

**Descoberta de compatibilidade relevante:** o plugin Melhor Envio 3.x registra três campos adicionais obrigatórios no `billing_address` do Checkout Store API: `melhor-envio-cotacao/billing-document` (CPF/CNPJ), `melhor-envio-cotacao/address-number` e `melhor-envio-cotacao/neighborhood`. As primeiras execuções M5 deram HTTP 400 `rest_invalid_param` até que o fixture exclusivamente fictício passasse esses campos, conforme contrato de extensões WooCommerce. Não desativar as validações; elas precisam ser implementadas com UX acessível no checkout final, com proteção de dados LGPD.

**Gates persistentes:** ainda não comprovados Pix, cartão, frete de pacote físico e operação da Marina. O método BACS foi usado apenas para testar a Store API e estoque. O checkout real deve evitar coleta de CPF/CNPJ em recursos públicos, logs, front-end estático ou repositório GitHub.
