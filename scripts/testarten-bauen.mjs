/**
 * Baut die Testarten für den Belastungstest: node scripts/testarten-bauen.mjs
 *
 * Für jede Art aus scripts/testarten/liste.mjs fragt das Skript GBIF:
 * 1. Namensabgleich → Ordnung, Familie, gültiger wissenschaftlicher Name
 * 2. Zahl der Beobachtungen in Deutschland → daraus eine grobe Seltenheit (1–4)
 *
 * Ergebnis: src/data/testarten.json (nur für den Belastungstest, nicht für die Store-Version).
 * Daten: GBIF.org, Lizenz siehe DATENQUELLEN.md.
 */
import { writeFileSync } from 'node:fs';

import { LISTE } from './testarten/liste.mjs';

const REICH = { saeuger: 'Animalia', voegel: 'Animalia', pilze: 'Fungi', pflanzen: 'Plantae' };
const API = 'https://api.gbif.org/v1';

async function holen(url, versuch = 1) {
  const r = await fetch(url);
  if (r.status === 429 || r.status >= 500) {
    if (versuch > 4) throw new Error(`${r.status} bei ${url}`);
    await new Promise((ok) => setTimeout(ok, 1000 * versuch));
    return holen(url, versuch + 1);
  }
  return r.json();
}

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function eineArt(kategorie, abschnitt, [name, lat, extra], index) {
  const m = await holen(`${API}/species/match?name=${encodeURIComponent(lat)}&kingdom=${REICH[kategorie]}&strict=true`);
  const key = m.acceptedUsageKey ?? m.usageKey;
  const anzahl = key ? (await holen(`${API}/occurrence/search?country=DE&taxonKey=${key}&limit=0`)).count : 0;
  const warnung =
    !key || m.matchType === 'NONE'
      ? 'nicht gefunden'
      : m.matchType !== 'EXACT'
        ? `Abgleich ${m.matchType}`
        : m.status !== 'ACCEPTED'
          ? `Synonym (${m.status})`
          : undefined;
  return {
    id: `t-${slug(name)}`,
    kategorie,
    name,
    // ohne Autorenkürzel, falls in der Liste eins steht
    lat: m.canonicalName ?? lat,
    gruppe: abschnitt.gruppe,
    ordnung: m.order ?? '?',
    familie: m.family ?? '?',
    gbifKey: key ?? null,
    beobachtungenDE: anzahl,
    gefahr: extra?.gefahr,
    farbe: abschnitt.farben[index % abschnitt.farben.length],
    vorlage: abschnitt.vorlage,
    warnung,
  };
}

/** Seltenheit aus der Zahl der Beobachtungen, je Kategorie: seltenste 6 % legendär, 14 % sehr selten, 30 % selten */
function seltenheitVergeben(arten) {
  const sortiert = [...arten].sort((a, b) => a.beobachtungenDE - b.beobachtungenDE);
  sortiert.forEach((a, i) => {
    const q = i / sortiert.length;
    a.seltenheit = q < 0.06 ? 4 : q < 0.2 ? 3 : q < 0.5 ? 2 : 1;
  });
}

const ergebnis = [];
for (const [kategorie, abschnitte] of Object.entries(LISTE)) {
  const arten = [];
  for (const abschnitt of abschnitte) {
    // je Abschnitt parallel, aber nicht zu viele Anfragen auf einmal
    for (let i = 0; i < abschnitt.arten.length; i += 6) {
      const teil = abschnitt.arten.slice(i, i + 6);
      arten.push(...(await Promise.all(teil.map((a, j) => eineArt(kategorie, abschnitt, a, i + j)))));
    }
  }
  seltenheitVergeben(arten);
  ergebnis.push(...arten);
  console.log(`${kategorie}: ${arten.length} Arten`);
}

const doppelt = ergebnis.filter((a, i) => ergebnis.findIndex((b) => b.id === a.id) !== i);
if (doppelt.length) console.warn('Doppelte IDs:', doppelt.map((a) => a.id).join(', '));
for (const a of ergebnis.filter((x) => x.warnung)) console.warn(`  ⚠ ${a.name} (${a.lat}): ${a.warnung}`);

writeFileSync(
  new URL('../src/data/testarten.json', import.meta.url),
  JSON.stringify(
    ergebnis.map(({ warnung, ...a }) => a),
    null,
    1,
  ) + '\n',
);
console.log(`Geschrieben: src/data/testarten.json (${ergebnis.length} Arten)`);
