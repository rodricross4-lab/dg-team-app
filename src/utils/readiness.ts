export type ReadinessItem = {
  name: string;
  status: 'done' | 'partial' | 'missing';
  note: string;
};

export const productionReadiness: ReadinessItem[] = [
  { name: 'Dashboard', status: 'done', note: 'Estrutura visual e KPIs principais criados.' },
  { name: 'Alunos', status: 'partial', note: 'Base criada; falta CRUD conectado ao estado global.' },
  { name: 'Treinos 8 semanas', status: 'done', note: 'Factory do ciclo criada.' },
  { name: 'Logbook presencial', status: 'partial', note: 'Componentes e regras criados; falta edição persistente completa.' },
  { name: 'IA DG', status: 'done', note: 'Múltiplas engines contextuais criadas.' },
  { name: 'PDF', status: 'partial', note: 'Exportação base criada; falta layout final com gráficos/fotos reais.' },
  { name: 'Fotos', status: 'partial', note: 'Estrutura de comparação criada; falta upload cloud real.' },
  { name: 'Banco cloud', status: 'partial', note: 'Supabase-ready; faltam credenciais e tabelas reais.' },
  { name: 'Deploy', status: 'missing', note: 'Falta conectar Netlify/Vercel e rodar build.' }
];

export function getReadinessScore(items = productionReadiness) {
  const points = items.reduce((total, item) => {
    if (item.status === 'done') return total + 1;
    if (item.status === 'partial') return total + 0.5;
    return total;
  }, 0);

  return Math.round((points / items.length) * 100);
}
