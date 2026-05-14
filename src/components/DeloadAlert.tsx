type Props = {
  recommend: boolean;
  message: string;
};

export default function DeloadAlert({ recommend, message }: Props) {
  return (
    <div
      style={{
        background: recommend ? '#1a0808' : '#08160d',
        border: recommend
          ? '1px solid #4a1111'
          : '1px solid #1f5f39',
        borderRadius: 22,
        padding: 24
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '8px 12px',
          borderRadius: 999,
          marginBottom: 16,
          background: recommend ? '#2b0b0b' : '#0f2a1b',
          color: '#fff'
        }}
      >
        {recommend ? 'DELOAD SUGERIDO' : 'RECUPERAÇÃO OK'}
      </div>

      <p style={{ color: '#f1f1f1' }}>{message}</p>
    </div>
  );
}
