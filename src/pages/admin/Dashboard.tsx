import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Download, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllPages } from '@/lib/pageStructure';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { buildTranslationsObject } from '@/lib/translations';
import { useState } from 'react';

/**
 * Dashboard panelu administracyjnego - Wariant A
 *
 * Uproszczona wersja z bezpośrednim dostępem do edycji stron
 */
const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const pages = getAllPages();

  const handleSignOut = async () => {
    await signOut();
  };

  /**
   * Eksportuj wszystkie tłumaczenia do plików TypeScript
   */
  const handleExportToFiles = async () => {
    setIsExporting(true);
    try {
      // Pobierz wszystkie tłumaczenia z Supabase
      const { data: records, error } = await supabase
        .from('translations')
        .select('*')
        .order('key');

      if (error) throw error;

      if (!records || records.length === 0) {
        toast({
          title: 'Brak danych',
          description: 'Nie znaleziono tłumaczeń w bazie danych.',
          variant: 'destructive',
        });
        return;
      }

      // Zbuduj obiekty tłumaczeń dla każdego języka
      const plTranslations = buildTranslationsObject(records, 'pl');
      const enTranslations = buildTranslationsObject(records, 'en');
      const deTranslations = buildTranslationsObject(records, 'de');

      // Funkcja do generowania kodu TypeScript
      const generateTsFile = (lang: string, translations: unknown) => {
        const importLine = lang === 'pl'
          ? ''
          : `import type { Translations } from "./pl";\n\n`;

        const exportLine = lang === 'pl'
          ? `export const ${lang} = `
          : `export const ${lang}: Translations = `;

        return `${importLine}${exportLine}${JSON.stringify(translations, null, 2)};\n${lang === 'pl' ? '\nexport type Translations = typeof pl;\n' : ''}`;
      };

      // Generuj pliki
      const plFile = generateTsFile('pl', plTranslations);
      const enFile = generateTsFile('en', enTranslations);
      const deFile = generateTsFile('de', deTranslations);

      // Pobierz pliki
      downloadFile('pl.ts', plFile);
      downloadFile('en.ts', enFile);
      downloadFile('de.ts', deFile);

      toast({
        title: 'Eksport zakończony!',
        description: 'Pobrano 3 pliki: pl.ts, en.ts, de.ts. Skopiuj je do folderu src/locales/ aby zsynchronizować z kodem.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Błąd eksportu',
        description: 'Nie udało się wyeksportować tłumaczeń.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Pomocnicza funkcja do pobierania pliku
   */
  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Wyczyść cache tłumaczeń w localStorage
   */
  const handleClearCache = () => {
    try {
      localStorage.removeItem('translations_cache_pl');
      localStorage.removeItem('translations_cache_en');
      localStorage.removeItem('translations_cache_de');

      toast({
        title: 'Cache wyczyszczony!',
        description: 'Odśwież stronę (F5) aby zobaczyć najnowsze zmiany z bazy danych.',
      });
    } catch (error) {
      console.error('Clear cache error:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się wyczyścić cache.',
        variant: 'destructive',
      });
    }
  };

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
        <div className="mb-8">
          <h2 className="font-display text-3xl mb-2">Edycja stron</h2>
          <p className="text-muted-foreground">
            Wybierz stronę do edycji tekstów w trzech językach (PL/EN/DE)
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={handleExportToFiles}
            disabled={isExporting}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Eksportowanie...' : 'Eksportuj do plików'}
          </Button>
          <Button
            onClick={handleClearCache}
            variant="outline"
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Wyczyść cache
          </Button>
        </div>

        {/* Pages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <Card
                key={page.id}
                className="hover:shadow-lg transition-all hover:border-primary/50"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{page.title}</CardTitle>
                  <CardDescription>
                    {page.sections.length} {page.sections.length === 1 ? 'sekcja' : 'sekcje'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/admin/page/${page.id}`)}
                    className="flex-1"
                  >
                    Edytuj
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(`#${page.previewUrl}`, '_blank')}
                    title="Podgląd"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Box */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Informacje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium mb-1">Eksport do plików</p>
                <p className="text-muted-foreground">
                  Pobiera aktualne tłumaczenia z bazy danych jako pliki TypeScript (.ts).
                  Użyj tego do synchronizacji zmian z kodem źródłowym przez Claude Code.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Wyczyść cache</p>
                <p className="text-muted-foreground">
                  Usuwa cache tłumaczeń z localStorage przeglądarki.
                  Użyj po zapisaniu zmian, aby zobaczyć je od razu na stronie.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Podgląd</p>
                <p className="text-muted-foreground">
                  Przycisk z ikoną otwiera stronę w nowej karcie.
                  Po zapisaniu zmian wyczyść cache i odśwież podgląd.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
