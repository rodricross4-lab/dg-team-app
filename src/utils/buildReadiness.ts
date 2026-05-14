export function checkBuildReadiness() {
  return {
    typescript: true,
    pwa: true,
    autosave: true,
    offlineQueue: true,
    cloud: false,
    deploy: false
  };
}

export function getBuildProgress() {
  const checks = Object.values(checkBuildReadiness());
  const passed = checks.filter(Boolean).length;

  return Math.round((passed / checks.length) * 100);
}
