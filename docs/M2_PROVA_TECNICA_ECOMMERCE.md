# MATH BRANDS | LAVENDER CERÂMICAS
## M2 — Prova técnica de e-commerce (21/10/2026)

**Natureza:** laboratório GitHub First; sem Codex, merge, deploy, gateway ou dados da Marina.
**Repositório:** mathbrandscontato-wq/Lavander-Ceramica.
**Branch:** experiment/m2-astro-sanity-woocommerce, criada do commit 05964aa da chore/initial-foundation.
**Fontes:** Plano V3 original (20/10/2026), Especificação visual V2, docs/ARQUITETURA.md e docs/INFRA_01.md da fundação.
**PRs preservados:** #1 Astro/Sanity e #2 Protótipo A; ambos abertos em draft. main e gh-pages intactas.

### 1. Escopo e arquitetura observada
- Fundação Astro 5 estática, componentes e contratos de catálogo existentes; código experimental isolado em src/lib/commerce, sem alterar telas.
- Sanity já existe no projeto de titularidade da cliente, projectId público t4nkzeaq, dataset production. **Não foi consultado, alterado ou publicado na M2**.
- WooCommerce é **candidato** a autoridade comercial para preço, estoque e pedidos; nesta M2 subiu apenas em WordPress/MariaDB descartáveis no runner.
- Compartilhar SKU: Sanity usa productId editorial aprovado; Woo usa sku comercial. Se faltar, duplicar ou divergir, bloquear.
- Campo priceAmount/stockStatus existente no Studio não é autoridade comercial: o adapter usa somente os dados Woo.
- Qualquer integração futura Astro + Woo transacional exigirá camada server-side, TLS, credenciais fora do repositório e validação de checkout. Astro estático + Sanity público **não** podem cobrar nem reservar estoque.
- Prova realizada via Node tests, GitHub Actions e WP-CLI com produto fictício; nenhuma transação financeira, checkout em navegador ou WooCommerce público.

### 2. Evidências imutáveis
- **CI leve: PASSOU** — [run 39613612849](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39613612849). Testes Node preexistentes + oito testes de contratos M2, análise de sintaxe e build Astro, sem deploy.
- **Primeira prova efêmera: FALHOU infraestrutura** — [run 39613940711](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39613940711). WP instalado, sem permissão para criar diretório de upgrade no volume.
- **Segunda prova efêmera: FALHOU infraestrutura** — [run 39614211767](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39614211767). Persistiu diferença de usuário/permissão do WP-CLI.
- **Terceira prova efêmera: PASSOU (escopo restrito)** — [run 39614461523](https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39614461523). Instalação real de WooCommerce 11.2.1, WP-CLI e MariaDB locais, volume removido após teste. Artefato sanitizado m2-woo-evidencias, retenção de 5 dias.
- Resultado observado na terceira execução: SKU M2-SKU-001, preço Woo 149.90, estoque inicial 1, estoque após wc_reduce_stock_levels = 0, segunda chamada do redutor mantém 0, estoque **após cancelar pedido = 0**. Não atribuir esta última observação ao checkout padrão do Woo: teste criou pedido/baixa manualmente.
- Nenhuma prova executou sessão real de dois compradores, gateway Pix/cartão, reversão por expiração ou cotação Correios.

### 3. Matriz verificável dos cenários M2

| ID | Cenário | Status | Observação e alcance |
|---|---|---|---|
| M2-01 | SKU fictício com estoque unitário | **PASSOU** | Produto Woo real efêmero; SKU e estoque=1 lidos no PHP. |
| M2-02 | Duas sessões simultâneas tentando comprar a única unidade | **NÃO EXECUTADO** | Teste JS rejeita qty=2, mas não simula duas transações reais concorrentes. Gate bloqueado. |
| M2-03 | Reserva, cancelamento e expiração | **FALHOU** | No ensaio com redução manual, cancelamento retornou estoque 0; expiração não executada. É falha do cenário experimental, não prova de defeito do checkout padrão. |
| M2-04 | Preço verificado pelo servidor | **PASSOU** | Contrato exige preço Woo; WP confirmou 149.90. A revalidação dentro de checkout real ainda não foi executada. |
| M2-05 | Carrinho e checkout completos | **NÃO EXECUTADO** | Somente previewQuote não transacionável no código. |
| M2-06 | Pagamento pendente, aprovado e recusado | **NÃO EXECUTADO** | Nenhum gateway ou callback real/sandbox integrado. |
| M2-07 | Webhooks duplicados / fora de ordem | **PASSOU** | Somente redutor de contrato com eventos falsos em memória; autenticidade, persistência e entrega real NÃO EXECUTADAS. |
| M2-08 | Frete e falha de cotação | **BLOQUEADO** | Sem integração autorizada ou contrato Correios; não inventar valor. |
| M2-09 | Gestão editorial Sanity combinada à operação Woo | **NÃO EXECUTADO** | Estrutura e contrato existentes foram revisados; painel real de produção intocado, sem teste ponta a ponta. |
| M2-10 | Estados de drops | **PASSOU** | Unitários cobrem calendário UTC, agendado, publicado e encerrado; Woo agendamento real não executado. |

**Regra de leitura:** PASSOU refere-se apenas ao método descrito. Nenhum status acima implica aprovação transacional de compras simultâneas ou pagamento.

### 4. Erros e indisponibilidade
- SKU ausente, diferente ou duplicado: rejeitar; nunca atrelar preço a produto editorial sem correspondência.
- Woo sem HTTPS externo, configuração ausente, falha HTTP/timeout, retorno inválido ou produto indisponível: bloquear preço comercial ou compra; não assumir o preço editorial.
- Sanity pending: não ler Woo nem exibir produto aprovável; documentos publicados em dataset público ainda podem ser lidos pela API, por isso rascunho no CMS é necessário.
- Carrinho simulado calcula centavos com preço Woo, mas devolve transactable:false. Não usar como API de pedido.
- M2 em código não cria endpoint, não grava pedidos e não inclui tokens reais.
- Eventos mock em memória não protegem contra replay/reordenação em produção. Precisará armazenamento durável de eventos e validação da assinatura do provedor.

### 5. Riscos e bloqueadores
1. **P0:** provar dois checkouts reais concorrentes contra 1 SKU e o mecanismo de reserva atômica no ambiente candidato.
2. **P0:** investigar o retorno de estoque após cancelamento e expiração no checkout verdadeiro. O teste manual terminou em 0.
3. **P0:** testar timeout, devolução e conciliação de Pix e webhooks assinados em sandbox autorizado.
4. **P0:** verificar cálculo e erro de frete, peso da embalagem e tarifas reais com integrador autorizado.
5. **P1:** testar efetivamente Sanity editorial + SKU Woo sem publicação indevida; configurar permissões e ocultar campos comerciais duplicados após aprovação.
6. **P1:** validar UI real com as pranchas VIS, incluindo carrinho/checkout complementares ainda sem aceite.
7. **P1:** versionar lockfiles e fixar imagens/tags por digest antes de uso contínuo; laboratório utilizou imagens abertas não imutáveis.
8. **P1:** medir custos totais e compatibilidade de manutenção da Marina; nenhuma plataforma selecionada.

### 6. Comparação Nuvemshop / WooCommerce
**Fonte oficial:** [planos Nuvemshop](https://www.nuvemshop.com.br/planos-e-precos), [API de produtos Nuvemshop](https://dev.nuvemshop.com.br/docs/erp-guide/catalog/products), [Woo estoque](https://woocommerce.com/document/configuring-woocommerce-settings/products/), [Woo API](https://developer.woocommerce.com/docs/apis/rest-api/v3/products).
- **Nuvemshop:** estoque, pedidos, Pix/cartão e fretes geridos em plataforma; SKU em produtos/variantes via API. A composição Astro+Sanity+checkout Nuvemshop headless com fidelidade total **não foi testada**. Tema pode limitar visual; Impulso anuncia edição de código. Operação menos técnica para Marina, mas risco de replicação de dados e limites de plataforma.
- **Astro + Sanity + WooCommerce:** contratos e stock decrement testados, máximo controle visual, preserva Studio; exige PHP/banco/hospedagem/backups, manutenção, integração comercial segura e configuração de gateway e frete. Infra mais complexa.
- **Estimativa mensalidade pública de plataforma** (outubro/2026, sem taxas de transação): Nuvemshop Essencial R$ 69/mês = R$ 828 em 12 meses e R$ 1.656 em 24; Impulso R$ 164/mês = R$ 1.968 em 12 e R$ 3.936 em 24. Promoções e plano anual mudam valores; consultar fornecedor antes de contratar.
- **WooCommerce:** plugin-base sem licença obrigatória, mas hospedagem WordPress, backup, operação, integrações e suporte não possuem preço validado. Custo total = 12/24 × (hospedagem + manutenção + plugins e serviços mensais) + custos iniciais + domínio + taxas variáveis. Sem valores contratados, comparar numericamente seria fictício.
- **Sanity:** manter painel de conteúdo como contratado/editorial, validar limites do plano e custo da sincronização em ambos os cenários. Não presumir que painel Sanity sozinho substitui o administrativo de pedidos.
- **Pix, cartão, Correios e drops:** as duas alternativas exigem comprovação de integrações, estoque unitário e limites de uso. Nuvemshop não foi executada nesta M2. Não selecionar vencedora.

### 7. Recomendações e próxima prova
**Arquitetura candidata, confiança moderada-baixa:** Astro + Sanity + Woo com BFF server-side seguro. A M2 mostra viabilidade inicial de SKU/preço e uma operação de estoque, **não viabilidade de checkout final**. Nuvemshop permanece candidata forte pelo custo operacional.
Próxima prova mínima M2b: Woo checkout HTTP real em duas sessões, transações de reserva, cancelamento/timeout, sandbox Pix e quote de frete por integração autorizada; comparar com teste equivalente Nuvemshop. Realizar somente com autorização técnica, ambiente isolado e custos aprovados.
**Publicação/Merge:** proibidos. A prova não alterou main, gh-pages nem dataset Sanity de produção.
