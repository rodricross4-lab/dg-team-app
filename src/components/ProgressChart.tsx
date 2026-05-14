import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const data = [
  { week: 'S1', load: 120 },
  { week: 'S2', load: 128 },
  { week: 'S3', load: 132 },
  { week: 'S4', load: 138 },
  { week: 'S5', load: 145 },
  { week: 'S6', load: 152 },
  { week: 'S7', load: 160 },
  { week: 'S8', load: 168 }
];

export default function ProgressChart() {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 22,
        padding: 24,
        height: 340
      }}
    >
      <h3 style={{ marginBottom: 20 }}>Evolução de carga</h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="week" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="load"
            stroke="#e01616"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
