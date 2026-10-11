import orteDaten from '@/data/orte.json';
import { NATURRAEUME } from '@/data/naturraeume';
import { naechsterNaturraum } from '@/logic/geo';
import { normalisiere, sucheOrte, type OrtEintrag } from '@/logic/ortsuche';

const ORTE = orteDaten.orte as OrtEintrag[];

describe('Ortssuche', () => {
  test('Umlaute werden vereinheitlicht', () => {
    expect(normalisiere(' Lüneburg ')).toBe('lueneburg');
  });

  test('Suche nach Postleitzahl', () => {
    const t = sucheOrte('29646', ORTE);
    expect(t[0]).toMatchObject({ plz: '29646', ort: 'Bispingen' });
  });

  test('Suche nach Name, auch ohne Umlaut', () => {
    expect(sucheOrte('lueneburg', ORTE)[0].ort).toBe('Lüneburg');
  });

  test('jeder Ort erscheint nur einmal', () => {
    const namen = sucheOrte('Berlin', ORTE).map((t) => t.ort);
    expect(new Set(namen).size).toBe(namen.length);
  });

  test('zu kurze Eingabe liefert nichts', () => {
    expect(sucheOrte('b', ORTE)).toEqual([]);
  });

  test('keine Firmen-Postleitzahlen', () => {
    expect(ORTE.some(([, ort]) => /GmbH/.test(ort))).toBe(false);
  });
});

describe('Nächster Naturraum', () => {
  test('Bispingen liegt mitten in der Lüneburger Heide', () => {
    const [, , lat, lon] = ORTE.find(([plz]) => plz === '29646')!;
    expect(naechsterNaturraum(lon, lat, NATURRAEUME)).toMatchObject({ km: 0, naturraum: { id: 'lueneburger-heide' } });
  });

  test('Hamburg: nächster Demo-Naturraum ist die Lüneburger Heide, mit Entfernung', () => {
    const r = naechsterNaturraum(10.0, 53.55, NATURRAEUME);
    expect(r.naturraum.id).toBe('lueneburger-heide');
    expect(r.km).toBeGreaterThan(5);
    expect(r.km).toBeLessThan(80);
  });
});
