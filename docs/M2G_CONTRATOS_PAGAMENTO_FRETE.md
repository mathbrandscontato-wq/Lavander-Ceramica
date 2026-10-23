# LAVENDER CERÂMICAS — M2g: contratos de homologação de pagamentos e frete
**Data:** 23/10/2026. **Branch:** `experiment/m2g-payment-shipping-contracts`. **Origem:** PR #8, M2f, V3 consolidada. **Escopo:** testes de contrato, sem integração de APIs, pagamentos reais, endpoint público, checkout, merge ou deploy.

## Decisão operacional
**Plataforma final NÃO selecionada.** WooCommerce segue candidato com provas reais de estoque1/cancelamentos/WP-Cron efêmero; Nuvemshop continua candidata sem piloto real. A preparação M2g serve à homologação técnica e não deve decidir o fornecedor antes de comparar custos, complexidade para Mariana e fidelidade visual.

A documentação oficial do Mercado Pago estabelece notificação por `x-signature` e `x-request-id` + `data.id` de URL, manifesto HMAC-SHA256 e uso de credenciais do aplicativo. Isso autentica origem do aviso, **não substitui reconsultar o provedor, conferir o pedido ou controlar idempotência de forma durável**. 
Fonte: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks ; https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/optional-notifications .

O Melhor Envio oferece sandbox com cadastro separado, aplicação e saldo fictício; seus recursos NÃO geram envios reais. Requer autorização/cadastro próprio antes de qualquer chamada de cotação em teste. Fonte: https://docs.melhorenvio.com.br/docs/sandbox ; https://docs.melhorenvio.com.br/reference/introducao-api-melhor-envio .

## Artefatos e alcance
- `src/lib/commerce/m2gPaymentContracts.mjs`: verificador local de assinatura HMAC com comparação em tempo constante; valida entradas e tolerância de timestamp, retorna `paymentConfirmed:false`. Política de conciliação pura que sempre retorna `autoFulfill:false` e nunca altera pedidos.
- `src/lib/commerce/m2gFreightContracts.mjs`: normalização CEP/pacotes e classificação de respostas **fictícias**; `checkoutAllowed:false` sempre, inclusive para opção válida de contrato.
- `tests/m2g-payment-freight-contracts.test.mjs`: assinatura sintética válida/inválida, timestamp antigo, pagamento tardio de pedido cancelado, divergência de valores e dados de frete malformados.
- `.github/workflows/m2g-contracts.yml`: teste Node, sintaxe e build Astro, sem segredos, requests externos, deploy ou custos contratados.

## Matriz de aceitação
| ID | Critério | Status no momento da criação | Evidência necessária |
|---|---|---|---|
| M2g-01 | Verificação local de HMAC sintético e inputs malformados | PASSOU (CONTRATOS LOCAIS) | Rodar testes de contrato; sucesso não equivale a webhook real |
| M2g-02 | Política conservadora para pagamento tardio e valor divergente | PASSOU (CONTRATOS LOCAIS) | Apenas cenário de regra pura |
| M2g-03 | CEP, peso, dimensões e falhas de cotação sintética | PASSOU (CONTRATOS LOCAIS) | Apenas cenários de contrato |
| M2g-04 | Pix aprovado/pendente/expirado com provedor real em teste | BLOQUEADO | Conta sandbox, aplicação e testes oficiais |
| M2g-05 | Webhook assinado real, consulta API e idempotência durável | BLOQUEADO | Sandbox + servidor HTTPS de testes + armazenamento persistente |
| M2g-06 | Frete real Correios via integrador em sandbox | BLOQUEADO | Cadastro autorizado Melhor Envio, token de teste, origem e embalagem |
| M2g-07 | Pix tardio após realocação de SKU1 | BLOQUEADO | Provedor real sandbox e implementação comercial transacional |
| M2g-08 | Piloto Nuvemshop equivalente | NÃO EXECUTADO | Conta de demonstração autorizada e roteiro VIS/Mariana |
| M2g-09 | UX real de carrinho/checkout responsivos | NÃO EXECUTADO | Páginas complementares ainda sem aceite do diretor criativo |
| M2g-10 | Publicação de loja produtiva | NÃO AUTORIZADO | Provedores, contratos, dados verdadeiros, QA e aceite |

## Dados mínimos ainda aguardados da Mariana
1. Pix/cartão pretendidos, meio de pagamento já utilizado e disponibilidade para criar uma sandbox sob sua titularidade.
2. CPF ou CNPJ como tipo de operação (sem enviar números/documentos no chat); conta comercial e responsabilidades de venda.
3. CEP de origem, pesos e dimensões de embalagens para cerâmica, política de avarias/postagem.
4. Peças do primeiro drop com fotos, nomes, preços, estoque, coleções e autorização de uso.
5. Endereço de domínio/hospedagem, política comercial, prazo de devolução e atendimento.

Nenhum segredo, dado de cartão, CNPJ ou conta bancária deve ser enviado por repositório, chat ou documentação pública.

## Próxima prova sem retrabalho
Com sandbox autorizada, obter valores atuais de planos e taxas, fixar versão do provedor e testar assinaturas e notificações reais, duplicatas e fora de ordem, webhook pós-cancelamento, disponibilidade de transporte, falha de cotação e reconsulta segura. Implementar integração somente no servidor PHP/Woo ou adaptador de backend aprovado; **não injetar Node HMAC em um Astro estático**. O melhor cenário pode ser utilizar plugins oficialmente suportados pelo provedor e evitar manter código financeiro próprio.

**Importante:** este código é experimental, não uma integração autorizada pelo gateway. Não habilitar compra com dados de contrato nem expor credenciais.
 
## Evidência posterior ao CI — 23/10/2026
**Run:** [39954937643](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39954937643) — **PASSOU**. Foram executados 56 testes Node no repositório (incluindo 9 testes M2g), todos aprovados; análise estática de sintaxe dos dois módulos novos e build Astro concluíram sem falha.
**Não houve:** comunicação com Mercado Pago ou Melhor Envio, conta sandbox, geração de cobrança, consulta de CEP, webhook de provedor, integração comercial real ou publicação. Contratos locais **não substituem** testes com os serviços.

## Portões para próxima execução
**GATE B não homologado:** a assinatura sintética de manifesto pode ser verificada, mas ainda não há API de consulta/reembolso, notificação recebida com assinatura real nem registro de idempotência atômico persistente. Não habilitar auto-fulfillment.
**GATE C não homologado:** embalagens e preço de frete normalizados por mock; interface retorna `checkoutAllowed:false`. Sem sandbox autorizada e dados de origem, não existe valor cobrável.
**GATE D não homologado:** Marina ainda não validou dois painéis, operações reais, drops e pedido/expedição.
**GATE E não homologado:** telas adicionais de checkout/carrinho seguem dependentes de aprovação visual.
**GATE F não homologado:** nenhuma autorização de publicação comercial decorre destes testes.
