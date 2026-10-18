import type { TierSeite } from '../tierSeiten';

/**
 * Europäische Wildkatze (Felis silvestris) – große, ruhige Laubwälder, sehr scheu, jagt Mäuse. Streng geschützt.
 * TODO fachlich prüfen: Gewicht, Monate, Aktivität, Hinweistext.
 */
export const WILDKATZE: TierSeite = {
  figur: 'wildkatze',
  umgebung: 'wald',
  farben: {
    sommer: '#8F7F63', // wie das 3D-Modell
    winter: '#8A7A60',
    hell: '#D8CCB0',
    spiegel: '#D8CCB0',
    dunkel: '#1F1A14',
    geweih: '#8F7F63',
    auge: '#A8A040',
    jung: '#7E6E58',
    akzent: '#C98A80', // rosa Nase
  },
  jungName: 'Junge',
  groesse: { mass: 'laenge', cm: [45, 80], gewicht: [3, 8], einheit: 'kg' },
  koerper: [
    { id: 'schwanz', x: 44, y: 137, icon: 'lunte', kurz: 'Ringe, stumpfes schwarzes Ende' },
    { id: 'ruecken', x: 100, y: 101, icon: 'streifen', kurz: 'Rückenstrich endet am Schwanz' },
    { id: 'nase', x: 167, y: 103, icon: 'nase', kurz: 'Rosa Nase' },
    { id: 'auge', x: 158, y: 99, icon: 'auge', kurz: 'Senkrechte Pupillen' },
    { id: 'pfote', x: 130, y: 146, icon: 'pfote', kurz: 'Krallen beim Laufen eingezogen' },
  ],
  aktivitaet: [
    { von: 18, bis: 22, staerke: 2 },
    { von: 4, bis: 7, staerke: 2 },
    { von: 22, bis: 24, staerke: 1 },
    { von: 0, bis: 4, staerke: 1 },
  ],
  aktivTexte: ['Schläft versteckt', 'Streift umher', 'Jagt Mäuse'],
  aktivSymbol: 'maus',
  jahr: [
    { id: 'ranz', kurz: 'Ranz (Paarungszeit)', monate: [1, 2, 3], farbe: 'amber', symbol: 'herz' },
    { id: 'junge', kurz: 'Junge im Versteck', monate: [4, 5], farbe: 'rune', symbol: 'mulde' },
    { id: 'selbststaendig', kurz: 'Junge werden selbständig', monate: [9, 10], farbe: 'fog', symbol: 'karte' },
  ],
  geburt: 'junge',
  //      J  F  M  A    M  J  J  A  S    O  N  D
  fell: [0, 0, 0, 0.5, 1, 1, 1, 1, 0.5, 0, 0, 0],
  jung: { sichtbar: [6, 7, 8, 9], dunkel: [6] },
  nahrung: [
    { icon: 'maus', kurz: 'Mäuse', monate: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { icon: 'vogel', kurz: 'Vögel (selten)', monate: [4, 5, 6, 7, 8, 9] },
  ],
  spuren: [
    { icon: 'tritt', kurz: 'Rund, 4 Zehen, ohne Krallen' },
    { icon: 'holzstapel', kurz: 'Versteck: Holzstapel & Wurzelteller' },
  ],
  tritt: 'katze',
  faehrte: 'geschnuert',
  gefahren: [{ icon: 'auto', kurz: 'Straßen' }],
  lebensraum: {
    landschaft: 'wald',
    tag: 0,
    nacht: 1,
    orte: ['Dickicht', 'Lichtung', 'Waldwiese'],
    // echtes Foto mit den drei Orten (Prozent links/oben) und Nahfotos je Ort
    panorama: {
      foto: 'landschaft/wald-buchen',
      zonen: [
        [90, 72],
        [8, 68],
        [35, 78],
      ],
      orte: ['landschaft/dickicht', undefined, 'landschaft/wiese'],
    },
  },
  hinweis: {
    titel: 'Kätzchen im Wald?',
    bild: 'jung',
    text: 'eigen',
    // TODO fachlich prüfen
    eigenerText:
      'Junge Wildkatzen sehen aus wie Hauskätzchen. Nicht mitnehmen – die Mutter ist meist in der Nähe. Wildkatzen sind streng geschützt.',
  },
};
