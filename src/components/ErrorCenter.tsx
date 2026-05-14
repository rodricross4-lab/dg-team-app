type ErrorItem = {
  area: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
};

type Props = {
  errors: ErrorItem[];
};

export default function ErrorCenter({ errors }: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 24,
        padding: 24
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Central de erros</h2>

      <div style={{ display: 'grid', gap: 12 }}>
        {errors.map((error, index) => (
          <div
            key={`${error.area}-${index}`}
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
              <strong>{error.area}</strong>

              <span
                style={{
                  color:
                    error.severity === 'high'
                      ? '#ef4444'
                      : error.severity === 'medium'
                      ? '#eab308'
                      : '#22c55e'
                }}
              >
                {error.severity.toUpperCase()}
              </span>
            </div>

            <p style={{ color: '#d8d8d8', marginBottom: 8 }}>
              {error.message}
            </p>

            <small style={{ color: '#777' }}>{error.createdAt}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
