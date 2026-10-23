# LAVENDER | M4 - BACKUP, GO-LIVE E ROLLBACK (RUNBOOK NÃO EXECUTADO)
Preparado em 23/10/2026. Não são instruções para rodar automaticamente. Nenhum deploy ou migração foi feito nesta etapa.

## Antes de mexer no domínio
1. Confirmar autorização comercial da Marina e da direção criativa; todos os gates críticos em release/approval-gates.json aprovados com evidências legítimas.
2. Registrar HEAD atual de main, da candidata e de gh-pages no momento real da mudança. Baseline conhecida da gh-pages em 23/10: 8fd5af3ef68210d10369c6d1a42a7911992815ea. Não presumir que continue assim.
3. Arquivar cópia verificável do protótipo que aparece em lavender.mathbrands.com.br: HTML/CSS/JS, JSON, imagens e fontes permitidas, com checksum. Armazenar fora do mesmo servidor e testar restauração.
4. Guardar snapshot DNS/TTL e CNAME, provedor e certificado TLS, regras de cache/redirects. Não transferir domínio sem confirmação de titularidade.
5. Caso escolha WooCommerce, exportar banco, mídia, configuração e plugins; testar restauração no ambiente de teste. Após início das vendas, não restaurar banco antigo por cima de novos pedidos sem reconciliação de pagamentos e estoque.
6. Sanity: backup/export autorizado dos documentos publicados, com cuidado para não enviar drafts/dados pessoais a artefatos públicos. Nunca armazenar senhas nos documentos.
7. Conferir serviço de cron externo na hospedagem selecionada; a prova Woo em Docker não substitui isso.

## Publicação futura
- Primeiro homologação restrita em domínio distinto, com meios de pagamento TESTE, dados fictícios e política de não indexação.
- Verificar compra da última unidade, concorrência, valor do servidor, frete, webhook duplicado/fora de ordem e pagamento tardio.
- Validar todos os caminhos: Home, categorias, coleções, produto, carrinho, checkout, confirmação, status, políticas, contatos e página de erro.
- Validar conteúdo da Marina, WCAG aplicável, contrastes, imagens, velocidade, SEO e marca oficial.
- Congelar alterações durante o cutover, exportar estado atualizado, publicar backend e front-end compatíveis e conferir TLS antes de apontar DNS.
- Habilitar cobrança e indexação somente no GO formal. Verificar operação completa no domínio real.

## Critérios e procedimento de rollback
Gatilhos: venda duplicada de SKU 1, cobrança sem pedido válido, dados vazados, checkout indisponível, frete incompatível, perda de conteúdo, HTTPS inválido ou falha grave.
1. Desabilitar recebimento de novos pedidos primeiro, preservando logs de transações e estado dos webhooks.
2. Reconciliação de cobrança/estoque com provedor antes de qualquer restauração de dados.
3. Repor versão estática anterior e/ou reverter apontamento DNS conforme snapshot, respeitando TTL e cache.
4. Não apresentar checkout fictício restaurado como compra real; exibir indisponibilidade comercial se necessário.
5. Conferir novamente HTTPS, homepage, assets, navegação e estado do pedido, registrar incidente e autorização de retomada.

## Entrega à Marina
Repositório/cópia do código, tag de release e checksum do backup; contas sob titularidade da Marina, manual do CMS e fluxo comercial, relação dos serviços e limites/custos, suporte, políticas, teste de backup e evidências de aceite. Informações sensíveis exclusivamente por canal seguro.

**STATUS:** checklist e plano redigidos; backups reais, deploy e rollback NÃO EXECUTADOS.
