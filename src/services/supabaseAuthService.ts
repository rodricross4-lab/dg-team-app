import { getSupabaseClient, isSupabaseReady } from './supabaseService';

export type AuthCredentials = {
  email: string;
  password: string;
};

export async function signInWithSupabase(credentials: AuthCredentials) {
  if (!isSupabaseReady()) {
    return {
      ok: false,
      message: 'Supabase não configurado.'
    };
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password
  });

  if (error) {
    return {
      ok: false,
      message: error.message
    };
  }

  return {
    ok: true,
    message: 'Login realizado com sucesso.',
    session: data.session,
    user: data.user
  };
}

export async function signOutFromSupabase() {
  if (!isSupabaseReady()) {
    return {
      ok: false,
      message: 'Supabase não configurado.'
    };
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      ok: false,
      message: error.message
    };
  }

  return {
    ok: true,
    message: 'Logout realizado com sucesso.'
  };
}

export async function getSupabaseSession() {
  if (!isSupabaseReady()) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();

  return data.session;
}

export async function getSupabaseUser() {
  if (!isSupabaseReady()) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getUser();

  return data.user;
}
