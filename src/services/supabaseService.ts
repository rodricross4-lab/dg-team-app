type SupabaseConfig = {
  url?: string;
  anonKey?: string;
};

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  };
}

export function isSupabaseReady() {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

export function getSupabaseMissingMessage() {
  if (isSupabaseReady()) return 'Supabase configurado.';
  return 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar persistência real.';
}
