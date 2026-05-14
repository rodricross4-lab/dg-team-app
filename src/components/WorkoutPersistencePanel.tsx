type Props = {
  autosave: boolean;
  lastSaved?: string;
};

export default function WorkoutPersistencePanel({
  autosave,
  lastSaved
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
      <h2 style={{ marginBottom: 18 }}>Persistência do treino</h2>

      <div style={{ display: 'grid', gap: 10 }}>
        <div style={row}>
          <span>Autosave</span>

          <strong style={{ color: autosave ? '#22c55e' : '#ef4444' }}>
            {autosave ? 'ATIVO' : 'INATIVO'}
          </strong>
        </div>

        <div style={row}>
          <span>Último salvamento</span>

          <strong>{lastSaved || 'Ainda não salvo'}</strong>
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
