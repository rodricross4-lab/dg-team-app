type Props = {
  coach: string;
};

export default function CoachHeader({ coach }: Props) {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg,#170808,#0f0f0f)',
        border: '1px solid #341010',
        borderRadius: 22,
        padding: 24,
        marginBottom: 24,
        boxShadow: '0 0 28px rgba(224,22,22,.14)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <p style={{ color: '#ffb6b6', marginBottom: 8 }}>
            Bem-vindo de volta
          </p>

          <h2 style={{ fontSize: 32 }}>{coach}</h2>
        </div>

        <div
          style={{
            background: '#e01616',
            width: 70,
            height: 70,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 900,
            fontSize: 20
          }}
        >
          DG
        </div>
      </div>
    </div>
  );
}
