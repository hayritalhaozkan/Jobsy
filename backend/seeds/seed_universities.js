/**
 * Üniversiteleri seed'le
 * Çalıştır: npm run seed:universities
 *
 * universiteler_names.json'daki tüm üniversiteleri
 * universities tablosuna INSERT eder.
 * Zaten varsa display_name'i günceller (Türkçe karakter düzeltmesi için).
 */

require("dotenv").config();
const { pool } = require("../src/config/db");
const data = require("./universiteler_names.json");

/**
 * Türkçe-farkında başlık büyütme:
 *  - toLocaleLowerCase('tr-TR') → "İ"→"i", "I"→"ı" (doğru Türkçe küçük harf)
 *  - toLocaleUpperCase('tr-TR') → "i"→"İ", "ı"→"I" (doğru Türkçe büyük harf)
 *  - \S : ASCII-dışı harfleri de (ü, ş, ğ, ç, ö) yakalar
 */
function toTitleCaseTr(str) {
  return str
    .toLocaleLowerCase("tr-TR")
    .replace(/(?:^|\s)(\S)/g, (match, char) =>
      match.replace(char, char.toLocaleUpperCase("tr-TR"))
    );
}

async function seed() {
  console.log(`📦 ${data.length} üniversite seed'lenecek...\n`);

  let updated  = 0;
  let inserted = 0;

  for (const uni of data) {
    const name         = uni.ad.trim();
    const display_name = toTitleCaseTr(name);

    const result = await pool.query(
      `INSERT INTO universities (name, display_name)
       VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE
         SET display_name = EXCLUDED.display_name
       RETURNING (xmax = 0) AS is_insert`,
      [name, display_name]
    );

    if (result.rows[0]?.is_insert) {
      inserted++;
    } else {
      updated++;
    }
  }

  console.log(`✅ ${inserted} yeni eklendi`);
  console.log(`🔄 ${updated} güncellendi (display_name düzeltildi)`);
  console.log("\n🎉 Seed tamamlandı.");

  await pool.end();
}

seed().catch(async (err) => {
  console.error("❌ Seed hatası:", err.message);
  try { await pool.end(); } catch {}
  process.exit(1);
});
