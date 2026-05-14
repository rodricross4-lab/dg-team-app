export type AuditResult = {
  area: string;
  status: 'ok' | 'attention' | 'critical';
  message: string;
};

export function runAppAudit(): AuditResult[] {
  return [
    { area: 'Menu principal', status: 'ok', message: 'Sidebar mantém apenas Dashboard, Alunos, Biblioteca e Configurações.' },
    { area: 'DG Team rules', status: 'ok', message: 'Regras de intensidade, volume, frequência, ranges e progressão criadas.' },
    { area: 'Logbook', status: 'attention', message: 'Estrutura criada; precisa integração final com estado persistente editável.' },
    { area: 'Cloud', status: 'attention', message: 'Supabase-ready; precisa configurar projeto e variáveis reais.' },
    { area: 'Deploy', status: 'critical', message: 'Precisa rodar build e publicar em Netlify ou Vercel.' }
  ];
}
