import { ARTEN, artById } from '@/data/arten';
import type { Art, IconName, KategorieId, ModellParameter, Seltenheit } from '@/data/artTypen';
import { baumById } from '@/data/baumarten';
import { MYSTERY_AB } from '@/data/spiel';
import type { BaumModell, Naturraum } from '@/data/typen';

import { getHeimischeBaeume } from './regelEngine';

/**
 * Welche Arten zählen in einer Kategorie?
 * Pflanzen = Arten aus dem Prototyp + die heimischen Baumarten des Naturraums.
 * (Stieleiche und Rotbuche gibt es in beiden Listen – sie zählen nur einmal.)
 */
export function artIdsDerKategorie(kategorie: KategorieId, naturraum?: Naturraum): string[] {
  const ids = ARTEN.filter((a) => a.kategorie === kategorie).map((a) => a.id);
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
  gruppe: string;
  namensZeilen?: string[];
  raetsel?: string;
  lebensraum?: string;
  /** Giftigkeit oder Gefahr – dann steht die Art in der Sektion "Gefährlich & tödlich" */
  gefahr?: string;
  /** für die individuellen Miniaturen im Stammbaum */
  modell?: ModellParameter;
  baumModell?: BaumModell;
};

/** Name der Sektion, die es in jeder Kategorie gibt */
export const GEFAHR_GRUPPE = 'Gefährlich & tödlich';

/** Sinnvolle Reihenfolge der Gruppen je Kategorie (unbekannte Gruppen kommen ans Ende) */
export const GRUPPEN_REIHENFOLGE: Record<KategorieId, string[]> = {
  pflanzen: ['Bäume', 'Büsche', 'Frühblüher', 'Waldboden & Wiese', 'Wiesen & Heiden', 'Moore', 'Orchideen'],
  pilze: ['Blätterpilze', 'Röhrlinge', 'Besondere Formen'],
  voegel: ['Singvögel', 'Spechte', 'Am Wasser', 'Eulen', 'Offenland'],
  saeuger: ['Wald', 'Feld & Garten', 'Am Wasser'],
};

export type KatalogGruppe = { name: string; eintraege: KatalogEintrag[] };

function ausArt(a: Art): KatalogEintrag {
  return {
    id: a.id,
    name: a.name,
    lat: a.lat,
    seltenheit: a.seltenheit,
    icon: a.icon,
    gruppe: a.gruppe,
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
  const art = artById[id];
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
  return ARTEN.filter((a) => a.seltenheit >= MYSTERY_AB && (!kategorie || a.kategorie === kategorie)).map(ausArt);
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

function nachGruppen(eintraege: KatalogEintrag[], kategorie: KategorieId): KatalogGruppe[] {
  const reihenfolge = GRUPPEN_REIHENFOLGE[kategorie];
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

export type Lebensbaum = {
  /** Hauptäste = Gruppen der Kategorie, jeweils von häufig bis selten sortiert */
  aeste: KatalogGruppe[];
  /** Sterne über der Krone = die seltensten Arten (ab "sehr selten"), legendäre zuerst */
  sterne: KatalogEintrag[];
  /** Schattenwurzeln = "Gefährlich & tödlich" */
  wurzeln: KatalogEintrag[];
};

/**
 * Aufbau des Lebensbaums einer Kategorie:
 * - Äste: die Gruppen (Bäume, Büsche, Eulen …) mit allen häufigen und seltenen Arten
 * - Sterne: sehr seltene und legendäre Arten (Mystery) – leuchten erst, wenn gefunden
 * - Wurzeln: gefährliche Arten
 * Jede Art steht genau einmal im Baum. Gruppen, die nur Mystery-Arten haben, bilden keinen Ast.
 */
export function lebensbaum(kategorie: KategorieId, naturraum?: Naturraum): Lebensbaum {
  const alle = artIdsDerKategorie(kategorie, naturraum)
    .map(katalogEintrag)
    .filter((e): e is KatalogEintrag => !!e);
  const ungefaehrlich = alle.filter((e) => !e.gefahr);
  const aeste = nachGruppen(
    ungefaehrlich.filter((e) => e.seltenheit < MYSTERY_AB),
    kategorie,
  );
  // stabile Sortierung: häufige nah am Ast, seltene an der Zweigspitze
  for (const a of aeste) a.eintraege.sort((x, y) => x.seltenheit - y.seltenheit);
  const sterne = ungefaehrlich.filter((e) => e.seltenheit >= MYSTERY_AB).sort((a, b) => b.seltenheit - a.seltenheit);
  return { aeste, sterne, wurzeln: gefahrEintraege(kategorie, naturraum) };
}

/** Arten der Sektion "Gefährlich & tödlich" – die seltensten zuerst */
export function gefahrEintraege(kategorie: KategorieId, naturraum?: Naturraum): KatalogEintrag[] {
  return artIdsDerKategorie(kategorie, naturraum)
    .map(katalogEintrag)
    .filter((e): e is KatalogEintrag => !!e && !!e.gefahr)
    .sort((a, b) => b.seltenheit - a.seltenheit);
}
