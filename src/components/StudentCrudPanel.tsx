import { useState } from 'react';
import type { Student } from '../types';
import { addStudent, editStudent, loadAppStore, removeStudent } from '../store/appStore';

export default function StudentCrudPanel() {
  const [store, setStore] = useState(loadAppStore());
  const [name, setName] = useState('');

  function handleAddStudent() {
    if (!name.trim()) return;

    const student: Student = {
      id: Date.now(),
      name,
      age: 0,
      weight: 0,
      height: 0,
      sex: 'Não informado',
      goal: 'Hipertrofia',
      phase: 'Manutenção',
      frequency: 4,
      level: 'Intermediário',
      priority: [],
      limitations: [],
      alerts: []
    };

    const next = addStudent(store, student);
    setStore(next);
    setName('');
  }

  function handleRename(id: number) {
    const next = editStudent(store, id, {
      name: `Aluno ${id}`
    });
    setStore(next);
  }

  function handleDelete(id: number) {
    const next = removeStudent(store, id);
    setStore(next);
  }

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 18 }}>CRUD real de alunos</h2>

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

      <div style={{ display: 'grid', gap: 10 }}>
        {store.students.map((student) => (
          <div key={student.id} style={row}>
            <div>
              <strong>{student.name}</strong>
              <p style={{ color: '#a0a0a0' }}>{student.goal}</p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleRename(student.id)} style={smallButton}>
                Editar
              </button>

              <button onClick={() => handleDelete(student.id)} style={smallButton}>
                Excluir
              </button>
            </div>
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

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
  borderRadius: 14,
  padding: 14
};
