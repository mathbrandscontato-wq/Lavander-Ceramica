# Protocolo de qualidade — fundação técnica

## Automação
O workflow privado `.github/workflows/quality.yml` testa funções de catálogo, gera build Astro, valida tipos do Studio e compila seu bundle estático. **Sem deploy, sem segredo, sem integração comercial.** CI passa a cada commit na branch com PR em rascunho, sem mesclar à `main`.

## Segurança e privacidade
- Dataset `production` é público na modalidade Free: documentos *publicados* podem ser consumidos por API. Controle `publicationStatus` apenas filtra a vitrine; não é controle de acesso. O Studio possui guarda de publicação para produto e texto institucional, mas APIs diretas ainda exigem controle de permissões.
- Sem publicar dados pessoais, pedidos, tokens ou imagens não autorizadas.
- Nenhum link externo da interface comercial deve apontar para `#`, fake checkout ou URLs provisórias em produção.
- Homologação com `noindex`; quando criada, também exigirá proteção de acesso na hospedagem. `robots.txt` **não** protege recursos privados.
- Avaliar dependências e gerar lockfiles antes de disponibilizar serviço continuamente.

## Design e QA
- A fundação usa estilos neutros e não substitui os tokens nem os anexos visuais V3.
- Exigir comparação de screenshot por viewport (320–1920), estado, dataset e referência VIS; aprovação da direção de arte.
- Verificar teclado, foco, WCAG 2.2 AA aplicável, sem erros críticos.
- CWV p75 só é comprovável em produção com tráfego; registrar testes de laboratório na homologação.

## Pendências de publicação
- Homologar Studio com login da proprietária, mas não realizar isso antes de 14/10/2026.
- Confirmar hospedagem gratuita, DNS/HTTPS, permissões e mídia hero.
- Validar conteúdo original, direitos de uso, fluxo de venda, termos/políticas e procedimento de rollback.
