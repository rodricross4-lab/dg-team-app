import { calculateRetentionRisk, getRetentionSummary, type RetentionInput } from '../engines/autoRetentionEngine';

type Props = {
  input: RetentionInput;
};

export default function RetentionRiskPanel({ input }: Props) {
  const result = calculateRetentionRisk(input);
  const summary = getRetentionSummary(result);

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>Retenção e risco do aluno</h3>
          <p style={subtitle}>IA DG analisando adesão, frequência e comportamento.</p>
        </div>
        <div style={{ ...scoreBadge, borderColor: levelColor(result.level), color: levelColor(result.level) }}>
          {result.score}% • {result.level.toUpperCase()}
        </div>
      </div>

      <div style={summaryBox}>{summary}</div>

      <div style={grid}>
        <div style={card}>
          <strong style={title}>Motivos detectados</strong>
          {result.reasons.map((reason) => (
            <p key={reason} style={item}>{reason}</p>
          ))}
        </div>

        <div style={card}>
          <strong style={title}>Ações do coach</strong>
          {result.coachActions.map((action) => (
            <p key={action} style={item}>{action}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function levelColor(level: string) {
  if (level === 'critical') return '#ff4545';
  if (level === 'high') return '#ffb84d';
  if (level === 'medium') return '#ffb8b8';
  return '#72ff9d';
}

const panel = {
  background: '#101010',
  border: '1px solid #262626',
  borderRadius: 24,
  padding: 24,
  marginBottom: 22,
  boxShadow: '0 0 28px rgba(224,22,22,.08)'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap' as const,
  marginBottom: 16
};

const subtitle = {
  color: '#8f8f8f',
  marginTop: 6
};

const scoreBadge = {
  background: '#0b0b0b',
  border: '1px solid #351111',
  borderRadius: 99,
  padding: '10px 14px',
  fontWeight: 900,
  height: 'fit-content'
};

const summaryBox = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 16,
  padding: 14,
  color: '#fff',
  marginBottom: 14,
  fontWeight: 800
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
  gap: 12
};

const card = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16
};

const title = {
  color: '#e01616'
};

const item = {
  color: '#d4d4d4',
  lineHeight: 1.5,
  margin: '10px 0 0'
};
