export type ProgressPhoto = {
  id: string;
  week: 1 | 4 | 8;
  angle: 'frente' | 'costas' | 'lado esquerdo' | 'lado direito';
  url: string;
  date: string;
  weight?: number;
  notes?: string;
};

export function groupPhotosByWeek(photos: ProgressPhoto[]) {
  return {
    week1: photos.filter((photo) => photo.week === 1),
    week4: photos.filter((photo) => photo.week === 4),
    week8: photos.filter((photo) => photo.week === 8)
  };
}

export function getComparisonLabel(fromWeek: 1 | 4 | 8, toWeek: 1 | 4 | 8) {
  return `Semana ${fromWeek} vs Semana ${toWeek}`;
}
