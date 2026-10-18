import { waldPlaetze } from '@/logic/katalog';
import {
  abstandZumPfad,
  hoheStaemme,
  LICHT_AM_ENDE,
  PFAD,
  pfadX,
  streueFrei,
  uraltBaeume,
  zauberBoden,
} from '@/logic/zauberwald';

describe('Zauberwald (3D-Katalog)', () => {
  test('Boden hat überall gültige Höhen, die Lichtung ist fast flach', () => {
    for (let x = -50; x <= 50; x += 2.5) {
      for (let z = -50; z <= 50; z += 2.5) expect(Number.isFinite(zauberBoden(x, z))).toBe(true);
    }
    for (const p of waldPlaetze('pflanzen')) expect(Math.abs(zauberBoden(p.x, p.z))).toBeLessThan(0.3);
  });

  test('der Hohlweg liegt tiefer als seine Böschungen', () => {
    const z = -25;
    const weg = zauberBoden(pfadX(z), z);
    expect(zauberBoden(pfadX(z) + 4, z)).toBeGreaterThan(weg + 0.8);
    expect(zauberBoden(pfadX(z) - 4, z)).toBeGreaterThan(weg + 0.8);
  });

  test('alte Bäume stehen außerhalb der Kamerabahn und nicht auf dem Weg', () => {
    const baeume = uraltBaeume(1);
    expect(baeume.length).toBeGreaterThan(8);
    for (const b of baeume) {
      expect(Math.hypot(b.x, b.z)).toBeGreaterThan(14);
      expect(abstandZumPfad(b.x, b.z)).toBeGreaterThan(PFAD.breite + 1);
    }
  });

  test('der Blick den Weg entlang ins Licht bleibt frei von hohen Stämmen', () => {
    for (const s of hoheStaemme(7)) expect(abstandZumPfad(s.x, s.z)).toBeGreaterThan(PFAD.breite + 2);
    expect(LICHT_AM_ENDE.z).toBe(PFAD.bis);
  });

  test('Streuen meidet die Plätze der Arten und ist immer gleich', () => {
    const meiden = waldPlaetze('saeuger').map((p) => ({ x: p.x, z: p.z, r: 1 }));
    const a = streueFrei(5, 40, 0, 12, { meiden });
    expect(a).toEqual(streueFrei(5, 40, 0, 12, { meiden }));
    for (const d of a) for (const m of meiden) expect(Math.hypot(d.x - m.x, d.z - m.z)).toBeGreaterThanOrEqual(1);
  });
});
