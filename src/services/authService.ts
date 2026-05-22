import { getSupabaseClient, isSupabaseReady } from './supabaseService';

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

export function setCurrentUser(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function loginDemoCoach(): AuthUser {
  const user: AuthUser = {
    id: 'coach-demo',
    name: 'Coach DG TEAM',
    email: 'demo@dgteam.app',
    role: 'coach'
  };

  return setCurrentUser(user);
}

export async function signInCoach(email: string, password: string) {
  if (!isSupabaseReady()) {
    return { ok: false, message: 'Supabase não configurado.' };
  }

  const supabase = getSupabaseClient();
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

  setCurrentUser(user);
  return { ok: true, message: 'Login realizado com sucesso.', user };
}

export async function signOutCoach() {
  if (isSupabaseReady()) {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  }

  localStorage.removeItem(AUTH_KEY);
  return { ok: true, message: 'Logout realizado.' };
}

export async function getCurrentCoachCloud() {
  if (!isSupabaseReady()) return null;
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
