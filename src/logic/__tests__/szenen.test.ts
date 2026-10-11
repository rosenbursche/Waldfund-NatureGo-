import { bildAufBildschirm, DIORAMA_SZENEN, huettenBild, PLATZHALTER_HEIDE, SZENE_BREITE } from '@/data/szenen';

describe('Diorama-Szenen', () => {
  test('Bild füllt den Bildschirm mit Rand für die Parallaxe', () => {
    const g = bildAufBildschirm(390, 844);
    // Hochformat-Handy: Höhe bestimmt den Maßstab, links und rechts wird abgeschnitten
    expect(SZENE_BREITE * g.massstab).toBeGreaterThan(390);
    expect(g.spielraumX).toBeGreaterThan(0);
    expect(g.spielraumY).toBeGreaterThan(0);
    expect(g.punkt({ x: 512, y: 768 })).toEqual({ x: 195, y: 422 });
  });

  test('fehlende Hüttenstufe zeigt die nächstniedrigere oder Stufe 1', () => {
    const eins = PLATZHALTER_HEIDE.huette[1];
    expect(huettenBild(PLATZHALTER_HEIDE, 3)).toBe(eins);
    expect(huettenBild(PLATZHALTER_HEIDE, 0)).toBe(eins);
  });

  test('Runensteine liegen im sichtbaren Bereich eines schmalen Handys', () => {
    const g = bildAufBildschirm(360, 800);
    for (const sz of DIORAMA_SZENEN) {
      for (const r of Object.values(sz.orte.runen)) {
        const p = g.punkt(r);
        // auch bei voller Verschiebung (Tiefe der Lichtung) noch auf dem Bildschirm
        const weg = g.spielraumX * sz.lichtung.tiefe;
        expect(p.x - weg).toBeGreaterThan(0);
        expect(p.x + weg).toBeLessThan(360);
      }
    }
  });
});
