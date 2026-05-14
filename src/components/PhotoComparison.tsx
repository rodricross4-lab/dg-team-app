type Props = {
  leftLabel: string;
  rightLabel: string;
};

export default function PhotoComparison({
  leftLabel,
  rightLabel
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18
        }}
      >
        <div>
          <div style={box}>Foto</div>
          <p style={label}>{leftLabel}</p>
        </div>

        <div>
          <div style={box}>Foto</div>
          <p style={label}>{rightLabel}</p>
        </div>
      </div>
    </div>
  );
}

const box = {
  height: 280,
  borderRadius: 20,
  border: '1px dashed #e01616',
  background: '#090909',
  display: 'grid',
  placeItems: 'center',
  color: '#666'
};

const label = {
  color: '#d8d8d8',
  marginTop: 12,
  textAlign: 'center' as const
};
