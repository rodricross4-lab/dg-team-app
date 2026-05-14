const modules = [
  'Alunos',
  'Treinos',
  'Logbook',
  'Avaliações',
  'Fotos',
  'Check-ins'
];

export default function CrudStatusPanel() {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 24,
        padding: 24
      }}
    >
      <h2 style={{ marginBottom: 20 }}>CRUD do sistema</h2>

      <div style={{ display: 'grid', gap: 10 }}>
        {modules.map((module) => (
          <div
            key={module}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#0b0b0b',
              border: '1px solid #1f1f1f',
              borderRadius: 14,
              padding: 14
            }}
          >
            <span>{module}</span>

            <strong style={{ color: '#eab308' }}>EM INTEGRAÇÃO</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
