/**
 * Baut src/data/naturraeume.json aus den forstlichen Wuchsbezirken des Thünen-Instituts.
 *
 * Ausführen:  node scripts/naturraeume-bauen.mjs
 *
 * Quelle der Grenzen: Thünen-Institut, "Waldökologische Naturräume Deutschlands",
 * Layer "Wuchsbezirke 2020" (WFS https://inspire.thuenen.de/geoserver/wgwb/ows).
 * Lizenz: Datenlizenz Deutschland – Namensnennung – 2.0 (dl-de/by-2-0) bzw. GeoNutzV.
 * Pflicht-Namensnennung: "© Thünen-Institut" + Jahr des Abrufs.
 *
 * Die Grenzen sind echt (vereinfacht). Die Eigenschaften (Höhenstufe, Boden …)
 * habe ich für die Demo vergeben – sie müssen fachlich geprüft werden.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const CACHE = '.cache';
const ROH = `${CACHE}/wb_2020.json`;
const WFS =
  'https://inspire.thuenen.de/geoserver/wgwb/ows?service=WFS&version=2.0.0&request=GetFeature' +
  '&typeNames=wgwb:wb_2020&outputFormat=application/json&srsName=EPSG:4326';

// TODO fachlich prüfen: Großlandschaft, Höhenstufe und Böden sind grobe Demo-Einstufungen.
// "filter" wählt Wuchsgebiet (wg_bu) und ggf. Wuchsbezirke (wb_bu) aus den Thünen-Daten.
const NATURRAEUME = [
  {
    id: 'lueneburger-heide',
    name: 'Lüneburger Heide',
    grosslandschaft: 'tiefland',
    hoehenstufe: 'planar',
    boden: 'sandig',
    nebenboeden: ['feucht'],
    quelle: 'Wuchsgebiet 13, Wuchsbezirke Hohe Heide, Süd-Heide, Ost-Heide',
    filter: 'wg_bu==13 && [1,2,3].indexOf(wb_bu)>-1',
  },
  {
    id: 'mittelbrandenburg',
    name: 'Mittelbrandenburger Talsand- und Moränenland',
    grosslandschaft: 'tiefland',
    hoehenstufe: 'planar',
    boden: 'sandig',
    nebenboeden: ['feucht'],
    quelle: 'Wuchsgebiet 24',
    filter: 'wg_bu==24',
  },
  {
    id: 'ostholstein-westmecklenburg',
    name: 'Ostholsteinisch-Westmecklenburger Jungmoränenland',
    grosslandschaft: 'tiefland',
    hoehenstufe: 'planar',
    boden: 'kalkreich',
    nebenboeden: ['feucht'],
    quelle: 'Wuchsgebiet 5',
    filter: 'wg_bu==5',
  },
  {
    id: 'hochharz',
    name: 'Hochharz',
    grosslandschaft: 'mittelgebirge',
    hoehenstufe: 'hochmontan',
    boden: 'sauer',
    nebenboeden: ['feucht'],
    quelle: 'Wuchsgebiet 36 (Harz), Wuchsbezirk Hochharz',
    filter: 'wg_bu==36 && wb_bu==4',
  },
  {
    id: 'oberes-erzgebirge',
    name: 'Oberes Erzgebirge',
    grosslandschaft: 'mittelgebirge',
    hoehenstufe: 'montan',
    boden: 'sauer',
    nebenboeden: ['feucht'],
    quelle: 'Wuchsgebiet 56, Wuchsbezirke Westliches, Mittleres und Östliches Oberes Erzgebirge',
    filter: 'wg_bu==56 && [2,3,4].indexOf(wb_bu)>-1',
  },
  {
    id: 'innerer-bayerischer-wald',
    name: 'Innerer Bayerischer Wald',
    grosslandschaft: 'mittelgebirge',
    hoehenstufe: 'montan',
    boden: 'sauer',
    nebenboeden: ['feucht'],
    quelle: 'Wuchsgebiet 79, Wuchsbezirk Innerer Bayerischer Wald',
    filter: 'wg_bu==79 && wb_bu==3',
  },
  {
    id: 'schwarzwald',
    name: 'Schwarzwald',
    grosslandschaft: 'mittelgebirge',
    hoehenstufe: 'montan',
    boden: 'sauer',
    nebenboeden: [],
    quelle: 'Wuchsgebiet 73',
    filter: 'wg_bu==73',
  },
  {
    id: 'schwaebische-alb',
    name: 'Schwäbische Alb',
    grosslandschaft: 'mittelgebirge',
    hoehenstufe: 'submontan',
    boden: 'kalkreich',
    nebenboeden: [],
    quelle: 'Wuchsgebiet 76',
    filter: 'wg_bu==76',
  },
  {
    id: 'oberbayerische-jungmoraene',
    name: 'Oberbayerische Jungmoräne und Molassevorberge',
    grosslandschaft: 'alpenvorland',
    hoehenstufe: 'submontan',
    boden: 'kalkreich',
    nebenboeden: ['feucht'],
    quelle: 'Wuchsgebiet 81, Wuchsbezirk Oberbayerische Jungmoräne und Molassevorberge',
    filter: 'wg_bu==81 && wb_bu==4',
  },
  {
    id: 'bayerische-alpen',
    name: 'Bayerische Alpen',
    grosslandschaft: 'alpen',
    hoehenstufe: 'montan',
    boden: 'kalkreich',
    nebenboeden: ['feucht'],
    quelle: 'Wuchsgebiet 82',
    filter: 'wg_bu==82',
  },
];

// 1. Rohdaten einmalig herunterladen (ca. 55 MB, landet im ignorierten Ordner .cache)
if (!existsSync(ROH)) {
  mkdirSync(CACHE, { recursive: true });
  console.log('Lade Wuchsbezirke vom Thünen-Institut …');
  const res = await fetch(WFS);
  if (!res.ok) throw new Error(`Download fehlgeschlagen: ${res.status}`);
  writeFileSync(ROH, Buffer.from(await res.arrayBuffer()));
}

// 2. Für jeden Naturraum: Wuchsbezirke auswählen, verschmelzen, vereinfachen
const features = NATURRAEUME.map(({ filter, ...eigenschaften }) => {
  const ziel = `${CACHE}/${eigenschaften.id}.json`;
  execFileSync(
    'npx',
    [
      'mapshaper', ROH,
      '-filter', filter,
      '-dissolve',
      '-simplify', '1.5%', 'keep-shapes',
      '-filter-islands', 'min-area=5km2',
      '-o', ziel, 'format=geojson', 'precision=0.001',
    ],
    { stdio: 'ignore' },
  );
  const out = JSON.parse(readFileSync(ziel, 'utf8'));
  const geometry = out.features ? out.features[0].geometry : out.geometries[0];
  return { type: 'Feature', properties: { ...eigenschaften, pruefen: true }, geometry };
});

const ergebnis = {
  type: 'FeatureCollection',
  quelle: '© Thünen-Institut 2026, Waldökologische Naturräume Deutschlands (Wuchsbezirke 2020), dl-de/by-2-0, vereinfacht',
  features,
};
writeFileSync('src/data/naturraeume.json', JSON.stringify(ergebnis) + '\n');
console.log(`Fertig: ${features.length} Naturräume → src/data/naturraeume.json`);
