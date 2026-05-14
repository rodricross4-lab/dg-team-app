import { useState } from 'react';

type WeekPlan = {
  week: number;
  focus: string;
  intensity: string;
  volume: string;
  notes: string;
};

const defaultWeeks: WeekPlan[] = Array.from({ length: 8 }, (_, index) => ({
  week: index + 1,
  focus: index < 3 ? 'Progressão técnica e carga' : index < 6 ? 'Progressão de performance' : 'Consolidação e controle de fadiga',
  intensity: 'Alta',
  volume: index < 2 ? 'Moderado' : index < 6 ? 'Moderado/alto recuperável' : 'Moderado controlado',
  notes: 'Manter séries válidas próximas da falha, execução limpa e progressão sustentável.'
}));

export default function PeriodizationEditorPanel() {
  const [weeks, setWeeks] = useState(defaultWeeks);

  function updateWeek(index: number, patch: Partial<WeekPlan>) {
    setWeeks((current) =>
      current.map((week, i) => (i === index ? { ...week, ...patch } : week))
    );
  }

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 10 }}>Periodização de 8 semanas</h2>
      <p style={{ color: '#a0a0a0', marginBottom: 18 }}>
        Edite foco, intensidade, volume e observações de cada semana do ciclo.
      </p>

      <div style={{ display: 'grid', gap: 12 }}>
        {weeks.map((week, index) => (
          <div key={week.week} style={weekCard}>
            <strong style={{ color: '#e01616' }}>Semana {week.week}</strong>

            <input
              value={week.focus}
              onChange={(event) => updateWeek(index, { focus: event.target.value })}
              style={input}
              placeholder="Foco da semana"
            />

            <input
              value={week.intensity}
              onChange={(event) => updateWeek(index, { intensity: event.target.value })}
              style={input}
              placeholder="Intensidade"
            />

            <input
              value={week.volume}
              onChange={(event) => updateWeek(index, { volume: event.target.value })}
              style={input}
              placeholder="Volume"
            />

            <textarea
              value={week.notes}
              onChange={(event) => updateWeek(index, { notes: event.target.value })}
              style={{ ...input, minHeight: 80 }}
              placeholder="Observações"
            />
          </div>
        ))}
      </div>
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

const weekCard = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16,
  display: 'grid',
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
