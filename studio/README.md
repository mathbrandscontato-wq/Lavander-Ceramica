# Lavender Cerâmicas — Studio da cliente (não publicado)

A conta Sanity foi criada com Google `lavanderceramicas@gmail.com`. Projeto real **Lavender Cerâmicas**: `t4nkzeaq`, dataset `production`. Organização: `ow010fg90`.
Projeto no Sanity: https://www.sanity.io/organizations/ow010fg90/project/t4nkzeaq

## Custo
No cadastro em 11/10/2026, a plataforma iniciou um **Growth Trial gratuito por 30 dias**, sem cartão. A página do plano informa downgrade automático ao Free após o teste. Revisar após o prazo: https://www.sanity.io/organizations/ow010fg90/project/t4nkzeaq/plan. Não contratar Growth nem introduzir custos sem autorização da proprietária.

## Execução técnica
O esquema do Studio fica em `schemaTypes/`; sua validação de TypeScript roda no GitHub Actions. O Project ID é identificador público, não credencial.

```bash
cd studio
cp .env.example .env
npm install
npm run check
npm run dev
```

Para preparar a versão estática do painel: `npm run build`. **Build não significa publicação nem cadastro de domínio.** O painel ainda não foi hospedado no serviço Sanity, nem testado pelo navegador da Marina.

## Edição para a Marina
- Criar categorias e coleções antes de atribuir produtos.
- Criar produto em **rascunho**, carregar fotos de autoria/direitos confirmados, nome, descrição, preço (se confirmado), categoria e imagem com descrição acessível.
- Campo `Aprovação para aparecer no site`: começa como **Pendente**. Marcar **Aprovado** somente quando confirmado.
- Conferir preview, salvar e publicar no Sanity somente conteúdo apropriado para um dataset público.
- Um produto ainda não entra no site até o front-end ser ativado e passar por homologação. Atualização automática ainda NÃO configurada.

**Segurança:** datasets públicos expõem documentos *publicados* diretamente na API, inclusive os sinalizados como pendentes no campo de status. Manter não aprovados como rascunho e jamais publicar dados de pedidos ou informações pessoais.

**Limites V3:** personalização mobile CON-02, listas CON-03/04, comercial e operações de pedidos seguem bloqueados.

**IA/ChatGPT:** recurso futuro opcional, sem API nem custos ativados.
