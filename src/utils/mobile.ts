export function isStandaloneMode(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

export function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function getInstallSuggestion(): string {
  if (isStandaloneMode()) {
    return 'DG TEAM APP instalado no dispositivo.';
  }

  if (isMobileDevice()) {
    return 'Adicione o DG TEAM APP à tela inicial para experiência premium.';
  }

  return 'Abra no celular para instalar como aplicativo.';
}
