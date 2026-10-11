# Lavender Cerâmicas — base de engenharia

Repositório de desenvolvimento do site Lavender Cerâmicas, gerenciado inicialmente pela Math Brands e com transferência de titularidade planejada para a cliente.

**Status:** preparação técnica. Nenhum layout, conteúdo comercial, integração ou publicação está aprovado por este commit.

A especificação de implementação V3 é a referência de governança. Arquivos de identidade visual, mídias, dados de produtos e segredos só deverão ser adicionados depois de validação e autorização.

Desenvolvimento em branches e revisão por pull request. Não conectar domínio nem publicar a produção nesta fase.

## Execução da fundação

Requisitos sugeridos: Node.js 22 e npm. A instalação de dependências deve ser executada em ambiente conectado ao npm.

```bash
npm install
npm test
npm run build
npm run dev
```

Este front-end contém **somente uma página técnica provisória**, não o layout aprovado. O fluxo de CI verifica os testes e o build Astro sem realizar deploy.

O Studio Sanity está em `studio/` com schemas em português; ele exige uma conta Sanity e um Project ID de titularidade da cliente. A instalação e o type-check serão avaliados separadamente. Consulte `studio/README.md`.

**Status:** repositório privado, branch `chore/initial-foundation`, PR em rascunho. Ainda não há Cloudflare, domínio, CMS conectado ou publicação comercial. Gerar e versionar lockfiles antes de implantação permanente.
