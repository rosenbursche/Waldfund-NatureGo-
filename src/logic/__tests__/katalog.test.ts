import { naturraumById } from '@/data/naturraeume';
import { MYSTERY_AB } from '@/data/spiel';
import {
  fortschrittDerKategorie,
  gefahrEintraege,
  istVerborgen,
  katalogGruppen,
  mysteryArten,
  stammbaumStufen,
  vitrinenArten,
  waldPlaetze,
} from '@/logic/katalog';

const heide = naturraumById['lueneburger-heide'];

describe('Katalog', () => {
  test('Pflanzen: Gruppe "Bäume" enthält die heimischen Bäume des Naturraums, jede Art nur einmal', () => {
    const baeume = katalogGruppen('pflanzen', heide).find((g) => g.name === 'Bäume')!;
    const ids = baeume.eintraege.map((e) => e.id);
    expect(ids).toEqual(expect.arrayContaining(['stieleiche', 'rotbuche', 'sandbirke', 'waldkiefer']));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain('fichte'); // in der Heide nicht heimisch
  });

  test('Stammbaum enthält keine Mystery-Arten', () => {
    for (const k of ['pflanzen', 'pilze', 'voegel', 'saeuger'] as const) {
      for (const g of katalogGruppen(k, heide)) {
        for (const e of g.eintraege) expect(e.seltenheit).toBeLessThan(MYSTERY_AB);
      }
    }
  });

  test('Mystery-Zone: 2 bis 3 Arten je Kategorie, alle mit Rätsel', () => {
    for (const k of ['pflanzen', 'pilze', 'voegel', 'saeuger'] as const) {
      const m = mysteryArten(k);
      expect(m.length).toBeGreaterThanOrEqual(2);
      for (const e of m) expect(e.raetsel).toBeTruthy();
    }
    expect(mysteryArten().length).toBe(10);
  });

  test('Mystery-Art ist verborgen, bis man sie findet', () => {
    expect(istVerborgen('luchs', {})).toBe(true);
    expect(istVerborgen('luchs', { luchs: {} })).toBe(false);
    expect(istVerborgen('amsel', {})).toBe(false);
  });

  test('Fortschritt zählt Bäume des Naturraums mit', () => {
    const f = fortschrittDerKategorie('pflanzen', { stieleiche: {}, sandbirke: {} }, heide);
    expect(f.gefunden).toBe(2);
    expect(f.gesamt).toBeGreaterThan(9);
  });
});

describe('Vitrine am Runenstein und Plätze im Wald', () => {
  test('höchstens drei gefundene Arten, die seltensten zuerst', () => {
    const g = {
      amsel: { datum: '2026-10-01' },
      kohlmeise: { datum: '2026-10-05' },
      eisvogel: { datum: '2026-09-01' },
      uhu: { datum: '2026-08-01' },
      rotkehlchen: { datum: '2026-10-09' },
    };
    expect(vitrinenArten('voegel', g)).toEqual(['uhu', 'eisvogel', 'rotkehlchen']);
  });

  test('keine Funde – leere Vitrine; andere Kategorie zählt nicht', () => {
    expect(vitrinenArten('pilze', { amsel: { datum: '2026-10-01' } })).toEqual([]);
  });

  test('jede Art der Kategorie bekommt genau einen Platz im Wald, ohne Überlappung', () => {
    const p = waldPlaetze('pflanzen', heide);
    expect(new Set(p.map((x) => x.id)).size).toBe(p.length);
    expect(p.some((x) => x.id === 'frauenschuh')).toBe(true); // Mystery-Arten stehen auch im Wald (mit Schloss)
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        expect(Math.hypot(p[i].x - p[j].x, p[i].z - p[j].z)).toBeGreaterThan(1.2);
      }
    }
  });

  test('Vögel sitzen erhöht', () => {
    expect(waldPlaetze('voegel').every((p) => p.hoch)).toBe(true);
    expect(waldPlaetze('pilze').some((p) => p.hoch)).toBe(false);
  });
});

describe('Stammbaum nach Seltenheit und Gefahren-Sektion', () => {
  test('Stufen von legendär (Krone) bis häufig (Wurzeln)', () => {
    const stufen = stammbaumStufen('pflanzen', heide);
    expect(stufen.map((s) => s.seltenheit)).toEqual([4, 3, 2, 1]);
    const ids = (s: number) =>
      stufen.find((x) => x.seltenheit === s)!.gruppen.flatMap((g) => g.eintraege.map((e) => e.id));
    expect(ids(4)).toContain('frauenschuh');
    expect(ids(1)).toEqual(expect.arrayContaining(['stieleiche', 'hasel']));
  });

  test('Pflanzen sind sinnvoll eingeteilt: Bäume vor Büschen', () => {
    const haeufig = stammbaumStufen('pflanzen', heide).find((s) => s.seltenheit === 1)!;
    const namen = haeufig.gruppen.map((g) => g.name);
    expect(namen.indexOf('Bäume')).toBeLessThan(namen.indexOf('Büsche'));
    expect(haeufig.gruppen.find((g) => g.name === 'Büsche')!.eintraege.map((e) => e.id)).toEqual(
      expect.arrayContaining(['hasel', 'holunder', 'schlehe', 'weissdorn']),
    );
  });

  test('gefährliche Arten stehen nur in ihrer eigenen Sektion', () => {
    const gefahr = gefahrEintraege('pflanzen', heide).map((e) => e.id);
    expect(gefahr).toEqual(expect.arrayContaining(['eisenhut', 'tollkirsche', 'herbstzeitlose', 'seidelbast', 'eibe']));
    const imBaum = stammbaumStufen('pflanzen', heide).flatMap((s) =>
      s.gruppen.flatMap((g) => g.eintraege.map((e) => e.id)),
    );
    for (const id of gefahr) expect(imBaum).not.toContain(id);
  });

  test('Gefahren-Sektion: Pilze und Säugetiere haben Einträge, Vögel keine', () => {
    expect(gefahrEintraege('pilze').map((e) => e.id)).toEqual(
      expect.arrayContaining(['fliegenpilz', 'knolli', 'satan']),
    );
    expect(gefahrEintraege('saeuger').map((e) => e.id)).toEqual(expect.arrayContaining(['wildschwein', 'fuchs']));
    expect(gefahrEintraege('voegel')).toEqual([]);
  });
});
