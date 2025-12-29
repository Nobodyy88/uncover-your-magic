import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, Save, ArrowLeft, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPageById } from '@/lib/pageStructure';
import type { Database } from '@/integrations/supabase/types';

type TranslationRecord = Database['public']['Tables']['translations']['Row'];

/**
 * Edytor tekstów strony - Wariant A
 *
 * Prosty edytor z Input/Textarea pogrupowany po sekcjach
 * Tabs dla języków (PL/EN/DE)
 * Batch update wszystkich zmian
 */
const PageEditor = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pl' | 'en' | 'de'>('pl');

  const pageConfig = pageId ? getPageById(pageId) : null;

  // Stan formularza - struktura: { key: { pl: '', en: '', de: '' } }
  const [formData, setFormData] = useState<Record<string, { pl: string; en: string; de: string }>>({});

  const handleSignOut = async () => {
    await signOut();
  };

  // Pobierz tłumaczenia dla tej strony
  const { data: translations, isLoading, error } = useQuery({
    queryKey: ['page-translations', pageId],
    queryFn: async () => {
      if (!pageConfig) throw new Error('Nieprawidłowe ID strony');

      const keys = pageConfig.sections.flatMap(section => section.keys);

      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .in('key', keys)
        .order('key');

      if (error) throw error;

      return data as TranslationRecord[];
    },
    enabled: !!pageConfig,
  });

  // Zaktualizuj formularz gdy dane się załadują
  useEffect(() => {
    if (translations && translations.length > 0) {
      const formDataMap: Record<string, { pl: string; en: string; de: string }> = {};

      translations.forEach((record) => {
        formDataMap[record.key] = {
          pl: record.value_pl || '',
          en: record.value_en || '',
          de: record.value_de || '',
        };
      });

      setFormData(formDataMap);
    } else if (pageConfig) {
      // Jeśli brak danych, zainicjuj puste pola
      const formDataMap: Record<string, { pl: string; en: string; de: string }> = {};
      const keys = pageConfig.sections.flatMap(section => section.keys);
      keys.forEach(key => {
        formDataMap[key] = { pl: '', en: '', de: '' };
      });
      setFormData(formDataMap);
    }
  }, [translations, pageConfig]);

  // Mutation do zapisu
  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, { pl: string; en: string; de: string }>) => {
      if (!pageConfig) throw new Error('Nieprawidłowe ID strony');

      // Batch update wszystkich tłumaczeń
      const updates = Object.entries(data).map(([key, values]) => ({
        key,
        category: key.split('.')[0], // pierwsza część klucza jako kategoria
        value_pl: values.pl || null,
        value_en: values.en || null,
        value_de: values.de || null,
        updated_at: new Date().toISOString(),
      }));

      // Upsert wszystkich rekordów
      const { error } = await supabase
        .from('translations')
        .upsert(updates, {
          onConflict: 'key',
          ignoreDuplicates: false,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-translations', pageId] });
      toast({
        title: 'Zapisano',
        description: 'Wszystkie zmiany zostały zapisane w bazie danych',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handlePreview = () => {
    if (pageConfig) {
      window.open(`#${pageConfig.previewUrl}`, '_blank');
    }
  };

  const handleClearCache = () => {
    try {
      localStorage.removeItem('translations_cache_pl');
      localStorage.removeItem('translations_cache_en');
      localStorage.removeItem('translations_cache_de');

      toast({
        title: 'Cache wyczyszczony!',
        description: 'Odśwież stronę podglądu (F5) aby zobaczyć zmiany.',
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

  const updateField = (key: string, lang: 'pl' | 'en' | 'de', value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value,
      },
    }));
  };

  // Funkcja do formatowania nazwy klucza
  const formatKeyLabel = (key: string): string => {
    // Usuń prefix do ostatniej kropki lub nawiasu kwadratowego
    const parts = key.split(/[.[\]]/);
    const lastPart = parts[parts.length - 1];

    // Kapitalizuj i zamień podkreślenia na spacje
    return lastPart
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Określ czy pole powinno być Textarea
  const shouldUseTextarea = (key: string, value: string): boolean => {
    // Użyj textarea dla:
    // - kluczy zawierających 'description', 'content', 'message', 'paragraph'
    // - wartości dłuższych niż 100 znaków
    // - wartości wieloliniowych
    const keyLower = key.toLowerCase();
    const isLongField = keyLower.includes('description') ||
                       keyLower.includes('content') ||
                       keyLower.includes('message') ||
                       keyLower.includes('paragraph');

    return isLongField || value.length > 100 || value.includes('\n');
  };

  if (!pageConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Nieprawidłowe ID strony. Wróć do dashboardu.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl">Panel Administracyjny</h1>
            <p className="text-sm text-muted-foreground">WM Tyres</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Podgląd
            </Button>
            <Button
              variant="outline"
              onClick={handleClearCache}
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Wyczyść cache
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Zapisywanie...' : 'Zapisz'}
            </Button>
            <div className="text-right ml-4">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} size="sm">
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
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do dashboardu
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-3xl mb-2">{pageConfig.title}</h2>
          <p className="text-muted-foreground">
            Edytuj teksty w trzech językach (PL/EN/DE)
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              Wystąpił błąd: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Editor */}
        {!isLoading && !error && (
          <Card>
            <CardHeader>
              <CardTitle>Edycja tekstów</CardTitle>
              <CardDescription>
                Wybierz język i edytuj pola. Kliknij "Zapisz" aby zatwierdzić wszystkie zmiany.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pl' | 'en' | 'de')}>
                <TabsList className="mb-6">
                  <TabsTrigger value="pl">Polski</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="de">Deutsch</TabsTrigger>
                </TabsList>

                {(['pl', 'en', 'de'] as const).map(lang => (
                  <TabsContent key={lang} value={lang}>
                    {pageConfig.sections.map((section) => (
                      <div key={section.name} className="mb-8">
                        {/* Sekcja Header */}
                        <div className="mb-4 pb-2 border-b">
                          <h3 className="font-display text-xl text-primary">{section.name}</h3>
                        </div>

                        {/* Pola sekcji */}
                        <div className="space-y-4">
                          {section.keys.map((key) => {
                            const value = formData[key]?.[lang] || '';
                            const useTextarea = shouldUseTextarea(key, value);
                            const label = formatKeyLabel(key);

                            return (
                              <div key={key} className="space-y-2">
                                <Label htmlFor={`${key}-${lang}`} className="text-sm font-medium">
                                  {label}
                                  <span className="text-xs text-muted-foreground ml-2">({key})</span>
                                </Label>
                                {useTextarea ? (
                                  <Textarea
                                    id={`${key}-${lang}`}
                                    value={value}
                                    onChange={(e) => updateField(key, lang, e.target.value)}
                                    placeholder={`Wprowadź ${label.toLowerCase()}...`}
                                    disabled={saveMutation.isPending}
                                    rows={4}
                                    className="text-sm"
                                  />
                                ) : (
                                  <Input
                                    id={`${key}-${lang}`}
                                    value={value}
                                    onChange={(e) => updateField(key, lang, e.target.value)}
                                    placeholder={`Wprowadź ${label.toLowerCase()}...`}
                                    disabled={saveMutation.isPending}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Wskazówki</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>Zapisz:</strong> Zapisuje wszystkie zmiany we wszystkich językach jednocześnie.
            </p>
            <p>
              <strong>Podgląd:</strong> Otwiera stronę w nowej karcie. Aby zobaczyć zmiany, zapisz i wyczyść cache.
            </p>
            <p>
              <strong>Wyczyść cache:</strong> Usuwa cache tłumaczeń. Użyj po zapisaniu, aby zobaczyć zmiany na stronie.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PageEditor;
