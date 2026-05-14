type AuditItem = {
  area: string;
  status: 'ok' | 'attention' | 'critical';
  message: string;
};

type Props = {
  results: AuditItem[];
};

export default function AppAuditPanel({ results }: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 24,
        padding: 24
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Auditoria DG TEAM</h2>

      <div style={{ display: 'grid', gap: 12 }}>
        {results.map((result) => (
          <div
            key={result.area}
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
              <strong>{result.area}</strong>

              <span
                style={{
                  color:
                    result.status === 'ok'
                      ? '#22c55e'
                      : result.status === 'attention'
                      ? '#eab308'
                      : '#ef4444'
                }}
              >
                {result.status.toUpperCase()}
              </span>
            </div>

            <p style={{ color: '#a0a0a0' }}>{result.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
