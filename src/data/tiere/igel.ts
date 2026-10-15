import type { TierSeite } from '../tierSeiten';

/**
 * Braunbrustigel (Erinaceus europaeus) – Hecken und Gärten, nachtaktiv, frisst Insekten, Winterschlaf.
 * TODO fachlich prüfen: Gewicht, Monate (Paarung, Junge), Aktivität.
 */
export const IGEL: TierSeite = {
  figur: 'igel',
  umgebung: 'feld',
  extras: ['laubnest'],
  farben: {
    sommer: '#6B5442', // wie das 3D-Modell
    winter: '#6B5442',
    hell: '#E6DCC8', // helle Stachelspitzen
    spiegel: '#E6DCC8',
    dunkel: '#1E1712',
    geweih: '#8A6E58',
    auge: '#1E1712',
    jung: '#B8AFA4', // Jungigel mit hellen, weichen Stacheln
    akzent: '#8A6E58', // braunes Gesicht
  },
  jungName: 'Jungigel',
  groesse: { mass: 'laenge', cm: [20, 30], gewicht: [800, 1500], einheit: 'g' },
  koerper: [
    { id: 'stacheln', x: 104, y: 104, icon: 'stachel', kurz: 'Etwa 6.000–8.000 Stacheln' },
    { id: 'nase', x: 169, y: 137, icon: 'nase', kurz: 'Feine Nase findet Käfer' },
    { id: 'auge', x: 154, y: 130, icon: 'auge', kurz: 'Kleine Augen, sieht wenig' },
    { id: 'bein', x: 90, y: 146, icon: 'bein', kurz: 'Kurze Beine' },
  ],
  aktivitaet: [
    { von: 21, bis: 24, staerke: 2 },
    { von: 0, bis: 4, staerke: 2 },
    { von: 20, bis: 21, staerke: 1 },
    { von: 4, bis: 5, staerke: 1 },
  ],
  aktivTexte: ['Schläft im Laubnest', 'Kurz unterwegs', 'Sucht Käfer und Würmer'],
  aktivSymbol: 'kaefer',
  jahr: [
    { id: 'paarung', kurz: 'Paarungszeit', monate: [5, 6, 7], farbe: 'amber', symbol: 'herz' },
    { id: 'junge', kurz: 'Junge im Nest', monate: [8, 9], farbe: 'rune', symbol: 'laubnest' },
    { id: 'fett', kurz: 'Frisst sich Fett an', monate: [9, 10], farbe: 'rare', symbol: 'waage' },
  ],
  geburt: 'junge',
  ruhe: { monate: [11, 12, 1, 2, 3], kurz: 'Winterschlaf' },
  fell: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  jung: { sichtbar: [9, 10], dunkel: [9, 10] },
  nahrung: [
    { icon: 'kaefer', kurz: 'Käfer', monate: [4, 5, 6, 7, 8, 9, 10] },
    { icon: 'raupe', kurz: 'Raupen', monate: [5, 6, 7, 8, 9] },
    { icon: 'wurm', kurz: 'Regenwürmer', monate: [3, 4, 5, 6, 7, 8, 9, 10] },
    { icon: 'schnecke', kurz: 'Schnecken', monate: [4, 5, 6, 7, 8, 9, 10] },
  ],
  spuren: [
    { icon: 'tritt', kurz: '5 Zehen, etwa 2,5 cm', cm: [2, 3] },
    { icon: 'kot', kurz: 'Losung mit glänzenden Insektenresten' },
    { icon: 'laubnest', kurz: 'Laubnest unter der Hecke' },
  ],
  tritt: 'pfote5',
  faehrte: 'versetzt',
  gefahren: [
    { icon: 'auto', kurz: 'Straßen' },
    { icon: 'maehen', kurz: 'Mähroboter' },
    { artId: 'uhu', kurz: 'Uhu' },
    { artId: 'dachs', kurz: 'Dachs' },
  ],
  lebensraum: {
    landschaft: 'feld',
    tag: 0,
    nacht: 1,
    orte: ['Hecke & Laub', 'Wiese', 'Gärten'],
    posen: ['liegt', 'aktiv'],
  },
  hinweis: { titel: 'Igel gefunden?', bild: 'abstand', text: 'wusstestDu' },
};
