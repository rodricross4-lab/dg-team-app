import { getCurrentUser } from './authService';
import { getSupabaseClient, isSupabaseReady } from './supabaseService';

export const LOCAL_TENANT_ID = 'local-tenant';
export const LOCAL_COACH_ID = 'local-coach';
const CONTEXT_CACHE_KEY = 'dg-team-tenant-context';

export type TenantContext = {
  tenant_id: string;
  coach_id: string;
  user_id: string | null;
  source: 'local' | 'auth' | 'env';
  isCloudResolved: boolean;
  warning?: string;
};

function getEnvValue(name: 'VITE_DG_TENANT_ID' | 'VITE_DG_COACH_ID') {
  const value = import.meta.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function getEnvContext(userId: string | null): TenantContext | null {
  const envTenantId = getEnvValue('VITE_DG_TENANT_ID');
  const envCoachId = getEnvValue('VITE_DG_COACH_ID');

  if (!envTenantId && !envCoachId) return null;

  return {
    tenant_id: envTenantId || LOCAL_TENANT_ID,
    coach_id: envCoachId || userId || LOCAL_COACH_ID,
    user_id: userId,
    source: 'env',
    isCloudResolved: true,
  };
}

function readCachedContext(userId: string): TenantContext | null {
  try {
    const raw = localStorage.getItem(CONTEXT_CACHE_KEY);
    if (!raw) return null;

    const context = JSON.parse(raw) as TenantContext;
    return context.user_id === userId && context.tenant_id && context.coach_id
      ? { ...context, source: 'auth', isCloudResolved: true }
      : null;
  } catch {
    return null;
  }
}

function cacheTenantContext(context: TenantContext) {
  if (context.user_id && context.isCloudResolved) {
    localStorage.setItem(CONTEXT_CACHE_KEY, JSON.stringify(context));
  }
}

export function getTenantContext(): TenantContext {
  const user = getCurrentUser();
  const isDemoUser = !user || user.id === 'coach-demo';
  const envContext = getEnvContext(isDemoUser ? null : user.id);

  if (envContext) return envContext;

  if (user && !isDemoUser) {
    const cached = readCachedContext(user.id);
    if (cached) return cached;

    return {
      tenant_id: LOCAL_TENANT_ID,
      coach_id: user.id,
      user_id: user.id,
      source: 'auth',
      isCloudResolved: false,
      warning: 'Contexto cloud ainda nao resolvido. Busque o coach real antes de sincronizar.',
    };
  }

  return {
    tenant_id: LOCAL_TENANT_ID,
    coach_id: LOCAL_COACH_ID,
    user_id: null,
    source: 'local',
    isCloudResolved: false,
  };
}

export async function resolveTenantContext(): Promise<TenantContext> {
  const user = getCurrentUser();
  const isDemoUser = !user || user.id === 'coach-demo';
  const envContext = getEnvContext(isDemoUser ? null : user.id);

  if (envContext) return envContext;
  if (isDemoUser) return getTenantContext();

  const cached = readCachedContext(user.id);
  if (cached) return cached;

  if (!isSupabaseReady()) return getTenantContext();

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('coaches')
    .select('id, tenant_id, user_id, active')
    .eq('user_id', user.id)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Nao foi possivel resolver coach/tenant: ${error.message}`);
  }

  if (data && typeof data.id === 'string' && typeof data.tenant_id === 'string') {
    const context: TenantContext = {
      tenant_id: data.tenant_id,
      coach_id: data.id,
      user_id: user.id,
      source: 'auth',
      isCloudResolved: true,
    };

    cacheTenantContext(context);
    return context;
  }

  return {
    ...getTenantContext(),
    warning: 'Coach cloud nao encontrado. Crie a linha em coaches ou configure VITE_DG_TENANT_ID/VITE_DG_COACH_ID antes de sincronizar.',
  };
}

export async function requireTenantContext(): Promise<TenantContext> {
  const context = await resolveTenantContext();
  const user = getCurrentUser();
  const isRealUser = Boolean(user && user.id !== 'coach-demo');

  if (isRealUser && isSupabaseReady() && context.source !== 'env' && !context.isCloudResolved) {
    throw new Error(context.warning || 'Contexto tenant/coach nao resolvido para usuario autenticado.');
  }

  return context;
}
