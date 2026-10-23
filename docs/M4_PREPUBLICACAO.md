# LAVENDER CERÂMICAS | M4 - PRÉ-PUBLICAÇÃO
Data: 23/10/2026. Preparação de release candidate na branch chore/m4-prepublication-release-gate, sem publicação, merge, cobrança, alteração de DNS ou Sanity de produção.

## Decisão
NO-GO PARA LANÇAMENTO COMERCIAL. Pode-se compilar uma prévia técnica e guardar arquivos para revisão. Não se deve oferecer compras reais até todos os gates bloqueantes terem sido encerrados com evidências.

## Evidências já validadas e reutilizadas
- M2b, run 39701256935: Woo real efêmero protegeu estoque de peça única no checkout Store API com pagamento offline fictício.
- M2c, run 39860801388: reserva nativa, concorrência e expiração de hold validada no laboratório.
- M2d, run 39862947526: cancelamento de pedidos vencidos quando handler Woo é acionado.
- M2e: três falhas de entrega cron documentadas.
- M2f, run 39933582098: correção de cron HTTP externo e cancelamento Woo validado somente em laboratório.
- M2g, run 39954937643: 56 testes de contratos locais de assinatura e frete simulados; nenhum Pix, cartão ou Correios real.
- M3, run 39960395633: 178 verificações browser, cinco rotas e quatro larguras, todas passaram.
- M3b, run 39961453154: 198 verificações passaram com botão mobile funcional; revisão visual ainda não aprovada.
- M3b, run 39961836392: build e tipos Astro/Sanity passaram.

## Inventário das versões existentes
1. main permanece base de engenharia antiga; não representa a loja atual.
2. gh-pages é a demonstração estática existente, CNAME lavender.mathbrands.com.br, SHA em 23/10/2026: 8fd5af3ef68210d10369c6d1a42a7911992815ea.
3. feat/prototipo-a-catalogo-interativo contém 12 fotografias sintéticas temporárias, SVG do logotipo reconstruído e fontes Cormorant Garamond / Inter com licenças OFL. Fontes e mídia rastreadas em docs/ENTREGA_V2.md e docs/ASSET_MANIFEST.json. Esses assets não equivalem a fotos de peças reais nem à marca mestre; não fazer importação automática para a fundação Astro.
4. Os PRs #1-#11 são uma sequência de desenvolvimento; não mesclar todos automaticamente sem planejar revisão, conflitos e segurança.
5. O repositório GitHub é PUBLICO na API em 23/10/2026, apesar de documentos históricos dizerem privado. Qualquer artefato acessível a leitores do repo não é repositório sigiloso. Não subir credenciais, dados financeiros, fichas de pedidos nem imagens não autorizadas.

## Impedimentos comerciais críticos
- Catálogo Astro ainda é fictício e usa marcadores como Preço a confirmar e Peça ilustrativa.
- Checkout real, carrinho, pedido, regras de impostos/políticas e página de status não estão implementados na fundação Astro.
- WooCommerce e Nuvemshop seguem candidatos; custos totais de hospedagem, gateway, integrações e manutenção 12/24 meses não foram cotados/comparados com piloto equivalente.
- Não há prova com sandbox autorizado de Pix/cartão, webhooks reais autenticados, idempotência persistente e confirmação tardia após reposição de estoque.
- Não há cotação Correios em ambiente autorizado, origem/postagem e pacote com medidas reais.
- Sanity Studio compilou mas a Mariana não homologou cadastro/publicação/administração; não alterar production durante a prova.
- Pranchas VIS A1-A7/B1-B6 precisam de arquivos visuais originais para comparar. Menu M3b é proposta aguardando aprovação; demais conflitos mobile continuam.
- O Astro mantém noindex e robots Disallow intencionalmente. Não alterar para indexável enquanto a loja não for aprovada.
- Não há lockfiles versionados de Node/Astro ou Studio, importante para builds reproduzíveis e deploy.

## Entregáveis deste gate
- release/approval-gates.json define responsáveis e aceite por evidência; estados pendentes não são falsificados.
- scripts/prepublication-readiness.mjs examina cinco rotas geradas, placeholders, carrinho/checkout, SEO de prévia e aprovação formal; não chama rede.
- tests/prepublication-readiness.test.mjs verifica comportamento NO-GO, prova ausente, flags de prévia e IDs duplicados.
- .github/workflows/m4-prepublication.yml compila artefato revisável dist, relatório legível e JSON com retenção de 7 dias, sem deploy. Job go-no-go deve FALHAR intencionalmente enquanto houver blockers.
- docs/M4_PLANO_ROLLBACK.md traz roteiro de snapshot e restauração condicionado a autorizações futuras.
- docs/CHECKPOINT_POS_M4.md consolida o handoff.

## Como abrir a prévia
No GitHub, abrir o run do workflow M4 e obter o artefato lavender-m4-candidata-previa-e-diagnostico. Os arquivos dist são HTML estático de teste com noindex e dados fictícios. Podem ser executados em servidor local; não são uma URL pública de homologação e não recebem pedidos.

## Próximo gate para GO
Rever telas e referências VIS, obter ativos autorizados, definir plataforma/provedores e titularidade, completar comércio real, executar pagamento/frete por sandboxes legítimas, aprovar privacidade/políticas, backup restaurável e hospedagem com HTTPS, cron e domínio. Depois obter o aceite operacional da Mariana e preparar o PR de integração comercial separado. Não confundir aprovação técnica automática com autorização do cliente.

## Resultado da primeira execução do gate M4 (23/10/2026)
- Evidência real: https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39986164455
- Job de build e relatório: **PASSOU**. Suite Node com **60 testes aprovados, 0 falhas**; build Astro compilado; foi armazenada candidata de preview estático mais relatórios por 7 dias.
- Relatório: **NO_GO**, com **22 bloqueios** e 0 de 16 gates humanos formalmente aprovados. Os 22 são 16 decisões/validações externas + 6 bloqueios detectados automaticamente (placeholders, catálogo fictício, carrinho, checkout, noindex, robots); isso não significa 22 erros de implementação no mesmo nível.
- Job de liberação: **FALHOU INTENCIONALMENTE**, impedindo rotular a candidata como publicável sem evidência. Não houve publicação ou cobrança.
- Avisos sobre builds reproduzíveis (lockfiles) e revisão de visibilidade pública constam do runbook; uma alteração posterior na leitura da visibilidade exige novo run para atualização do diagnóstico.
