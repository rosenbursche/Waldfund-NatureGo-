import type { TierSeite } from '../tierSeiten';

/**
 * Eurasischer Luchs (Lynx lynx) – große, ruhige Wälder, Pinselohren, jagt vor allem Rehe. Streng geschützt.
 * TODO fachlich prüfen: Gewicht, Monate, Aktivität.
 */
export const LUCHS: TierSeite = {
  figur: 'luchs',
  umgebung: 'wald',
  farben: {
    sommer: '#B08A5A', // wie das 3D-Modell
    winter: '#A89070', // Winterfell grauer
    hell: '#EDE4D2',
    spiegel: '#EDE4D2',
    dunkel: '#1C1610',
    geweih: '#B08A5A',
    auge: '#C9A040',
    jung: '#A08060',
    akzent: '#2A1E18',
  },
  jungName: 'Junges',
  groesse: { mass: 'schulter', cm: [50, 70], gewicht: [15, 30], einheit: 'kg' },
  koerper: [
    { id: 'ohr', x: 149, y: 50, icon: 'ohr', kurz: 'Pinselohren' },
    { id: 'bart', x: 146, y: 110, icon: 'streifen', kurz: 'Backenbart' },
    { id: 'schwanz', x: 50, y: 103, icon: 'lunte', kurz: 'Stummelschwanz, schwarze Spitze' },
    { id: 'pfote', x: 134, y: 146, icon: 'pfote', kurz: 'Große Pfoten wie Schneeschuhe' },
    { id: 'auge', x: 166, y: 83, icon: 'auge', kurz: 'Scharfe „Luchsaugen“' },
  ],
  aktivitaet: [
    { von: 17, bis: 22, staerke: 2 },
    { von: 4, bis: 7, staerke: 2 },
    { von: 22, bis: 24, staerke: 1 },
    { von: 0, bis: 4, staerke: 1 },
  ],
  aktivTexte: ['Ruht auf einem Felsen', 'Streift durchs Revier', 'Pirscht sich an'],
  aktivSymbol: 'reh',
  jahr: [
    { id: 'ranz', kurz: 'Ranz (Paarungszeit)', monate: [2, 3, 4], farbe: 'amber', symbol: 'herz' },
    { id: 'junge', kurz: 'Junge kommen', monate: [5, 6], farbe: 'rune', symbol: 'mulde' },
    {
      id: 'mutter',
      kurz: 'Junge bleiben bei der Mutter',
      monate: [7, 8, 9, 10, 11, 12, 1, 2],
      farbe: 'fog',
      symbol: 'pfote',
    },
    { id: 'abwandern', kurz: 'Junge ziehen fort', monate: [3, 4], farbe: 'rare', symbol: 'karte' },
  ],
  geburt: 'junge',
  //      J  F  M  A    M  J  J  A  S    O  N  D
  fell: [0, 0, 0, 0.5, 1, 1, 1, 1, 0.5, 0, 0, 0],
  jung: { sichtbar: [7, 8, 9, 10, 11, 12, 1, 2] },
  nahrung: [
    { icon: 'reh', kurz: 'Rehe', monate: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { icon: 'hase', kurz: 'Hasen', monate: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { icon: 'fuchs', kurz: 'Füchse', monate: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { icon: 'maus', kurz: 'Kleinere Tiere', monate: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  ],
  spuren: [
    { icon: 'tritt', kurz: 'Rund, ohne Krallen, 7–9 cm', cm: [7, 9] },
    { icon: 'riss', kurz: 'Beute mit Laub zugedeckt' },
  ],
  tritt: 'katze',
  faehrte: 'geschnuert',
  gefahren: [{ icon: 'auto', kurz: 'Straßen' }],
  lebensraum: {
    landschaft: 'wald',
    tag: 0,
    nacht: 2,
    orte: ['Felsen & Dickicht', 'Wald', 'Waldrand'],
    // echtes Foto mit den drei Orten (Prozent links/oben) und Nahfotos je Ort
    panorama: {
      foto: 'landschaft/wald-buchen',
      zonen: [
        [90, 72],
        [60, 65],
        [8, 70],
      ],
      orte: ['landschaft/dickicht', undefined, undefined],
    },
  },
  hinweis: { titel: 'Luchs gesehen?', bild: 'abstand', text: 'wusstestDu' },
};
