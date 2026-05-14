import { useMemo, useState } from 'react';
import { getStudentAssessments, upsertAssessment } from '../store/operationalStore';

type Props = { studentId: number };
type AssessmentWeek = 1 | 4 | 8;

const phases: AssessmentWeek[] = [1, 4, 8];

export default function AssessmentEditorPanel({ studentId }: Props) {
  const [active, setActive] = useState<AssessmentWeek>(1);
  const savedAssessments = useMemo(() => getStudentAssessments(studentId), [studentId]);
  const current = savedAssessments.find((item) => item.week === active);

  const [weight, setWeight] = useState(current?.weight || '');
  const [bodyFat, setBodyFat] = useState(current?.bodyFat || '');
  const [waist, setWaist] = useState(current?.waist || '');
  const [arm, setArm] = useState(current?.arm || '');
  const [notes, setNotes] = useState(current?.notes || '');
  const [savedAt, setSavedAt] = useState('');

  function changeWeek(week: AssessmentWeek) {
    const selected = getStudentAssessments(studentId).find((item) => item.week === week);
    setActive(week);
    setWeight(selected?.weight || '');
    setBodyFat(selected?.bodyFat || '');
    setWaist(selected?.waist || '');
    setArm(selected?.arm || '');
    setNotes(selected?.notes || '');
  }

  function saveAssessment() {
    const updatedAt = new Date().toISOString();

    upsertAssessment({
      studentId,
      week: active,
      weight,
      bodyFat,
      waist,
      arm,
      notes,
      updatedAt
    });

    setSavedAt(updatedAt);
  }

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 12 }}>Avaliações físicas</h2>

      <div style={statusBox}>
        Avaliação ativa: <strong>Semana {active}</strong><br />
        Último salvamento: <strong>{savedAt || current?.updatedAt || 'ainda não salvo'}</strong>
      </div>

      <div style={tabs}>
        {phases.map((phase) => (
          <button key={phase} onClick={() => changeWeek(phase)} style={active === phase ? activeTab : tab}>
            Semana {phase}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <input value={weight} onChange={(event) => setWeight(event.target.value)} style={input} placeholder="Peso corporal" />
        <input value={bodyFat} onChange={(event) => setBodyFat(event.target.value)} style={input} placeholder="Percentual de gordura" />
        <input value={waist} onChange={(event) => setWaist(event.target.value)} style={input} placeholder="Circunferência cintura" />
        <input value={arm} onChange={(event) => setArm(event.target.value)} style={input} placeholder="Circunferência braço" />
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} style={{ ...input, minHeight: 100 }} placeholder="Observações da avaliação" />
      </div>

      <button onClick={saveAssessment} style={button}>SALVAR AVALIAÇÃO DO ALUNO</button>
    </div>
  );
}

const panel = { background: '#101010', border: '1px solid #262626', borderRadius: 24, padding: 24, marginBottom: 22 };
const tabs = { display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginBottom: 18 };
const tab = { background: '#111', color: '#bbb', border: '1px solid #262626', borderRadius: 99, padding: '10px 14px', cursor: 'pointer' };
const activeTab = { ...tab, background: '#e01616', color: '#fff', border: '1px solid #e01616' };
const input = { background: '#090909', color: '#fff', border: '1px solid #262626', borderRadius: 12, padding: '12px 14px' };
const button = { background: '#e01616', color: '#fff', border: 0, borderRadius: 14, padding: '14px 18px', marginTop: 18, width: '100%', cursor: 'pointer', fontWeight: 800 };
const statusBox = { background: '#0b0b0b', border: '1px solid #1f1f1f', borderRadius: 16, padding: 14, color: '#d8d8d8', marginBottom: 18, lineHeight: 1.6 };
