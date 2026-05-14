type Props = {
  onCreateStudent?: () => void;
  onCreateWorkout?: () => void;
  onOpenLogbook?: () => void;
  onOpenAssessments?: () => void;
};

const actions = [
  { key: 'student', label: 'Novo aluno', description: 'Criar perfil completo do aluno.' },
  { key: 'workout', label: 'Criar treino', description: 'Montar treino editável A-F.' },
  { key: 'logbook', label: 'Abrir logbook', description: 'Registrar carga, reps e válidas.' },
  { key: 'assessment', label: 'Avaliação', description: 'Editar semana 1, 4 e 8.' }
];

export default function CoachCommandCenter({
  onCreateStudent,
  onCreateWorkout,
  onOpenLogbook,
  onOpenAssessments
}: Props) {
  function handleAction(key: string) {
    if (key === 'student') onCreateStudent?.();
    if (key === 'workout') onCreateWorkout?.();
    if (key === 'logbook') onOpenLogbook?.();
    if (key === 'assessment') onOpenAssessments?.();
  }

  return (
    <div style={panel}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ marginBottom: 8 }}>Central de comando do coach</h2>
        <p style={{ color: '#a0a0a0' }}>
          Ações rápidas para usar o app como ferramenta de trabalho diária.
        </p>
      </div>

      <div style={grid}>
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => handleAction(action.key)}
            style={actionButton}
          >
            <strong>{action.label}</strong>
            <span>{action.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const panel = {
  background: 'linear-gradient(180deg,#130707,#101010)',
  border: '1px solid #341010',
  borderRadius: 24,
  padding: 24,
  marginBottom: 22,
  boxShadow: '0 0 34px rgba(224,22,22,.16)'
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))',
  gap: 12
};

const actionButton = {
  background: '#0b0b0b',
  color: '#fff',
  border: '1px solid #262626',
  borderRadius: 18,
  padding: 18,
  textAlign: 'left' as const,
  display: 'grid',
  gap: 8,
  cursor: 'pointer'
};
