import type { Exercise, ExerciseCategory, ExerciseLevel } from '../types';

export type ExerciseLibraryItem = Exercise & {
  secondary_muscles: string[];
  cautions: string[];
};

type ExerciseSeed = [
  id: string,
  name: string,
  group: string,
  subdivision: string | null,
  secondary: string[],
  category: ExerciseCategory,
  pattern: string,
  equipment: string,
  repMin: number,
  repMax: number,
  restSeconds: number,
  level: ExerciseLevel,
  substitutes: string[],
  notes: string,
  cautions?: string[]
];

const createdAt = '2026-01-01T00:00:00.000Z';

const seeds: ExerciseSeed[] = [
  ['global-supino-reto-barra', 'Supino reto barra', 'Peitoral', 'Porcao media', ['Triceps', 'Ombros'], 'compound', 'Empurrar horizontal', 'Barra livre', 5, 10, 180, 'intermediate', ['Supino reto halteres', 'Chest press maquina'], 'Manter escapulas encaixadas e controlar a excentrica.', ['Evitar amplitude dolorosa em ombro anterior.']],
  ['global-supino-inclinado-halteres', 'Supino inclinado halteres', 'Peitoral', 'Porcao clavicular', ['Triceps', 'Ombros'], 'compound', 'Empurrar inclinado', 'Halteres', 6, 10, 180, 'intermediate', ['Supino inclinado barra', 'Supino inclinado maquina'], 'Banco entre 20 e 35 graus para preservar o peitoral superior.'],
  ['global-crucifixo-cabo', 'Crucifixo no cabo', 'Peitoral', 'Alongado', ['Ombros'], 'isolation', 'Aducao horizontal', 'Cabo', 10, 20, 90, 'beginner', ['Peck deck', 'Crucifixo halteres'], 'Buscar alongamento sem perder estabilidade escapular.'],
  ['global-puxada-alta-aberta', 'Puxada alta aberta', 'Costas', 'Dorsal', ['Biceps'], 'compound', 'Puxar vertical', 'Cabo', 6, 12, 150, 'beginner', ['Barra fixa assistida', 'Puxada neutra'], 'Iniciar com depressao escapular antes de flexionar cotovelos.'],
  ['global-remada-articulada', 'Remada articulada', 'Costas', 'Espessura', ['Biceps', 'Posterior de ombro'], 'compound', 'Puxar horizontal', 'Maquina', 6, 12, 150, 'intermediate', ['Remada baixa triangulo', 'Remada curvada'], 'Conduzir cotovelos para tras sem roubar com lombar.'],
  ['global-elevacao-lateral-cabo', 'Elevacao lateral cabo', 'Ombros', 'Deltoide lateral', ['Trapezio'], 'isolation', 'Abducao de ombro', 'Cabo', 10, 20, 75, 'intermediate', ['Elevacao lateral halteres', 'Elevacao lateral maquina'], 'Cabo atras do corpo aumenta tensao no alongado.'],
  ['global-rosca-direta', 'Rosca direta', 'Biceps', 'Geral', ['Antebraco'], 'isolation', 'Flexao de cotovelo', 'Barra', 8, 15, 90, 'beginner', ['Rosca alternada', 'Rosca cabo'], 'Evitar balanco de tronco e manter cotovelos estaveis.'],
  ['global-triceps-corda', 'Triceps corda', 'Triceps', 'Geral', ['Antebraco'], 'isolation', 'Extensao de cotovelo', 'Cabo', 8, 15, 90, 'beginner', ['Triceps barra V', 'Triceps maquina'], 'Abrir a corda no fim sem deslocar os cotovelos.'],
  ['global-hack-machine', 'Hack machine', 'Quadriceps', 'Geral', ['Gluteos', 'Adutores'], 'compound', 'Agachamento guiado', 'Maquina', 6, 12, 180, 'intermediate', ['Agachamento smith', 'Leg press 45'], 'Descer com controle e manter joelhos na linha dos pes.', ['Ajustar amplitude se houver dor patelar.']],
  ['global-mesa-flexora', 'Mesa flexora', 'Posteriores', 'Joelho flexor', ['Panturrilhas'], 'isolation', 'Flexao de joelho', 'Maquina', 8, 15, 90, 'beginner', ['Cadeira flexora', 'Flexora unilateral'], 'Controlar a subida e evitar tirar quadril do apoio.'],
  ['global-hip-thrust', 'Hip thrust', 'Gluteos', 'Gluteo maximo', ['Posteriores'], 'compound', 'Extensao de quadril', 'Barra', 6, 12, 150, 'intermediate', ['Glute bridge', 'Hip thrust maquina'], 'Finalizar com retroversao leve e pausa no pico.'],
  ['global-prancha', 'Prancha', 'Abdomen', 'Anti extensao', ['Gluteos', 'Ombros'], 'core', 'Estabilidade', 'Peso corporal', 20, 60, 60, 'beginner', ['Dead bug', 'Pallof press'], 'Manter costelas baixas, pelve neutra e respiracao controlada.'],
  ['global-mobilidade-toracica', 'Mobilidade toracica no banco', 'Mobilidade', 'Toracica', ['Ombros'], 'mobility', 'Extensao toracica', 'Banco', 6, 10, 45, 'beginner', ['Open book', 'Wall slide'], 'Preparacao util para treinos de superior.']
];

function exercise([
  id,
  name,
  muscle_group,
  muscle_subdivision,
  secondary_muscles,
  category,
  pattern,
  equipment,
  repMin,
  repMax,
  restSeconds,
  level,
  substitutes,
  notes,
  cautions = []
]: ExerciseSeed): ExerciseLibraryItem {
  return {
    id,
    tenant_id: null,
    name,
    muscle_group,
    muscle_subdivision,
    secondary_muscles,
    category,
    pattern,
    equipment,
    default_rep_min: repMin,
    default_rep_max: repMax,
    default_rest_seconds: restSeconds,
    level,
    substitutes,
    notes,
    cautions,
    is_global: true,
    created_at: createdAt,
    updated_at: createdAt
  };
}

export const exerciseLibrary: ExerciseLibraryItem[] = seeds.map(exercise);

export const exerciseGroups = Array.from(
  new Set(exerciseLibrary.map((item) => item.muscle_group))
).sort((first, second) => first.localeCompare(second));

export function formatRepRange(exerciseItem: Pick<Exercise, 'default_rep_min' | 'default_rep_max'>) {
  return `${exerciseItem.default_rep_min}-${exerciseItem.default_rep_max}`;
}

export function formatRest(exerciseItem: Pick<Exercise, 'default_rest_seconds'>) {
  if (exerciseItem.default_rest_seconds >= 120 && exerciseItem.default_rest_seconds % 60 === 0) {
    return `${exerciseItem.default_rest_seconds / 60} min`;
  }

  return `${exerciseItem.default_rest_seconds}s`;
}

export function findExerciseByName(name: string) {
  return exerciseLibrary.find((item) => item.name === name);
}
