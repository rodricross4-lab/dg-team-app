import { triggerInstallPrompt } from '../utils/pwa';

export default function InstallAppCard() {
  async function handleInstall() {
    await triggerInstallPrompt();
  }

  return (
    <div
      style={{
        background: 'linear-gradient(180deg,#170808,#0f0f0f)',
        border: '1px solid #341010',
        borderRadius: 22,
        padding: 24,
        boxShadow: '0 0 24px rgba(224,22,22,.12)'
      }}
    >
      <h3 style={{ marginBottom: 12 }}>Instalar DG TEAM APP</h3>

      <p style={{ color: '#a0a0a0', marginBottom: 18 }}>
        Instale o aplicativo no celular para experiência premium completa.
      </p>

      <button
        onClick={handleInstall}
        style={{
          background: '#e01616',
          color: '#fff',
          border: 0,
          borderRadius: 14,
          padding: '14px 18px',
          cursor: 'pointer',
          fontWeight: 700
        }}
      >
        Instalar aplicativo
      </button>
    </div>
  );
}
