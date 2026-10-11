import { ARTEN } from '@/data/arten';
import { katalogEintrag } from '@/logic/katalog';
import { STECKBRIEFE } from '@/data/steckbriefe';
import { frisst, wirdGefressenVon } from '@/logic/nahrungsnetz';
import { berechneWildWert } from '@/logic/wildwert';

describe('Wild-Wert', () => {
  test('liegt immer zwischen 1 und 100', () => {
    for (const a of ARTEN) {
      const w = berechneWildWert(a.id).wert;
      expect(w).toBeGreaterThanOrEqual(1);
      expect(w).toBeLessThanOrEqual(100);
    }
  });

  test('seltene Arten haben einen viel höheren Wild-Wert als häufige', () => {
    expect(berechneWildWert('luchs').wert).toBeGreaterThan(80);
    expect(berechneWildWert('amsel').wert).toBeLessThan(20);
  });

  test('Bedrohung laut Roter Liste wird angezeigt', () => {
    expect(berechneWildWert('luchs').bedroht).toBe('Vom Aussterben bedroht (Rote Liste 1)');
    expect(berechneWildWert('amsel').bedroht).toBeNull();
  });

  test('auch Baumarten haben einen Wild-Wert', () => {
    expect(berechneWildWert('elsbeere').wert).toBeGreaterThan(berechneWildWert('rotbuche').wert);
  });
});

describe('Nahrungsnetz', () => {
  test('alle Nahrungs-Verknüpfungen zeigen auf Arten, die es in der App gibt', () => {
    for (const [id, s] of Object.entries(STECKBRIEFE)) {
      for (const ziel of s.nahrungIds) expect([id, ziel, katalogEintrag(ziel)?.id]).toEqual([id, ziel, ziel]);
    }
  });

  test('alle Tiere und Vögel haben einen Steckbrief, Vögel mit Füßen und Nest', () => {
    for (const a of ARTEN.filter((x) => x.kategorie === 'saeuger' || x.kategorie === 'voegel')) {
      expect(STECKBRIEFE[a.id]).toBeDefined();
      if (a.kategorie === 'voegel') {
        expect(STECKBRIEFE[a.id].fuesse).toBeTruthy();
        expect(STECKBRIEFE[a.id].nest).toBeTruthy();
      }
    }
  });

  test('Pflanzen erfahren, wer sie frisst', () => {
    expect(wirdGefressenVon('stieleiche')).toEqual(expect.arrayContaining(['eichelhaeher', 'wildschwein', 'reh']));
    expect(frisst('biber')).toContain('silberweide');
    expect(wirdGefressenVon('reh')).toContain('luchs');
  });
});
