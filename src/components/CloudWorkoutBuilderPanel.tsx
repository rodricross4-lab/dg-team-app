import { useState } from 'react';
import { useCloudWorkouts } from '../hooks/useCloudWorkouts';

type Props = {
  studentId: string;
};

export default function CloudWorkoutBuilderPanel({ studentId }: Props) {
  const cloud = useCloudWorkouts(studentId);

  const [name, setName] = useState('');
  const [week, setWeek] = useState(1);
  const [split, setSplit] = useState('Upper/Lower');

  async function handleCreate() {
    if (!name) return;

    await cloud.saveWorkout({
      student_id: studentId,
      week,
      name,
      split,
      exercises: []
    });

    setName('');
  }

  return (
    <div style={panel}>
      <div style={header}>
        <div>
          <h3 style={{ margin: 0 }}>Cloud Workout Builder</h3>
          <p style={subtitle}>Criação realtime de treinos em nuvem.</p>
        </div>

        <span style={badge}>{cloud.workouts.length} treino(s)</span>
      </div>

      <div style={form}>
        <input
          style={input}
          placeholder="Nome do treino"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={input}
          type="number"
          min={1}
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
        />

        <select style={input} value={split} onChange={(e) => setSplit(e.target.value)}>
          <option>Upper/Lower</option>
          <option>PPL</option>
          <option>Full Body</option>
          <option>Especialização</option>
        </select>

        <button style={button} onClick={handleCreate}>
          Criar treino
        </button>
      </div>

      <div style={statusBox}>
        <strong>Status:</strong>
        <p style={text}>{cloud.message}</p>
      </div>

      <div style={list}>
        {cloud.workouts.map((workout) => (
          <div key={workout.id || workout.name} style={card}>
            <div style={top}>
              <strong>{workout.name}</strong>
              <span style={tag}>Semana {workout.week}</span>
            </div>

            <p style={text}>{workout.split}</p>
          </div>
        ))}
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

const form = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
  gap: 12,
  marginBottom: 16
};

const input = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 12,
  padding: '12px 14px',
  color: '#fff'
};

const button = {
  background: '#e01616',
  color: '#fff',
  border: 0,
  borderRadius: 12,
  padding: '12px 14px',
  cursor: 'pointer',
  fontWeight: 800
};

const statusBox = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 18,
  padding: 16,
  marginBottom: 16,
  color: '#fff'
};

const list = {
  display: 'grid',
  gap: 12
};

const card = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16
};

const top = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  flexWrap: 'wrap' as const
};

const text = {
  color: '#d4d4d4',
  marginTop: 10,
  lineHeight: 1.5
};

const tag = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 99,
  padding: '4px 10px',
  color: '#ffb8b8',
  fontSize: 11,
  fontWeight: 900,
  textTransform: 'uppercase' as const
};
