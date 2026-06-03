import { getRecentPRInsights } from '../services/analyticsService';
import { getStoredWorkoutSessions } from '../services/logbookService';
import { getStoredStudents } from '../services/studentService';

type TimelineItem = {
  date: string;
  title: string;
  detail: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

function getTimelineItems(): TimelineItem[] {
  const students = new Map(getStoredStudents().map((student) => [student.id, student.name]));
  const sessions = getStoredWorkoutSessions()
    .sort((a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime())
    .slice(0, 5)
    .map((session) => ({
      date: formatDate(session.performed_at),
      title: session.status === 'completed' ? 'Treino salvo' : 'Sessao em aberto',
      detail: `${students.get(session.student_id) || 'Aluno'} - ${session.status === 'completed' ? 'sessao finalizada' : 'logbook em andamento'}.`,
    }));

  const prs = getRecentPRInsights(3).map((pr) => ({
    date: 'PR',
    title: pr.title,
    detail: `${pr.action}: ${pr.detail}`,
  }));

  return [...prs, ...sessions].slice(0, 6);
}

export default function CommandCenterTimeline() {
  const timeline = getTimelineItems();

  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>Timeline operacional</h3>
          <p style={sub}>Historico rapido do que esta acontecendo no time.</p>
        </div>
        <span style={tag}>CICLO</span>
      </div>

      <div style={list}>
        {timeline.length ? timeline.map((event) => (
          <div key={`${event.date}-${event.title}-${event.detail}`} style={row}>
            <div style={dot} />
            <div>
              <span style={dateText}>{event.date}</span>
              <strong style={titleText}>{event.title}</strong>
              <p style={detailText}>{event.detail}</p>
            </div>
          </div>
        )) : (
          <div style={empty}>Sem historico real no logbook por enquanto.</div>
        )}
      </div>
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

const list = { display: 'grid', gap: 12 };

const row = {
  display: 'grid',
  gridTemplateColumns: '18px 1fr',
  gap: 12,
  background: '#0b0b0b',
  border: '1px solid #252525',
  borderRadius: 16,
  padding: 14,
  color: '#ddd'
};

const dot = {
  width: 10,
  height: 10,
  borderRadius: 99,
  background: '#e01616',
  marginTop: 6,
  boxShadow: '0 0 18px rgba(224,22,22,.6)'
};

const dateText = { display: 'block', color: '#ffb8b8', fontSize: 11, fontWeight: 900, marginBottom: 5 };
const titleText = { display: 'block', color: '#fff' };
const detailText = { color: '#aaa', margin: '6px 0 0', lineHeight: 1.45 };
const empty = {
  background: '#0b0b0b',
  border: '1px dashed #252525',
  borderRadius: 16,
  padding: 14,
  color: '#aaa'
};
