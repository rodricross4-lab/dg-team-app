type Props = {
  title: string;
  value: string;
};

export default function DashboardCard({ title, value }: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 20,
        padding: 22,
        boxShadow: '0 0 24px rgba(224,22,22,.12)'
      }}
    >
      <p style={{ color: '#a0a0a0', marginBottom: 10 }}>{title}</p>
      <h2 style={{ color: '#e01616', fontSize: 32 }}>{value}</h2>
    </div>
  );
}
