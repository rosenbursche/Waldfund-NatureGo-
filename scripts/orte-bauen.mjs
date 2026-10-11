/**
 * Baut src/data/orte.json: Postleitzahlen und Orte in Deutschland für die Offline-Suche.
 *
 * Ausführen:  node scripts/orte-bauen.mjs
 *
 * Quelle: GeoNames Postal Codes (https://download.geonames.org/export/zip/DE.zip)
 * Lizenz: Creative Commons Namensnennung 4.0 (CC BY 4.0) – Namensnennung "GeoNames" in der App nötig.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const CACHE = '.cache';
if (!existsSync(`${CACHE}/DE.txt`)) {
  mkdirSync(CACHE, { recursive: true });
  console.log('Lade Postleitzahlen von GeoNames …');
  const res = await fetch('https://download.geonames.org/export/zip/DE.zip');
  if (!res.ok) throw new Error(`Download fehlgeschlagen: ${res.status}`);
  writeFileSync(`${CACHE}/DE.zip`, Buffer.from(await res.arrayBuffer()));
  execFileSync('unzip', ['-o', '-q', `${CACHE}/DE.zip`, 'DE.txt', '-d', CACHE]);
}

// Großkunden-Postleitzahlen (Firmen, Behörden) aussortieren – die sucht niemand als Wohnort.
const FIRMA = /GmbH|\bAG\b|\bKG\b|e\.\s?V\.|Bank|Versicherung|Sparkasse|Verlag|Postfach|Finanzamt|Universität|Klinik|Gruppe|Service/i;

const gesehen = new Set();
const orte = [];
for (const zeile of readFileSync(`${CACHE}/DE.txt`, 'utf8').split('\n')) {
  const s = zeile.split('\t');
  if (s.length < 11) continue;
  const [, plz, ort] = s;
  const lat = Number(s[9]);
  const lon = Number(s[10]);
  if (FIRMA.test(ort) || !Number.isFinite(lat)) continue;
  const key = `${plz}|${ort}`;
  if (gesehen.has(key)) continue;
  gesehen.add(key);
  // Auf 0,01° gerundet (ca. 1 km) – genauer brauchen wir es nicht.
  orte.push([plz, ort, Math.round(lat * 100) / 100, Math.round(lon * 100) / 100]);
}

writeFileSync(
  'src/data/orte.json',
  JSON.stringify({ quelle: 'GeoNames (geonames.org), CC BY 4.0', orte }) + '\n',
);
console.log(`Fertig: ${orte.length} Einträge → src/data/orte.json`);
