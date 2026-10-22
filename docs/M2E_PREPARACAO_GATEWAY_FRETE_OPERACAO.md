# MATH BRANDS | LAVENDER — M2e: dependências para homologação comercial
**Data:** 22/10/2026 · **Status:** preparação sem contas de produção, contratação, merge, deploy ou alterações no Sanity.

## 1. GATE B — Pagamentos, não autorizados nesta fase
**Dependências externas ainda ausentes:** provedor de gateway oficialmente escolhido pela Marina; conta de teste/sandbox com permissões e regras do provedor; credenciais em cofre/segredos restritos ao runner (NUNCA comitar nem solicitar que sejam copiadas para documentação); termos de uso e responsabilidades; contas recebedoras/tributação validadas fora do GitHub.

### Contrato obrigatório de demonstração
- Cobrança com o preço e moeda vindos do motor comercial, nunca do Sanity ou navegador.
- Webhook com assinatura/verificação oficial; transporte com HTTPS, evento armazenado com idempotência durável e replay rejeitado.
- Resolver corrida: pagamento atrasado após reserva/pedido cancelado ou após nova reserva **não** permite faturamento/expedição automática da peça antiga.
- Estados verificáveis: iniciado, pendente, aprovado, expirado, recusado, cancelado, reembolsado, chargeback; comparar estado gateway e pedido.
- Testes: pagamento Pix pendente, expirado e aprovado fora de ordem; duplicidade e retransmissão; estorno; indisponibilidade; atualização de pedido após evento válido; entrega não autorizada em estado inseguro.
- Não declarar PASSOU com redutor de mocks, BACS offline ou `payment_status=success` de método sem banco.

**Estado:** BLOQUEADO para homologação real. Integrar somente após contrato e ambiente de teste autorizados.

## 2. GATE C — Correios, não autorizado nesta fase
**Dependências:** CEP de origem, peso e medidas das embalagens reais, política de empacotamento da cerâmica, contrato/API ou integrador oficialmente escolhido, condições de seguro/avaria e devolução.

**Contratos:** cálculo de preço/prazo consultado no provedor autorizado; falha/timeout cancela finalização com frete não confirmado; CEP inválido, múltiplos itens únicos, volumes diferentes e cálculo de peso precisam de testes; rastreio/etiqueta e responsabilidade de postagem são processos separados.

**Estado:** BLOQUEADO, sem simulação classificada como cotação real.

## 3. GATE D — Operação Marina
- Cadastro de uma peça única real: SKU, preço real no motor comercial, fotos e descrição no Sanity, direitos de uso, dimensões embaladas, quantidade 1.
- Preparar e publicar drop em horário definido; verificar SKU, status, visibilidade e disponibilidade.
- Receber pedido, verificar pagamento real, emitir etiqueta, postar e enviar rastreio.
- Encerrar drop e gerenciar esgotados sem preço inventado.
- Fluxo de personalizados por WhatsApp separado de checkout.
- Documentar quantos sistemas Marina precisaria acessar: Sanity + Woo versus sistema nativo Nuvemshop. Avaliar carga operacional e treinamento com ela.
**Estado:** NÃO EXECUTADO; depende de dados reais e prova de plataforma.

## 4. Comparação e custos
WooCommerce tem evidência real de SKU1/checkout BACS e reservas em laboratório (M2b, M2c, M2d). Nuvemshop possui somente documentação de catálogo e planos, não tem prova de checkout e fidelidade Astro/Sanity em conta autorizada. Não selecionar plataforma pelo desequilíbrio de experimentos.
TCO de 12/24 meses precisa incluir: implantação, mensalidade ou hospedagem PHP/DB, segurança, backups, BFF, manutenção técnica, apps/plugins, gateway e taxas, integrador e tarifas de envio, domínio, suporte e treinamento. Valores nominais de planos em `M2C_PAGAMENTOS_FRETE_PLATAFORMAS.md`, sujeitos a nova cotação.

## 5. Limites e segurança
Nesta fase: **sem novos serviços pagos, credenciais, publicação, merge, alteração de dados de produção, testes com clientes ou pagamentos reais**.
GitHub permanece fonte de código e evidências; layouts V2/VIS continuam fonte visual. Qualquer alteração de checkout/carrinho requer aprovação visual e QA, sem funcionalidades inferidas de mockups.

## 6. Próxima decisão possível
Autorizar fornecedores de **sandbox** e especificar quem será proprietário das contas e quem arcará com custos; após isso executar Gate B/C. Até lá, limitar progresso a testes internos do Woo e documentação objetiva.
