import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { week: 'S1', volume: 4200, performance: 72 },
  { week: 'S2', volume: 5100, performance: 76 },
  { week: 'S3', volume: 5900, performance: 82 },
  { week: 'S4', volume: 5600, performance: 78 },
  { week: 'S5', volume: 6400, performance: 86 },
  { week: 'S6', volume: 7100, performance: 91 }
];

export default function RealMetricsChart() {
  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>Métricas reais DG TEAM</h3>
          <p style={subtitle}>Volume load e performance semanal</p>
        </div>

        <div style={badge}>IA DG ATIVA</div>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#1f1f1f" />
            <XAxis dataKey="week" stroke="#777" />
            <YAxis stroke="#777" />
            <Tooltip />
            <Line type="monotone" dataKey="volume" stroke="#e01616" strokeWidth={3} />
            <Line type="monotone" dataKey="performance" stroke="#ffffff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const panel = {
  background: '#101010',
  border: '1px solid #262626',
  borderRadius: 24,
  padding: 24,
  marginBottom: 22,
  boxShadow: '0 0 28px rgba(224,22,22,.08)'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap' as const,
  marginBottom: 18
};

const subtitle = {
  color: '#8f8f8f',
  marginTop: 6
};

const badge = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 99,
  color: '#ffb8b8',
  padding: '10px 14px',
  fontWeight: 800,
  height: 'fit-content'
};
