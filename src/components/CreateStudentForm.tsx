import { useState } from 'react';

const priorities = [
  'Peitoral',
  'Costas',
  'Quadríceps',
  'Posteriores',
  'Glúteos',
  'Ombros'
];

export default function CreateStudentForm() {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('Hipertrofia');
  const [frequency, setFrequency] = useState(5);
  const [priority, setPriority] = useState<string[]>([]);

  function togglePriority(value: string) {
    setPriority((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 22,
        padding: 24,
        marginBottom: 24
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Novo aluno DG TEAM</h2>

      <div style={{ display: 'grid', gap: 14 }}>
        <input
          placeholder="Nome do aluno"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={input}
        >
          <option>Hipertrofia</option>
          <option>Emagrecimento</option>
          <option>Recomposição</option>
          <option>Força</option>
        </select>

        <select
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
          style={input}
        >
          <option value={3}>3x semana</option>
          <option value={4}>4x semana</option>
          <option value={5}>5x semana</option>
          <option value={6}>6x semana</option>
        </select>

        <div>
          <p style={{ marginBottom: 12 }}>Músculos prioritários</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {priorities.map((item) => {
              const selected = priority.includes(item);

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => togglePriority(item)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 999,
                    border: selected
                      ? '1px solid #e01616'
                      : '1px solid #262626',
                    background: selected ? '#250909' : '#111',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <button style={button}>Salvar aluno</button>
      </div>
    </div>
  );
}

const input = {
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
  fontWeight: 700,
  cursor: 'pointer'
};
