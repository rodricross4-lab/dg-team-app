export type BackupPayload = {
  createdAt: string;
  version: string;
  data: unknown;
};

export function createBackup(data: unknown): BackupPayload {
  return {
    createdAt: new Date().toISOString(),
    version: '1.0.0',
    data
  };
}

export function downloadBackup(payload: BackupPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `dg-team-backup-${payload.createdAt}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<BackupPayload> {
  const text = await file.text();
  return JSON.parse(text) as BackupPayload;
}
