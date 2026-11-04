# M5 — Compatibilidade dos plugins oficiais com checkout HTTP Woo

Este workflow amplia a M2b usando os três plugins ativos no mesmo WordPress descartável.
WooCommerce, Mercado Pago e Melhor Envio instalados pelo WordPress.org, sem nenhuma conta comercial externa.
Executa três rodadas de checkout real da Store API em sessões concorrentes com BACS offline fictício para estoque unitário, cancelamento nativo e tentativa de recompra. Nenhum valor é cobrado.
Aceite: não haverá dois pedidos ativos para o mesmo SKU único; o valor adulterado deve ser rejeitado, cancelamento deve restaurar e recompra deve funcionar.
Importante: aprovação desse teste NÃO comprova Pix/cartão reais nem cálculo de frete em um item não virtual, pois BACS é offline e o item da fixture é virtual.
Sem deploy, conta da Marina, credenciais, domínio, pedidos comerciais ou mudança em Sanity.
