# DG TEAM APP — Próximo Plano de Execução

## Objetivo

Executar as próximas etapas em ordem segura, sem quebrar a fundação já criada no PR #7.

---

## Ordem imediata

### 1. Estabilizar SmartLogbookPanel

Prioridade máxima.

Tarefas:

- conectar `analyzeRecovery()` na UI;
- renderizar Recovery Cards;
- validar tipos de `studentId`, `exercise.validSets` e `exercise.reps`;
- garantir que `studentId` seja sempre string.

Arquivos:

```txt
src/components/SmartLogbookPanel.tsx
src/utils/dgTrainingRules.ts
```

---

### 2. Rodar validação local

Comandos:

```bash
npm run typecheck
npm run build
```

Corrigir todos os erros antes de qualquer feature nova.

---

### 3. Corrigir tipos cruzados

Pontos prováveis:

- `Student` antigo vs `Student` novo;
- `studentId: number` vs `studentId: string`;
- campos antigos: `frequency`, `priority`, `weight`, `height`;
- campos novos: `training_frequency`, `priority_muscles`, `weight_kg`, `height_cm`;
- `WorkoutSession` importado de locais diferentes;
- `LogbookSet` antigo do smartLogbookEngine vs tipo novo global.

---

### 4. Histórico real

Criar funções no `logbookService`:

```ts
getExerciseHistory(studentId: string, exerciseId: string)
getExerciseSessionGroups(studentId: string, exerciseId: string)
getPreviousExerciseSets(studentId: string, exerciseId: string, currentSessionId: string)
```

Essas funções devem alimentar:

- Progression Engine;
- PR Engine;
- Recovery Engine.

---

### 5. Dashboard real

Criar:

```txt
src/services/analyticsService.ts
src/types/analytics.ts
```

Métricas prioritárias:

- total de alunos ativos;
- treinos hoje;
- volume load semanal;
- PRs recentes;
- alunos em alerta;
- séries válidas por grupamento.

---

### 6. Supabase cloud sync

Criar:

```txt
src/services/cloudSyncService.ts
```

Responsável por processar:

- student;
- workout;
- logbook_set;
- assessment;
- checkin;
- photo.

---

## Regra de segurança

Não marcar o PR #7 como pronto enquanto:

- typecheck não passar;
- build não passar;
- dados de aluno e logbook não estiverem consistentes;
- Recovery UI não estiver conectada;
- não houver validação manual do fluxo criar aluno → criar treino → registrar set.

---

## Fluxo manual de teste

1. Login como coach.
2. Criar aluno.
3. Abrir aluno.
4. Criar/selecionar treino.
5. Registrar carga, reps, RIR e execução.
6. Confirmar que:
   - sessão foi criada;
   - set foi salvo;
   - volume válido atualizou;
   - volume load atualizou;
   - progression card apareceu;
   - PR card apareceu quando aplicável;
   - recovery card apareceu quando aplicável;
   - sync queue recebeu item.

---

## Resultado esperado

Ao final desta execução, o DG TEAM APP deve estar pronto para entrar na Fase 2: histórico real e dashboard vivo.
