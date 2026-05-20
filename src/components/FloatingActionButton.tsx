type Props = {
  label?: string;
  onClick?: () => void;
};

export default function FloatingActionButton({ label = 'Iniciar treino', onClick }: Props) {
  return (
    <button style={button} onClick={onClick}>
      <span style={plus}>+</span>
      <span>{label}</span>
    </button>
  );
}

const button = {
  position: 'fixed' as const,
  right: 18,
  bottom: 92,
  zIndex: 60,
  background: 'linear-gradient(135deg,#e01616,#620707)',
  color: '#fff',
  border: '1px solid #ff4d4d',
  borderRadius: 999,
  padding: '14px 18px',
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  fontWeight: 950,
  letterSpacing: .2,
  cursor: 'pointer',
  boxShadow: '0 0 35px rgba(224,22,22,.34), 0 18px 45px rgba(0,0,0,.55)'
};

const plus = {
  width: 24,
  height: 24,
  borderRadius: 999,
  background: 'rgba(255,255,255,.13)',
  display: 'grid',
  placeItems: 'center',
  fontSize: 20,
  lineHeight: 1
};
