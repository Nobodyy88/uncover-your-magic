import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { pl, Translations } from "@/locales/pl";
import { en } from "@/locales/en";
import { de } from "@/locales/de";
import { supabase } from "@/integrations/supabase/client";
import {
  buildTranslationsObject,
  getCachedTranslations,
  setCachedTranslations,
} from "@/lib/translations";

type Language = "pl" | "en" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isLoading: boolean;
}

const staticTranslations: Record<Language, Translations> = { pl, en, de };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "preferred-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "pl" || stored === "en" || stored === "de") return stored;
    }
    return "pl";
  });

  const [translations, setTranslations] = useState<Record<Language, Translations>>(staticTranslations);
  const [isLoading, setIsLoading] = useState(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  // Pobierz tłumaczenia z Supabase z cache
  useEffect(() => {
    const loadTranslations = async () => {
      console.log('🔍 [LanguageContext] Starting translation loading...');
      // NIE ustawiamy isLoading=true, ponieważ już mamy statyczne tłumaczenia
      // Strona może się renderować natychmiast, a tłumaczenia z Supabase zaktualizują się w tle

      try {
        // Sprawdź cache dla wszystkich języków
        console.log('📦 [LanguageContext] Checking cache...');
        const cachedPl = getCachedTranslations('pl');
        const cachedEn = getCachedTranslations('en');
        const cachedDe = getCachedTranslations('de');

        // Jeśli wszystkie w cache, użyj ich
        if (cachedPl && cachedEn && cachedDe) {
          console.log('✅ [LanguageContext] Using cached translations');
          setTranslations({
            pl: cachedPl,
            en: cachedEn,
            de: cachedDe,
          });
          return;
        }

        // Pobierz z Supabase
        console.log('🌐 [LanguageContext] Fetching from Supabase...');
        const { data, error } = await supabase
          .from('translations')
          .select('*');

        if (error) {
          console.error('❌ [LanguageContext] Error fetching translations from Supabase:', error);
          console.log('📄 [LanguageContext] Falling back to static translations');
          // Fallback do statycznych (już jest ustawiony, ale dla pewności)
          setTranslations(staticTranslations);
          return;
        }

        console.log(`✅ [LanguageContext] Fetched ${data?.length || 0} translation records`);

        if (data && data.length > 0) {
          console.log('🔨 [LanguageContext] Building translation objects...');
          // Zbuduj obiekty dla każdego języka
          const plTranslations = buildTranslationsObject(data, 'pl');
          const enTranslations = buildTranslationsObject(data, 'en');
          const deTranslations = buildTranslationsObject(data, 'de');

          console.log('💾 [LanguageContext] Caching translations...');
          // Zapisz w cache
          setCachedTranslations('pl', plTranslations);
          setCachedTranslations('en', enTranslations);
          setCachedTranslations('de', deTranslations);

          console.log('✅ [LanguageContext] Translations loaded successfully from Supabase');
          setTranslations({
            pl: plTranslations,
            en: enTranslations,
            de: deTranslations,
          });
        } else {
          console.log('⚠️ [LanguageContext] No data in database, using static translations');
          // Brak danych w bazie, użyj statycznych
          setTranslations(staticTranslations);
        }
      } catch (error) {
        console.error('❌ [LanguageContext] Error loading translations:', error);
        console.log('📄 [LanguageContext] Falling back to static translations');
        // Fallback do statycznych (już jest ustawiony, ale dla pewności)
        setTranslations(staticTranslations);
      } finally {
        console.log('🏁 [LanguageContext] Translation loading complete');
      }
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
