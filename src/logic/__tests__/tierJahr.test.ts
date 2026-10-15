import { TIER_SEITEN } from '@/data/tierSeiten';

import {
  aktivitaetUm,
  anteilAmKreis,
  cmZuPunkten,
  farbMix,
  jahresZustand,
  monatAmKreis,
  nahrungIm,
  stundeAmKreis,
} from '../tierJahr';

const reh = TIER_SEITEN.reh;

describe('Grafische Tierseite (Reh)', () => {
  it('Daten sind vollständig: 12 Monate Fell und Geweih', () => {
    expect(reh.fell).toHaveLength(12);
    expect(reh.geweih).toHaveLength(12);
    for (const t of Object.values(TIER_SEITEN)) {
      expect(t.fell).toHaveLength(12);
      expect(t.jahr.some((e) => e.id === t.geburt)).toBe(true);
    }
  });

  it('Jahreslauf: Sommerfell im Juli, Winterfell im Januar, Kitz mit Flecken im Juni', () => {
    expect(jahresZustand(reh, 7).fell).toBe(1);
    expect(jahresZustand(reh, 1).fell).toBe(0);
    expect(jahresZustand(reh, 6)).toMatchObject({ jung: true, flecken: true });
    expect(jahresZustand(reh, 2).jung).toBe(false);
    expect(jahresZustand(reh, 7).ereignisse).toContain('brunft');
    expect(jahresZustand(reh, 11).geweih?.art).toBe('keins');
  });

  it('Fuchs: Welpen im Frühjahr erst im Bau, dann dunkel draußen; kein Geweih; nachts aktiv', () => {
    const fuchs = TIER_SEITEN.fuchs;
    expect(jahresZustand(fuchs, 3)).toMatchObject({ jung: false, geburt: true });
    expect(jahresZustand(fuchs, 5)).toMatchObject({ jung: true, jungDunkel: true });
    expect(jahresZustand(fuchs, 7).jungDunkel).toBe(false);
    expect(jahresZustand(fuchs, 7).geweih).toBeUndefined();
    expect(aktivitaetUm(fuchs, 23)).toBe(2);
    expect(aktivitaetUm(fuchs, 14)).toBe(0);
    expect(nahrungIm(fuchs, 1).map((n) => n.icon)).toContain('maus');
  });

  it('Tagesrhythmus: in der Dämmerung aktiv, mittags meist Ruhe', () => {
    expect(aktivitaetUm(reh, 6)).toBe(2);
    expect(aktivitaetUm(reh, 19)).toBe(2);
    expect(aktivitaetUm(reh, 12)).toBe(0);
    expect(aktivitaetUm(reh, 30)).toBe(aktivitaetUm(reh, 6));
  });

  it('Speiseplan: Eicheln im Herbst, nicht im Frühling', () => {
    expect(nahrungIm(reh, 10).map((n) => n.icon)).toContain('eichel');
    expect(nahrungIm(reh, 4).map((n) => n.icon)).not.toContain('eichel');
  });

  it('Fingerposition am Kreis: oben = 0, rechts = Viertel, unten = Hälfte', () => {
    expect(anteilAmKreis(50, 0, 50, 50)).toBeCloseTo(0);
    expect(anteilAmKreis(100, 50, 50, 50)).toBeCloseTo(0.25);
    expect(anteilAmKreis(50, 100, 50, 50)).toBeCloseTo(0.5);
    expect(stundeAmKreis(100, 50, 50, 50)).toBe(6);
    expect(monatAmKreis(51, 0, 50, 50)).toBe(1);
    expect(monatAmKreis(48, 0, 50, 50)).toBe(12);
    expect(monatAmKreis(0, 50, 50, 50)).toBe(10);
  });

  it('Hilfen: Zentimeter in Punkte, Farben mischen', () => {
    expect(cmZuPunkten(2.54)).toBe(160);
    expect(farbMix('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(farbMix('#102030', '#405060', 0)).toBe('#102030');
  });
});
