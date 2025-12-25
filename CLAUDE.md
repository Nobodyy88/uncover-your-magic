# CLAUDE.md

Ten plik zawiera wskazówki dla Claude Code (claude.ai/code) podczas pracy z kodem w tym repozytorium.

## Zasady komunikacji

- Odpowiadaj zawsze w języku polskim

## Środowisko pracy

- Zmiany wprowadzane są na serwerze lokalnym z podpiętą domeną
- Użytkownik ma stały podgląd strony w przeglądarce
- Nie trzeba uruchamiać `npm run dev` - wystarczy `npm run build` po zmianach

## Wielojęzyczność

- Wszystkie zmiany tekstów wprowadzaj zarówno do wersji polskiej (`src/locales/pl.ts`) jak i angielskiej (`src/locales/en.ts`)

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
- `src/pages/` - Strony routingu (Index, NotFound)
- `src/components/` - Własne komponenty (Header, Hero, Services, Realizations, About, ContactForm, Footer, LanguageSwitcher, Partners)
- `src/components/ui/` - Komponenty bazowe shadcn/ui
- `src/hooks/` - Własne hooki (use-toast, use-mobile)
- `src/lib/utils.ts` - Narzędzie `cn()` do łączenia klas Tailwind
- `src/integrations/supabase/` - Klient Supabase i automatycznie generowane typy
- `src/contexts/` - Konteksty React (LanguageContext dla i18n)
- `src/locales/` - Pliki tłumaczeń (pl.ts, en.ts)

### Kluczowe wzorce
- React Router do routingu (dodawaj trasy w `App.tsx` powyżej catch-all `*`)
- Klient Supabase: `import { supabase } from "@/integrations/supabase/client"`
- Powiadomienia toast przez `sonner` i własny hook `useToast`
- TanStack Query do zarządzania stanem serwera
- Obsługa formularzy: react-hook-form + walidacja zod
- Wielojęzyczność: `useLanguage()` hook z LanguageContext

### Stylowanie
- Tailwind CSS z zmiennymi CSS do motywów (zdefiniowane w `src/index.css`)
- Własne fonty: "Bebas Neue" (display), "Inter" (sans)
- Styl shadcn/ui: "default" z bazowym kolorem slate

### Zmienne środowiskowe
Wymagane w `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
