/**
 * Test funkcji buildTranslationsObject
 * Sprawdza czy poprawnie odbudowuje tablice obiektów z bazy danych
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

/**
 * NOWA POPRAWIONA wersja buildTranslationsObject
 */
function buildTranslationsObject(records, language) {
  console.log(`🔨 Building ${language} from ${records.length} records`);

  if (!records || records.length === 0) {
    console.warn(`⚠️ No records for ${language}`);
    return {};
  }

  const result = {};
  const valueKey = `value_${language}`;

  // Najpierw przetwórz wszystkie nie-tablicowe wartości
  for (const record of records) {
    if (!record.is_array) {
      setValue(result, record.key, record[valueKey] || '');
    }
  }

  // Teraz przetwórz tablice
  const arrayRecords = records.filter(r => r.is_array);

  // Pogrupuj po parent_key
  const arraysByParent = {};
  for (const record of arrayRecords) {
    if (record.parent_key) {
      if (!arraysByParent[record.parent_key]) {
        arraysByParent[record.parent_key] = [];
      }
      arraysByParent[record.parent_key].push(record);
    }
  }

  // Odbuduj każdą tablicę
  for (const parentKey in arraysByParent) {
    const items = arraysByParent[parentKey];

    // Pogrupuj po array_index
    const byIndex = {};
    for (const item of items) {
      const index = item.array_index ?? 0;
      if (!byIndex[index]) {
        byIndex[index] = [];
      }
      byIndex[index].push(item);
    }

    // Konwertuj na tablicę
    const arrayData = [];
    for (const index in byIndex) {
      const indexRecords = byIndex[index];

      // Sprawdź czy to tablica obiektów czy prostych wartości
      const hasNestedKeys = indexRecords.some(r => {
        const withoutParent = r.key.replace(parentKey + '.', '');
        return withoutParent.includes('.');
      });

      if (hasNestedKeys) {
        // Tablica obiektów - zbuduj obiekt dla tego indeksu
        const obj = {};
        for (const record of indexRecords) {
          // Usuń prefix parent_key
          const fieldPath = record.key.replace(parentKey + '.', '');
          setValue(obj, fieldPath, record[valueKey] || '');
        }
        arrayData[parseInt(index)] = obj;
      } else {
        // Tablica prostych wartości
        arrayData[parseInt(index)] = indexRecords[0][valueKey] || '';
      }
    }

    // Ustaw tablicę w wyniku
    setValue(result, parentKey, arrayData);
  }

  return result;
}

/**
 * Pomocnicza funkcja do ustawiania zagnieżdżonych wartości
 */
function setValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Sprawdź czy klucz jest numerem (element tablicy)
    if (/^\d+$/.test(key)) {
      const index = parseInt(key);
      if (!Array.isArray(current)) {
        // To nie powinno się zdarzyć, ale dla bezpieczeństwa
        console.warn(`Expected array at ${keys.slice(0, i).join('.')}`);
        return;
      }
      if (!current[index]) {
        current[index] = {};
      }
      current = current[index];
    } else {
      if (!current[key]) {
        // Sprawdź czy następny klucz jest numerem
        const nextKey = keys[i + 1];
        if (/^\d+$/.test(nextKey)) {
          current[key] = [];
        } else {
          current[key] = {};
        }
      }
      current = current[key];
    }
  }

  const lastKey = keys[keys.length - 1];

  // Jeśli ostatni klucz to numer, to ustawiamy w tablicy
  if (/^\d+$/.test(lastKey)) {
    const index = parseInt(lastKey);
    if (!Array.isArray(current)) {
      console.warn(`Expected array for index ${index}`);
      return;
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }
}

/**
 * Test główny
 */
async function test() {
  console.log('🧪 Testowanie buildTranslationsObject...\n');

  // Pobierz dane z bazy
  const { data: records, error } = await supabase
    .from('translations')
    .select('*');

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log(`✅ Fetched ${records.length} records\n`);

  // Zbuduj tłumaczenia
  const pl = buildTranslationsObject(records, 'pl');

  console.log('\n📊 Test results:\n');

  // Test 1: services.items
  console.log('1️⃣ services.items (powinno być tablicą 4 obiektów):');
  console.log(`   Type: ${Array.isArray(pl.services?.items) ? 'Array ✅' : 'NOT Array ❌'}`);
  console.log(`   Length: ${pl.services?.items?.length || 0}`);
  if (pl.services?.items?.[0]) {
    console.log(`   First item keys: ${Object.keys(pl.services.items[0]).join(', ')}`);
    console.log(`   First item.title: "${pl.services.items[0].title}"`);
    console.log(`   First item.features type: ${Array.isArray(pl.services.items[0].features) ? 'Array ✅' : 'NOT Array ❌'}`);
    console.log(`   First item.features length: ${pl.services.items[0].features?.length || 0}`);
    console.log(`   Full first item:`);
    console.log(JSON.stringify(pl.services.items[0], null, 6));
  } else {
    console.log('   ❌ First item is undefined!');
    console.log('   Full services.items:');
    console.log(JSON.stringify(pl.services?.items, null, 6));
  }

  // Test 2: realizations.items
  console.log('\n2️⃣ realizations.items (powinno być tablicą):');
  console.log(`   Type: ${Array.isArray(pl.realizations?.items) ? 'Array ✅' : 'NOT Array ❌'}`);
  console.log(`   Length: ${pl.realizations?.items?.length || 0}`);
  if (pl.realizations?.items?.[0]) {
    console.log(`   First item keys: ${Object.keys(pl.realizations.items[0]).join(', ')}`);
  }

  // Test 3: team.members
  console.log('\n3️⃣ team.members (powinno być tablicą):');
  console.log(`   Type: ${Array.isArray(pl.team?.members) ? 'Array ✅' : 'NOT Array ❌'}`);
  console.log(`   Length: ${pl.team?.members?.length || 0}`);

  // Test 4: contact.info.phone (powinien być obiektem)
  console.log('\n4️⃣ contact.info.phone (powinien być obiektem):');
  console.log(`   Type: ${typeof pl.contact?.info?.phone === 'object' ? 'Object ✅' : 'NOT Object ❌'}`);
  if (pl.contact?.info?.phone) {
    console.log(`   Keys: ${Object.keys(pl.contact.info.phone).join(', ')}`);
    console.log(`   phone.label: "${pl.contact.info.phone.label}"`);
  }

  console.log('\n✅ Test completed!');
  process.exit(0);
}

test().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
