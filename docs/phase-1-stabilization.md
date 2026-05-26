# DG TEAM APP — Fase 1: Estabilização do MVP

## Objetivo

Estabilizar a fundação real do app antes de expandir novas features.

Esta fase deve deixar o PR #7 pronto para sair de draft somente depois de build e typecheck passarem.

---

## Status atual

Já existe no projeto:

- StudentService real.
- Student CRUD real.
- WorkoutSession real.
- LogbookSet real.
- Progression Engine.
- PR Engine.
- Recovery Engine.
- Progression Cards no SmartLogbook.
- PR Cards no SmartLogbook.
- Offline-first + sync queue.
- UUID architecture.

Ainda falta conectar visualmente os Recovery Alerts no SmartLogbook e validar build/typecheck.

---

## Checklist obrigatório

- [ ] Conectar `analyzeRecovery()` no `SmartLogbookPanel.tsx`.
- [ ] Renderizar Recovery Cards abaixo dos PR Cards.
- [ ] Adicionar estilos de Recovery Cards.
- [ ] Rodar `npm run typecheck`.
- [ ] Rodar `npm run build`.
- [ ] Corrigir incompatibilidades TypeScript.
- [ ] Confirmar que o PR #7 continua mergeable.
- [ ] Manter o PR como draft até validação completa.

---

## Patch manual recomendado

### 1. Atualizar import no SmartLogbookPanel

Substituir:

```ts
import { analyzeProgression, detectPersonalRecords } from '../utils/dgTrainingRules';
```

Por:

```ts
import { analyzeProgression, analyzeRecovery, detectPersonalRecords } from '../utils/dgTrainingRules';
```

---

### 2. Adicionar helper de estilo

Logo abaixo de `getDecisionStyle()`:

```ts
function getRecoveryStyle(severity: string) {
  if (severity === 'danger') return recoveryDanger;
  if (severity === 'warning') return recoveryWarning;
  return recoveryInfo;
}
```

---

### 3. Criar recoveryAlerts dentro do map dos exercícios

Depois de:

```ts
const prs = detectPersonalRecords({ currentSets: exerciseSets });
```

Adicionar:

```ts
const recoveryAlerts = analyzeRecovery({
  currentSets: exerciseSets,
  maxRecommendedValidSets: exercise.validSets,
});
```

---

### 4. Renderizar os Recovery Cards

Abaixo dos PR Cards e antes do card de progressão:

```tsx
{recoveryAlerts.length > 0 && (
  <div style={recoveryBox}>
    {recoveryAlerts.map((alert) => (
      <div key={`${alert.type}-${alert.label}`} style={getRecoveryStyle(alert.severity)}>
        <strong>{alert.label}</strong>
        <p style={{ margin: '6px 0 0' }}>{alert.message}</p>
      </div>
    ))}
  </div>
)}
```

---

### 5. Adicionar estilos no fim do arquivo

```ts
const recoveryBox = { display: 'grid', gap: 8, marginTop: 12 };
const recoveryInfo = { background: '#0a1420', border: '1px solid #1f4063', borderRadius: 14, color: '#b8dcff', padding: 12 };
const recoveryWarning = { background: '#1a1305', border: '1px solid #5a3b0b', borderRadius: 14, color: '#ffe3a3', padding: 12 };
const recoveryDanger = { background: '#1c0707', border: '1px solid #5a1515', borderRadius: 14, color: '#ffb8b8', padding: 12 };
```

---

## Validação esperada

Depois do patch:

```bash
npm run typecheck
npm run build
```

Critério de aceite:

- Nenhum erro de TypeScript.
- Build Vite finalizado com sucesso.
- Recovery Cards aparecem quando houver:
  - execução ruim;
  - RIR 0 em muitas séries;
  - intensidade muito baixa;
  - volume acima do planejado;
  - queda de volume load.

---

## Próxima fase após estabilização

Fase 2: histórico real e dashboard vivo.

Prioridade:

1. Comparar sessão atual com sessões anteriores.
2. Puxar histórico de LogbookSet por exercício.
3. Dashboard real sem métricas mockadas.
4. Cards reais de PR e alerta.
