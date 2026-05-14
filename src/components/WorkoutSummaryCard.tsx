type Props = {
  exercises: number;
  validSets: number;
  volumeLoad: number;
  averageRir: number;
};

export default function WorkoutSummaryCard({
  exercises,
  validSets,
  volumeLoad,
  averageRir
}: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 22,
        padding: 24,
        boxShadow: '0 0 24px rgba(224,22,22,.10)'
      }}
    >
      <h3 style={{ marginBottom: 18 }}>Resumo do treino</h3>

      <div style={row}>
        <span>Exercícios</span>
        <strong>{exercises}</strong>
      </div>

      <div style={row}>
        <span>Séries válidas</span>
        <strong>{validSets}</strong>
      </div>

      <div style={row}>
        <span>Volume load</span>
        <strong>{volumeLoad}kg</strong>
      </div>

      <div style={row}>
        <span>RIR médio</span>
        <strong>{averageRir}</strong>
      </div>
    </div>
  );
}

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 12,
  color: '#f1f1f1'
};
