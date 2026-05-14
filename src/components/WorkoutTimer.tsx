import { useEffect, useState } from 'react';

export default function WorkoutTimer() {
  const [seconds, setSeconds] = useState(90);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setRunning(false);

      if ('vibrate' in navigator) {
        navigator.vibrate(300);
      }
    }
  }, [seconds]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remaining = String(seconds % 60).padStart(2, '0');

  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 20,
        padding: 22
      }}
    >
      <h3 style={{ marginBottom: 16 }}>Timer de descanso</h3>

      <div
        style={{
          fontSize: 42,
          color: '#e01616',
          marginBottom: 18,
          fontWeight: 800
        }}
      >
        {minutes}:{remaining}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setRunning(true)} style={button}>
          Iniciar
        </button>

        <button onClick={() => setRunning(false)} style={button}>
          Pausar
        </button>

        <button
          onClick={() => {
            setSeconds(90);
            setRunning(false);
          }}
          style={button}
        >
          Resetar
        </button>
      </div>
    </div>
  );
}

const button = {
  background: '#e01616',
  color: '#fff',
  border: 0,
  borderRadius: 12,
  padding: '12px 14px',
  cursor: 'pointer'
};
