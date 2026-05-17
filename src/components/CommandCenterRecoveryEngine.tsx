const recovery = [
  ['Fadiga controlada', 'Upper estável', 'Manter intensidade e volume atual.'],
  ['Atenção no Lower', 'Queda leve em quadríceps', 'Evitar aumento de volume nesta semana.'],
  ['Sono e check-in', 'Dados incompletos', 'Cobrar percepção de recuperação.'],
  ['Deload preventivo', 'Não necessário agora', 'Reavaliar se houver nova queda.']
];

export default function CommandCenterRecoveryEngine() {
  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>Recovery Engine</h3>
          <p style={sub}>Controle de fadiga, recuperação e tolerância de volume.</p>
        </div>
        <span style={tag}>RECOVERY</span>
      </div>

      {recovery.map(([status, area, action]) => (
        <div key={`${status}-${area}`} style={item}>
          <strong>{status}</strong>
          <p style={text}>{area} — {action}</p>
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

const head = { display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14 };
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
const text = { color: '#aaa', margin: '7px 0 0', lineHeight: 1.45 };
