import { useEffect, useMemo, useState } from 'react';
import { getSyncSummary } from '../services/offlineSyncEngine';
import { startAutoSync, stopAutoSync } from '../services/autoSync';
import { getSyncStatusLabel, processSyncQueue } from '../services/syncProcessor';

export default function SyncStatusWidget() {
  const [status, setStatus] = useState(getSyncStatusLabel());
  const [summary, setSummary] = useState(() => getSyncSummary());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startAutoSync();
    const interval = window.setInterval(() => {
      setStatus(getSyncStatusLabel());
      setSummary(getSyncSummary());
    }, 5000);

    return () => {
      window.clearInterval(interval);
      stopAutoSync();
    };
  }, []);

  const label = useMemo(() => {
    if (summary.blocked > 0) return `${summary.blocked} bloqueados`;
    if (summary.failed > 0) return `${summary.failed} falhas no sync`;
    if (summary.retryReady > 0) return `${summary.retryReady} prontos para retry`;
    if (summary.pending > 0) return `${summary.pending} pendências`;
    return 'Tudo sincronizado';
  }, [summary.blocked, summary.failed, summary.pending, summary.retryReady]);

  async function runSync() {
    setLoading(true);
    const result = await processSyncQueue();
    setStatus(result.message);
    setSummary(getSyncSummary());
    setLoading(false);
  }

  return (
    <div style={panel}>
      <div>
        <span style={kicker}>SYNC DG TEAM</span>
        <h3 style={{ margin: '5px 0 4px' }}>{label}</h3>
        <p style={text}>{status}</p>
      </div>

      <div style={stats}>
        <span>Pendente: <strong>{summary.pending}</strong></span>
        <span>Retry pronto: <strong>{summary.retryReady}</strong></span>
        <span>Falhas: <strong>{summary.failed}</strong></span>
        <span>Bloqueados: <strong>{summary.blocked}</strong></span>
        <span>Total: <strong>{summary.total}</strong></span>
      </div>

      <button style={button} onClick={runSync} disabled={loading}>
        {loading ? 'Sincronizando...' : 'Sincronizar agora'}
      </button>
    </div>
  );
}

const panel = {
  background: 'linear-gradient(180deg,#101010,#080808)',
  border: '1px solid #2a2a2a',
  borderRadius: 22,
  padding: 18,
  marginBottom: 18,
  boxShadow: '0 0 32px rgba(224,22,22,.07)'
};
const kicker = { color: '#ffb8b8', fontSize: 11, fontWeight: 900, letterSpacing: 2 };
const text = { color: '#aaa', margin: 0, lineHeight: 1.45 };
const stats = {
  display: 'grid',
  gap: 6,
  background: '#0b0b0b',
  border: '1px solid #252525',
  borderRadius: 14,
  padding: 12,
  color: '#ddd',
  marginTop: 12
};
const button = {
  background: '#e01616',
  color: '#fff',
  border: 0,
  borderRadius: 14,
  padding: '12px 14px',
  width: '100%',
  cursor: 'pointer',
  fontWeight: 900,
  marginTop: 12
};
