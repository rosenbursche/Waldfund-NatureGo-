import { artById } from '@/data/arten';
import { baumById } from '@/data/baumarten';
import { FUNDSTUECKE } from '@/data/fundstuecke';

describe('Fundstück-Daten aus der Recherche', () => {
  test('jede Art gibt es in der App', () => {
    for (const a of FUNDSTUECKE) expect(artById[a.artId] ?? baumById[a.artId]).toBeDefined();
  });

  test('jede Art nur einmal', () => {
    expect(new Set(FUNDSTUECKE.map((a) => a.artId)).size).toBe(FUNDSTUECKE.length);
  });

  test.each(FUNDSTUECKE.map((a) => [a.artId, a] as const))('%s: Fundstücke sind vollständig und belegt', (_, a) => {
    expect(a.fundstuecke.length).toBeGreaterThan(0);
    expect(new Set(a.fundstuecke.map((f) => f.id)).size).toBe(a.fundstuecke.length);
    for (const f of a.fundstuecke) {
      expect(f.quellen.length).toBeGreaterThan(0);
      for (const q of f.quellen) expect(a.quellen[q]?.url).toMatch(/^https?:\/\//);
      expect(f.monate.length).toBeGreaterThan(0);
      for (const m of f.monate) expect(m >= 1 && m <= 12).toBe(true);
      expect([1, 2, 3, 4]).toContain(f.findbarkeit);
    }
  });

  test('Vorkommen in der Pilotregion ist eingetragen', () => {
    for (const a of FUNDSTUECKE) expect(['ja', 'nein', 'unsicher']).toContain(a.vorkommen['lueneburger-heide']);
  });
});
