const cards = [
  ['Aderência semanal', '76%', '+8% vs semana anterior'],
  ['Performance média', 'Alta', 'Cargas estáveis no ciclo'],
  ['Risco de queda', '2 alunos', 'Exigem contato hoje'],
  ['PRs recentes', '3', 'Progressão confirmada']
];

export default function CommandCenterSmartCards() {
  return (
    <div style={grid}>
      {cards.map(([title, value, note]) => (
        <div key={title} style={card}>
          <p style={label}>{title}</p>
          <strong style={valueStyle}>{value}</strong>
          <span style={noteStyle}>{note}</span>
        </div>
      ))}
    </div>
  );
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
  gap: 12,
  marginBottom: 18
};

const card = {
  background: 'linear-gradient(180deg,#101010,#080808)',
  border: '1px solid #2a2a2a',
  borderRadius: 20,
  padding: 18,
  boxShadow: '0 0 28px rgba(224,22,22,.08)'
};

const label = {
  color: '#aaa',
  margin: 0,
  fontSize: 13
};

const valueStyle = {
  display: 'block',
  color: '#fff',
  fontSize: 28,
  marginTop: 8
};

const noteStyle = {
  display: 'block',
  color: '#ffb8b8',
  marginTop: 8,
  fontSize: 12,
  fontWeight: 900
};
