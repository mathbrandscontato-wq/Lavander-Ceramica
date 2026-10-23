# LAVENDER — CHECKPOINT M4 PRÉ-PUBLICAÇÃO | 23/10/2026
Branch: chore/m4-prepublication-release-gate. Base: 7abe6eb1b36cdeac8484765dea6d9d2c87457c57 (PR #11). HEAD final: consultar o PR draft M4.

## O que foi entregue
Inventário de GO/NO-GO por gate com responsáveis (release/approval-gates.json), script de inspeção de build (scripts/prepublication-readiness.mjs), testes do bloqueio, workflow com artefato de candidata, docs/M4_PREPUBLICACAO.md e plano de rollback. Sem mudanças no site oficial, gh-pages, main ou Sanity production.

## Provas herdadas
M2b estoque/conflito de duas compras BACS em Woo real de teste; M2c reserva/expiração; M2d cancelamento; M2f cron externo; M2g contrato de assinaturas/frete sintético; M3 QA 178/0; M3b QA 198/0 e build do Astro/Sanity. Não repetir sem alteração relevante.

## Descobertas
- O repositório GitHub está público, ao contrário de alguns documentos históricos. Conferir exposição e permissões.
- gh-pages ainda é o protótipo estático ligado por CNAME lavender.mathbrands.com.br; backup no momento real é obrigatório.
- A branch feat/prototipo-a-catalogo-interativo contém imagens provisórias, SVG reconstruído e fontes OFL, não imagens reais/identidade final; confirmar antes de migrar ao Astro.
- Astro ainda tem preço/fotos e produto fictícios, noindex, robots Disallow, sem checkout transacional.
- Ainda não existe homologação real de gateway, frete, operação Marina ou plataforma final.

## Próxima ação
Obter materiais VIS aprovados; revisar mobile, checkout e conteúdo; receber CEP/pacotes, peças e conta sandbox legítima da cliente; comparar Woo/Nuvemshop pelo TCO; executar pagamentos/frete reais em teste; confirmar host/TLS e backups; só então liberar build indexável e domínio sob autorização.

Status esperado do workflow: build/relatório PASSA, job release-guard BLOQUEIA (falha intencional). O GO técnico nunca faz publicação automaticamente.


## Resultado da primeira execução do gate M4 (23/10/2026)
- Evidência real: https://github.com/mathbrandscontato-wq/Lavander-Ceramica/actions/runs/39986164455
- Job de build e relatório: **PASSOU**. Suite Node com **60 testes aprovados, 0 falhas**; build Astro compilado; foi armazenada candidata de preview estático mais relatórios por 7 dias.
- Relatório: **NO_GO**, com **22 bloqueios** e 0 de 16 gates humanos formalmente aprovados. Os 22 são 16 decisões/validações externas + 6 bloqueios detectados automaticamente (placeholders, catálogo fictício, carrinho, checkout, noindex, robots); isso não significa 22 erros de implementação no mesmo nível.
- Job de liberação: **FALHOU INTENCIONALMENTE**, impedindo rotular a candidata como publicável sem evidência. Não houve publicação ou cobrança.
- Avisos sobre builds reproduzíveis (lockfiles) e revisão de visibilidade pública constam do runbook; uma alteração posterior na leitura da visibilidade exige novo run para atualização do diagnóstico.
