import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, FileText, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Lista podstron do edycji
 *
 * Wyświetla 4 puste podstrony z możliwością edycji i publikacji
 */
const PagesList = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  // Definicja podstron
  const pages = [
    { slug: 'rims', name: 'Felgi', description: 'Strona produktu - Felgi' },
    { slug: 'regeneration', name: 'Regeneracja', description: 'Strona produktu - Regeneracja opon' },
    { slug: 'repairs', name: 'Naprawy', description: 'Strona serwisu - Naprawy' },
    { slug: 'mounting', name: 'Montaż', description: 'Strona serwisu - Montaż opon' },
  ];

  // Pobierz status publikacji podstron
  const { data: pageContents, isLoading, error } = useQuery({
    queryKey: ['page-contents-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('page_slug, is_published, title_pl, updated_at');

      if (error) throw error;

      // Mapuj do słownika dla łatwego dostępu
      return data.reduce((acc, page) => {
        acc[page.page_slug] = page;
        return acc;
      }, {} as Record<string, { page_slug: string; is_published: boolean | null; title_pl: string | null; updated_at: string | null }>);
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
            <span className="text-foreground">Podstrony</span>
          </nav>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary" />
            <h2 className="font-display text-3xl">Podstrony</h2>
          </div>
          <p className="text-muted-foreground">
            Edytuj treści pustych podstron produktów i serwisu
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              Wystąpił błąd podczas ładowania podstron: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
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

        {/* Pages Grid */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 gap-6">
            {pages.map((page) => {
              const content = pageContents?.[page.slug];
              const isPublished = content?.is_published || false;
              const hasContent = content?.title_pl;
              const lastUpdated = content?.updated_at
                ? new Date(content.updated_at).toLocaleDateString('pl-PL')
                : null;

              return (
                <Card key={page.slug} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{page.name}</CardTitle>
                        <CardDescription>{page.description}</CardDescription>
                      </div>
                      <Badge variant={isPublished ? 'default' : 'secondary'}>
                        {isPublished ? 'Opublikowana' : 'Draft'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {hasContent && lastUpdated && (
                      <p className="text-sm text-muted-foreground">
                        Ostatnia edycja: {lastUpdated}
                      </p>
                    )}
                    {!hasContent && (
                      <p className="text-sm text-muted-foreground italic">
                        Brak treści - strona wymaga wypełnienia
                      </p>
                    )}
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/admin/pages/${page.slug}`)}
                    >
                      {hasContent ? 'Edytuj' : 'Dodaj treść'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PagesList;
