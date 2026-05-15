export type SystemHealthInput = {
  hasAuth: boolean;
  hasCloud: boolean;
  hasStudents: boolean;
  hasWorkouts: boolean;
  hasLogbookEntries: boolean;
  hasAssessments: boolean;
  buildStatus?: 'unknown' | 'ok' | 'error';
};

export type SystemHealthResult = {
  score: number;
  status: 'critical' | 'attention' | 'stable' | 'excellent';
  checks: {
    label: string;
    ok: boolean;
    fix: string;
  }[];
};

export function getSystemHealth(input: SystemHealthInput): SystemHealthResult {
  const checks = [
    { label: 'Autenticação configurada', ok: input.hasAuth, fix: 'Revisar login, sessão e modo demo.' },
    { label: 'Cloud/Supabase configurado', ok: input.hasCloud, fix: 'Configurar variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' },
    { label: 'Alunos cadastrados', ok: input.hasStudents, fix: 'Cadastrar ou importar alunos.' },
    { label: 'Treinos salvos', ok: input.hasWorkouts, fix: 'Criar treinos por aluno no builder.' },
    { label: 'Logbook com registros', ok: input.hasLogbookEntries, fix: 'Registrar séries válidas no logbook.' },
    { label: 'Avaliações salvas', ok: input.hasAssessments, fix: 'Preencher avaliação semana 1, 4 ou 8.' },
    { label: 'Build limpo', ok: input.buildStatus === 'ok' || input.buildStatus === 'unknown', fix: 'Rodar typecheck/build e corrigir erros.' }
  ];

  const okCount = checks.filter((check) => check.ok).length;
  const score = Math.round((okCount / checks.length) * 100);

  const status = score < 50 ? 'critical' : score < 75 ? 'attention' : score < 95 ? 'stable' : 'excellent';

  return { score, status, checks };
}

export function getSystemHealthMessage(result: SystemHealthResult) {
  if (result.status === 'critical') return 'Sistema ainda precisa de correções estruturais antes de escalar.';
  if (result.status === 'attention') return 'Sistema funcional, mas ainda exige ajustes importantes.';
  if (result.status === 'stable') return 'Sistema em base estável para evoluir novas features.';
  return 'Sistema em excelente estado operacional.';
}
