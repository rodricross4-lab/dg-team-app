export function isRequired(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
}

export function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function validateStudentForm(data: {
  name: string;
  age?: number;
  weight?: number;
  height?: number;
}) {
  const errors: string[] = [];

  if (!isRequired(data.name)) errors.push('Nome do aluno é obrigatório.');
  if (data.age !== undefined && !isPositiveNumber(data.age)) errors.push('Idade inválida.');
  if (data.weight !== undefined && !isPositiveNumber(data.weight)) errors.push('Peso inválido.');
  if (data.height !== undefined && !isPositiveNumber(data.height)) errors.push('Altura inválida.');

  return {
    valid: errors.length === 0,
    errors
  };
}
