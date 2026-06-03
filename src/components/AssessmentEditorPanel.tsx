import { useMemo, useState } from 'react';
import { getStudentAssessments, upsertAssessment } from '../store/operationalStore';

type Props = { studentId: string };
type AssessmentWeek = 1 | 4 | 8;

const phases: AssessmentWeek[] = [1, 4, 8];

export default function AssessmentEditorPanel({ studentId }: Props) {
  const [active, setActive] = useState<AssessmentWeek>(1);
  const [version, setVersion] = useState(0);
  const savedAssessments = useMemo(() => getStudentAssessments(studentId), [studentId, version]);
  const current = savedAssessments.find((item) => item.week === active);

  const [weight, setWeight] = useState(current?.weight || '');
  const [bodyFat, setBodyFat] = useState(current?.bodyFat || '');
  const [waist, setWaist] = useState(current?.waist || '');
  const [abdomen, setAbdomen] = useState(current?.abdomen || '');
  const [hip, setHip] = useState(current?.hip || '');
  const [chest, setChest] = useState(current?.chest || '');
  const [arm, setArm] = useState(current?.arm || '');
  const [thigh, setThigh] = useState(current?.thigh || '');
  const [calf, setCalf] = useState(current?.calf || '');
  const [notes, setNotes] = useState(current?.notes || '');
  const [savedAt, setSavedAt] = useState('');

  const leanMass = useMemo(() => {
    const weightValue = parseDecimal(weight);
    const bodyFatValue = parseDecimal(bodyFat);
    if (!weightValue || bodyFatValue === null) return null;
    return Math.round(weightValue * (1 - bodyFatValue / 100) * 10) / 10;
  }, [weight, bodyFat]);

  function changeWeek(week: AssessmentWeek) {
    const selected = getStudentAssessments(studentId).find((item) => item.week === week);
    setActive(week);
    setWeight(selected?.weight || '');
    setBodyFat(selected?.bodyFat || '');
    setWaist(selected?.waist || '');
    setAbdomen(selected?.abdomen || '');
    setHip(selected?.hip || '');
    setChest(selected?.chest || '');
    setArm(selected?.arm || '');
    setThigh(selected?.thigh || '');
    setCalf(selected?.calf || '');
    setNotes(selected?.notes || '');
  }

  function saveAssessment() {
    const updatedAt = new Date().toISOString();

    upsertAssessment({
      studentId,
      week: active,
      protocol: 'custom',
      weight,
      bodyFat,
      waist,
      abdomen,
      hip,
      chest,
      arm,
      thigh,
      calf,
      notes,
      createdAt: current?.createdAt || updatedAt,
      updatedAt
    });

    setSavedAt(updatedAt);
    setVersion((currentVersion) => currentVersion + 1);
  }

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 12 }}>Avaliacoes fisicas</h2>

      <div style={statusBox}>
        Avaliacao ativa: <strong>Semana {active}</strong><br />
        Massa magra estimada: <strong>{leanMass ? `${leanMass}kg` : 'preencha peso e gordura'}</strong><br />
        Ultimo salvamento: <strong>{savedAt || current?.updatedAt || 'ainda nao salvo'}</strong>
      </div>

      <div style={tabs}>
        {phases.map((phase) => (
          <button key={phase} onClick={() => changeWeek(phase)} style={active === phase ? activeTab : tab}>
            Semana {phase}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={grid}>
          <MetricInput value={weight} onChange={setWeight} label="Peso corporal (kg)" />
          <MetricInput value={bodyFat} onChange={setBodyFat} label="Gordura corporal (%)" />
          <MetricInput value={waist} onChange={setWaist} label="Cintura (cm)" />
          <MetricInput value={abdomen} onChange={setAbdomen} label="Abdomen (cm)" />
          <MetricInput value={hip} onChange={setHip} label="Quadril (cm)" />
          <MetricInput value={chest} onChange={setChest} label="Torax (cm)" />
          <MetricInput value={arm} onChange={setArm} label="Braco flexionado (cm)" />
          <MetricInput value={thigh} onChange={setThigh} label="Coxa (cm)" />
          <MetricInput value={calf} onChange={setCalf} label="Panturrilha (cm)" />
        </div>
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} style={{ ...input, minHeight: 100 }} placeholder="Observacoes da avaliacao" />
      </div>

      <div style={summaryGrid}>
        {phases.map((phase) => {
          const assessment = savedAssessments.find((item) => item.week === phase);
          return (
            <div key={phase} style={summaryCard}>
              <strong>Semana {phase}</strong>
              <span>{assessment ? `${assessment.weight || '-'}kg / ${assessment.bodyFat || '-'}%` : 'pendente'}</span>
            </div>
          );
        })}
      </div>

      <button onClick={saveAssessment} style={button}>SALVAR AVALIACAO DO ALUNO</button>
    </div>
  );
}

function MetricInput({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  return <input value={value} onChange={(event) => onChange(event.target.value)} style={input} inputMode="decimal" placeholder={label} />;
}

function parseDecimal(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

const panel = { background: '#101010', border: '1px solid #262626', borderRadius: 24, padding: 24, marginBottom: 22 };
const tabs = { display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginBottom: 18 };
const tab = { background: '#111', color: '#bbb', border: '1px solid #262626', borderRadius: 99, padding: '10px 14px', cursor: 'pointer' };
const activeTab = { ...tab, background: '#e01616', color: '#fff', border: '1px solid #e01616' };
const input = { background: '#090909', color: '#fff', border: '1px solid #262626', borderRadius: 12, padding: '12px 14px' };
const button = { background: '#e01616', color: '#fff', border: 0, borderRadius: 14, padding: '14px 18px', marginTop: 18, width: '100%', cursor: 'pointer', fontWeight: 800 };
const statusBox = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 16, padding: 14, color: '#d8d8d8', marginBottom: 18, lineHeight: 1.6 };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 };
const summaryGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginTop: 14 };
const summaryCard = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 14, padding: 12, display: 'grid', gap: 6, color: '#d8d8d8' };
