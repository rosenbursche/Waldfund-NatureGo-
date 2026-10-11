import { BAUMARTEN, baumById } from '@/data/baumarten';
import { naturraumById } from '@/data/naturraeume';
import { getAngepflanzteBaeume, getHeimischeBaeume, herkunftsText, istHeimisch } from '@/logic/regelEngine';

/** Hilfsfunktion: nur die IDs der heimischen Bäume */
const ids = (naturraumId: string) => getHeimischeBaeume(naturraumById[naturraumId]).map((t) => t.baumart.id);
const rolle = (naturraumId: string, baumId: string) =>
  getHeimischeBaeume(naturraumById[naturraumId]).find((t) => t.baumart.id === baumId)?.rolle;

describe('Lüneburger Heide', () => {
  test('enthält die erwarteten heimischen Arten', () => {
    expect(ids('lueneburger-heide')).toEqual(
      expect.arrayContaining(['stieleiche', 'sandbirke', 'waldkiefer', 'traubeneiche', 'rotbuche']),
    );
  });

  test('Moorbirke und Schwarzerle nur an feuchten Stellen', () => {
    const baeume = getHeimischeBaeume(naturraumById['lueneburger-heide']);
    for (const id of ['moorbirke', 'schwarzerle']) {
      const t = baeume.find((b) => b.baumart.id === id);
      expect(t?.rolle).toBe('begleiter');
      expect(t?.hinweis).toBe('an feuchten Stellen');
    }
  });

  test('Stieleiche ist Hauptbaumart und steht ganz oben', () => {
    expect(ids('lueneburger-heide')[0]).toBe('stieleiche');
  });

  test('keine Bergwald-Arten', () => {
    for (const id of ['fichte', 'weisstanne', 'laerche', 'bergahorn']) {
      expect(ids('lueneburger-heide')).not.toContain(id);
    }
  });

  test('Fichte gilt hier als angepflanzt', () => {
    const n = naturraumById['lueneburger-heide'];
    expect(getAngepflanzteBaeume(n).map((b) => b.id)).toContain('fichte');
    expect(herkunftsText(baumById['fichte'], n)).toBe('Gemeine Fichte – hier angepflanzt, nicht heimisch');
  });
});

describe('Innerer Bayerischer Wald', () => {
  test('Bergmischwald aus Fichte, Tanne, Buche, Bergahorn, Vogelbeere', () => {
    expect(ids('innerer-bayerischer-wald')).toEqual(
      expect.arrayContaining(['fichte', 'weisstanne', 'rotbuche', 'bergahorn', 'vogelbeere']),
    );
  });

  test('Fichte ist hier heimisch', () => {
    const n = naturraumById['innerer-bayerischer-wald'];
    expect(istHeimisch('fichte', n)).toBe(true);
    expect(herkunftsText(baumById['fichte'], n)).toBe('Gemeine Fichte – hier von Natur aus heimisch');
  });

  test('Lärche ist hier nicht heimisch', () => {
    expect(ids('innerer-bayerischer-wald')).not.toContain('laerche');
  });
});

describe('Hochharz', () => {
  test('Fichte ist Hauptbaumart', () => {
    expect(rolle('hochharz', 'fichte')).toBe('haupt');
  });

  test('keine Weißtanne (im Harz nicht von Natur aus)', () => {
    expect(ids('hochharz')).not.toContain('weisstanne');
  });
});

describe('Bayerische Alpen', () => {
  test('Europäische Lärche ist heimisch', () => {
    expect(ids('bayerische-alpen')).toContain('laerche');
  });

  test('Bergmischwald mit Buche als Hauptbaumart', () => {
    expect(rolle('bayerische-alpen', 'rotbuche')).toBe('haupt');
    expect(ids('bayerische-alpen')).toEqual(expect.arrayContaining(['fichte', 'weisstanne', 'bergahorn']));
  });
});

describe('Schwarzwald und Schwäbische Alb', () => {
  test('Fichte im Schwarzwald nicht heimisch', () => {
    expect(ids('schwarzwald')).not.toContain('fichte');
  });

  test('Lärche außerhalb der Alpen nie heimisch', () => {
    for (const id of ['schwarzwald', 'schwaebische-alb', 'oberes-erzgebirge', 'hochharz']) {
      expect(ids(id)).not.toContain('laerche');
    }
  });

  test('Schwäbische Alb: Buche dominiert auf Kalk', () => {
    expect(rolle('schwaebische-alb', 'rotbuche')).toBe('haupt');
  });
});

describe('Allgemeine Regeln', () => {
  const alle = Object.values(naturraumById);

  test('Douglasie und Roteiche sind nirgends heimisch', () => {
    for (const n of alle) {
      expect(istHeimisch('douglasie', n)).toBe(false);
      expect(istHeimisch('roteiche', n)).toBe(false);
      expect(herkunftsText(baumById['douglasie'], n)).toContain('in Deutschland nicht heimisch');
    }
  });

  test('Anteile ergeben in jedem Naturraum zusammen 100 %', () => {
    for (const n of alle) {
      const summe = getHeimischeBaeume(n).reduce((s, t) => s + t.anteil, 0);
      expect(summe).toBeCloseTo(1, 5);
    }
  });

  test('jeder Naturraum hat mindestens eine Hauptbaumart', () => {
    for (const n of alle) {
      expect(getHeimischeBaeume(n)[0].rolle).toBe('haupt');
    }
  });

  test('Liste ist nach Rolle sortiert', () => {
    const reihenfolge = { haupt: 0, neben: 1, begleiter: 2 };
    for (const n of alle) {
      const r = getHeimischeBaeume(n).map((t) => reihenfolge[t.rolle]);
      expect(r).toEqual([...r].sort((a, b) => a - b));
    }
  });

  test('alle 26 Arten der Startliste sind als heimisch erfasst', () => {
    expect(BAUMARTEN.filter((b) => b.status === 'heimisch')).toHaveLength(26);
  });

  test('jede heimische Art kommt in mindestens einem Demo-Naturraum vor', () => {
    const vorkommend = new Set(alle.flatMap((n) => getHeimischeBaeume(n).map((t) => t.baumart.id)));
    const fehlend = BAUMARTEN.filter((b) => b.status === 'heimisch' && !vorkommend.has(b.id)).map((b) => b.id);
    expect(fehlend).toEqual([]);
  });
});
