# Lavender · entrega V2 da demonstração

15/10/2026. Matheus autorizou fotos provisórias substituíveis, vetorização do logo, escolha das fontes e decisões até publicação sem revisão intermediária. Essa autorização atual substitui o bloqueio anterior de publicação da demonstração. Não habilita venda, pagamento ou coleta real de dados.

## Implementação

Doze fotos provisórias criadas com `image_gen`: nove produtos, hero de processo artesanal, banner de personalizados e still life do Manifesto. Foram examinadas visualmente, otimizadas em WebP e associadas por ID em `public/data/media.json`. Os prompts estão em `IMAGE_PROMPTS.json`; caminhos, tamanhos e hashes estão em `ASSET_MANIFEST.json`. Não são fotografias dos produtos reais da Marina. O aviso global informa fotos e valores ilustrativos.

`public/assets/lavender-logo.svg` é vetorial, sem imagem raster incorporada. O símbolo botânico foi traçado da A6; a palavra LAVENDER e o descritor CERÂMICAS foram reconstruídos em contornos de fontes para manter nitidez, com a composição da referência. É uma reconstrução para o site, não o arquivo-mestre original nem uma promessa de equivalência exata. O rodapé usa `footer-art.svg`, traçado da ilustração A6.

Tipografia escolhida: Cormorant Garamond 400/500 e itálica 400 nos títulos; Inter 400/500/600 nos textos e interface. Arquivos WOFF servidos pelo próprio site; licenças OFL incluídas em `public/assets/fonts/`. Fontes oficiais: [Cormorant](https://github.com/CatharsisFonts/Cormorant) e [Inter](https://github.com/rsms/inter); distribuições consultadas no [repositório Google Fonts](https://github.com/google/fonts).

A V3 citada pelo README não foi fornecida. O escopo desta demonstração segue a autorização atual e os documentos disponíveis, sem tratar essa ausência como impedimento à decisão delegada de publicação.

## Catálogo e movimento

JSON canônico preservado. Todos 9, Canecas 4, Pratos 2, Tigelas 2, Decoração 1. Busca por nome/tipo, ordenação e limpeza de filtros funcionam localmente. Personalização restrita a 01/02/05; solicitações sem valor final ficam fora do checkout simulado.

O hover da Loja usa aproximação de foto com máscara dentro do próprio card, atraso de 125 ms e cancelamento por saída, clique, scroll, redimensionamento, mudança de filtro e navegação. Não captura cliques, não altera o layout e não depende de GSAP. Touch, teclado e movimento reduzido preservam navegação sem animação.

O efeito único cobrindo 2×2 não foi aplicado: títulos e preços estão entre as duas linhas e seriam encobertos. Foi adotado o fallback seguro permitido no direcionamento. A geometria do agrupamento continua medida/testada; não se declara implementado o efeito completo do tutorial.

## Verificações realizadas

- PASSOU: sintaxe JS, oito testes Node de dados/lógica e build estática.
- PASSOU: comparação binária do JSON canônico.
- PASSOU: dez verificações de integração em DOM emulado: Loja, filtros/aria-pressed, busca/interseção/vazio/limpeza, ordenação, Home/categorias/coleção, compra fictícia, personalização sem pagamento e escape de texto, rotas inválidas/elegibilidade, Manifesto/assets globais e ausência de exceções JS.
- PASSOU: inspeção visual dos doze arquivos gerados e dos SVGs renderizados. Validação de abertura/decodificação das imagens e leitura dos arquivos de fonte.
- NÃO EXECUTADO: QA de renderização em navegador, screenshots nos viewports, touch real, leitor de tela, zoom, Lighthouse/CWV e motion visual. O ambiente não expõe o controlador de navegador requerido. DOM emulado não mede layout nem substitui esses testes. Não são declaradas conformidade ou métricas de performance.

Um erro no empacotamento do HTML independente foi detectado no teste DOM (alias `esc` ausente) e corrigido antes desta publicação. O teste completo passou após a correção.

## Manutenção pela Marina

Para substituir uma foto, exportar WebP e sobrescrever o arquivo correspondente em `public/assets/product-01.webp` a `product-09.webp`; alternativamente alterar o caminho do mesmo ID em `media.json`. Não alterar IDs para trocar imagens. Mídias institucionais: `hero.webp`, `custom-banner.webp`, `manifesto.webp`.

Executar `npm test`, `npm run check` e `npm run build`. A prévia independente incorpora as mídias novamente a cada build. O código não inclui painel administrativo, por não fazer parte do escopo; as trocas são por arquivo/repositório.

Publicação no endereço gerado de Sites, com acesso privado padrão. Nenhum domínio da cliente, integração financeira, mensagem, estoque real ou rastreamento foi configurado.
