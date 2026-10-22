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
| Transferência offline fictícia BACS | **PASSOU, COM LIMITAÇÕES** | Checkout real Store API com on-hold, recusa de segundo comprador 403 e cancelamento/recompra; **não é pagamento confirmado**. [Evidência](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39701256935). |

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
1. M2b concluída no cenário offline: três disputas de estoque 1 sem venda dupla, 409 para preço adulterado e reposição após cancelamento. Revalidar sob gateway efetivo e expiração.
2. Solicitar autorização para sandbox de um gateway e integrador de frete, sem credenciais no GitHub.
3. Testar Nuvemshop com requisitos idênticos e custo de operação avaliado pela Marina.
4. Avaliar viabilidade de preservação da V2 e do Studio existente em cada alternativa, sem escolha antecipada.
5. Formalizar contrato e orçamento antes de despesas e produção.

**Conclusão M2c:** a escolha da plataforma permanece **EM ABERTO**; pagamentos e frete estão **BLOQUEADOS** para homologação comercial.

---

## 7. Revisão M2c — verificação documental de 22/10/2026
**Fontes externas verificadas em 22/10/2026; não representam operação testada.** A comparação anterior permanece como registro histórico. Esta revisão separa hipóteses de fatos documentados.

| Propriedade | WooCommerce + Astro + Sanity | Nuvemshop |
|---|---|---|
| SKU e estoque | Store API em Woo real demonstrou SKU1/concorrência nos 3 ensaios M2b; mais testes de reserva M2c nesta branch | API documenta SKU e gestão direta de estoque, inclusive variantes. **Sem prova de concorrência/checkout Nuvemshop** |
| Fluxo editorial | Studio Sanity pode ser mantido; necessária conciliação segura com Woo | API permite integrar Sanity, mas operação dupla ou substituição editorial exige decisão, **não comprovada** |
| Personalização VIS | Astro já dispõe de estrutura preservável | Temas Twig e componentes via NubeSDK, mas fidelidade às pranchas e transição para checkout hospedado ainda **não comprovadas** |
| Checkout e extensão | Extensão da Store API/checkout Woo fica sob manutenção da agência | A documentação NubeSDK delimita componentes de checkout; formulário sensível do pagamento é isolado e não suporta o SDK |
| Operação Marina | Dois sistemas editorial e comercial exigem treinamento, suporte, atualização PHP e backups | Plataforma gerencia mais operações comerciais, mas integração CMS externo continua um fator |
| Pagamento e frete | Gateway e Correios dependem de serviços e testes próprios | Nuvem Pago e Nuvem Envio existem; elegibilidade e contrato da Marina não demonstrados |
| Evidência comparável | M2b real efêmera PASSOU parcialmente | Pesquisa documental apenas; não reprovar por falta de ambiente |
| Escolha | **CANDIDATA** | **CANDIDATA** |

### Planos Nuvemshop: projeção nominal, sem taxas variáveis
Fonte oficial consultada em 22/10/2026: https://www.nuvemshop.com.br/planos-e-precos .
Preço **mensal** anunciado: Começo gratuito, Essencial R$69, Impulso R$164. Totais somente de assinatura mensal sem mudanças:
- Essencial: **R$828 (12 meses)** e **R$1.656 (24 meses)**.
- Impulso: **R$1.968 (12 meses)** e **R$3.936 (24 meses)**.
- Referência em plano anual com desconto anunciado de 15%: Essencial equivale a R$58,65/mês e Impulso R$139,40/mês; efetivas cobrança e renovação devem ser conferidas.
- **Excluídos:** gateway e MDR de processamento, tarifas por venda em condições específicas, aplicativos, domínio, integração Astro/Sanity, implantação, suporte de agência, tributos, frete e valores sujeitos a alteração. O plano Começo não implica customização sem restrições.
- **WooCommerce:** licença-base não substitui custos reais de hosting PHP/MariaDB, BFF, atualização, segurança, backup, servidor SMTP, integração e suporte. Orçamento de 12/24 meses permanece SEM COTAÇÃO, portanto não pode haver comparação de TCO final.

### Restrições atuais Nuvemshop a testar
- Guia de desenvolvimento: https://nuvemshop.dev/overview ; temas utilizam Twig com seções e blocos, e a API REST dá acesso a produtos/pedidos/webhooks.
- Produto e variantes (SKU/estoque): https://nuvemshop.dev/apps/erp-guide/catalog/products .
- NubeSDK (checkout): https://nuvemshop.dev/apps/nube-sdk/api/checkout ; opções de extensão do host NÃO representam liberdade de redesenhar todas as etapas de pagamento.
- Regras de SDK: https://nuvemshop.dev/apps/admin/overview ; injeções em storefront/checkout exigem SDK nas condições documentadas; pagamento sensível é isolado.
- Falta validar como uma UI Astro fidelíssima à V2 transfere a compra ao checkout da plataforma, quais páginas podem ser personalizadas e como os pedidos retornam. Esse risco é **aberto**, não prova de incompatibilidade.

### Decisão M2c
Nenhum provedor foi contratado ou escolhido. Sem credenciais autorizadas de sandbox Pix/cartão e serviço de frete, Gates B/C **BLOQUEADOS**. Não instalar gateways fictícios em produção. Prioridade técnica: expiração real da reserva no Woo (teste na branch), migração de estados de pedido e política de pagamento atrasado; prioridade comercial: cotar as duas alternativas com titularidade Marina e operação de drops.
