import { useState } from 'react';
import { loginDemoCoach, signInCoach } from '../services/authService';
import { getCloudStatusLabel } from '../services/supabaseClient';

type Props = { onLogin: () => void };

export default function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrarCloud() {
    setLoading(true);
    const result = await signInCoach(email, senha);
    setStatus(result.message);
    setLoading(false);
    if (result.ok) onLogin();
  }

  function entrarDemo() {
    loginDemoCoach();
    onLogin();
  }

  return (
    <div style={page}>
      <div style={card}>
        <div style={brand}>DG TEAM</div>
        <p style={subtitle}>Ferramenta operacional do coach</p>
        <div style={cloud}>{getCloudStatusLabel()}</div>

        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" style={input} />
        <input value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" type="password" style={input} />

        <button onClick={entrarCloud} style={primary}>{loading ? 'ENTRANDO...' : 'ACESSAR DG TEAM'}</button>
        <button onClick={entrarDemo} style={secondary}>ENTRAR EM MODO DEMO</button>

        {status && <div style={notice}>{status}</div>}
      </div>
    </div>
  );
}

const page = { minHeight: '100vh', background: 'radial-gradient(circle at top,#220707,#050505 45%,#000)', color: '#fff', display: 'grid', placeItems: 'center', padding: 20 };
const card = { width: '100%', maxWidth: 430, background: 'linear-gradient(180deg,#111,#070707)', border: '1px solid #2d1010', borderRadius: 28, padding: 28, boxShadow: '0 0 60px rgba(224,22,22,.18)' };
const brand = { color: '#e01616', fontSize: 42, fontWeight: 950, letterSpacing: 2 };
const subtitle = { color: '#d8d8d8', marginBottom: 18 };
const cloud = { background: '#180909', border: '1px solid #351111', borderRadius: 14, padding: 12, color: '#ffb8b8', marginBottom: 14, fontWeight: 800 };
const input = { background: '#090909', color: '#fff', border: '1px solid #282828', borderRadius: 14, padding: '15px 16px', width: '100%', marginBottom: 12 };
const primary = { background: '#e01616', color: '#fff', border: 0, borderRadius: 14, padding: '15px 16px', width: '100%', fontWeight: 900, cursor: 'pointer', marginBottom: 10 };
const secondary = { background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 14, padding: '15px 16px', width: '100%', fontWeight: 800, cursor: 'pointer' };
const notice = { background: '#0b0b0b', border: '1px solid #262626', borderRadius: 14, padding: 12, marginTop: 14, color: '#d8d8d8' };
