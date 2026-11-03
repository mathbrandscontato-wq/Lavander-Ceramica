# LAVENDER CERÂMICAS | M4b — Retorno do briefing comercial da Marina

**Data de recebimento:** 03/11/2026  
**Origem:** respostas encaminhadas pela direção criativa da Math Brands.  
**Classificação:** resumo operacional sanitizado para repositório GitHub **público**, não configura autorização de publicação comercial, contrato de pagamento nem aceite de design.

## 1. Informações confirmadas em conversa
- Meios pretendidos: **Pix e cartão**.
- Venda prevista como **CNPJ/MEI**; processo de formalização ainda **em andamento**.
- Recebimento empresarial especificamente para Lavender: **conta ainda não configurada**. Não reutilizar credenciais ou contas de outra empresa sem validação de titularidade.
- Origem dos envios: **Joinville/SC**. O endereço completo e o CEP exato foram recebidos em conversa, mas deliberadamente **não foram replicados no repositório público**.
- Exemplo de embalagem de **uma caneca protegida**: cerca de **550 g**, **14 × 14 × 14 cm**. Medida **não extensível** automaticamente a outros modelos/produtos.
- Domínio desejado: **lavenderceramicas.com.br**. Registro, titularidade e DNS **não verificados** neste checkpoint.
- Quatro referências de produto recebidas: **Caneca Estante**, **Booknook**, **Copinhos de Mel** e **Caneca Friends**. Preços informados à direção na conversa, **não expostos nesta versão pública anterior ao lançamento**.

## 2. Informações que permanecem em aberto

| Prioridade | Dependência | Responsável | Por que importa |
|---|---|---|---|
| P0 | MEI finalizado, razão/dados oficiais e conta de recebimento de titularidade correta | Marina | Não ativar repasses ou checkout de produção sem identificação válida |
| P0 | Provedor de pagamentos escolhido e conta sandbox autorizada | Marina + engenharia | Testar Pix/cartão, webhooks, duplicatas, rejeições e pagamento tardio |
| P0 | Imagens reais, descrições, SKU, estoque disponível de cada uma das quatro peças | Marina | Gerar catálogo real sem inventar características nem quantidade |
| P0 | Medidas e pesos embalados dos demais produtos | Marina | Calcular frete seguro, inclusive para item maior/frágil |
| P0 | Integrador logístico, embalagem, política de avarias, devolução e prazo de postagem | Marina + engenharia | Cotação de frete e experiência comercial confiáveis |
| P0 | Registro/titularidade de domínio e DNS | Marina + DevOps | Preparar ambiente de staging e HTTPS definitivo |
| P1 | Agenda do primeiro drop e política para peça única esgotada | Marina | Implementar publicação programada e estados comerciais |
| P1 | Carrinho/checkout e mobile VIS aprovados | Direção criativa | Preservar identidade, funcionamento acessível e telas necessárias |
| P1 | Rotina de uso Sanity + motor comercial versus alternativa Nuvemshop | Marina + UX | Reduzir trabalho administrativo |
| P1 | Políticas comerciais e dados públicos da loja | Marina | Requisitos jurídicos e de confiança |

## 3. Decisões que NÃO foram tomadas
- Mercado Pago ou outra plataforma de pagamento **não foi contratado nem aprovado**. A conta bancária não é automaticamente um gateway Pix/cartão.
- WooCommerce e Nuvemshop continuam candidatos até orçamento, homologação e avaliação operacional.
- O endereço principal informado **não comprova posse ou registro ativo** do domínio.
- Os preços e produtos compartilhados **não equivalem a cadastro com estoque aprovado para vendas**.
- O exemplo de embalagem de caneca **não autoriza** cálculo de frete para Booknook ou outras peças sem medidas.
- As 16 condições de `release/approval-gates.json` **permanecem PENDENTES**, com informações parciais registradas em `progress` e `next_step`.

## 4. Passo prático seguinte
1. Preparar a estrutura editorial para **quatro produtos fictícios de homologação**, mantendo os nomes e preços comerciais reais fora do repositório público e sem atualizar o Sanity de produção.
2. Montar a matriz de embalagem por produto; a referência da caneca não se aplica aos demais automaticamente.
3. Escolher o provedor mediante custo, titularidade e compatibilidade com o motor de e-commerce; executar sandbox sob conta autorizada.
4. Confirmar quem administra o domínio desejado e a futura hospedagem.
5. Após isso, atualizar os gates com links de evidência real, executar QA e solicitar liberação final de vendas.

**Proteção de dados:** não versionar o endereço completo de postagem, dados bancários, CPF/CNPJ específico, documentos ou tokens no repositório público.  
**Publicação:** continua **NO-GO**. Sem merge, deploy, cobrança ou modificação de Sanity production.
