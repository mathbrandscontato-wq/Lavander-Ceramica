# LAVENDER CERÂMICAS | M3 — Auditoria responsiva e funcional da prévia

**Data:** 23/10/2026 · **Branch:** `feat/m3-visual-ux-qa`, origem `3ce4339ed236a65f1d4e426b7eb2f8bb41f3c465` (M2g/PR #9).
**Status:** **PASSOU NA HOMOLOGAÇÃO TÉCNICA DE PRÉVIA**, mas **NÃO É ACEITE VISUAL DEFINITIVO NEM HOMOLOGAÇÃO COMERCIAL**.

## Evidência GitHub verificável
**[GitHub Actions M3 — run 39960395633](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39960395633): PASSOU**.
- 178 checagens de navegador Chromium: **178 passaram, 0 falharam**; 4 bloqueios documentados.
- O job também executou `npm test` (suite anterior) e `npm run build` sem falhas.
- Artefato privado `lavender-m3-browser-evidence` (10 screenshots + `m3-results.json`), gerado em 23/10/2026 com retenção de 7 dias, até 30/10/2026. Abrir o workflow no GitHub para acesso ao artefato.
- O bundle Playwright-core foi instalado só no runner via `npm install --no-save`; não adicionamos dependência à aplicação ou processos de produção.
- Não houve deploy, acesso ao Sanity de produção nem integração comercial.

## Matriz de rotas e larguras
| Página | Larguras testadas | Evidência |
|---|---|---|
| Home `/` | 320, 390, 768, 1440px | HTML pt-BR, H1, main, noindex, overflow, 9 cards, filtros funcionais |
| Categoria `/categoria/canecas/` | 320, 390, 768, 1440px | 9 posições, filtros, ordenação, links internos, sem overflow |
| Coleção `/colecoes/personalizadas/` | 320, 390, 768, 1440px | 8 posições de referência, responsividade, links e estrutura |
| Produto `/produto/amostra-tecnica/` | 320, 390, 768, 1440px | Galeria, tabs/painéis, botões e foco básico (sem fluxo de pagamento) |
| Manifesto `/manifesto/` | 320, 390, 768, 1440px | Hierarquia semântica, texto e foto placeholder, responsividade |

As capturas foram geradas em `390` e `1440px` para todas as cinco páginas: 10 arquivos PNG. Não foram anexadas nem comparadas diretamente contra a fonte visual VIS original, que não consta como imagens controladas no repositório.

## Testes funcionais e de acessibilidade
**PASSOU**:
- HTTP 200 em todas as páginas testadas nos quatro viewports; idioma pt-BR, índice robots noindex e um H1 por rota.
- Conteúdo principal identificável e ausência de overflow horizontal mensurável.
- Home: filtro `Canecas` exibe subconjunto, atualiza `aria-pressed`, e `Todos` restaura nove posições.
- Categoria: filtro `Frases` reduz o catálogo, ordenação mantém filtro ativo.
- Detalhe: galeria muda o item ativo e as abas mostram o painel correspondente com `aria-selected` atualizado.
- Navegação interna e âncoras existentes resolvem em URLs válidas no preview local.

**Limitação:** isto não equivale à auditoria integral WCAG 2.2 AA; contrastes, leitor de tela, ordem de tabulação em todas as telas e fidelidade de fontes/ícones ainda exigem inspeção.

## Quatro bloqueios pendentes, não erros de execução
| ID | Estado | Descrição | Responsável |
|---|---|---|---|
| M3-MOBILE-NAV | BLOQUEADO | Em 390px o menu é um pseudo-elemento `Menu · pendente` e não oferece navegação acessível. Implementar adaptação visível só após direção criativa aprovar o mobile. | Matheus (design) + desenvolvimento |
| M3-ASSETS | BLOQUEADO | Logo vetorial, fontes licenciadas, fotos das peças e vídeo hero continuam ausentes. Placeholders devem continuar identificados como tais. | Mariana/Math Brands |
| M3-VIS | BLOQUEADO | Pranchas VIS aprovadas e M01 não estão anexadas em formato que permita comparação de screenshot/medidas nesta branch. Não atribuir nota de fidelidade automaticamente. | Direção criativa |
| M3-CHECKOUT | BLOQUEADO | Carrinho, checkout, pedido e política comercial são páginas complementares ainda não aprovadas e sem gateway/frete real. Não ligar CTAs fictícios. | Direção criativa + engenharia |

## Gate e plano de execução após M3
1. **Visual:** Matheus revisa as 10 capturas e aprova/revisa adaptação mobile, menu acessível, checkout/carrinho e conflitos VIS; recuperar arquivos originais da marca.
2. **Editorial:** Mariana confirma conteúdo real, primeira coleção, fotos e direito de imagem; preparar onboarding Sanity em ambiente isolado.
3. **Comercial:** escolher entre WooCommerce e Nuvemshop somente após testar experiência operativa equivalente e orçamento total 12/24m. Nenhuma escolhida definitivamente.
4. **Pagamentos/frete:** obter contas sandbox legítimas, dados de embalagem e CEP, testar pagamentos assinados/reconsulta, persistência, cancelamento tardio e erro de cotação. Helpers M2g de mock **não** autorizam venda.
5. **Publicação:** exigir hospedagem compatível, cron de host, DNS/HTTPS, backup/restore, acesso/permissões e autorização da cliente.

**Gate M3 técnico:** PASSOU; **Gate M3 visual:** PENDENTE; **Gate M4 comercial:** BLOQUEADO. Main, gh-pages e Sanity production permaneceram intocados.
