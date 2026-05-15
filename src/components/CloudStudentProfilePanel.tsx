import { useCloudStudentProfile } from '../hooks/useCloudStudentProfile';

type Props = {
  studentId: string;
  studentName: string;
};

export default function CloudStudentProfilePanel({ studentId, studentName }: Props) {
  const profile = useCloudStudentProfile(studentId);

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>{studentName} — Cloud Profile</h3>
          <p style={subtitle}>Central operacional completa do aluno em nuvem.</p>
        </div>

        <button style={button} onClick={profile.loadProfile}>
          Sincronizar
        </button>
      </div>

      <div style={hero}>
        <strong style={{ color: '#fff' }}>Status</strong>
        <p style={text}>{profile.message}</p>
      </div>

      <div style={grid}>
        <div style={card}><strong>{profile.workouts.length}</strong><span>Treinos</span></div>
        <div style={card}><strong>{profile.sessions.length}</strong><span>Sessões</span></div>
        <div style={card}><strong>{profile.logbook.length}</strong><span>Logbook</span></div>
        <div style={card}><strong>{profile.assessments.length}</strong><span>Avaliações</span></div>
        <div style={card}><strong>{profile.checkins.length}</strong><span>Check-ins</span></div>
        <div style={card}><strong>{profile.timeline.length}</strong><span>Timeline</span></div>
        <div style={card}><strong>{profile.insights.length}</strong><span>Insights IA</span></div>
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

const subtitle = {
  color: '#8f8f8f',
  marginTop: 6
};

const button = {
  background: '#e01616',
  color: '#fff',
  border: 0,
  borderRadius: 12,
  padding: '10px 14px',
  cursor: 'pointer',
  fontWeight: 800
};

const hero = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 18,
  padding: 16,
  marginBottom: 16
};

const text = {
  color: '#d4d4d4',
  marginTop: 10,
  lineHeight: 1.5
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
  gap: 12
};

const card = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 16,
  padding: 16,
  display: 'grid',
  gap: 8,
  textAlign: 'center' as const,
  color: '#fff'
};
