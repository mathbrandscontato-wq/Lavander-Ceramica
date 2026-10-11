# INFRA-01 — avaliação inicial, não ativação

## Decisões verificadas em documentação oficial
- **Cloudflare Pages** suporta sites Astro estáticos: build `npm run build`, saída `dist`. A modalidade Free possui limites, inclusive limite de 25 MiB por asset; não hospedar vídeo longo no repositório sem análise.
- **Sanity Free** possui Studio hospedado e cotas gratuitas; o dataset Free pode ser público, exigindo disciplina de rascunhos e privacidade.
- **GitHub** está inicialmente sob Math Brands e deverá ser transferido à cliente, com checklists de acesso, titularidade e rollback.

## Ainda pendente
- Conta Cloudflare da titular e custos/limites reais da conta; nenhuma implantação foi criada.
- Conta Sanity de titularidade da cliente e avaliação do painel por ela.
- Domínio, titularidade, política de renovação e documentação financeira.
- Hospedagem ou distribuição do vídeo artesanal; poster otimizado.
- Processo de deploy seguro; nenhum deploy automático ligado neste momento.
- Testar publicação de um produto real aprovado, em ambiente protegido, antes de publicar.
- Gerar e versionar package-lock.json após primeira instalação com internet.
- Autorizar adaptação visual a partir de tokens/arquivos originais da Lavender.

## Fontes técnicas consultadas em 11/10/2026
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- https://developers.cloudflare.com/pages/platform/limits/
- https://www.sanity.io/pricing
- https://www.sanity.io/docs/studio/project-structure

**Status:** arquitetura **candidata e parcialmente validada por documentação**, não aprovada para publicação. Nenhuma credencial foi configurada.
