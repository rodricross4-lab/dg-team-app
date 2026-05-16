const items = [
  ['Patrick Nunes', 'Check-in atrasado', 'Cobrar hoje'],
  ['Rodrigo Santos', 'Topo do range', 'Microloading'],
  ['Valentina Rocha', 'Avaliação pendente', 'Fotos e medidas']
];

export default function CommandCenterPriorities() {
  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>Prioridades do coach</h3>
          <p style={sub}>Ações rápidas para manter evolução e retenção.</p>
        </div>
        <span style={tag}>IA DG</span>
      </div>

      {items.map(([name, reason, action]) => (
        <div key={name} style={card}>
          <strong>{name}</strong>
          <p style={text}>{reason}</p>
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

const card = {
  background: '#0b0b0b',
  border: '1px solid #252525',
  borderRadius: 16,
  padding: 14,
  color: '#ddd',
  marginBottom: 10
};

const text = { color: '#aaa', margin: '7px 0' };

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
