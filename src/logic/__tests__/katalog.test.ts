import { naturraumById } from '@/data/naturraeume';
import { MYSTERY_AB } from '@/data/spiel';
import {
  fortschrittDerKategorie,
  gefahrEintraege,
  istVerborgen,
  katalogGruppen,
  lebensbaum,
  mysteryArten,
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

describe('Lebensbaum: Äste, Sterne, Schattenwurzeln', () => {
  test('Äste sind die Gruppen, Mystery-Arten werden zu Sternen', () => {
    const baum = lebensbaum('pflanzen', heide);
    const aeste = baum.aeste.map((a) => a.name);
    expect(aeste.indexOf('Bäume')).toBeLessThan(aeste.indexOf('Büsche'));
    expect(baum.aeste.find((a) => a.name === 'Büsche')!.eintraege.map((e) => e.id)).toEqual(
      expect.arrayContaining(['hasel', 'holunder', 'schlehe', 'weissdorn']),
    );
    expect(baum.sterne.map((e) => e.id)).toContain('frauenschuh');
    expect(baum.sterne[0].seltenheit).toBe(4); // legendäre zuerst
    for (const a of baum.aeste) for (const e of a.eintraege) expect(e.seltenheit).toBeLessThan(MYSTERY_AB);
  });

  test('am Ast: häufige zuerst, seltene an der Zweigspitze', () => {
    for (const a of lebensbaum('pflanzen', heide).aeste) {
      const s = a.eintraege.map((e) => e.seltenheit);
      expect(s).toEqual([...s].sort());
    }
  });

  test('jede Art steht genau einmal im Baum, gefährliche nur in den Wurzeln', () => {
    for (const k of ['pflanzen', 'pilze', 'voegel', 'saeuger'] as const) {
      const baum = lebensbaum(k, heide);
      const imBaum = [...baum.aeste.flatMap((a) => a.eintraege), ...baum.sterne].map((e) => e.id);
      const wurzeln = baum.wurzeln.map((e) => e.id);
      expect(new Set([...imBaum, ...wurzeln]).size).toBe(imBaum.length + wurzeln.length);
      expect(imBaum.length + wurzeln.length).toBe(fortschrittDerKategorie(k, {}, heide).gesamt);
    }
    expect(lebensbaum('pflanzen', heide).wurzeln.map((e) => e.id)).toEqual(
      expect.arrayContaining(['eisenhut', 'tollkirsche', 'herbstzeitlose', 'seidelbast', 'eibe']),
    );
  });

  test('Gefahren-Sektion: Pilze und Säugetiere haben Einträge, Vögel keine', () => {
    expect(gefahrEintraege('pilze').map((e) => e.id)).toEqual(
      expect.arrayContaining(['fliegenpilz', 'knolli', 'satan']),
    );
    expect(gefahrEintraege('saeuger').map((e) => e.id)).toEqual(expect.arrayContaining(['wildschwein', 'fuchs']));
    expect(gefahrEintraege('voegel')).toEqual([]);
  });
});
