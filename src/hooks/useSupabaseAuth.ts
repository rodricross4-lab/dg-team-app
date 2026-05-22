import { useEffect, useState } from 'react';
import { getSupabaseSession, getSupabaseUser } from '../services/supabaseAuthService';
import { setCurrentUser, type AuthUser } from '../services/authService';

export function useSupabaseAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      try {
        const session = await getSupabaseSession();
        const currentUser = await getSupabaseUser();

        if (!mounted) return;

        if (session && currentUser) {
          const mappedUser: AuthUser = {
            id: currentUser.id,
            name: currentUser.email || 'Coach DG TEAM',
            email: currentUser.email || '',
            role: 'coach'
          };

          setCurrentUser(mappedUser);
          setAuthenticated(true);
          setUser(mappedUser);
          return;
        }

        setAuthenticated(false);
        setUser(null);
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
