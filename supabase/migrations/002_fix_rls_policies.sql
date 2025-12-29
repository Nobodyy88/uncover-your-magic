-- Migracja: Naprawa polityk RLS - usunięcie nieskończonej rekursji
-- Data: 2025-12-29

-- Usuń stare błędne polityki
DROP POLICY IF EXISTS "Public read translations" ON translations;
DROP POLICY IF EXISTS "Admin edit translations" ON translations;
DROP POLICY IF EXISTS "Public read published pages" ON page_contents;
DROP POLICY IF EXISTS "Admin edit pages" ON page_contents;
DROP POLICY IF EXISTS "Admin read admin_users" ON admin_users;

-- Funkcja sprawdzająca czy użytkownik jest adminem (BEZ rekursji)
-- SECURITY DEFINER pozwala funkcji czytać admin_users bez sprawdzania RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Nowe polityki BEZ rekursji - używają funkcji is_admin()

-- Translations: publiczny odczyt, admin może wszystko
CREATE POLICY "Public read translations" ON translations
  FOR SELECT USING (true);

CREATE POLICY "Admin edit translations" ON translations
  FOR ALL USING (is_admin());

-- Page contents: publiczny odczyt opublikowanych, admin widzi wszystko
CREATE POLICY "Public read published pages" ON page_contents
  FOR SELECT USING (is_published = true OR is_admin());

CREATE POLICY "Admin edit pages" ON page_contents
  FOR ALL USING (is_admin());

-- Admin users: użytkownik może czytać tylko swój własny rekord
CREATE POLICY "Users read own admin record" ON admin_users
  FOR SELECT USING (id = auth.uid());

-- Tylko super admin może dodawać nowych adminów (dla przyszłości)
CREATE POLICY "Super admin can manage admins" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND is_super_admin = true
    )
  );
