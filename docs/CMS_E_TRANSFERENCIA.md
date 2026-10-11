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

## Conta operacional da cliente — decisão de cadastro

- Endereço solicitado: `lavanderceramicas@gmail.com` (**candidato; existência e disponibilidade ainda não confirmadas**).
- Nome da marca na interface pública: **Lavender Cerâmicas**. O endereço usa a grafia informada pelo contratante e não deve ser alterado silenciosamente.
- Responsável pela titularidade e recuperação: **Marina**. A Math Brands só poderá receber convite de colaborador nos serviços, sem utilizar recuperação por telefone/e-mail da agência.
- Cadastro Google deve ser concluído pela titular com senha própria, verificação solicitada e meios de recuperação controlados por ela; nenhuma senha, código de verificação ou telefone pessoal é registrado no GitHub.
- Após a titular confirmar que criou o e-mail, abrir o projeto Sanity na conta dela, adicionar o desenvolvedor com permissões mínimas e registrar owner/serviço/custos no documento de handover.
- **Status em 11/10/2026: PENDENTE DE CADASTRO pela titular.** Não tratar o e-mail como existente até confirmação.
