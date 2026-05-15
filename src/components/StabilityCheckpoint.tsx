import { getStabilityMessage, getStabilityScore, stabilityChecklist } from '../utils/stabilityChecklist';

export default function StabilityCheckpoint() {
  const score = getStabilityScore(stabilityChecklist);
  const message = getStabilityMessage(score);

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>Stability Checkpoint DG TEAM</h3>
          <p style={text}>
            Fase atual: estabilização do MVP. Prioridade máxima: build limpo, login, dashboard, alunos, treino e logbook funcionando.
          </p>
        </div>

        <div style={scoreBadge}>{score}%</div>
      </div>

      <div style={messageBox}>{message}</div>

      <div style={grid}>
        {stabilityChecklist.map((item) => (
          <div key={item.id} style={card}>
            <strong>{item.label}</strong>
            <span style={status}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const panel = {
  background: 'linear-gradient(180deg,#111,#080808)',
  border: '1px solid #2d1010',
  borderRadius: 24,
  padding: 24,
  marginBottom: 22,
  boxShadow: '0 0 34px rgba(224,22,22,.10)'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap' as const,
  marginBottom: 16
};

const text = {
  color: '#d4d4d4',
  lineHeight: 1.5,
  marginTop: 10
};

const scoreBadge = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 99,
  padding: '10px 14px',
  color: '#ffb8b8',
  fontWeight: 900,
  height: 'fit-content'
};

const messageBox = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 18,
  padding: 16,
  color: '#fff',
  marginBottom: 16,
  fontWeight: 800
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
  gap: 12,
  marginTop: 16
};

const card = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 14,
  padding: 14,
  color: '#fff',
  display: 'grid',
  gap: 8,
  fontWeight: 800
};

const status = {
  color: '#ffb8b8',
  fontSize: 11,
  textTransform: 'uppercase' as const,
  letterSpacing: 1
};
