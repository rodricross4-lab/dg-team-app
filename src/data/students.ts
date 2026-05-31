import type { Student } from '../types';
import { LOCAL_COACH_ID, LOCAL_TENANT_ID } from '../services/tenantContextService';

const timestamp = new Date().toISOString();

export const studentsSeed: Student[] = [
  {
    id: 'seed-rodrigo-santos',
    tenant_id: LOCAL_TENANT_ID,
    coach_id: LOCAL_COACH_ID,
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
    tenant_id: LOCAL_TENANT_ID,
    coach_id: LOCAL_COACH_ID,
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
