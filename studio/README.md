# Lavender Cerâmicas — painel da proprietária (estrutura inicial)

Este diretório prepara um **Sanity Studio independente**. O projeto Sanity real **ainda não foi criado ou conectado**, o build do Studio **ainda não foi validado**, e nenhum dado real foi importado.

## Por que separado do site?
A cliente poderá cadastrar produtos, fotos e preços sem editar código. O site Astro permanecerá separado do painel e só receberá conteúdo aprovado após integração e testes.

## Para ativar quando autorizado
1. Criar projeto Sanity **na conta da Marina** (ou registrar formalmente a transferência), revisar termos, cotas, localização e permissões.
2. Definir um dataset apropriado à operação. Plano Free pode oferecer apenas datasets públicos: não publicar documentos privados, dados de pedidos ou dados comerciais ainda não aprovados.
3. Copiar `.env.example` para `.env` nesta pasta e informar `SANITY_STUDIO_PROJECT_ID` e `SANITY_STUDIO_DATASET`.
4. Rodar `npm install` e `npm run dev` dentro de `studio/` com internet habilitada.
5. Revisar os campos com Marina e testar o fluxo de rascunho/publicação. Não executar importação de dados comerciais fictícios.
6. Hospedar o Studio pelo serviço oficial quando a titularidade estiver estabelecida; não publicar o painel sem autenticação.

## Fluxo editorial recomendado
- Cadastrar categorias e coleções com nomes aprovados.
- Criar produto como **rascunho**, carregar imagens próprias e preencher descrições.
- Confirmar disponibilidade, preços e direitos de uso antes de clicar em Publicar.
- Validar o produto publicado no site por um processo de preview/rebuild a definir.
- Evitar depender da Math Brands para atualizações rotineiras.

**Atenção:** datasets públicos disponibilizam documentos publicados por API. Portanto, deixar `priceMode: unconfirmed` em um documento publicado não é proteção de sigilo. Produtos pendentes de aprovação devem permanecer em rascunho.

**Personalização mobile:** bloqueada por CON-02 na V3. Este schema não autoriza interface ou pedido de personalização.

**IA/ChatGPT:** não integrada. A avaliação futura deve exigir autenticação, confirmação humana e aprovação da cliente; plano premium do ChatGPT não equivale a créditos automáticos de API.
