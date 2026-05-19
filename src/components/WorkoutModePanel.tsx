import { useMemo, useState } from 'react';
import { suggestProgression, type LogbookSet } from '../utils/smartLogbookEngine';
import WorkoutTimer from './WorkoutTimer';

type WorkoutStep = {
  id: string;
  exercise: string;
  group: string;
  setType: 'Warm-up' | 'Feeder' | 'Top Set' | 'Back-off';
  range: string;
  rest: string;
  previous: string;
  target: string;
};

const steps: WorkoutStep[] = [
  {
    id: 'hack-top',
    exercise: 'Hack Machine',
    group: 'Quadríceps',
    setType: 'Top Set',
    range: '5-10 reps',
    rest: '3 min',
    previous: '30kg x 10',
    target: '32kg x 6-8 ou 30kg x 11+'
  },
  {
    id: 'leg-backoff',
    exercise: 'Leg Press 45',
    group: 'Quadríceps',
    setType: 'Back-off',
    range: '8-12 reps',
    rest: '2-3 min',
    previous: '160kg x 12',
    target: '165kg x 8-10 ou consolidar 160kg'
  },
  {
    id: 'flexora-top',
    exercise: 'Mesa Flexora',
    group: 'Posteriores',
    setType: 'Top Set',
    range: '8-15 reps',
    rest: '90s',
    previous: '75kg x 10',
    target: '75kg x 11+'
  }
];

export default function WorkoutModePanel() {
  const [index, setIndex] = useState(0);
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [rir, setRir] = useState('');
  const [execution, setExecution] = useState<'excelente' | 'boa' | 'ok' | 'ruim'>('boa');
  const current = steps[index];

  const decision = useMemo(() => {
    const set: LogbookSet = {
      kind: current.setType === 'Warm-up' || current.setType === 'Feeder' ? 'feeder' : 'working',
      load: Number(load) || 0,
      reps: Number(reps) || 0,
      minReps: Number(current.range.match(/\d+/)?.[0]) || 6,
      maxReps: Number(current.range.match(/\d+/g)?.[1]) || 12,
      rir: Number(rir),
      quality: execution === 'excelente' ? 'high' : execution === 'ruim' ? 'low' : 'ok'
    };
    return suggestProgression(set);
  }, [current, execution, load, reps, rir]);

  function saveAndNext() {
    setLoad('');
    setReps('');
    setRir('');
    setExecution('boa');
    setIndex((value) => Math.min(value + 1, steps.length - 1));
  }

  return (
    <div style={panel}>
      <div style={topbar}>
        <div>
          <span style={kicker}>WORKOUT MODE</span>
          <h2 style={title}>{current.exercise}</h2>
          <p style={sub}>{current.group} • {current.setType} • {current.range} • Descanso {current.rest}</p>
        </div>
        <span style={counter}>{index + 1}/{steps.length}</span>
      </div>

      <WorkoutTimer />

      <div style={contextGrid}>
        <div style={contextCard}>
          <span style={contextLabel}>Última sessão</span>
          <strong>{current.previous}</strong>
        </div>
        <div style={contextCard}>
          <span style={contextLabel}>Meta atual</span>
          <strong>{current.target}</strong>
        </div>
      </div>

      <div style={inputGrid}>
        <input style={input} value={load} onChange={(event) => setLoad(event.target.value)} placeholder="Carga" />
        <input style={input} value={reps} onChange={(event) => setReps(event.target.value)} placeholder="Reps" />
        <input style={input} value={rir} onChange={(event) => setRir(event.target.value)} placeholder="RIR" />
        <select style={input} value={execution} onChange={(event) => setExecution(event.target.value as typeof execution)}>
          <option>excelente</option>
          <option>boa</option>
          <option>ok</option>
          <option>ruim</option>
        </select>
      </div>

      <div style={decisionBox}>
        <strong>IA DG: {decision.action.replace('_', ' ')}</strong>
        <p style={decisionText}>{decision.reason}</p>
      </div>

      <button style={button} onClick={saveAndNext}>SALVAR SET E AVANÇAR</button>
    </div>
  );
}

const panel = { background: 'linear-gradient(180deg,#101010,#070707)', border: '1px solid #2a2a2a', borderRadius: 26, padding: 22, marginBottom: 22, boxShadow: '0 0 40px rgba(224,22,22,.12)' };
const topbar = { display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start', marginBottom: 16 };
const kicker = { color: '#ffb8b8', fontSize: 11, fontWeight: 900, letterSpacing: 2 };
const title = { fontSize: 34, margin: '6px 0 4px' };
const sub = { color: '#aaa', margin: 0 };
const counter = { background: '#210707', border: '1px solid #4c1111', color: '#ffb8b8', borderRadius: 999, padding: '8px 12px', fontWeight: 900 };
const contextGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, margin: '16px 0' };
const contextCard = { background: '#0b0b0b', border: '1px solid #252525', borderRadius: 16, padding: 14, color: '#fff' };
const contextLabel = { display: 'block', color: '#aaa', fontSize: 12, marginBottom: 6 };
const inputGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10, marginTop: 12 };
const input = { background: '#090909', color: '#fff', border: '1px solid #2a2a2a', borderRadius: 14, padding: '14px 14px', width: '100%' };
const decisionBox = { background: '#180909', border: '1px solid #351111', borderRadius: 16, padding: 14, marginTop: 14, color: '#fff' };
const decisionText = { color: '#ffb8b8', margin: '7px 0 0', lineHeight: 1.45 };
const button = { background: '#e01616', color: '#fff', border: 0, borderRadius: 16, padding: '15px 18px', marginTop: 14, width: '100%', cursor: 'pointer', fontWeight: 900 };
