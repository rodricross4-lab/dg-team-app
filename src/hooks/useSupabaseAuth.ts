import { useEffect, useState } from 'react';
import { getSupabaseSession, getSupabaseUser } from '../services/supabaseAuthService';

export function useSupabaseAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      try {
        const session = await getSupabaseSession();
        const currentUser = await getSupabaseUser();

        if (!mounted) return;

        setAuthenticated(Boolean(session));
        setUser(currentUser || null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    loading,
    authenticated,
    user
  };
}
