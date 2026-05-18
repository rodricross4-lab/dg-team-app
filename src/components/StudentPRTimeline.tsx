const prs = [
  ['Semana 1', 'PR técnico', 'Hack machine com mais amplitude e controle.'],
  ['Semana 2', 'PR de reps', 'Supino inclinado: +2 reps mantendo execução.'],
  ['Semana 3', 'PR de carga', 'Hip thrust: +10kg no ciclo atual.'],
  ['Semana 4', 'PR consolidado', 'Remada articulada repetida com mais estabilidade.']
];

export default function StudentPRTimeline() {
  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h2 style={{ margin: 0 }}>Timeline de PRs</h2>
          <p style={sub}>Histórico de evolução por carga, reps, técnica e consolidação.</p>
        </div>
        <span style={tag}>PRS</span>
      </div>

      <div style={list}>
        {prs.map(([week, type, detail]) => (
          <div key={`${week}-${type}`} style={row}>
            <div style={dot} />
            <div>
              <span style={weekText}>{week}</span>
              <strong style={titleText}>{type}</strong>
              <p style={detailText}>{detail}</p>
            </div>
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
const list = { display: 'grid', gap: 12 };
const row = {
  display: 'grid',
  gridTemplateColumns: '18px 1fr',
  gap: 12,
  background: '#0b0b0b',
  border: '1px solid #252525',
  borderRadius: 16,
  padding: 14,
  color: '#ddd'
};
const dot = {
  width: 10,
  height: 10,
  borderRadius: 99,
  background: '#e01616',
  marginTop: 6,
  boxShadow: '0 0 18px rgba(224,22,22,.6)'
};
const weekText = { display: 'block', color: '#ffb8b8', fontSize: 11, fontWeight: 900, marginBottom: 5 };
const titleText = { display: 'block', color: '#fff' };
const detailText = { color: '#aaa', margin: '6px 0 0', lineHeight: 1.45 };
