import { useState } from 'react';

const phases = ['Semana 1', 'Semana 4', 'Semana 8'];

export default function AssessmentEditorPanel() {
  const [active, setActive] = useState('Semana 1');

  return (
    <div style={panel}>
      <h2 style={{ marginBottom: 12 }}>Avaliações físicas</h2>

      <div style={tabs}>
        {phases.map((phase) => (
          <button
            key={phase}
            onClick={() => setActive(phase)}
            style={active === phase ? activeTab : tab}
          >
            {phase}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <input style={input} placeholder="Peso corporal" />
        <input style={input} placeholder="Percentual de gordura" />
        <input style={input} placeholder="Circunferência cintura" />
        <input style={input} placeholder="Circunferência braço" />
        <textarea
          style={{ ...input, minHeight: 100 }}
          placeholder="Observações da avaliação"
        />
      </div>

      <button style={button}>SALVAR AVALIAÇÃO</button>
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

const tabs = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  marginBottom: 18
};

const tab = {
  background: '#111',
  color: '#bbb',
  border: '1px solid #262626',
  borderRadius: 99,
  padding: '10px 14px',
  cursor: 'pointer'
};

const activeTab = {
  ...tab,
  background: '#e01616',
  color: '#fff',
  border: '1px solid #e01616'
};

const input = {
  background: '#090909',
  color: '#fff',
  border: '1px solid #262626',
  borderRadius: 12,
  padding: '12px 14px'
};

const button = {
  background: '#e01616',
  color: '#fff',
  border: 0,
  borderRadius: 14,
  padding: '14px 18px',
  marginTop: 18,
  width: '100%',
  cursor: 'pointer',
  fontWeight: 800
};
