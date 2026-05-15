import { useCoachRealtime } from '../hooks/useCoachRealtime';

export default function RealtimeStatusPanel() {
  const { status, events, orchestrated, latest } = useCoachRealtime();

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>Realtime DG TEAM</h3>
          <p style={subtitle}>Monitoramento vivo do sistema operacional.</p>
        </div>

        <div style={badge}>{status}</div>
      </div>

      <div style={hero}>
        <strong style={{ color: '#fff' }}>Último evento orquestrado</strong>

        {latest ? (
          <>
            <p style={text}>Evento: {latest.eventType}</p>
            <p style={text}>Prioridade: {latest.priority}</p>
            <p style={text}>{latest.summary}</p>
          </>
        ) : (
          <p style={text}>Aguardando eventos realtime...</p>
        )}
      </div>

      <div style={stats}>
        <div style={statCard}>
          <strong>{events.length}</strong>
          <span>Eventos</span>
        </div>

        <div style={statCard}>
          <strong>{orchestrated.length}</strong>
          <span>Orquestrados</span>
        </div>
      </div>
    </div>
  );
}

const panel = {
  background: 'linear-gradient(180deg,#111,#080808)',
  border: '1px solid #2d1010',
  borderRadius: 24,
  padding: 24,
  marginBottom: 22,
  boxShadow: '0 0 34px rgba(224,22,22,.10)'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap' as const,
  marginBottom: 16
};

const subtitle = {
  color: '#8f8f8f',
  marginTop: 6
};

const badge = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 99,
  padding: '9px 13px',
  color: '#ffb8b8',
  fontWeight: 900,
  height: 'fit-content'
};

const hero = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16,
  marginBottom: 16
};

const text = {
  color: '#d4d4d4',
  marginTop: 10,
  lineHeight: 1.5
};

const stats = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
  gap: 12
};

const statCard = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 16,
  padding: 16,
  display: 'grid',
  gap: 8,
  textAlign: 'center' as const,
  color: '#fff'
};
