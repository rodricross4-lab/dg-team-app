type Props = {
  name: string;
  goal: string;
  frequency: number;
  priorities: string[];
  onClick: () => void;
};

export default function StudentCard({
  name,
  goal,
  frequency,
  priorities,
  onClick
}: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 20,
        padding: 22,
        cursor: 'pointer',
        boxShadow: '0 0 24px rgba(224,22,22,.10)'
      }}
    >
      <h3 style={{ marginBottom: 10 }}>{name}</h3>

      <p style={{ color: '#a0a0a0', marginBottom: 6 }}>{goal}</p>

      <p style={{ color: '#a0a0a0', marginBottom: 14 }}>
        {frequency}x por semana
      </p>

      <div
        style={{
          display: 'inline-block',
          padding: '8px 10px',
          borderRadius: 999,
          border: '1px solid #262626',
          background: '#1c0909',
          color: '#ffb4b4'
        }}
      >
        {priorities.join(' + ')}
      </div>
    </div>
  );
}
