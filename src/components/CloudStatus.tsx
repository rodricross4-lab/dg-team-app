import { isSupabaseConfigured } from '../services/supabaseClient';

export default function CloudStatus() {
  const configured = isSupabaseConfigured();

  return (
    <div
      style={{
        background: '#101010',
        border: '1px solid #262626',
        borderRadius: 18,
        padding: 18
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Sincronização Cloud</h3>

      <div
        style={{
          display: 'inline-block',
          padding: '8px 10px',
          borderRadius: 999,
          background: configured ? '#08220f' : '#220808',
          border: configured
            ? '1px solid #0ea84f'
            : '1px solid #e01616',
          color: '#fff'
        }}
      >
        {configured ? 'Cloud ativo' : 'Cloud não configurado'}
      </div>
    </div>
  );
}
