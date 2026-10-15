import { KAMPFWERTE, type Kampfwerte } from '@/data/kampfwerte';
import {
  AKTIVZEIT_BONUS,
  berechneSchaden,
  computerWahl,
  effektivitaet,
  inAktivzeit,
  istMoeglich,
  MAX_KRAFT,
  neuerKaempfer,
  SEHR_EFFEKTIV,
  spieleRunde,
  starteKampf,
  WENIG_EFFEKTIV,
} from '../kampf';

const reh = KAMPFWERTE.reh;
const MITTAG = 12; // keine Dämmerung → kein Aktivzeit-Bonus für das Reh
const kampf = () => starteKampf(neuerKaempfer('Dein Reh', reh), neuerKaempfer('Wilder Rehbock', reh));

describe('Lebensweisen', () => {
  test('Jäger ist stark gegen Sammler, Sammler schwach gegen Jäger', () => {
    expect(effektivitaet(['jaeger'], ['sammler'])).toBe(SEHR_EFFEKTIV);
    expect(effektivitaet(['sammler'], ['jaeger'])).toBe(WENIG_EFFEKTIV);
  });
  test('gleiche Lebensweise ist neutral', () => {
    expect(effektivitaet(['sammler'], ['sammler'])).toBe(1);
  });
});

describe('Aktivzeit', () => {
  test('Reh (Dämmerung) ist abends aktiv, mittags nicht', () => {
    expect(inAktivzeit('daemmerung', 19)).toBe(true);
    expect(inAktivzeit('daemmerung', 12)).toBe(false);
  });
  test('Bonus erhöht den Schaden', () => {
    const a = neuerKaempfer('A', reh);
    const b = neuerKaempfer('B', reh);
    const mittag = berechneSchaden(a, reh.spezial[0], b, 12);
    const abend = berechneSchaden(a, reh.spezial[0], b, 19);
    expect(abend).toBe(Math.round(mittag * AKTIVZEIT_BONUS));
  });
});

describe('Runde', () => {
  test('Sofortangriff macht Schaden und lädt Kraft', () => {
    const { zustand, ereignisse } = spieleRunde(kampf(), { typ: 'schnell' }, { typ: 'schnell' }, MITTAG);
    expect(zustand.gegner.ausdauer).toBeLessThan(reh.ausdauer);
    expect(zustand.spieler.kraft).toBe(reh.schnell.kraft);
    expect(ereignisse.filter((e) => e.typ === 'angriff')).toHaveLength(2);
    expect(zustand.runde).toBe(2);
  });

  test('Spezialangriff geht erst mit genug Kraft', () => {
    const z = kampf();
    expect(istMoeglich(z.spieler, { typ: 'spezial', index: 0 })).toBe(false);
    // ohne Kraft wird daraus ein Sofortangriff
    const { ereignisse } = spieleRunde(z, { typ: 'spezial', index: 0 }, { typ: 'schnell' }, MITTAG);
    expect(ereignisse[0]).toMatchObject({ typ: 'angriff', art: 'schnell' });
  });

  test('Spezialangriff kostet Kraft', () => {
    const z = kampf();
    z.spieler.kraft = 60;
    const { zustand } = spieleRunde(z, { typ: 'spezial', index: 0 }, { typ: 'schnell' }, MITTAG);
    expect(zustand.spieler.kraft).toBe(60 - reh.spezial[0].kraft);
  });

  test('Kraft steigt nie über das Maximum', () => {
    const z = kampf();
    z.spieler.kraft = MAX_KRAFT - 1;
    const { zustand } = spieleRunde(z, { typ: 'schnell' }, { typ: 'schnell' }, MITTAG);
    expect(zustand.spieler.kraft).toBe(MAX_KRAFT);
  });

  test('Tarnen blockt den Angriff und verbraucht eine Tarnung', () => {
    const z = kampf();
    z.gegner.kraft = 60;
    const { zustand, ereignisse } = spieleRunde(z, { typ: 'tarnen' }, { typ: 'spezial', index: 0 }, MITTAG);
    expect(zustand.spieler.ausdauer).toBe(reh.ausdauer);
    expect(zustand.spieler.tarnen).toBe(1);
    expect(ereignisse).toContainEqual(expect.objectContaining({ typ: 'angriff', wer: 'gegner', geblockt: true }));
  });

  test('ohne Tarnung übrig wird nicht getarnt', () => {
    const z = kampf();
    z.spieler.tarnen = 0;
    expect(istMoeglich(z.spieler, { typ: 'tarnen' })).toBe(false);
  });

  test('Schrecken zieht dem Gegner Kraft ab', () => {
    const z = kampf();
    z.spieler.kraft = 40;
    z.gegner.kraft = 40;
    const { zustand } = spieleRunde(z, { typ: 'spezial', index: 1 }, { typ: 'tarnen' }, MITTAG);
    // getarnt: keine Wirkung
    expect(zustand.gegner.kraft).toBe(40);
    const z2 = kampf();
    z2.spieler.kraft = 40;
    z2.gegner.kraft = 40;
    const r2 = spieleRunde(z2, { typ: 'spezial', index: 1 }, { typ: 'schnell' }, MITTAG, () => 0);
    // gleiches Tempo, Zufall 0 → Spieler zuerst: 40 − 25 Raub + 15 Aufladen
    expect(r2.zustand.gegner.kraft).toBe(40 - 25 + reh.schnell.kraft);
  });

  test('das schnellere Tier handelt zuerst und kann den Gegner vorher erschöpfen', () => {
    const langsam: Kampfwerte = { ...reh, tempo: 10 };
    const z = starteKampf(neuerKaempfer('Langsam', langsam), neuerKaempfer('Schnell', reh));
    z.spieler.ausdauer = 1;
    const { zustand, ereignisse } = spieleRunde(z, { typ: 'schnell' }, { typ: 'schnell' }, MITTAG);
    expect(ereignisse[0]).toMatchObject({ typ: 'angriff', wer: 'gegner' });
    expect(ereignisse).toContainEqual({ typ: 'erschoepft', wer: 'spieler' });
    expect(ereignisse.filter((e) => e.typ === 'angriff')).toHaveLength(1);
    expect(zustand.sieger).toBe('gegner');
  });

  test('bei gleichem Tempo entscheidet der Zufall, wer zuerst handelt', () => {
    const zuerst = (r: number) =>
      spieleRunde(kampf(), { typ: 'schnell' }, { typ: 'schnell' }, MITTAG, () => r).ereignisse[0];
    expect(zuerst(0.2)).toMatchObject({ wer: 'spieler' });
    expect(zuerst(0.8)).toMatchObject({ wer: 'gegner' });
  });

  test('nach dem Sieg passiert nichts mehr', () => {
    const z = { ...kampf(), sieger: 'spieler' as const };
    expect(spieleRunde(z, { typ: 'schnell' }, { typ: 'schnell' }, MITTAG).ereignisse).toHaveLength(0);
  });
});

describe('Computergegner', () => {
  test('wählt nur mögliche Aktionen', () => {
    for (const r of [0, 0.3, 0.5, 0.9]) {
      const z = kampf();
      z.gegner.kraft = 35; // reicht für Schrecken, nicht für Geweihstoß
      const a = computerWahl(z, () => r);
      expect(istMoeglich(z.gegner, a)).toBe(true);
    }
  });
  test('tarnt sich manchmal, wenn ein Spezialangriff droht', () => {
    const z = kampf();
    z.spieler.kraft = 80;
    expect(computerWahl(z, () => 0.1)).toEqual({ typ: 'tarnen' });
  });
});
