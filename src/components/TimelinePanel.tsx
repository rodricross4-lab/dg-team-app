type TimelineItem = {
  date: string;
  title: string;
  description: string;
  type: 'treino' | 'avaliacao' | 'pr' | 'periodizacao' | 'checkin';
};

const defaultItems: TimelineItem[] = [
  {
    date: 'Semana 1',
    title: 'Início do ciclo',
    description: 'Definição do treino, avaliação inicial e metas do bloco.',
    type: 'periodizacao'
  },
  {
    date: 'Semana 4',
    title: 'Reavaliação estratégica',
    description: 'Comparar performance, medidas, frequência e recuperação.',
    type: 'avaliacao'
  },
  {
    date: 'Semana 8',
    title: 'Fechamento do ciclo',
    description: 'Resumo de PRs, evolução corporal e ajustes para o próximo bloco.',
    type: 'checkin'
  }
];

export default function TimelinePanel({ items = defaultItems }: { items?: TimelineItem[] }) {
  return (
    <div style={panel}>
      <h3 style={{ marginBottom: 16 }}>Timeline de evolução DG TEAM</h3>

      <div style={{ display: 'grid', gap: 14 }}>
        {items.map((item, index) => (
          <div key={`${item.date}-${item.title}`} style={row}>
            <div style={marker}>{index + 1}</div>
            <div style={content}>
              <div style={topLine}>
                <strong style={{ color: '#fff' }}>{item.title}</strong>
                <span style={badge}>{item.date}</span>
              </div>
              <p style={text}>{item.description}</p>
              <span style={type}>{item.type.toUpperCase()}</span>
            </div>
          </div>
        ))}
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

const row = {
  display: 'grid',
  gridTemplateColumns: '42px 1fr',
  gap: 14,
  alignItems: 'start'
};

const marker = {
  width: 42,
  height: 42,
  borderRadius: '50%',
  background: '#e01616',
  color: '#fff',
  display: 'grid',
  placeItems: 'center',
  fontWeight: 900,
  boxShadow: '0 0 20px rgba(224,22,22,.35)'
};

const content = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16
};

const topLine = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  flexWrap: 'wrap' as const,
  marginBottom: 8
};

const badge = {
  color: '#ffb8b8',
  background: '#230808',
  border: '1px solid #351111',
  borderRadius: 99,
  padding: '4px 10px',
  fontSize: 12
};

const text = {
  color: '#b8b8b8',
  lineHeight: 1.6,
  margin: 0
};

const type = {
  display: 'inline-block',
  marginTop: 10,
  color: '#e01616',
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: 1
};
