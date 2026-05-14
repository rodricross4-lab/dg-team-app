type Props = {
  insights: string[];
};

export default function StudentInsightPanel({ insights }: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 22,
        padding: 24
      }}
    >
      <h3 style={{ marginBottom: 18 }}>Assistente DG</h3>

      <div style={{ display: 'grid', gap: 10 }}>
        {insights.map((insight) => (
          <div
            key={insight}
            style={{
              background: '#0b0b0b',
              border: '1px solid #1f1f1f',
              borderRadius: 14,
              padding: 14,
              color: '#f1f1f1'
            }}
          >
            {insight}
          </div>
        ))}
      </div>
    </div>
  );
}
