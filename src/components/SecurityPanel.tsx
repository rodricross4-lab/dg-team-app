type Props = {
  cloudEnabled: boolean;
  backupEnabled: boolean;
  pwaEnabled: boolean;
};

export default function SecurityPanel({
  cloudEnabled,
  backupEnabled,
  pwaEnabled
}: Props) {
  const items = [
    {
      label: 'Persistência local',
      active: true
    },
    {
      label: 'Cloud sync',
      active: cloudEnabled
    },
    {
      label: 'Backups',
      active: backupEnabled
    },
    {
      label: 'PWA seguro',
      active: pwaEnabled
    }
  ];

  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 24,
        padding: 24
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Segurança do sistema</h2>

      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              background: '#0b0b0b',
              border: '1px solid #1f1f1f',
              borderRadius: 14,
              padding: 14,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>{item.label}</span>

            <strong
              style={{
                color: item.active ? '#22c55e' : '#ef4444'
              }}
            >
              {item.active ? 'ATIVO' : 'INATIVO'}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
