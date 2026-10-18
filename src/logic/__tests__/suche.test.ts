import { naturraumById } from '@/data/naturraeume';

import {
  alleSuchEintraege,
  gefaehrlichste,
  gefahrStufe,
  imNaturraum,
  leichtZuFinden,
  seltensteInDerNaehe,
  sucheArten,
  zuletztEntdeckt,
} from '../suche';

const harz = naturraumById['hochharz'];
const alle = alleSuchEintraege(harz);

describe('Suche', () => {
  test('jede Art hat Wild-Wert 1–100 und Punkte', () => {
    expect(alle.length).toBeGreaterThan(40);
    for (const e of alle) {
      expect(e.wildWert).toBeGreaterThanOrEqual(1);
      expect(e.wildWert).toBeLessThanOrEqual(100);
      expect([10, 60, 300, 1000]).toContain(e.punkte);
    }
  });

  test('findet deutsch und lateinisch, Umlaute egal, Wortanfang zuerst', () => {
    expect(sucheArten('fuchs', alle, {}).map((e) => e.id)).toContain('fuchs');
    expect(sucheArten('vulpes', alle, {})[0].id).toBe('fuchs');
    expect(sucheArten('eichhoernchen', alle, {})[0].id).toBe('eichhoernchen');
    expect(sucheArten('f', alle, {})).toHaveLength(0); // erst ab 2 Zeichen
  });

  test('nicht gefundene Mystery-Arten bleiben in der Suche ein Rätsel, gefundene nicht', () => {
    expect(sucheArten('luchs', alle, {})).toHaveLength(0);
    expect(sucheArten('luchs', alle, { luchs: { datum: '2026-10-01' } }).map((e) => e.id)).toContain('luchs');
  });

  test('gefährliche Arten findet man immer (Warnung geht vor Rätsel)', () => {
    expect(sucheArten('satan', alle, {}).map((e) => e.id)).toContain('satan');
  });
});

describe('Entdecken', () => {
  test('die Seltensten: höchstens 8, nach Wild-Wert absteigend, ohne gefährliche', () => {
    const s = seltensteInDerNaehe(alle, harz);
    expect(s.length).toBeLessThanOrEqual(8);
    expect(s.length).toBeGreaterThan(0);
    for (let i = 1; i < s.length; i++) expect(s[i - 1].wildWert).toBeGreaterThanOrEqual(s[i].wildWert);
    expect(s.every((e) => !e.gefahr && imNaturraum(e.id, harz))).toBe(true);
  });

  test('leicht zu finden: nur häufige, noch nicht gefundene', () => {
    const l = leichtZuFinden(alle, { amsel: { datum: '2026-10-01' } }, harz);
    expect(l.every((e) => e.seltenheit === 1)).toBe(true);
    expect(l.map((e) => e.id)).not.toContain('amsel');
  });

  test('gefährlichste: tödliche vor giftigen', () => {
    const g = gefaehrlichste(alle, harz);
    expect(g.length).toBeGreaterThan(0);
    for (let i = 1; i < g.length; i++)
      expect(gefahrStufe(g[i - 1].gefahr)).toBeGreaterThanOrEqual(gefahrStufe(g[i].gefahr));
    expect(gefahrStufe('tödlich giftig')).toBe(3);
    expect(gefahrStufe('sehr giftig')).toBe(2);
    expect(gefahrStufe('giftig')).toBe(1);
  });

  test('zuletzt entdeckt: neueste zuerst', () => {
    const z = zuletztEntdeckt(alle, { amsel: { datum: '2026-10-01' }, reh: { datum: '2026-10-12' } });
    expect(z.map((e) => e.id)).toEqual(['reh', 'amsel']);
  });

  test('Bäume zählen nur, wenn sie im Naturraum heimisch sind', () => {
    expect(imNaturraum('fichte', harz)).toBe(true);
  });
});
