export function sanitizeText(value: string): string {
  return value
    .replaceAll('<', '')
    .replaceAll('>', '')
    .replaceAll('script', '')
    .trim();
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');

  if (!user || !domain) return email;

  return `${user.slice(0, 2)}***@${domain}`;
}

export function canAccessStudent(role: 'coach' | 'student', ownerId: string, currentId: string): boolean {
  if (role === 'coach') return true;
  return ownerId === currentId;
}
