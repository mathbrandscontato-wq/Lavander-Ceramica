# Lavender Cerâmicas — Showcase V5 | Demonstração de navegação real

## Mudança solicitada
Feedback: "Agora não faz sentido, deveria clicar nas coisas e não só aproximar."

**Correção de direção:** o site precisa ser demonstrado funcionando. Os zooms são acessórios e orientam o olhar, mas cada mudança de estado visível deve resultar de uma ação real executada no navegador.

## Storyboard de 605 frames / 20,17 segundos

| Timecode | Ação verificável | Resultado no site |
|---|---|---|
| 00:00–00:02,1 | Cursor percorre a Hero, clica **Explorar a loja** em 00:01,77 | Navegação para `/loja` |
| 00:02,1–00:04,0 | Cursor clica o chip **Canecas** em 00:03,73 | Grid reduzido para produtos da categoria |
| 00:04,0–00:06,17 | Cursor encontra e clica a **Caneca Estante** em 00:05,83 | Página de detalhe do produto |
| 00:06,17–00:09,07 | Rolagem suave até a área de detalhes, cursor clica **Cuidados** em 00:08,8 | Aba e texto de cuidados realmente alternados |
| 00:09,07–00:11,3 | Rolagem para o topo, clique no **logotipo** em 00:11 | Retorno à Home |
| 00:11,3–00:15 | Rolagem da Home até o banner, clique **Solicitar peça personalizada** em 00:14,67 | Página Peças Personalizadas |
| 00:15–00:17,2 | Cursor clica **Sobre** em 00:16,87 | Página Manifesto |
| 00:17,2–00:20,17 | Leitura da seção editorial e encerramento com logo SVG verdadeiro | Assinatura da Lavender / Math Brands |

## Precisão
1. O GitHub Actions faz checkout do snapshot `gh-pages@8fd5af3ef68210d10369c6d1a42a7911992815ea`, e aborta em caso de diferença.
2. Playwright abre o site em servidor local e **executa cliques de verdade**, sem apenas mudar `location.hash` programaticamente.
3. O script usa bounding boxes obtidos do DOM para registrar a posição exata em que cada controle foi clicado.
4. Depois de cada ação, verifica rota, estado do filtro ou aba e captura screenshot `fullPage` da página real.
5. O Remotion desenha uma seta de cursor nos pontos verificados, rola a imagem real completa para alcançar os controles e revela a captura do estado após cada clique.
6. Os sons de clique são sintetizados originalmente e alinhados aos sete frames-chave.
7. QA falha se faltar ação, estado, imagem, rota, fonte oficial, H.264, áudio AAC ou algum dos 605 frames.

## Preservação
- Logotipo SVG original e fontes Cormorant Garamond / Inter do protótipo aprovado.
- Produtos e preços desta prévia continuam demonstrativos, como no site fonte.
- Sem novos elementos de interface, falsa compra, pagamento ou dados de usuário.
- Nenhuma alteração no site comercial, hospedagem, DNS, checkout ou CMS.
- Motion em branch isolada e PR em rascunho para aprovação visual.

## Limitação
O vídeo usa o protótipo visual aprovado, que pode não coincidir integralmente com o site de produção atualizado. A captação tem por objetivo demonstrar a interface que foi aprovada, e não representar como finalizadas integrações comerciais ainda provisórias.
