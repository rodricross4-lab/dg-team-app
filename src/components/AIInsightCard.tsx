type Props = {
  title: string;
  diagnosis: string;
  suggestion: string;
};

export default function AIInsightCard({
  title,
  diagnosis,
  suggestion
}: Props) {
  return (
    <div
      style={{
        background: '#130707',
        border: '1px solid #3a1111',
        borderRadius: 20,
        padding: 22,
        boxShadow: '0 0 24px rgba(224,22,22,.12)'
      }}
    >
      <h3 style={{ color: '#e01616', marginBottom: 12 }}>{title}</h3>

      <p style={{ color: '#d5d5d5', marginBottom: 14 }}>
        {diagnosis}
      </p>

      <div
        style={{
          background: '#0f0f0f',
          border: '1px solid #262626',
          borderRadius: 14,
          padding: 14,
          color: '#ffb3b3'
        }}
      >
        {suggestion}
      </div>
    </div>
  );
}
