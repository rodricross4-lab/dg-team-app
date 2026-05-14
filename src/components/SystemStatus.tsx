const status = [
  ['Dashboard', 'online'],
  ['Logbook', 'online'],
  ['IA DG', 'online'],
  ['PDF', 'online'],
  ['IndexedDB', 'online'],
  ['Supabase', 'waiting'],
  ['Upload de fotos', 'beta'],
  ['PWA', 'online']
];

export default function SystemStatus() {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 22,
        padding: 24
      }}
    >
      <h3 style={{ marginBottom: 18 }}>Status do sistema</h3>

      <div style={{ display: 'grid', gap: 10 }}>
        {status.map(([module, state]) => (
          <div
            key={module}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#0b0b0b',
              border: '1px solid #1f1f1f',
              borderRadius: 14,
              padding: 12
            }}
          >
            <span>{module}</span>

            <strong
              style={{
                color:
                  state === 'online'
                    ? '#22c55e'
                    : state === 'beta'
                    ? '#eab308'
                    : '#e01616'
              }}
            >
              {state.toUpperCase()}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
