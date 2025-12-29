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
  const [isLoading, setIsLoading] = useState(true);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  // Pobierz tłumaczenia z Supabase z cache
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);

      try {
        // Sprawdź cache dla wszystkich języków
        const cachedPl = getCachedTranslations('pl');
        const cachedEn = getCachedTranslations('en');
        const cachedDe = getCachedTranslations('de');

        // Jeśli wszystkie w cache, użyj ich
        if (cachedPl && cachedEn && cachedDe) {
          setTranslations({
            pl: cachedPl,
            en: cachedEn,
            de: cachedDe,
          });
          setIsLoading(false);
          return;
        }

        // Pobierz z Supabase
        const { data, error } = await supabase
          .from('translations')
          .select('*');

        if (error) {
          console.error('Error fetching translations from Supabase:', error);
          // Fallback do statycznych
          setTranslations(staticTranslations);
          setIsLoading(false);
          return;
        }

        if (data && data.length > 0) {
          // Zbuduj obiekty dla każdego języka
          const plTranslations = buildTranslationsObject(data, 'pl');
          const enTranslations = buildTranslationsObject(data, 'en');
          const deTranslations = buildTranslationsObject(data, 'de');

          // Zapisz w cache
          setCachedTranslations('pl', plTranslations);
          setCachedTranslations('en', enTranslations);
          setCachedTranslations('de', deTranslations);

          setTranslations({
            pl: plTranslations,
            en: enTranslations,
            de: deTranslations,
          });
        } else {
          // Brak danych w bazie, użyj statycznych
          setTranslations(staticTranslations);
        }
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback do statycznych
        setTranslations(staticTranslations);
      } finally {
        setIsLoading(false);
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
