import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, Languages, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Lista kategorii tłumaczeń
 *
 * Wyświetla wszystkie kategorie tłumaczeń z liczbą kluczy w każdej
 */
const TranslationsList = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  // Pobierz statystyki kategorii
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['translation-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('category');

      if (error) throw error;

      // Zlicz klucze w każdej kategorii
      const categoryCounts = data.reduce((acc: Record<string, number>, row) => {
        acc[row.category] = (acc[row.category] || 0) + 1;
        return acc;
      }, {});

      // Mapowanie nazw kategorii do czytelnych nazw
      const categoryNames: Record<string, string> = {
        hero: 'Hero (Główny baner)',
        services: 'Usługi',
        about: 'O nas',
        team: 'Zespół',
        realizations: 'Realizacje',
        contact: 'Kontakt',
        header: 'Nawigacja',
        footer: 'Stopka',
        meta: 'Meta tagi',
        pages: 'Podstrony',
      };

      return Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        name: categoryNames[category] || category,
        count,
      }));
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl">Panel Administracyjny</h1>
            <p className="text-sm text-muted-foreground">WM Tyres</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/admin/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span>/</span>
            <span className="text-foreground">Tłumaczenia</span>
          </nav>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Languages className="w-8 h-8 text-primary" />
            <h2 className="font-display text-3xl">Tłumaczenia</h2>
          </div>
          <p className="text-muted-foreground">
            Zarządzaj tekstami strony w trzech językach: polski, angielski, niemiecki
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              Wystąpił błąd podczas ładowania kategorii: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && categories && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Card key={cat.category} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{cat.name}</CardTitle>
                  <CardDescription>
                    {cat.count} {cat.count === 1 ? 'klucz' : cat.count < 5 ? 'klucze' : 'kluczy'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/admin/translations/${cat.category}`)}
                  >
                    Edytuj
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && categories && categories.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Languages className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Brak kategorii tłumaczeń</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default TranslationsList;
