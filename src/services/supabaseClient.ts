export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
};

export function isSupabaseConfigured() {
  return Boolean(supabaseConfig.url && supabaseConfig.anonKey);
}

export function getCloudStatusLabel() {
  return isSupabaseConfigured()
    ? 'DG TEAM CLOUD ONLINE'
    : 'SUPABASE NÃO CONFIGURADO';
}

export function getSupabaseSetupInstructions() {
  return [
    'Criar projeto no Supabase',
    'Executar o arquivo src/utils/supabaseSchema.sql no SQL Editor',
    'Copiar Project URL e anon public key',
    'Adicionar VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis do Netlify',
    'Redeployar o app'
  ];
}

export async function syncPlaceholder() {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: 'Supabase ainda não configurado. Use LocalStorage/IndexedDB por enquanto.'
    };
  }

  return {
    ok: true,
    message: 'Supabase configurado. Pronto para sincronização cloud.'
  };
}
