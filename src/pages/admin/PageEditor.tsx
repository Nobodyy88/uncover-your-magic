import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, Save, ArrowLeft, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type PageContent = Tables<'page_contents'>;

/**
 * Edytor treści podstron
 *
 * Umożliwia edycję tytułu, podtytułu i treści w trzech językach oraz publikację
 */
const PageEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pl' | 'en' | 'de'>('pl');

  // Stan formularza
  const [formData, setFormData] = useState<Partial<PageContent>>({
    title_pl: '',
    title_en: '',
    title_de: '',
    subtitle_pl: '',
    subtitle_en: '',
    subtitle_de: '',
    content_pl: null,
    content_en: null,
    content_de: null,
    is_published: false,
  });

  const handleSignOut = async () => {
    await signOut();
  };

  // Mapowanie slugów na nazwy
  const pageNames: Record<string, string> = {
    rims: 'Felgi',
    regeneration: 'Regeneracja',
    repairs: 'Naprawy',
    mounting: 'Montaż',
  };

  const pageName = slug ? pageNames[slug] || slug : '';

  // Pobierz treść podstrony
  const { data: pageContent, isLoading, error } = useQuery({
    queryKey: ['page-content', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Brak slug');

      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page_slug', slug)
        .maybeSingle();

      if (error) throw error;

      // Jeśli strona nie istnieje, zwróć null (zostanie utworzona przy zapisie)
      return data;
    },
    enabled: !!slug,
  });

  // Zaktualizuj formularz gdy dane się załadują
  useEffect(() => {
    if (pageContent) {
      setFormData({
        title_pl: pageContent.title_pl || '',
        title_en: pageContent.title_en || '',
        title_de: pageContent.title_de || '',
        subtitle_pl: pageContent.subtitle_pl || '',
        subtitle_en: pageContent.subtitle_en || '',
        subtitle_de: pageContent.subtitle_de || '',
        content_pl: pageContent.content_pl,
        content_en: pageContent.content_en,
        content_de: pageContent.content_de,
        is_published: pageContent.is_published || false,
      });
    }
  }, [pageContent]);

  // Mutation do zapisu
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<PageContent>) => {
      if (!slug) throw new Error('Brak slug');

      // Walidacja JSON dla content
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validateJSON = (value: any, lang: string) => {
        if (!value) return null;
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch {
            throw new Error(`Nieprawidłowy JSON dla content_${lang}`);
          }
        }
        return value;
      };

      const contentData = {
        page_slug: slug,
        title_pl: data.title_pl || null,
        title_en: data.title_en || null,
        title_de: data.title_de || null,
        subtitle_pl: data.subtitle_pl || null,
        subtitle_en: data.subtitle_en || null,
        subtitle_de: data.subtitle_de || null,
        content_pl: validateJSON(data.content_pl, 'pl'),
        content_en: validateJSON(data.content_en, 'en'),
        content_de: validateJSON(data.content_de, 'de'),
        is_published: data.is_published || false,
        updated_at: new Date().toISOString(),
      };

      if (pageContent) {
        // Update istniejącego
        const { error } = await supabase
          .from('page_contents')
          .update(contentData)
          .eq('id', pageContent.id);

        if (error) throw error;
      } else {
        // Insert nowego
        const { error } = await supabase
          .from('page_contents')
          .insert(contentData);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content', slug] });
      queryClient.invalidateQueries({ queryKey: ['page-contents-list'] });
      toast({
        title: 'Zapisano',
        description: 'Treść strony została zaktualizowana',
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
    // Mapowanie slugów na URL-e
    const urlMap: Record<string, string> = {
      rims: '/produkty/felgi',
      regeneration: '/produkty/regeneracja',
      repairs: '/serwis/naprawy',
      mounting: '/serwis/montaz',
    };

    const url = slug ? urlMap[slug] : null;
    if (url) {
      window.open(`#${url}`, '_blank');
    }
  };

  const updateField = (field: keyof PageContent, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
              variant="outline"
              onClick={handlePreview}
            >
              <Eye className="w-4 h-4 mr-2" />
              Podgląd
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Zapisywanie...' : 'Zapisz'}
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
            <Link to="/admin/pages" className="hover:text-foreground">Podstrony</Link>
            <span>/</span>
            <span className="text-foreground">{pageName}</span>
          </nav>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin/pages')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót
            </Button>
            <div>
              <h2 className="font-display text-3xl">{pageName}</h2>
              <p className="text-muted-foreground">
                Edytuj treść podstrony w trzech językach
              </p>
            </div>
          </div>

          {/* Publikacja */}
          <div className="flex items-center gap-3">
            <Label htmlFor="publish">Opublikowana</Label>
            <Switch
              id="publish"
              checked={formData.is_published || false}
              onCheckedChange={(checked) => updateField('is_published', checked)}
            />
          </div>
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
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Editor */}
        {!isLoading && !error && (
          <Card>
            <CardHeader>
              <CardTitle>Edycja treści</CardTitle>
              <CardDescription>
                Wypełnij pola dla każdego języka. Pole "Treść" akceptuje JSON z sekcjami strony.
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
                    {/* Tytuł */}
                    <div className="space-y-2">
                      <Label htmlFor={`title-${lang}`}>Tytuł</Label>
                      <Input
                        id={`title-${lang}`}
                        value={formData[`title_${lang}`] || ''}
                        onChange={(e) => updateField(`title_${lang}`, e.target.value)}
                        placeholder="Wprowadź tytuł strony..."
                        disabled={saveMutation.isPending}
                      />
                    </div>

                    {/* Podtytuł */}
                    <div className="space-y-2">
                      <Label htmlFor={`subtitle-${lang}`}>Podtytuł</Label>
                      <Input
                        id={`subtitle-${lang}`}
                        value={formData[`subtitle_${lang}`] || ''}
                        onChange={(e) => updateField(`subtitle_${lang}`, e.target.value)}
                        placeholder="Wprowadź podtytuł..."
                        disabled={saveMutation.isPending}
                      />
                    </div>

                    {/* Treść (JSON) */}
                    <div className="space-y-2">
                      <Label htmlFor={`content-${lang}`}>Treść (JSON)</Label>
                      <Textarea
                        id={`content-${lang}`}
                        value={
                          formData[`content_${lang}`]
                            ? typeof formData[`content_${lang}`] === 'string'
                              ? formData[`content_${lang}`] as string
                              : JSON.stringify(formData[`content_${lang}`], null, 2)
                            : ''
                        }
                        onChange={(e) => updateField(`content_${lang}`, e.target.value)}
                        placeholder={`{\n  "sections": [\n    {\n      "type": "hero",\n      "title": "Tytuł sekcji",\n      "description": "Opis..."\n    }\n  ]\n}`}
                        disabled={saveMutation.isPending}
                        rows={15}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Wprowadź strukturę JSON z sekcjami strony. Format: {`{"sections": [...]}`}
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Pomoc */}
        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Pomoc - struktura JSON</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>Przykładowa struktura treści:</p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto">
{`{
  "sections": [
    {
      "type": "hero",
      "title": "Tytuł sekcji hero",
      "description": "Opis sekcji",
      "image": "/images/hero.jpg"
    },
    {
      "type": "features",
      "items": [
        {
          "title": "Cecha 1",
          "description": "Opis cechy"
        }
      ]
    },
    {
      "type": "text",
      "content": "<p>Długi tekst...</p>"
    }
  ]
}`}
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PageEditor;
