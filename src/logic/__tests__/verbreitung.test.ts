import { gebietsAnteile, projiziere, rasterZellen, vorkommen, zellenNachGebiet } from '@/logic/verbreitung';

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

describe('Karte mit Flächen (Wuchsgebiete)', () => {
  test('fast alle Rasterfelder liegen in einem Wuchsgebiet', () => {
    const z = zellenNachGebiet();
    expect(z.filter((x) => x !== null).length / z.length).toBeGreaterThan(0.95);
  });

  test('häufige Art: viele Gebiete voll; legendäre Art: höchstens wenige', () => {
    const amsel = gebietsAnteile('amsel', 'all');
    const luchs = gebietsAnteile('luchs', 'luchs');
    expect(amsel.filter((g) => g.stufe === 'voll').length).toBeGreaterThan(60);
    expect(luchs.filter((g) => g.stufe === 'voll').length).toBeLessThan(10);
    expect(luchs.some((g) => g.stufe !== 'keine')).toBe(true);
  });

  test('Stufen folgen den Schwellen', () => {
    for (const g of gebietsAnteile('uhu', 'mountainWide')) {
      if (g.stufe === 'voll') expect(g.anteil).toBeGreaterThanOrEqual(0.45);
      if (g.stufe === 'keine') expect(g.anteil).toBeLessThan(0.12);
    }
  });
});
