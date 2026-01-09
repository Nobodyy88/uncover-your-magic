# CLAUDE.md

Ten plik zawiera wskazówki dla Claude Code (claude.ai/code) podczas pracy z kodem w tym repozytorium.

## Zasady komunikacji

- Odpowiadaj zawsze w języku polskim
- Przed każdą zmianą przeczytaj pliki, które zamierzasz edytować
- Nie dodawaj funkcjonalności, których użytkownik nie poprosił

## Środowisko pracy

- Zmiany wprowadzane są na serwerze lokalnym z podpiętą domeną
- Użytkownik ma stały podgląd strony w przeglądarce
- Nie trzeba uruchamiać `npm run dev` - wystarczy `npm run build` po zmianach
- Ruch na serwer jest kierowany przez Cloudflare (stąd nginx w błędach 404)
- Używamy HashRouter zamiast BrowserRouter (bez konfiguracji serwera)

## Wielojęzyczność

- Wszystkie zmiany tekstów wprowadzaj do każdej wersji językowej:
  - Polskiej (`src/locales/pl.ts`)
  - Angielskiej (`src/locales/en.ts`)
  - Niemieckiej (`src/locales/de.ts`)

### Migracja tłumaczeń do Supabase

**KRYTYCZNE: Po każdej zmianie w plikach tłumaczeń ZAWSZE uruchom:**

```bash
npm run migrate:translations
```

**Kiedy uruchamiać migrację:**
- ✅ Po dodaniu nowych kluczy do `src/locales/*.ts`
- ✅ Po wypełnieniu treścią pustych podstron (Naprawy, Felgi, Regeneracja, Montaż)
- ✅ Po dodaniu nowych sekcji do istniejących stron
- ✅ Po zmianach strukturalnych w tłumaczeniach

**Workflow:**
1. Edytujesz pliki `src/locales/pl.ts`, `en.ts`, `de.ts`
2. Uruchamiasz `npm run migrate:translations`
3. Tłumaczenia trafiają do bazy Supabase
4. Panel administracyjny automatycznie je wykrywa
5. Właściciel może teraz edytować te teksty przez panel

**Ważne:** Bez migracji zmiany będą widoczne tylko w kodzie, ale NIE w panelu administracyjnym!

## Polecenia budowania

```bash
npm run dev          # Uruchom serwer deweloperski (port 8080)
npm run build        # Build produkcyjny
npm run build:dev    # Build deweloperski
npm run lint         # Sprawdzenie ESLint
npm run preview      # Podgląd buildu produkcyjnego
```

## Architektura

To jest strona landing page w React + TypeScript dla "WM Tyres" (serwis opon do maszyn budowlanych). Zbudowana z Vite, używa komponentów shadcn/ui i Tailwind CSS.

### Aliasy ścieżek
- `@/` mapuje do `src/` (skonfigurowane w vite.config.ts i tsconfig.json)

### Struktura projektu

#### Strony (`src/pages/`)
- `Index.tsx` - Strona główna
- `About.tsx` - O nas
- `PartnerNetwork.tsx` - Sieć partnerów
- `NotFound.tsx` - Strona 404

**Produkty** (`src/pages/products/`):
- `Tires.tsx` - Opony
- `Rims.tsx` - Felgi
- `Regeneration.tsx` - Regeneracja opon
- `RideOn.tsx` - System Ride On

**Serwis** (`src/pages/service/`):
- `Repairs.tsx` - Naprawy
- `Mounting.tsx` - Montaż
- `ServiceContract.tsx` - Umowa serwisowa

**Panel administracyjny** (`src/pages/admin/`):
- `Login.tsx` - Logowanie do panelu (djdrax@gmail.com)
- `Dashboard.tsx` - Dashboard z listą stron do edycji
- `PageEditor.tsx` - Edytor treści dla wybranej strony

#### Komponenty (`src/components/`)
- `Header.tsx` - Nagłówek z nawigacją
- `Hero.tsx` - Sekcja hero na stronie głównej
- `Services.tsx` - Sekcja usług
- `Realizations.tsx` - Realizacje
- `About.tsx` - Sekcja o nas
- `ContactForm.tsx` - Formularz kontaktowy
- `Footer.tsx` - Stopka
- `LanguageSwitcher.tsx` - Przełącznik języków (PL/EN/DE)
- `Partners.tsx` - Sekcja partnerów
- `Brands.tsx` - Sekcja marek
- `NavLink.tsx` - Komponent linku nawigacji
- `ErrorBoundary.tsx` - Obsługa błędów React
- `DynamicPageRenderer.tsx` - Renderer dynamicznych treści z Supabase

**Sekcje stron** (`src/components/page-sections/`):
- `HeroSection.tsx` - Uniwersalna sekcja hero
- `FeaturesSection.tsx` - Sekcja cech/funkcji
- `TextSection.tsx` - Sekcja tekstowa

**Panel administracyjny** (`src/components/admin/`):
- `ProtectedRoute.tsx` - Ochrona tras administracyjnych

**Komponenty UI** (`src/components/ui/`):
- Komponenty bazowe shadcn/ui (button, input, card, dialog, tabs, itp.)

#### Inne kluczowe katalogi
- `src/hooks/` - Własne hooki (use-toast, use-mobile)
- `src/lib/` - Narzędzia i funkcje pomocnicze
  - `utils.ts` - Funkcja `cn()` do łączenia klas Tailwind
  - `pageStructure.ts` - Mapowanie stron do kluczy tłumaczeń (dla panelu admin)
  - `translations.ts` - Funkcje do budowania obiektów tłumaczeń, cache
- `src/integrations/supabase/` - Klient Supabase i automatycznie generowane typy
- `src/contexts/` - Konteksty React
  - `LanguageContext.tsx` - Kontekst języka, pobiera tłumaczenia z Supabase + cache (1h)
- `src/locales/` - Pliki tłumaczeń (statyczne fallbacki)
  - `pl.ts` - Polski (fallback)
  - `en.ts` - Angielski (fallback)
  - `de.ts` - Niemiecki (fallback)
- `scripts/` - Skrypty pomocnicze
  - `migrate-translations.ts` - Migracja tłumaczeń z plików do Supabase

### Kluczowe wzorce
- React Router do routingu (HashRouter, dodawaj trasy w `App.tsx` powyżej catch-all `*`)
- Klient Supabase: `import { supabase } from "@/integrations/supabase/client"`
- Powiadomienia toast przez `sonner` i własny hook `useToast`
- TanStack Query do zarządzania stanem serwera
- Obsługa formularzy: react-hook-form + walidacja zod
- Wielojęzyczność: `useLanguage()` hook z LanguageContext
- SEO: react-helmet dla meta tagów
- Bezpieczeństwo: dompurify do czyszczenia HTML

### System CMS i Panel Administracyjny

**Dostęp do panelu:**
- URL: `/#/admin/login`
- Login: djdrax@gmail.com
- Dashboard: `/#/admin/dashboard`

**Jak działa system treści:**
1. **Pliki statyczne** (`src/locales/*.ts`) - Fallback gdy brak połączenia z Supabase
2. **Baza Supabase** - Źródło prawdy dla treści edytowanych przez panel
3. **Cache localStorage** - 1 godzina cache na kliencie
4. **Panel admin** - Interfejs do edycji treści w 3 językach

**Workflow edycji treści:**

*Opcja A: Przez panel administracyjny (90% przypadków)*
- Dla prostych zmian tekstowych (ceny, opisy, poprawki)
- Zaloguj się → wybierz stronę → edytuj → zapisz
- Zmiany trafiają do bazy Supabase
- Kliknij "Wyczyść cache" aby zobaczyć efekt natychmiast

*Opcja B: Przez kod (10% przypadków)*
- Dla zmian strukturalnych (nowe sekcje, komponenty, layout)
- Edytuj pliki `src/locales/pl.ts`, `en.ts`, `de.ts`
- **KRYTYCZNE:** Uruchom `npm run migrate:translations`
- Migracja zaktualizuje bazę Supabase
- Panel automatycznie wykryje nowe klucze

**Tabele w Supabase:**
- `translations` - Wszystkie tłumaczenia (klucz, język, wartość)
- `page_contents` - Treści dynamiczne podstron (nieużywane obecnie)
- `admin_users` - Lista administratorów

**RLS (Row Level Security):**
- Panel chroniony przez funkcję `is_admin()` w Supabase
- Tylko użytkownicy w tabeli `admin_users` mogą edytować
- Publiczny dostęp do odczytu tłumaczeń

### Routing i nawigacja

Trasy produktów:
- `/produkty/opony` - Opony
- `/produkty/felgi` - Felgi
- `/produkty/regeneracja` - Regeneracja
- `/produkty/ride-on` - System Ride On

Trasy serwisu:
- `/serwis/naprawy` - Naprawy
- `/serwis/montaz` - Montaż
- `/serwis/umowa-serwisowa` - Umowa serwisowa

Trasy administracyjne (chronione):
- `/admin/login` - Logowanie
- `/admin/dashboard` - Dashboard
- `/admin/editor/:pageId` - Edytor konkretnej strony

### Stylowanie
- Tailwind CSS z zmiennymi CSS do motywów (zdefiniowane w `src/index.css`)
- Własne fonty: "Bebas Neue" (display), "Inter" (sans)
- Styl shadcn/ui: "default" z bazowym kolorem slate
- Responsywność: mobile-first approach

### Zmienne środowiskowe
Wymagane w `.env`:
- `VITE_SUPABASE_URL` - URL projektu Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Publiczny klucz API
- `VITE_SUPABASE_ANON_KEY` - Anonimowy klucz (opcjonalny)

### Bezpieczeństwo
- Row Level Security (RLS) w Supabase dla wszystkich operacji zapisu
- dompurify dla czyszczenia HTML z treści CMS
- ProtectedRoute dla tras administracyjnych
- HTTPS wymuszony przez Cloudflare
- Rate limiting na endpointy API (Cloudflare)

### Debugowanie i problemy

**Panel nie pokazuje zmian:**
1. Kliknij "Wyczyść cache" w panelu
2. Odśwież przeglądarkę (Ctrl+Shift+R)
3. Sprawdź czy migracja została uruchomiona

**Strona pokazuje stare teksty:**
- Cache localStorage (1h) - poczekaj lub wyczyść: `localStorage.clear(); location.reload();`
- Cache przeglądarki - Ctrl+Shift+R

**Błąd "map is not a function":**
- Problem z formatem tablic w buildTranslationsObject
- Sprawdź format kluczy w bazie: `items[0].title`
- Uruchom ponownie migrację

**Dokumentacja szczegółowa:**
- Zobacz `WORK_IN_PROGRESS.md` dla pełnej dokumentacji panelu
- Zobacz `ADMIN_FIX_RLS.md` dla informacji o RLS policies

## Typowe zadania dla Claude Code

### 1. Dodanie nowej sekcji do istniejącej strony
```
Kroki:
1. Przeczytaj plik strony (np. src/pages/service/Repairs.tsx)
2. Edytuj pliki tłumaczeń (src/locales/pl.ts, en.ts, de.ts)
3. Dodaj nowe klucze dla sekcji we wszystkich językach
4. Zmodyfikuj komponent strony aby używał nowych kluczy
5. Uruchom: npm run migrate:translations
6. Zbuduj projekt: npm run build
```

### 2. Zmiana layoutu istniejącej strony
```
Kroki:
1. Przeczytaj komponent strony
2. Zmodyfikuj strukturę JSX/TSX
3. Zaktualizuj style Tailwind jeśli potrzeba
4. Jeśli dodajesz nowe teksty, zaktualizuj locales i uruchom migrację
5. Zbuduj projekt: npm run build
```

### 3. Dodanie nowej strony/podstrony
```
Kroki:
1. Stwórz nowy komponent w odpowiednim katalogu (pages/products/ lub pages/service/)
2. Dodaj trasę w src/App.tsx
3. Dodaj tłumaczenia do src/locales/*.ts dla wszystkich języków
4. Dodaj stronę do src/lib/pageStructure.ts (jeśli ma być edytowalna w panelu)
5. Uruchom: npm run migrate:translations
6. Zaktualizuj nawigację w Header.tsx jeśli potrzeba
7. Zbuduj projekt: npm run build
```

### 4. Zmiana tekstów przez kod (zamiast panel)
```
Kroki:
1. Edytuj src/locales/pl.ts, en.ts, de.ts
2. Zachowaj spójność kluczy między językami
3. Uruchom: npm run migrate:translations
4. Zbuduj projekt: npm run build
```

### 5. Naprawa błędów wyświetlania
```
Kroki:
1. Sprawdź console przeglądarki (F12)
2. Sprawdź czy cache nie blokuje (localStorage.clear())
3. Sprawdź czy migracja została uruchomiona po zmianach
4. Sprawdź format danych w Supabase
5. Sprawdź czy klucze tłumaczeń są poprawne
```

## Najlepsze praktyki

### Podczas edycji kodu:
- ✅ Zawsze czytaj plik przed edycją
- ✅ Zachowaj spójność kluczy tłumaczeń między językami
- ✅ Po zmianach w locales uruchom migrację
- ✅ Testuj zmiany budując projekt (npm run build)
- ✅ Dodawaj komentarze dla skomplikowanej logiki
- ❌ Nie usuwaj istniejących kluczy bez sprawdzenia czy są używane
- ❌ Nie dodawaj funkcjonalności których użytkownik nie prosił
- ❌ Nie zapomnij o migracji po zmianach w tłumaczeniach

### Podczas dodawania nowych stron:
- ✅ Użyj istniejących komponentów page-sections gdy to możliwe
- ✅ Dodaj SEO meta tagi (react-helmet)
- ✅ Zachowaj spójność z resztą projektu (struktura, style)
- ✅ Dodaj responsive design (mobile-first)
- ✅ Pamiętaj o wszystkich 3 językach

### Podczas pracy z panelem admin:
- ✅ Jeśli dodajesz nową stronę, dodaj ją do pageStructure.ts
- ✅ Sprawdź czy RLS policies pozwalają na edycję
- ✅ Testuj w panelu po zmianach
- ❌ Nie modyfikuj struktury bazy bez konsultacji

## Częste pułapki

1. **Zapomnienie o migracji** - Zmiany w locales nie trafiają do bazy
2. **Cache** - Stare teksty w przeglądarce mimo zmian w bazie
3. **Niespójne klucze** - Różne klucze między językami powodują błędy
4. **Brak buildu** - Zmiany nie są widoczne na serwerze produkcyjnym
5. **HashRouter vs BrowserRouter** - Używamy HashRouter (#/ w URL)

## Szybka checklist przed zakończeniem zadania

- [ ] Przeczytałem pliki które edytuję
- [ ] Wszystkie 3 języki mają te same klucze (pl/en/de)
- [ ] Uruchomiłem `npm run migrate:translations` (jeśli zmieniałem locales)
- [ ] Uruchomiłem `npm run build` i nie ma błędów
- [ ] Sprawdziłem w przeglądarce czy zmiany są widoczne
- [ ] Nie dodałem niepotrzebnych funkcjonalności
- [ ] Zachowałem spójność ze stylem reszty projektu
