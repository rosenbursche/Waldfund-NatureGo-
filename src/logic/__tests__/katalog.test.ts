import { naturraumById } from '@/data/naturraeume';
import { GLIEDERUNG } from '@/data/gliederung';
import { MYSTERY_AB } from '@/data/spiel';
import {
  alleImBaum,
  fortschrittDerKategorie,
  gefahrEintraege,
  istVerborgen,
  katalogGruppen,
  lebensbaum,
  mysteryArten,
  schatzkammer,
  vitrinenArten,
  waldPlaetze,
  zweigFortschritt,
  zweigSchatz,
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

describe('Lebensbaum: Äste, Zweige, Sterne, toter Ast', () => {
  test('Äste und Zweige folgen der Gliederung, Bäume zuerst', () => {
    const baum = lebensbaum('pflanzen', heide);
    const aeste = baum.aeste.map((a) => a.name);
    expect(aeste[0]).toBe('Bäume');
    const plan = GLIEDERUNG.pflanzen.map((a) => a.name);
    expect(aeste).toEqual(plan.filter((n) => aeste.includes(n)));
    const baeume = baum.aeste[0].zweige.map((z) => z.name);
    expect(baeume).toEqual(['Laubbäume', 'Nadelbäume']);
    expect(baum.aeste[0].zweige[1].eintraege.map((e) => e.id)).toEqual(expect.arrayContaining(['eibe', 'waldkiefer']));
    const strauch = baum.aeste.find((a) => a.name === 'Sträucher & Ranken')!;
    expect(strauch.eintraege.map((e) => e.id)).toEqual(
      expect.arrayContaining(['hasel', 'holunder', 'schlehe', 'weissdorn', 'seidelbast']),
    );
  });

  test('Sterne sind nur die legendären Arten – sie hängen auch an ihrem Zweig', () => {
    const baum = lebensbaum('pflanzen', heide);
    expect(baum.sterne.length).toBeGreaterThan(0);
    for (const e of baum.sterne) expect(e.seltenheit).toBe(4);
    const imBaum = alleImBaum(baum).map((e) => e.id);
    for (const e of baum.sterne) expect(imBaum).toContain(e.id);
  });

  test('am Zweig: häufige zuerst, seltene an der Zweigspitze', () => {
    for (const a of lebensbaum('pflanzen', heide).aeste) {
      for (const z of a.zweige) {
        const s = z.eintraege.map((e) => e.seltenheit);
        expect(s).toEqual([...s].sort());
      }
    }
  });

  test('jede Art steht genau einmal an einem Zweig, gefährliche zusätzlich in den Wurzeln', () => {
    for (const k of ['pflanzen', 'pilze', 'voegel', 'saeuger'] as const) {
      const baum = lebensbaum(k, heide);
      const anZweigen = baum.aeste.flatMap((a) => a.zweige.flatMap((z) => z.eintraege)).map((e) => e.id);
      expect(new Set(anZweigen).size).toBe(anZweigen.length);
      expect(anZweigen.length).toBe(fortschrittDerKategorie(k, {}, heide).gesamt);
      for (const w of baum.toterAst) expect(anZweigen).toContain(w.id);
    }
    const knolli = lebensbaum('pilze')
      .aeste.flatMap((a) => a.zweige)
      .find((z) => z.eintraege.some((e) => e.id === 'knolli'));
    expect(knolli?.name).toBe('Wulstlinge, Schirmlinge & Champignons');
  });

  test('Zweig-Schatz: sehr seltene Art zuerst, sonst besondere, sonst die seltenste', () => {
    const e = (id: string, seltenheit: 1 | 2 | 3 | 4, besonders?: string) =>
      ({ id, name: id, lat: id, seltenheit, icon: 'bird', gruppe: 'x', besonders }) as const;
    expect(zweigSchatz([e('a', 1), e('b', 3), e('c', 4)])).toBe('c');
    expect(zweigSchatz([e('a', 2), e('b', 1, 'Rote Liste')])).toBe('b');
    expect(zweigSchatz([e('a', 1), e('b', 2), e('c', 1)])).toBe('b');
    expect(zweigSchatz([])).toBeUndefined();
  });

  test('Zweig-Fortschritt: voll, fehlt und Schatz', () => {
    const z = lebensbaum('voegel').aeste.find((a) => a.name === 'Spechte, Tauben & Juwelen')!.zweige[0];
    expect(z.name).toBe('Spechte');
    expect(zweigFortschritt(z, {})).toMatchObject({ gefunden: 0, voll: false, schatzGefunden: false });
    const alle = Object.fromEntries(z.eintraege.map((x) => [x.id, {}]));
    expect(zweigFortschritt(z, alle)).toMatchObject({ fehlt: 0, voll: true, schatzGefunden: true });
  });

  test('Schatzkammer: seltenste zuerst, gefährlichste nach Stufe', () => {
    const k = schatzkammer('pilze');
    expect(k.seltenste.length).toBeGreaterThan(0);
    expect(k.seltenste[0].seltenheit).toBeGreaterThanOrEqual(k.seltenste[k.seltenste.length - 1].seltenheit);
    expect(k.gefaehrlichste[0].id).toBe('knolli');
    expect(k.gefaehrlichste[0].gefahrStufe).toBe(3);
    expect(schatzkammer('voegel').gefaehrlichste).toEqual([]);
    expect(schatzkammer('saeuger').gefaehrlichste[0].id).toBe('wildschwein');
  });

  test('Gefahren-Sektion: Pilze und Säugetiere haben Einträge, Vögel keine', () => {
    expect(gefahrEintraege('pilze').map((e) => e.id)).toEqual(
      expect.arrayContaining(['fliegenpilz', 'knolli', 'satan']),
    );
    expect(gefahrEintraege('saeuger').map((e) => e.id)).toEqual(expect.arrayContaining(['wildschwein', 'fuchs']));
    expect(gefahrEintraege('voegel')).toEqual([]);
  });
});
