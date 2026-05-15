import { generateCoachNotifications, sortNotifications, type NotificationInput } from '../engines/autoNotificationEngine';

type Props = {
  input: NotificationInput;
};

export default function NotificationCenter({ input }: Props) {
  const notifications = sortNotifications(generateCoachNotifications(input));

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>Central de notificações DG</h3>
          <p style={subtitle}>Alertas automáticos, prioridades e ações rápidas.</p>
        </div>
        <span style={badge}>{notifications.length} alerta(s)</span>
      </div>

      <div style={list}>
        {notifications.length === 0 ? (
          <div style={empty}>Nenhuma notificação pendente agora.</div>
        ) : (
          notifications.map((item) => (
            <div key={item.id} style={{ ...card, borderColor: priorityColor(item.priority) }}>
              <div style={cardTop}>
                <strong>{item.title}</strong>
                <span style={{ ...priority, color: priorityColor(item.priority) }}>{item.priority}</span>
              </div>
              <p style={text}>{item.message}</p>
              <button style={actionButton}>{item.actionLabel}</button>
            </div>
          ))
        )}
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

const badge = {
  background: '#180909',
  border: '1px solid #351111',
  color: '#ffb8b8',
  borderRadius: 99,
  padding: '9px 13px',
  fontWeight: 900,
  height: 'fit-content'
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

const priority = {
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

const actionButton = {
  background: '#e01616',
  color: '#fff',
  border: 0,
  borderRadius: 12,
  padding: '10px 12px',
  fontWeight: 800,
  cursor: 'pointer'
};

const empty = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16,
  color: '#aaa'
};
