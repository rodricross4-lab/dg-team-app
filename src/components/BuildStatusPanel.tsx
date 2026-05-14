type Props = {
  buildReady: boolean;
  pwaReady: boolean;
  cloudReady: boolean;
};

export default function BuildStatusPanel({
  buildReady,
  pwaReady,
  cloudReady
}: Props) {
  const items = [
    {
      label: 'Build pipeline',
      ready: buildReady
    },
    {
      label: 'PWA',
      ready: pwaReady
    },
    {
      label: 'Cloud sync',
      ready: cloudReady
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
      <h2 style={{ marginBottom: 20 }}>Pipeline do sistema</h2>

      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#0b0b0b',
              border: '1px solid #1f1f1f',
              borderRadius: 14,
              padding: 14
            }}
          >
            <span>{item.label}</span>

            <strong
              style={{
                color: item.ready ? '#22c55e' : '#eab308'
              }}
            >
              {item.ready ? 'READY' : 'PENDING'}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
