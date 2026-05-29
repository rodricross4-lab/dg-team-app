import type { Student } from '../types';

const timestamp = new Date().toISOString();

export const studentsSeed: Student[] = [
  {
    id: 'seed-rodrigo-santos',
    tenant_id: 'local-tenant',
    coach_id: 'local-coach',
    user_id: null,
    name: 'Rodrigo Santos',
    goal: 'Hipertrofia',
    phase: 'bulking',
    training_frequency: 5,
    priority_muscles: ['Peitoral', 'Costas'],
    alerts: [],
    status: 'active',
    created_at: timestamp,
    updated_at: timestamp,
    deleted_at: null
  },
  {
    id: 'seed-valentina-rocha',
    tenant_id: 'local-tenant',
    coach_id: 'local-coach',
    user_id: null,
    name: 'Valentina Rocha',
    goal: 'Gluteos',
    phase: 'maintenance',
    training_frequency: 5,
    priority_muscles: ['Gluteos', 'Quadriceps'],
    alerts: [],
    status: 'active',
    created_at: timestamp,
    updated_at: timestamp,
    deleted_at: null
  }
];
