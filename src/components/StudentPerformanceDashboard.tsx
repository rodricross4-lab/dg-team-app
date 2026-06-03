import {
  getProgressionInsights,
  getRecentPRInsights,
  getRecoveryInsights,
  getWeeklyVolumeLoad,
} from '../services/analyticsService';
import { getStoredLogbookSets, getStoredWorkoutSessions } from '../services/logbookService';
import { getStoredStudents } from '../services/studentService';

type Props = {
  studentId?: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function isWithinLastDays(value: string | undefined, days: number) {
  if (!value) return false;
  const time = new Date(value).getTime();
  return Number.isFinite(time) && Date.now() - time <= days * DAY_MS;
}

export default function StudentPerformanceDashboard({ studentId }: Props) {
  const student = studentId ? getStoredStudents().find((item) => item.id === studentId) : undefined;
  const weeklySessions = getStoredWorkoutSessions(studentId).filter((session) => (
    session.status === 'completed' && isWithinLastDays(session.performed_at, 7)
  ));
  const weeklyValidSets = getStoredLogbookSets(studentId).filter((set) => (
    set.set_type === 'valid' && isWithinLastDays(set.created_at || set.updated_at, 7)
  ));
  const weeklyVolumeLoad = getWeeklyVolumeLoad(studentId);
  const recentPrs = getRecentPRInsights(6, studentId);
  const targetFrequency = student?.training_frequency;

  const metrics = [
    ['Frequencia semanal', targetFrequency ? `${weeklySessions.length}/${targetFrequency}` : String(weeklySessions.length), 'Sessoes concluidas nos ultimos 7 dias'],
    ['Volume valido', `${weeklyValidSets.length} series`, 'Somente series validas contam'],
    ['Volume load', `${weeklyVolumeLoad}kg`, 'Baseado no logbook real'],
    ['PRs recentes', String(recentPrs.length), 'Carga, reps e volume load'],
  ];

  const insights = [
    ...getProgressionInsights(2, studentId),
    ...getRecoveryInsights(2, studentId),
    ...recentPrs.slice(0, 2),
  ].slice(0, 3);

  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard individual DG TEAM</h2>
          <p style={sub}>Leitura premium de performance, evolucao e recuperacao do aluno.</p>
        </div>
        <span style={tag}>ALUNO</span>
      </div>

      <div style={grid}>
        {metrics.map(([title, value, note]) => (
          <div key={title} style={card}>
            <p style={label}>{title}</p>
            <strong style={valueStyle}>{value}</strong>
            <span style={noteStyle}>{note}</span>
          </div>
        ))}
      </div>

      <div style={insightGrid}>
        {insights.length ? insights.map((insight) => (
          <div key={`${insight.title}-${insight.detail}`} style={insightCard}>
            <strong>{insight.title}</strong>
            <p style={textStyle}>{insight.detail}</p>
          </div>
        )) : (
          <div style={insightCard}>
            <strong>Aguardando logbook</strong>
            <p style={textStyle}>Registre sets validos para gerar progresso, PRs e alertas reais.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const panel = {
  background: 'linear-gradient(180deg,#101010,#080808)',
  border: '1px solid #2a2a2a',
  borderRadius: 24,
  padding: 22,
  marginBottom: 22,
  boxShadow: '0 0 32px rgba(224,22,22,.07)'
};

const head = { display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 18 };
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
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 12, marginBottom: 14 };
const card = { background: '#0b0b0b', border: '1px solid #252525', borderRadius: 18, padding: 16 };
const label = { color: '#aaa', margin: 0, fontSize: 13 };
const valueStyle = { display: 'block', color: '#fff', fontSize: 28, marginTop: 8 };
const noteStyle = { display: 'block', color: '#ffb8b8', marginTop: 8, fontSize: 12, fontWeight: 900 };
const insightGrid = { display: 'grid', gap: 10 };
const insightCard = { background: '#180909', border: '1px solid #351111', borderRadius: 16, padding: 14, color: '#fff' };
const textStyle = { color: '#ffb8b8', margin: '7px 0 0', lineHeight: 1.45 };
