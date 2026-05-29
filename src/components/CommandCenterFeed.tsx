import { getRecentPRInsights } from '../services/analyticsService';
import { getStoredWorkoutSessions } from '../services/logbookService';
import { getStoredStudents } from '../services/studentService';

type FeedEvent = {
  time: string;
  title: string;
  detail: string;
  status: string;
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getFeedEvents(): FeedEvent[] {
  const students = new Map(getStoredStudents().map((student) => [student.id, student.name]));
  const sessionEvents = getStoredWorkoutSessions()
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 4)
    .map((session) => ({
      time: formatTime(session.updated_at || session.performed_at),
      title: session.status === 'completed' ? 'Treino finalizado' : 'Sessao iniciada',
      detail: `${students.get(session.student_id) || 'Aluno'} registrou atividade no logbook.`,
      status: session.status === 'completed' ? 'OK' : 'Em andamento',
    }));

  const prEvents = getRecentPRInsights(2).map((pr) => ({
    time: 'PR',
    title: pr.title,
    detail: pr.detail,
    status: pr.action,
  }));

  return [...prEvents, ...sessionEvents].slice(0, 5);
}

export default function CommandCenterFeed() {
  const events = getFeedEvents();

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={title}>Feed operacional</h3>
          <p style={subtitle}>Eventos que exigem atencao do coach hoje.</p>
        </div>
        <span style={badge}>AO VIVO</span>
      </div>

      <div style={list}>
        {events.length ? events.map((event) => (
          <div key={`${event.time}-${event.title}-${event.detail}`} style={item}>
            <div style={time}>{event.time}</div>
            <div>
              <strong>{event.title}</strong>
              <p style={detail}>{event.detail}</p>
            </div>
            <span style={status}>{event.status}</span>
          </div>
        )) : (
          <div style={empty}>Nenhum evento real registrado ainda.</div>
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

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 14,
  alignItems: 'flex-start'
};

const title = { margin: 0 };
const subtitle = { color: '#aaa', marginTop: 8 };
const badge = {
  background: '#210707',
  border: '1px solid #4c1111',
  color: '#ffb8b8',
  borderRadius: 99,
  padding: '7px 10px',
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: 1
};

const list = { display: 'grid', gap: 10 };
const item = {
  display: 'grid',
  gridTemplateColumns: '54px 1fr auto',
  gap: 12,
  alignItems: 'center',
  background: '#0b0b0b',
  border: '1px solid #252525',
  borderRadius: 16,
  padding: 14,
  color: '#ddd'
};

const time = { color: '#ffb8b8', fontWeight: 900, fontSize: 12 };
const detail = { color: '#aaa', margin: '5px 0 0', lineHeight: 1.45 };
const status = {
  background: '#180909',
  border: '1px solid #351111',
  color: '#ffb8b8',
  borderRadius: 99,
  padding: '6px 9px',
  fontSize: 11,
  fontWeight: 900,
  whiteSpace: 'nowrap' as const
};
const empty = {
  background: '#0b0b0b',
  border: '1px dashed #252525',
  borderRadius: 16,
  padding: 14,
  color: '#aaa'
};
