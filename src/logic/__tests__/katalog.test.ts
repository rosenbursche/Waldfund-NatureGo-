import { naturraumById } from '@/data/naturraeume';
import { MYSTERY_AB } from '@/data/spiel';
import { fortschrittDerKategorie, istVerborgen, katalogGruppen, mysteryArten } from '@/logic/katalog';

const heide = naturraumById['lueneburger-heide'];

describe('Katalog', () => {
  test('Pflanzen: Gruppe "Bäume" enthält die heimischen Bäume des Naturraums, jede Art nur einmal', () => {
    const baeume = katalogGruppen('pflanzen', heide).find((g) => g.name === 'Bäume')!;
    const ids = baeume.eintraege.map((e) => e.id);
    expect(ids).toEqual(expect.arrayContaining(['stieleiche', 'rotbuche', 'sandbirke', 'waldkiefer']));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain('fichte'); // in der Heide nicht heimisch
  });

  test('Stammbaum enthält keine Mystery-Arten', () => {
    for (const k of ['pflanzen', 'pilze', 'voegel', 'saeuger'] as const) {
      for (const g of katalogGruppen(k, heide)) {
        for (const e of g.eintraege) expect(e.seltenheit).toBeLessThan(MYSTERY_AB);
      }
    }
  });

  test('Mystery-Zone: 2 bis 3 Arten je Kategorie, alle mit Rätsel', () => {
    for (const k of ['pflanzen', 'pilze', 'voegel', 'saeuger'] as const) {
      const m = mysteryArten(k);
      expect(m.length).toBeGreaterThanOrEqual(2);
      for (const e of m) expect(e.raetsel).toBeTruthy();
    }
    expect(mysteryArten().length).toBe(10);
  });

  test('Mystery-Art ist verborgen, bis man sie findet', () => {
    expect(istVerborgen('luchs', {})).toBe(true);
    expect(istVerborgen('luchs', { luchs: {} })).toBe(false);
    expect(istVerborgen('amsel', {})).toBe(false);
  });

  test('Fortschritt zählt Bäume des Naturraums mit', () => {
    const f = fortschrittDerKategorie('pflanzen', { stieleiche: {}, sandbirke: {} }, heide);
    expect(f.gefunden).toBe(2);
    expect(f.gesamt).toBeGreaterThan(9);
  });
});
