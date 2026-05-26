# DG TEAM APP — Documentação Técnica

Este diretório organiza o roadmap técnico do DG TEAM APP por fases.

## Fases

### Fase 1 — Estabilização do MVP

Arquivo: [`phase-1-stabilization.md`](./phase-1-stabilization.md)

Objetivo:

- conectar Recovery UI;
- rodar typecheck;
- rodar build;
- corrigir incompatibilidades;
- estabilizar o PR #7 antes de sair de draft.

---

### Fase 2 — Dashboard, Analytics e Histórico Real

Arquivo: [`phase-2-dashboard-analytics.md`](./phase-2-dashboard-analytics.md)

Objetivo:

- histórico real por exercício;
- comparação entre sessões;
- dashboard sem mocks;
- PRs e alertas reais;
- analytics offline-first.

---

### Fase 3 — Supabase Sync, Realtime e Plataforma Premium

Arquivo: [`phase-3-supabase-realtime.md`](./phase-3-supabase-realtime.md)

Objetivo:

- processar sync queue contra Supabase;
- implementar retry/backoff;
- resolver conflitos;
- realtime subscriptions;
- validar RLS e tenant isolation.

---

### Fase 4 — Produto Premium

Arquivo: [`phase-4-premium-product.md`](./phase-4-premium-product.md)

Objetivo:

- biblioteca real;
- PDF premium;
- avaliações completas;
- coach AI dashboard;
- mobile workout mode;
- periodização avançada.

---

## Ordem obrigatória

1. Estabilizar.
2. Validar build/typecheck.
3. Conectar histórico real.
4. Conectar dashboard vivo.
5. Completar Supabase sync.
6. Evoluir experiência premium.

---

## Regra de engenharia

Não adicionar novas features grandes antes de:

- typecheck passar;
- build passar;
- dados reais estarem consistentes;
- sync queue não duplicar dados;
- RLS estar validado.

---

## PR principal

PR #7 — `feature/real-data-foundation`

Este PR concentra a fundação real do app e deve permanecer como draft até validação completa.
