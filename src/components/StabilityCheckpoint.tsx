export default function StabilityCheckpoint() {
  return (
    <div style={panel}>
      <h3 style={{ margin: 0 }}>Stability Checkpoint DG TEAM</h3>
      <p style={text}>
        Fase atual: estabilização do MVP. Prioridade máxima: build limpo, login, dashboard, alunos, treino e logbook funcionando.
      </p>
      <div style={grid}>
        <div style={card}>Typecheck</div>
        <div style={card}>Build</div>
        <div style={card}>Login</div>
        <div style={card}>Dashboard</div>
        <div style={card}>Cloud</div>
        <div style={card}>Realtime</div>
      </div>
    </div>
  );
}

const panel = {
  background: 'linear-gradient(180deg,#111,#080808)',
  border: '1px solid #2d1010',
  borderRadius: 24,
  padding: 24,
  marginBottom: 22,
  boxShadow: '0 0 34px rgba(224,22,22,.10)'
};

const text = {
  color: '#d4d4d4',
  lineHeight: 1.5,
  marginTop: 10
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
  gap: 12,
  marginTop: 16
};

const card = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 14,
  padding: 14,
  color: '#fff',
  textAlign: 'center' as const,
  fontWeight: 800
};
