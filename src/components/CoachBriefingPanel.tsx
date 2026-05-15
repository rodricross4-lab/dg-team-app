import { generateCoachBriefing, type CoachBriefingInput } from '../engines/autoCoachBriefingEngine';

type Props = {
  input: CoachBriefingInput;
};

export default function CoachBriefingPanel({ input }: Props) {
  const briefing = generateCoachBriefing(input);

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>Briefing do Coach</h3>
          <p style={subtitle}>Resumo automático do aluno e ações prioritárias.</p>
        </div>
        <span style={{ ...badge, color: priorityColor(briefing.priority), borderColor: priorityColor(briefing.priority) }}>
          {briefing.priority.toUpperCase()}
        </span>
      </div>

      <div style={hero}>
        <strong style={{ color: '#fff', fontSize: 18 }}>{briefing.headline}</strong>
      </div>

      <div style={grid}>
        <div style={card}>
          <strong style={title}>Resumo</strong>
          {briefing.summary.map((item) => (
            <p key={item} style={itemText}>{item}</p>
          ))}
        </div>

        <div style={card}>
          <strong style={title}>Ações de hoje</strong>
          {briefing.todayActions.map((action, index) => (
            <p key={`${action}-${index}`} style={itemText}>{index + 1}. {action}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function priorityColor(priority: string) {
  if (priority === 'critical') return '#ff4545';
  if (priority === 'high') return '#ffb84d';
  if (priority === 'medium') return '#ffb8b8';
  return '#72ff9d';
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

const subtitle = {
  color: '#8f8f8f',
  marginTop: 6
};

const badge = {
  background: '#0b0b0b',
  border: '1px solid #351111',
  borderRadius: 99,
  padding: '9px 13px',
  fontWeight: 900,
  height: 'fit-content'
};

const hero = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 18,
  padding: 16,
  marginBottom: 14
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

const itemText = {
  color: '#d4d4d4',
  lineHeight: 1.5,
  margin: '10px 0 0'
};
