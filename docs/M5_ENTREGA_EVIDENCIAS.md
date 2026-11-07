# LAVENDER CERÂMICAS — M5: Piloto instalado, fotos provisórias e engenharia

Data: 03/11/2026. Branch feat/m5-preview-media-payment-pilot, a partir da M4b/PR #13. Sem merge/deploy, sem contas comerciais e sem alterar Sanity de produção.

## Estado validado
- **12 WebPs autorais ilustrativos provisórios**, reaproveitados por SHA de feat/prototipo-a-catalogo-interativo: hero, banner, manifesto e nove imagens de produto (não ligadas a SKUs reais). Autorização de usar fotos provisórias recebida da direção criativa em 03/11/2026. Textos alternativos identificam que são ilustrativas e as páginas permanecem não indexáveis.
- **Preview Astro e mídia:** Actions https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/41752599574 passou (testes Node, incluindo 3 novos testes das imagens, e build). QA Chromium https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/41753251865 passou: 198 verificações de UX existentes + 16 inspeções de imagens e fundos visuais em mobile 390 e desktop 1440; zero falhas. O primeiro ensaio falhou por observar imagens com lazy loading fora da tela, e a instrumentação foi corrigida para rolar e aguardar decode. Artefatos por 5 dias.
- **Instalação real de plugins num WordPress descartável:** Actions https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/41752442630 PASSOU com WooCommerce 11.2.1, Mercado Pago oficial 8.9.7 e Melhor Envio oficial 3.0.8. Todos ativos; os gateways woo-mercado-pago-basic e woo-mercado-pago-custom foram registrados, mas não configurados. Banco e volumes excluídos após testes.
- **Builds reproduzíveis:** package-lock.json e studio/package-lock.json gerados e versionados pela tarefa https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/41753334322; Astro/Sanity npm ci verificados pela workflow M5.

## Decisão técnica da Math Brands
Seguiremos como candidato prioritário com **Astro para a experiência editorial, Sanity para conteúdo e WooCommerce para estoque, pedidos, Pix/cartão e frete**, usando plugins oficiais e evitando processamento financeiro próprio. A logística do Melhor Envio necessita autenticação da conta da Marina. A arquitetura ainda requer hospedagem PHP/MariaDB, cron externo, TLS e um desenho de passagem para o checkout comercial sem quebrar a estética aprovada.

**Importante:** nenhum dos plugins foi conectado a uma sandbox legítima, não houve PIX, cartão, etiqueta, contrato, pedido de cliente ou webhook genuíno. A instalação não constitui homologação transacional. A Storefront API ou links de checkout deverão ser aprovados após escolher host/provedores, evitar CORS inseguro e provar único comprador por estoque unitário.

## Infraestrutura e domínio
- O domínio desejado é lavenderceramicas.com.br, **sem registro/titularidade/DNS ainda comprovados**.
- Cloudflare conectado consultado em 03/11/2026: não há zonas autorizadas visíveis para mathbrands.com.br nem lavenderceramicas.com.br, portanto não podemos modificar o DNS ali ou presumir acesso à futura conta da Marina.
- A demonstração em lavender.mathbrands.com.br permanece em gh-pages; fazer cópia recuperável antes de redirecionar.

## Pendências não substituíveis por decisões técnicas
1. Marina: formalizar MEI, conta recebedora separada, titularidade de gateway/serviço logístico e acesso de homologação, por canal protegido.
2. Confirmar fotos reais **dos produtos específicos** ou autorização expressa para usar ilustração em determinada ficha com divulgação transparente; fotos geradas não podem ser vendidas como prova do objeto físico.
3. SKU/quantidade real por peça, datas de drops, descrições e medidas embaladas específicas (apenas uma caneca tem 550g e 14cm de referência).
4. Checkout e carrinho com processamento seguro via Woo, pagamento tardio, idempotência, erros de frete e reembolso testados na sandbox da Marina.
5. Host PHP/DB e DNS/SSL contratados e acessíveis; cron e backup/restore demonstrados; política LGPD/trocas e aceite operacional da Marina.
6. Layout desktop/mobile comparado com pranchas VIS e versão de checkout validada; export de conteúdo e treinamento.

## Resultado comercial
NO-GO para publicação da loja: manter 16 gates críticos pendentes até evidência real, sem alterar main, gh-pages ou Sanity production. O automonitoramento de prontidão deve notificar somente quando estiver realmente apta à publicação.

### Fontes oficiais
- Plugin Mercado Pago: https://wordpress.org/plugins/woocommerce-mercadopago/
- Testes Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs/woocommerce/integration-test
- Plugin Melhor Envio: https://wordpress.org/plugins/melhor-envio-cotacao/
- Nuvemshop headless: https://atendimento.nuvemshop.com.br/pt_BR/parceiros-tecnologicos/o-que-a-storefront-api-da-nuvemshop-e-para-que-serve

## Evidência complementar com os três plugins ativos — 04/11/2026 UTC
[GitHub Actions 41755279678 — PASSOU](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/41755279678). WordPress efêmero com WooCommerce 11.2.1 + Mercado Pago 8.9.7 + Melhor Envio 3.0.8, todos ativos. **Sem credenciais, sem cobrança, item virtual de teste e BACS offline.**

Três rodadas independentes de Checkout Store API com clientes fictícios e Cart-Token isolados:
- Em cada rodada, **somente um pedido `on-hold` HTTP 200** e outra sessão **HTTP 403 `woocommerce_product_not_enough_stock`**, estoque 1→0; nenhum oversell detectado.
- Cancelamento Woo nativo repôs a unidade 0→1; recompra HTTP 200; alteração maliciosa de `expected_total` foi rejeitada com **HTTP 409** `woocommerce_rest_checkout_total_mismatch`.
- `payment_status: success` no método **BACS offline** é sinalização interna de gateway; **NÃO é dinheiro liquidado**. Nenhum Pix/cartão real, frete cotado, webhook ou estorno foi executado.

**Descoberta de compatibilidade relevante:** o plugin Melhor Envio 3.x registra três campos adicionais obrigatórios no `billing_address` do Checkout Store API: `melhor-envio-cotacao/billing-document` (CPF/CNPJ), `melhor-envio-cotacao/address-number` e `melhor-envio-cotacao/neighborhood`. As primeiras execuções M5 deram HTTP 400 `rest_invalid_param` até que o fixture exclusivamente fictício passasse esses campos, conforme contrato de extensões WooCommerce. Não desativar as validações; elas precisam ser implementadas com UX acessível no checkout final, com proteção de dados LGPD.

**Gates persistentes:** ainda não comprovados Pix, cartão, frete de pacote físico e operação da Marina. O método BACS foi usado apenas para testar a Store API e estoque. O checkout real deve evitar coleta de CPF/CNPJ em recursos públicos, logs, front-end estático ou repositório GitHub.
