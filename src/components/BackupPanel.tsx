import { createBackup, downloadBackup } from '../services/backupService';

export default function BackupPanel() {
  function handleBackup() {
    const payload = createBackup({
      app: 'DG TEAM APP',
      exportedAt: new Date().toISOString()
    });

    downloadBackup(payload);
  }

  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 22,
        padding: 24
      }}
    >
      <h3 style={{ marginBottom: 12 }}>Backup e segurança</h3>

      <p style={{ color: '#a0a0a0', marginBottom: 20 }}>
        Exporte todos os dados do sistema DG TEAM em um arquivo seguro.
      </p>

      <button
        onClick={handleBackup}
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
        Gerar backup
      </button>
    </div>
  );
}
