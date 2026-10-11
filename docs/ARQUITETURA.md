# Arquitetura da fundação

Astro estático (provisório, sujeito a INFRA-01). Conteúdo público será SSR-free quando cabível, sem API comercial nesta fase.

```
src/
  components/
    layout/ Header, Footer
    catalog/ ProductCard
    media/ HeroMedia
  data/       contratos de dados e integração futura de CMS
  layouts/    BaseLayout
  pages/      rotas aprovadas (atualmente apenas página técnica temporária)
  styles/     base técnica, tokens visuais pendentes
public/       robots de homologação
docs/         gates, qualidade, operação e transferência
```

Os diretórios não autorizam criar novas telas comerciais. Todas as rotas de produto e checkout continuam bloqueadas até as decisões da V3.
