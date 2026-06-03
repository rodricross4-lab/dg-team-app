# DG TEAM APP — Fase 4: Produto Premium

## Objetivo

Transformar o DG TEAM APP em uma experiência premium de uso diário para o coach, com foco em execução rápida no celular, relatórios profissionais e percepção de alto valor.

Esta fase deve começar após:

- Fase 1: build/typecheck estáveis.
- Fase 2: dashboard e histórico reais.
- Fase 3: Supabase sync e realtime funcionando.

---

## Módulos premium

### 1. Biblioteca de exercícios real

Criar uma biblioteca estruturada com:

- nome do exercício;
- grupo muscular principal;
- músculos secundários;
- padrão de movimento;
- categoria: composto, isolador, unilateral, máquina, cabo, peso livre;
- range padrão DG Team;
- descanso padrão;
- nível: iniciante, intermediário, avançado;
- substituições;
- observações técnicas;
- contraindicações/contextos de cautela.

Arquivo sugerido:

```txt
src/data/exerciseLibrary.ts
```

ou tabela Supabase:

```txt
exercise_library
```

---

### 2. PDF premium por aluno

Exportar relatórios com identidade DG Team:

- dados do aluno;
- objetivo;
- fase atual;
- frequência;
- treinos realizados;
- volume load;
- PRs;
- evolução de carga;
- alertas;
- observações do coach;
- plano para próximo ciclo.

Arquivos sugeridos:

```txt
src/services/pdfExportService.ts
src/components/PremiumReportPanel.tsx
```

---

### 3. Avaliações físicas completas

Módulo para:

- circunferências;
- dobras cutâneas;
- peso;
- altura;
- fotos;
- observações posturais;
- objetivo visual;
- comparação entre avaliações.

Dados sugeridos:

```ts
Assessment
AssessmentMeasurement
SkinfoldProtocol
ProgressPhoto
```

---

### 4. Coach AI dashboard

Painel com insights automáticos:

- alunos sem treinar;
- queda de performance;
- alto risco de fadiga;
- alunos que bateram PR;
- alunos com baixa frequência;
- sugestões de ajuste de treino;
- sugestões de deload;
- alunos que precisam de check-in.

---

### 5. Mobile workout mode premium

Modo treino com:

- tela vertical limpa;
- botões grandes;
- timer integrado;
- entrada rápida de carga/reps/RIR;
- histórico da última sessão;
- sugestão de carga;
- PR badge;
- recovery alert;
- autosave;
- operação offline.

---

### 6. Periodização completa

Criar ciclos:

- macrocycle;
- mesocycle;
- microcycle;
- bloco atual;
- objetivo do bloco;
- semana atual;
- deload manual/automático;
- especialização por grupamento.

---

## Critérios de aceite

- App funcional no celular.
- Export PDF profissional.
- Biblioteca real utilizável.
- Avaliações físicas com histórico.
- AI dashboard com alertas acionáveis.
- Periodização conectada ao logbook.
- Experiência visual compatível com posicionamento premium DG Team.

---

## Ordem recomendada de implementação

1. Mobile Workout Mode.
2. Histórico visual de exercício.
3. PDF premium.
4. Biblioteca real.
5. Avaliações físicas.
6. Coach AI dashboard.
7. Periodização avançada.

---

## Observação estratégica

A percepção premium do app não vem apenas da estética.

Ela vem de:

- velocidade de uso;
- decisões automáticas úteis;
- histórico claro;
- relatórios profissionais;
- estabilidade;
- confiança nos dados.
