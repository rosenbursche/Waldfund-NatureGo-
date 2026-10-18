import type { TierSeite } from '../tierSeiten';

/**
 * Eichhörnchen (Sciurus vulgaris) – lebt in den Bäumen, tagaktiv, versteckt Vorräte, Winterruhe statt Winterschlaf.
 * TODO fachlich prüfen: Gewicht, Aktivitätszeiten, Monate.
 */
export const EICHHOERNCHEN: TierSeite = {
  figur: 'eichhoernchen',
  umgebung: 'wald',
  extras: ['kobel'],
  farben: {
    sommer: '#B5521E', // wie das 3D-Modell
    winter: '#8E4A2A', // im Winter dunkler, mit Ohrpinseln
    hell: '#F0E8D8',
    spiegel: '#F0E8D8',
    dunkel: '#1E1510',
    geweih: '#8A5A2E', // Nuss
    auge: '#1E1510',
  },
  jungName: 'Junges',
  groesse: { mass: 'laenge', cm: [20, 25], gewicht: [250, 350], einheit: 'g' },
  koerper: [
    { id: 'schwanz', x: 55, y: 96, icon: 'lunte', kurz: 'Schwanz steuert beim Springen' },
    { id: 'ohr', x: 105, y: 62, icon: 'ohr', kurz: 'Ohrpinsel im Winter' },
    { id: 'zahn', x: 129, y: 89, icon: 'zahn', kurz: 'Nagezähne wachsen immer nach' },
    { id: 'fuss', x: 99, y: 147, icon: 'krallen', kurz: 'Füße drehbar: kopfüber den Stamm hinab' },
    { id: 'bauch', x: 108, y: 122, icon: 'spiegel', kurz: 'Bauch immer hell' },
  ],
  // tagaktiv, morgens und nachmittags am meisten unterwegs
  aktivitaet: [
    { von: 6, bis: 10.5, staerke: 2 },
    { von: 15, bis: 18, staerke: 2 },
    { von: 10.5, bis: 15, staerke: 1 },
  ],
  aktivTexte: ['Schläft im Kobel', 'Rastet kurz', 'Sammelt und frisst'],
  aktivSymbol: 'nuss',
  jahr: [
    { id: 'paarung', kurz: 'Paarungszeit', monate: [1, 2, 3], farbe: 'amber', symbol: 'herz' },
    { id: 'junge', kurz: 'Junge im Kobel', monate: [3, 4, 6, 7], farbe: 'rune', symbol: 'kobel' },
    { id: 'vorrat', kurz: 'Vorräte verstecken', monate: [9, 10], farbe: 'rare', symbol: 'nuss' },
  ],
  geburt: 'junge',
  ruhe: { monate: [12, 1], kurz: 'Winterruhe, wacht oft auf' },
  //      J  F  M  A    M  J  J  A  S  O    N  D
  fell: [0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0, 0],
  jung: { sichtbar: [5, 8, 9] },
  nahrung: [
    { icon: 'zapfen', kurz: 'Samen aus Zapfen', monate: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { icon: 'nuss', kurz: 'Nüsse & Bucheckern', monate: [8, 9, 10, 11, 12, 1, 2] },
    { icon: 'knospe', kurz: 'Knospen', monate: [2, 3, 4, 5] },
    { icon: 'pilz', kurz: 'Pilze', monate: [7, 8, 9, 10] },
  ],
  spuren: [
    { icon: 'tritt', kurz: 'Sprungspur: Hinterfüße vorn' },
    { icon: 'zapfen', kurz: 'Zapfen: Spindel ausgefranst' },
    { icon: 'nuss', kurz: 'Nuss in zwei Hälften' },
    { icon: 'kobel', kurz: 'Kobel hoch im Baum' },
  ],
  tritt: 'nager',
  faehrte: 'sprung',
  gefahren: [
    { icon: 'marder', kurz: 'Baummarder' },
    { icon: 'greif', kurz: 'Habicht' },
    { icon: 'auto', kurz: 'Straßen' },
  ],
  lebensraum: {
    landschaft: 'wald',
    tag: 0,
    nacht: 2,
    orte: ['Waldboden', 'Stamm', 'Kobel in der Krone'],
    oben: [2],
    posen: ['steht', 'liegt'],
    // echtes Foto mit den drei Orten (Prozent links/oben) und Nahfotos je Ort
    panorama: {
      foto: 'landschaft/wald-buchen',
      zonen: [
        [40, 80],
        [59, 50],
        [60, 12],
      ],
      orte: ['landschaft/waldboden', undefined, undefined],
    },
  },
  hinweis: { titel: 'Wusstest du?', bild: 'abstand', text: 'wusstestDu' },
};
