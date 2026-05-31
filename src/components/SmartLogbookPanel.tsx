import { useMemo, useState } from 'react';
import type { LogbookSet, WorkoutSession } from '../types';
import { getStudentWorkouts } from '../store/operationalStore';
import { finishWorkoutSession, getEffectiveVolume, getExerciseSessionGroups, getPreviousExerciseSets, getVolumeLoad, saveLogbookSet, startWorkoutSession } from '../services/logbookService';
import { getTenantContext } from '../services/tenantContextService';
import { analyzeProgression, analyzeRecovery, detectPersonalRecords, getBestValidSet } from '../utils/dgTrainingRules';
import WorkoutModePanel from './WorkoutModePanel';
import WorkoutTimer from './WorkoutTimer';

type Props = { studentId: string };

type SetLog = {
  setId?: string;
  exerciseId: string;
  load: string;
  reps: string;
  rir: string;
  execution: string;
};

function toExecutionQuality(execution: string): LogbookSet['execution_quality'] {
  if (execution === 'excelente') return 5;
  if (execution === 'boa') return 4;
  if (execution === 'ok') return 3;
  return 2;
}

function parseRepRange(range: string) {
  const [min, max] = range.split('-').map((value) => Number(value.trim()));
  return {
    min: Number.isFinite(min) ? min : 6,
    max: Number.isFinite(max) ? max : 12,
  };
}

function getDecisionStyle(priority: string) {
  if (priority === 'success') return progressionSuccess;
  if (priority === 'danger') return progressionDanger;
  if (priority === 'warning') return progressionWarning;
  return progressionInfo;
}

function getRecoveryStyle(severity: string) {
  if (severity === 'danger') return recoveryDanger;
  if (severity === 'warning') return recoveryWarning;
  return recoveryInfo;
}

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function SmartLogbookPanel({ studentId }: Props) {
  const workouts = useMemo(() => getStudentWorkouts(studentId), [studentId]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workouts[0]?.id || '');
  const selectedWorkout = workouts.find((workout) => workout.id === selectedWorkoutId);
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [sets, setSets] = useState<LogbookSet[]>([]);
  const [logs, setLogs] = useState<SetLog[]>([]);
  const [savedAt, setSavedAt] = useState('');

  async function ensureSession() {
    if (session) return session;
    const context = getTenantContext();

    const result = await startWorkoutSession({
      tenant_id: context.tenant_id,
      student_id: studentId,
      workout_id: selectedWorkoutId || 'manual-workout',
    });

    setSession(result.data);
    return result.data;
  }

  async function updateLog(exerciseId: string, patch: Partial<SetLog>) {
    const activeSession = await ensureSession();

    const currentLog = getLog(exerciseId);
    const nextLog = { ...currentLog, ...patch };

    const saved = await saveLogbookSet({
      id: nextLog.setId,
      tenant_id: activeSession.tenant_id,
      session_id: activeSession.id,
      student_id: studentId,
      exercise_id: exerciseId,
      set_type: 'valid',
      set_order: 1,
      weight_kg: Number(nextLog.load) || 0,
      reps: Number(nextLog.reps) || 0,
      rir: nextLog.rir === '' ? undefined : Number(nextLog.rir),
      execution_quality: toExecutionQuality(nextLog.execution),
    });

    setLogs((current) => {
      const exists = current.some((item) => item.exerciseId === exerciseId);
      const next = exists
        ? current.map((item) => (item.exerciseId === exerciseId ? { ...nextLog, setId: saved.data.id } : item))
        : [...current, { ...nextLog, setId: saved.data.id }];

      return next;
    });

    setSets((current) => {
      const exists = current.some((item) => item.id === saved.data.id);
      return exists
        ? current.map((item) => (item.id === saved.data.id ? saved.data : item))
        : [saved.data, ...current];
    });

    setSavedAt(new Date().toISOString());
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

  async function finishWorkout() {
    if (!session) return;

    const result = await finishWorkoutSession(session.id);
    setSavedAt(new Date().toISOString());

    if (result.data) {
      setSession(result.data);
    }
  }

  const effectiveVolume = getEffectiveVolume(sets);
  const volumeLoad = getVolumeLoad(sets);

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 10 }}>Logbook presencial inteligente</h2>
      <p style={{ color: '#a0a0a0', marginBottom: 18 }}>
        Registra sessões reais, séries válidas, volume e volume load com sync queue.
      </p>

      <WorkoutModePanel />
      <WorkoutTimer />

      <div style={ruleBox}>
        Regra DG TEAM: aquecimento e feeder não contam volume. Apenas séries válidas entram no volume efetivo e na decisão de progressão.
      </div>

      <div style={statusBox}>
        <span>Treinos disponíveis: <strong>{workouts.length}</strong></span>
        <span>Sessão atual: <strong>{session?.status || 'não iniciada'}</strong></span>
        <span>Séries válidas registradas: <strong>{effectiveVolume}</strong></span>
        <span>Volume load válido: <strong>{volumeLoad}kg</strong></span>
        <span>Último salvamento: <strong>{savedAt || 'aguardando primeiro set'}</strong></span>
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
              const exerciseSets = sets.filter((set) => set.exercise_id === exercise.id);
              const range = parseRepRange(exercise.reps);
              const maxRecommendedValidSets = Number(exercise.validSets) || undefined;
              const previousSets = session ? getPreviousExerciseSets(studentId, exercise.id, session.id) : [];
              const historyGroups = getExerciseSessionGroups(studentId, exercise.id);
              const lastHistoryGroup = session
                ? historyGroups.find((group) => group.session_id !== session.id)
                : historyGroups[0];
              const lastBestSet = getBestValidSet(lastHistoryGroup?.sets || previousSets);
              const decision = analyzeProgression({
                currentSets: exerciseSets,
                previousSets,
                targetMin: range.min,
                targetMax: range.max,
              });
              const prs = detectPersonalRecords({ currentSets: exerciseSets, previousSets });
              const recoveryAlerts = analyzeRecovery({
                currentSets: exerciseSets,
                previousSets,
                maxRecommendedValidSets,
              });

              return (
                <div key={exercise.id} style={exerciseCard}>
                  <strong style={{ color: '#e01616' }}>{exercise.name}</strong>
                  <p style={{ color: '#a0a0a0', margin: '8px 0' }}>
                    {exercise.group} • Válidas: {exercise.validSets} • Range: {exercise.reps} • Descanso: {exercise.rest}
                  </p>

                  {lastHistoryGroup && (
                    <div style={historyBox}>
                      <span>Historico real: {formatShortDate(lastHistoryGroup.performed_at)}</span>
                      <span>Melhor serie: {lastBestSet?.weight_kg || 0}kg x {lastBestSet?.reps || 0}</span>
                      <span>Volume anterior: {lastHistoryGroup.volumeLoad}kg</span>
                    </div>
                  )}

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

                  {prs.length > 0 && (
                    <div style={prBox}>
                      {prs.map((pr) => (
                        <div key={`${pr.type}-${pr.currentValue}`} style={prBadge}>
                          <strong>{pr.label}</strong>
                          <span>{pr.message}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {recoveryAlerts.length > 0 && (
                    <div style={recoveryBox}>
                      {recoveryAlerts.map((alert) => (
                        <div key={`${alert.type}-${alert.label}`} style={getRecoveryStyle(alert.severity)}>
                          <strong>{alert.label}</strong>
                          <p style={{ margin: '6px 0 0' }}>{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={getDecisionStyle(decision.priority)}>
                    <strong>{decision.label}</strong>
                    <p style={{ margin: '6px 0 0' }}>{decision.message}</p>
                  </div>
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
const historyBox = { background: '#101820', border: '1px solid #223044', borderRadius: 14, color: '#cfe3ff', display: 'grid', gap: 6, margin: '10px 0 12px', padding: 12 };
const saveButton = { background: '#e01616', color: '#fff', border: 0, borderRadius: 14, padding: '14px 18px', marginTop: 18, width: '100%', cursor: 'pointer', fontWeight: 800 };
const progressionInfo = { background: '#111827', border: '1px solid #273449', borderRadius: 14, color: '#dbeafe', padding: 12, marginTop: 12 };
const progressionSuccess = { background: '#07180d', border: '1px solid #174d27', borderRadius: 14, color: '#b7f7c8', padding: 12, marginTop: 12 };
const progressionWarning = { background: '#1a1305', border: '1px solid #5a3b0b', borderRadius: 14, color: '#ffe3a3', padding: 12, marginTop: 12 };
const progressionDanger = { background: '#1c0707', border: '1px solid #5a1515', borderRadius: 14, color: '#ffb8b8', padding: 12, marginTop: 12 };
const prBox = { display: 'grid', gap: 8, marginTop: 12 };
const prBadge = { background: 'linear-gradient(90deg,#2b1600,#0b0b0b)', border: '1px solid #8a5b12', borderRadius: 14, color: '#ffe7ad', padding: 12, display: 'grid', gap: 4 };
const recoveryBox = { display: 'grid', gap: 8, marginTop: 12 };
const recoveryInfo = { background: '#0a1420', border: '1px solid #1f4063', borderRadius: 14, color: '#b8dcff', padding: 12 };
const recoveryWarning = { background: '#1a1305', border: '1px solid #5a3b0b', borderRadius: 14, color: '#ffe3a3', padding: 12 };
const recoveryDanger = { background: '#1c0707', border: '1px solid #5a1515', borderRadius: 14, color: '#ffb8b8', padding: 12 };
