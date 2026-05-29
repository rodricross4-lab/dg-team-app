import { getAlertInsights } from '../services/analyticsService';

export default function CommandCenterAlertEngine() {
  const alerts = getAlertInsights();

  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>Alert Engine DG</h3>
          <p style={sub}>Alertas inteligentes para agir antes do problema crescer.</p>
        </div>
        <span style={tag}>ALERTAS</span>
      </div>

      {alerts.length ? alerts.map((alert) => (
        <div key={`${alert.title}-${alert.detail}`} style={item}>
          <strong>{alert.title}</strong>
          <p style={text}>{alert.detail}</p>
          <span style={pill}>{alert.action}</span>
        </div>
      )) : (
        <div style={item}>
          <strong>Sem alerta operacional</strong>
          <p style={text}>Os dados atuais nao indicam risco critico no dashboard.</p>
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
