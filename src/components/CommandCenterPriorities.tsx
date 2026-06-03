import {
  getAlertInsights,
  getProgressionInsights,
  getRecentPRInsights,
  getRecoveryInsights,
  getStudentRiskInsights,
} from '../services/analyticsService';

function getActionLabel(severity: string) {
  if (severity === 'danger') return 'Agir agora';
  if (severity === 'warning') return 'Revisar hoje';
  if (severity === 'success') return 'Aproveitar evolucao';
  return 'Monitorar';
}

export default function CommandCenterPriorities() {
  const items = [
    ...getStudentRiskInsights(3),
    ...getRecoveryInsights(3),
    ...getAlertInsights().slice(0, 2),
    ...getProgressionInsights(2),
    ...getRecentPRInsights(2),
  ].slice(0, 5);

  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>Prioridades do coach</h3>
          <p style={sub}>Acoes rapidas para manter evolucao e retencao.</p>
        </div>
        <span style={tag}>IA DG</span>
      </div>

      {items.length ? items.map((item) => (
        <div key={`${item.title}-${item.detail}`} style={card}>
          <strong>{item.action}</strong>
          <p style={text}>{item.title}: {item.detail}</p>
          <span style={pill}>{getActionLabel(item.severity)}</span>
        </div>
      )) : (
        <div style={card}>
          <strong>Sem prioridade critica</strong>
          <p style={text}>Cadastre alunos, treinos e sets validos para gerar fila real de acoes.</p>
          <span style={pill}>Aguardando dados</span>
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
