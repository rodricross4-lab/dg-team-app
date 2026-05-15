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
      <div style={backgroundGlow} />

      <main style={shell}>
        <section style={hero}>
          <div style={eyebrow}>DG TEAM COACH SYSTEM</div>
          <h1 style={headline}>Controle seus alunos com padrão profissional.</h1>
          <p style={description}>
            Treinos, logbook, avaliações, check-ins, alertas e evolução em uma central operacional pensada para coach.
          </p>

          <div style={features}>
            <div style={featureCard}><strong>Logbook</strong><span>Séries válidas, cargas e progressão.</span></div>
            <div style={featureCard}><strong>Alunos</strong><span>Perfis, treinos e acompanhamento.</span></div>
            <div style={featureCard}><strong>IA DG</strong><span>Alertas, retenção e ações rápidas.</span></div>
          </div>
        </section>

        <section style={card}>
          <div style={brandWrap}>
            <div style={brand}>DG TEAM</div>
            <p style={subtitle}>Plataforma operacional do coach</p>
          </div>

          <div style={statusPill}>{getCloudStatusLabel()}</div>

          <div style={formBox}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail do coach" style={input} />
            <input value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" type="password" style={input} />

            <button onClick={entrarCloud} style={primary} disabled={loading}>
              {loading ? 'ENTRANDO...' : 'ACESSAR PLATAFORMA'}
            </button>

            <button onClick={entrarDemo} style={secondary}>Entrar em modo demonstração</button>
          </div>

          {status && <div style={notice}>{status}</div>}

          <p style={footerText}>Ambiente DG TEAM • dark premium • coach first</p>
        </section>
      </main>
    </div>
  );
}

const page = {
  minHeight: '100vh',
  background: '#030303',
  color: '#fff',
  display: 'grid',
  placeItems: 'center',
  padding: 24,
  position: 'relative' as const,
  overflow: 'hidden'
};

const backgroundGlow = {
  position: 'absolute' as const,
  inset: 0,
  background: 'radial-gradient(circle at 20% 10%,rgba(224,22,22,.28),transparent 32%), radial-gradient(circle at 80% 80%,rgba(224,22,22,.16),transparent 30%)',
  pointerEvents: 'none' as const
};

const shell = {
  width: '100%',
  maxWidth: 1120,
  display: 'grid',
  gridTemplateColumns: '1.1fr .9fr',
  gap: 24,
  alignItems: 'stretch',
  position: 'relative' as const,
  zIndex: 1
};

const hero = {
  background: 'linear-gradient(145deg,rgba(18,18,18,.96),rgba(5,5,5,.96))',
  border: '1px solid rgba(255,255,255,.08)',
  borderRadius: 34,
  padding: 38,
  boxShadow: '0 28px 80px rgba(0,0,0,.45)'
};

const eyebrow = {
  color: '#ffb8b8',
  fontWeight: 900,
  letterSpacing: 2,
  fontSize: 12,
  marginBottom: 18
};

const headline = {
  fontSize: 'clamp(38px,6vw,74px)',
  lineHeight: .94,
  margin: 0,
  maxWidth: 720,
  letterSpacing: -2
};

const description = {
  color: '#cfcfcf',
  fontSize: 18,
  lineHeight: 1.6,
  maxWidth: 650,
  marginTop: 22
};

const features = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
  gap: 12,
  marginTop: 32
};

const featureCard = {
  background: '#0b0b0b',
  border: '1px solid rgba(255,255,255,.08)',
  borderRadius: 18,
  padding: 16,
  display: 'grid',
  gap: 8,
  color: '#e9e9e9'
};

const card = {
  background: 'linear-gradient(180deg,#111,#070707)',
  border: '1px solid #2d1010',
  borderRadius: 34,
  padding: 30,
  boxShadow: '0 0 70px rgba(224,22,22,.16)'
};

const brandWrap = { marginBottom: 18 };
const brand = { color: '#e01616', fontSize: 48, fontWeight: 950, letterSpacing: 3 };
const subtitle = { color: '#d8d8d8', margin: '8px 0 0', fontSize: 16 };
const statusPill = { background: '#120707', border: '1px solid #2b1010', borderRadius: 999, padding: '10px 14px', color: '#ffb8b8', marginBottom: 18, fontWeight: 800, fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: 1 };
const formBox = { display: 'grid', gap: 12 };
const input = { background: '#090909', color: '#fff', border: '1px solid #282828', borderRadius: 16, padding: '16px 17px', width: '100%', fontSize: 16 };
const primary = { background: '#e01616', color: '#fff', border: 0, borderRadius: 16, padding: '16px 17px', width: '100%', fontWeight: 950, cursor: 'pointer', letterSpacing: .5, fontSize: 15, boxShadow: '0 12px 30px rgba(224,22,22,.25)' };
const secondary = { background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 16, padding: '15px 16px', width: '100%', fontWeight: 850, cursor: 'pointer' };
const notice = { background: '#0b0b0b', border: '1px solid #262626', borderRadius: 14, padding: 12, marginTop: 14, color: '#d8d8d8' };
const footerText = { color: '#777', marginTop: 18, fontSize: 12, textAlign: 'center' as const };
