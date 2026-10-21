import { ARTEN } from '@/data/arten';
import type { Art } from '@/data/artTypen';
import {
  AST_BONUS,
  KATEGORIEN,
  LEVEL_SCHWELLEN,
  RAENGE,
  SELTENHEIT,
  SERIE_AP_PRO_TAG,
  SERIE_MAX_BONUS,
  ZWEIG_BONUS,
} from '@/data/spiel';

/**
 * Reine Rechenfunktionen für Punkte, Level, Serien und Erfolge.
 * "Rein" heißt: Sie speichern nichts und haben keine Nebenwirkungen –
 * dadurch lassen sie sich einfach testen.
 */

/** Level-Index (0 = Level 1) für eine Punktzahl */
export function levelIndex(ap: number): number {
  let l = 0;
  while (l < LEVEL_SCHWELLEN.length - 1 && ap >= LEVEL_SCHWELLEN[l + 1]) l++;
  return l;
}

export type LevelInfo = {
  /** Level für die Anzeige, beginnt bei 1 */
  level: number;
  rang: string;
  /** Fortschritt zum nächsten Level, 0–1 */
  fortschritt: number;
  /** fehlende AP bis zum nächsten Level */
  fehlend: number;
};

export function levelInfo(ap: number): LevelInfo {
  const l = levelIndex(ap);
  const von = LEVEL_SCHWELLEN[l];
  // Nach dem letzten Level geht es in 1000er-Schritten weiter (wie im Prototyp)
  const bis = LEVEL_SCHWELLEN[l + 1] ?? von + 1000;
  return {
    level: l + 1,
    rang: RAENGE[l],
    fortschritt: Math.min(1, (ap - von) / (bis - von)),
    fehlend: Math.max(0, bis - ap),
  };
}

/** Datum als "JJJJ-MM-TT" in der Ortszeit des Handys (nicht UTC – sonst springt der Tag um 1 bzw. 2 Uhr nachts). */
export function tagesKey(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const tt = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${tt}`;
}

function vortag(d: Date): string {
  const v = new Date(d);
  v.setDate(v.getDate() - 1);
  return tagesKey(v);
}

/**
 * Serie berechnen, wenn heute etwas gefunden wird.
 * - Schon heute gefunden: Serie bleibt, kein neuer Bonus.
 * - Gestern zuletzt gefunden: Serie + 1.
 * - Sonst: Serie beginnt neu bei 1.
 * Bonus: ab Tag 2 je 5 AP pro Tag, höchstens 50.
 */
export function neueSerie(
  letzterTag: string | null,
  serie: number,
  jetzt: Date,
): { serie: number; letzterTag: string; bonus: number } {
  const heute = tagesKey(jetzt);
  if (letzterTag === heute) return { serie, letzterTag: heute, bonus: 0 };
  const neu = letzterTag === vortag(jetzt) ? serie + 1 : 1;
  const bonus = neu > 1 ? Math.min(SERIE_MAX_BONUS, neu * SERIE_AP_PRO_TAG) : 0;
  return { serie: neu, letzterTag: heute, bonus };
}

export function punkteFuerArt(art: Art): number {
  return SELTENHEIT[art.seltenheit].punkte;
}

// ---------- Erfolge ----------

export type Erfolg = { id: string; name: string; erreicht: (gesammelt: Set<string>) => boolean };

const inKategorie = (kat: string, g: Set<string>, arten: Art[]) =>
  arten.filter((a) => a.kategorie === kat && g.has(a.id)).length;

export function erfolgeListe(arten: Art[] = ARTEN): Erfolg[] {
  return [
    { id: 'erster-fund', name: 'Erster Fund', erreicht: (g) => g.size >= 1 },
    {
      id: 'vier-reiche',
      name: 'Alle vier Reiche',
      erreicht: (g) => KATEGORIEN.every((k) => inKategorie(k.id, g, arten) >= 1),
    },
    { id: 'pilzkenner', name: 'Pilzkenner (5)', erreicht: (g) => inKategorie('pilze', g, arten) >= 5 },
    { id: 'vogelohr', name: 'Vogelohr (5)', erreicht: (g) => inKategorie('voegel', g, arten) >= 5 },
    {
      id: 'seltenheitsjaeger',
      name: 'Seltenheitsjäger',
      erreicht: (g) => arten.some((a) => a.seltenheit >= 3 && g.has(a.id)),
    },
    { id: 'legende', name: 'Legende', erreicht: (g) => arten.some((a) => a.seltenheit === 4 && g.has(a.id)) },
  ];
}

/** Erfolge, die durch einen neuen Fund dazukommen (für die Belohnungs-Animation) */
export function neueErfolge(vorher: Set<string>, nachher: Set<string>, arten: Art[] = ARTEN): Erfolg[] {
  return erfolgeListe(arten).filter((e) => !e.erreicht(vorher) && e.erreicht(nachher));
}

// ---------- Belohnung für einen Fund ----------

export type Spielstand = {
  ap: number;
  serie: number;
  letzterTag: string | null;
  /** IDs aller echten (nicht Beispiel-)Funde */
  gesammelt: Set<string>;
};

export type Belohnung = {
  neu: boolean; // false = Art war schon gesammelt (nur neues Foto)
  punkte: number; // Grundpunkte nach Seltenheit
  bonus: number; // Serienbonus
  /** Bonus für vollendete Zweige und Äste im Lebensbaum */
  setBonus: number;
  zweigeVoll: string[];
  aesteVoll: string[];
  serie: number;
  levelVorher: number;
  levelNachher: number;
  huetteVorher: HuettenStufe;
  huetteNachher: HuettenStufe;
  neueErfolge: Erfolg[];
  stand: Omit<Spielstand, 'gesammelt'>;
};

/**
 * Was bringt dieser Fund?
 * - Punkte gibt es nur für Arten, die man zum ersten Mal echt findet.
 * - Der Serienbonus zählt einmal pro Tag (beim ersten Fund des Tages).
 * - Schließt der Fund einen Zweig oder Ast ab (`sets`, aus `vollendeteSets()`), gibt es einen kleinen Bonus.
 */
export function berechneBelohnung(
  stand: Spielstand,
  art: Art | undefined,
  artId: string,
  jetzt: Date,
  sets: { zweige: string[]; aeste: string[] } = { zweige: [], aeste: [] },
): Belohnung {
  const neu = !stand.gesammelt.has(artId);
  const levelVorher = levelIndex(stand.ap) + 1;
  if (!neu) {
    const h = huettenStufe(levelVorher);
    return {
      neu,
      punkte: 0,
      bonus: 0,
      setBonus: 0,
      zweigeVoll: [],
      aesteVoll: [],
      serie: stand.serie,
      levelVorher,
      levelNachher: levelVorher,
      huetteVorher: h,
      huetteNachher: h,
      neueErfolge: [],
      stand: { ap: stand.ap, serie: stand.serie, letzterTag: stand.letzterTag },
    };
  }
  // Baumarten ohne eigenen Steckbrief zählen als "häufig"
  const punkte = art ? punkteFuerArt(art) : SELTENHEIT[1].punkte;
  const s = neueSerie(stand.letzterTag, stand.serie, jetzt);
  const setBonus = sets.zweige.length * ZWEIG_BONUS + sets.aeste.length * AST_BONUS;
  const ap = stand.ap + punkte + s.bonus + setBonus;
  const levelNachher = levelIndex(ap) + 1;
  const nachher = new Set(stand.gesammelt).add(artId);
  return {
    neu,
    punkte,
    bonus: s.bonus,
    setBonus,
    zweigeVoll: sets.zweige,
    aesteVoll: sets.aeste,
    serie: s.serie,
    levelVorher,
    levelNachher,
    huetteVorher: huettenStufe(levelVorher),
    huetteNachher: huettenStufe(levelNachher),
    neueErfolge: neueErfolge(stand.gesammelt, nachher),
    stand: { ap, serie: s.serie, letzterTag: s.letzterTag },
  };
}

// ---------- Die Hütte wächst mit dem Level ----------

export type HuettenStufe = 0 | 1 | 2 | 3;

export const HUETTEN_NAME: Record<HuettenStufe, string> = {
  0: 'Unterstand',
  1: 'Waldhütte',
  2: 'Forsthaus',
  3: 'Baumhaus-Sternwarte',
};

/** Level 1–2 Unterstand, 3–5 Waldhütte, 6–8 Forsthaus, ab 9 Sternwarte */
export function huettenStufe(level: number): HuettenStufe {
  if (level >= 9) return 3;
  if (level >= 6) return 2;
  if (level >= 3) return 1;
  return 0;
}
