import React from 'react';

const tips = [
  {number:'01',title:'Prepare as categorias',description:'Cadastre as categorias reais das peças antes de criar produtos. Não copie nomes ou preços dos mockups.'},
  {number:'02',title:'Cadastre uma peça em rascunho',description:'Informe nome, código, categoria, fotos autorizadas e descrições. Comece com o estado Pendente.'},
  {number:'03',title:'Revise o conteúdo',description:'Confirme preços, direitos de imagem e informações comerciais. Salve o registro de aprovação antes de tentar publicar.'},
  {number:'04',title:'Publique apenas conteúdo validado',description:'O botão Publicar libera dados na API pública. O site externo ainda depende de homologação e atualização.'},
];

const panelStyle: React.CSSProperties = {
  maxWidth: 980,
  width: '100%',
  margin: '0 auto',
  padding: 'clamp(24px, 5vw, 60px)',
  fontFamily: 'system-ui, sans-serif',
  lineHeight: 1.55,
  color: '#252332',
};

export function GettingStartedTool() {
  return (
    <main style={panelStyle}>
      <p style={{textTransform:'uppercase',letterSpacing:'0.13em',fontSize:12,color:'#655A7C'}}>
        LAVENDER CERÂMICAS · PAINEL DA PROPRIETÁRIA
      </p>
      <h1 style={{fontSize:'clamp(28px, 4vw, 42px)',lineHeight:1.15,margin:'16px 0'}}>
        Um espaço para cuidar das suas peças.
      </h1>
      <p style={{fontSize:17,maxWidth:720,marginBottom:24}}>
        Edite produtos, categorias, coleções e textos. Você não precisa alterar o código do site.
        Use <strong>Gerenciar conteúdo</strong> para abrir os formulários.
      </p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(235px,1fr))',gap:14}}>
        {tips.map((item)=>(
          <section key={item.number} style={{padding:22,border:'1px solid #ddd6e7',borderRadius:12,background:'#fff'}}>
            <p style={{fontWeight:700,color:'#6a4d83'}}>{item.number}</p>
            <h2 style={{fontSize:19,margin:'8px 0'}}>{item.title}</h2>
            <p style={{margin:0}}>{item.description}</p>
          </section>
        ))}
      </div>
      <section style={{marginTop:28,padding:22,background:'#F7F3FA',borderRadius:12}}>
        <h2 style={{fontSize:21,marginTop:0}}>Antes de clicar em Publicar</h2>
        <p>
          O Sanity utiliza um dataset público: conteúdos publicados podem ser vistos pela API,
          mesmo que ainda não apareçam no site. Guarde conteúdos não aprovados em rascunhos.
          Não cadastre aqui dados pessoais de clientes, pedidos ou informações confidenciais.
        </p>
        <p style={{marginBottom:0}}>
          <strong>Status do projeto:</strong> painel em preparação técnica. O site e suas telas
          ainda não foram homologados nem publicados.
        </p>
      </section>
    </main>
  );
}
