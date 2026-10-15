import type { TierSeite } from '../tierSeiten';

/**
 * Dachs (Meles meles) – gräbt große Baue, nachtaktiv, frisst vor allem Regenwürmer, Winterruhe.
 * TODO fachlich prüfen: Gewicht, Monate (Paarung, Keimruhe, Geburt), Aktivität.
 */
export const DACHS: TierSeite = {
  figur: 'dachs',
  umgebung: 'waldrand',
  extras: ['bau'],
  farben: {
    sommer: '#8A8A86', // wie das 3D-Modell
    winter: '#7E7E7A',
    hell: '#EDEBE6',
    spiegel: '#EDEBE6',
    dunkel: '#151515',
    geweih: '#9A8A70',
    auge: '#151515',
    jung: '#9A9A96',
  },
  jungName: 'Jungdachs',
  groesse: { mass: 'laenge', cm: [65, 90], gewicht: [10, 18], einheit: 'kg' },
  koerper: [
    { id: 'streifen', x: 160, y: 110, icon: 'streifen', kurz: 'Schwarz-weiß gestreifter Kopf' },
    { id: 'krallen', x: 140, y: 146, icon: 'krallen', kurz: 'Lange Grabkrallen' },
    { id: 'nase', x: 181, y: 121, icon: 'nase', kurz: 'Riecht Regenwürmer im Boden' },
    { id: 'bein', x: 68, y: 136, icon: 'bein', kurz: 'Kurze, kräftige Beine' },
  ],
  aktivitaet: [
    { von: 21, bis: 24, staerke: 2 },
    { von: 0, bis: 4, staerke: 2 },
    { von: 19.5, bis: 21, staerke: 1 },
    { von: 4, bis: 5.5, staerke: 1 },
  ],
  aktivTexte: ['Schläft im Bau', 'Kurz draußen', 'Sucht Regenwürmer'],
  aktivSymbol: 'wurm',
  jahr: [
    { id: 'junge', kurz: 'Junge im Bau', monate: [2, 3], farbe: 'rune', symbol: 'bau' },
    { id: 'draussen', kurz: 'Junge kommen heraus', monate: [4, 5], farbe: 'fog', symbol: 'pfote' },
    { id: 'paarung', kurz: 'Paarungszeit', monate: [3, 4, 5], farbe: 'amber', symbol: 'herz' },
    { id: 'keimruhe', kurz: 'Keimruhe', monate: [7, 8, 9, 10, 11], farbe: 'rare', symbol: 'keim' },
  ],
  geburt: 'junge',
  ruhe: { monate: [12, 1], kurz: 'Winterruhe im Bau' },
  //      J  F  M  A    M  J  J  A  S    O  N  D
  fell: [0, 0, 0, 0.5, 1, 1, 1, 1, 0.5, 0, 0, 0],
  jung: { sichtbar: [4, 5, 6, 7, 8, 9] },
  nahrung: [
    { icon: 'wurm', kurz: 'Regenwürmer', monate: [3, 4, 5, 6, 7, 8, 9, 10, 11] },
    { icon: 'kaefer', kurz: 'Insekten & Larven', monate: [4, 5, 6, 7, 8, 9] },
    { icon: 'wurzel', kurz: 'Wurzeln', monate: [10, 11, 12, 1, 2, 3] },
    { icon: 'beere', kurz: 'Früchte & Beeren', monate: [7, 8, 9, 10] },
    { icon: 'pilz', kurz: 'Pilze', monate: [8, 9, 10] },
  ],
  spuren: [
    { icon: 'tritt', kurz: '5 Zehen, lange Krallen' },
    { icon: 'bau', kurz: 'Großer Bau, viele Röhren' },
    { icon: 'latrine', kurz: 'Latrine: kleine Kotgruben' },
    { icon: 'laubnest', kurz: 'Altes Polster vor dem Bau' },
  ],
  tritt: 'pfote5',
  faehrte: 'versetzt',
  gefahren: [
    { icon: 'auto', kurz: 'Straßen' },
    { icon: 'wolf', kurz: 'Wolf' },
  ],
  lebensraum: {
    landschaft: 'waldrand',
    tag: 0,
    nacht: 2,
    orte: ['Bau im Hang', 'Waldrand', 'Wiese'],
    posen: ['liegt', 'aktiv'],
  },
  hinweis: { titel: 'Dachsbau entdeckt?', bild: 'abstand', text: 'wusstestDu' },
};
