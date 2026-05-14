import type { Student } from '../types';

export function generateStudentInsights(student: Student) {
  const insights: string[] = [];

  if (student.frequency >= 5) {
    insights.push('Frequência elevada. Monitorar recuperação e qualidade das séries válidas.');
  }

  if (student.priority.length >= 2) {
    insights.push('Mais de um músculo prioritário. Ajustar distribuição de volume semanal.');
  }

  if (student.goal === 'Emagrecimento') {
    insights.push('Priorizar manutenção de performance durante déficit calórico.');
  }

  if (student.alerts.length > 0) {
    insights.push('Aluno possui alertas ativos. Revisar recuperação e aderência semanalmente.');
  }

  if (insights.length === 0) {
    insights.push('Estrutura atual adequada para progressão sustentável.');
  }

  return insights;
}
