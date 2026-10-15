/**
 * Daten für die grafische Tierseite (Vorlage: Reh). Alles, was dort gezeichnet wird,
 * kommt von hier: Größe, Körpermerkmale, Jahreslauf, Tagesrhythmus, Futter, Spuren, Gefahren.
 *
 * Die Seite soll fast ohne Text auskommen – deshalb sind die Beschriftungen kurz (2–4 Wörter).
 *
 * TODO fachlich prüfen: Alle Angaben sind allgemeines Bestimmungsbuch- und Jagdkunde-Wissen,
 * selbst zusammengefasst und für die Grafik vereinfacht (z. B. Monatsgrenzen). Bitte von einer
 * Fachperson gegenlesen lassen.
 */

export type KoerperIcon = 'spiegel' | 'geweih' | 'ohr' | 'nase' | 'bein' | 'auge';
export type NahrungIcon = 'knospe' | 'trieb' | 'kraut' | 'blatt' | 'eichel';
export type SpurIcon = 'tritt' | 'losung' | 'verbiss' | 'fegen';
export type GeweihZustand = { art: 'keins' | 'bast' | 'blank'; groesse: number };
export type Ort = 'wald' | 'rand' | 'wiese';
/** 3D-Umgebung im Hero (passend zum Lebensraum) */
export type Umgebung = 'waldrand';

export type TierSeite = {
  figur: 'reh';
  umgebung: Umgebung;
  /** Fellfarben (Daten, keine UI-Farben): Sommer, Winter, Bauch/Kinn, Spiegel, Hufe/Nase, Geweih */
  farben: { sommer: string; winter: string; hell: string; spiegel: string; dunkel: string; geweih: string };
  /** Schulterhöhe in cm (von–bis) und Gewicht in kg (von–bis) */
  groesse: { schulterCm: [number, number]; gewichtKg: [number, number] };
  /** Antippbare Punkte auf der Zeichnung (Koordinaten im Zeichenraster 0–200 × −24–156) */
  koerper: { id: string; x: number; y: number; icon: KoerperIcon; kurz: string; nurBock?: boolean }[];
  /** Aktive Zeiten (Stunden 0–24); staerke 2 = Hauptaktivität, 1 = kurze Fressphase */
  aktivitaet: { von: number; bis: number; staerke: 1 | 2 }[];
  /** Ereignisse im Jahr (Monate 1–12) */
  jahr: { id: string; kurz: string; monate: number[]; farbe: 'amber' | 'rune' | 'fog' | 'rare' }[];
  /** Fell je Monat: 0 = Winterfell, 1 = Sommerfell, dazwischen Fellwechsel */
  fell: number[];
  /** Geweih des Bocks je Monat (Index 0 = Januar) */
  geweih: GeweihZustand[];
  /** Kitz: in welchen Monaten es neben der Mutter steht und wann es Flecken hat */
  kitz: { sichtbar: number[]; flecken: number[] };
  nahrung: { icon: NahrungIcon; kurz: string; monate: number[] }[];
  spuren: { icon: SpurIcon; kurz: string; cm?: [number, number] }[];
  gefahren: { artId?: string; icon?: 'wolf' | 'maehen'; kurz: string; nurKitz?: boolean }[];
  /** Wo das Tier tagsüber und in der Dämmerung/Nacht meist ist */
  lebensraum: { tag: Ort; nacht: Ort; orte: Record<Ort, string> };
};

export const TIER_SEITEN: Record<string, TierSeite> = {
  reh: {
    figur: 'reh',
    umgebung: 'waldrand',
    farben: {
      sommer: '#9B5E32', // rotbraunes Sommerfell (wie das 3D-Modell)
      winter: '#6B5D4F', // graubraunes Winterfell
      hell: '#E6DCC8',
      spiegel: '#F2EEE4',
      dunkel: '#1B1612',
      geweih: '#C9B48E',
    },
    // Schulterhöhe aus arten.ts; Gewicht TODO fachlich prüfen
    groesse: { schulterCm: [60, 75], gewichtKg: [15, 30] },
    koerper: [
      { id: 'spiegel', x: 49, y: 78, icon: 'spiegel', kurz: 'Spiegel: weißes Warnsignal' },
      { id: 'geweih', x: 155, y: -4, icon: 'geweih', kurz: 'Geweih – nur Böcke', nurBock: true },
      { id: 'ohr', x: 142, y: 13, icon: 'ohr', kurz: 'Große, drehbare Ohren' },
      { id: 'nase', x: 175, y: 42, icon: 'nase', kurz: 'Schwarze Nase, feiner Geruch' },
      { id: 'bein', x: 63, y: 108, icon: 'bein', kurz: 'Kräftige Hinterläufe: Springer' },
    ],
    // Hauptaktivität in der Dämmerung, dazwischen viele kurze Fressphasen (vereinfacht, TODO fachlich prüfen)
    aktivitaet: [
      { von: 4.5, bis: 7.5, staerke: 2 },
      { von: 18, bis: 21.5, staerke: 2 },
      { von: 0.5, bis: 1.5, staerke: 1 },
      { von: 2.5, bis: 3.3, staerke: 1 },
      { von: 10, bis: 10.8, staerke: 1 },
      { von: 13, bis: 13.8, staerke: 1 },
      { von: 15.5, bis: 16.3, staerke: 1 },
      { von: 23, bis: 23.8, staerke: 1 },
    ],
    jahr: [
      { id: 'setzzeit', kurz: 'Kitze kommen', monate: [5, 6], farbe: 'rune' },
      { id: 'brunft', kurz: 'Brunft', monate: [7, 8], farbe: 'amber' },
      { id: 'keimruhe', kurz: 'Keimruhe', monate: [8, 9, 10, 11, 12], farbe: 'rare' },
      { id: 'abwurf', kurz: 'Geweih fällt ab', monate: [10, 11], farbe: 'fog' },
    ],
    //      J  F  M  A  M    J  J  A  S  O    N  D
    fell: [0, 0, 0, 0, 0.5, 1, 1, 1, 1, 0.5, 0, 0],
    geweih: [
      { art: 'bast', groesse: 0.6 },
      { art: 'bast', groesse: 0.85 },
      { art: 'bast', groesse: 1 },
      { art: 'blank', groesse: 1 }, // gefegt
      { art: 'blank', groesse: 1 },
      { art: 'blank', groesse: 1 },
      { art: 'blank', groesse: 1 },
      { art: 'blank', groesse: 1 },
      { art: 'blank', groesse: 1 },
      { art: 'blank', groesse: 1 },
      { art: 'keins', groesse: 0 }, // abgeworfen
      { art: 'bast', groesse: 0.3 }, // wächst sofort neu, im Bast
    ],
    kitz: { sichtbar: [6, 7, 8, 9, 10, 11, 12], flecken: [6, 7, 8] },
    nahrung: [
      { icon: 'knospe', kurz: 'Knospen', monate: [11, 12, 1, 2, 3, 4] },
      { icon: 'trieb', kurz: 'Junge Triebe', monate: [4, 5, 6] },
      { icon: 'kraut', kurz: 'Kräuter', monate: [4, 5, 6, 7, 8, 9] },
      { icon: 'blatt', kurz: 'Blätter', monate: [5, 6, 7, 8, 9, 10] },
      { icon: 'eichel', kurz: 'Eicheln', monate: [9, 10, 11] },
    ],
    spuren: [
      { icon: 'tritt', kurz: 'Trittsiegel', cm: [4, 5] },
      { icon: 'losung', kurz: 'Losung' },
      { icon: 'verbiss', kurz: 'Verbiss: ausgefranst' }, // keine oberen Schneidezähne
      { icon: 'fegen', kurz: 'Fegestelle vom Bock' },
    ],
    gefahren: [
      { artId: 'luchs', kurz: 'Luchs' },
      { icon: 'wolf', kurz: 'Wolf' },
      { artId: 'fuchs', kurz: 'Fuchs', nurKitz: true },
      { icon: 'maehen', kurz: 'Wiesenmahd', nurKitz: true },
    ],
    lebensraum: { tag: 'rand', nacht: 'wiese', orte: { wald: 'Deckung', rand: 'Lieblingsplatz', wiese: 'Futter' } },
  },
};

export const tierSeite = (id: string): TierSeite | undefined => TIER_SEITEN[id];
