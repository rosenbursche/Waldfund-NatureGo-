import type { TierSeite } from '../tierSeiten';

/** Reh (Capreolus capreolus) – Waldrand und Wiese, Bock mit Geweih, geflecktes Kitz */
export const REH: TierSeite = {
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
  groesse: { mass: 'schulter', cm: [60, 75], gewicht: [15, 30], einheit: 'kg' },
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
  tritt: 'huf',
  faehrte: 'versetzt',
  gefahren: [
    { artId: 'luchs', kurz: 'Luchs' },
    { icon: 'wolf', kurz: 'Wolf' },
    { artId: 'fuchs', kurz: 'Fuchs', nurJung: true },
    { icon: 'maehen', kurz: 'Wiesenmahd', nurJung: true },
  ],
  lebensraum: { landschaft: 'waldrand', tag: 1, nacht: 2, orte: ['Deckung', 'Lieblingsplatz', 'Futter'] },
  hinweis: { titel: 'Kitz gefunden?', bild: 'jung', text: 'wusstestDu' },
};
