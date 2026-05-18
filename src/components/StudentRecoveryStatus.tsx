const recoveryItems = [
  ['Fadiga geral', 'Controlada', 'Manter intensidade sem aumentar volume nesta semana.'],
  ['Lower body', 'Atenção', 'Monitorar queda de performance em quadríceps e posteriores.'],
  ['Sono/check-in', 'Pendente', 'Cobrar atualização de sono, peso e percepção de recuperação.'],
  ['Deload', 'Não indicado', 'Reavaliar se houver nova queda em exercícios compostos.']
];

export default function StudentRecoveryStatus() {
  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h2 style={{ margin: 0 }}>Status de recuperação</h2>
          <p style={sub}>Leitura DG TEAM de fadiga, recuperação e tolerância de volume.</p>
        </div>
        <span style={tag}>RECOVERY</span>
      </div>

      <div style={grid}>
        {recoveryItems.map(([area, status, action]) => (
          <div key={area} style={card}>
            <p style={label}>{area}</p>
            <strong style={valueStyle}>{status}</strong>
            <span style={noteStyle}>{action}</span>
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
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 };
const card = { background: '#0b0b0b', border: '1px solid #252525', borderRadius: 18, padding: 16 };
const label = { color: '#aaa', margin: 0, fontSize: 13 };
const valueStyle = { display: 'block', color: '#fff', fontSize: 26, marginTop: 8 };
const noteStyle = { display: 'block', color: '#ffb8b8', marginTop: 8, fontSize: 12, fontWeight: 900, lineHeight: 1.45 };
