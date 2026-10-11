import { NATURRAEUME } from '@/data/naturraeume';
import { findeNaturraum, punktInRing, vergroebern } from '@/logic/geo';

describe('Punkt-in-Polygon', () => {
  const quadrat: [number, number][] = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
    [0, 0],
  ];

  test('Punkt innen / außen', () => {
    expect(punktInRing(5, 5, quadrat)).toBe(true);
    expect(punktInRing(15, 5, quadrat)).toBe(false);
  });
});

describe('Naturraum für bekannte Orte finden', () => {
  // [Ort, Länge, Breite, erwarteter Naturraum]
  const orte: [string, number, number, string][] = [
    ['Wilsede (Lüneburger Heide)', 9.92, 53.17, 'lueneburger-heide'],
    ['Brocken', 10.617, 51.8, 'hochharz'],
    ['Großer Rachel', 13.39, 48.98, 'innerer-bayerischer-wald'],
    ['Feldberg (Schwarzwald)', 8.004, 47.874, 'schwarzwald'],
    ['Zugspitze', 10.985, 47.421, 'bayerische-alpen'],
  ];

  test.each(orte)('%s', (_ort, lon, lat, erwartet) => {
    expect(findeNaturraum(lon, lat, NATURRAEUME)?.id).toBe(erwartet);
  });

  test('Hamburg liegt in keinem Demo-Naturraum', () => {
    expect(findeNaturraum(10.0, 53.55, NATURRAEUME)).toBeUndefined();
  });
});

describe('Datenschutz', () => {
  test('Standort wird auf 0,1° gerundet', () => {
    expect(vergroebern(10.6174, 51.7998)).toEqual({ lon: 10.6, lat: 51.8 });
  });
});
