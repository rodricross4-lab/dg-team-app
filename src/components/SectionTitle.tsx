type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({ title, subtitle }: Props) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>{title}</h1>

      {subtitle && (
        <p style={{ color: '#a0a0a0' }}>{subtitle}</p>
      )}
    </div>
  );
}
