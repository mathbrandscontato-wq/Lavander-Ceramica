# M5 — Piloto de WooCommerce + plugins oficiais (sem vendas reais)

Decisão técnica candidata em 03/11/2026: priorizar WooCommerce, plugin oficial Mercado Pago (Pix/cartão) e plugin oficial Melhor Envio (Correios/transportadoras). É piloto, não decisão comercial irreversível.

Base técnica: M2b–M2f validaram estoque de peça única, concorrência, reserva e cron HTTP externo no Docker. A Marina ainda precisa concluir MEI e configurar conta recebedora própria.

Referências oficiais:
- https://wordpress.org/plugins/woocommerce-mercadopago/
- https://www.mercadopago.com.br/developers/pt/docs/woocommerce/integration-test
- https://wordpress.org/plugins/melhor-envio-cotacao/

Escopo do teste: instalar os três plugins do WordPress.org em WordPress/PHP/MariaDB descartáveis no GitHub Actions, confirmar estado ativo e registrar versões e IDs de gateways. Não criar vendedor, comprador, cobrança, etiqueta nem notificação externa. Não acessar Sanity ou infraestrutura real.

Limites: plugin ativo não equivale a Pix/cartão habilitado. O plugin Melhor Envio exige conexão com uma conta da Marina. Checkout Pro e Checkout Personalizado exigem testes e aprovação da UX em ambiente habilitado; não implementar processamento financeiro próprio ou expor keys no front-end.

Antes de liberar produção: MEI/conta empresarial; sandbox real Pix/cartão com webhook autenticado, reconsulta/idempotência durável e pagamentos tardios; contrato logístico e embalagens de cada produto; host PHP/DB/HTTPS/cron e backup; carrinho/checkout aprovado; política de trocas; prova operacional com Marina.

Nuvemshop permanece opção de comparação. Planos e manutenção variam e é necessário TCO 12/24 meses real. Woo possui plugins gratuitos mas requer hospedagem PHP/DB, suporte/atualizações e taxas operacionais. Não inventar preços de contratação.

Publicidade: os 12 WebPs reutilizados na branch M5 são provisórios, de um protótipo autoral já existente. Não representam os produtos da Marina. A substituição por fotografias oficiais está autorizada para depois.

STATUS: NOT READY FOR GO-LIVE. GitHub PR draft, sem merge/deploy/contas reais.
