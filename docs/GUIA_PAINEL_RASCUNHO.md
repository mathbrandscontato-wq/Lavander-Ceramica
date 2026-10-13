# Guia de operação — Lavender Cerâmicas (RASCUNHO INTERNO)

**Não encaminhar à cliente antes de 14/10/2026.**
O Studio foi estruturado em código e passa no build, mas a experiência ainda não foi testada pela proprietária; capturas e instruções definitivas serão acrescentadas após homologação.

## Para que serve o painel?
A Marina poderá organizar peças, atualizar fotos, nomes, preços confirmados, categorias e textos, sem editar código. O painel não permite mudar livremente a estrutura do site, preservando as pranchas da V3.

## Onde estão os conteúdos?
- **Comece aqui:** tela de orientação básica.
- **Gerenciar conteúdo > Peças e produtos:** lista das peças cadastradas.
- **Categorias:** famílias reais de peças (Canecas, etc., após validação).
- **Coleções:** agrupamentos editoriais aprovados.
- **Textos e contatos do site:** título/descrição da Home, texto do Manifesto, microtexto de rodapé e links oficiais, conforme aprovação.

## Cadastro seguro de uma peça
1. Abrir **Peças e produtos** e criar um documento **produto**.
2. Cadastrar código único, nome da peça e endereço (slug).
3. Selecionar categoria real; incluir fotografias autorizadas e descrição acessível de cada imagem.
4. Confirmar preço ou indicar “sob consulta” **somente se a política comercial aprovar**. Nunca copiar valores dos mockups.
5. Marcar `Aprovação para aparecer no site` como **Pendente** enquanto existir informação incerta.
6. Registrar a origem da aprovação antes de mudar para **Aprovado**.
7. Usar **Publicar** somente quando o conteúdo puder ser exposto publicamente.

## Diferença crucial: rascunho, aprovado e publicado
- **Rascunho:** conteúdo em edição, não publicado no dataset.
- **Aprovado:** campo editorial validado, mas ainda sujeito a conferir publicação e regras do front-end.
- **Publicado:** documento liberado para leitura pública pela API do Sanity. Não confundir com estar visível na página do site.
- **Atualização do site:** só ocorrerá automaticamente depois de ativarmos e homologarmos o mecanismo de rebuild da hospedagem.

O painel contém proteção para desabilitar a ação comum de **Publicar** quando determinados documentos estão pendentes ou incompletos. **Não é firewall**: integrantes com permissão direta à API podem publicar conteúdo; acesso mínimo continua obrigatório.

## Antes de disponibilizar à cliente
- [ ] Criar endereço protegido do Studio, com login Sanity da própria Marina.
- [ ] Conferir o idioma pt-BR (o plugin pode exigir seleção no menu de idioma).
- [ ] Testar com catálogo de demonstração sem dados reais ou imagens sem licença.
- [ ] Demonstrar o ciclo criar → revisar → publicar → corrigir → despublicar.
- [ ] Confirmar limites do Sanity Free após o trial e ausência de cobrança.
- [ ] Garantir que o conteúdo publicado do CMS não altere a composição aprovada do site.
- [ ] Configurar rebuild e rollback sem depender de senha ou computador da Math Brands.
- [ ] Verificar mobile da área administrativa e clareza dos formulários.

## Bloqueios preservados
O painel **não autoriza** checkout, WhatsApp comercial, pedidos, contas de clientes, newsletter nem telas mobile em conflito. Essas decisões continuam sujeitas à V3.

## Transferência operacional
O endereço de login e os acessos finais devem pertencer à Marina. A Math Brands poderá manter acesso temporário de colaborador enquanto ocorrer o handoff, depois revogado conforme aceite.
