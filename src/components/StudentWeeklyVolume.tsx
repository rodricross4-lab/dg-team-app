import { getWeeklyVolumeByMuscle } from '../services/analyticsService';

type Props = {
  studentId?: string;
};

function getVolumeStatus(validSets: number) {
  if (validSets >= 14) return 'Atencao';
  if (validSets >= 8) return 'Adequado';
  if (validSets > 0) return 'Construindo';
  return 'Sem volume';
}

export default function StudentWeeklyVolume({ studentId }: Props) {
  const muscles = getWeeklyVolumeByMuscle(studentId);
  const max = Math.max(...muscles.map((item) => item.validSets), 1);

  return (
    <div style={panel}>
      <div style={head}>
        <div>
          <h2 style={{ margin: 0 }}>Volume semanal DG TEAM</h2>
          <p style={sub}>Distribuicao de series validas por grupamento muscular.</p>
        </div>
        <span style={tag}>VOLUME</span>
      </div>

      <div style={list}>
        {muscles.length ? muscles.map((item) => {
          const width = `${(item.validSets / max) * 100}%`;
          const status = getVolumeStatus(item.validSets);

          return (
            <div key={item.muscle} style={row}>
              <div style={rowTop}>
                <strong>{item.muscle}</strong>
                <span style={setsText}>{item.validSets} series validas - {status} - {item.volumeLoad}kg</span>
              </div>
              <div style={barTrack}>
                <div style={{ ...barFill, width }} />
              </div>
            </div>
          );
        }) : (
          <div style={empty}>Sem volume valido nos ultimos 7 dias.</div>
        )}
      </div>
    </div>
  );
}

const panel = {
  background: 'linear-gradient(180deg,#101010,#080808)',
  border: '1px solid #2a2a2a',
  borderRadius: 24,
  padding: 22,
  marginBottom: 22,
  boxShadow: '0 0 32px rgba(224,22,22,.07)'
};
const head = { display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 18 };
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
const row = { background: '#0b0b0b', border: '1px solid #252525', borderRadius: 16, padding: 14 };
const rowTop = { display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10, color: '#fff' };
const setsText = { color: '#ffb8b8', fontSize: 12, fontWeight: 900 };
const barTrack = { background: '#1a1a1a', borderRadius: 999, height: 10, overflow: 'hidden' };
const barFill = { background: 'linear-gradient(90deg,#e01616,#640808)', height: '100%', borderRadius: 999 };
const empty = {
  background: '#0b0b0b',
  border: '1px dashed #252525',
  borderRadius: 16,
  padding: 14,
  color: '#aaa'
};
