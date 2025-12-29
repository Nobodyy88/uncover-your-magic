import type { Tables } from '@/integrations/supabase/types';
import { pl, Translations } from '@/locales/pl';
import { en } from '@/locales/en';
import { de } from '@/locales/de';

type TranslationRecord = Tables<'translations'>;
type Language = 'pl' | 'en' | 'de';

// Mapa fallbacków dla każdego języka
const staticFallbacks: Record<Language, Translations> = {
  pl,
  en,
  de,
};

/**
 * Konwertuje płaskie rekordy z bazy danych na zagnieżdżony obiekt tłumaczeń
 *
 * @param records - Rekordy tłumaczeń z bazy danych
 * @param language - Język do zbudowania
 * @returns Zagnieżdżony obiekt z tłumaczeniami
 */
export function buildTranslationsObject(
  records: TranslationRecord[],
  language: Language
): Translations {
  console.log(`🔨 [buildTranslationsObject] Building ${language} from ${records.length} records`);

  // Jeśli brak rekordów, zwróć statyczny fallback
  if (!records || records.length === 0) {
    console.warn(`⚠️ [buildTranslationsObject] No records for ${language}, using static fallback`);
    return staticFallbacks[language];
  }

  try {
    const result: Record<string, unknown> = {};
    const valueKey = `value_${language}` as keyof TranslationRecord;

    // Przetwórz wszystkie rekordy
    for (const record of records) {
      const key = record.key;
      const value = record[valueKey] as string;

      setValue(result, key, value || '');
    }

    console.log(`✅ [buildTranslationsObject] Successfully built ${language}`);
    return result as Translations;
  } catch (error) {
    console.error(`❌ [buildTranslationsObject] Fatal error building ${language}:`, error);
    // Zwróć statyczny fallback zamiast pustego obiektu
    return staticFallbacks[language];
  }
}

/**
 * Pomocnicza funkcja do ustawiania zagnieżdżonych wartości
 * Obsługuje klucze z nawiasami kwadratowymi typu: services.items[0].title
 */
function setValue(obj: Record<string, unknown>, path: string, value: string): void {
  // Parsuj klucz z uwzględnieniem nawiasów kwadratowych
  // np. "services.items[0].title" -> ["services", "items", "0", "title"]
  const keys = path.split(/\.|\[|\]/).filter(k => k !== '');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    // Sprawdź czy następny klucz jest numerem (element tablicy)
    const isNextKeyNumeric = /^\d+$/.test(nextKey);

    if (/^\d+$/.test(key)) {
      // Aktualny klucz jest numerem - ustawiamy w tablicy
      const index = parseInt(key);

      if (!Array.isArray(current)) {
        console.warn(`Expected array at ${keys.slice(0, i).join('.')}`);
        return;
      }

      if (!current[index]) {
        current[index] = isNextKeyNumeric ? [] : {};
      }
      current = current[index];
    } else {
      // Aktualny klucz jest stringiem
      if (!current[key]) {
        current[key] = isNextKeyNumeric ? [] : {};
      }
      current = current[key];
    }
  }

  // Ustaw wartość końcową
  const lastKey = keys[keys.length - 1];

  if (/^\d+$/.test(lastKey)) {
    // Ostatni klucz jest numerem - ustaw w tablicy
    const index = parseInt(lastKey);
    if (!Array.isArray(current)) {
      console.warn(`Expected array for index ${index}`);
      return;
    }
    current[index] = value;
  } else {
    // Ostatni klucz jest stringiem
    current[lastKey] = value;
  }
}

/**
 * Konwertuje zagnieżdżony obiekt tłumaczeń na płaskie rekordy
 *
 * @param translations - Zagnieżdżony obiekt z tłumaczeniami
 * @param category - Kategoria tłumaczeń
 * @returns Tablica płaskich rekordów
 */
export function flattenTranslations(
  translations: Record<string, unknown>,
  category: string
): Partial<TranslationRecord>[] {
  const result: Partial<TranslationRecord>[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function flatten(obj: any, prefix: string = '') {
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (Array.isArray(value)) {
        // Tablica
        value.forEach((item, index) => {
          const itemValue = typeof item === 'object' ? JSON.stringify(item) : String(item);
          result.push({
            key: fullKey,
            value_pl: itemValue,
            value_en: itemValue,
            value_de: itemValue,
            category,
            is_array: true,
            array_index: index,
            parent_key: fullKey,
          });
        });
      } else if (typeof value === 'object' && value !== null) {
        // Zagnieżdżony obiekt
        flatten(value, fullKey);
      } else {
        // Prosta wartość
        result.push({
          key: fullKey,
          value_pl: String(value),
          value_en: String(value),
          value_de: String(value),
          category,
          is_array: false,
        });
      }
    }
  }

  flatten(translations);
  return result;
}

/**
 * Cache w localStorage
 */

const CACHE_PREFIX = 'translations_cache_';
const CACHE_DURATION = 60 * 60 * 1000; // 1 godzina w milisekundach

interface CacheEntry {
  data: Translations;
  timestamp: number;
}

/**
 * Pobierz tłumaczenia z cache
 */
export function getCachedTranslations(language: Language): Translations | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${language}`);
    if (!cached) {
      console.log(`📦 [getCachedTranslations] No cache for ${language}`);
      return null;
    }

    const entry: CacheEntry = JSON.parse(cached);

    // Walidacja: sprawdź czy entry ma poprawną strukturę
    if (!entry || typeof entry !== 'object' || !entry.data || typeof entry.timestamp !== 'number') {
      console.warn(`⚠️ [getCachedTranslations] Invalid cache structure for ${language}`);
      localStorage.removeItem(`${CACHE_PREFIX}${language}`);
      return null;
    }

    if (!isCacheValid(entry.timestamp)) {
      // Cache wygasł
      console.log(`⏰ [getCachedTranslations] Cache expired for ${language}`);
      localStorage.removeItem(`${CACHE_PREFIX}${language}`);
      return null;
    }

    console.log(`✅ [getCachedTranslations] Valid cache found for ${language}`);
    return entry.data;
  } catch (error) {
    console.error(`❌ [getCachedTranslations] Error reading translation cache for ${language}:`, error);
    // Wyczyść zepsuty cache
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${language}`);
    } catch {
      // Ignore cleanup errors
    }
    return null;
  }
}

/**
 * Zapisz tłumaczenia do cache
 */
export function setCachedTranslations(language: Language, data: Translations): void {
  try {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${language}`, JSON.stringify(entry));
  } catch (error) {
    console.error('Error writing translation cache:', error);
  }
}

/**
 * Sprawdź czy cache jest aktualny
 */
export function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

/**
 * Wyczyść cache dla języka
 */
export function clearTranslationCache(language?: Language): void {
  if (language) {
    localStorage.removeItem(`${CACHE_PREFIX}${language}`);
  } else {
    // Wyczyść wszystkie języki
    ['pl', 'en', 'de'].forEach(lang => {
      localStorage.removeItem(`${CACHE_PREFIX}${lang}`);
    });
  }
}
