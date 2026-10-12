import { istFrei } from '../lichtungDetails';
import { augenPlaetze, augenZustand, dunkelheit, euleKopf, mausHervor } from '../verborgenes';

describe('Verborgenes auf der Lichtung', () => {
  it('Augen leuchten nur, wenn es dunkel ist', () => {
    expect(dunkelheit({ sterne: 0, lichtStaerke: 1.1 })).toBe(0);
    expect(dunkelheit({ sterne: 1, lichtStaerke: 0.45 })).toBe(1);
    expect(dunkelheit({ sterne: 0, lichtStaerke: 0.7 })).toBeGreaterThan(0);
  });

  it('Augenpaare liegen verteilt und nicht auf Weg, Hütte oder Tümpel', () => {
    const plaetze = augenPlaetze(42);
    expect(plaetze.length).toBeGreaterThanOrEqual(8);
    for (const p of plaetze) {
      expect(Math.hypot(p.x, p.z)).toBeGreaterThan(4);
      expect(istFrei(p.x, p.z)).toBe(true);
    }
    // für denselben Naturraum immer gleich
    expect(augenPlaetze(42)).toEqual(plaetze);
  });

  it('Augen tauchen auf, blinzeln und verschwinden wieder', () => {
    const werte = Array.from({ length: 2000 }, (_, i) => augenZustand(i * 0.02, 20, 0));
    expect(werte.some((w) => w.sichtbar === 1)).toBe(true);
    expect(werte.some((w) => w.sichtbar === 0)).toBe(true);
    expect(werte.some((w) => w.sichtbar > 0 && w.offen < 0.3)).toBe(true);
    for (const w of werte) {
      expect(w.sichtbar).toBeGreaterThanOrEqual(0);
      expect(w.sichtbar).toBeLessThanOrEqual(1);
      expect(w.offen).toBeGreaterThanOrEqual(0);
      expect(w.offen).toBeLessThanOrEqual(1);
    }
  });

  it('Maus und Eule bewegen sich in Grenzen', () => {
    for (let t = 0; t < 60; t += 0.1) {
      expect(mausHervor(t)).toBeGreaterThanOrEqual(0);
      expect(mausHervor(t)).toBeLessThanOrEqual(1);
      expect(Math.abs(euleKopf(t))).toBeLessThanOrEqual(1.6);
    }
  });
});
