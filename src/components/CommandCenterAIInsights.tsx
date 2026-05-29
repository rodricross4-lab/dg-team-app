import {
  getAlertInsights,
  getProgressionInsights,
  getRecentPRInsights,
  getRecoveryInsights,
} from '../services/analyticsService';

export default function CommandCenterAIInsights() {
  const insights = [
    ...getAlertInsights().slice(0, 1),
    ...getProgressionInsights(2),
    ...getRecoveryInsights(2),
    ...getRecentPRInsights(1),
  ].slice(0, 4);

  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>IA DG TEAM</h3>
          <p style={sub}>Leitura operacional automatica para tomada de decisao.</p>
        </div>
        <span style={tag}>INSIGHTS</span>
      </div>

      {insights.length ? insights.map((insight) => (
        <div key={`${insight.title}-${insight.detail}`} style={item}>
          <strong>{insight.title}</strong>
          <p style={text}>{insight.detail}</p>
          <span style={pill}>{insight.action}</span>
        </div>
      )) : (
        <div style={item}>
          <strong>Aguardando dados reais</strong>
          <p style={text}>Registre alunos, treinos e sets validos para gerar insights DG TEAM.</p>
        </div>
      )}

      <button style={button}>Abrir assistente DG</button>
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

const text = { color: '#aaa', margin: '7px 0 0', lineHeight: 1.45 };

const pill = {
  display: 'inline-block',
  background: '#180909',
  border: '1px solid #351111',
  color: '#ffb8b8',
  borderRadius: 99,
  padding: '6px 9px',
  fontSize: 11,
  fontWeight: 900,
  marginTop: 10
};

const button = {
  background: '#e01616',
  color: '#fff',
  border: 0,
  borderRadius: 14,
  padding: '13px 14px',
  width: '100%',
  fontWeight: 900,
  cursor: 'pointer',
  marginTop: 6
};
