import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook do zarządzania autentykacją użytkownika
 *
 * Sprawdza sesję Supabase i nasłuchuje zmian stanu autentykacji.
 * Weryfikuje również czy użytkownik ma uprawnienia administratora.
 * Używany w ProtectedRoute do ochrony tras panelu admina.
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = useCallback(async (userId: string) => {
    try {
      // Query the admin_users table to verify admin privileges
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // Sprawdź bieżącą sesję
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        const adminStatus = await checkAdminStatus(session.user.id);
        if (isMounted) {
          setIsAdmin(adminStatus);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    };

    initAuth();

    // Nasłuchuj zmian stanu autentykacji
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        const adminStatus = await checkAdminStatus(session.user.id);
        if (isMounted) {
          setIsAdmin(adminStatus);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    signOut
  };
};
