# P01 · Home Desktop — implementação controlada (VIS-01 / Anexo A1)

Data da preparação: 11/10/2026. Responsável pelo aceite criativo: Math Brands.

## Fonte obrigatória
Documento `Lavender_Ceramicas_Especificacao_Implementacao_V3_Revisada.docx`, página A1 — "Home desktop — composição de referência final, banner de personalizados em card lavanda".

## Implementado nesta branch
- Shell A1 com hero em largura total, header claro sobreposto, marca central e recorte, tipografia editorial, apoio, CTA *Explorar a loja* com destino real à seção `#pecas`.
- Vitrine "Nossas peças artesanais", filtros funcionais por dados demonstrativos e 9 posições na disposição desktop **4 + 5**.
- Banner com foto de fundo **ainda pendente** e card lavanda à esquerda, título/CTA na composição da A1.
- Footer em três áreas com espaços destinados a logotipo e ilustração originais, sem falsos links a páginas não implementadas.
- Responsividade técnica preliminar para larguras intermediárias. A versão mobile **não recebe aceite** por CON-01/03.
- Estrutura permanece offline, com `noindex` e sem produto real, cadastro, carrinho ou vendas.

## Limites explícitos
- **Mídias:** placeholders cromáticos/esquemáticos substituem vídeo/poster, 9 fotografias e foto do banner até originais autorizados. **Não são as peças reais da cliente.**
- **Identidade:** textos da prancha servem exclusivamente à homologação privada; fonte Georgia/Arial, cores e medidas são aproximações temporárias. Não reproduzir símbolo de marca por imaginação; aguardar vetor.
- **Preços e nomes:** catálogo `src/data/homePreview.mjs` contém SOMENTE posições de amostra e legendas "Preço a confirmar". Não enviar os dados ao Sanity, não tratar como vitrine real.
- **CTA do banner:** réplica visual sem evento/link até definição comercial/rota. Ícones de busca, conta e carrinho são estritamente decorativos no preview; não há fluxo oculto.
- **Header:** links ativos apenas para âncoras existentes na própria prévia. "Sobre" não é link enquanto a página e o destino não estiverem homologados.
- **Mobile:** estrutura em coluna/duas colunas apenas para inspeção técnica; diferenças B1 (8×9, favoritos, newsletter, "Momentos" etc.) **não resolvidas**.
- **Crítica P01:** não declarar G2/aceite visual antes da comparação em screenshot com A1 e medição M01. G1 foi autorizado neste chat apenas para desenvolvimento da Home Desktop.

## Critérios de verificação
- [ ] `npm test` e `npm run build` concluídos no GitHub Actions.
- [ ] Sem rotas e CTAs comerciais fictícios ou links quebrados.
- [ ] 9 cards originais de prévia no desktop (4 + 5); filtro por categorias retorna subconjuntos.
- [ ] Layout revisado visualmente em viewport 1440/1280 e 1920; corrigir diferenças.
- [ ] Conteúdo real e assets originais aprovados pela direção e pela Marina posteriormente.
- [ ] Homepage mobile aguarda CON-01/03 e destinação do nono item.
- [ ] Capturas de referência A1 e evidência de comparação anexadas em área privada de QA (não versionar imagens sem licença).


## Revisão P01-R1 — 13/10/2026

Pacote de cinco correções aprovado pela direção de arte neste projeto. A revisão permanece uma **implementação para aprovação**, não o aceite G2 nem a liberação para publicação.

1. **Margens e containers:** aumentada a margem editorial de hero, vitrine e footer; banner passou a ter largura própria.
2. **Header e tipografia:** recorte central ampliado e aprofundado, melhor hierarquia de marca provisória e título, sem substituir o logo vetorial real.
3. **Filtros:** uma única lista de nove cards, com grid CSS 4+5 no estado "Todos". Ao escolher categoria, o grid reorganiza os cards visíveis sem deixar espaços da antiga divisão em duas grades.
4. **Banner:** ampliadas altura, presença do card lavanda e escala do título; fotografia continua pendente.
5. **UX:** `headerOverlay` tornou-se opção por rota; header/footer usam âncoras para home, ícones de compra permanecem decorativos; aviso de homologação não desloca o conteúdo.

### Critérios de aceite parcial
- Automatizar `npm test` e `npm run build`.
- Produzir nova captura 1440px e comparar com A1 e implementação anterior.
- Confirmar visualmente sem distorções graves; a nota de fidelidade final depende dos ativos reais e M01.
- Mobile B1 e elementos de personalização permanecem bloqueados por conflitos da V3.
- **Não contatar Marina, não criar convites, não publicar, não mesclar em main.**
