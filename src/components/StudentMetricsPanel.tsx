type Props = {
  validSets: number;
  volumeLoad: number;
  prs: number;
  attendance: number;
};

export default function StudentMetricsPanel({
  validSets,
  volumeLoad,
  prs,
  attendance
}: Props) {
  const metrics = [
    {
      label: 'Séries válidas',
      value: validSets
    },
    {
      label: 'Volume load',
      value: `${volumeLoad}kg`
    },
    {
      label: 'PRs',
      value: prs
    },
    {
      label: 'Frequência',
      value: `${attendance}%`
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
        gap: 14
      }}
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          style={{
            background: '#101010',
            border: '1px solid #262626',
            borderRadius: 18,
            padding: 20
          }}
        >
          <p style={{ color: '#9a9a9a', marginBottom: 10 }}>
            {metric.label}
          </p>

          <strong
            style={{
              fontSize: 28,
              color: '#e01616'
            }}
          >
            {metric.value}
          </strong>
        </div>
      ))}
    </div>
  );
}
