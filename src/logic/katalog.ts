import { ARTEN, artById } from '@/data/arten';
import type { Art, IconName, KategorieId, ModellParameter, Seltenheit } from '@/data/artTypen';
import { baumById } from '@/data/baumarten';
import { GEFAHR_REIHENFOLGE, GLIEDERUNG, NADELBAEUME } from '@/data/gliederung';
import { MYSTERY_AB, STERN_AB } from '@/data/spiel';
import { TESTARTEN, testGruppenReihenfolge } from '@/data/testarten';
import type { BaumModell, Naturraum } from '@/data/typen';

import { useEinstellungen } from '@/store/einstellungen';

import { saisonMonate } from './jahreszeit';
import { getHeimischeBaeume } from './regelEngine';
import { kommtVorIn } from './verbreitung';

// ---------- Belastungstest ----------

/** Die Arten, die der Katalog gerade zeigt: normal die App-Arten, im Belastungstest die 500 Testarten */
function aktiveArten(): Art[] {
  const e = useEinstellungen.getState();
  // __DEV__: in der Store-Version gibt es den Belastungstest nicht
  if (!(__DEV__ && e.belastungstest)) return ARTEN;
  // Absicherung: ein gespeicherter Wert aus einer anderen App-Version darf nie zum Absturz führen
  return TESTARTEN[e.testGruppierung] ?? TESTARTEN.konzept;
}

const testById = Object.fromEntries(
  Object.entries(TESTARTEN).map(([g, arten]) => [g, Object.fromEntries(arten.map((a) => [a.id, a]))]),
) as Record<keyof typeof TESTARTEN, Record<string, Art>>;

/** Art zu einer ID – Testarten mit der gerade gewählten Gruppierung */
function artFuer(id: string): Art | undefined {
  if (id.startsWith('t-')) return (testById[useEinstellungen.getState().testGruppierung] ?? testById.konzept)[id];
  return artById[id];
}

/**
 * Welche Arten zählen in einer Kategorie?
 * Pflanzen = Arten aus dem Prototyp + die heimischen Baumarten des Naturraums.
 * (Stieleiche und Rotbuche gibt es in beiden Listen – sie zählen nur einmal.)
 */
export function artIdsDerKategorie(kategorie: KategorieId, naturraum?: Naturraum): string[] {
  const ids = aktiveArten()
    .filter((a) => a.kategorie === kategorie)
    .map((a) => a.id);
  if (kategorie === 'pflanzen' && naturraum) {
    for (const b of getHeimischeBaeume(naturraum)) if (!ids.includes(b.baumart.id)) ids.push(b.baumart.id);
  }
  return ids;
}

export function fortschrittDerKategorie(
  kategorie: KategorieId,
  gefunden: Record<string, unknown>,
  naturraum?: Naturraum,
): { gefunden: number; gesamt: number; anteil: number } {
  const ids = artIdsDerKategorie(kategorie, naturraum);
  const n = ids.filter((id) => id in gefunden).length;
  return { gefunden: n, gesamt: ids.length, anteil: ids.length ? n / ids.length : 0 };
}

// ---------- Stammbaum ----------

/** Ein Eintrag im Katalog – gemeinsames Format für Arten aus dem Prototyp und Baumarten. */
export type KatalogEintrag = {
  id: string;
  name: string;
  lat: string;
  seltenheit: Seltenheit;
  icon: IconName;
  /** Ast im Lebensbaum */
  gruppe: string;
  /** Zweig am Ast (fehlt bei den Test-Gruppierungen Vorschlag/Familie/Ordnung) */
  zweig?: string;
  /** Grund, warum die Art der Schatz ihres Zweigs ist */
  besonders?: string;
  /** Saison-Text (z. B. "Blüte März–Mai") und Verbreitungs-Modell – für die Filter */
  saison?: string;
  verbreitung?: string;
  /** 1–3, nur bei gefährlichen Arten (siehe Art.gefahrStufe) */
  gefahrStufe?: 1 | 2 | 3;
  namensZeilen?: string[];
  raetsel?: string;
  lebensraum?: string;
  /** Giftigkeit oder Gefahr – dann steht die Art in der Sektion "Gefährlich & tödlich" */
  gefahr?: string;
  /** für die individuellen Miniaturen im Stammbaum */
  modell?: ModellParameter;
  baumModell?: BaumModell;
};

export type KatalogGruppe = { name: string; eintraege: KatalogEintrag[] };

/** Gefahrenstufe aus der Angabe der Art – sonst aus der Giftigkeit */
function gefahrStufeVon(a: Art): 1 | 2 | 3 | undefined {
  if (a.gefahrStufe) return a.gefahrStufe;
  if (a.giftig) return a.giftig.includes('tödlich') ? 3 : a.giftig.includes('sehr') ? 2 : 1;
  return a.gefahr ? 1 : undefined;
}

function ausArt(a: Art): KatalogEintrag {
  return {
    id: a.id,
    name: a.name,
    lat: a.lat,
    seltenheit: a.seltenheit,
    icon: a.icon,
    gruppe: a.gruppe,
    zweig: a.zweig,
    besonders: a.besonders,
    gefahrStufe: gefahrStufeVon(a),
    saison: a.saison,
    verbreitung: a.verbreitung,
    namensZeilen: a.namensZeilen,
    raetsel: a.raetsel,
    lebensraum: a.lebensraum,
    gefahr: a.giftig ?? a.gefahr,
    modell: a.modell,
    baumModell: baumById[a.id]?.modell,
  };
}

/** Findet einen Eintrag – egal ob Art aus dem Prototyp oder Baumart. */
export function katalogEintrag(id: string): KatalogEintrag | undefined {
  const art = artFuer(id);
  if (art) return ausArt(art);
  const baum = baumById[id];
  // Baumarten ohne eigenen Steckbrief gelten im Spiel vorerst als "häufig"
  if (baum)
    return {
      id: baum.id,
      name: baum.name,
      lat: baum.lat,
      seltenheit: 1,
      icon: 'tree',
      gruppe: 'Bäume',
      zweig: NADELBAEUME.has(baum.id) ? 'Nadelbäume' : 'Laubbäume',
      baumModell: baum.modell,
    };
  return undefined;
}

/**
 * Gruppen für den Stammbaum einer Kategorie (ohne Mystery-Arten).
 * Bei den Pflanzen kommen die heimischen Bäume des Naturraums in die Gruppe "Bäume".
 */
export function katalogGruppen(kategorie: KategorieId, naturraum?: Naturraum): KatalogGruppe[] {
  const gruppen: KatalogGruppe[] = [];
  for (const id of artIdsDerKategorie(kategorie, naturraum)) {
    const e = katalogEintrag(id);
    if (!e || e.seltenheit >= MYSTERY_AB) continue;
    const gruppe = e.gruppe;
    let g = gruppen.find((x) => x.name === gruppe);
    if (!g) gruppen.push((g = { name: gruppe, eintraege: [] }));
    g.eintraege.push(e);
  }
  return gruppen;
}

/** Sehr seltene und legendäre Arten – sie erscheinen nur als Rätsel, bis man sie findet. */
export function mysteryArten(kategorie?: KategorieId): KatalogEintrag[] {
  return aktiveArten()
    .filter((a) => a.seltenheit >= MYSTERY_AB && (!kategorie || a.kategorie === kategorie))
    .map(ausArt);
}

/** Ist die Art (noch) ein Geheimnis? */
export function istVerborgen(id: string, gefunden: Record<string, unknown>): boolean {
  return !(id in gefunden) && (katalogEintrag(id)?.seltenheit ?? 1) >= MYSTERY_AB;
}

// ---------- Vitrine am Runenstein ----------

/**
 * Welche gefundenen Arten schweben um den Runenstein einer Kategorie?
 * Nicht alle – höchstens `max`: die seltensten zuerst, bei Gleichstand die neuesten Funde.
 */
export function vitrinenArten(
  kategorie: KategorieId,
  gefunden: Record<string, { datum: string }>,
  naturraum?: Naturraum,
  max = 3,
): string[] {
  return artIdsDerKategorie(kategorie, naturraum)
    .filter((id) => id in gefunden)
    .map((id) => ({ id, s: katalogEintrag(id)?.seltenheit ?? 1, d: gefunden[id].datum }))
    .sort((a, b) => b.s - a.s || b.d.localeCompare(a.d))
    .slice(0, max)
    .map((x) => x.id);
}

// ---------- Plätze im Kategorie-Wald ----------

export type WaldPlatz = { id: string; x: number; z: number; hoch: boolean };

/**
 * Verteilt die Arten einer Kategorie natürlich im Wald:
 * spiralförmig um die Mitte (goldener Winkel), damit sich nichts überdeckt.
 * Vögel sitzen erhöht (auf einem Ast/Baumstumpf), alle anderen am Boden.
 */
export function waldPlaetze(kategorie: KategorieId, naturraum?: Naturraum): WaldPlatz[] {
  const ids = [
    ...katalogGruppen(kategorie, naturraum).flatMap((g) => g.eintraege.map((e) => e.id)),
    ...mysteryArten(kategorie).map((e) => e.id),
  ];
  return ids.map((id, i) => {
    const winkel = i * 2.39996; // goldener Winkel
    const radius = 1.6 + Math.sqrt(i) * 1.55;
    return { id, x: Math.cos(winkel) * radius, z: Math.sin(winkel) * radius, hoch: kategorie === 'voegel' };
  });
}

/** Reihenfolge der Äste: feste Gliederung – nur die alten Test-Gruppierungen sortieren anders */
function astReihenfolge(kategorie: KategorieId): string[] {
  const e = useEinstellungen.getState();
  if (__DEV__ && e.belastungstest && e.testGruppierung !== 'konzept')
    return testGruppenReihenfolge(kategorie, e.testGruppierung);
  return GLIEDERUNG[kategorie].map((a) => a.name);
}

function nachGruppen(eintraege: KatalogEintrag[], kategorie: KategorieId): KatalogGruppe[] {
  const reihenfolge = astReihenfolge(kategorie);
  const rang = (g: string) => (reihenfolge.includes(g) ? reihenfolge.indexOf(g) : reihenfolge.length);
  const gruppen: KatalogGruppe[] = [];
  for (const e of eintraege) {
    let g = gruppen.find((x) => x.name === e.gruppe);
    if (!g) gruppen.push((g = { name: e.gruppe, eintraege: [] }));
    g.eintraege.push(e);
  }
  return gruppen.sort((a, b) => rang(a.name) - rang(b.name));
}

// ---------- Lebensbaum (Stammbaum-Ansicht) ----------

/** Ein Zweig am Ast: ein kleines Sammelset mit seinem Schatz */
export type KatalogZweig = {
  name: string;
  /** häufige zuerst, seltene an der Zweigspitze */
  eintraege: KatalogEintrag[];
  /** ID des Zweig-Schatzes (sehr seltene oder besondere Art) */
  schatz?: string;
};

/** Ein Hauptast: alle Arten (flach, für Zählungen) und dieselben Arten nach Zweigen */
export type LebensAst = KatalogGruppe & {
  zweige: KatalogZweig[];
  /** kurzer Name für den Knopf am Baum */
  kurz: string;
  /** Meisterast: schwer zu finden (nachts, sehr klein oder sehr scheu) */
  mond?: boolean;
};

export type Lebensbaum = {
  /** Hauptäste in der Reihenfolge der Gliederung – jede Art steht genau einmal an einem Zweig */
  aeste: LebensAst[];
  /** Sterne über der Krone = die legendären Arten (zweite Sicht, sie hängen auch an ihrem Zweig) */
  sterne: KatalogEintrag[];
  /** toter Ast über der Krone = alle gefährlichen Arten (zweite Sicht, sie hängen auch an ihrem Zweig) */
  toterAst: KatalogEintrag[];
};

/**
 * Der Schatz eines Zweigs: die seltenste Art ab „sehr selten“; gibt es keine,
 * die als besonders markierte Art; sonst die seltenste Art des Zweigs.
 */
export function zweigSchatz(eintraege: KatalogEintrag[]): string | undefined {
  if (!eintraege.length) return undefined;
  const seltenste = eintraege.reduce((a, b) => (b.seltenheit > a.seltenheit ? b : a));
  if (seltenste.seltenheit >= MYSTERY_AB) return seltenste.id;
  return (eintraege.find((e) => e.besonders) ?? seltenste).id;
}

/** Fortschritt eines Zweigs */
export function zweigFortschritt(z: KatalogZweig, gefunden: Record<string, unknown>) {
  const n = z.eintraege.filter((e) => e.id in gefunden).length;
  return {
    gefunden: n,
    gesamt: z.eintraege.length,
    fehlt: z.eintraege.length - n,
    voll: n === z.eintraege.length,
    schatzGefunden: !!z.schatz && z.schatz in gefunden,
  };
}

/** Teilt die Arten eines Astes in seine Zweige (Reihenfolge wie in der Gliederung) */
function zweigeVon(kategorie: KategorieId, ast: KatalogGruppe): KatalogZweig[] {
  const plan = GLIEDERUNG[kategorie].find((a) => a.name === ast.name)?.zweige ?? [];
  const rang = (z: string) => (plan.includes(z) ? plan.indexOf(z) : plan.length);
  const zweige: KatalogZweig[] = [];
  for (const e of ast.eintraege) {
    const name = e.zweig ?? ast.name;
    let z = zweige.find((x) => x.name === name);
    if (!z) zweige.push((z = { name, eintraege: [] }));
    z.eintraege.push(e);
  }
  for (const z of zweige) {
    // stabile Sortierung: häufige nah am Ast, seltene an der Zweigspitze
    z.eintraege.sort((a, b) => a.seltenheit - b.seltenheit);
    z.schatz = zweigSchatz(z.eintraege);
  }
  return zweige.sort((a, b) => rang(a.name) - rang(b.name));
}

/**
 * Aufbau des Lebensbaums einer Kategorie (Konzept: docs/KONZEPT-STAMMBAUM-GLIEDERUNG.md):
 * - Äste → Zweige → Arten: jede Art genau einmal, auch gefährliche und sehr seltene
 * - Sterne: die legendären Arten, zusätzlich über der Krone
 * - toter Ast: die gefährlichen Arten, zusätzlich am toten Ast über der Krone
 */
export function lebensbaum(kategorie: KategorieId, naturraum?: Naturraum): Lebensbaum {
  const alle = artIdsDerKategorie(kategorie, naturraum)
    .map(katalogEintrag)
    .filter((e): e is KatalogEintrag => !!e);
  const aeste = nachGruppen(alle, kategorie).map((g) => {
    const plan = GLIEDERUNG[kategorie].find((a) => a.name === g.name);
    return {
      ...g,
      eintraege: [...g.eintraege].sort((a, b) => a.seltenheit - b.seltenheit),
      zweige: zweigeVon(kategorie, g),
      kurz: plan?.kurz ?? g.name,
      mond: plan?.mond,
    };
  });
  const sterne = alle.filter((e) => e.seltenheit >= STERN_AB).sort((a, b) => b.seltenheit - a.seltenheit);
  return { aeste, sterne, toterAst: gefahrEintraege(kategorie, naturraum) };
}

/** Alle Arten des Lebensbaums, jede genau einmal */
export function alleImBaum(baum: Lebensbaum): KatalogEintrag[] {
  return baum.aeste.flatMap((a) => a.eintraege);
}

/** Arten der Sektion "Gefährlich & tödlich" – die seltensten zuerst */
export function gefahrEintraege(kategorie: KategorieId, naturraum?: Naturraum): KatalogEintrag[] {
  return artIdsDerKategorie(kategorie, naturraum)
    .map(katalogEintrag)
    .filter((e): e is KatalogEintrag => !!e && !!e.gefahr)
    .sort((a, b) => b.seltenheit - a.seltenheit);
}

// ---------- Filter im Stammbaum (dunkeln ab, verstecken nie) ----------

export type StammbaumFilter = 'alle' | 'fehlt' | 'hier' | 'saison';

/**
 * Passt die Art zum Filter? Arten, die nicht passen, werden im Stammbaum nur abgedunkelt –
 * so bleibt die ganze Größe der Sammlung sichtbar.
 * - fehlt: noch nicht gefunden
 * - hier: kommt im Naturraum vor (Baumarten im Katalog sind dort ohnehin heimisch)
 * - saison: man findet sie im Monat `monat` (1–12); ohne Saison-Angabe gilt sie als passend
 */
export function passtZumFilter(
  e: KatalogEintrag,
  filter: StammbaumFilter,
  gefunden: Record<string, unknown>,
  naturraum: Naturraum | undefined,
  monat: number,
): boolean {
  if (filter === 'fehlt') return !(e.id in gefunden);
  if (filter === 'hier') return !naturraum || !!e.baumModell || kommtVorIn(e.id, e.verbreitung ?? 'all', naturraum);
  if (filter === 'saison') {
    const m = saisonMonate(e.saison);
    return !m || m.includes(monat);
  }
  return true;
}

// ---------- Sammelsets: Zweige und Äste vollenden ----------

/**
 * Welche Zweige und Äste schließt der Fund `id` ab? (Für den Bonus: ZWEIG_BONUS / AST_BONUS in spiel.ts)
 * `vorher` sind die bisher echt gesammelten Arten. War die Art schon dabei, gibt es nichts.
 */
export function vollendeteSets(
  id: string,
  vorher: Set<string>,
  naturraum?: Naturraum,
): { zweige: string[]; aeste: string[] } {
  const leer = { zweige: [], aeste: [] };
  if (vorher.has(id)) return leer;
  const kategorie = artFuer(id)?.kategorie ?? (baumById[id] ? 'pflanzen' : undefined);
  if (!kategorie) return leer;
  const nachher = new Set(vorher).add(id);
  const voll = (eintraege: KatalogEintrag[]) => eintraege.every((e) => nachher.has(e.id));
  const zweige: string[] = [];
  const aeste: string[] = [];
  for (const ast of lebensbaum(kategorie, naturraum).aeste) {
    if (!ast.eintraege.some((e) => e.id === id)) continue;
    const zweig = ast.zweige.find((z) => z.eintraege.some((e) => e.id === id));
    if (zweig && voll(zweig.eintraege)) zweige.push(zweig.name);
    if (voll(ast.eintraege)) aeste.push(ast.name);
  }
  return { zweige, aeste };
}

// ---------- Schatzkammer unter dem Baum ----------

/** Rang in der festen Gefahren-Reihenfolge (unbekannt = hinten) */
function gefahrRang(e: KatalogEintrag): number {
  const i = GEFAHR_REIHENFOLGE.indexOf(e.lat);
  return i < 0 ? GEFAHR_REIHENFOLGE.length : i;
}

/**
 * Schatzkammer einer Rune: die seltensten Arten (legendäre zuerst) und die gefährlichsten
 * (nach Gefahrenstufe, bei Gleichstand nach der festen Reihenfolge, dann nach Seltenheit).
 */
export function schatzkammer(
  kategorie: KategorieId,
  naturraum?: Naturraum,
  anzahl = { selten: 5, gefahr: 3 },
): { seltenste: KatalogEintrag[]; gefaehrlichste: KatalogEintrag[] } {
  const alle = artIdsDerKategorie(kategorie, naturraum)
    .map(katalogEintrag)
    .filter((e): e is KatalogEintrag => !!e);
  return schatzkammerAus(alle, anzahl);
}

/** Schatzkammer aus einer fertigen Artenliste (z. B. `alleImBaum(baum)`) */
export function schatzkammerAus(
  alle: KatalogEintrag[],
  anzahl = { selten: 5, gefahr: 3 },
): { seltenste: KatalogEintrag[]; gefaehrlichste: KatalogEintrag[] } {
  const seltenste = [...alle]
    .filter((e) => e.seltenheit >= 2)
    .sort((a, b) => b.seltenheit - a.seltenheit)
    .slice(0, anzahl.selten);
  const gefaehrlichste = alle
    .filter((e) => e.gefahr)
    .sort(
      (a, b) =>
        (b.gefahrStufe ?? 1) - (a.gefahrStufe ?? 1) || gefahrRang(a) - gefahrRang(b) || b.seltenheit - a.seltenheit,
    )
    .slice(0, anzahl.gefahr);
  return { seltenste, gefaehrlichste };
}
