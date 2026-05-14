const items = [
  'Dashboard premium com KPIs principais',
  'Sidebar com apenas Dashboard, Alunos, Biblioteca e Configurações',
  'Perfil individual completo por aluno',
  'Treinos por ciclo de 8 semanas',
  'Logbook presencial com séries válidas',
  'Timer de descanso com vibração',
  'IA DG contextual com alertas e sugestões',
  'Volume semanal e volume load',
  'PRs automáticos',
  'Avaliações semana 1, 4 e 8',
  'Fotos e comparação visual',
  'Calendário de frequência',
  'PDF semanal premium',
  'Persistência LocalStorage e IndexedDB',
  'Estrutura pronta para Supabase',
  'PWA-ready'
];

export default function FinalizationChecklist() {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 22,
        padding: 24
      }}
    >
      <h3 style={{ marginBottom: 18 }}>Checklist DG TEAM</h3>

      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#0a0a0a',
              border: '1px solid #1f1f1f',
              borderRadius: 14,
              padding: 12
            }}
          >
            <span>{item}</span>
            <strong style={{ color: '#e01616' }}>OK</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
