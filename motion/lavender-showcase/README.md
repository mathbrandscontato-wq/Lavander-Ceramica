# Lavender Cerâmicas | Site Showcase V1

**Escopo:** motion de portfólio isolado da aplicação comercial. **Fonte:** branch `feat/m5-preview-media-payment-pilot` do Astro; protótipo visual aprovado `https://lavender.mathbrands.com.br`.

**Aviso:** o vídeo de referência `ScreenRecording_11-14-2026 17-59-57_1.mp4` não estava disponível; o storyboard de oito cenas foi utilizado, sem comparação quadro a quadro.

O pipeline GitHub Actions instala a app Astro isolada, captura cinco rotas reais em Chromium, valida os filtros e a galeria, renderiza a composição Remotion de 605 frames em H264 1080x1920 a 30fps, exporta versão com áudio original sintetizado, versão silenciosa e prévia 540x960. Faz QA via ffprobe e disponibiliza o artefato no Actions, sem deploy ou merge.

## Storyboard efetivo
| Cena | Frames | Início–fim | Conteúdo |
|---|---|---|---|
| 01 | 0–44 | 0–1.50s | Home — close hero |
| 02 | 45–110 | 1.50–3.70s | Home — revelação |
| 03 | 111–191 | 3.70–6.40s | Home — tipografia |
| 04 | 192–272 | 6.40–9.10s | Vitrine e filtros |
| 05 | 273–350 | 9.10–11.70s | Canecas — filtro |
| 06 | 351–425 | 11.70–14.20s | Galeria demonstrativa |
| 07A | 426–479 | 14.20–16.00s | Personalizadas |
| 07B | 480–533 | 16.00–17.80s | Manifesto |
| 08 | 534–604 | 17.80–20.17s | Nome Lavender |

Imagens do Astro são ilustrativas e permanecem identificadas assim, inclusive no vídeo; não são fotos aprovadas de SKUs reais. Não há compra, pagamento ou simulação de estoque. A marca vetorial original ainda não está disponível: encerramento usa nome com tipografia Georgia da app. Trilha instrumental criada por síntese, sem trechos de terceiros.

### Fonte visual
Astro na própria branch base: `/`, `/categoria/canecas/`, `/produto/amostra-tecnica/`, `/colecoes/personalizadas/`, `/manifesto/`. Referência estática: `https://lavender.mathbrands.com.br`. A comparação visual do snapshot aprovado depende de acessibilidade do domínio no runner; a captura registra esse status no relatório.
