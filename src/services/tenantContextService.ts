import { getCurrentUser } from './authService';

export const LOCAL_TENANT_ID = 'local-tenant';
export const LOCAL_COACH_ID = 'local-coach';

export type TenantContext = {
  tenant_id: string;
  coach_id: string;
  user_id: string | null;
  source: 'local' | 'auth' | 'env';
};

function getEnvValue(name: 'VITE_DG_TENANT_ID' | 'VITE_DG_COACH_ID') {
  const value = import.meta.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

export function getTenantContext(): TenantContext {
  const user = getCurrentUser();
  const envTenantId = getEnvValue('VITE_DG_TENANT_ID');
  const envCoachId = getEnvValue('VITE_DG_COACH_ID');
  const isDemoUser = !user || user.id === 'coach-demo';

  if (envTenantId || envCoachId) {
    return {
      tenant_id: envTenantId || LOCAL_TENANT_ID,
      coach_id: envCoachId || (isDemoUser ? LOCAL_COACH_ID : user.id),
      user_id: isDemoUser ? null : user.id,
      source: 'env',
    };
  }

  if (user && !isDemoUser) {
    return {
      tenant_id: LOCAL_TENANT_ID,
      coach_id: user.id,
      user_id: user.id,
      source: 'auth',
    };
  }

  return {
    tenant_id: LOCAL_TENANT_ID,
    coach_id: LOCAL_COACH_ID,
    user_id: null,
    source: 'local',
  };
}
