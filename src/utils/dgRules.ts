export type SetLog = {
  load: number;
  reps: number;
  rir: number;
  execution: 'ruim' | 'ok' | 'boa' | 'excelente';
  rangeMin: number;
  rangeMax: number;
};

export function getProgressionSuggestion(set: SetLog): string {
  if (set.reps >= set.rangeMax && set.rir <= 2 && ['boa', 'excelente'].includes(set.execution)) {
    return 'Atingiu o topo do range com boa execução. Sugestão: aumentar levemente a carga na próxima série válida.';
  }

  if (set.reps < set.rangeMin || set.execution === 'ruim') {
    return 'Carga acima do padrão ideal. Sugestão: manter ou reduzir carga e priorizar execução.';
  }

  return 'Performance dentro do range. Sugestão: manter carga e buscar mais repetições com execução limpa.';
}

export function calculateVolumeLoad(load: number, reps: number, sets: number): number {
  return load * reps * sets;
}

export const dgRanges = {
  composto: { reps: '5-10', rest: '2-4 min', rir: '0-2' },
  isolador: { reps: '8-15', rest: '60-120s', rir: '0-1' },
  deltoideLateral: { reps: '10-20', rest: '60-90s', rir: '0-1' },
  gluteoPesado: { reps: '6-10', rest: '2-4 min', rir: '0-2' },
  abducao: { reps: '12-20', rest: '60-120s', rir: '0-1' },
  abdomen: { reps: '10-20', rest: '45-90s', rir: '0-2' }
};
