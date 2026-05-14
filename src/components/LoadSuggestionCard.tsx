type Props = {
  action: string;
  message: string;
  suggestedLoad: number;
};

export default function LoadSuggestionCard({
  action,
  message,
  suggestedLoad
}: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 22,
        padding: 24,
        boxShadow: '0 0 24px rgba(224,22,22,.12)'
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '8px 12px',
          borderRadius: 999,
          background: '#170808',
          border: '1px solid #3a1111',
          color: '#ffb8b8',
          marginBottom: 16
        }}
      >
        {action.replaceAll('_', ' ').toUpperCase()}
      </div>

      <p style={{ color: '#f1f1f1', marginBottom: 16 }}>{message}</p>

      <div
        style={{
          background: '#0a0a0a',
          border: '1px solid #1f1f1f',
          borderRadius: 14,
          padding: 14,
          color: '#e01616',
          fontWeight: 700,
          fontSize: 18
        }}
      >
        Próxima carga sugerida: {suggestedLoad}kg
      </div>
    </div>
  );
}
