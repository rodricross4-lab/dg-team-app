import { useCloudStudents } from '../hooks/useCloudStudents';

export default function CloudStudentsPanel() {
  const { students, loading, message, loadStudents } = useCloudStudents();

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>Cloud Students DG</h3>
          <p style={subtitle}>Sincronização realtime dos alunos da plataforma.</p>
        </div>

        <button style={button} onClick={loadStudents} disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      <div style={statusBox}>
        <strong>Status:</strong>
        <p style={text}>{message}</p>
      </div>

      <div style={stats}>
        <div style={statCard}>
          <strong>{students.length}</strong>
          <span>Alunos em nuvem</span>
        </div>

        <div style={statCard}>
          <strong>{loading ? 'SIM' : 'NÃO'}</strong>
          <span>Carregando</span>
        </div>
      </div>

      <div style={list}>
        {students.length === 0 ? (
          <div style={card}>
            <p style={text}>Nenhum aluno cloud carregado ainda.</p>
          </div>
        ) : (
          students.map((student) => (
            <div key={student.id} style={card}>
              <div style={top}>
                <strong>{student.name}</strong>
                <span style={badge}>{student.status || 'active'}</span>
              </div>

              <p style={text}>{student.goal || 'Objetivo não definido'}</p>
              <p style={text}>Frequência: {student.frequency || 0}x semana</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const panel = { background: 'linear-gradient(180deg,#111,#080808)', border: '1px solid #2d1010', borderRadius: 24, padding: 24, marginBottom: 22, boxShadow: '0 0 34px rgba(224,22,22,.10)' };
const header = { display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const, marginBottom: 16 };
const subtitle = { color: '#8f8f8f', marginTop: 6 };
const button = { background: '#e01616', color: '#fff', border: 0, borderRadius: 12, padding: '10px 14px', cursor: 'pointer', fontWeight: 800 };
const statusBox = { background: '#180909', border: '1px solid #351111', borderRadius: 18, padding: 16, marginBottom: 16, color: '#fff' };
const text = { color: '#d4d4d4', marginTop: 10, lineHeight: 1.5 };
const stats = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12, marginBottom: 16 };
const statCard = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 16, padding: 16, display: 'grid', gap: 8, textAlign: 'center' as const, color: '#fff' };
const list = { display: 'grid', gap: 12 };
const card = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 18, padding: 16 };
const top = { display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' as const };
const badge = { background: '#180909', border: '1px solid #351111', borderRadius: 99, padding: '4px 10px', color: '#ffb8b8', fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const };
