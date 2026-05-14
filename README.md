# DG TEAM APP

Aplicativo premium DG TEAM para gestão de alunos, treinos, logbook presencial, avaliações, fotos, calendário, evolução de ciclo, IA contextual e relatórios.

## Stack

- React
- TypeScript
- Vite
- Recharts
- jsPDF/html2canvas

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois abra o link local mostrado no terminal.

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy no Netlify

Configurações:

- Build command: `npm run build`
- Publish directory: `dist`

## Deploy na Vercel

Configurações:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Estrutura atual

- Dashboard principal
- Sidebar com apenas Dashboard, Alunos, Biblioteca de Exercícios e Configurações
- Perfil individual de aluno
- Treinos por 8 semanas
- Logbook presencial
- IA DG contextual inicial
- Biblioteca com 200+ exercícios
- Calendário visual
- Avaliações físicas semana 1, 4 e 8
- Fotos semana 1, 4 e 8
- Evolução do ciclo
- Base para PDF premium

## Próximas melhorias

- Persistência real em IndexedDB/Supabase
- Upload real de fotos
- Exportação PDF real
- Autenticação
- PWA instalável
- IA real conectada a banco de dados
