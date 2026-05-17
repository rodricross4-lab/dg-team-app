import { useMemo, useState } from 'react';
import { getStudentWorkouts } from '../store/operationalStore';
import { calculateEffectiveVolume, calculateVolumeLoad, type LogbookSet } from '../utils/smartLogbookEngine';
import WorkoutTimer from './WorkoutTimer';

type Props = { studentId: number };

type SetLog = {
  exerciseId: string;
  load: string;
  reps: string;
  rir: string;
  execution: string;
};

const LOG_KEY = 'dg-team-logbook-store';

function loadLogs(studentId: number): SetLog[] {
  try {
    const raw = localStorage.getItem(`${LOG_KEY}-${studentId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(studentId: number, logs: SetLog[]) {
  localStorage.setItem(`${LOG_KEY}-${studentId}`, JSON.stringify(logs));
}

function toQuality(execution: string): LogbookSet['quality'] {
  if (execution === 'excelente') return 'high';
  if (execution === 'ruim') return 'low';
  return 'ok';
}

export default function SmartLogbookPanel({ studentId }: Props) {
  const workouts = useMemo(() => getStudentWorkouts(studentId), [studentId]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workouts[0]?.id || '');
  const selectedWorkout = workouts.find((workout) => workout.id === selectedWorkoutId);
  const [logs, setLogs] = useState<SetLog[]>(() => loadLogs(studentId));
  const [savedAt, setSavedAt] = useState('');

  function updateLog(exerciseId: string, patch: Partial<SetLog>) {
    setLogs((current) => {
      const exists = current.some((item) => item.exerciseId === exerciseId);
      const next = exists
        ? current.map((item) => (item.exerciseId === exerciseId ? { ...item, ...patch } : item))
        : [...current, { exerciseId, load: '', reps: '', rir: '', execution: 'boa', ...patch }];

      saveLogs(studentId, next);
      return next;
    });
  }

  function getLog(exerciseId: string) {
    return logs.find((item) => item.exerciseId === exerciseId) || {
      exerciseId,
      load: '',
      reps: '',
      rir: '',
      execution: 'boa'
    };
  }

  function finishWorkout() {
    const now = new Date().toISOString();
    saveLogs(studentId, logs);
    setSavedAt(now);
  }

  const validSets: LogbookSet[] = logs
    .map((log) => ({
      kind: 'working' as const,
      load: Number(log.load) || 0,
      reps: Number(log.reps) || 0,
      minReps: 6,
      maxReps: 12,
      rir: Number(log.rir),
      quality: toQuality(log.execution)
    }))
    .filter((set) => set.load > 0 || set.reps > 0);

  const effectiveVolume = calculateEffectiveVolume(validSets);
  const volumeLoad = calculateVolumeLoad(validSets);

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 10 }}>Logbook presencial inteligente</h2>
      <p style={{ color: '#a0a0a0', marginBottom: 18 }}>
        Puxa os treinos salvos do aluno e registra cargas/reps somente das séries válidas.
      </p>

      <WorkoutTimer />

      <div style={ruleBox}>
        Regra DG TEAM: aquecimento e feeder não contam volume. Apenas séries válidas entram no volume efetivo e na decisão de progressão.
      </div>

      <div style={statusBox}>
        <span>Treinos disponíveis: <strong>{workouts.length}</strong></span>
        <span>Séries válidas registradas: <strong>{effectiveVolume}</strong></span>
        <span>Volume load válido: <strong>{volumeLoad}kg</strong></span>
        <span>Último salvamento: <strong>{savedAt || 'autosave ativo'}</strong></span>
      </div>

      {workouts.length === 0 ? (
        <div style={emptyState}>
          Nenhum treino salvo para este aluno. Crie um treino na aba Treinos primeiro.
        </div>
      ) : (
        <>
          <select value={selectedWorkoutId} onChange={(event) => setSelectedWorkoutId(event.target.value)} style={input}>
            {workouts.map((workout) => (
              <option key={workout.id} value={workout.id}>
                Semana {workout.week} • {workout.name}
              </option>
            ))}
          </select>

          <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
            {selectedWorkout?.exercises.map((exercise) => {
              const log = getLog(exercise.id);

              return (
                <div key={exercise.id} style={exerciseCard}>
                  <strong style={{ color: '#e01616' }}>{exercise.name}</strong>
                  <p style={{ color: '#a0a0a0', margin: '8px 0' }}>
                    {exercise.group} • Válidas: {exercise.validSets} • Range: {exercise.reps} • Descanso: {exercise.rest}
                  </p>

                  <div style={grid}>
                    <input value={log.load} onChange={(event) => updateLog(exercise.id, { load: event.target.value })} style={input} placeholder="Carga válida" />
                    <input value={log.reps} onChange={(event) => updateLog(exercise.id, { reps: event.target.value })} style={input} placeholder="Reps válida" />
                    <input value={log.rir} onChange={(event) => updateLog(exercise.id, { rir: event.target.value })} style={input} placeholder="RIR" />
                    <select value={log.execution} onChange={(event) => updateLog(exercise.id, { execution: event.target.value })} style={input}>
                      <option>excelente</option>
                      <option>boa</option>
                      <option>ok</option>
                      <option>ruim</option>
                    </select>
                  </div>

                  <p style={{ color: '#ffb8b8', marginTop: 10 }}>
                    IA DG: bateu topo do range com execução boa/excelente? Próxima sessão pode subir carga com microloading.
                  </p>
                </div>
              );
            })}
          </div>

          <button onClick={finishWorkout} style={saveButton}>FINALIZAR E SALVAR TREINO</button>
        </>
      )}
    </div>
  );
}

const panel = { background: '#101010', border: '1px solid #262626', borderRadius: 24, padding: 24, marginBottom: 22 };
const ruleBox = { background: '#180909', border: '1px solid #351111', borderRadius: 16, padding: 14, color: '#ffb8b8', marginBottom: 14 };
const statusBox = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 16, padding: 14, display: 'grid', gap: 8, color: '#d8d8d8', margin: '18px 0' };
const emptyState = { background: '#180909', border: '1px solid #351111', borderRadius: 16, padding: 18, color: '#ffb8b8' };
const input = { background: '#090909', color: '#fff', border: '1px solid #262626', borderRadius: 12, padding: '12px 14px', width: '100%' };
const exerciseCard = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 18, padding: 16 };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 };
const saveButton = { background: '#e01616', color: '#fff', border: 0, borderRadius: 14, padding: '14px 18px', marginTop: 18, width: '100%', cursor: 'pointer', fontWeight: 800 };
