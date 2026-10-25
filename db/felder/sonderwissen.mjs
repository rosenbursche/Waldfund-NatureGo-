/**
 * Sonderwissen je Art: was es nur bei dieser einen Art gibt (docs/KONZEPT-GESAMT.md Abschnitt 11).
 * Anders als der feste Feldkatalog (db/felder/saeuger.mjs) hat jede Art beliebig viele Einträge zu diesen Themen.
 * Rechercheauftrag: recherche/sonderwissen/AUFTRAG.md
 */
export const THEMEN = [
  { id: 'verblueffend', name: 'Verblüffend', beschreibung: 'Überraschende Tatsache, die kaum jemand kennt' },
  { id: 'chemie', name: 'Inhaltsstoffe', beschreibung: 'Stoffe in der Art und was sie bewirken (z. B. Juglon der Walnuss)' },
  { id: 'beziehung', name: 'Beziehungen', beschreibung: 'Zusammenleben mit anderen Arten: Partner, Konkurrenz, wer von wem profitiert' },
  { id: 'koerper', name: 'Körper und Sinne', beschreibung: 'Besondere Fähigkeit, Sinn oder Rekord' },
  { id: 'verhalten', name: 'Verhalten', beschreibung: 'Auffälliges Verhalten, Sozialleben, Klugheit' },
  { id: 'oekologie', name: 'Rolle in der Natur', beschreibung: 'Was die Art für Boden, Wald oder andere Arten leistet' },
  { id: 'essbar', name: 'Essbar', beschreibung: 'Welche Teile essbar sind und wie, immer mit Sicherheitshinweis' },
  { id: 'rezept', name: 'Rezept', beschreibung: 'Einfaches Rezept mit Zutaten und Schritten, immer mit Sicherheitshinweis' },
  { id: 'giftig', name: 'Giftig', beschreibung: 'Welche Teile giftig sind, Wirkung, Verwechslungsgefahr' },
  { id: 'nutzung', name: 'Nutzung', beschreibung: 'Wie Menschen die Art nutzen oder genutzt haben (Holz, Färben, Handwerk). Keine Heilversprechen' },
  { id: 'geschichte', name: 'Geschichte und Mythen', beschreibung: 'Kulturgeschichte, Brauchtum, Sagen, Aberglaube' },
  { id: 'name', name: 'Name', beschreibung: 'Woher der deutsche oder wissenschaftliche Name kommt' },
  { id: 'mitmachen', name: 'Selbst ausprobieren', beschreibung: 'Was man vor Ort beobachten, riechen, hören oder fühlen kann, ohne etwas zu beschädigen' },
];

const THEMA_IDS = new Set(THEMEN.map((t) => t.id));
const BRAUCHT_SICHERHEIT = new Set(['essbar', 'rezept', 'giftig']);

/** Prüft eine Recherche-Datei (recherche/sonderwissen/<artId>.json). Gibt eine Liste von Fehlern zurück. */
export function pruefeSonderwissen(datei) {
  const fehler = [];
  const f = (text) => fehler.push(`${datei.artId ?? '?'}: ${text}`);
  for (const feld of ['artId', 'colId', 'wissName', 'gruppe']) if (!datei[feld]) f(`${feld} fehlt`);
  const quellen = datei.quellen ?? {};
  for (const [qid, q] of Object.entries(quellen)) {
    if (!q.titel || !/^https?:\/\//.test(q.url ?? '')) f(`Quelle ${qid} braucht titel und url`);
  }
  const ids = new Set();
  for (const e of datei.eintraege ?? []) {
    const wo = `Eintrag ${e.id ?? '?'}`;
    if (!e.id || ids.has(e.id)) f(`${wo}: id fehlt oder doppelt`);
    ids.add(e.id);
    if (!THEMA_IDS.has(e.thema)) f(`${wo}: unbekanntes Thema ${e.thema}`);
    if (!e.titel || !e.text) f(`${wo}: titel und text nötig`);
    if ((e.text ?? '').length > 600) f(`${wo}: text zu lang (höchstens 600 Zeichen)`);
    if (![1, 2, 3].includes(e.wow)) f(`${wo}: wow muss 1, 2 oder 3 sein`);
    if (!Array.isArray(e.quellen) || e.quellen.length === 0) f(`${wo}: keine Quelle`);
    for (const q of e.quellen ?? []) if (!quellen[q]) f(`${wo}: Quelle ${q} nicht in quellen`);
    if (e.monate != null && (!Array.isArray(e.monate) || e.monate.some((m) => !(m >= 1 && m <= 12)))) {
      f(`${wo}: monate müssen 1–12 sein`);
    }
    if (e.meldung && !e.monate) f(`${wo}: meldung braucht monate`);
    if (BRAUCHT_SICHERHEIT.has(e.thema) && !e.sicherheit) f(`${wo}: ${e.thema} braucht einen Sicherheitshinweis`);
    if (datei.gruppe === 'pilze' && ['essbar', 'rezept'].includes(e.thema) && !/sachverständig/i.test(e.sicherheit ?? '')) {
      f(`${wo}: bei Pilzen muss der Hinweis auf Pilzsachverständige stehen`);
    }
  }
  if ((datei.eintraege ?? []).length === 0) f('keine Einträge');
  return fehler;
}
