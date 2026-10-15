# Lavender Cerâmicas — base de engenharia

Repositório de desenvolvimento do site Lavender Cerâmicas, gerenciado inicialmente pela Math Brands e com transferência de titularidade planejada para a cliente.

**Status desta branch:** estrutura navegável do Protótipo A para revisão; fidelidade visual e mídia bloqueadas por originais pendentes. Sem publicação, domínio ou integração comercial. Não constitui entrega visual final.

O README original cita a especificação V3 como referência de governança. Ela não foi fornecida nem localizada nesta execução. A implementação usa somente o escopo explicitamente autorizado pelo Matheus e os documentos disponíveis. A conferência da V3 permanece registrada em `docs/PENDENCIAS.md`.

## Executar

Requer Node.js 20 ou superior. Não há dependências de produção ou instalação de pacotes.

```sh
npm run dev
```

Abra `http://localhost:4173/loja`. O servidor é exclusivamente local e aceita acesso somente em loopback.

```sh
npm run check
npm test
npm run build
```

A build gera a aplicação estática em `dist/` e uma prévia independente em `dist/Lavender_Previa_Estrutural.html`. Abra esse HTML diretamente no navegador, sem servidor. A versão independente usa rotas no fragmento (`#/loja`), mantendo os mesmos destinos lógicos. O catálogo é incorporado durante a build a partir do JSON canônico, sem uma segunda lista manual.

## Escopo

- Home, Loja, categorias, coleção de personalizáveis, detalhes, personalização e Manifesto.
- Carrinho, checkout e confirmação estritamente fictícios, em memória. Endereço de teste fixo; não são solicitados dados pessoais, cartão, CPF ou Pix.
- `/loja`: chips Todos / Canecas / Pratos / Tigelas / Decoração, busca, ordenação e aprimoramento de hover com fallback seguro.
- Não há autenticação, backend, banco, analytics, CMS, envio ou integração externa.
- Não há configuração de deploy, domínio ou workflow de publicação automática.

## Imagens e identidade

O JSON original é preservado byte a byte em `public/data/CATALOGO_DEMONSTRATIVO.json`. Todas as fotos estão como `SOURCE_ASSET_PENDING`. Não foram inventadas fotos ou recortadas pranchas para simular assets finais. As áreas ausentes exibem estados explícitos. Logo textual, área da ilustração e fontes de sistema são provisórios; não representam reprodução final da marca.

Quando houver fotos autorizadas, adicione os arquivos em `public/assets/` e associe cada ID a um caminho `/assets/...` em `public/data/media.json`. Chaves institucionais previstas: `hero`, `custom-banner`, `manifesto` e `footer-art`. O mapeamento de mídias é separado do catálogo e não altera IDs, nomes ou preços. O HTML independente precisa ter as mídias incorporadas em uma etapa futura; hoje usa os mesmos estados pendentes, sem requisições externas.

Antes de fechar a UI, substituir marca e tipografia apenas pelos originais aprovados, medir e comparar. Consultar `docs/PENDENCIAS.md` e `docs/QA.md`.
