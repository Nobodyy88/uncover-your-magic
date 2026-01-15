import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * Strona resetowania hasła dla panelu administratora
 * 
 * Obsługuje link recovery z Supabase Auth:
 * - Odczytuje access_token, refresh_token i type z hash URL
 * - Ustawia sesję Supabase
 * - Pozwala użytkownikowi ustawić nowe hasło
 */
export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidRecovery, setIsValidRecovery] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleRecoveryToken = async () => {
      // Parsuj tokeny z URL - obsługa hash-routera
      // URL ma postać: https://domain/#/admin/reset-password#access_token=...&refresh_token=...&type=recovery
      // Używamy window.location.href i dzielimy po # żeby wziąć ostatni fragment
      const fullUrl = window.location.href;
      const hashParts = fullUrl.split('#');
      
      // Weź ostatni element tablicy - to są tokeny
      const tokenPart = hashParts.length > 1 ? hashParts[hashParts.length - 1] : '';
      
      const params = new URLSearchParams(tokenPart);
      
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');

      // Sprawdź czy to jest link recovery
      if (type !== 'recovery') {
        setIsValidRecovery(false);
        setError('Nieprawidłowy link resetowania hasła. Upewnij się, że używasz prawidłowego linku z emaila.');
        return;
      }

      if (!accessToken || !refreshToken) {
        setIsValidRecovery(false);
        setError('Brak wymaganych tokenów w linku. Spróbuj ponownie zresetować hasło.');
        return;
      }

      try {
        // Ustaw sesję Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          setIsValidRecovery(false);
          setError('Link resetowania hasła wygasł lub jest nieprawidłowy. Spróbuj ponownie zresetować hasło.');
          return;
        }

        setIsValidRecovery(true);
      } catch (err) {
        setIsValidRecovery(false);
        setError('Wystąpił błąd podczas weryfikacji linku. Spróbuj ponownie.');
      }
    };

    handleRecoveryToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja haseł
    if (password.length < 6) {
      toast({
        title: 'Błąd walidacji',
        description: 'Hasło musi mieć co najmniej 6 znaków.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Błąd walidacji',
        description: 'Hasła nie są zgodne.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        toast({
          title: 'Błąd',
          description: updateError.message || 'Nie udało się zmienić hasła.',
          variant: 'destructive',
        });
        return;
      }

      setSuccess(true);
      toast({
        title: 'Sukces',
        description: 'Hasło zostało zmienione. Za chwilę zostaniesz przekierowany.',
      });

      // Wyloguj po zmianie hasła i przekieruj do logowania
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate('/admin/login', { replace: true });
      }, 2000);
    } catch (err) {
      toast({
        title: 'Błąd',
        description: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Stan ładowania - sprawdzanie tokenu
  if (isValidRecovery === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
              <p className="text-muted-foreground">Weryfikacja linku...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Błąd - nieprawidłowy link
  if (!isValidRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Błąd resetowania hasła</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nieprawidłowy link</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => navigate('/admin/login')}
            >
              Powrót do logowania
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sukces - hasło zmienione
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-primary">Hasło zmienione</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Sukces!</AlertTitle>
              <AlertDescription>
                Twoje hasło zostało zmienione. Za chwilę zostaniesz przekierowany do strony logowania.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formularz zmiany hasła
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Ustaw nowe hasło</CardTitle>
          <CardDescription>
            Wprowadź nowe hasło do swojego konta administratora.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nowe hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 znaków"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Powtórz nowe hasło</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Powtórz hasło"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-destructive">Hasła nie są zgodne</p>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
            >
              {isLoading ? 'Zmieniam hasło...' : 'Zmień hasło'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
