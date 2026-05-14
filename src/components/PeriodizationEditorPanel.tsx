import { useState } from 'react';
import { getStudentPeriodization, upsertPeriodizationWeek } from '../store/operationalStore';

type Props = { studentId: number };

type WeekPlan = {
  week: number;
  focus: string;
  intensity: string;
  volume: string;
  deload: boolean;
  notes: string;
};

function createDefaultWeeks(studentId: number): WeekPlan[] {
  const saved = getStudentPeriodization(studentId);

  return Array.from({ length: 8 }, (_, index) => {
    const weekNumber = index + 1;
    const existing = saved.find((item) => item.week === weekNumber);

    return {
      week: weekNumber,
      focus: existing?.focus || (index < 3 ? 'Progressão técnica e carga' : index < 6 ? 'Progressão de performance' : 'Consolidação e controle de fadiga'),
      intensity: existing?.intensity || 'Alta',
      volume: existing?.volume || (index < 2 ? 'Moderado' : index < 6 ? 'Moderado/alto recuperável' : 'Moderado controlado'),
      deload: existing?.deload || false,
      notes: existing?.notes || 'Manter séries válidas próximas da falha, execução limpa e progressão sustentável.'
    };
  });
}

export default function PeriodizationEditorPanel({ studentId }: Props) {
  const [weeks, setWeeks] = useState(() => createDefaultWeeks(studentId));
  const [savedAt, setSavedAt] = useState('');

  function updateWeek(index: number, patch: Partial<WeekPlan>) {
    setWeeks((current) =>
      current.map((week, i) => (i === index ? { ...week, ...patch } : week))
    );
  }

  function saveAll() {
    const updatedAt = new Date().toISOString();

    weeks.forEach((week) => {
      upsertPeriodizationWeek({
        studentId,
        week: week.week,
        focus: week.focus,
        intensity: week.intensity,
        volume: week.volume,
        deload: week.deload,
        notes: week.notes,
        updatedAt
      });
    });

    setSavedAt(updatedAt);
  }

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 10 }}>Periodização de 8 semanas</h2>
      <p style={{ color: '#a0a0a0', marginBottom: 18 }}>
        Edite foco, intensidade, volume, deload e observações de cada semana do ciclo.
      </p>

      <div style={statusBox}>
        Último salvamento: <strong>{savedAt || 'ainda não salvo'}</strong>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {weeks.map((week, index) => (
          <div key={week.week} style={weekCard}>
            <strong style={{ color: '#e01616' }}>Semana {week.week}</strong>

            <input value={week.focus} onChange={(event) => updateWeek(index, { focus: event.target.value })} style={input} placeholder="Foco da semana" />
            <input value={week.intensity} onChange={(event) => updateWeek(index, { intensity: event.target.value })} style={input} placeholder="Intensidade" />
            <input value={week.volume} onChange={(event) => updateWeek(index, { volume: event.target.value })} style={input} placeholder="Volume" />

            <label style={checkRow}>
              <input type="checkbox" checked={week.deload} onChange={(event) => updateWeek(index, { deload: event.target.checked })} />
              Semana de deload/controle de fadiga
            </label>

            <textarea value={week.notes} onChange={(event) => updateWeek(index, { notes: event.target.value })} style={{ ...input, minHeight: 80 }} placeholder="Observações" />
          </div>
        ))}
      </div>

      <button onClick={saveAll} style={saveButton}>SALVAR PERIODIZAÇÃO DO ALUNO</button>
    </div>
  );
}

const panel = { background: '#101010', border: '1px solid #262626', borderRadius: 24, padding: 24, marginBottom: 22 };
const weekCard = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 18, padding: 16, display: 'grid', gap: 10 };
const input = { background: '#090909', color: '#fff', border: '1px solid #262626', borderRadius: 12, padding: '12px 14px', width: '100%' };
const statusBox = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 16, padding: 14, color: '#d8d8d8', marginBottom: 18 };
const checkRow = { display: 'flex', alignItems: 'center', gap: 10, color: '#d8d8d8' };
const saveButton = { background: '#e01616', color: '#fff', border: 0, borderRadius: 14, padding: '14px 18px', marginTop: 18, width: '100%', cursor: 'pointer', fontWeight: 800 };
