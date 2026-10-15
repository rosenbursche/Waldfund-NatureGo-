import type { TierSeite } from '../tierSeiten';

/**
 * Biber (Castor fiber) – lebt am und im Wasser, baut Burgen und Dämme, reiner Pflanzenfresser. Streng geschützt.
 * TODO fachlich prüfen: Gewicht, Monate, Aktivität.
 */
export const BIBER: TierSeite = {
  figur: 'biber',
  umgebung: 'ufer',
  extras: ['burg'],
  farben: {
    sommer: '#5B3A22', // wie das 3D-Modell
    winter: '#4E321E',
    hell: '#8A6A50',
    spiegel: '#8A6A50',
    dunkel: '#1A120C',
    geweih: '#D9772A', // orange Nagezähne
    auge: '#1A120C',
    jung: '#6A4A30',
    akzent: '#3A3632', // schuppige Kelle
  },
  jungName: 'Jungbiber',
  groesse: { mass: 'laenge', cm: [80, 100], gewicht: [20, 30], einheit: 'kg' },
  koerper: [
    { id: 'kelle', x: 40, y: 138, icon: 'kelle', kurz: 'Kelle: Steuer und Warnsignal' },
    { id: 'zahn', x: 170, y: 129, icon: 'zahn', kurz: 'Orange Zähne: Eisen macht sie hart' },
    { id: 'fuss', x: 80, y: 144, icon: 'pfote', kurz: 'Schwimmhäute an den Hinterfüßen' },
    { id: 'ohr', x: 148, y: 102, icon: 'ohr', kurz: 'Ohren und Nase verschließbar' },
  ],
  aktivitaet: [
    { von: 19, bis: 24, staerke: 2 },
    { von: 0, bis: 5, staerke: 2 },
    { von: 5, bis: 6, staerke: 1 },
    { von: 17.5, bis: 19, staerke: 1 },
  ],
  aktivTexte: ['Schläft in der Burg', 'Kurz draußen', 'Schwimmt und nagt'],
  aktivSymbol: 'rinde',
  jahr: [
    { id: 'paarung', kurz: 'Paarung im Wasser', monate: [1, 2, 3], farbe: 'amber', symbol: 'herz' },
    { id: 'junge', kurz: 'Junge in der Burg', monate: [5, 6], farbe: 'rune', symbol: 'burg' },
    { id: 'abwandern', kurz: 'Zweijährige ziehen fort', monate: [4], farbe: 'fog', symbol: 'karte' },
    { id: 'vorrat', kurz: 'Wintervorrat im Wasser', monate: [10, 11], farbe: 'rare', symbol: 'rinde' },
  ],
  geburt: 'junge',
  //      J  F  M  A    M  J  J  A  S  O    N  D
  fell: [0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0, 0],
  jung: { sichtbar: [7, 8, 9, 10] },
  nahrung: [
    { icon: 'kraut', kurz: 'Kräuter & Wasserpflanzen', monate: [5, 6, 7, 8, 9] },
    { icon: 'blatt', kurz: 'Blätter', monate: [5, 6, 7, 8, 9, 10] },
    { icon: 'trieb', kurz: 'Junge Triebe', monate: [4, 5, 6] },
    { icon: 'rinde', kurz: 'Rinde & Zweige', monate: [10, 11, 12, 1, 2, 3, 4] },
  ],
  spuren: [
    { icon: 'sanduhr', kurz: 'Nagespur in Sanduhrform' },
    { icon: 'burg', kurz: 'Burg aus Ästen und Schlamm' },
    { icon: 'tritt', kurz: 'Hinterfuß mit Schwimmhäuten' },
  ],
  tritt: 'biber',
  faehrte: 'versetzt',
  gefahren: [
    { icon: 'auto', kurz: 'Straßen' },
    { icon: 'wolf', kurz: 'Wolf' },
  ],
  lebensraum: { landschaft: 'ufer', tag: 1, nacht: 2, orte: ['Ufergehölz', 'Burg am Ufer', 'Wasser'] },
  hinweis: { titel: 'Biberburg entdeckt?', bild: 'abstand', text: 'wusstestDu' },
};
