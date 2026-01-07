import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Komponent ochrony tras dla panelu administracyjnego
 *
 * Sprawdza czy użytkownik jest zalogowany I czy ma uprawnienia administratora.
 * Jeśli nie - przekierowuje do /admin/login
 * Jeśli tak - renderuje dzieci (chronioną treść)
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated OR not an admin
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  // Pokaż loading podczas sprawdzania sesji i uprawnień
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Weryfikacja uprawnień...</p>
        </div>
      </div>
    );
  }

  // Jeśli nie zalogowany lub nie admin, nie renderuj nic (redirect się wykona)
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  // Użytkownik zalogowany i jest adminem - renderuj chronioną zawartość
  return <>{children}</>;
};
