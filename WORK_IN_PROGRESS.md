# 🚧 Panel administracyjny WM Tyres - Dokumentacja

**Data aktualizacji:** 2025-12-29
**Status:** ✅ Gotowy do użycia

---

## 📋 Jak działa panel administracyjny

### Struktura panelu (Wariant A)

Panel umożliwia edycję tekstów dla 10 stron:
- Index (Strona główna) - 7 sekcji
- O nas - 2 sekcje
- Sieć partnerów - 2 sekcje
- Opony, Felgi, Regeneracja, Ride On - po 1 sekcji
- Naprawy, Umowa serwisowa, Montaż - po 1 sekcji

**Funkcje:**
- ✅ Edycja tekstów w 3 językach (PL/EN/DE)
- ✅ Przycisk "Eksportuj do plików" - pobiera pl.ts, en.ts, de.ts
- ✅ Przycisk "Wyczyść cache" - czyści localStorage
- ✅ Przycisk "Podgląd" - otwiera stronę w nowej karcie
- ✅ Instrukcje obsługi wbudowane w interfejs

### Jak korzystać

1. **Zaloguj się:** `/admin/login` (djdrax@gmail.com)
2. **Dashboard:** Wybierz stronę do edycji
3. **Edytor:** Przełączaj języki (PL/EN/DE), edytuj teksty
4. **Zapisz:** Wszystkie zmiany zapisują się jednocześnie
5. **Wyczyść cache + Podgląd:** Zobacz efekt

---

## 🔄 Workflow: Jak dodawać treści do podstron

### Opcja 1: Edycja przez panel admina (90% przypadków)

**Dla prostych zmian tekstowych** (ceny, opisy, poprawki):
1. Zaloguj się do panelu `/admin/dashboard`
2. Wybierz stronę (np. "Naprawy")
3. Edytuj teksty w każdym języku
4. Kliknij "Zapisz" → "Wyczyść cache" → "Podgląd"

**Ważne:** Zmiany w panelu trafiają do **bazy Supabase**, ale **NIE** do plików statycznych.

### Opcja 2: Edycja przez Claude Code (10% przypadków)

**Dla zmian strukturalnych** (nowe sekcje, layout, funkcjonalności):
1. Napisz do Claude Code: "Dodaj sekcję XYZ do strony Naprawy"
2. Claude zmodyfikuje pliki:
   - `src/locales/pl.ts` - teksty polski
   - `src/locales/en.ts` - teksty angielski
   - `src/locales/de.ts` - teksty niemiecki
   - Opcjonalnie komponenty jeśli trzeba zmienić layout
3. **WAŻNE:** Po zmianach Claude uruchom migrację:
   ```bash
   npm run migrate:translations
   ```
   To zaktualizuje bazę Supabase nowymi kluczami

### Synchronizacja: Panel ↔ Kod

**Panel → Kod (eksport do plików):**
1. W panelu kliknij "Eksportuj do plików"
2. Pobierz 3 pliki: pl.ts, en.ts, de.ts
3. Przekaż je programiście/Claude do zastąpienia w `src/locales/`

**Kod → Panel (migracja):**
1. Po zmianach w plikach `src/locales/*.ts` uruchom:
   ```bash
   npm run migrate:translations
   ```
2. Potwierdź migrację (Enter)
3. Tłumaczenia trafiają do bazy Supabase
4. Panel automatycznie je wykryje

---

## 🗂️ Kluczowe pliki projektu

### Baza danych (Supabase)
```
Projekt: dwrwrvxcbkmdlilmzxig.supabase.co
Tabele:
  - translations (212 rekordów) - wszystkie tłumaczenia
  - page_contents (puste) - treści dynamiczne podstron
  - admin_users (1 admin) - djdrax@gmail.com

Migracje:
  - 001_create_admin_tables.sql
  - 002_fix_rls_policies.sql
```

### Panel admina
```
src/pages/admin/
├── Login.tsx           - Logowanie
├── Dashboard.tsx       - Grid z przyciskami stron
└── PageEditor.tsx      - Edytor tekstów (tabs PL/EN/DE)

src/lib/
├── pageStructure.ts    - Mapowanie stron do kluczy tłumaczeń
└── translations.ts     - Funkcje: buildTranslationsObject(), cache
```

### Tłumaczenia
```
src/locales/
├── pl.ts               - Statyczne tłumaczenia polski (fallback)
├── en.ts               - Statyczne tłumaczenia angielski (fallback)
└── de.ts               - Statyczne tłumaczenia niemiecki (fallback)

scripts/
└── migrate-translations.ts  - Migracja plików → Supabase
```

### Frontend
```
src/contexts/
└── LanguageContext.tsx  - Pobiera tłumaczenia z Supabase + cache (1h)

src/pages/service/
├── Repairs.tsx          - Podstrona "Naprawy" (używa page_contents lub fallback)
├── Mounting.tsx         - Podstrona "Montaż"
└── ServiceContract.tsx  - Podstrona "Umowa serwisowa"

src/pages/products/
├── Rims.tsx             - Podstrona "Felgi"
└── Regeneration.tsx     - Podstrona "Regeneracja"
```

---

## 🛠️ Typowe zadania dla Claude Code

### 1. Dodanie nowej sekcji do strony
```
Dodaj sekcję "Cennik" do strony Naprawy z następującymi tekstami:
- Nagłówek: "Nasze ceny"
- Opis: "Konkurencyjne ceny napraw"
- Lista 3 usług z cenami
Pamiętaj o wszystkich 3 językach i uruchom migrację.
```

### 2. Zmiana layoutu strony
```
Zmień układ sekcji na stronie O nas:
- Przenieś sekcję "Zespół" nad "Misja"
- Dodaj zdjęcia do karetek zespołu
Zaktualizuj komponenty i migrację.
```

### 3. Dodanie nowej strony
```
Dodaj nową stronę "Kontakt" z formularzem.
Dodaj ją do pageStructure.ts i routingu.
Stwórz komponenty i migrację tłumaczeń.
```

### 4. Naprawa błędów
```
Strona Naprawy nie wyświetla się poprawnie.
Sprawdź komponenty, tłumaczenia i console.
```

---

## 🔧 Rozwiązywanie problemów

### Panel nie pokazuje zmian
1. Kliknij "Wyczyść cache" w panelu
2. Odśwież stronę (F5 lub Ctrl+F5)
3. Sprawdź czy migracja została uruchomiona po zmianach w plikach

### Strona pokazuje stare teksty
1. Cache localStorage (1h) - poczekaj lub wyczyść:
   ```javascript
   localStorage.clear(); location.reload();
   ```
2. Cache przeglądarki - Ctrl+Shift+R

### Błąd "map is not a function"
- Problem z tablicami w buildTranslationsObject
- Sprawdź format kluczy w bazie: `items[0].title` (z nawiasami)
- Uruchom ponownie migrację

### Panel nie zapisuje zmian
- Sprawdź połączenie z internetem
- Sprawdź RLS policies w Supabase (is_admin() function)
- Sprawdź czy admin jest w tabeli admin_users

---

## 💾 Backup i przywracanie

### Backup tłumaczeń
```bash
# Eksportuj z panelu "Eksportuj do plików"
# LUB pobierz bezpośrednio z Supabase
```

### Przywracanie z plików statycznych
Jeśli baza Supabase jest niedostępna, strona automatycznie użyje fallbacku z `src/locales/*.ts`

---

## 📊 Stan projektu

**✅ Działające:**
- Strona główna i wszystkie podstrony
- Panel admina (Wariant A)
- Baza danych Supabase (212 tłumaczeń)
- Integracja Supabase ↔ Frontend
- Cache localStorage (1 godzina)
- Eksport/import tłumaczeń

**📌 Repozytorium:**
- GitHub: https://github.com/Nobodyy88/uncover-your-magic.git
- Branch: main
- Ostatni commit: e782c95

---

**KONIEC DOKUMENTU**

Panel gotowy! Strona działa! Można używać! 🎉
