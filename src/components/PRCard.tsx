type Props = {
  exercise: string;
  label: string;
};

export default function PRCard({ exercise, label }: Props) {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg,#180808,#0f0f0f)',
        border: '1px solid #3b1111',
        borderRadius: 20,
        padding: 20,
        boxShadow: '0 0 24px rgba(224,22,22,.15)'
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: '#e01616',
          color: '#fff',
          padding: '6px 10px',
          borderRadius: 999,
          marginBottom: 14,
          fontWeight: 700
        }}
      >
        NOVO PR
      </div>

      <h3 style={{ marginBottom: 10 }}>{exercise}</h3>

      <p style={{ color: '#ffb8b8' }}>{label}</p>
    </div>
  );
}
