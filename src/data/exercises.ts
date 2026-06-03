import { exerciseLibrary, formatRepRange, formatRest } from './exerciseLibrary';

export const exercises = exerciseLibrary.map((exercise) => ({
  name: exercise.name,
  group: exercise.muscle_group,
  range: formatRepRange(exercise),
  rest: formatRest(exercise)
}));
