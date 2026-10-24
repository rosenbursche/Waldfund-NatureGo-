/**
 * Baut die Fundstücke für die App: node scripts/fundstuecke-bauen.mjs
 *
 * Liest die Recherche aus recherche/fundstuecke/*.json (je Gruppe, mit Quellen)
 * und schreibt src/data/fundstuecke.json (eine Liste, nur die Felder, die die App braucht).
 * Alle Angaben sind TODO fachlich prüfen (siehe recherche/fundstuecke/*.md).
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const ORDNER = 'recherche/fundstuecke';
const ZIEL = 'src/data/fundstuecke.json';

const arten = [];
for (const datei of readdirSync(ORDNER)
  .filter((d) => d.endsWith('.json'))
  .sort()) {
  const gruppe = JSON.parse(readFileSync(`${ORDNER}/${datei}`, 'utf8'));
  for (const a of gruppe.arten) {
    arten.push({
      artId: a.artId,
      // bisher nur die Pilotregion; weitere Naturräume kommen später dazu
      vorkommen: { 'lueneburger-heide': a.lueneburgerHeide },
      fundstuecke: a.fundstuecke.map((f) => ({
        id: f.id,
        name: f.name,
        typ: f.typ,
        kurz: f.kurz,
        erkennen: f.erkennen ?? [],
        ...(f.verwechslung ? { verwechslung: f.verwechslung } : {}),
        monate: f.monate,
        findbarkeit: f.findbarkeit,
        wo: f.wo,
        ...(f.schutz ? { schutz: f.schutz } : {}),
        quellen: f.quellen,
      })),
      quellen: Object.fromEntries(Object.entries(a.quellen).map(([id, q]) => [id, { titel: q.titel, url: q.url }])),
    });
  }
}

writeFileSync(ZIEL, JSON.stringify(arten, null, 1) + '\n');
console.log(`${arten.length} Arten, ${arten.reduce((n, a) => n + a.fundstuecke.length, 0)} Fundstücke → ${ZIEL}`);
