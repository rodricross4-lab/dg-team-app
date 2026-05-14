export type PerformancePoint = {
  week: number;
  volumeLoad: number;
};

export function getPerformanceTrend(points: PerformancePoint[]) {
  if (points.length < 2) {
    return {
      trend: 'insuficiente',
      message: 'Dados insuficientes para análise.'
    };
  }

  const first = points[0].volumeLoad;
  const last = points[points.length - 1].volumeLoad;

  if (last > first) {
    return {
      trend: 'subindo',
      message: 'Performance geral subindo. Progressão sustentável detectada.'
    };
  }

  if (last < first) {
    return {
      trend: 'caindo',
      message: 'Queda de performance detectada. Revisar recuperação, volume e intensidade.'
    };
  }

  return {
    trend: 'estavel',
    message: 'Performance estável. Buscar pequenas progressões semanais.'
  };
}
