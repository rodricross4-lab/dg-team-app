const timeline = [
  ['Hoje', 'Treino Lower salvo', 'Valentina Rocha registrou sessão com foco em glúteos.'],
  ['Hoje', 'PR confirmado', 'Rodrigo Santos evoluiu no supino inclinado.'],
  ['Ontem', 'Check-in pendente', 'Patrick Nunes precisa atualizar peso, sono e recuperação.'],
  ['Semana 4', 'Avaliação próxima', 'Coletar fotos, medidas e observações do bloco.']
];

export default function CommandCenterTimeline() {
  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h3 style={{ margin: 0 }}>Timeline operacional</h3>
          <p style={sub}>Histórico rápido do que está acontecendo no time.</p>
        </div>
        <span style={tag}>CICLO</span>
      </div>

      <div style={list}>
        {timeline.map(([date, title, detail]) => (
          <div key={`${date}-${title}`} style={row}>
            <div style={dot} />
            <div>
              <span style={dateText}>{date}</span>
              <strong style={titleText}>{title}</strong>
              <p style={detailText}>{detail}</p>
            </div>
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

const head = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 14
};

const sub = { color: '#aaa', marginTop: 8 };

const tag = {
  background: '#210707',
  border: '1px solid #4c1111',
  color: '#ffb8b8',
  borderRadius: 99,
  padding: '7px 10px',
  fontSize: 11,
  fontWeight: 900,
  height: 'fit-content'
};

const list = { display: 'grid', gap: 12 };

const row = {
  display: 'grid',
  gridTemplateColumns: '18px 1fr',
  gap: 12,
  background: '#0b0b0b',
  border: '1px solid #252525',
  borderRadius: 16,
  padding: 14,
  color: '#ddd'
};

const dot = {
  width: 10,
  height: 10,
  borderRadius: 99,
  background: '#e01616',
  marginTop: 6,
  boxShadow: '0 0 18px rgba(224,22,22,.6)'
};

const dateText = { display: 'block', color: '#ffb8b8', fontSize: 11, fontWeight: 900, marginBottom: 5 };
const titleText = { display: 'block', color: '#fff' };
const detailText = { color: '#aaa', margin: '6px 0 0', lineHeight: 1.45 };
