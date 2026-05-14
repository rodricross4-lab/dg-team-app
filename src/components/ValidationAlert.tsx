type Props = {
  errors: string[];
};

export default function ValidationAlert({ errors }: Props) {
  if (errors.length === 0) return null;

  return (
    <div
      style={{
        background: '#1a0808',
        border: '1px solid #4a1111',
        borderRadius: 18,
        padding: 18,
        marginBottom: 18
      }}
    >
      <h3 style={{ color: '#ffb8b8', marginBottom: 12 }}>
        Corrija os campos abaixo
      </h3>

      <div style={{ display: 'grid', gap: 8 }}>
        {errors.map((error) => (
          <div
            key={error}
            style={{
              background: '#120606',
              border: '1px solid #351111',
              borderRadius: 12,
              padding: 10,
              color: '#ffd4d4'
            }}
          >
            {error}
          </div>
        ))}
      </div>
    </div>
  );
}
