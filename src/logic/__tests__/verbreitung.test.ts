import { projiziere, rasterZellen, vorkommen } from '@/logic/verbreitung';

describe('Verbreitungskarte (TK25-Raster)', () => {
  test('Deutschland hat einige tausend Rasterfelder', () => {
    const n = rasterZellen().length;
    expect(n).toBeGreaterThan(2500);
    expect(n).toBeLessThan(3500);
  });

  test('häufige Art kommt in den meisten Feldern vor, legendäre in wenigen', () => {
    const amsel = vorkommen('amsel', 'all').filter(Boolean).length;
    const luchs = vorkommen('luchs', 'luchs').filter(Boolean).length;
    const n = rasterZellen().length;
    expect(amsel / n).toBeGreaterThan(0.7);
    expect(luchs / n).toBeLessThan(0.05);
    expect(luchs).toBeGreaterThan(0);
  });

  test('Karte sieht bei jedem Öffnen gleich aus', () => {
    expect(vorkommen('uhu', 'mountainWide')).toEqual(vorkommen('uhu', 'mountainWide'));
  });

  test('Projektion: Norden ist oben', () => {
    const [, yNord] = projiziere(10, 54.5);
    const [, ySued] = projiziere(10, 47.5);
    expect(yNord).toBeLessThan(ySued);
  });
});
