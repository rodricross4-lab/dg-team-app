import type { WorkoutExercise } from '../types';

type Props = {
  exercise: WorkoutExercise;
};

export default function WorkoutExerciseCard({ exercise }: Props) {
  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <h3>{exercise.name}</h3>

        <p style={{ color: '#a0a0a0' }}>
          {exercise.group} • {exercise.range} • {exercise.rest}
        </p>
      </div>

      {exercise.sets.map((set) => (
        <div
          key={set.id}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5,1fr)',
            gap: 10,
            marginBottom: 10,
            background: '#0a0a0a',
            border: '1px solid #1f1f1f',
            borderRadius: 14,
            padding: 12
          }}
        >
          <div>
            <p style={label}>Tipo</p>
            <strong>{set.type}</strong>
          </div>

          <div>
            <p style={label}>Carga</p>
            <strong>{set.load}kg</strong>
          </div>

          <div>
            <p style={label}>Reps</p>
            <strong>{set.reps}</strong>
          </div>

          <div>
            <p style={label}>RIR</p>
            <strong>{set.rir}</strong>
          </div>

          <div>
            <p style={label}>Conta volume</p>
            <strong>{set.countsVolume ? 'Sim' : 'Não'}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}

const label = {
  color: '#888',
  fontSize: 12,
  marginBottom: 4
};
