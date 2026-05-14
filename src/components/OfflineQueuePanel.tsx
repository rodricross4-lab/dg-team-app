type Props = {
  queueCount: number;
};

export default function OfflineQueuePanel({ queueCount }: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 24,
        padding: 24
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
          <h2 style={{ marginBottom: 10 }}>Modo offline</h2>

          <p style={{ color: '#a0a0a0' }}>
            Dados aguardando sincronização cloud.
          </p>
        </div>

        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: '#170808',
            border: '1px solid #341010',
            color: '#ffb8b8',
            fontWeight: 900,
            fontSize: 20
          }}
        >
          {queueCount}
        </div>
      </div>
    </div>
  );
}
