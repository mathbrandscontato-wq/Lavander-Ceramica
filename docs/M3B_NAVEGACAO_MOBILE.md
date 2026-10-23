# LAVENDER CERÂMICAS — M3b | Proposta de navegação mobile

**Data:** 23/10/2026. **Origem:** PR #10, QA M3. **Branch:** `feat/m3b-mobile-navigation-preview`.
**Estado:** **IMPLEMENTAÇÃO EXPERIMENTAL PASSOU NO QA, AGUARDA APROVAÇÃO VISUAL DO MATHEUS.**

## Motivo da correção
A auditoria de UX M3 identificou que o header no mobile, em 390px, usava um pseudo-elemento "Menu · pendente". Não era possível acioná-lo com teclado, touch ou leitor de tela; toda a navegação textual desktop ficava oculta. A página só mantinha o logotipo como link.

## Proposta implementada
- No header existente, foi incluído botão semântico **Menu** com `aria-expanded` e `aria-controls`, sem alterações na composição desktop aprovada.
- Ao acionar, exibe painel navegável para **Loja**, **Canecas**, **Peças personalizadas** e **Manifesto**, todas rotas existentes no preview. Não foi criada nenhuma página nova.
- Fechamento por novo clique, tecla **Esc**, clique fora, navegação a um destino ou expansão da largura além de 760px; ao fechar com Esc o foco retorna ao botão.
- O painel usa as cores, bordas, tipografia e sombras já presentes nos tokens **provisórios** da prévia. É proposta responsiva, não decisão visual homologada.
- Mantidos os ícones comerciais decorativos, textos de amostra, fotos provisórias, Sanity production e ausência de checkout real.

## Evidência de navegador
[GitHub Actions 39961453154](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39961453154): **198 verificações aprovadas, 0 falhas**. Abrange cinco páginas em 320, 390, 768 e 1440px, rotas/âncoras, filtros, galeria/abas, overflow, abertura de menu e foco/teclado, gerando dez capturas desktop/mobile e `m3-results.json`.

| Cenário | Status |
|---|---|
| Botão nativo mobile visível a 390px | PASSOU |
| Painel abre e contém somente URLs existentes | PASSOU |
| `aria-expanded` reflete abertura | PASSOU |
| Escape fecha o painel | PASSOU |
| Foco volta ao disparador após Escape | PASSOU |
| Sem overflow em 320/390/768/1440 | PASSOU |
| Testes anteriores de cinco páginas | PASSOU |
| Preservação do layout desktop | NÃO COMPARADO COM REFERÊNCIA VIS ORIGINAL |
| Versão mobile aprovada criativamente | PENDENTE DE APROVAÇÃO |

## Limitações e decisões pendentes
Esta proposta não resolve conflitos VIS de quantidade de cards, filtros e conteúdo mobile B1/B2/B3; não valida marca/logo, fotos, vídeo hero ou tipografia final; e não cria carrinho/checkout. O menu deverá ser comparado com telas mobile aprovadas ou ajustado após revisão do diretor criativo antes de qualquer merge produtivo.

Ajustes de CSS e HTML ficaram em `src/components/layout/Header.astro` e `src/styles/base.css` apenas na branch experimental. Testes estão em `tests/m3-browser-smoke.mjs` e workflow `.github/workflows/m3b-mobile-qa.yml`.

**Sem deploy, merge, conta comercial, produção ou contratação.**
