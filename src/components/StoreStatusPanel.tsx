type Props = {
  students: number;
  workouts: number;
  offlineMode: boolean;
};

export default function StoreStatusPanel({
  students,
  workouts,
  offlineMode
}: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 24,
        padding: 24
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Estado global</h2>

      <div style={{ display: 'grid', gap: 10 }}>
        <div style={row}>
          <span>Alunos carregados</span>
          <strong>{students}</strong>
        </div>

        <div style={row}>
          <span>Treinos carregados</span>
          <strong>{workouts}</strong>
        </div>

        <div style={row}>
          <span>Modo offline</span>
          <strong style={{ color: offlineMode ? '#eab308' : '#22c55e' }}>
            {offlineMode ? 'ATIVO' : 'INATIVO'}
          </strong>
        </div>
      </div>
    </div>
  );
}

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 14,
  padding: 14
};
