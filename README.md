# Lavender Cerâmicas — base de engenharia

Repositório de desenvolvimento do site Lavender Cerâmicas, gerenciado inicialmente pela Math Brands e com transferência de titularidade planejada para a cliente.

**Status desta branch:** demonstração com fotos provisórias, logo em SVG e fontes locais Cormorant Garamond/Inter. Publicação autorizada por Matheus em 15/10/2026; sem domínio próprio ou integração comercial. Dados e compra permanecem demonstrativos. Veja `docs/ENTREGA_V2.md`.

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

A build gera a aplicação estática em `dist/` e uma prévia independente com fotos e fontes incorporadas em `dist/Lavender_Previa_Estrutural.html`. Abra esse HTML diretamente no navegador, sem servidor. A versão independente usa rotas no fragmento (`#/loja`), mantendo os mesmos destinos lógicos. O catálogo é incorporado durante a build a partir do JSON canônico, sem uma segunda lista manual.

## Escopo

- Home, Loja, categorias, coleção de personalizáveis, detalhes, personalização e Manifesto.
- Carrinho, checkout e confirmação estritamente fictícios, em memória. Endereço de teste fixo; não são solicitados dados pessoais, cartão, CPF ou Pix.
- `/loja`: chips Todos / Canecas / Pratos / Tigelas / Decoração, busca, ordenação e aprimoramento de hover com fallback seguro.
- Não há autenticação, backend, banco, analytics, CMS, envio ou integração externa.
- Não há configuração de deploy, domínio ou workflow de publicação automática.

## Imagens e identidade

O JSON original é preservado byte a byte em `public/data/CATALOGO_DEMONSTRATIVO.json`. Os campos originais `SOURCE_ASSET_PENDING` foram preservados no JSON, mas `media.json` agora associa os IDs às fotos provisórias geradas com autorização do diretor. O logo foi reconstruído em SVG a partir da prancha e a ilustração do rodapé foi vetorizada. Cormorant Garamond e Inter são servidas localmente; as licenças acompanham os arquivos.

Quando houver fotos autorizadas, adicione os arquivos em `public/assets/` e associe cada ID a um caminho `/assets/...` em `public/data/media.json`. Chaves institucionais previstas: `hero`, `custom-banner`, `manifesto` e `footer-art`. O mapeamento de mídias é separado do catálogo e não altera IDs, nomes ou preços. O HTML independente incorpora fotos, SVGs e fontes para funcionar sem requisições externas.

As decisões provisórias foram delegadas a esta implementação. Trocar os materiais pelos arquivos definitivos da Marina quando disponíveis, mantendo IDs e caminhos. Consultar `docs/ENTREGA_V2.md`.
