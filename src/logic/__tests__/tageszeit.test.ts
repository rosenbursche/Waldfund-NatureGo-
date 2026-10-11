import { mischeFarbe, stimmungFuer, stimmungJetzt } from '@/logic/tageszeit';

describe('Tageszeit-Licht', () => {
  test('Mitternacht ist Mondnacht mit Sternen', () => {
    const s = stimmungFuer(0);
    expect(s.name).toBe('Mondnacht');
    expect(s.sterne).toBe(1);
  });

  test('Mittags keine Sterne, helleres Licht als nachts', () => {
    const mittag = stimmungFuer(13);
    expect(mittag.name).toBe('Tag im Wald');
    expect(mittag.sterne).toBe(0);
    expect(mittag.lichtStaerke).toBeGreaterThan(stimmungFuer(2).lichtStaerke);
  });

  test('Morgens um 6:30 dichter Dunst', () => {
    const s = stimmungFuer(6.5);
    expect(s.name).toBe('Morgendunst');
    expect(s.nebelDichte).toBeGreaterThan(stimmungFuer(13).nebelDichte);
  });

  test('19 Uhr goldene Stunde mit Bernsteinlicht', () => {
    const s = stimmungFuer(19);
    expect(s.name).toBe('Goldene Stunde');
    expect(s.licht).toBe('#E8B86A');
  });

  test('Übergänge sind weich (kein Sprung zwischen 18:59 und 19:01)', () => {
    const a = stimmungFuer(18.98);
    const b = stimmungFuer(19.02);
    expect(Math.abs(a.lichtStaerke - b.lichtStaerke)).toBeLessThan(0.02);
  });

  test('Werte außerhalb 0–24 werden umgerechnet', () => {
    expect(stimmungFuer(25)).toEqual(stimmungFuer(1));
  });

  test('Farben mischen', () => {
    expect(mischeFarbe('#000000', '#FFFFFF', 0.5)).toBe('#808080');
  });

  test('stimmungJetzt nutzt die Uhrzeit', () => {
    expect(stimmungJetzt(new Date(2026, 9, 11, 19, 0)).name).toBe('Goldene Stunde');
  });
});
