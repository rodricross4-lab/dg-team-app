import { buildStudentTimeline, generateAutoTimelineInsights, type TimelineEvent } from '../engines/autoTimelineEngine';

type Props = {
  events: TimelineEvent[];
};

export default function TimelinePanelDG({ events }: Props) {
  const timeline = buildStudentTimeline(events);
  const insights = generateAutoTimelineInsights(events);

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>Timeline DG TEAM</h3>
          <p style={subtitle}>Histórico operacional, evolução e insights automáticos.</p>
        </div>
        <span style={badge}>{timeline.length} evento(s)</span>
      </div>

      <div style={insightsBox}>
        <strong style={{ color: '#fff' }}>Insights automáticos</strong>
        {insights.map((insight) => (
          <p key={insight} style={insightText}>{insight}</p>
        ))}
      </div>

      <div style={list}>
        {timeline.map((event) => (
          <div key={event.id} style={card}>
            <div style={top}>
              <strong>{event.title}</strong>
              <span style={{ ...tag, color: typeColor(event.type), borderColor: typeColor(event.type) }}>
                {event.type}
              </span>
            </div>

            <p style={description}>{event.description}</p>

            <div style={footer}>
              <span style={date}>{event.date}</span>
              {event.priority && (
                <span style={{ ...priority, color: priorityColor(event.priority) }}>
                  {event.priority}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function typeColor(type: string) {
  if (type === 'pr') return '#72ff9d';
  if (type === 'retention') return '#ff4545';
  if (type === 'adjustment') return '#ffb84d';
  return '#ffb8b8';
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

const insightsBox = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 18,
  padding: 16,
  marginBottom: 16
};

const insightText = {
  color: '#d4d4d4',
  marginTop: 10,
  lineHeight: 1.5
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

const top = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  flexWrap: 'wrap' as const
};

const tag = {
  border: '1px solid',
  borderRadius: 99,
  padding: '4px 10px',
  fontSize: 11,
  fontWeight: 900,
  textTransform: 'uppercase' as const
};

const description = {
  color: '#d4d4d4',
  lineHeight: 1.6,
  margin: '10px 0'
};

const footer = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  flexWrap: 'wrap' as const
};

const date = {
  color: '#8f8f8f'
};

const priority = {
  fontWeight: 900,
  textTransform: 'uppercase' as const,
  fontSize: 11
};
