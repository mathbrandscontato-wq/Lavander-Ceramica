# MATH BRANDS | LAVENDER — Continuidade M2c (21/10/2026)
**Referência:** PR #3 da M2, V3 consolidada, teste M2b em branch isolada. **Sem credenciais de produção, serviço contratado, merge ou deploy.**

## 1. Escopo e método
Verificação documental atual das alternativas de comércio, pagamentos e frete; não simula Pix real nem conclui habilitação de gateway. A M2b cuida somente de checkout HTTP com BACS fictício e reservas no Woo efêmero. Ausência de sandbox autorizada é um bloqueio externo, não falha da plataforma.

## 2. Pagamentos — cenários e status
| Verificação | Status | Evidência / restrição |
|---|---|---|
| Gateway Pix em sandbox com conta apropriada | **BLOQUEADO** | Sem credenciais/autorização do provedor. |
| Cartão em sandbox | **BLOQUEADO** | Sem credenciais e provedor selecionado. |
| Aprovação, recusa, expiração financeira | **BLOQUEADO** | BACS offline fictício não processa pagamentos reais. |
| Webhook assinado e persistente | **BLOQUEADO** | Contrato do gateway e endpoint de teste ausentes. |
| Duplicatas, reordenação, reembolso, late payment | **NÃO EXECUTADO** | M2 testa exclusivamente reducer mock em memória; não há prova com rede/assinatura. |
| Checkout com boleto/transferência fictícia BACS | **M2b em testes** | Permite observar pedidos on-hold; não representa pagamento confirmado. |

**Contrato necessário:** no servidor, validar ID de pedido, valor em centavos, moeda BRL, autenticidade/assinatura, idempotência durável, reconciliação do status de estoque e política para pagamento após cancelamento/expiração. Não aceitar retorno do navegador como evidência de quitação. Provedor comercial deve pertencer à Marina, sujeito à contratação.

## 3. Frete — cenários e status
| Verificação | Status | Evidência / restrição |
|---|---|---|
| Correios: preço e prazo reais por CEP | **BLOQUEADO** | Sem contrato/API ou integrador explicitamente aprovado. |
| Pesos, dimensões e embalagem segura | **BLOQUEADO** | Cadastro técnico das embalagens reais não fornecido. |
| Serviço indisponível e erro de cotação | **NÃO EXECUTADO** | Contrato de integração previsto; sem endpoint autorizado para ensaio. |
| Rastreamento, logística reversa, avaria | **NÃO EXECUTADO** | Sem operação/transportador integrado. |

**Contrato de integração:** CEP só em formato aceito, peso/dimensões validados, origem da loja, modalidade/seguro, tarifa e prazo provenientes do provedor, expiração de cotação e fallback para indisponibilidade. Nenhuma cotação fictícia deve permitir fechar pedido real.

## 4. Nuvemshop x Astro/Sanity/WooCommerce — verificação assimétrica
| Aspecto | Astro + Sanity + Woo | Nuvemshop |
|---|---|---|
| Astro existente | Mantido integralmente | Headless com checkout a validar, risco de duplicar tema/CMS |
| Sanity editorial | Reuso nativo contratado (proposta) | Preservar conteúdo exige integrar CMS externamente; não testado |
| Estoque 1 | M2 comprovou baixa simples; M2b investiga transações | Plataforma anuncia gestão de estoque; concorrência não testada |
| Pix/cartão e webhook | Plugin/gateway sandbox dependente de conta | Nuvem Pago disponível mediante credenciamento; não testado na conta Marina |
| Frete | Plugin/API/integrador depende de contrato | Nuvem Envio oferece operação integrada; regras/valores reais pendentes |
| Drops | Regra editorial/cron a completar | Disponibilidade/agendamento dependem de configuração e possíveis apps |
| Admin Marina | Sanity editorial + Woo comercial separados | Operação integrada comercial, mas acervo Sanity separado |
| Fidelidade VIS | Alto potencial com Astro | Tema ou headless dependem de prova visual |
| Custo de manutenção | PHP/DB/server/BFF/monitoramento + suporte | Assinatura e apps, manutenção comercial menor, integrações próprias incertas |
| Validação experimental | **PARCIAL** | **NÃO EXECUTADO** |

Documentos oficiais consultados:
- Nuvemshop: https://www.nuvemshop.com.br/planos-e-precos
- Nuvemshop SKU/estoque: https://dev.nuvemshop.com.br/docs/erp-guide/catalog/products
- Woo statuses/estoque: https://woocommerce.com/document/managing-orders/order-statuses/
- Woo checkout: https://developer.woocommerce.com/docs/apis/store-api/resources-endpoints/checkout
- Woo Cart Token: https://developer.woocommerce.com/docs/apis/store-api/cart-tokens

Não classificar Nuvemshop como inferior por não haver conta autorizada ou prova de uso.

## 5. Custo total 12 e 24 meses (valores de referência, sem contratação)
Tabela pública Nuvemshop consultada em 21/10/2026, preços mensais anunciados:
- Começo: mensalidade de plataforma R$ 0; sem prova de fidelidade VIS/customização e sujeito às condições do plano.
- Essencial: R$ 69/mês => R$ 828/12 meses e R$ 1.656/24 meses.
- Impulso: R$ 164/mês => R$ 1.968/12 meses e R$ 3.936/24 meses; anuncia acesso ao código-fonte do tema, não garantia headless.
- Valores anuais e promoções dependem de contratação; taxas por meios de pagamento diferentes de Nuvem Pago, adquirência, aplicativos, domínio, impostos e suporte ficam fora destes totais.
- WooCommerce: plugin sem licença-base obrigatória, porém TCO não cotado. **TCO 12 = setup + 12×(hosting PHP/DB + BFF + backups + manutenção + plugins + serviços) + domínio + taxas por transação**. Substituir 12 por 24 para período de dois anos. Qualquer número arbitrário seria inadequado.
- Sanity: plano, cotas e custo de integração das duas alternativas pendem de verificação com a titularidade do projeto. Não alterar produção.

## 6. Próxima ação comercial/engenharia
1. Concluir M2b e registrar sucesso/falha com evidência HTTP e estados persistidos.
2. Solicitar autorização para sandbox de um gateway e integrador de frete, sem credenciais no GitHub.
3. Testar Nuvemshop com requisitos idênticos e custo de operação avaliado pela Marina.
4. Avaliar viabilidade de preservação da V2 e do Studio existente em cada alternativa, sem escolha antecipada.
5. Formalizar contrato e orçamento antes de despesas e produção.

**Conclusão M2c:** a escolha da plataforma permanece **EM ABERTO**; pagamentos e frete estão **BLOQUEADOS** para homologação comercial.
