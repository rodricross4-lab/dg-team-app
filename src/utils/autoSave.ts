const AUTO_SAVE_KEY = 'dg-team-last-autosave';

export function markAutoSave() {
  const value = new Date().toISOString();
  localStorage.setItem(AUTO_SAVE_KEY, value);
  return value;
}

export function getLastAutoSave() {
  return localStorage.getItem(AUTO_SAVE_KEY);
}
