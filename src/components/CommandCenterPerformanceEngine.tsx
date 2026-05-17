const rows = [
  ['Supino inclinado', 'Topo do range', 'Subir 1–2kg na próxima sessão'],
  ['Hack machine', 'Performance estável', 'Manter carga e buscar +1 rep'],
  ['Mesa flexora', 'Queda leve', 'Revisar descanso e execução'],
  ['Hip thrust', 'PR recente', 'Consolidar carga antes de novo aumento']
];

export default function CommandCenterPerformanceEngine() {
  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>Performance Engine</h3>
          <p style={sub}>Leitura rápida de progressão, estagnação e próximos ajustes.</p>
        </div>
        <span style={tag}>PROGRESSÃO</span>
      </div>

      {rows.map(([exercise, status, action]) => (
        <div key={exercise} style={item}>
          <strong>{exercise}</strong>
          <p style={text}>{status}</p>
          <span style={pill}>{action}</span>
        </div>
      ))}
    </div>
  );
}

const panel = {
  background: 'linear-gradient(180deg,#101010,#080808)',
  border: '1px solid #2a2a2a',
  borderRadius: 22,
  padding: 20,
  marginBottom: 18,
  boxShadow: '0 0 32px rgba(224,22,22,.07)'
};

const head = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 14
};

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

const item = {
  background: '#0b0b0b',
  border: '1px solid #252525',
  borderRadius: 16,
  padding: 14,
  color: '#ddd',
  marginBottom: 10
};

const text = { color: '#aaa', margin: '7px 0', lineHeight: 1.45 };

const pill = {
  display: 'inline-block',
  background: '#180909',
  border: '1px solid #351111',
  color: '#ffb8b8',
  borderRadius: 99,
  padding: '6px 9px',
  fontSize: 11,
  fontWeight: 900
};
