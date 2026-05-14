type Item = {
  name: string;
  status: 'done' | 'partial' | 'missing';
  note: string;
};

type Props = {
  score: number;
  items: Item[];
};

export default function ProductionReadinessCard({
  score,
  items
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
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ marginBottom: 10 }}>Production Readiness</h2>

        <div
          style={{
            background: '#0b0b0b',
            borderRadius: 999,
            overflow: 'hidden',
            height: 14,
            border: '1px solid #1f1f1f'
          }}
        >
          <div
            style={{
              width: `${score}%`,
              height: '100%',
              background: '#e01616'
            }}
          />
        </div>

        <p style={{ color: '#ffb8b8', marginTop: 10 }}>
          {score}% pronto para produção
        </p>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((item) => (
          <div
            key={item.name}
            style={{
              background: '#0b0b0b',
              border: '1px solid #1f1f1f',
              borderRadius: 14,
              padding: 14
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8
              }}
            >
              <strong>{item.name}</strong>

              <span
                style={{
                  color:
                    item.status === 'done'
                      ? '#22c55e'
                      : item.status === 'partial'
                      ? '#eab308'
                      : '#ef4444'
                }}
              >
                {item.status.toUpperCase()}
              </span>
            </div>

            <p style={{ color: '#a0a0a0' }}>{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
