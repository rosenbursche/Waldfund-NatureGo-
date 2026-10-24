/**
 * Baut die Arten-Datenbank db/wildfund.sqlite aus den heutigen App-Daten: node scripts/db-bauen.mjs
 *
 * Bisher: die 10 Säugetiere (Schritt D2 in docs/DATENBANK-ARTEN.md).
 * - Schicht 1 Wissen: Datenpunkte nach dem Feldkatalog (db/felder/saeuger.mjs) → Tabelle `angabe`
 * - Schicht 2 Medien: Fotos der Tierseiten mit Lizenz → `medium`
 * - Schicht 3 Gestaltung: alles, was nur das Zeichnen betrifft → `gestaltung`
 * - dazu Quellen, Fundstücke, Vorkommen Lüneburger Heide, Verbreitung (TK25) und der Datenstand
 *
 * Danach prüft das Skript den Rückweg: Aus der Datenbank werden Artendaten, Steckbrief und Tierseite wieder
 * zusammengesetzt und mit dem Original verglichen. So geht beim Umzug nichts verloren.
 */
import './ts-laden.mjs';

import { deepStrictEqual } from 'node:assert';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

import { FELDER_SAEUGER } from '../db/felder/saeuger.mjs';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATEI = join(WURZEL, 'db', 'wildfund.sqlite');

const { ARTEN } = await import('../src/data/arten.ts');
const { STECKBRIEFE } = await import('../src/data/steckbriefe.ts');
const { TIER_SEITEN } = await import('../src/data/tierSeiten.ts');
const { FOTOS } = await import('../src/data/fotos.ts');
const FUNDSTUECKE = JSON.parse(readFileSync(join(WURZEL, 'src/data/fundstuecke.json'), 'utf8'));

if (existsSync(DATEI)) rmSync(DATEI);
const db = new DatabaseSync(DATEI);
db.exec(readFileSync(join(WURZEL, 'db', 'schema.sql'), 'utf8'));

const json = (w) => JSON.stringify(w);
const einfuegen = (tabelle, zeile) => {
  const spalten = Object.keys(zeile);
  db.prepare(`INSERT INTO ${tabelle} (${spalten.join(', ')}) VALUES (${spalten.map(() => '?').join(', ')})`).run(
    ...Object.values(zeile),
  );
};

// Teile der App-Daten, die keine Fakten sind, sondern Gestaltung (Schicht 3)
const KOERPER_PUNKT = ['x', 'y'];

/** Wert aus den App-Daten nach `app`-Pfad (art.x, steckbrief.x, seite.x) */
function appWert(quellen, pfad) {
  const [teil, schluessel] = pfad.split('.');
  return quellen[teil]?.[schluessel];
}

/** Wert für die Datenbank: Gestaltungsteile herausnehmen */
function wissen(feld, wert) {
  if (feld.id === 'koerper_merkmale')
    return wert.map((k) => Object.fromEntries(Object.entries(k).filter(([s]) => !KOERPER_PUNKT.includes(s))));
  if (feld.id === 'lebensraum_orte') {
    const { panorama: _panorama, ...rest } = wert;
    return rest;
  }
  return wert;
}

db.exec('BEGIN');
for (const f of FELDER_SAEUGER) {
  einfuegen('feld', {
    id: f.id,
    gruppe: 'saeuger',
    kapitel: f.kapitel,
    typ: f.typ,
    pflicht: f.pflicht ? 1 : 0,
    beschreibung: f.beschreibung,
    reihenfolge: FELDER_SAEUGER.indexOf(f),
  });
}

const saeuger = ARTEN.filter((a) => a.kategorie === 'saeuger');
const genutzt = {
  art: new Set(['id', 'kategorie', 'name', 'lat']),
  steckbrief: new Set(),
  seite: new Set(['quellen']),
};
for (const f of FELDER_SAEUGER) if (f.app) genutzt[f.app.split('.')[0]].add(f.app.split('.')[1]);

for (const art of saeuger) {
  const seite = TIER_SEITEN[art.id];
  const steckbrief = STECKBRIEFE[art.id];
  const quellen = { art, steckbrief, seite };
  einfuegen('art', { id: art.id, gruppe: 'saeuger', wiss_name: art.lat, in_app: 1 });
  einfuegen('name', { art_id: art.id, sprache: 'de', name: art.name, haupt: 1 });

  // Quellen der Tierseite (bisher je Art, nicht je Datenpunkt)
  const quellIds = (seite?.quellen ?? []).map((q) => `${art.id}:${q.id}`);
  for (const q of seite?.quellen ?? []) einfuegen('quelle', { id: `${art.id}:${q.id}`, titel: q.titel, url: q.url });

  // Schicht 1: Datenpunkte
  for (const f of FELDER_SAEUGER) {
    if (!f.app) continue;
    const wert = appWert(quellen, f.app);
    if (wert === undefined) continue;
    einfuegen('angabe', {
      art_id: art.id,
      feld_id: f.id,
      wert: json(wissen(f, wert)),
      // Bisher stehen die Belege nur je Art (und in Code-Kommentaren) – je Datenpunkt ordnen die Agenten sie neu zu
      quelle_ids: json([]),
      status: 'uebernommen',
    });
  }

  // Schicht 3: Gestaltung = alles, was der Katalog nicht abdeckt
  const rest = (obj, teil) =>
    obj ? Object.fromEntries(Object.entries(obj).filter(([s]) => !genutzt[teil].has(s))) : undefined;
  const gestaltung = {
    art: rest(art, 'art'),
    steckbrief: rest(steckbrief, 'steckbrief'),
    seite: rest(seite, 'seite'),
    koerperPunkte: seite?.koerper.map((k) => ({ id: k.id, x: k.x, y: k.y })),
    panorama: seite?.lebensraum.panorama,
    quellen: quellIds,
    hatSteckbrief: !!steckbrief,
    hatSeite: !!seite,
  };
  einfuegen('gestaltung', { art_id: art.id, daten: json(gestaltung) });

  // Schicht 2: Fotos mit Lizenz und Platz auf der Seite
  const plaetze = new Map();
  const sammle = (wert, pfad) => {
    if (typeof wert === 'string' && FOTOS[wert]) plaetze.set(wert, [...(plaetze.get(wert) ?? []), pfad]);
    else if (wert && typeof wert === 'object')
      for (const [s, w] of Object.entries(wert)) sammle(w, pfad ? `${pfad}.${s}` : s);
  };
  sammle(seite?.fotos, '');
  sammle(seite?.lebensraum.panorama, 'panorama');
  for (const [id, p] of plaetze) {
    const foto = FOTOS[id];
    if (!db.prepare('SELECT 1 FROM medium WHERE id = ?').get(id))
      einfuegen('medium', {
        id,
        datei: String(foto.quelle).replace(/^(\.\.\/)+/, ''),
        seite: foto.seite,
        autor: foto.autor,
        lizenz: foto.lizenz,
        lizenz_url: foto.lizenzUrl,
        breite: foto.breite,
        hoehe: foto.hoehe,
        geprueft: 1,
      });
    for (const platz of p) einfuegen('medium_platz', { medium_id: id, art_id: art.id, platz });
  }

  // Fundstücke und Vorkommen (Recherche vom 24.10.2026)
  const fs = FUNDSTUECKE.find((a) => a.artId === art.id);
  if (fs) {
    fs.fundstuecke.forEach((f, i) =>
      einfuegen('fundstueck', { art_id: art.id, id: f.id, reihenfolge: i, daten: json(f) }),
    );
    for (const [id, q] of Object.entries(fs.quellen)) {
      const qid = `${art.id}:fs-${id}`;
      einfuegen('quelle', { id: qid, titel: q.titel, url: q.url });
    }
    for (const [gebiet, status] of Object.entries(fs.vorkommen)) {
      einfuegen('vorkommen', { art_id: art.id, gebiet, status });
    }
  }
  einfuegen('vorkommen', { art_id: art.id, gebiet: 'DE', status: 'heimisch', seltenheit: art.seltenheit });

  // Verbreitung in Deutschland (TK25-Raster aus GBIF)
  const nachweisDatei = join(WURZEL, 'src/data/nachweise', `${art.id}.json`);
  if (existsSync(nachweisDatei)) {
    const { zellen, ...info } = JSON.parse(readFileSync(nachweisDatei, 'utf8'));
    einfuegen('verbreitung_quelle', { art_id: art.id, raster: 'tk25', info: json(info) });
    for (const [zelle, n] of Object.entries(zellen)) {
      einfuegen('zelle', { art_id: art.id, raster: 'tk25', zelle, nachweise: n });
    }
  }
}
db.exec('COMMIT');

// ---------- Datenstand ----------
const pflicht = FELDER_SAEUGER.filter((f) => f.pflicht);
for (const { id } of saeuger) {
  const da = new Set(
    db
      .prepare('SELECT feld_id FROM angabe WHERE art_id = ?')
      .all(id)
      .map((r) => r.feld_id),
  );
  const fehlt = pflicht.filter((f) => !da.has(f.id)).map((f) => f.id);
  const plaetze = db
    .prepare('SELECT platz FROM medium_platz WHERE art_id = ?')
    .all(id)
    .map((r) => r.platz);
  const fund = db
    .prepare('SELECT daten FROM fundstueck WHERE art_id = ?')
    .all(id)
    .map((r) => JSON.parse(r.daten));
  const zeichen = fund.filter((f) => !['sichtung', 'ganz'].includes(f.typ)).length;
  const sichtung = fund.some((f) => f.typ === 'sichtung');
  const punkte =
    50 * ((pflicht.length - fehlt.length) / pflicht.length) +
    15 * (plaetze.includes('hero') ? 1 : 0) +
    15 * ((Math.min(zeichen, 4) + (sichtung ? 1 : 0)) / 5) +
    15 * 0 + // Referenz- und Testbilder: noch keine
    5 * 0; // Erkennungstest: noch nicht
  if (!plaetze.includes('hero')) fehlt.push('bild:hero');
  fehlt.push('referenzbilder', 'erkennungstest');
  einfuegen('datenstand', {
    art_id: id,
    vollstaendig: Math.round(punkte),
    fehlt: json(fehlt),
    app_vorschlag: punkte >= 80 ? 'ja' : 'offen',
  });
}

// ---------- Rückweg prüfen ----------
const lies = (art) => {
  const g = JSON.parse(db.prepare('SELECT daten FROM gestaltung WHERE art_id = ?').get(art).daten);
  const zeile = db.prepare('SELECT * FROM art WHERE id = ?').get(art);
  const name = db.prepare("SELECT name FROM name WHERE art_id = ? AND sprache = 'de' AND haupt = 1").get(art).name;
  const teile = {
    art: { id: art, kategorie: zeile.gruppe, name, lat: zeile.wiss_name, ...g.art },
    steckbrief: { ...g.steckbrief },
    seite: { ...g.seite },
  };
  for (const a of db.prepare('SELECT feld_id, wert FROM angabe WHERE art_id = ?').all(art)) {
    const f = FELDER_SAEUGER.find((x) => x.id === a.feld_id);
    const [teil, schluessel] = f.app.split('.');
    teile[teil][schluessel] = JSON.parse(a.wert);
  }
  if (g.hatSeite) {
    teile.seite.koerper = teile.seite.koerper.map((k) => {
      const p = g.koerperPunkte.find((x) => x.id === k.id);
      const { id, ...ohneId } = k;
      return { id, x: p.x, y: p.y, ...ohneId };
    });
    if (g.panorama) teile.seite.lebensraum = { ...teile.seite.lebensraum, panorama: g.panorama };
    if (g.quellen.length)
      teile.seite.quellen = g.quellen.map((qid) => {
        const q = db.prepare('SELECT titel, url FROM quelle WHERE id = ?').get(qid);
        return { id: qid.slice(art.length + 1), titel: q.titel, url: q.url };
      });
  }
  return {
    art: teile.art,
    steckbrief: g.hatSteckbrief ? teile.steckbrief : undefined,
    seite: g.hatSeite ? teile.seite : undefined,
  };
};

const ohneUndefiniert = (w) => JSON.parse(JSON.stringify(w ?? null));
for (const art of saeuger) {
  const r = lies(art.id);
  deepStrictEqual(ohneUndefiniert(r.art), ohneUndefiniert(art), `Artendaten ${art.id}`);
  deepStrictEqual(ohneUndefiniert(r.steckbrief), ohneUndefiniert(STECKBRIEFE[art.id]), `Steckbrief ${art.id}`);
  deepStrictEqual(ohneUndefiniert(r.seite), ohneUndefiniert(TIER_SEITEN[art.id]), `Tierseite ${art.id}`);
}

// ---------- Tabellenansicht: jede Art eine Zeile, jeder Datenpunkt eine Spalte ----------
const spalten = FELDER_SAEUGER.map(
  (f) => `(SELECT wert FROM angabe WHERE art_id = art.id AND feld_id = '${f.id}') AS "${f.id}"`,
);
db.exec(`CREATE VIEW uebersicht_saeuger AS
  SELECT art.id, name.name, art.wiss_name, datenstand.vollstaendig, ${spalten.join(', ')},
    (SELECT count(*) FROM fundstueck WHERE art_id = art.id) AS fundstuecke,
    (SELECT count(*) FROM medium_platz WHERE art_id = art.id) AS fotoplaetze,
    (SELECT count(*) FROM zelle WHERE art_id = art.id) AS rasterzellen
  FROM art JOIN name ON name.art_id = art.id AND name.haupt = 1 AND name.sprache = 'de'
  LEFT JOIN datenstand ON datenstand.art_id = art.id
  WHERE art.gruppe = 'saeuger'`);

// Zum Ansehen ohne Datenbank-Programm (GitHub zeigt CSV als Tabelle): nur Text, Listen gekürzt
const zeilen = db.prepare('SELECT * FROM uebersicht_saeuger ORDER BY vollstaendig DESC').all();
const zelleText = (w) => {
  if (w === null || w === undefined) return '';
  let t = String(w);
  try {
    const j = JSON.parse(t);
    if (typeof j === 'string' || typeof j === 'number') t = String(j);
    else if (Array.isArray(j))
      t = `[${j.length}] ` + j.map((x) => x?.kurz ?? x?.titel ?? (typeof x === 'object' ? '…' : x)).join(' · ');
    else t = Object.keys(j).join(', ');
  } catch {
    // kein JSON – Text so lassen
  }
  return `"${t.replace(/"/g, '""').slice(0, 200)}"`;
};
mkdirSync(join(WURZEL, 'db', 'export'), { recursive: true });
writeFileSync(
  join(WURZEL, 'db', 'export', 'saeuger.csv'),
  [Object.keys(zeilen[0]).join(','), ...zeilen.map((z) => Object.values(z).map(zelleText).join(','))].join('\n') + '\n',
);

const zahl = (sql) => db.prepare(sql).get().n;
console.log(`${saeuger.length} Säugetiere → ${DATEI}`);
console.log(
  `Datenpunkte ${zahl('SELECT count(*) n FROM angabe')} · Fotos ${zahl('SELECT count(*) n FROM medium')} · ` +
    `Quellen ${zahl('SELECT count(*) n FROM quelle')} · Fundstücke ${zahl('SELECT count(*) n FROM fundstueck')} · ` +
    `Rasterzellen ${zahl('SELECT count(*) n FROM zelle')}`,
);
console.log('Rückweg geprüft: Artendaten, Steckbriefe und Tierseiten sind unverändert.');
console.table(
  db.prepare('SELECT art_id, vollstaendig, app_vorschlag, fehlt FROM datenstand ORDER BY vollstaendig DESC').all(),
);
db.close();
