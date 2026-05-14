export type Checkin = {
  date: string;
  weight?: number;
  adherence?: number;
  sleep?: number;
  stress?: number;
  observations?: string;
};

export function getAverageAdherence(checkins: Checkin[]): number {
  if (checkins.length === 0) return 0;

  const total = checkins.reduce(
    (sum, checkin) => sum + (checkin.adherence || 0),
    0
  );

  return Math.round(total / checkins.length);
}

export function detectRecoveryAlert(checkins: Checkin[]): string | null {
  const latest = checkins[checkins.length - 1];

  if (!latest) return null;

  if ((latest.sleep || 0) < 5) {
    return 'Sono baixo detectado. Avaliar recuperação e reduzir fadiga acumulada.';
  }

  if ((latest.stress || 0) > 8) {
    return 'Nível de estresse elevado. Monitorar performance e recuperação.';
  }

  return null;
}
