> ATUALIZAÇÃO 15/10/2026: registro abaixo preservado como histórico da primeira base. A direção autorizou fotos provisórias, vetorização, escolha de fontes e publicação sem conferências intermediárias. O estado atual está em `ENTREGA_V2.md`.

# Registro de pendências antes de substituições visuais

15/10/2026 · Math Brands · branch `feat/prototipo-a-catalogo-interativo`

## Fontes efetivamente verificadas

- Repositório: somente README na branch main, commit inicial `460cbe55504ff1d5a348888ece9c4688a67f0cd2`.
- Especificação de Implementação V2, DOCX disponível.
- Documentação V1 do Protótipo A e pacote de referências A1/A2/A4/A5/A6/A7/B1/B2/B3/B4/B5/B6.
- Especificação e prompt do Catálogo Interativo V1 anexados nesta conversa.
- Catálogo JSON demonstrativo e manifesto de referências do pacote, preservados.
- Autorização atual de Matheus para iniciar o código, usando branch separada e sem produção.

## Pendências bloqueantes para fidelidade final

| ID | Pendência | Tratamento nesta branch | Responsável |
| --- | --- | --- | --- |
| P01 | README cita V3; arquivo não fornecido/localizado | V2 lida; governança V3 não presumida. Conciliar antes do aceite | Matheus |
| P02 | Nove fotos com `SOURCE_ASSET_PENDING` | Estados explícitos de imagem ausente; não criamos nem recortamos fotos | Cliente/Matheus |
| P03 | Logo e símbolo botânico originais ausentes | Identificação textual provisória, sem desenho inventado | Cliente/Matheus |
| P04 | Ilustração original do rodapé ausente | Espaço reservado identificado; sem redesenho | Cliente/Matheus |
| P05 | Fontes, cores e medidas mestres não fornecidas | Georgia/Arial locais e valores CSS provisórios; MEDIÇÃO PENDENTE M01 | Matheus |
| P06 | Poster/vídeo hero, banner e foto de Manifesto ausentes | Áreas reservadas com rótulos; não há botão de vídeo sem material | Cliente/Matheus |
| P07 | Texto institucional, política, contato e perfis sociais não confirmados | Texto editorial marcado rascunho; controles informam pendência, sem URLs fictícias | Cliente |
| P08 | Hospedagem final indefinida | HTML/CSS/JS estáticos sem dependências; servidor apenas para prévia local. Compatibilidade final não assumida | Arquitetura/cliente |

## Conciliação documental para esta demonstração

A V2 é anterior à autorização de construir o protótipo. A Documentação V1 posterior permite rotas demonstrativas e carrinho/checkout fictícios. A instrução atual autoriza implementação, sem transações. Usamos a exceção apenas em memória: nenhuma API, coleta ou cobrança.

A1 rege a Home: nove produtos, quatro na primeira linha e cinco na segunda no desktop; duas colunas no mobile com nona célula isolada. Nenhum favorito, newsletter ou galeria extra de B1.

A4 rege os controles de personalização, usando apenas os três IDs elegíveis do JSON. A adaptação mobile empilha os mesmos controles como derivação para revisão, conforme Documentação V1; não é uma prancha aprovada. O conteúdo do Manifesto é um rascunho da composição A5, não depoimento confirmado da Marina.

A6/B5 orientam listagens. Não reproduzimos seus produtos divergentes: a fonte única é o JSON (9/4/2/2/1). Chips novos e módulo de hover existem apenas na Loja; filtros da Home e coleção vêm dos contratos próprios.

## Motion: estado real e limite

O código identifica grupos espaciais 2×2 por retângulos reais, sem índices fixos, e aplica o fallback simplificado com Web Animations API. Não há GSAP nem biblioteca 3D: o zoom/máscara local dispensa dependência e não muda o layout.

**A ampliação completa de bloco 2×2 ainda não foi implementada.** Na estrutura aprovada, os títulos, preços e links ficam entre as duas linhas; ampliar uma imagem sobre o bloco encobriria conteúdo ou criaria associação incorreta entre foto e SKU. A branch usa somente zoom dentro da área da foto, sem overlay clicável. O agrupamento geométrico é uma preparação técnica, não uma entrega do efeito completo.

Com todas as fotos pendentes, o módulo deliberadamente não anima placeholders. Filtros e navegação funcionam independentemente dele. O visual e a continuidade da animação sobre imagens reais aguardam fotos e QA em navegador. Não apresentar o catálogo interativo como concluído.

## Próximo aceite

Conferir a V3; fornecer assets originais/autorizados e fontes; substituir placeholders; aferir header/footer, proporções e cores; executar comparativo desktop/mobile; decidir geometria segura do efeito completo e validar a interação. Somente depois concluir fidelidade visual. Não há autorização de produção.
