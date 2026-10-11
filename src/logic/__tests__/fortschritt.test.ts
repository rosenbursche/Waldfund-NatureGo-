import { ARTEN, artById } from '@/data/arten';
import { MYSTERY_AB } from '@/data/spiel';
import { levelInfo, neueErfolge, neueSerie, punkteFuerArt, tagesKey } from '@/logic/fortschritt';

describe('Artendaten aus dem Prototyp', () => {
  test('39 Arten in 4 Kategorien', () => {
    expect(ARTEN).toHaveLength(39);
    expect(new Set(ARTEN.map((a) => a.kategorie))).toEqual(new Set(['pflanzen', 'pilze', 'voegel', 'saeuger']));
  });

  test('IDs sind eindeutig', () => {
    expect(new Set(ARTEN.map((a) => a.id)).size).toBe(ARTEN.length);
  });

  test('jede Mystery-Art hat ein Rätsel', () => {
    for (const a of ARTEN.filter((x) => x.seltenheit >= MYSTERY_AB)) {
      expect(a.raetsel).toBeTruthy();
    }
  });
});

describe('Punkte und Level', () => {
  test('Punkte nach Seltenheit: 10 / 50 / 150 / 400', () => {
    expect(punkteFuerArt(artById['amsel'])).toBe(10);
    expect(punkteFuerArt(artById['eisvogel'])).toBe(50);
    expect(punkteFuerArt(artById['uhu'])).toBe(150);
    expect(punkteFuerArt(artById['luchs'])).toBe(400);
  });

  test('Level-Grenzen', () => {
    expect(levelInfo(0)).toMatchObject({ level: 1, rang: 'Entdecker', fehlend: 40 });
    expect(levelInfo(40)).toMatchObject({ level: 2, rang: 'Spurenleser' });
    expect(levelInfo(120).fortschritt).toBeCloseTo(0.2);
    expect(levelInfo(5000)).toMatchObject({ level: 12, rang: 'Wildnis-Legende' });
  });
});

describe('Serienbonus', () => {
  const tag = (s: string) => new Date(`${s}T12:00:00`);

  test('erster Fund überhaupt: Serie 1, kein Bonus', () => {
    expect(neueSerie(null, 0, tag('2026-10-11'))).toEqual({ serie: 1, letzterTag: '2026-10-11', bonus: 0 });
  });

  test('gestern gefunden: Serie +1 mit Bonus', () => {
    expect(neueSerie('2026-10-10', 2, tag('2026-10-11'))).toEqual({ serie: 3, letzterTag: '2026-10-11', bonus: 15 });
  });

  test('heute schon gefunden: kein zweiter Bonus', () => {
    expect(neueSerie('2026-10-11', 3, tag('2026-10-11')).bonus).toBe(0);
  });

  test('Lücke: Serie beginnt neu', () => {
    expect(neueSerie('2026-10-08', 5, tag('2026-10-11')).serie).toBe(1);
  });

  test('Bonus höchstens 50', () => {
    expect(neueSerie('2026-10-10', 20, tag('2026-10-11')).bonus).toBe(50);
  });

  test('Monatswechsel', () => {
    expect(neueSerie('2026-09-30', 1, tag('2026-10-01')).serie).toBe(2);
  });

  test('Tageskey nutzt Ortszeit', () => {
    expect(tagesKey(new Date(2026, 0, 5, 0, 30))).toBe('2026-01-05');
  });
});

describe('Erfolge', () => {
  test('erster Fund', () => {
    expect(neueErfolge(new Set(), new Set(['amsel'])).map((e) => e.id)).toEqual(['erster-fund']);
  });

  test('alle vier Reiche', () => {
    const vorher = new Set(['amsel', 'reh', 'stieleiche']);
    const nachher = new Set([...vorher, 'fliegenpilz']);
    expect(neueErfolge(vorher, nachher).map((e) => e.id)).toEqual(['vier-reiche']);
  });

  test('legendäre Art zählt auch als Seltenheitsjäger', () => {
    const ids = neueErfolge(new Set(['amsel']), new Set(['amsel', 'luchs'])).map((e) => e.id);
    expect(ids).toEqual(['seltenheitsjaeger', 'legende']);
  });
});
