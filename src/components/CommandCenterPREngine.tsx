import { getRecentPRInsights } from '../services/analyticsService';

export default function CommandCenterPREngine() {
  const prs = getRecentPRInsights();

  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>PR Engine</h3>
          <p style={sub}>Deteccao de evolucao por carga, reps e qualidade tecnica.</p>
        </div>
        <span style={tag}>PRS</span>
      </div>

      {prs.length ? prs.map((pr) => (
        <div key={`${pr.title}-${pr.detail}`} style={item}>
          <strong>{pr.title}</strong>
          <p style={text}>{pr.detail}</p>
          <span style={muted}>{pr.action}</span>
        </div>
      )) : (
        <div style={item}>
          <strong>Sem PR recente</strong>
          <p style={text}>Registre novas series validas para detectar PRs reais.</p>
        </div>
      )}
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
const muted = { color: '#ffb8b8', fontSize: 12, fontWeight: 900 };
