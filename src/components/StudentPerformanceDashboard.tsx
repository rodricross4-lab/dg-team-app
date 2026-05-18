const metrics = [
  ['Frequência semanal', '4/5', 'Boa aderência no ciclo'],
  ['Volume válido', '42 séries', 'Somente séries válidas contam'],
  ['Volume load', '18.450kg', 'Baseado no logbook'],
  ['PRs do ciclo', '3', 'Carga, reps e execução']
];

const insights = [
  ['Progressão', 'Manter microloading nos exercícios que bateram topo do range.'],
  ['Recuperação', 'Monitorar queda de performance no próximo treino lower.'],
  ['Volume', 'Volume semanal dentro da faixa recuperável atual.']
];

export default function StudentPerformanceDashboard() {
  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard individual DG TEAM</h2>
          <p style={sub}>Leitura premium de performance, evolução e recuperação do aluno.</p>
        </div>
        <span style={tag}>ALUNO</span>
      </div>

      <div style={grid}>
        {metrics.map(([title, value, note]) => (
          <div key={title} style={card}>
            <p style={label}>{title}</p>
            <strong style={valueStyle}>{value}</strong>
            <span style={noteStyle}>{note}</span>
          </div>
        ))}
      </div>

      <div style={insightGrid}>
        {insights.map(([title, text]) => (
          <div key={title} style={insightCard}>
            <strong>{title}</strong>
            <p style={textStyle}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const panel = {
  background: 'linear-gradient(180deg,#101010,#080808)',
  border: '1px solid #2a2a2a',
  borderRadius: 24,
  padding: 22,
  marginBottom: 22,
  boxShadow: '0 0 32px rgba(224,22,22,.07)'
};

const head = { display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 18 };
const sub = { color: '#aaa', marginTop: 8 };
const tag = {
  background: '#210707',
  border: '1px solid #4c1111',
  color: '#ffb8b8',
  borderRadius: 99,
  padding: '7px 10px',
  fontSize: 11,
  fontWeight: 900,
  height: 'fit-content'
};
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 12, marginBottom: 14 };
const card = { background: '#0b0b0b', border: '1px solid #252525', borderRadius: 18, padding: 16 };
const label = { color: '#aaa', margin: 0, fontSize: 13 };
const valueStyle = { display: 'block', color: '#fff', fontSize: 28, marginTop: 8 };
const noteStyle = { display: 'block', color: '#ffb8b8', marginTop: 8, fontSize: 12, fontWeight: 900 };
const insightGrid = { display: 'grid', gap: 10 };
const insightCard = { background: '#180909', border: '1px solid #351111', borderRadius: 16, padding: 14, color: '#fff' };
const textStyle = { color: '#ffb8b8', margin: '7px 0 0', lineHeight: 1.45 };
