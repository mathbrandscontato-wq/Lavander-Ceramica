# Lavender Cerâmicas — Showcase V3 | Direção de movimento

**Revisão:** 14/11/2026, após feedback de fluidez e referência audiovisual recebida.

## Leitura da referência REAL

Arquivo analisado: `ScreenRecording_11-14-2026 18-08-25_1.mp4` (29,9 s, 512 × 1112, 30 FPS, gravação de tela de um Reels).

- Aproximadamente 0–7 s: interação com a interface do smartphone, **não é a referência de estilo**.
- Aproximadamente 7–11 s: tipografia cinética em campo claro, alternância de peso / alinhamento e revelação gráfica de uma silhueta.
- Aproximadamente 11–16 s: forma gráfica oval/olho e revelação de lettering por recortes, com movimento constante.
- Aproximadamente 17–22 s: transições marcadas por escalas da silhueta / negativo em preto; a mudança de cena conserva o vetor do movimento.
- Aproximadamente 22–29 s: metamorfose de forma e rótulos tipográficos, retrato e encerramento de marca.

**Essência adotada:** transições motivadas por movimento, variações de profundidade, relação figura/fundo e continuidade, sem imitar identidade visual, olho vermelho, silhueta nem pessoa do vídeo.

## Diagnóstico da V2

A V2 fazia cada plano sair de um repouso e entrar em outro. O easing cúbico `(.22,1,.36,1)` atingia quase todo o deslocamento logo no início da cena e criava repousos perceptíveis. Fades de sete frames com reinícios abruptos de escala e coordenadas levavam a descontinuidade. A versão cinematográfica não deve ser um slideshow de páginas.

## V3 — correções executadas

1. **Movimento de câmera:** trajetória interpolada com spline cúbica de Hermite, tangentes não nulas nos keyframes intermediários; composições não pausam a câmera a cada plano.
2. **Home:** unifica introdução, reveal de interface e exploração da hero numa única captura, com trajetória contínua, reduzindo três inícios/paradas a zero.
3. **Transições de páginas:** sobreposição de 32 frames centrada nos cortes, com easing adequado à continuidade e sem entrada em repouso.
4. **Filtros e abas:** transição com máscara circular progressiva, mantendo a transformação da tela idêntica em ambos os estados.
5. **Ritmo:** cores e imagens apenas do site. Preserva as mudanças de foco de hero para catálogo, produto, Personalizadas e Manifesto.
6. **Encerramento:** iris circular expansiva conecta a última página ao logo SVG original, mantendo a paleta da marca.
7. **Som:** acentos sintéticos leves realinhados aos cortes da V3, mantendo autoria original e evitando amostras comerciais.

## Regras de fidelidade

- Fonte visual: commit aprovado de `gh-pages` `8fd5af3ef68210d10369c6d1a42a7911992815ea`.
- Tipografia oficial visual existente: Cormorant Garamond e Inter.
- Logotipo original SVG.
- Uso exclusivo de screenshots capturados do código real do site, sem inventar botões, galeria, novos produtos ou interfaces.
- Permanecem explícitos conteúdos demonstrativos; vídeo de referência não é usado como asset comercial.

## Critérios de aceitação

- 1080 × 1920, 30 fps, 605 frames, H.264 e AAC, 20,17 s.
- Conferir o corte de movimentos em 197/273/351/426/480 e a metamorfose do encerramento em 531.
- Não misturar a aplicação técnica Astro com o protótipo visual aprovado.
- Rever visualmente os nove quadros de referência do vídeo gerado e rodar decodificação do MP4.
- Branch isolada de motion; nenhum merge automático ou deploy comercial.
