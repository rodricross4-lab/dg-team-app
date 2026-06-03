import { useState } from 'react';
import { exerciseLibrary, formatRepRange, formatRest } from '../data/exerciseLibrary';
import { loadAppStore } from '../store/appStore';
import { getStudentWorkouts, upsertWorkout } from '../store/operationalStore';
import { exportWorkoutPdf } from '../utils/pdfExport';

type Props = { studentId: string };

type ExerciseRow = {
  id: string;
  name: string;
  group: string;
  warmup: string;
  feeder: string;
  validSets: string;
  reps: string;
  rest: string;
  notes: string;
};

const defaultPreset = exerciseLibrary.find((exercise) => exercise.id === 'global-supino-inclinado-halteres') ?? exerciseLibrary[0];

const defaultExercise = {
  name: defaultPreset.name,
  group: defaultPreset.muscle_group,
  warmup: '1x 10-12',
  feeder: '2x progressivas',
  validSets: '2',
  reps: formatRepRange(defaultPreset),
  rest: formatRest(defaultPreset),
  notes: defaultPreset.notes || 'Series validas proximas da falha. Bateu topo do range, subir carga.'
};

function createExerciseRow(patch: Partial<ExerciseRow> = {}): ExerciseRow {
  return {
    ...defaultExercise,
    id: crypto.randomUUID(),
    ...patch
  };
}

function createExerciseRowFromPreset(presetId: string, id: string = crypto.randomUUID()): ExerciseRow {
  const preset = exerciseLibrary.find((exercise) => exercise.id === presetId) ?? defaultPreset;

  return {
    ...defaultExercise,
    id,
    name: preset.name,
    group: preset.muscle_group,
    reps: formatRepRange(preset),
    rest: formatRest(preset),
    notes: preset.notes || defaultExercise.notes
  };
}

function getStudentName(studentId: string) {
  return loadAppStore().students.find((student) => student.id === studentId)?.name || 'Aluno';
}

export default function WorkoutBuilderPanel({ studentId }: Props) {
  const [workoutName, setWorkoutName] = useState('Treino A');
  const [week, setWeek] = useState('Semana 1');
  const [workoutId] = useState(() => crypto.randomUUID());
  const [exercises, setExercises] = useState<ExerciseRow[]>(() => [createExerciseRow()]);
  const [savedAt, setSavedAt] = useState('');
  const [savedCount, setSavedCount] = useState(() => getStudentWorkouts(studentId).length);

  function updateExercise(id: string, patch: Partial<ExerciseRow>) {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === id ? { ...exercise, ...patch } : exercise
      )
    );
  }

  function addExercise() {
    setExercises((current) => [
      ...current,
      createExerciseRowFromPreset(exerciseLibrary[current.length % exerciseLibrary.length].id)
    ]);
  }

  function applyExercisePreset(id: string, presetId: string) {
    if (!presetId) return;
    updateExercise(id, createExerciseRowFromPreset(presetId, id));
  }

  function removeExercise(id: string) {
    setExercises((current) => current.filter((exercise) => exercise.id !== id));
  }

  function saveWorkout() {
    const weekNumber = Number(week.replace('Semana ', '')) || 1;
    const updatedAt = new Date().toISOString();

    upsertWorkout({
      id: workoutId,
      studentId,
      week: weekNumber,
      name: workoutName,
      updatedAt,
      exercises
    });

    setSavedAt(updatedAt);
    setSavedCount(getStudentWorkouts(studentId).length);
  }

  function exportPdf() {
    exportWorkoutPdf(getStudentName(studentId), `${workoutName} - ${week}`, exercises);
  }

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 10 }}>Editor de treino do aluno</h2>
      <p style={{ color: '#a0a0a0', marginBottom: 18 }}>
        Crie, edite e organize os treinos semanais do aluno com series de aquecimento, ajuste e validas.
      </p>

      <div style={statusBox}>
        <span>Treinos salvos deste aluno: <strong>{savedCount}</strong></span>
        <span>Ultimo salvamento: <strong>{savedAt || 'ainda nao salvo'}</strong></span>
      </div>

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
              <select value={exerciseLibrary.find((preset) => preset.name === exercise.name)?.id || ''} onChange={(event) => applyExercisePreset(exercise.id, event.target.value)} style={input}>
                <option value="">Exercicio personalizado</option>
                {exerciseLibrary.map((preset) => (
                  <option key={preset.id} value={preset.id}>{preset.name}</option>
                ))}
              </select>
              <input value={exercise.name} onChange={(event) => updateExercise(exercise.id, { name: event.target.value })} style={input} placeholder="Exercicio" />
              <input value={exercise.group} onChange={(event) => updateExercise(exercise.id, { group: event.target.value })} style={input} placeholder="Grupamento" />
              <input value={exercise.warmup} onChange={(event) => updateExercise(exercise.id, { warmup: event.target.value })} style={input} placeholder="Aquecimento" />
              <input value={exercise.feeder} onChange={(event) => updateExercise(exercise.id, { feeder: event.target.value })} style={input} placeholder="Series de ajuste" />
              <input value={exercise.validSets} onChange={(event) => updateExercise(exercise.id, { validSets: event.target.value })} style={input} placeholder="Series validas" />
              <input value={exercise.reps} onChange={(event) => updateExercise(exercise.id, { reps: event.target.value })} style={input} placeholder="Range reps" />
              <input value={exercise.rest} onChange={(event) => updateExercise(exercise.id, { rest: event.target.value })} style={input} placeholder="Descanso" />
            </div>

            <textarea value={exercise.notes} onChange={(event) => updateExercise(exercise.id, { notes: event.target.value })} style={{ ...input, minHeight: 80, marginTop: 12 }} placeholder="Observacoes tecnicas" />
          </div>
        ))}
      </div>

      <button onClick={addExercise} style={button}>+ Adicionar exercicio</button>
      <button onClick={saveWorkout} style={saveButton}>SALVAR TREINO DO ALUNO</button>
      <button onClick={exportPdf} style={button}>EXPORTAR PDF DO TREINO</button>
    </div>
  );
}

const panel = { background: '#101010', border: '1px solid #262626', borderRadius: 24, padding: 24, marginBottom: 22 };
const exerciseCard = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 18, padding: 16 };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 };
const input = { background: '#090909', color: '#fff', border: '1px solid #262626', borderRadius: 12, padding: '12px 14px', width: '100%' };
const button = { background: '#161616', color: '#fff', border: '1px solid #333', borderRadius: 14, padding: '14px 18px', marginTop: 16, width: '100%', cursor: 'pointer', fontWeight: 800 };
const saveButton = { ...button, background: '#e01616', border: 0 };
const dangerButton = { background: '#260808', color: '#ffb8b8', border: '1px solid #4a1111', borderRadius: 10, padding: '8px 10px', cursor: 'pointer' };
const statusBox = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 16, padding: 14, display: 'grid', gap: 8, color: '#d8d8d8', marginBottom: 18 };
