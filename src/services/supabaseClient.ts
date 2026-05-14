import { createClient } from '@supabase/supabase-js';

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

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

export async function testSupabaseConnection() {
  if (!supabase) {
    return {
      ok: false,
      message: 'Supabase não configurado.'
    };
  }

  try {
    const { error } = await supabase
      .from('students')
      .select('id')
      .limit(1);

    if (error) {
      return {
        ok: false,
        message: error.message
      };
    }

    return {
      ok: true,
      message: 'Conexão Supabase funcionando.'
    };
  } catch {
    return {
      ok: false,
      message: 'Erro ao conectar com Supabase.'
    };
  }
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
