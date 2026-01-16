import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail } from 'lucide-react';

/**
 * Strona logowania do panelu administracyjnego
 *
 * Używa Supabase Auth (email + hasło)
 * Po sukcesie przekierowuje do /admin/dashboard
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: 'Zalogowano pomyślnie',
          description: `Witaj ${email}!`,
        });
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Błąd logowania:', error);
      toast({
        title: 'Błąd logowania',
        description: (error as Error).message || 'Nieprawidłowy email lub hasło',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: 'Podaj email',
        description: 'Wpisz adres email, na który wyślemy link do resetowania hasła.',
        variant: 'destructive',
      });
      return;
    }

    setIsResetting(true);

    try {
      const redirectUrl = `${window.location.origin}/admin/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      toast({
        title: 'Email wysłany',
        description: 'Sprawdź swoją skrzynkę pocztową. Link do resetowania hasła został wysłany.',
      });
    } catch (error) {
      console.error('Błąd resetowania hasła:', error);
      toast({
        title: 'Błąd',
        description: (error as Error).message || 'Nie udało się wysłać emaila z linkiem.',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(25,95%,53%,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(35,100%,50%,0.1),transparent_50%)]" />

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display">Panel Administracyjny</CardTitle>
          <CardDescription>
            Zaloguj się aby zarządzać treścią strony WM Tyres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@wmtyres.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="hero"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isResetting}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              {isResetting ? 'Wysyłanie...' : 'Zapomniałeś hasła?'}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Dostęp tylko dla administratorów</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
