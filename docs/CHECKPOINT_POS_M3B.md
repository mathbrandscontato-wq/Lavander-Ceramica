# LAVENDER — CHECKPOINT M3b (23/10/2026)
**Branch:** `feat/m3b-mobile-navigation-preview`, base `4fb51c90ee9c5620f66e58b49fdee906d8e181c9` (PR #10). **Commit final:** conferir HEAD atual do PR draft.

**Comprovado:** [M3b Actions 39961453154](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39961453154) passou **198 verificações, zero falhas**. Navegação mobile funcional a 390px, abertura, fechamento Esc, `aria-expanded`, retorno do foco e quatro rotas existentes. Sem overflow em 320/390/768/1440. Dez capturas no artefato `lavender-m3-browser-evidence` por sete dias.

**Aguardando decisão:** versão VIS mobile do Menu ainda não recebeu aceite do diretor criativo. NÃO classificar screenshots como comparação com originais. Permanecem pendentes logos, fotos, fontes, vídeos, primeira coleção da Mariana, telas carrinho/checkout e contas comerciais.

**Código:** `src/components/layout/Header.astro`, `src/styles/base.css`, `tests/m3-browser-smoke.mjs`, `.github/workflows/m3b-mobile-qa.yml`. Documentos: `docs/M3B_NAVEGACAO_MOBILE.md` e aditivo na V3.

**Próximo:** recuperar referências VIS originais e revisar visual mobile, levantar assets/embalagens/drops com Mariana, conduzir sandbox de gateway/cotação e piloto Nuvemshop equivalente. Não fazer merge, deploy ou alteração no Sanity production.
