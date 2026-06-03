import type { PhotoWeek, ProgressPhoto } from '../types';

export type { PhotoAngle, PhotoWeek, ProgressPhoto, ProgressPhotoDraft } from '../types';

export function groupPhotosByWeek(photos: ProgressPhoto[]) {
  return {
    week1: photos.filter((photo) => photo.week === 1),
    week4: photos.filter((photo) => photo.week === 4),
    week8: photos.filter((photo) => photo.week === 8)
  };
}

export function getComparisonLabel(fromWeek: PhotoWeek, toWeek: PhotoWeek) {
  return `Semana ${fromWeek} vs Semana ${toWeek}`;
}
