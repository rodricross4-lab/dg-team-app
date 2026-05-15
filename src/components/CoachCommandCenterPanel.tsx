import { getCoachCommandCenter, type CoachCommandInput } from '../engines/coachCommandCenterEngine';

type Props = {
  input: CoachCommandInput;
};

export default function CoachCommandCenterPanel({ input }: Props) {
  const command = getCoachCommandCenter(input);

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h2 style={{ margin: 0 }}>Command Center DG TEAM</h2>
          <p style={subtitle}>Prioridades automáticas, decisões e próximos passos do coach.</p>
        </div>
        <span style={{ ...priorityBadge, borderColor: priorityColor(command.priority), color: priorityColor(command.priority) }}>
          {command.priority.toUpperCase()}
        </span>
      </div>

      <div style={heroBox}>
        <strong style={{ color: '#fff', fontSize: 18 }}>{command.headline}</strong>
        <p style={text}>{command.summary}</p>
      </div>

      <div style={actionGrid}>
        {command.actions.map((action, index) => (
          <div key={`${action}-${index}`} style={actionCard}>
            <span style={number}>{index + 1}</span>
            <p style={actionText}>{action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function priorityColor(priority: string) {
  if (priority === 'critical') return '#ff4545';
  if (priority === 'high') return '#ffb84d';
  if (priority === 'medium') return '#ffb8b8';
  return '#9a9a9a';
}

const panel = {
  background: 'linear-gradient(180deg,#111,#080808)',
  border: '1px solid #2d1010',
  borderRadius: 28,
  padding: 24,
  marginBottom: 22,
  boxShadow: '0 0 50px rgba(224,22,22,.14)'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 14,
  flexWrap: 'wrap' as const,
  marginBottom: 18
};

const subtitle = {
  color: '#8f8f8f',
  marginTop: 6
};

const priorityBadge = {
  background: '#0b0b0b',
  border: '1px solid #351111',
  borderRadius: 99,
  padding: '10px 14px',
  fontWeight: 900,
  height: 'fit-content'
};

const heroBox = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 20,
  padding: 18,
  marginBottom: 16
};

const text = {
  color: '#cfcfcf',
  lineHeight: 1.6,
  marginBottom: 0
};

const actionGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
  gap: 12
};

const actionCard = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16,
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start'
};

const number = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: '#e01616',
  color: '#fff',
  display: 'grid',
  placeItems: 'center',
  fontWeight: 900,
  flex: '0 0 auto'
};

const actionText = {
  color: '#e8e8e8',
  margin: 0,
  lineHeight: 1.5
};
