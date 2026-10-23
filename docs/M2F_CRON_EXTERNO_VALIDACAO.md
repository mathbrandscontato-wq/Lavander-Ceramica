# LAVENDER CERÂMICAS — M2f | Prova de WP-Cron por acionamento externo
**Data:** 23/10/2026 · **Branch:** `experiment/m2f-cron-diagnostics` · **Base:** PR #7 M2e (sem merge/deploy).

## 1. Problema herdado
Na M2e, três runs comprovaram que o evento `woocommerce_cancel_unpaid_orders` permanecia agendado e o pedido continuava `pending` após requisições HTTP a `wp-cron.php`: [39864739239](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39864739239), [39865109396](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39865109396) e [39865516385](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39865516385). O manipulador nativo, quando disparado explicitamente no WP-CLI, já havia passado na M2d. Portanto a falha estava na **entrega/acionamento agendado do laboratório**, não comprovadamente no motor Woo.

## 2. Hipótese e isolamento
O WordPress do Docker foi instalado com site URL `http://127.0.0.1:8090`, alcançável a partir do runner, mas não como loopback próprio no namespace do contêiner Apache. Chamadas internas de `spawn_cron()` podem falhar e deixar lock `doing_cron` por alguns instantes. Trata-se de **causa provável**: o ensaio mudou conjuntamente a política de auto-disparo e limpou o lock descartável; não isolou cada variável de forma independente.

A correção de laboratório foi:
1. Adicionar `DISABLE_WP_CRON=true` ao `wp-config.php` **somente no contêiner descartável** para impedir novas tentativas de loopback dependentes de visitas.
2. Limpar o transient `doing_cron` **somente no banco efêmero** antes da prova.
3. Agendar com API WordPress e fazer um disparo explícito HTTP a `/wp-cron.php` no endereço acessível do runner.
4. Conferir a remoção da tarefa, a mudança persistida no WooCommerce e a ausência de baixa indevida de estoque.

Documentação oficial: [WordPress: usar agendador do sistema](https://developer.wordpress.org/plugins/cron/hooking-wp-cron-into-the-system-task-scheduler/); [WordPress: diagnóstico de loopback](https://developer.wordpress.org/advanced-administration/wordpress/loopback/).

## 3. Evidência verificável
| ID | Teste | Status | Escopo |
|---|---|---|---|
| M2f-01 | Evento de diagnóstico simples via WP-Cron HTTP com auto-loopback inicial | **FALHOU** | [39933022255](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39933022255): evento permaneceu na fila, fallback WP-CLI passou. |
| M2f-02 | Evento simples com auto-disparo desativado e lock descartável limpo | **PASSOU** | [39933299909](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39933299909): `http_delivery=PASSOU`, sem fallback CLI. |
| M2f-03 | Pedido vencido Woo via evento agendado e HTTP externo | **PASSOU** | [39933526052](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39933526052): `stale_status=cancelled`, fila de evento vazia, checagens aprovadas. |
| M2f-04 | Execução de sistema agendador na hospedagem escolhida | **NÃO EXECUTADO** | Não existe hospedagem WooCommerce produtiva contratada/aprovada para esta prova. |
| M2f-05 | Pix/cartão, webhook assinado, pagamento tardio real | **BLOQUEADO** | Sem sandbox autorizada. |
| M2f-06 | Correios com cotação e dimensões reais | **BLOQUEADO** | Sem contrato/integrador e cadastro de embalagens. |

**Resultado:** a falha de entrega da M2e foi resolvida na topologia de laboratório com cron externo e controle de lock. A evidência **não** autoriza presumir que uma hospedagem comercial terá cron configurado ou que pagamentos tardios foram resolvidos.

## 4. Contrato operacional para eventual WooCommerce produtivo
O responsável pela hospedagem deverá:
- Disponibilizar PHP, banco de dados, HTTPS e **agendador do sistema confiável**; somente após isso habilitar `DISABLE_WP_CRON=true` e configurar execução regular de `wp-cron.php` pelo host, sem qualquer segredo exposto no URL.
- Verificar que a tarefa está realmente sendo consumida (não apenas HTTP 200), com logs, alertas, tolerância a falhas e recuperação de fila.
- Validar lock, agendamento, reservas e transições de pedidos na infraestrutura verdadeira, inclusive restart, indisponibilidade e atraso do cron.
- Não limpar transients em produção como rotina operacional; isso foi intervenção exclusivamente descartável de diagnóstico.
- Bloquear despacho de pedido cancelado cuja confirmação financeira chegue depois da realocação da peça; exigir conciliação por webhook oficial, autenticação e idempotência durável.

**Exemplo apenas para planejamento (não executar sem hospedagem definida):** tarefa do servidor chama periodicamente o `wp-cron.php` do domínio verdadeiro, com TLS válido. A cadência e a observabilidade serão definidas conforme o provedor e os SLAs dos drops.

## 5. Limites de arquitetura e decisão
Astro e os componentes visuais aprovados não foram alterados; Sanity production permanece intacto; WooCommerce segue **candidato** a motor comercial com provas de SKU1, reserva e cron isolados. Nuvemshop segue opção não executada, com menor ônus potencial de gestão. Não há seleção de plataforma, contas de pagamento, cotações totais de 12/24 meses nem publicação de loja real.

**Próxima etapa não simulável:** escolher e obter provedores de sandbox para Gateway Pix/cartão e Correios, confirmar domínio/hospedagem e homologar fluxo administrativo da Marina. Antes disso, permitir somente desenvolvimento de preview e integração não produtiva.
