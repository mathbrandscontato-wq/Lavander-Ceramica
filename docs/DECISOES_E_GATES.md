# Decisões e gates — Especificação V3

Fonte de verdade: Especificação de Implementação V3 da Math Brands; este repositório **não redefine telas ou conteúdo aprovado**.

## Decisão de trabalho: pausa de solicitações à proprietária
Até **13/10/2026, inclusive**, não realizar contato, convite, envio de e-mail, pedido de aprovação, treinamento ou qualquer alteração que notifique a Marina. **Primeira janela para solicitar decisões: a partir de 14/10/2026**, mediante combinação com a Math Brands. A data marca a liberação de contato, não uma autorização implícita de publicação.

Trabalho interno permitido neste período: código, testes, documentação, componentes neutros, estrutura editorial e revisão técnica dentro do repositório **privado** da Math Brands.

## Gates preservados
- **GATE 0 — escopo:** VIS-01 a VIS-10, conflitos CON-01 a CON-08 e pendências PEN rastreáveis; sem redesign.
- **GATE 1 — infraestrutura:** Astro buildado, Studio compilado; Cloudflare Pages e domínio ainda **não configurados**. Sanity ID `t4nkzeaq` criado na conta da cliente. No registro de 11/10/2026 há Growth Trial com retorno anunciado ao Free; não contratar upgrades.
- **GATE 2 — estrutura:** componentes Header/Footer/ProductCard/HeroMedia são bases técnicas, **não visuais homologadas**. Tokens, fontes e logos continuam sem original.
- **GATE 3 — telas:** bloquear Home mobile CON-01/03, personalização mobile CON-02 e categoria Canecas CON-04 até resolução. Nenhuma transposição por suposição.
- **GATE 4 — comercial:** checkout, carrinho, WhatsApp de pedido, formulários, newsletter, conta e pedidos estão **fora** do trabalho atual.
- **GATE 5 — aceite:** comparativos por screenshot/VIS, QA de acessibilidade e performance, revisão criativa e validação da proprietária quando autorizada.
- **GATE 6 — publicação:** links, texto real, direitos de mídia, segurança, domínio/HTTPS, contingência e autorização expressa.

## Fluxo editorial preparado
O Studio contém painel estruturado, textos editáveis e controle de publicação para documentos específicos. **Ainda não foi implantado**. Campos editoriais não substituem aprovação dos designs; publicar documento no dataset público pode deixá-lo acessível diretamente via API mesmo sem estar no site. Draft deve ser usado para conteúdo não aprovado.

## Próximas tarefas sem envolver a cliente
- Confirmar CI dos schemas, verificação de build e testes de catálogo.
- Versionar lockfiles para builds reprodutíveis quando possível.
- Especificar o onboarding e FAQ para a futura operadora.
- Preparar checklist técnico para a fase de homologação visual.
