import { naturraumById } from '@/data/naturraeume';
import { anzahlJeArt, LICHTUNG, platziereBaeume, startwertAus } from '@/logic/lichtung';
import { getHeimischeBaeume } from '@/logic/regelEngine';

const heide = getHeimischeBaeume(naturraumById['lueneburger-heide']);

describe('Bäume auf der Lichtung', () => {
  test('jede heimische Art steht mindestens einmal da', () => {
    const plaetze = platziereBaeume(heide, 30, 1);
    for (const b of heide) expect(plaetze.some((p) => p.baumId === b.baumart.id)).toBe(true);
  });

  test('Hauptbaumart steht häufiger als ein Begleiter', () => {
    const n = anzahlJeArt(heide, 30);
    expect(n.get('stieleiche')!).toBeGreaterThan(n.get('zitterpappel')!);
  });

  test('kein Baum steht auf dem Platz der Hütte', () => {
    for (const p of platziereBaeume(heide, 30, 7)) {
      const r = Math.hypot(p.x, p.z);
      expect(r).toBeGreaterThan(LICHTUNG.innen);
      expect(r).toBeLessThanOrEqual(LICHTUNG.aussen + 0.01);
    }
  });

  test('gleicher Naturraum ergibt immer dieselbe Lichtung', () => {
    const s = startwertAus('lueneburger-heide');
    expect(platziereBaeume(heide, 30, s)).toEqual(platziereBaeume(heide, 30, s));
  });
});
