# 🚧 Praca w toku - Panel administracyjny WM Tyres

**Data aktualizacji:** 2025-12-29
**Status:** ✅ Strona działa! | 🔄 Panel do przeprojektowania (Wariant A)

---

## ✅ PRIORYTET 1: NAPRAWIONO - Awaria strony głównej

### Problem:
- Strona główna pojawiała się przez **pół sekundy**, potem **znikała** (biały ekran)
- Błąd: `TypeError: e.services.items.map is not a function`
- Przyczyna: Funkcja `buildTranslationsObject()` źle odbudowywała tablice obiektów z bazy danych

### Rozwiązanie (✅ UKOŃCZONE):

#### 1. Znalezienie problemu
- **Error Boundary** w Index.tsx złapał błąd: `services.items.map is not a function`
- Okazało się że `t.services.items` nie był tablicą, tylko obiektem
- Problem był w funkcji `buildTranslationsObject()` w `src/lib/translations.ts`

#### 2. Naprawa skryptu migracji
- **Plik:** `scripts/migrate-translations.ts`
- **Problem:** Tablice obiektów były źle spłaszczane do bazy danych
- **Rozwiązanie:** Zmieniono format kluczy z `services.items.title` na `services.items[0].title`
- **Efekt:** Migracja utworzyła 212 rekordów (zamiast 157)

#### 3. Naprawa funkcji buildTranslationsObject
- **Plik:** `src/lib/translations.ts`
- **Problem:** Funkcja nie obsługiwała kluczy z nawiasami kwadratowymi typu `items[0].title`
- **Rozwiązanie:** Przepisano funkcję `setValue()` z parserem dla kluczy z `[index]`
- **Efekt:** Tablice obiektów są teraz poprawnie odbudowywane

#### 4. Ponowna migracja danych
```bash
# Usunięto stare dane (157 rekordów)
# Uruchomiono migrację ze zaktualizowanym skryptem
npm run migrate:translations
# ✅ Wstawiono 212 rekordów poprawnie
```

#### 5. Przywrócenie integracji z Supabase
- Odkomentowano import Supabase w `LanguageContext.tsx`
- Strona działa z tłumaczeniami z bazy danych
- Cache localStorage działa poprawnie (1 godzina)

### Pliki zmienione:
- ✅ `scripts/migrate-translations.ts` - naprawa spłaszczania tablic
- ✅ `src/lib/translations.ts` - naprawa buildTranslationsObject()
- ✅ `src/contexts/LanguageContext.tsx` - przywrócenie Supabase
- ✅ `src/components/ErrorBoundary.tsx` - nowy komponent do debugowania
- ✅ `src/pages/Index.tsx` - dodano Error Boundary wrapper

### Status:
✅ **STRONA DZIAŁA!** - Przetestowano na przeglądarce użytkownika
✅ **Panel admina działa** - logowanie, dashboard, edycja tłumaczeń
✅ **Integracja z Supabase działa** - 212 rekordów w bazie, cache 1h

### Uwaga dla nowych użytkowników:
Jeśli ktoś miał starą wersję strony w cache localStorage, może mieć zepsuty cache.
**Rozwiązanie:** Cache sam się wyczyści po 1 godzinie, lub można ręcznie wyczyścić:
```javascript
// W konsoli przeglądarki (F12)
localStorage.clear();
location.reload();
```

---

## 🔄 PRIORYTET 2: Przeprojektowanie panelu admina (Wariant A)

**Status:** DO ZROBIENIA

### Aktualna struktura panelu:

```
Dashboard
├─ Tłumaczenia → Lista kategorii → Edytor kategorii
├─ Podstrony → Lista podstron → Edytor podstrony
└─ Ustawienia (placeholder)
```

### Docelowa struktura (Wariant A):

```
Dashboard
├─ Index (strona główna)
│  ├─ Sekcja: Hero
│  ├─ Sekcja: Services
│  ├─ Sekcja: About
│  ├─ Sekcja: Realizations
│  └─ Sekcja: Contact
├─ O nas
├─ Sieć partnerów
├─ Opony
├─ Felgi
├─ Regeneracja
├─ Ride On
├─ Naprawy
├─ Umowa serwisowa
├─ Montaż
└─ [Eksportuj do plików] (przycisk)
```

### Wymagania Wariantu A:

**✅ Co BĘDZIE:**
- Przyciski dla każdej **STRONY** (Index, O nas, Opony, etc.)
- Edycja **tylko tekstów** w 3 językach (PL/EN/DE)
- Prosty interfejs - Input/Textarea (BEZ JSON)
- Przycisk **"Eksportuj do plików"** - synchronizacja z Claude Code
- Przycisk **"Podgląd"** - otwiera stronę w nowej karcie
- Przycisk **"Wyczyść cache"** - czyści localStorage

**❌ Co NIE BĘDZIE:**
- Zakładka "Podstrony" (usunięta)
- Edytor JSON (usunięty)
- Upload obrazków (usunięty)
- WYSIWYG editor (nie potrzebny)
- Podgląd na żywo (nie potrzebny)

**🎯 Cel:**
- 90% przypadków: szybkie zmiany tekstów (cena, opis, poprawka literówki)
- 10% przypadków: zmiany struktury/layoutu przez Claude Code

### Plan implementacji Wariantu A:

#### Faza 1: Mapowanie struktury stron
1. Stworzyć plik `src/lib/pageStructure.ts` z mapowaniem:
   ```typescript
   const pageStructure = {
     'index': {
       sections: [
         { name: 'Hero', keys: ['hero.headline1', 'hero.headline2', ...] },
         { name: 'Services', keys: ['services.title', 'services.titleHighlight', ...] },
         // ...
       ]
     },
     'about': { ... },
     // ...
   }
   ```

#### Faza 2: Przeprojektowanie Dashboard
- **Plik:** `src/pages/admin/Dashboard.tsx`
- Usuń karty "Tłumaczenia" i "Podstrony"
- Dodaj grid z przyciskami dla każdej strony:
  - Index (Strona główna)
  - O nas, Sieć partnerów
  - Opony, Felgi, Regeneracja, Ride On
  - Naprawy, Umowa serwisowa, Montaż
- Dodaj przycisk "Eksportuj do plików"
- Dodaj przycisk "Wyczyść cache"

#### Faza 3: Nowy edytor strony
- **Plik:** `src/pages/admin/PageEditor.tsx` (przepisać od nowa)
- Tabs dla języków (PL/EN/DE)
- Pogrupowane pola po sekcjach
- Input dla krótkich tekstów, Textarea dla długich
- Automatyczne wykrywanie typu pola na podstawie długości
- Batch update wszystkich zmian

#### Faza 4: Funkcja eksportu
- Pobierz wszystkie tłumaczenia z Supabase
- Zbuduj obiekty pl/en/de używając `buildTranslationsObject()`
- Wygeneruj pliki TypeScript (.ts)
- Download jako 3 pliki: `pl.ts`, `en.ts`, `de.ts`
- Instrukcja dla użytkownika: "Skopiuj te pliki do src/locales/"

#### Faza 5: Usunięcie starych plików
- Usuń `TranslationsList.tsx`, `TranslationEditor.tsx`
- Usuń `PagesList.tsx`, stary `PageEditor.tsx`
- Usuń `TranslationField.tsx`, `ArrayEditor.tsx`
- Zaktualizuj routing w `App.tsx`

### Pliki do zmiany:
- ✏️ `src/lib/pageStructure.ts` (nowy)
- ✏️ `src/pages/admin/Dashboard.tsx` (przeprojektowanie)
- ✏️ `src/pages/admin/PageEditor.tsx` (przepisać)
- 🗑️ `src/pages/admin/TranslationsList.tsx` (usunąć)
- 🗑️ `src/pages/admin/TranslationEditor.tsx` (usunąć)
- 🗑️ `src/pages/admin/PagesList.tsx` (usunąć)
- 🗑️ `src/components/admin/TranslationField.tsx` (usunąć)
- 🗑️ `src/components/admin/ArrayEditor.tsx` (usunąć)
- ✏️ `src/App.tsx` (zaktualizować routing)

---

## 📂 Kluczowe pliki projektu

### Pliki naprawione (awaria strony):
```
scripts/
└── migrate-translations.ts          ← ✅ NAPRAWIONO (format kluczy [index])

src/lib/
└── translations.ts                  ← ✅ NAPRAWIONO (setValue z parserem)

src/contexts/
└── LanguageContext.tsx              ← ✅ PRZYWRÓCONO (Supabase enabled)

src/components/
└── ErrorBoundary.tsx                ← ✅ DODANO (debugging)

src/pages/
└── Index.tsx                        ← ✅ DODANO (Error Boundary wrapper)
```

### Baza danych:
```
Supabase: dwrwrvxcbkmdlilmzxig.supabase.co
Tabele:
  - translations (212 rekordów) ✅
  - page_contents (0 rekordów)
  - admin_users (1 admin: djdrax@gmail.com) ✅

Migracje:
  - 001_create_admin_tables.sql ✅
  - 002_fix_rls_policies.sql ✅
```

---

## 🔄 Jak wznowić pracę

### Opcja 1: Kontynuuj panel (Wariant A)
```
Przeprojektuj panel administracyjny według Wariantu A.
Plan znajduje się w WORK_IN_PROGRESS.md sekcja PRIORYTET 2.
```

### Opcja 2: Testowanie i dopracowanie
```
Przetestuj panel admina:
- Czy edycja tłumaczeń działa poprawnie?
- Czy zmiany są widoczne na stronie po odświeżeniu?
- Czy cache działa (zmiany widoczne natychmiast vs po 1h)?
```

---

## 📊 Stan projektu

**✅ Działające:**
- Strona główna i wszystkie podstrony
- Panel admina (logowanie, dashboard, edytory)
- Baza danych Supabase (212 tłumaczeń)
- Integracja Supabase ↔ Frontend
- Cache localStorage (1 godzina)
- RLS policies (is_admin() function)

**🔄 Do zrobienia:**
- Przeprojektowanie panelu na Wariant A (prostsze UI)
- Funkcja eksportu do plików
- Przycisk "Wyczyść cache"
- Usunięcie starych komponentów panelu

---

## 💾 Ostatnie commity

```
(następny) - Napraw awarię strony głównej i przywróć Supabase
bd305eb - Pilna naprawa: przywróć działanie strony głównej (NIE DZIAŁAŁO)
5d8a55b - Dodaj szczegółowe logowanie debugowania
fecc471 - Dodaj pełny panel administracyjny dla WM Tyres
aadd817 - Popraw używanie tłumaczeń i nawigację
```

---

**KONIEC DOKUMENTU**

Strona działa! Panel admina działa! Teraz można przeprojektować interfejs panelu (Wariant A). 🎉
