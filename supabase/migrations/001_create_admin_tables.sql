-- Migracja: Utworzenie tabel dla panelu administracyjnego WM Tyres
-- Data: 2025-12-29

-- ============================================================================
-- 1. TABELA: translations
-- Przechowuje wszystkie tłumaczenia z pl.ts/en.ts/de.ts
-- ============================================================================

CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,          -- np. "hero.headline1"
  value_pl TEXT,
  value_en TEXT,
  value_de TEXT,
  category TEXT NOT NULL,             -- np. "hero", "services", "contact"
  subcategory TEXT,                   -- opcjonalne grupowanie
  is_array BOOLEAN DEFAULT false,     -- czy wartość to element tablicy
  array_index INTEGER,                -- pozycja w tablicy jeśli is_array=true
  parent_key TEXT,                    -- dla zagnieżdżonych obiektów
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla szybkiego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);
CREATE INDEX IF NOT EXISTS idx_translations_category ON translations(category);
CREATE INDEX IF NOT EXISTS idx_translations_parent_key ON translations(parent_key);

COMMENT ON TABLE translations IS 'Przechowuje wszystkie tłumaczenia strony (pl, en, de)';
COMMENT ON COLUMN translations.key IS 'Klucz tłumaczenia w formacie dot-notation, np. hero.headline1';
COMMENT ON COLUMN translations.category IS 'Kategoria dla grupowania w panelu admina';
COMMENT ON COLUMN translations.is_array IS 'True jeśli element jest częścią tablicy (services.items, team.members)';
COMMENT ON COLUMN translations.array_index IS 'Pozycja w tablicy, używane gdy is_array=true';

-- ============================================================================
-- 2. TABELA: page_contents
-- Przechowuje treści dla pustych podstron (Felgi, Regeneracja, Naprawy, Montaż)
-- ============================================================================

CREATE TABLE IF NOT EXISTS page_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL UNIQUE,    -- "rims", "regeneration", "repairs", "mounting"
  title_pl TEXT,
  title_en TEXT,
  title_de TEXT,
  subtitle_pl TEXT,
  subtitle_en TEXT,
  subtitle_de TEXT,
  content_pl JSONB,                   -- struktura treści w JSON
  content_en JSONB,
  content_de JSONB,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE page_contents IS 'Treści dla podstron edytowalne przez panel admina';
COMMENT ON COLUMN page_contents.page_slug IS 'Unikalny slug strony (rims, regeneration, repairs, mounting)';
COMMENT ON COLUMN page_contents.content_pl IS 'Struktura sekcji strony w formacie JSONB';
COMMENT ON COLUMN page_contents.is_published IS 'Czy strona jest opublikowana (widoczna publicznie)';

-- ============================================================================
-- 3. TABELA: admin_users
-- Przechowuje uprawnienia administratorów
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_super_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

COMMENT ON TABLE admin_users IS 'Użytkownicy z uprawnieniami do panelu administracyjnego';
COMMENT ON COLUMN admin_users.is_super_admin IS 'Super admin może dodawać innych adminów (obecnie nie wykorzystywane)';
COMMENT ON COLUMN admin_users.last_login IS 'Data ostatniego logowania do panelu';

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- Konfiguracja polityk bezpieczeństwa
-- ============================================================================

-- Włącz RLS na wszystkich tabelach
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- POLITYKI DLA: translations
-- Publiczny odczyt, tylko admini mogą edytować

CREATE POLICY "Public read translations"
  ON translations FOR SELECT
  USING (true);

CREATE POLICY "Admin edit translations"
  ON translations FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- POLITYKI DLA: page_contents
-- Publiczny odczyt tylko opublikowanych stron, admini widzą wszystko

CREATE POLICY "Public read published pages"
  ON page_contents FOR SELECT
  USING (
    is_published = true OR auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admin edit pages"
  ON page_contents FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- POLITYKI DLA: admin_users
-- Tylko admini mogą czytać listę adminów

CREATE POLICY "Admin read admin_users"
  ON admin_users FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- ============================================================================
-- 5. FUNKCJE POMOCNICZE
-- ============================================================================

-- Funkcja do automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggery dla auto-update updated_at
CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_contents_updated_at
  BEFORE UPDATE ON page_contents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. DANE STARTOWE
-- Utworzenie pustych rekordów dla 4 podstron
-- ============================================================================

INSERT INTO page_contents (page_slug, title_pl, title_en, title_de, subtitle_pl, subtitle_en, subtitle_de, is_published)
VALUES
  ('rims', 'FELGI', 'RIMS', 'FELGEN', 'Produkty WM Tyres', 'WM Tyres Products', 'WM Tyres Produkte', false),
  ('regeneration', 'REGENERACJA', 'REGENERATION', 'REGENERATION', 'Produkty WM Tyres', 'WM Tyres Products', 'WM Tyres Produkte', false),
  ('repairs', 'NAPRAWY', 'REPAIRS', 'REPARATUREN', 'Serwis WM Tyres', 'WM Tyres Service', 'WM Tyres Service', false),
  ('mounting', 'MONTAŻ', 'MOUNTING', 'MONTAGE', 'Serwis WM Tyres', 'WM Tyres Service', 'WM Tyres Service', false)
ON CONFLICT (page_slug) DO NOTHING;

-- ============================================================================
-- KONIEC MIGRACJI
-- ============================================================================
