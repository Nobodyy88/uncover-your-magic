import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Settings, FileText, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard panelu administracyjnego
 *
 * Główna strona po zalogowaniu - przegląd statystyk i szybki dostęp do funkcji
 */
const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
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
          <h2 className="font-display text-3xl mb-2">Witaj w panelu admina! 👋</h2>
          <p className="text-muted-foreground">
            Panel administracyjny do zarządzania treścią strony WM Tyres
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/admin/translations')}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Languages className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Tłumaczenia</CardTitle>
              <CardDescription>Edytuj teksty strony (PL, EN, DE)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">157 kluczy tłumaczeń</p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/admin/pages')}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Podstrony</CardTitle>
              <CardDescription>Wypełnij treści pustych podstron</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">4 podstrony do edycji</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Ustawienia</CardTitle>
              <CardDescription>Zmień hasło i ustawienia konta</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Wkrótce</p>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">🚧 Panel w budowie</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Panel administracyjny jest obecnie w fazie implementacji. Wkrótce dostępne będą pełne funkcje edycji treści.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>Autentykacja i logowanie</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>Baza danych i migracja tłumaczeń</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">🔄</span>
                <span>Edytor tłumaczeń (w budowie)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">🔄</span>
                <span>Edytor podstron (w budowie)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
