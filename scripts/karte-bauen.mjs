/**
 * Baut src/data/karte.json für die lebendige Deutschlandkarte auf der Artenseite.
 *
 * Ausführen:  node scripts/karte-bauen.mjs
 *
 * Quellen:
 * - Wuchsgebiete 2020 und Forstliche Großlandschaften 2011 (Thünen-Institut, dl-de/by-2-0)
 *   WFS https://inspire.thuenen.de/geoserver/wgwb/ows
 * - Flüsse: Natural Earth 1:10 Mio. "rivers_lake_centerlines" (gemeinfrei / Public Domain)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const CACHE = '.cache';
mkdirSync(CACHE, { recursive: true });

async function laden(datei, url) {
  if (existsSync(datei)) return;
  console.log('Lade', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download fehlgeschlagen: ${res.status} ${url}`);
  writeFileSync(datei, Buffer.from(await res.arrayBuffer()));
}

const WFS = (layer) =>
  `https://inspire.thuenen.de/geoserver/wgwb/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=wgwb:${layer}&outputFormat=application/json&srsName=EPSG:4326`;
await laden(`${CACHE}/wg_2020.json`, WFS('wg_2020'));
await laden(`${CACHE}/forstl_gl_2011.json`, WFS('forstl_gl_2011'));
await laden(`${CACHE}/ne_rivers.zip`, 'https://naciscdn.org/naturalearth/10m/physical/ne_10m_rivers_lake_centerlines.zip');
if (!existsSync(`${CACHE}/ne_10m_rivers_lake_centerlines.shp`)) execFileSync('unzip', ['-o', '-q', `${CACHE}/ne_rivers.zip`, '-d', CACHE]);

const ms = (...args) => execFileSync('npx', ['mapshaper', ...args], { stdio: 'ignore' });

// Wuchsgebiete: Teile je Gebiet verschmelzen, vereinfachen
ms(`${CACHE}/wg_2020.json`, '-dissolve', 'wg_bu', 'copy-fields=bez_bu_wg', '-simplify', '0.5%', 'keep-shapes', '-filter-islands', 'min-area=20km2', '-o', `${CACHE}/k_gebiete.json`, 'format=geojson', 'precision=0.001');
// Großlandschaften und Deutschland-Umriss (für den Zuschnitt der Flüsse)
ms(`${CACHE}/forstl_gl_2011.json`, '-dissolve', 'gl_name', '-simplify', '0.4%', 'keep-shapes', '-filter-islands', 'min-area=50km2', '-o', `${CACHE}/k_landschaften.json`, 'format=geojson', 'precision=0.001');
ms(`${CACHE}/forstl_gl_2011.json`, '-dissolve', '-o', `${CACHE}/k_de.json`, 'format=geojson');
ms(`${CACHE}/k_de.json`, '-simplify', '0.3%', 'keep-shapes', '-filter-islands', 'min-area=100km2', '-o', `${CACHE}/k_umriss.json`, 'format=geojson', 'precision=0.001');
// Große Flüsse (Natural Earth enthält in Deutschland u. a. Rhein, Donau, Elbe, Weser, Main, Mosel, Ems, Oder, Inn)
ms(
  `${CACHE}/ne_10m_rivers_lake_centerlines.shp`,
  '-clip', `${CACHE}/k_de.json`,
  '-simplify', '20%',
  '-o', `${CACHE}/k_fluesse.json`, 'format=geojson', 'precision=0.001',
);

const lese = (d) => JSON.parse(readFileSync(d, 'utf8')).features;

const karte = {
  quelle:
    '© Thünen-Institut 2026, Wuchsgebiete 2020 und Forstliche Großlandschaften (dl-de/by-2-0); Flüsse: Natural Earth (gemeinfrei)',
  gebiete: lese(`${CACHE}/k_gebiete.json`).map((f) => ({ id: f.properties.wg_bu, name: f.properties.bez_bu_wg, geo: f.geometry })),
  umriss: (() => {
    const j = JSON.parse(readFileSync(`${CACHE}/k_umriss.json`, 'utf8'));
    return j.features ? j.features[0].geometry : j.geometries[0];
  })(),
  landschaften: lese(`${CACHE}/k_landschaften.json`).map((f) => ({ name: f.properties.gl_name, geo: f.geometry })),
  fluesse: lese(`${CACHE}/k_fluesse.json`)
    .filter((f) => f.geometry)
    .map((f) => ({ name: f.properties.name_de ?? f.properties.name, geo: f.geometry })),
};
writeFileSync('src/data/karte.json', JSON.stringify(karte) + '\n');
console.log(`Fertig: ${karte.gebiete.length} Wuchsgebiete, ${karte.landschaften.length} Großlandschaften, ${karte.fluesse.length} Flussabschnitte → src/data/karte.json`);
