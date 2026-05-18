const muscles = [
  ['Peitoral', 8, 'Adequado'],
  ['Costas', 10, 'Adequado'],
  ['Quadríceps', 12, 'Atenção'],
  ['Posteriores', 8, 'Recuperável'],
  ['Glúteos', 14, 'Prioridade'],
  ['Ombros', 6, 'Manter']
];

export default function StudentWeeklyVolume() {
  const max = Math.max(...muscles.map(([, sets]) => Number(sets)));

  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h2 style={{ margin: 0 }}>Volume semanal DG TEAM</h2>
          <p style={sub}>Distribuição de séries válidas por grupamento muscular.</p>
        </div>
        <span style={tag}>VOLUME</span>
      </div>

      <div style={list}>
        {muscles.map(([muscle, sets, status]) => {
          const width = `${(Number(sets) / max) * 100}%`;

          return (
            <div key={muscle} style={row}>
              <div style={rowTop}>
                <strong>{muscle}</strong>
                <span style={setsText}>{sets} séries válidas • {status}</span>
              </div>
              <div style={barTrack}>
                <div style={{ ...barFill, width }} />
              </div>
            </div>
          );
        })}
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
const row = { background: '#0b0b0b', border: '1px solid #252525', borderRadius: 16, padding: 14 };
const rowTop = { display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10, color: '#fff' };
const setsText = { color: '#ffb8b8', fontSize: 12, fontWeight: 900 };
const barTrack = { background: '#1a1a1a', borderRadius: 999, height: 10, overflow: 'hidden' };
const barFill = { background: 'linear-gradient(90deg,#e01616,#640808)', height: '100%', borderRadius: 999 };
