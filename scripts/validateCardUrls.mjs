import { createClient } from "@libsql/client/web";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.trim().match(/^([^=#]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function buildUrls(cardId, lang, setIdOther, serieId) {
  const parts = cardId.split("-");
  const setId = (setIdOther && setIdOther !== "") ? setIdOther : parts[0];
  const cardNum = parts[1];
  let sId = serieId || "";
  if (!sId) {
    const idx = setId.search(/\d/);
    sId = idx !== -1 ? setId.slice(0, idx) : setId;
  }
  const match = setId.match(/^([^0-9]*)(.*)$/);

  const langs = [lang, ...["en", "ja", "es"].filter(l => l !== lang)];
  const urls = [];
  for (const l of langs) {
    urls.push(`https://assets.tcgdex.net/${l}/${sId.toUpperCase()}/${match[1].toUpperCase()}${match[2].toLowerCase()}/${cardNum}/low.webp`);
    urls.push(`https://assets.tcgdex.net/${l}/${sId.toUpperCase()}/${match[1].toUpperCase()}${match[2].toUpperCase()}/${cardNum}/low.webp`);
    urls.push(`https://assets.tcgdex.net/${l}/${sId.toLowerCase()}/${match[1].toLowerCase()}${match[2].toLowerCase()}/${cardNum}/low.webp`);
  }
  return urls;
}

const result = await turso.execute("SELECT * FROM lists_cards_info WHERE image_url IS NULL");
const total = result.rows.length;
let ok = 0;
let fail = 0;

for (const row of result.rows) {
  const urls = buildUrls(row.cardId, row.lang, row.setIdOther, row.serieId);
  let validUrl = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        validUrl = url;
        break;
      }
    } catch {}
  }
  await turso.execute({
    sql: "UPDATE lists_cards SET image_url = ? WHERE id = ?",
    args: [validUrl, row.id],
  });
  if (validUrl) ok++;
  else fail++;
  console.log(`${row.cardId} [${row.lang}]: ${validUrl ? "OK" : "FAIL"}`);
}

console.log(`\nDone: ${ok} OK, ${fail} FAIL (total ${total})`);
turso.close();
