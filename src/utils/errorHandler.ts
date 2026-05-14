export type AppError = {
  area: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
};

const ERROR_KEY = 'dg-team-errors';

export function logAppError(area: string, message: string, severity: AppError['severity'] = 'medium') {
  const errors = getAppErrors();

  const nextErrors = [
    ...errors,
    {
      area,
      message,
      severity,
      createdAt: new Date().toISOString()
    }
  ];

  localStorage.setItem(ERROR_KEY, JSON.stringify(nextErrors));
  return nextErrors;
}

export function getAppErrors(): AppError[] {
  const raw = localStorage.getItem(ERROR_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function clearAppErrors() {
  localStorage.removeItem(ERROR_KEY);
}
