import type { Fundstueck, FundstueckTyp } from '@/data/fundstueckTypen';
import { artFortschritt, artStufe, inSaison, jetztMoeglich } from '@/logic/fundstuecke';

const ALLE_MONATE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as Fundstueck['monate'];

function fs(id: string, typ: FundstueckTyp, extra: Partial<Fundstueck> = {}): Fundstueck {
  return {
    id,
    name: id,
    typ,
    kurz: '',
    erkennen: [],
    monate: ALLE_MONATE,
    findbarkeit: 1,
    wo: '',
    quellen: [],
    ...extra,
  };
}

// Testdaten, keine echten Fachangaben
const WILDSCHWEIN = [
  fs('trittsiegel', 'spur'),
  fs('suhle', 'spur'),
  fs('wuehlstelle', 'frass'),
  fs('losung', 'losung'),
  fs('sichtung', 'sichtung'),
];

describe('Stufen einer Art', () => {
  test('nichts gefunden: verborgen', () => {
    expect(artStufe(WILDSCHWEIN, new Set())).toBe(0);
  });

  test('ein Zeichen: gespürt', () => {
    expect(artStufe(WILDSCHWEIN, new Set(['suhle']))).toBe(1);
  });

  test('drei Zeichen: erkannt', () => {
    expect(artStufe(WILDSCHWEIN, new Set(['suhle', 'losung', 'trittsiegel']))).toBe(2);
  });

  test('Sichtung ohne Zeichen: begegnet', () => {
    expect(artStufe(WILDSCHWEIN, new Set(['sichtung']))).toBe(3);
  });

  test('alles gefunden: gemeistert', () => {
    expect(artStufe(WILDSCHWEIN, new Set(WILDSCHWEIN.map((f) => f.id)))).toBe(4);
  });

  test('Art mit nur zwei Zeichen ist mit beiden erkannt', () => {
    const art = [fs('a', 'blatt'), fs('b', 'rinde'), fs('ganz', 'ganz')];
    expect(artStufe(art, new Set(['a', 'b']))).toBe(2);
  });

  test('fremde IDs zählen nicht', () => {
    expect(artStufe(WILDSCHWEIN, new Set(['feder']))).toBe(0);
  });
});

describe('Fortschritt und Saison', () => {
  test('zählt gefundene Fundstücke', () => {
    expect(artFortschritt(WILDSCHWEIN, new Set(['suhle', 'losung']))).toEqual({ gefunden: 2, gesamt: 5 });
  });

  test('Herbstlaub nur im Herbst', () => {
    const laub = fs('herbstlaub', 'blatt', { monate: [10, 11] });
    expect(inSaison(laub, 10)).toBe(true);
    expect(inSaison(laub, 5)).toBe(false);
  });

  test('jetzt möglich: fehlende in Saison, einfachste zuerst', () => {
    const art = [
      fs('selten', 'spur', { findbarkeit: 3 }),
      fs('leicht', 'blatt', { findbarkeit: 1 }),
      fs('winter', 'knospe', { monate: [1, 2] }),
      fs('schon', 'rinde'),
    ];
    expect(jetztMoeglich(art, new Set(['schon']), 6).map((f) => f.id)).toEqual(['leicht', 'selten']);
  });
});
