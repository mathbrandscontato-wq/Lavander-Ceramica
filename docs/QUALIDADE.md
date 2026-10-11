# Protocolo inicial de qualidade

Executar localmente `npm install`, `npm run build`, inspeção de rotas e comparação visual. Ainda NÃO executado em CI neste commit.

- Não usar mocks de IA como conteúdo verdadeiro.
- Sem indexação de homologação; proteção por autenticação no host quando disponível. robots.txt/noindex não substitui controle de acesso.
- Verificar WCAG 2.2 AA aplicável, teclado e reflow 320–1920.
- Medir CWV reais apenas após publicação; laboratório antes do lançamento.
- Comparar screenshots por viewport com VIS/Anexos e validar com diretor criativo.
- Evitar dependências e serviços não necessários; auditar dependências antes de deploy.
- Não usar dados pessoais ou tokens em GitHub.
