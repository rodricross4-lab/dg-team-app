type TabItem = {
  id: string;
  label: string;
  icon: string;
};

type Props = {
  active: string;
  onChange: (id: string) => void;
};

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'students', label: 'Alunos', icon: '◎' },
  { id: 'logbook', label: 'Logbook', icon: '＋' },
  { id: 'library', label: 'Biblioteca', icon: '◆' },
  { id: 'settings', label: 'Ajustes', icon: '⚙' }
];

export default function MobileBottomNav({ active, onChange }: Props) {
  return (
    <nav style={bar}>
      {tabs.map((tab) => {
        const selected = active === tab.id;

        return (
          <button key={tab.id} onClick={() => onChange(tab.id)} style={selected ? activeButton : button}>
            <span style={icon}>{tab.icon}</span>
            <span style={label}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

const bar = {
  position: 'fixed' as const,
  left: 12,
  right: 12,
  bottom: 12,
  zIndex: 50,
  display: 'grid',
  gridTemplateColumns: 'repeat(5,1fr)',
  gap: 6,
  background: 'rgba(6,6,6,.94)',
  border: '1px solid #2a2a2a',
  borderRadius: 24,
  padding: 8,
  boxShadow: '0 0 35px rgba(0,0,0,.65), 0 0 24px rgba(224,22,22,.12)',
  backdropFilter: 'blur(14px)'
};

const button = {
  background: 'transparent',
  border: '1px solid transparent',
  color: '#aaa',
  borderRadius: 18,
  padding: '9px 4px',
  display: 'grid',
  gap: 3,
  placeItems: 'center',
  cursor: 'pointer',
  fontWeight: 800
};

const activeButton = {
  ...button,
  background: '#210707',
  border: '1px solid #4c1111',
  color: '#fff',
  boxShadow: '0 0 18px rgba(224,22,22,.2)'
};

const icon = { fontSize: 17, lineHeight: 1 };
const label = { fontSize: 10, lineHeight: 1.1 };
