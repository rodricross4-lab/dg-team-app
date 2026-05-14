export const deployChecklist = {
  local: [
    'npm install',
    'npm run dev',
    'Verificar console',
    'Verificar responsividade mobile'
  ],
  production: [
    'npm run build',
    'Deploy Netlify/Vercel',
    'Configurar variáveis Supabase',
    'Ativar PWA',
    'Testar instalação mobile',
    'Testar persistência IndexedDB'
  ],
  future: [
    'Autenticação completa',
    'Cloud sync real',
    'Upload real de fotos',
    'Push notifications',
    'App mobile nativo'
  ]
};
