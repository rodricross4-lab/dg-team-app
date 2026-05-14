import { getProgressionSuggestion, getFatigueAlert } from '../utils/progressionEngine';

type Props = {
  load: number;
  reps: number;
  range: string;
  execution: string;
};

export default function ProgressionInsightsPanel({ load, reps, range, execution }: Props) {
  const progression = getProgressionSuggestion({
    exerciseName: 'Exercício atual',
    load,
    reps,
    targetRange: range,
    execution,
    rir: 1
  });

  const fatigue = getFatigueAlert(false, false, false);

  return (
    <div style={panel}>
      <h3 style={{ marginBottom: 14 }}>IA DG • Insights de progressão</h3>

      <div style={card}>
        <strong style={{ color: '#e01616' }}>Progressão sugerida</strong>
        <p style={text}>{progression}</p>
      </div>

      <div style={card}>
        <strong style={{ color: '#e01616' }}>Controle de fadiga</strong>
        <p style={text}>{fatigue}</p>
      </div>

      <div style={card}>
        <strong style={{ color: '#e01616' }}>Conceito DG Team</strong>
        <p style={text}>
          Progressão não é apenas aumentar peso. Melhorar estabilidade, execução, amplitude eficiente e controle também é progresso real.
        </p>
      </div>
    </div>
  );
}

const panel = {
  background: '#101010',
  border: '1px solid #262626',
  borderRadius: 24,
  padding: 24,
  marginTop: 20
};

const card = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16,
  marginBottom: 14
};

const text = {
  color: '#d4d4d4',
  marginTop: 8,
  lineHeight: 1.6
};
