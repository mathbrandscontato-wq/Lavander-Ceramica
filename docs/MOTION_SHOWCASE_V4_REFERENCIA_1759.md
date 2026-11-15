# Lavender Cerâmicas | Direção de Motion V4 — Fidelidade à Referência

**Referência recebida diretamente:** `ScreenRecording_11-14-2026 17-59-57_1.mp4`
**Analisada:** 512 × 1112, 30 FPS, 605 frames, 20.1667 segundos.
**Premissa:** replicar a *lógica temporal* e continuidade das animações, nunca usar/copiá-la como material de saída.

## Leitura específica da referência

| Tempo | Movimento visível no filme original | V4 Lavender |
|---|---|---|
| 0–1,8 s | Close de um dashboard dentro de janela escura; zoom sutil | Close hero Lavender, captura real do protótipo |
| 1,8–3,3 s | Recuo muito rápido, desfoque óptico, reveal do layout completo com logo grande ao fundo | Pull-back de escala 1.9→0.66, marca/ambiente da Lavender |
| 3,3–5,5 s | Volta à janela de site, câmera começa a avançar gradativamente | Aproximação de escala 0.8→2.08, sem corte de imagem |
| 5,5–8,9 s | Zoom imersivo da interface, fundo ao vivo, foco no elemento de ação | Hero artesanal real em 2x, pan e zoom focados |
| 8,9–11,6 s | Mergulho para outra área de dashboard, zoom contínuo | Home/catálogo, filtros e categoria Canecas |
| 11,6–13,8 s | Deslocamento/scroll, close nas métricas e tabelas | Produto real e informação, Personalizadas e Manifesto |
| 13,8–15,2 s | Recuo para mostrar a composição geral | Site completo pequeno sobre fundo institucional |
| 15,2–16,6 s | Tela escura com logotipo curto | Lavander SVG original sobre azul-escuro #191d39 já presente na paleta |
| 16,6–20,17 s | Desfoque de transição e retorno ao dashboard inicial, permitindo loop | Retorno óptico ao mesmo plano do primeiro frame |

## Problema da V3 corrigido
A V3 priorizava percorrer oito telas distintas, separando o tempo em blocos independentes. Como os screenshots de 1440×900 eram mostrados com escala ~0.8–1.2 em vídeo 1080×1920, a interface parecia pequena e cercada por margens amplas. Isso divergia do enquadramento imersivo da referência.

**Solução V4:**
- Primeiro, uma única imagem de Home atravessa sucessivos estados de zoom sem ser cortada, como na referência.
- Planos em escala 2.1–2.75 cobrem mais da área vertical, destacando hero, fotografia, filtros e produtos.
- Os cortes entre rotas são pontuais e acompanhados de zoom/desfoque rápido, não de longos fades translúcidos.
- Posição e aceleração de câmera usam trajetórias spline cúbicas com velocidades não nulas nos quadros-chave.
- O encerramento refaz a transição a partir de tela escura e termina com a câmera próxima da pose do primeiro frame, formando loop.

## Fontes oficiais e manutenção do escopo
- Capturas: apenas site aprovado `gh-pages@8fd5af3ef68210d10369c6d1a42a7911992815ea`, em Playwright.
- Cormorant Garamond e Inter reais do site.
- Logotipo original SVG da Lavender; sem mockup de páginas inventadas.
- Vitrine, Canecas, produto, Personalizadas e Manifesto são telas verdadeiras do protótipo aprovado.
- Assets/fotos e preços demonstrativos permanecem identificados como tal.
- Não houve alteração de produção, front-end, Sanity ou checkout.

## QA e aprovação
Render de 605 frames a 1080×1920 @30 fps, H264, áudio original AAC, versão silenciosa e preview.
Conferir continuidade nos cortes dos frames 261, 321, 368, 407, 425 e 437, na abertura do bumper em 453 e na retomada em 500.
Ajuste de motion requer aprovação criativa antes de substituir V3 como final; não fazer merge ou deploy automático.
