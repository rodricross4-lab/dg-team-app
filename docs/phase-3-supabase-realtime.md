# DG TEAM APP — Fase 3: Supabase Sync, Realtime e Plataforma Premium

## Objetivo

Transformar a arquitetura offline-first atual em uma sincronização cloud completa, com Supabase real, realtime e validação RLS.

Esta fase deve começar somente após:

- Fase 1 estabilizada com typecheck/build.
- Fase 2 com histórico real e dashboard conectado.

---

## Estado atual da base

Já existe:

- Supabase client.
- Auth real.
- Role system.
- RLS foundation.
- Offline sync queue.
- StudentService com enqueueSync.
- LogbookService com enqueueSync.
- WorkoutSession e LogbookSet reais.
- UUID architecture.

Ainda falta:

- processar a sync queue contra Supabase;
- resolver conflitos;
- fazer retry/backoff;
- subscriptions realtime;
- garantir tenant_id/coach_id em todos os fluxos.

---

## Arquivos sugeridos

Criar ou evoluir:

```txt
src/services/cloudSyncService.ts
src/services/realtimeService.ts
src/services/conflictResolver.ts
src/services/tenantContextService.ts
src/types/sync.ts
```

---

## Sync Queue Cloud

### Fluxo esperado

```txt
Ação local
↓
Salvar localStorage/IndexedDB
↓
Adicionar na sync queue
↓
Tentar sincronizar com Supabase
↓
Marcar done ou failed
↓
Retry com backoff
```

---

## Funções sugeridas

### cloudSyncService.ts

```ts
processSyncQueue()
syncQueueItem(item)
syncStudent(item)
syncWorkout(item)
syncLogbookSet(item)
syncAssessment(item)
syncPhoto(item)
```

### conflictResolver.ts

```ts
resolveByUpdatedAt(local, remote)
resolveDeletedRecord(local, remote)
resolveClientGeneratedId(local, remote)
```

### realtimeService.ts

```ts
subscribeToStudents(tenantId, callback)
subscribeToWorkoutSessions(studentId, callback)
subscribeToLogbookSets(studentId, callback)
unsubscribeAll()
```

---

## Regras de sync

### Create

- Se o registro tem UUID local, tentar inserir no Supabase com o mesmo id.
- Se houver conflito, buscar remoto e resolver por `updated_at`.

### Update

- Atualizar por `id`.
- Nunca atualizar registro fora do `tenant_id` atual.

### Delete / Archive

- Preferir soft delete com `deleted_at`.
- Evitar delete físico para dados de aluno, sessão, logbook e avaliação.

### Falha

- Incrementar attempts.
- Guardar mensagem de erro.
- Tentar novamente depois.
- Se attempts > limite, marcar como failed permanente e exibir alerta técnico.

---

## RLS obrigatório

Todas as tabelas devem validar:

- `tenant_id` pertence ao usuário logado;
- coach só acessa seus alunos;
- aluno só acessa seus próprios dados, se modo student existir;
- operações de escrita respeitam role.

---

## Realtime obrigatório

Tabelas prioritárias:

- students;
- workout_sessions;
- logbook_sets;
- assessments;
- checkins.

Comportamento esperado:

- ao alterar em outro dispositivo, UI atualiza;
- ao sincronizar queue, dashboard atualiza;
- ao entrar em aluno, dados carregam do cache e atualizam do cloud.

---

## Critérios de aceite

- Sync queue processa create/update/archive/delete.
- Falhas ficam rastreáveis.
- Retry funciona.
- Realtime atualiza alunos e logbook.
- RLS testado manualmente.
- Offline continua funcionando.
- Dados não duplicam após reconectar.

---

## Próxima fase

Fase 4: Produto Premium

- PDFs profissionais.
- Biblioteca real.
- Coach AI dashboard.
- Avaliações completas.
- Modo mobile premium.
