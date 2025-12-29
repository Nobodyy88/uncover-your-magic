# Jak naprawić błąd RLS w panelu admina

## Problem
Panel pokazuje błąd: "infinite recursion detected in policy for relation admin_users"

## Rozwiązanie

1. Otwórz [Supabase Dashboard](https://supabase.com/dashboard/project/dwrwrvxcbkmdlilmzxig)
2. Przejdź do **SQL Editor** (ikona `</>` w lewym menu)
3. Kliknij **+ New query**
4. Skopiuj całą zawartość pliku `supabase/migrations/002_fix_rls_policies.sql`
5. Wklej do edytora SQL
6. Kliknij **Run** (lub Ctrl+Enter)
7. Powinieneś zobaczyć: "Success. No rows returned"

## Test
1. Odśwież stronę panelu admina
2. Zaloguj się
3. Kliknij "Tłumaczenia" - powinno pokazać listę kategorii
4. Kliknij "Podstrony" - powinno pokazać 4 podstrony

## Co zostało naprawione?
- Polityki RLS teraz używają funkcji `is_admin()` która ma `SECURITY DEFINER`
- To pozwala uniknąć nieskończonej rekursji przy sprawdzaniu uprawnień
