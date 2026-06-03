import { loadAppStore } from '../store/appStore';
import type { ProgressPhoto, ProgressPhotoDraft } from '../types';
import { enqueueSync } from './offlineSyncEngine';

const STORAGE_KEY = 'dg-team-progress-photos';

function nowIso() {
  return new Date().toISOString();
}

function readLocalPhotos(): ProgressPhoto[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalPhotos(photos: ProgressPhoto[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

function getStudentTenantId(studentId: string, fallback?: string) {
  return loadAppStore().students.find((student) => student.id === studentId)?.tenant_id || fallback || '';
}

export function toSupabasePhotoPayload(photo: ProgressPhoto) {
  const weekAngle = `week-${photo.week}:${photo.angle}`;

  return {
    id: photo.id,
    tenant_id: photo.tenant_id,
    student_id: photo.student_id,
    photo_url: photo.photo_url || photo.url || null,
    storage_path: photo.storage_path,
    angle: weekAngle,
    notes: photo.notes || null,
    created_at: photo.created_at,
    updated_at: photo.updated_at
  };
}

function normalizePhoto(photo: ProgressPhotoDraft): ProgressPhoto {
  const timestamp = nowIso();
  const url = photo.url || photo.photo_url || '';

  return {
    id: photo.id || crypto.randomUUID(),
    tenant_id: getStudentTenantId(photo.student_id, photo.tenant_id),
    student_id: photo.student_id,
    week: photo.week,
    angle: photo.angle,
    url,
    photo_url: photo.photo_url ?? (url || null),
    storage_path: photo.storage_path || null,
    date: photo.date || timestamp,
    weight: photo.weight ?? null,
    notes: photo.notes || null,
    created_at: photo.created_at || timestamp,
    updated_at: timestamp
  };
}

export function getStoredProgressPhotos(studentId?: string) {
  const photos = readLocalPhotos();
  return studentId ? photos.filter((photo) => photo.student_id === studentId) : photos;
}

export async function saveProgressPhoto(photoDraft: ProgressPhotoDraft) {
  const current = readLocalPhotos();
  const normalized = normalizePhoto(photoDraft);
  const exists = current.some((photo) => photo.id === normalized.id);
  const next = exists
    ? current.map((photo) => (photo.id === normalized.id ? normalized : photo))
    : [normalized, ...current];

  writeLocalPhotos(next);
  enqueueSync('photo', exists ? 'update' : 'create', toSupabasePhotoPayload(normalized));

  return normalized;
}

export async function deleteProgressPhoto(photoId: string) {
  const current = readLocalPhotos();
  const existing = current.find((photo) => photo.id === photoId);
  const next = current.filter((photo) => photo.id !== photoId);

  writeLocalPhotos(next);

  if (existing) {
    enqueueSync('photo', 'delete', {
      id: photoId,
      tenant_id: existing.tenant_id,
      student_id: existing.student_id,
      updated_at: nowIso()
    });
  }

  return next;
}
