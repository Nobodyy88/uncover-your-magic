import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TranslationField } from '@/components/admin/TranslationField';
import { ArrayEditor } from '@/components/admin/ArrayEditor';
import { LogOut, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Translation = Tables<'translations'>;

/**
 * Edytor tłumaczeń dla kategorii
 *
 * Umożliwia edycję wszystkich tekstów w danej kategorii dla trzech języków
 */
const TranslationEditor = () => {
  const { category } = useParams<{ category: string }>();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pl' | 'en' | 'de'>('pl');
  const [editedTranslations, setEditedTranslations] = useState<Record<string, Translation>>({});

  const handleSignOut = async () => {
    await signOut();
  };

  // Pobierz tłumaczenia dla kategorii
  const { data: translations, isLoading, error } = useQuery({
    queryKey: ['translations', category],
    queryFn: async () => {
      if (!category) throw new Error('Brak kategorii');

      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('category', category)
        .order('key');

      if (error) throw error;

      // Inicjalizuj stan edycji
      const initialState = data.reduce((acc, translation) => {
        acc[translation.id] = translation;
        return acc;
      }, {} as Record<string, Translation>);
      setEditedTranslations(initialState);

      return data;
    },
    enabled: !!category,
  });

  // Mutation do zapisu zmian
  const updateMutation = useMutation({
    mutationFn: async (updates: Translation[]) => {
      const promises = updates.map(translation =>
        supabase
          .from('translations')
          .update({
            value_pl: translation.value_pl,
            value_en: translation.value_en,
            value_de: translation.value_de,
            updated_at: new Date().toISOString(),
          })
          .eq('id', translation.id)
      );

      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw new Error(`Błąd podczas zapisu: ${errors[0].error?.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations', category] });
      queryClient.invalidateQueries({ queryKey: ['translation-categories'] });
      toast({
        title: 'Zapisano zmiany',
        description: 'Tłumaczenia zostały zaktualizowane',
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
    const updates = Object.values(editedTranslations);
    updateMutation.mutate(updates);
  };

  const handleUpdateTranslation = (id: string, field: keyof Translation, value: string) => {
    setEditedTranslations(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdateArrayItems = (parentKey: string, items: Translation[]) => {
    const updates = items.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as Record<string, Translation>);

    setEditedTranslations(prev => ({
      ...prev,
      ...updates,
    }));
  };

  // Grupuj tłumaczenia: tablice vs pojedyncze klucze
  const groupedTranslations = translations?.reduce((acc, translation) => {
    if (translation.is_array) {
      const parentKey = translation.parent_key || translation.key;
      if (!acc.arrays[parentKey]) {
        acc.arrays[parentKey] = [];
      }
      acc.arrays[parentKey].push(translation);
    } else {
      acc.simple.push(translation);
    }
    return acc;
  }, { simple: [] as Translation[], arrays: {} as Record<string, Translation[]> });

  // Mapowanie nazw kategorii
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

  const categoryName = category ? categoryNames[category] || category : '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl">Panel Administracyjny</h1>
            <p className="text-sm text-muted-foreground">WM Tyres</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </Button>
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
            <Link to="/admin/translations" className="hover:text-foreground">Tłumaczenia</Link>
            <span>/</span>
            <span className="text-foreground">{categoryName}</span>
          </nav>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/translations')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót
          </Button>
          <div>
            <h2 className="font-display text-3xl">{categoryName}</h2>
            <p className="text-muted-foreground">
              Edytuj teksty w trzech językach
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              Wystąpił błąd podczas ładowania tłumaczeń: {error.message}
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

        {/* Translation Editor */}
        {!isLoading && !error && translations && groupedTranslations && (
          <Card>
            <CardHeader>
              <CardTitle>Edycja tłumaczeń</CardTitle>
              <CardDescription>
                Wybierz język i edytuj odpowiednie pola. Zmiany będą widoczne na stronie po zapisaniu.
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
                  <TabsContent key={lang} value={lang} className="space-y-6">
                    {/* Proste klucze */}
                    {groupedTranslations.simple.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Teksty</h3>
                        {groupedTranslations.simple.map(translation => (
                          <TranslationField
                            key={translation.id}
                            label={translation.key}
                            value={editedTranslations[translation.id]?.[`value_${lang}`] || ''}
                            onChange={(value) =>
                              handleUpdateTranslation(translation.id, `value_${lang}`, value)
                            }
                            disabled={updateMutation.isPending}
                          />
                        ))}
                      </div>
                    )}

                    {/* Tablice */}
                    {Object.keys(groupedTranslations.arrays).length > 0 && (
                      <div className="space-y-6">
                        <h3 className="font-semibold text-lg border-b pb-2">Tablice</h3>
                        {Object.entries(groupedTranslations.arrays).map(([parentKey, items]) => (
                          <Card key={parentKey} className="bg-muted/50">
                            <CardHeader>
                              <CardTitle className="text-base">{parentKey}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ArrayEditor
                                items={items.map(item => editedTranslations[item.id])}
                                onChange={(updated) => handleUpdateArrayItems(parentKey, updated)}
                                language={lang}
                                disabled={updateMutation.isPending}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default TranslationEditor;
