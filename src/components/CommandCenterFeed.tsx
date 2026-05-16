const events = [
  {
    time: '08:42',
    title: 'PR detectado',
    detail: 'Rodrigo bateu topo do range no supino inclinado.',
    status: 'Alta prioridade'
  },
  {
    time: '09:10',
    title: 'Check-in atrasado',
    detail: 'Patrick está há 8 dias sem atualizar check-in.',
    status: 'Ação hoje'
  },
  {
    time: '10:25',
    title: 'Treino salvo',
    detail: 'Valentina concluiu Lower com foco em glúteos.',
    status: 'OK'
  },
  {
    time: '11:05',
    title: 'Avaliação pendente',
    detail: 'Atualizar fotos e medidas da semana 4.',
    status: 'Pendente'
  }
];

export default function CommandCenterFeed() {
  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={title}>Feed operacional</h3>
          <p style={subtitle}>Eventos que exigem atenção do coach hoje.</p>
        </div>
        <span style={badge}>AO VIVO</span>
      </div>

      <div style={list}>
        {events.map((event) => (
          <div key={`${event.time}-${event.title}`} style={item}>
            <div style={time}>{event.time}</div>
            <div>
              <strong>{event.title}</strong>
              <p style={detail}>{event.detail}</p>
            </div>
            <span style={status}>{event.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const panel = {
  background: 'linear-gradient(180deg,#101010,#080808)',
  border: '1px solid #2a2a2a',
  borderRadius: 22,
  padding: 20,
  marginBottom: 18,
  boxShadow: '0 0 32px rgba(224,22,22,.07)'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 14,
  alignItems: 'flex-start'
};

const title = { margin: 0 };
const subtitle = { color: '#aaa', marginTop: 8 };
const badge = {
  background: '#210707',
  border: '1px solid #4c1111',
  color: '#ffb8b8',
  borderRadius: 99,
  padding: '7px 10px',
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: 1
};

const list = { display: 'grid', gap: 10 };
const item = {
  display: 'grid',
  gridTemplateColumns: '54px 1fr auto',
  gap: 12,
  alignItems: 'center',
  background: '#0b0b0b',
  border: '1px solid #252525',
  borderRadius: 16,
  padding: 14,
  color: '#ddd'
};

const time = { color: '#ffb8b8', fontWeight: 900, fontSize: 12 };
const detail = { color: '#aaa', margin: '5px 0 0', lineHeight: 1.45 };
const status = {
  background: '#180909',
  border: '1px solid #351111',
  color: '#ffb8b8',
  borderRadius: 99,
  padding: '6px 9px',
  fontSize: 11,
  fontWeight: 900,
  whiteSpace: 'nowrap' as const
};
