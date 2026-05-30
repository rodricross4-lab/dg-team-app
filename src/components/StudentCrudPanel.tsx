import { useEffect, useState } from 'react';
import type { Student } from '../types';
import { archiveStudent, fetchStudents, saveStudent } from '../services/studentService';

const DEFAULT_TENANT_ID = 'local-tenant';
const DEFAULT_COACH_ID = 'local-coach';

type Props = {
  onStudentsChange?: (students: Student[]) => void;
};

export default function StudentCrudPanel({ onStudentsChange }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Carregando alunos...');

  async function refreshStudents() {
    const result = await fetchStudents();
    setStudents(result.data);
    setStatus(result.warning);
  }

  useEffect(() => {
    refreshStudents();
  }, []);

  async function handleAddStudent() {
    if (!name.trim()) return;

    const result = await saveStudent({
      tenant_id: DEFAULT_TENANT_ID,
      coach_id: DEFAULT_COACH_ID,
      name: name.trim(),
      goal: 'Hipertrofia',
      phase: 'maintenance',
      training_frequency: 4,
      priority_muscles: [],
      alerts: [],
      status: 'active',
    });

    const next = [result.data, ...students.filter((student) => student.id !== result.data.id)];
    setStudents(next);
    onStudentsChange?.(next);
    setStatus(result.warning);
    setName('');
  }

  async function handleRename(student: Student) {
    const result = await saveStudent({
      ...student,
      name: `${student.name} editado`,
    });

    const next = students.map((item) => (item.id === student.id ? result.data : item));
    setStudents(next);
    onStudentsChange?.(next);
    setStatus(result.warning);
  }

  async function handleArchive(id: string) {
    const result = await archiveStudent(id);
    const visibleStudents = result.data.filter((student) => student.deleted_at == null);
    setStudents(visibleStudents);
    onStudentsChange?.(visibleStudents);
    setStatus(result.warning);
  }

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 8 }}>CRUD real de alunos</h2>
      <p style={muted}>{status}</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nome do aluno"
          style={input}
        />

        <button onClick={handleAddStudent} style={button}>
          Adicionar
        </button>
      </div>

      {students.length === 0 ? (
        <div style={emptyState}>
          Nenhum aluno cadastrado ainda. Cadastre o primeiro aluno para iniciar o controle DG Team.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {students.map((student) => (
            <div key={student.id} style={row}>
              <div>
                <strong>{student.name}</strong>
                <p style={{ color: '#a0a0a0' }}>{student.goal} • {student.training_frequency}x/semana</p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleRename(student)} style={smallButton}>
                  Editar
                </button>

                <button onClick={() => handleArchive(student.id)} style={smallButton}>
                  Arquivar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const panel = {
  background: '#101010',
  border: '1px solid #262626',
  borderRadius: 24,
  padding: 24
};

const input = {
  flex: 1,
  background: '#090909',
  color: '#fff',
  border: '1px solid #262626',
  borderRadius: 14,
  padding: '14px 16px'
};

const button = {
  background: '#e01616',
  color: '#fff',
  border: 0,
  borderRadius: 14,
  padding: '14px 18px',
  cursor: 'pointer',
  fontWeight: 700
};

const smallButton = {
  ...button,
  padding: '10px 12px'
};

const muted = {
  color: '#a0a0a0',
  marginTop: 0,
  marginBottom: 18
};

const emptyState = {
  background: '#0b0b0b',
  border: '1px dashed #3a3a3a',
  borderRadius: 16,
  color: '#cfcfcf',
  padding: 18
};

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 14,
  padding: 14
};
