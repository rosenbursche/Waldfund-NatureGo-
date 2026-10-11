import { ARTEN, artById } from '@/data/arten';
import type { Art, IconName, KategorieId, Seltenheit } from '@/data/artTypen';
import { baumById } from '@/data/baumarten';
import { MYSTERY_AB } from '@/data/spiel';
import type { Naturraum } from '@/data/typen';

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
  namensZeilen?: string[];
  raetsel?: string;
  lebensraum?: string;
};

export type KatalogGruppe = { name: string; eintraege: KatalogEintrag[] };

function ausArt(a: Art): KatalogEintrag {
  return {
    id: a.id,
    name: a.name,
    lat: a.lat,
    seltenheit: a.seltenheit,
    icon: a.icon,
    namensZeilen: a.namensZeilen,
    raetsel: a.raetsel,
    lebensraum: a.lebensraum,
  };
}

/** Findet einen Eintrag – egal ob Art aus dem Prototyp oder Baumart. */
export function katalogEintrag(id: string): KatalogEintrag | undefined {
  const art = artById[id];
  if (art) return ausArt(art);
  const baum = baumById[id];
  // Baumarten ohne eigenen Steckbrief gelten im Spiel vorerst als "häufig"
  if (baum) return { id: baum.id, name: baum.name, lat: baum.lat, seltenheit: 1, icon: 'tree' };
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
    const gruppe = artById[id]?.gruppe ?? 'Bäume';
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
