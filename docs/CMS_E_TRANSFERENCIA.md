# Operação independente e transferência de titularidade

## Princípios
- A cliente deverá ser titular das contas de hospedagem, CMS e domínio quando o site entrar em produção.
- O código pode permanecer inicialmente na Math Brands, com transferência integral e documentação na entrega.
- Evitar dependências de conta pessoal, cartão de crédito do desenvolvedor, arquivos locais ou manutenção recorrente obrigatória.
- O painel da cliente deve permitir editar produto, preço, disponibilidade, fotografias, categorias, ordenação e textos permitidos, sem alterar layout ou estrutura do site.

## CMS (proposta, não integrado)
- Avaliar Sanity Free com painel em português e formulários reduzidos, não presumir cotas permanentes.
- Edição: rascunho → validação de campos → prévia → publicação.
- Publicação pode disparar rebuild autenticado do site estático; nunca colocar token no front-end.
- IA e ChatGPT são melhoria futura, não dependência do lançamento. ChatGPT Plus não é sinônimo de API gratuita ou permissão de escrita automática.

## Checklist de transferência
1. Criar contas e confirmar titularidade da cliente.
2. Transferir o repositório, ou formalizar cópia e acesso conforme contrato.
3. Dar à cliente permissões administrativas no CMS, hospedagem e domínio.
4. Revogar acessos temporários da Math Brands após o aceite.
5. Testar publicação de produto, restauração/rollback e recuperação de conta.
6. Entregar manual operacional, documentação de custos e renovação de domínio.
7. Registrar aceite e responsáveis por suporte futuro.

## Preparação técnica implementada

A pasta `studio/` contém schemas de produto, categoria e coleção, em português. Não há login, conta Sanity, importação de produtos ou deploy configurados. Os testes de contrato de catálogo estão em `tests/` e a integração com o site Astro virá após a validação de dados e conta da proprietária.
