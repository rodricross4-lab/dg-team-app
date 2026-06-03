import { getProgressionInsights, getRecentPRInsights } from '../services/analyticsService';

export default function CommandCenterPerformanceEngine() {
  const rows = [...getProgressionInsights(3), ...getRecentPRInsights(1)].slice(0, 4);

  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>Performance Engine</h3>
          <p style={sub}>Leitura rapida de progressao, estagnacao e proximos ajustes.</p>
        </div>
        <span style={tag}>PROGRESSAO</span>
      </div>

      {rows.length ? rows.map((row) => (
        <div key={`${row.title}-${row.detail}`} style={item}>
          <strong>{row.title}</strong>
          <p style={text}>{row.detail}</p>
          <span style={pill}>{row.action}</span>
        </div>
      )) : (
        <div style={item}>
          <strong>Aguardando dados reais</strong>
          <p style={text}>Crie treinos e registre sets validos para popular a leitura de performance.</p>
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
