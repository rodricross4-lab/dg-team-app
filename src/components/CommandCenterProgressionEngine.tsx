import type { CommandCenterInsight } from '../types';
import { getProgressionInsights } from '../services/analyticsService';

function getItemStyle(severity: CommandCenterInsight['severity']) {
  if (severity === 'danger') return dangerItem;
  if (severity === 'warning') return warningItem;
  if (severity === 'success') return successItem;
  return item;
}

export default function CommandCenterProgressionEngine() {
  const decisions = getProgressionInsights();

  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>Progression Engine</h3>
          <p style={sub}>Decisoes DG Team para proxima sessao.</p>
        </div>
        <span style={tag}>AUTO</span>
      </div>

      {decisions.length ? decisions.map((decision) => (
        <div key={`${decision.title}-${decision.detail}`} style={getItemStyle(decision.severity)}>
          <strong>{decision.title}</strong>
          <p style={text}>{decision.detail}</p>
          <span style={muted}>{decision.action}</span>
        </div>
      )) : (
        <div style={item}>
          <strong>Aguardando historico</strong>
          <p style={text}>Registre pelo menos uma serie valida para gerar decisoes automaticas.</p>
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
const successItem = { ...item, border: '1px solid #174d27', color: '#b7f7c8' };
const warningItem = { ...item, border: '1px solid #5a3b0b', color: '#ffe3a3' };
const dangerItem = { ...item, border: '1px solid #5a1515', color: '#ffb8b8' };
const text = { color: '#aaa', margin: '7px 0 0', lineHeight: 1.45 };
const muted = { color: '#ffb8b8', fontSize: 12, fontWeight: 900 };
