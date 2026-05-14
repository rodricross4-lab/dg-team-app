type Props = {
  original: string;
  options: string[];
  reason: string;
};

export default function SubstitutionCard({
  original,
  options,
  reason
}: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 22,
        padding: 24
      }}
    >
      <h3 style={{ marginBottom: 12 }}>Substituições inteligentes</h3>

      <div
        style={{
          background: '#170808',
          border: '1px solid #351111',
          borderRadius: 14,
          padding: 14,
          marginBottom: 16
        }}
      >
        <strong style={{ color: '#ffb8b8' }}>{original}</strong>
      </div>

      <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
        {options.map((option) => (
          <div
            key={option}
            style={{
              background: '#0b0b0b',
              border: '1px solid #1f1f1f',
              borderRadius: 12,
              padding: 12
            }}
          >
            {option}
          </div>
        ))}
      </div>

      <p style={{ color: '#a0a0a0' }}>{reason}</p>
    </div>
  );
}
