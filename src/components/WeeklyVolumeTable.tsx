type Props = {
  volume: Record<string, number>;
};

export default function WeeklyVolumeTable({ volume }: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 20,
        padding: 22
      }}
    >
      <h3 style={{ marginBottom: 16 }}>Volume semanal por grupamento</h3>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {Object.entries(volume).map(([muscle, sets]) => (
            <tr key={muscle}>
              <td style={cell}>{muscle}</td>
              <td style={{ ...cell, textAlign: 'right', color: '#e01616' }}>
                {sets} séries válidas
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cell = {
  borderBottom: '1px solid #262626',
  padding: '12px 0',
  color: '#f1f1f1'
};
