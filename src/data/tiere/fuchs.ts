import type { TierSeite } from '../tierSeiten';

/** Rotfuchs (Vulpes vulpes) – überall vom Wald bis in die Stadt, nachts auf Mäusejagd */
export const FUCHS: TierSeite = {
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
  groesse: { mass: 'schulter', cm: [35, 40], gewicht: [5, 8], einheit: 'kg' },
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
    { icon: 'tritt', kurz: 'Trittsiegel: 4 Zehen, Krallen', cm: [4.5, 5.5] },
    { icon: 'kot', kurz: 'Losung mit gedrehter Spitze' },
    { icon: 'bau', kurz: 'Bau mit mehreren Röhren' },
    { icon: 'rupfung', kurz: 'Federkiele abgebissen' },
  ],
  tritt: 'pfote',
  faehrte: 'geschnuert',
  gefahren: [
    { artId: 'luchs', kurz: 'Luchs' },
    { icon: 'wolf', kurz: 'Wolf' },
    { icon: 'auto', kurz: 'Straßen' },
    { artId: 'uhu', kurz: 'Uhu', nurJung: true },
  ],
  lebensraum: { landschaft: 'waldrand', tag: 0, nacht: 2, orte: ['Bau & Versteck', 'Hecken', 'Mäusejagd'] },
  hinweis: { titel: 'Fuchs getroffen?', bild: 'abstand', text: 'gefahr' },
};
