type Props = {
  active: string;
  onChange: (tab: string) => void;
};

const tabs = [
  'Dashboard',
  'Alunos',
  'Biblioteca de Exercícios',
  'Configurações'
];

export default function Sidebar({ active, onChange }: Props) {
  return (
    <aside
      style={{
        width: 280,
        minHeight: '100vh',
        background: 'linear-gradient(180deg,#090909,#140707)',
        borderRight: '1px solid #262626',
        padding: 24
      }}
    >
      <h1 style={{ color: '#e01616', fontSize: 36, marginBottom: 30 }}>
        DG TEAM
      </h1>

      {tabs.map((tab) => {
        const selected = active === tab;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            style={{
              width: '100%',
              textAlign: 'left',
              marginBottom: 12,
              borderRadius: 14,
              padding: '14px 16px',
              cursor: 'pointer',
              border: selected
                ? '1px solid #e01616'
                : '1px solid #262626',
              background: selected ? '#1c0909' : '#101010',
              color: '#ffffff'
            }}
          >
            {tab}
          </button>
        );
      })}
    </aside>
  );
}
