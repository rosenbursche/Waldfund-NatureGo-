/**
 * Daten für die grafischen Tierseiten (Reh, Fuchs). Alles, was dort gezeichnet wird, kommt von hier:
 * Größe, Körpermerkmale, Jahreslauf, Tagesrhythmus, Futter, Spuren, Gefahren, Sicherheits-Hinweis.
 *
 * Die Seite soll fast ohne Text auskommen – deshalb sind die Beschriftungen kurz (2–4 Wörter).
 *
 * TODO fachlich prüfen: Alle Angaben sind allgemeines Bestimmungsbuch- und Jagdkunde-Wissen,
 * selbst zusammengefasst und für die Grafik vereinfacht (z. B. Monatsgrenzen). Bitte von einer
 * Fachperson gegenlesen lassen.
 */

/** Welche Zeichnung (Figur) eine Art bekommt */
export type FigurName = 'reh' | 'fuchs';
export type KoerperIcon = 'spiegel' | 'geweih' | 'ohr' | 'nase' | 'bein' | 'auge' | 'lunte' | 'pfote';
export type NahrungIcon =
  'knospe' | 'trieb' | 'kraut' | 'blatt' | 'eichel' | 'maus' | 'wurm' | 'kaefer' | 'beere' | 'knochen';
export type SpurIcon = 'tritt' | 'losung' | 'verbiss' | 'fegen' | 'pfote' | 'kot' | 'bau' | 'rupfung';
export type GeweihZustand = { art: 'keins' | 'bast' | 'blank'; groesse: number };
export type Ort = 'wald' | 'rand' | 'wiese';
/** 3D-Umgebung im Hero (passend zum Lebensraum) */
export type Umgebung = 'waldrand';

export type TierSeite = {
  figur: FigurName;
  umgebung: Umgebung;
  /** Zusätzliche Dinge in der 3D-Umgebung, z. B. ein Fuchsbau */
  extras?: 'bau'[];
  /** Fellfarben (Daten, keine UI-Farben). `jung`: Fell sehr junger Tiere (z. B. dunkle Fuchswelpen) */
  farben: {
    sommer: string;
    winter: string;
    hell: string;
    spiegel: string;
    dunkel: string;
    geweih: string;
    auge: string;
    jung?: string;
  };
  /** Nur wenn sich die Geschlechter sichtbar unterscheiden (Reh: Geweih) */
  geschlechter?: { maennlich: string; weiblich: string };
  jungName: string;
  /** Schulterhöhe in cm (von–bis) und Gewicht in kg (von–bis) */
  groesse: { schulterCm: [number, number]; gewichtKg: [number, number] };
  /** Antippbare Punkte auf der Zeichnung (Koordinaten im Zeichenraster 0–200 × −24–156) */
  koerper: { id: string; x: number; y: number; icon: KoerperIcon; kurz: string; nurMaennlich?: boolean }[];
  /** Aktive Zeiten (Stunden 0–24); staerke 2 = Hauptaktivität, 1 = kurz unterwegs */
  aktivitaet: { von: number; bis: number; staerke: 1 | 2 }[];
  /** Beschriftung der Tagesuhr: [ruht, kurz aktiv, sehr aktiv] und Symbol für „aktiv“ */
  aktivTexte: [string, string, string];
  aktivSymbol: NahrungIcon;
  /** Ereignisse im Jahr (Monate 1–12); `symbol` ist der Name eines Symbols aus TierSymbol */
  jahr: { id: string; kurz: string; monate: number[]; farbe: 'amber' | 'rune' | 'fog' | 'rare'; symbol: string }[];
  /** Ereignis, in dem die Jungen geboren werden: Die Mutter liegt dann (Kitz im Gras, Welpen im Bau) */
  geburt: string;
  /** Fell je Monat: 0 = Winterfell, 1 = Sommerfell, dazwischen Fellwechsel */
  fell: number[];
  /** Geweih des Männchens je Monat (Index 0 = Januar) – nur beim Reh */
  geweih?: GeweihZustand[];
  /** Jungtier: in welchen Monaten es draußen neben der Mutter zu sehen ist, wann mit Flecken bzw. dunklem Fell */
  jung: { sichtbar: number[]; flecken?: number[]; dunkel?: number[] };
  nahrung: { icon: NahrungIcon; kurz: string; monate: number[] }[];
  spuren: { icon: SpurIcon; kurz: string; cm?: [number, number] }[];
  /** Fährte: paarig versetzt (Reh) oder „geschnürt“ – alle Tritte auf einer Linie (Fuchs) */
  faehrte: 'versetzt' | 'geschnuert';
  gefahren: { artId?: string; icon?: 'wolf' | 'maehen' | 'auto'; kurz: string; nurJung?: boolean }[];
  /** Wo das Tier tagsüber und in der Dämmerung/Nacht meist ist */
  lebensraum: { tag: Ort; nacht: Ort; orte: Record<Ort, string> };
  /** Sicherheits-Hinweis am Ende: Titel, Bild und welcher Text aus arten.ts gezeigt wird */
  hinweis: { titel: string; bild: 'kitz' | 'fuchs'; text: 'wusstestDu' | 'gefahr' };
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
      auge: '#1B1612',
    },
    geschlechter: { maennlich: 'Bock', weiblich: 'Ricke' },
    jungName: 'Kitz',
    // Schulterhöhe aus arten.ts; Gewicht TODO fachlich prüfen
    groesse: { schulterCm: [60, 75], gewichtKg: [15, 30] },
    koerper: [
      { id: 'spiegel', x: 49, y: 78, icon: 'spiegel', kurz: 'Spiegel: weißes Warnsignal' },
      { id: 'geweih', x: 155, y: -4, icon: 'geweih', kurz: 'Geweih – nur Böcke', nurMaennlich: true },
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
    aktivTexte: ['Ruht und kaut wieder', 'Kurz fressen', 'Viel unterwegs, frisst'],
    aktivSymbol: 'kraut',
    jahr: [
      { id: 'setzzeit', kurz: 'Kitze kommen', monate: [5, 6], farbe: 'rune', symbol: 'mulde' },
      { id: 'brunft', kurz: 'Brunft', monate: [7, 8], farbe: 'amber', symbol: 'herz' },
      { id: 'keimruhe', kurz: 'Keimruhe', monate: [8, 9, 10, 11, 12], farbe: 'rare', symbol: 'keim' },
      { id: 'abwurf', kurz: 'Geweih fällt ab', monate: [10, 11], farbe: 'fog', symbol: 'geweih' },
    ],
    geburt: 'setzzeit',
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
    jung: { sichtbar: [6, 7, 8, 9, 10, 11, 12], flecken: [6, 7, 8] },
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
    faehrte: 'versetzt',
    gefahren: [
      { artId: 'luchs', kurz: 'Luchs' },
      { icon: 'wolf', kurz: 'Wolf' },
      { artId: 'fuchs', kurz: 'Fuchs', nurJung: true },
      { icon: 'maehen', kurz: 'Wiesenmahd', nurJung: true },
    ],
    lebensraum: { tag: 'rand', nacht: 'wiese', orte: { wald: 'Deckung', rand: 'Lieblingsplatz', wiese: 'Futter' } },
    hinweis: { titel: 'Kitz gefunden?', bild: 'kitz', text: 'wusstestDu' },
  },

  fuchs: {
    figur: 'fuchs',
    umgebung: 'waldrand',
    extras: ['bau'],
    farben: {
      sommer: '#C9621F', // wie das 3D-Modell
      winter: '#C2551A', // Winterfell dichter und kräftiger gefärbt
      hell: '#EFE6D8', // weiße Kehle, Brust, Schwanzspitze
      spiegel: '#EFE6D8',
      dunkel: '#1A1411', // schwarze Ohrrückseiten, Läufe, Nase
      geweih: '#1A1411',
      auge: '#D9A23A',
      jung: '#4E433B', // Welpen sind anfangs dunkel graubraun
    },
    jungName: 'Welpe',
    // Schulterhöhe und Gewicht TODO fachlich prüfen (arten.ts nennt die Körperlänge 60–75 cm)
    groesse: { schulterCm: [35, 40], gewichtKg: [5, 8] },
    koerper: [
      { id: 'lunte', x: 16, y: 124, icon: 'lunte', kurz: 'Lunte, oft mit weißer Spitze' },
      { id: 'ohr', x: 151, y: 58, icon: 'ohr', kurz: 'Hört Mäuse unter dem Schnee' },
      { id: 'auge', x: 165, y: 76, icon: 'auge', kurz: 'Schlitzpupillen für die Dämmerung' },
      { id: 'nase', x: 184, y: 83, icon: 'nase', kurz: 'Feine Nase' },
      { id: 'bein', x: 129, y: 138, icon: 'pfote', kurz: 'Oft schwarze „Strümpfe“' },
    ],
    // dämmerungs- und nachtaktiv, ungestört auch am Tag unterwegs (vereinfacht, TODO fachlich prüfen)
    aktivitaet: [
      { von: 18.5, bis: 24, staerke: 2 },
      { von: 0, bis: 5, staerke: 2 },
      { von: 5, bis: 7, staerke: 1 },
      { von: 16.5, bis: 18.5, staerke: 1 },
      { von: 11, bis: 11.8, staerke: 1 },
    ],
    aktivTexte: ['Schläft im Versteck', 'Kurz unterwegs', 'Auf Mäusejagd'],
    aktivSymbol: 'maus',
    jahr: [
      { id: 'ranz', kurz: 'Ranz (Paarungszeit)', monate: [12, 1, 2], farbe: 'amber', symbol: 'herz' },
      { id: 'wurf', kurz: 'Welpen im Bau', monate: [3, 4], farbe: 'rune', symbol: 'bau' },
      { id: 'spielen', kurz: 'Welpen spielen draußen', monate: [5, 6, 7], farbe: 'rare', symbol: 'pfote' },
      { id: 'abwandern', kurz: 'Junge ziehen fort', monate: [9, 10, 11], farbe: 'fog', symbol: 'karte' },
    ],
    geburt: 'wurf',
    //      J  F  M  A    M    J  J  A  S  O    N  D
    fell: [0, 0, 0, 0.5, 0.5, 1, 1, 1, 1, 0.5, 0, 0],
    jung: { sichtbar: [5, 6, 7, 8, 9], dunkel: [5] },
    nahrung: [
      { icon: 'maus', kurz: 'Mäuse', monate: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
      { icon: 'wurm', kurz: 'Regenwürmer', monate: [3, 4, 5, 6, 7, 8, 9, 10] },
      { icon: 'kaefer', kurz: 'Käfer', monate: [5, 6, 7, 8, 9] },
      { icon: 'beere', kurz: 'Beeren & Obst', monate: [7, 8, 9, 10] },
      { icon: 'knochen', kurz: 'Aas', monate: [11, 12, 1, 2, 3] },
    ],
    spuren: [
      { icon: 'pfote', kurz: 'Trittsiegel: 4 Zehen, Krallen', cm: [4.5, 5.5] },
      { icon: 'kot', kurz: 'Losung mit gedrehter Spitze' },
      { icon: 'bau', kurz: 'Bau mit mehreren Röhren' },
      { icon: 'rupfung', kurz: 'Federkiele abgebissen' },
    ],
    faehrte: 'geschnuert',
    gefahren: [
      { artId: 'luchs', kurz: 'Luchs' },
      { icon: 'wolf', kurz: 'Wolf' },
      { icon: 'auto', kurz: 'Straßen' },
      { artId: 'uhu', kurz: 'Uhu', nurJung: true },
    ],
    lebensraum: { tag: 'wald', nacht: 'wiese', orte: { wald: 'Bau & Versteck', rand: 'Hecken', wiese: 'Mäusejagd' } },
    hinweis: { titel: 'Fuchs getroffen?', bild: 'fuchs', text: 'gefahr' },
  },
};

export const tierSeite = (id: string): TierSeite | undefined => TIER_SEITEN[id];
