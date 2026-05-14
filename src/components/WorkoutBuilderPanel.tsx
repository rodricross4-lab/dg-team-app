import { useState } from 'react';

type ExerciseRow = {
  id: number;
  name: string;
  group: string;
  warmup: string;
  feeder: string;
  validSets: string;
  reps: string;
  rest: string;
  notes: string;
};

const defaultExercise: ExerciseRow = {
  id: 1,
  name: 'Supino inclinado halteres',
  group: 'Peitoral',
  warmup: '1x 10-12',
  feeder: '2x progressivas',
  validSets: '2',
  reps: '6-10',
  rest: '2-3 min',
  notes: 'Séries válidas próximas da falha. Bateu topo do range, subir carga.'
};

export default function WorkoutBuilderPanel() {
  const [workoutName, setWorkoutName] = useState('Treino A');
  const [week, setWeek] = useState('Semana 1');
  const [exercises, setExercises] = useState<ExerciseRow[]>([defaultExercise]);

  function updateExercise(id: number, patch: Partial<ExerciseRow>) {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === id ? { ...exercise, ...patch } : exercise
      )
    );
  }

  function addExercise() {
    setExercises((current) => [
      ...current,
      {
        ...defaultExercise,
        id: Date.now(),
        name: 'Novo exercício',
        group: 'Grupamento'
      }
    ]);
  }

  function removeExercise(id: number) {
    setExercises((current) => current.filter((exercise) => exercise.id !== id));
  }

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 10 }}>Editor de treino do aluno</h2>
      <p style={{ color: '#a0a0a0', marginBottom: 18 }}>
        Crie, edite e organize os treinos semanais do aluno com séries de aquecimento, ajuste e válidas.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <input value={workoutName} onChange={(event) => setWorkoutName(event.target.value)} style={input} />
        <select value={week} onChange={(event) => setWeek(event.target.value)} style={input}>
          {Array.from({ length: 8 }, (_, index) => (
            <option key={index}>Semana {index + 1}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {exercises.map((exercise) => (
          <div key={exercise.id} style={exerciseCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
              <strong style={{ color: '#e01616' }}>{exercise.name}</strong>
              <button onClick={() => removeExercise(exercise.id)} style={dangerButton}>Remover</button>
            </div>

            <div style={grid}>
              <input value={exercise.name} onChange={(event) => updateExercise(exercise.id, { name: event.target.value })} style={input} placeholder="Exercício" />
              <input value={exercise.group} onChange={(event) => updateExercise(exercise.id, { group: event.target.value })} style={input} placeholder="Grupamento" />
              <input value={exercise.warmup} onChange={(event) => updateExercise(exercise.id, { warmup: event.target.value })} style={input} placeholder="Aquecimento" />
              <input value={exercise.feeder} onChange={(event) => updateExercise(exercise.id, { feeder: event.target.value })} style={input} placeholder="Séries de ajuste" />
              <input value={exercise.validSets} onChange={(event) => updateExercise(exercise.id, { validSets: event.target.value })} style={input} placeholder="Séries válidas" />
              <input value={exercise.reps} onChange={(event) => updateExercise(exercise.id, { reps: event.target.value })} style={input} placeholder="Range reps" />
              <input value={exercise.rest} onChange={(event) => updateExercise(exercise.id, { rest: event.target.value })} style={input} placeholder="Descanso" />
            </div>

            <textarea value={exercise.notes} onChange={(event) => updateExercise(exercise.id, { notes: event.target.value })} style={{ ...input, minHeight: 80, marginTop: 12 }} placeholder="Observações técnicas" />
          </div>
        ))}
      </div>

      <button onClick={addExercise} style={button}>+ Adicionar exercício</button>
      <button style={saveButton}>SALVAR TREINO DO ALUNO</button>
    </div>
  );
}

const panel = {
  background: '#101010',
  border: '1px solid #262626',
  borderRadius: 24,
  padding: 24,
  marginBottom: 22
};

const exerciseCard = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
  gap: 10
};

const input = {
  background: '#090909',
  color: '#fff',
  border: '1px solid #262626',
  borderRadius: 12,
  padding: '12px 14px',
  width: '100%'
};

const button = {
  background: '#161616',
  color: '#fff',
  border: '1px solid #333',
  borderRadius: 14,
  padding: '14px 18px',
  marginTop: 16,
  width: '100%',
  cursor: 'pointer',
  fontWeight: 800
};

const saveButton = {
  ...button,
  background: '#e01616',
  border: 0
};

const dangerButton = {
  background: '#260808',
  color: '#ffb8b8',
  border: '1px solid #4a1111',
  borderRadius: 10,
  padding: '8px 10px',
  cursor: 'pointer'
};
