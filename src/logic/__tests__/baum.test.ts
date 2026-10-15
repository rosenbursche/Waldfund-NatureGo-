import { astPanelForm, baumForm } from '@/logic/baum/stil';

const ARTEN = ['pflanzen', 'pilze', 'voegel', 'saeuger'] as const;

describe('Lebensbäume', () => {
  test('jede Kategorie bekommt einen eigenen, vollständigen Baum', () => {
    const umrisse = new Set<string>();
    for (const art of ARTEN) {
      const f = baumForm(360, 4, 3, art);
      expect(f.astSpitzen).toHaveLength(4);
      expect(f.sternPlaetze).toHaveLength(3);
      expect(f.ebenen.length).toBeGreaterThan(5);
      // keine kaputten Zahlen in den Pfaden
      for (const e of f.ebenen) expect(e.d).not.toMatch(/NaN|Infinity/);
      umrisse.add(f.ebenen.find((e) => e.rolle === 'holz')!.d);
    }
    expect(umrisse.size).toBe(4);
  });

  test('gleiche Kategorie, gleicher Baum (fester Startwert)', () => {
    expect(baumForm(360, 3, 2, 'pilze').ebenen).toEqual(baumForm(360, 3, 2, 'pilze').ebenen);
  });

  test('nur der Baumhirte (Säugetiere) hat Augen im Stamm', () => {
    expect(baumForm(360, 3, 2, 'saeuger').augen).toBeDefined();
    expect(baumForm(360, 3, 2, 'voegel').augen).toBeUndefined();
  });

  test('Astspitzen und Sterne liegen innerhalb des Runenrings', () => {
    for (const art of ARTEN) {
      for (const n of [1, 2, 5]) {
        const f = baumForm(360, n, 3, art);
        for (const p of [...f.astSpitzen, ...f.sternPlaetze]) {
          expect(Math.hypot(p.x - f.mitte.x, p.y - f.mitte.y)).toBeLessThan(f.ringRadius);
        }
      }
    }
  });

  test('aufgeklappter Ast im Stil der Kategorie', () => {
    const knoten = [
      { x: 90, y: 64 },
      { x: 250, y: 176 },
    ];
    for (const art of ARTEN) {
      const ebenen = astPanelForm(art, 340, 300, knoten, 31);
      expect(ebenen.some((e) => e.rolle === 'holz')).toBe(true);
      for (const e of ebenen) expect(e.d).not.toMatch(/NaN/);
    }
  });
});
