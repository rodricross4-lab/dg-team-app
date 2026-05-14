type Props = {
  status: string;
  duration?: number;
};

export default function WorkoutSessionStatus({
  status,
  duration
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
      <h3 style={{ marginBottom: 16 }}>Sessão atual</h3>

      <div
        style={{
          display: 'inline-block',
          padding: '8px 12px',
          borderRadius: 999,
          background:
            status === 'finalizado'
              ? '#08220f'
              : status === 'em_andamento'
              ? '#1d0d05'
              : '#1a0808',
          border:
            status === 'finalizado'
              ? '1px solid #22c55e'
              : status === 'em_andamento'
              ? '1px solid #f97316'
              : '1px solid #e01616',
          color: '#fff',
          marginBottom: 18
        }}
      >
        {status.replace('_', ' ').toUpperCase()}
      </div>

      <div style={{ color: '#a0a0a0' }}>
        Duração: {duration || 0} minutos
      </div>
    </div>
  );
}
