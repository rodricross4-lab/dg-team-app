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
    name: 'Digo Gonçalves',
    email: 'rodricross4@gmail.com',
    role: 'coach'
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
