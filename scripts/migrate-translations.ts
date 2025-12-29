/**
 * Skrypt migracji tłumaczeń z plików lokalizacyjnych do Supabase
 *
 * Uruchomienie:
 * npm run migrate:translations
 *
 * Wymagania:
 * - Zainstalowane zależności (npm install)
 * - Utworzone tabele w Supabase (uruchom migrations/001_create_admin_tables.sql)
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { pl } from '../src/locales/pl.js';
import { en } from '../src/locales/en.js';
import { de } from '../src/locales/de.js';
import type { Translations } from '../src/locales/pl.js';

// Załaduj zmienne środowiskowe z .env
dotenv.config();

// Inicjalizuj klienta Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Błąd: Brak zmiennych VITE_SUPABASE_URL lub VITE_SUPABASE_SERVICE_ROLE_KEY w pliku .env');
  process.exit(1);
}

// Używamy service_role key aby pominąć RLS podczas migracji
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface FlattenedValue {
  value: string;
  category: string;
  subcategory?: string | null;
  isArray: boolean;
  arrayIndex?: number | null;
  parentKey?: string | null;
}

interface TranslationRecord {
  key: string;
  value_pl: string | null;
  value_en: string | null;
  value_de: string | null;
  category: string;
  subcategory: string | null;
  is_array: boolean;
  array_index: number | null;
  parent_key: string | null;
}

/**
 * Spłaszcza zagnieżdżony obiekt do formatu klucz-wartość
 * np. { hero: { headline1: "text" } } => { "hero.headline1": "text" }
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
  result: Record<string, FlattenedValue> = {},
  category = '',
  arrayIndex: number | null = null,
  parentKey = ''
): Record<string, FlattenedValue> {
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    // Określ kategorię (pierwszy poziom zagnieżdżenia)
    const currentCategory = prefix === '' ? key : category;

    if (value === null || value === undefined) {
      continue;
    }

    // Jeśli wartość to tablica obiektów (np. services.items, team.members)
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          // Dla tablic obiektów, dodaj [index] do klucza
          flattenObject(
            item,
            `${fullKey}[${index}]`,
            result,
            currentCategory,
            index,
            fullKey
          );
        } else {
          // Prosta tablica wartości (rzadko używane)
          result[`${fullKey}.${index}`] = {
            value: String(item),
            category: currentCategory,
            isArray: true,
            arrayIndex: index,
            parentKey: fullKey
          };
        }
      });
    }
    // Jeśli wartość to obiekt (dalsze zagnieżdżenie)
    else if (typeof value === 'object' && value !== null) {
      flattenObject(value, fullKey, result, currentCategory, arrayIndex, parentKey || prefix);
    }
    // Wartość końcowa (string, number, boolean)
    else {
      result[fullKey] = {
        value: String(value),
        category: currentCategory,
        subcategory: prefix && prefix !== currentCategory ? prefix.split('.')[1] : null,
        isArray: arrayIndex !== null,
        arrayIndex: arrayIndex,
        parentKey: parentKey || null
      };
    }
  }

  return result;
}

/**
 * Przygotowuje dane do wstawienia do tabeli translations
 */
function prepareTranslationRecords(translations: {
  pl: Translations;
  en: Translations;
  de: Translations;
}): TranslationRecord[] {
  const flatPl = flattenObject(translations.pl);
  const flatEn = flattenObject(translations.en);
  const flatDe = flattenObject(translations.de);

  const records: TranslationRecord[] = [];

  // Iteruj po wszystkich kluczach z polskiego tłumaczenia (referencja)
  for (const key in flatPl) {
    const plData = flatPl[key];
    const enData = flatEn[key];
    const deData = flatDe[key];

    records.push({
      key: key,
      value_pl: plData?.value || null,
      value_en: enData?.value || null,
      value_de: deData?.value || null,
      category: plData.category,
      subcategory: plData.subcategory || null,
      is_array: plData.isArray,
      array_index: plData.arrayIndex ?? null,
      parent_key: plData.parentKey || null
    });
  }

  return records;
}

/**
 * Wstawia rekordy do tabeli translations w Supabase
 */
async function insertTranslations(records: TranslationRecord[]): Promise<{ inserted: number; errors: number }> {
  console.log(`📝 Przygotowano ${records.length} rekordów do wstawienia...`);

  // Supabase ma limit ~1000 rekordów na batch, więc dzielimy na części
  const batchSize = 500;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    const { error } = await supabase
      .from('translations')
      .upsert(batch, { onConflict: 'key' });

    if (error) {
      console.error(`❌ Błąd wstawiania batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      errors++;
    } else {
      inserted += batch.length;
      console.log(`✅ Wstawiono batch ${Math.floor(i / batchSize) + 1}: ${batch.length} rekordów`);
    }
  }

  return { inserted, errors };
}

/**
 * Główna funkcja migracji
 */
async function migrate() {
  console.log('🚀 Rozpoczynam migrację tłumaczeń do Supabase...\n');

  // 1. Załaduj pliki lokalizacyjne
  console.log('📂 Ładuję pliki lokalizacyjne (pl, en, de)...');
  const translations = { pl, en, de };
  console.log('✅ Pliki załadowane pomyślnie\n');

  // 2. Przygotuj rekordy
  console.log('🔄 Spłaszczam strukturę tłumaczeń...');
  const records = prepareTranslationRecords(translations);
  console.log(`✅ Przygotowano ${records.length} rekordów\n`);

  // 3. Przykładowe rekordy (do debugowania)
  console.log('📋 Przykładowe rekordy:');
  console.log(JSON.stringify(records.slice(0, 3), null, 2));
  console.log('...\n');

  // 4. Zapytaj użytkownika o potwierdzenie
  console.log('⚠️  UWAGA: Operacja upsert nadpisze istniejące rekordy o tych samych kluczach!');
  console.log('Czy chcesz kontynuować? (naciśnij Ctrl+C aby anulować, Enter aby kontynuować)');

  // Poczekaj na Enter
  await new Promise<void>(resolve => {
    process.stdin.once('data', () => resolve());
  });

  // 5. Wstaw rekordy do Supabase
  console.log('\n💾 Wstawiam rekordy do Supabase...');
  const { inserted, errors } = await insertTranslations(records);

  // 6. Podsumowanie
  console.log('\n' + '='.repeat(50));
  console.log('📊 PODSUMOWANIE MIGRACJI');
  console.log('='.repeat(50));
  console.log(`✅ Pomyślnie wstawiono: ${inserted} rekordów`);
  if (errors > 0) {
    console.log(`❌ Błędy: ${errors} batchy`);
  }
  console.log('='.repeat(50));

  if (errors === 0) {
    console.log('\n🎉 Migracja zakończona sukcesem!');
  } else {
    console.log('\n⚠️  Migracja zakończona z błędami. Sprawdź logi powyżej.');
  }

  process.exit(0);
}

// Uruchom migrację
migrate().catch((error) => {
  console.error('\n❌ Nieoczekiwany błąd podczas migracji:', error);
  process.exit(1);
});
