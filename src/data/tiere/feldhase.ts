import type { TierSeite } from '../tierSeiten';

/**
 * Feldhase (Lepus europaeus) – offenes Feld, kein Bau, ruht in der Sasse; Junghasen liegen allein.
 * TODO fachlich prüfen: Gewicht, Monate, Aktivität, Hinweistext.
 */
export const FELDHASE: TierSeite = {
  figur: 'feldhase',
  umgebung: 'feld',
  farben: {
    sommer: '#A27A4A', // wie das 3D-Modell
    winter: '#9A7C58',
    hell: '#EFE6D6',
    spiegel: '#EFE6D6',
    dunkel: '#1A1410',
    geweih: '#A27A4A',
    auge: '#C9922E',
    jung: '#8E6E48',
  },
  jungName: 'Junghase',
  groesse: { mass: 'laenge', cm: [50, 70], gewicht: [3, 5], einheit: 'kg' },
  koerper: [
    { id: 'ohr', x: 127, y: 42, icon: 'ohr', kurz: 'Lange Ohren, schwarze Spitzen' },
    { id: 'auge', x: 140, y: 91, icon: 'auge', kurz: 'Augen seitlich: fast Rundumsicht' },
    { id: 'bein', x: 84, y: 132, icon: 'bein', kurz: 'Lange Hinterläufe: bis 70 km/h' },
    { id: 'schwanz', x: 64, y: 126, icon: 'spiegel', kurz: 'Schwanz oben schwarz, unten weiß' },
  ],
  aktivitaet: [
    { von: 18, bis: 23, staerke: 2 },
    { von: 3.5, bis: 7, staerke: 2 },
    { von: 23, bis: 24, staerke: 1 },
    { von: 0, bis: 3.5, staerke: 1 },
  ],
  aktivTexte: ['Ruht in der Sasse', 'Hoppelt und frisst', 'Viel unterwegs'],
  aktivSymbol: 'gras',
  jahr: [
    { id: 'rammelzeit', kurz: 'Rammelzeit: Häsinnen boxen', monate: [2, 3, 4], farbe: 'amber', symbol: 'herz' },
    { id: 'junge', kurz: 'Junghasen (mehrere Würfe)', monate: [3, 4, 5, 6, 7, 8, 9], farbe: 'rune', symbol: 'mulde' },
    { id: 'winterfutter', kurz: 'Im Winter Knospen & Rinde', monate: [12, 1, 2], farbe: 'fog', symbol: 'rinde' },
  ],
  geburt: 'junge',
  //      J  F  M  A    M  J  J  A  S  O    N  D
  fell: [0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0, 0],
  jung: { sichtbar: [4, 5, 6, 7, 8, 9, 10] },
  nahrung: [
    { icon: 'gras', kurz: 'Gräser', monate: [3, 4, 5, 6, 7, 8, 9, 10, 11] },
    { icon: 'kraut', kurz: 'Kräuter', monate: [4, 5, 6, 7, 8, 9, 10] },
    { icon: 'mais', kurz: 'Feldfrüchte', monate: [6, 7, 8, 9, 10] },
    { icon: 'knospe', kurz: 'Knospen', monate: [11, 12, 1, 2, 3] },
    { icon: 'rinde', kurz: 'Rinde', monate: [12, 1, 2] },
  ],
  spuren: [
    { icon: 'tritt', kurz: 'Y-Spur: Hinterläufe vorn' },
    { icon: 'losung', kurz: 'Losung: runde Kügelchen' },
    { icon: 'sasse', kurz: 'Sasse: flache Mulde' },
  ],
  tritt: 'hase',
  faehrte: 'sprung',
  gefahren: [
    { artId: 'fuchs', kurz: 'Fuchs' },
    { icon: 'greif', kurz: 'Greifvögel' },
    { icon: 'auto', kurz: 'Straßen' },
    { icon: 'maehen', kurz: 'Mähen', nurJung: true },
  ],
  lebensraum: {
    landschaft: 'feld',
    tag: 1,
    nacht: 2,
    orte: ['Hecke', 'Sasse im Feld', 'Acker'],
    // echtes Foto mit den drei Orten (Prozent links/oben) und Nahfotos je Ort
    panorama: {
      foto: 'landschaft/feld-morgen',
      zonen: [
        [75, 58],
        [55, 78],
        [22, 80],
      ],
      orte: ['landschaft/hecke', undefined, undefined],
    },
  },
  hinweis: {
    titel: 'Junghase allein?',
    bild: 'jung',
    text: 'eigen',
    // TODO fachlich prüfen
    eigenerText:
      'Junghasen liegen allein und gut getarnt im Feld – die Mutter kommt nur kurz zum Säugen. Nicht anfassen!',
  },
};
