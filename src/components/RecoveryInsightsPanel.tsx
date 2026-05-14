import { getDeloadSuggestion, getVolumeAdjustmentSuggestion } from '../utils/plateauEngine';

type Props = {
  validSets: number;
  executionQuality: number;
};

export default function RecoveryInsightsPanel({ validSets, executionQuality }: Props) {
  const deload = getDeloadSuggestion({
    lastLoads: [80, 80, 80],
    lastReps: [8, 8, 8],
    performanceDrop: false,
    sleepPoor: false,
    sorenessHigh: false
  });

  const volume = getVolumeAdjustmentSuggestion(validSets, executionQuality);

  return (
    <div style={panel}>
      <h3 style={{ marginBottom: 16 }}>IA DG • Recuperação e Fadiga</h3>

      <div style={card}>
        <strong style={title}>Controle de platô</strong>
        <p style={text}>{deload}</p>
      </div>

      <div style={card}>
        <strong style={title}>Controle de volume</strong>
        <p style={text}>{volume}</p>
      </div>

      <div style={card}>
        <strong style={title}>Conceito DG Team</strong>
        <p style={text}>
          Mais volume não significa automaticamente mais hipertrofia. A prioridade continua sendo tensão mecânica, intensidade e recuperação adequada.
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
  marginBottom: 22
};

const card = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16,
  marginBottom: 14
};

const title = {
  color: '#e01616'
};

const text = {
  color: '#d4d4d4',
  lineHeight: 1.6,
  marginTop: 8
};
