# QA da base do Protótipo A

15/10/2026 · Verificação local, sem publicação · não representa homologação visual.

## Resultado executado

| Verificação | Estado | Evidência |
| --- | --- | --- |
| Sintaxe dos três módulos JS | PASSOU | `npm run check`, Node 24.19.0 |
| IDs, ordem canônica e campos demonstrativos | PASSOU | teste Node `nove IDs únicos...` |
| Categorias e IDs exatos 9/4/2/2/1 | PASSOU | teste Node `filtros retornam IDs exatos...` |
| Busca sem acento, interseção e sort determinístico | PASSOU | teste Node `busca normalizada...` |
| Elegibilidade e destino por SKU | PASSOU | teste Node `elegibilidade e destinos...` |
| Quantidades inválidas e limites de teste | PASSOU | teste Node `quantidade rejeita...` |
| Escape do texto livre | PASSOU | teste Node `texto livre...` |
| Agrupamento espacial 2×2, lista fora de ordem | PASSOU | teste Node `bloco 2×2...` |
| Fallback geométrico para 1–3 cards/irregular | PASSOU | teste Node `grades pequenas...` |
| Build estática e HTML independente | PASSOU | `npm run build` |
| JSON original inalterado | PASSOU | comparação binária com JSON extraído do pacote |
| HTML independente sem import/export de módulo residual | PASSOU | inspeção e verificação de sintaxe do script gerado |

## Não executado ou bloqueado

| Verificação | Estado | Limite |
| --- | --- | --- |
| Filtros, busca, sort e limpeza no DOM | NÃO EXECUTADO | Sem navegador de QA disponível; testes acima verificam lógica pura |
| Hover com imagens, troca rápida, scroll, resize e limpeza | NÃO EXECUTADO | Todas as fotos ausentes; sem navegador de QA |
| Efeito completo 2×2 | NÃO EXECUTADO | Não implementado; fallback documentado |
| Touch/teclado, foco modal e primeiro toque | NÃO EXECUTADO | Código preparado, precisa teste real |
| 1440×900 / 1280×800 / 1024 / 768 | NÃO EXECUTADO | Sem navegador de QA |
| 390×844 / 375×812 / 320 px / paisagem | NÃO EXECUTADO | Sem navegador de QA |
| Zoom 200% / movimento reduzido | NÃO EXECUTADO | Media query e estilos incluídos; sem teste real |
| Rotas, carrinho, personalização e checkout no DOM | NÃO EXECUTADO | Fluxo implementado; precisa teste de integração no navegador |
| Comparativos antes/depois e screenshots | NÃO EXECUTADO | Não havia código anterior; faltam assets e navegador. Referências não são “antes” de um site implementado |
| Lighthouse / CWV / leitor de tela / contraste real | NÃO EXECUTADO | Nenhuma métrica ou conformidade declarada |
| Equivalência visual às pranchas | NÃO EXECUTADO | Identidade, tipografia, mídias e medição M01 pendentes |

Não havia aplicação anterior para regressão executável; foram preservadas as referências documentais, não uma baseline de código. A entrega é uma base estrutural para revisão, não o status “catálogo interativo pronto”.

## Matriz demonstrativa

| Filtro | Quantidade | IDs LV-DEMO |
| --- | --- | --- |
| Todos | 9 | 01,02,03,04,05,06,07,08,09 |
| Canecas | 4 | 01,03,05,07 |
| Pratos | 2 | 02,09 |
| Tigelas | 2 | 04,06 |
| Decoração | 1 | 08 |

## Roteiro de revisão manual

1. Abrir o HTML independente ou executar `npm run dev` e visitar `/loja`.
2. Selecionar cada chip; buscar “caneca” em Pratos; conferir vazio e Limpar filtros; mudar ordenação.
3. Conferir nove SKUs na Home e grade 4+5; reduzir janela, conferir duas colunas e nona peça.
4. Abrir produto comum; incrementar quantidade; adicionar; editar e remover no carrinho; finalizar simulação. Recarregar limpa o estado.
5. Abrir personalizável; confirmar três modelos elegíveis; exigir ideia; criar solicitação sob orçamento sem pagamento.
6. Tentar `/produto/caneca-personalizada` e `/personalizar/caneca-estante`: devem mostrar página não encontrada, evitando cobrança de personalizável como comum.
7. Usar Tab/Enter/Escape em filtros, menu, diálogo e abas. Testar zoom e movimento reduzido.
8. Após fornecer mídias, validar fallback hover e imagem ausente, sem sobreposição de títulos/CTAs e sem clique interceptado.

## Serviços e custo operacional desta versão

Sem serviço externo, dependência, fonte remota, banco ou publicação. O GitHub armazena somente código e documentação textual. A prévia funciona localmente; a infraestrutura final permanece pendente.
