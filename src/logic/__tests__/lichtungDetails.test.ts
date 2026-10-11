import { platziereBaeume, startwertAus } from '@/logic/lichtung';
import { baeumeFreiRuecken, istFrei, streuen, trittsteine, TUEMPEL, WEG, wegX } from '@/logic/lichtungDetails';
import { naturraumById } from '@/data/naturraeume';
import { getHeimischeBaeume } from '@/logic/regelEngine';

describe('Details der Lichtung', () => {
  test('Hütte, Weg und Tümpel bleiben frei', () => {
    expect(istFrei(0, 0)).toBe(false);
    expect(istFrei(wegX(6), 6)).toBe(false);
    expect(istFrei(TUEMPEL.x, TUEMPEL.z)).toBe(false);
    expect(istFrei(-7, 6)).toBe(true);
  });

  test('gestreute Details liegen im Ring und nie auf freien Flächen', () => {
    const gras = streuen(1, 400, 2.2, 15, { haufen: 1.2 });
    expect(gras.length).toBe(400);
    for (const g of gras) {
      expect(istFrei(g.x, g.z)).toBe(true);
      expect(Math.hypot(g.x, g.z)).toBeLessThanOrEqual(15);
    }
  });

  test('gleicher Startwert ergibt dieselbe Lichtung', () => {
    expect(streuen(7, 20, 3, 10)).toEqual(streuen(7, 20, 3, 10));
  });

  test('Trittsteine liegen auf dem Weg', () => {
    for (const t of trittsteine(3)) expect(Math.abs(t.x - wegX(t.z))).toBeLessThan(WEG.breite);
  });

  test('vor der Hütte steht kein Baum auf dem Weg', () => {
    const nr = naturraumById['lueneburger-heide'];
    const vorher = platziereBaeume(getHeimischeBaeume(nr), 30, startwertAus(nr.id));
    const plaetze = baeumeFreiRuecken(vorher);
    expect(plaetze).toHaveLength(vorher.length); // nur verschoben, keiner fällt weg
    for (const p of plaetze) {
      if (p.z > 2) expect(Math.abs(p.x - wegX(p.z))).toBeGreaterThanOrEqual(2.8);
    }
  });
});
