import { generateAutomationActions, getAutomationSummary, type AutomationContext } from '../engines/automationEngine';

type Props = {
  context: AutomationContext;
};

export default function AutomationCenter({ context }: Props) {
  const actions = generateAutomationActions(context);
  const summary = getAutomationSummary(actions);

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>Central de automações DG</h3>
          <p style={subtitle}>Alertas, prioridades e ações sugeridas para o coach.</p>
        </div>
        <span style={statusBadge}>AUTO</span>
      </div>

      <div style={summaryBox}>{summary}</div>

      <div style={list}>
        {actions.length === 0 ? (
          <div style={empty}>Nenhuma ação automática pendente.</div>
        ) : (
          actions.map((action) => (
            <div key={action.id} style={{ ...card, borderColor: severityColor(action.severity) }}>
              <div style={cardTop}>
                <strong>{action.title}</strong>
                <span style={{ ...severity, color: severityColor(action.severity) }}>{action.severity}</span>
              </div>
              <p style={text}>{action.message}</p>
              <div style={suggestion}>{action.suggestedAction}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function severityColor(severity: string) {
  if (severity === 'critical') return '#ff4545';
  if (severity === 'warning') return '#ffb84d';
  if (severity === 'positive') return '#72ff9d';
  return '#ffb8b8';
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

const statusBadge = {
  background: '#180909',
  border: '1px solid #351111',
  color: '#ffb8b8',
  borderRadius: 99,
  padding: '9px 13px',
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

const list = {
  display: 'grid',
  gap: 12
};

const card = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16
};

const cardTop = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  flexWrap: 'wrap' as const
};

const severity = {
  fontSize: 11,
  fontWeight: 900,
  textTransform: 'uppercase' as const,
  letterSpacing: 1
};

const text = {
  color: '#bdbdbd',
  lineHeight: 1.6,
  margin: '10px 0'
};

const suggestion = {
  background: '#111',
  border: '1px solid #262626',
  borderRadius: 14,
  padding: 12,
  color: '#fff'
};

const empty = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16,
  color: '#aaa'
};
