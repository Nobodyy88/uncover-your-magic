import type { Tables } from '@/integrations/supabase/types';

type TranslationRecord = Tables<'translations'>;
type Language = 'pl' | 'en' | 'de';

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
): Record<string, unknown> {
  console.log(`🔨 [buildTranslationsObject] Building ${language} from ${records.length} records`);

  try {
    const result: Record<string, unknown> = {};
    const valueKey = `value_${language}` as keyof TranslationRecord;

    // Najpierw grupujemy po parent_key dla tablic
    const arrays: Record<string, TranslationRecord[]> = {};

    for (const record of records) {
      if (record.is_array && record.parent_key) {
        if (!arrays[record.parent_key]) {
          arrays[record.parent_key] = [];
        }
        arrays[record.parent_key].push(record);
      }
    }

    // Sortujemy elementy tablic według array_index
    for (const key in arrays) {
      arrays[key].sort((a, b) => (a.array_index || 0) - (b.array_index || 0));
    }

    // Teraz przetwarzamy wszystkie rekordy
    for (const record of records) {
      try {
        const keys = record.key.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current: any = result;

        // Nawiguj przez zagnieżdżoną strukturę
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }

        const lastKey = keys[keys.length - 1];

        // Jeśli to element tablicy, przetwarzamy całą tablicę
        if (record.is_array && record.parent_key) {
          // Sprawdź czy to tablica obiektów czy prostych wartości
          const arrayItems = arrays[record.parent_key];
          if (arrayItems && arrayItems.length > 0) {
            // Próbuj parsować jako JSON (dla obiektów)
            const parsedArray = arrayItems.map(item => {
              const value = item[valueKey] as string;
              if (!value) return '';

              try {
                // Jeśli wartość wygląda jak JSON, parsuj ją
                if (value.trim().startsWith('{')) {
                  return JSON.parse(value);
                }
              } catch (parseError) {
                console.warn(`⚠️ [buildTranslationsObject] Failed to parse JSON for key ${item.key}:`, parseError);
                // Jeśli nie można sparsować, zwróć jako string
              }
              return value;
            });

            current[lastKey] = parsedArray;
          }
        } else if (!record.is_array) {
          // Proste wartości
          const value = record[valueKey] as string;
          current[lastKey] = value || '';
        }
      } catch (recordError) {
        console.error(`❌ [buildTranslationsObject] Error processing record ${record.key}:`, recordError);
        // Kontynuuj z następnym rekordem
      }
    }

    console.log(`✅ [buildTranslationsObject] Successfully built ${language} with ${Object.keys(result).length} top-level keys`);
    return result;
  } catch (error) {
    console.error(`❌ [buildTranslationsObject] Fatal error building ${language}:`, error);
    // Zwróć pusty obiekt zamiast crashować
    return {};
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
  data: Record<string, unknown>;
  timestamp: number;
}

/**
 * Pobierz tłumaczenia z cache
 */
export function getCachedTranslations(language: Language): Record<string, unknown> | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${language}`);
    if (!cached) {
      console.log(`📦 [getCachedTranslations] No cache for ${language}`);
      return null;
    }

    const entry: CacheEntry = JSON.parse(cached);

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
export function setCachedTranslations(language: Language, data: Record<string, unknown>): void {
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
