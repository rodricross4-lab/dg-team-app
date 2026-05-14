import { useState } from 'react';
import { loadAppStore, saveStudentWorkouts } from '../store/appStore';
import { createEightWeekCycle } from '../utils/trainingFactory';

type Props = {
  studentId: number;
  frequency: number;
};

export default function TrainingGeneratorPanel({ studentId, frequency }: Props) {
  const [savedCount, setSavedCount] = useState(() => {
    const store = loadAppStore();
    return store.workouts[studentId]?.length || 0;
  });

  function handleGenerate() {
    const store = loadAppStore();
    const workouts = createEightWeekCycle(frequency);
    const next = saveStudentWorkouts(store, studentId, workouts);
    setSavedCount(next.workouts[studentId]?.length || 0);
  }

  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 24,
        padding: 24,
        marginBottom: 22,
        boxShadow: '0 0 26px rgba(224,22,22,.10)'
      }}
    >
      <h2 style={{ marginBottom: 10 }}>Gerador de treino DG TEAM</h2>

      <p style={{ color: '#a0a0a0', marginBottom: 18 }}>
        Gere automaticamente o ciclo de 8 semanas com Treino A-F conforme a frequência do aluno.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: 12,
          marginBottom: 18
        }}
      >
        <div style={metricBox}>
          <span style={label}>Frequência</span>
          <strong>{frequency}x/semana</strong>
        </div>

        <div style={metricBox}>
          <span style={label}>Treinos salvos</span>
          <strong>{savedCount}</strong>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        style={{
          background: '#e01616',
          color: '#fff',
          border: 0,
          borderRadius: 14,
          padding: '14px 18px',
          cursor: 'pointer',
          fontWeight: 800,
          width: '100%'
        }}
      >
        GERAR TREINO DG TEAM
      </button>
    </div>
  );
}

const metricBox = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 16,
  padding: 14
};

const label = {
  display: 'block',
  color: '#888',
  marginBottom: 8
};
