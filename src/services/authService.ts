import { supabase, isSupabaseConfigured } from './supabaseClient';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'coach' | 'student';
};

const AUTH_KEY = 'dg-team-auth-user';

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function loginDemoCoach(): AuthUser {
  const user: AuthUser = {
    id: 'coach-demo',
    name: 'Coach DG TEAM',
    email: 'demo@dgteam.app',
    role: 'coach'
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export async function signInCoach(email: string, password: string) {
  if (!isSupabaseConfigured() || !supabase) {
    return { ok: false, message: 'Supabase não configurado.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: error.message };
  }

  const user: AuthUser = {
    id: data.user.id,
    name: data.user.email || 'Coach DG TEAM',
    email: data.user.email || '',
    role: 'coach'
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return { ok: true, message: 'Login realizado com sucesso.', user };
}

export async function signOutCoach() {
  if (supabase) {
    await supabase.auth.signOut();
  }

  localStorage.removeItem(AUTH_KEY);
  return { ok: true, message: 'Logout realizado.' };
}

export async function getCurrentCoachCloud() {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
