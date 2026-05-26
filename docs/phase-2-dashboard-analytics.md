# DG TEAM APP — Fase 2: Dashboard, Analytics e Histórico Real

## Objetivo

Transformar o app em um sistema operacional real de acompanhamento, usando os dados gerados pelo logbook presencial.

A Fase 2 só deve começar depois da Fase 1 estar estável com typecheck e build passando.

---

## Dependências da Fase 1

Antes de iniciar esta fase, confirmar:

- [ ] `npm run typecheck` sem erros.
- [ ] `npm run build` sem erros.
- [ ] Recovery Alerts conectados no SmartLogbook.
- [ ] PR #7 validado como base estável.

---

## Objetivos técnicos

### 1. Histórico real por exercício

Criar funções para consultar histórico de sets por aluno e exercício.

Funções sugeridas:

```ts
getExerciseHistory(studentId: string, exerciseId: string): LogbookSet[]
getLastExerciseSession(studentId: string, exerciseId: string): LogbookSet[]
getPreviousExerciseSession(studentId: string, exerciseId: string): LogbookSet[]
```

Critério:

- ordenar por `created_at` ou `performed_at`;
- agrupar por `session_id`;
- retornar apenas `set_type === 'valid'` para analytics de volume/progressão.

---

### 2. Comparação real entre sessões

Hoje a progressão e PR funcionam sobre os sets atuais. A Fase 2 deve comparar a sessão atual com a sessão anterior real.

Fluxo esperado:

```txt
LogbookSet atual
↓
Buscar última sessão anterior do mesmo exercício
↓
Comparar carga/reps/volume/execução
↓
Gerar ProgressionDecision, PRs e RecoveryAlerts
```

---

### 3. Dashboard vivo

Remover métricas fixas do dashboard.

Substituir por dados reais:

- total de alunos ativos;
- treinos realizados hoje;
- volume load semanal;
- PRs recentes;
- alunos em alerta;
- média de frequência;
- avaliações pendentes;
- séries válidas por grupamento.

---

## Serviços sugeridos

Criar:

```txt
src/services/analyticsService.ts
```

Funções:

```ts
getWeeklyVolumeByMuscle(studentId?: string)
getWeeklyVolumeLoad(studentId?: string)
getRecentPRs(studentId?: string)
getStudentsAtRisk()
getDashboardSummary()
getExercisePerformanceTrend(studentId: string, exerciseId: string)
```

---

## Tipos sugeridos

Criar ou adicionar em `src/types/analytics.ts`:

```ts
export type DashboardSummary = {
  activeStudents: number;
  workoutsToday: number;
  weeklyVolumeLoad: number;
  recentPRs: number;
  studentsAtRisk: number;
  pendingAssessments: number;
};

export type MuscleVolume = {
  muscle: string;
  validSets: number;
  volumeLoad: number;
};

export type ExerciseTrendPoint = {
  date: string;
  exercise_id: string;
  load: number;
  reps: number;
  volumeLoad: number;
  executionQuality?: number;
};
```

---

## UI necessária

### Dashboard

Substituir cards fixos por cards reais:

- Alunos ativos.
- Treinos hoje.
- Volume load semanal.
- PRs recentes.
- Alunos em alerta.

### SmartLogbook

Adicionar:

- Histórico do exercício.
- Última carga usada.
- Melhor série anterior.
- Último PR.
- Sugestão da próxima sessão.

### StudentProfile

Adicionar aba/resumo:

- Frequência semanal.
- PRs recentes.
- Volume por grupamento.
- Alertas ativos.

---

## Critérios de aceite

- Dashboard sem valores mockados principais.
- Histórico por exercício funcional.
- Progression Engine comparando sessão atual vs sessão anterior real.
- PR Engine comparando contra histórico real.
- Recovery Engine usando dados de sessão anterior quando existir.
- Analytics funcionando offline-first.

---

## Próxima fase

Fase 3: Analytics avançado e Supabase sync completo.
