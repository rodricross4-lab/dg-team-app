export type StabilityItem = {
  id: string;
  label: string;
  status: 'pending' | 'checking' | 'ok' | 'error';
  area: 'build' | 'auth' | 'dashboard' | 'cloud' | 'realtime' | 'mobile';
};

export const stabilityChecklist: StabilityItem[] = [
  { id: 'typecheck', label: 'Typecheck TypeScript', status: 'pending', area: 'build' },
  { id: 'build', label: 'Build Vite', status: 'pending', area: 'build' },
  { id: 'login', label: 'Login e logout', status: 'pending', area: 'auth' },
  { id: 'dashboard', label: 'Dashboard renderizando', status: 'pending', area: 'dashboard' },
  { id: 'students', label: 'Alunos carregando', status: 'pending', area: 'dashboard' },
  { id: 'cloud', label: 'Supabase com fallback seguro', status: 'pending', area: 'cloud' },
  { id: 'realtime', label: 'Realtime sem quebrar app', status: 'pending', area: 'realtime' },
  { id: 'mobile', label: 'Layout mobile sem overflow', status: 'pending', area: 'mobile' }
];

export function getStabilityScore(items: StabilityItem[]) {
  if (!items.length) return 0;
  const okItems = items.filter((item) => item.status === 'ok').length;
  return Math.round((okItems / items.length) * 100);
}

export function getStabilityMessage(score: number) {
  if (score < 40) return 'MVP ainda instável. Corrigir build e fluxo principal.';
  if (score < 75) return 'MVP em progresso. Ainda precisa revisão antes de uso real.';
  if (score < 100) return 'MVP quase estável. Validar detalhes finais.';
  return 'MVP estável para uso operacional inicial.';
}
