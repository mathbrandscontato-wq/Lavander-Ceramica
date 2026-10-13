# INFRA-01 — estado de infraestrutura

## Sanity: CRIADO, código em integração e painel não publicado
- Conta da titular: `lavanderceramicas@gmail.com`.
- Projeto: **Lavender Cerâmicas**, ID público `t4nkzeaq`, organização `ow010fg90`, dataset `production`.
- URL: https://www.sanity.io/organizations/ow010fg90/project/t4nkzeaq
- Em 11/10/2026: **Growth Trial 30 dias, US$0 e sem cartão**, downgrade automático para Free declarado na página do plano. Confirmar na data de término e monitorar quotas.
- Nenhum dado comercial real, pedido, senha, token ou integração paga inserido; Studio próprio em código, ainda não implantado.
- Dataset Free público: documentos publicados podem ser lidos via API; draft e aprovação editorial devem ser usados adequadamente.

## Cloudflare Pages: somente CANDIDATA
- Astro estático suporta Cloudflare Pages com build `npm run build` e saída `dist`.
- Criar conta de propriedade da cliente e validar plano/cotas, build, assets hero/video, domínio, DNS, acesso, logs, privacidade e custos antes de conectar.
- Nenhum deploy automático nem domínio configurado.

## GitHub: FUNDAÇÃO PREPARADA
- Repositório `mathbrandscontato-wq/Lavander-Ceramica` **privado**, sob controle inicial da Math Brands.
- PR #1 em rascunho. Transferência integral à cliente na entrega; nunca depender de senhas ou conta da agência.
- CI testa Astro e schemas Sanity, e pode construir Studio sem publicá-lo.
- **PENDENTE:** lockfiles versionados para builds reprodutíveis e política de branches antes de produção.

## Outros gates
- Definição de hospedagem de vídeo real, poster e direitos de mídia.
- Logos, fontes, cores, ilustrações e medidas M01; aprovação da direção criativa.
- Conciliação mobile e produtos CON-01/02/03/04.
- Validar catálogo por amostra real, sem copiar valores de mockups.
- Autorizar explicitamente publicação, checkout/WhatsApp e alterações comerciais após V3.

Referências: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ | https://www.sanity.io/pricing | https://www.sanity.io/docs/growth-plan-trial
