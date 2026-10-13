# Catálogo: contrato mínimo e conexão preparada

**Projeto Sanity criado pela titular em 11/10/2026:** Project ID público `t4nkzeaq`, dataset `production`.

A integração pública **somente leitura** está preparada em `src/lib/sanityCatalog.mjs`, mas NÃO foi conectada às telas, pois faltam conteúdo real, autorizações e contrato visual. Nenhuma credencial, token, pedido ou checkout foi habilitado.

- Publicação no Sanity e aprovação para exibir no site são coisas diferentes. O esquema usa `publicationStatus: pending | approved`, com `pending` como padrão.
- **Mesmo documentos publicados com status pendente podem estar legíveis diretamente na API do dataset público**. Use rascunhos do Sanity para fotos/textos não aprovados ou informação interna; não coloque dados secretos, pedidos ou dados pessoais no dataset.
- `fetchApprovedProducts` consulta documentos publicados com aprovação e valida ID, slug, categoria, fotos, alt e preço antes de expor na vitrine.
- Ainda será preciso garantir consistência entre desktop/mobile, filtros, SKU, estoque, aprovação de conteúdos e integridade das referências.
- Alterações da Marina no Sanity precisarão gerar um novo build estático ou outro mecanismo de atualização, a definir quando Cloudflare estiver ativado.
- CMS e IA não equivalem a autorização para alterar o design nem publicar sem revisão.
