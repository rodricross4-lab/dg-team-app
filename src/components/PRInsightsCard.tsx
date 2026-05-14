import { getPRMessage, getStudentPRSummary } from '../utils/prEngine';

type Props = {
  studentId: number;
};

export default function PRInsightsCard({ studentId }: Props) {
  const summary = getStudentPRSummary(studentId);
  const message = getPRMessage(studentId);

  return (
    <div style={panel}>
      <h3 style={{ marginBottom: 14 }}>PRs e Performance</h3>

      <div style={grid}>
        <div style={card}>
          <strong style={label}>Maior carga</strong>
          <h2 style={value}>{summary.bestLoad}kg</h2>
        </div>

        <div style={card}>
          <strong style={label}>Melhor série-volume</strong>
          <h2 style={value}>{summary.bestVolumeSet}kg</h2>
        </div>

        <div style={card}>
          <strong style={label}>Séries válidas</strong>
          <h2 style={value}>{summary.totalValidSets}</h2>
        </div>
      </div>

      <div style={insightBox}>
        <strong style={{ color: '#e01616' }}>IA DG</strong>
        <p style={{ marginTop: 8, color: '#d4d4d4', lineHeight: 1.6 }}>{message}</p>
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

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
  gap: 14,
  marginBottom: 18
};

const card = {
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 18,
  padding: 16
};

const label = {
  color: '#a0a0a0'
};

const value = {
  color: '#e01616',
  marginTop: 8,
  fontSize: 28
};

const insightBox = {
  background: '#180909',
  border: '1px solid #351111',
  borderRadius: 18,
  padding: 16
};
