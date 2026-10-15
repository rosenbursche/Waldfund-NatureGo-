import type { TierSeite } from '../tierSeiten';

/**
 * Wildschwein (Sus scrofa) – Allesfresser, wühlt, suhlt sich, lebt in Rotten; Frischlinge gestreift.
 * TODO fachlich prüfen: Gewicht, Monate, Aktivität (stark vom Menschen beeinflusst).
 */
export const WILDSCHWEIN: TierSeite = {
  figur: 'wildschwein',
  umgebung: 'wald',
  extras: ['suhle'],
  farben: {
    sommer: '#4A3A2E', // wie das 3D-Modell
    winter: '#3A302A', // Winterfell dichter und dunkler
    hell: '#D8C9A8',
    spiegel: '#D8C9A8',
    dunkel: '#17120F',
    geweih: '#D9BE7A', // helle Streifen der Frischlinge
    auge: '#17120F',
    jung: '#7A5A3A', // Frischlinge rotbraun
    akzent: '#5A4A44', // Rüsselscheibe
  },
  jungName: 'Frischling',
  groesse: { mass: 'schulter', cm: [60, 100], gewicht: [50, 150], einheit: 'kg' },
  koerper: [
    { id: 'ruessel', x: 186, y: 117, icon: 'nase', kurz: 'Rüssel mit Riechscheibe' },
    { id: 'borsten', x: 110, y: 74, icon: 'streifen', kurz: 'Borstenkamm auf dem Rücken' },
    { id: 'zahn', x: 178, y: 114, icon: 'zahn', kurz: 'Keiler: große Eckzähne' },
    { id: 'ohr', x: 151, y: 80, icon: 'ohr', kurz: 'Hört und riecht sehr gut' },
    { id: 'huf', x: 70, y: 141, icon: 'bein', kurz: 'Afterklauen hinter den Hufen' },
  ],
  // meist nachts unterwegs
  aktivitaet: [
    { von: 19, bis: 24, staerke: 2 },
    { von: 0, bis: 5, staerke: 2 },
    { von: 5, bis: 6.5, staerke: 1 },
    { von: 17.5, bis: 19, staerke: 1 },
  ],
  aktivTexte: ['Ruht im Kessel', 'Kurz unterwegs', 'Wühlt nach Futter'],
  aktivSymbol: 'wurzel',
  jahr: [
    { id: 'rauschzeit', kurz: 'Rauschzeit (Paarung)', monate: [11, 12, 1], farbe: 'amber', symbol: 'herz' },
    { id: 'frischlinge', kurz: 'Frischlinge kommen', monate: [3, 4], farbe: 'rune', symbol: 'mulde' },
    { id: 'suhlen', kurz: 'Suhlen gegen Hitze', monate: [6, 7, 8], farbe: 'fog', symbol: 'suhle' },
    { id: 'mast', kurz: 'Eicheln & Bucheckern', monate: [9, 10, 11], farbe: 'rare', symbol: 'eichel' },
  ],
  geburt: 'frischlinge',
  //      J  F  M  A  M    J  J  A  S    O  N  D
  fell: [0, 0, 0, 0, 0.5, 1, 1, 1, 0.5, 0, 0, 0],
  jung: { sichtbar: [5, 6, 7, 8, 9], streifen: [5, 6], dunkel: [5, 6, 7, 8, 9] },
  nahrung: [
    { icon: 'eichel', kurz: 'Eicheln & Bucheckern', monate: [9, 10, 11, 12, 1, 2] },
    { icon: 'wurzel', kurz: 'Wurzeln & Knollen', monate: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { icon: 'wurm', kurz: 'Würmer & Larven', monate: [3, 4, 5, 6, 7, 8, 9, 10] },
    { icon: 'pilz', kurz: 'Pilze', monate: [7, 8, 9, 10] },
    { icon: 'mais', kurz: 'Feldfrüchte', monate: [6, 7, 8, 9] },
  ],
  spuren: [
    { icon: 'tritt', kurz: 'Hufe mit Afterklauen' },
    { icon: 'suhle', kurz: 'Suhle' },
    { icon: 'malbaum', kurz: 'Malbaum: Schlamm an der Rinde' },
    { icon: 'gebraech', kurz: 'Umgewühlter Boden' },
  ],
  tritt: 'huf_af',
  faehrte: 'versetzt',
  gefahren: [
    { icon: 'wolf', kurz: 'Wolf' },
    { icon: 'auto', kurz: 'Straßen' },
  ],
  lebensraum: { landschaft: 'waldrand', tag: 0, nacht: 2, orte: ['Dickicht', 'Suhle', 'Feld & Wiese'] },
  hinweis: { titel: 'Wildschweine gesehen?', bild: 'abstand', text: 'gefahr' },
};
