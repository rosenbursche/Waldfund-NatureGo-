import { GLIEDERUNG } from '@/data/gliederung';
import { KATEGORIEN, MYSTERY_AB } from '@/data/spiel';
import { TESTARTEN, type TestGruppierung } from '@/data/testarten';
import { useEinstellungen } from '@/store/einstellungen';

import { alleImBaum, fortschrittDerKategorie, katalogEintrag, lebensbaum, mysteryArten, waldPlaetze } from '../katalog';

const an = (testGruppierung: TestGruppierung = 'konzept') =>
  useEinstellungen.setState({ belastungstest: true, testGruppierung });

afterEach(() => useEinstellungen.setState({ belastungstest: false, testGruppierung: 'konzept' }));

describe('Testarten', () => {
  test('mindestens 80 echte Arten je Kategorie, IDs eindeutig und mit „t-“', () => {
    for (const k of KATEGORIEN) {
      expect(TESTARTEN.vorschlag.filter((a) => a.kategorie === k.id).length).toBeGreaterThanOrEqual(80);
    }
    const ids = TESTARTEN.vorschlag.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith('t-'))).toBe(true);
  });

  test('jede Testart hat Familie, Ordnung und ein Modell', () => {
    for (const a of TESTARTEN.familie) {
      expect(a.gruppe).not.toBe('?');
      expect(a.modell.t).toBeTruthy();
    }
    for (const a of TESTARTEN.ordnung) expect(a.gruppe).not.toBe('?');
  });
});

describe('Katalog im Belastungstest', () => {
  test('aus: nur die App-Arten', () => {
    useEinstellungen.setState({ belastungstest: false });
    expect(fortschrittDerKategorie('saeuger', {}).gesamt).toBeLessThan(20);
  });

  test('an: alle Testarten erscheinen genau einmal im Lebensbaum', () => {
    an();
    for (const k of KATEGORIEN) {
      const baum = lebensbaum(k.id);
      const ids = alleImBaum(baum).map((e) => e.id);
      const erwartet = TESTARTEN.vorschlag.filter((a) => a.kategorie === k.id).length;
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.length).toBe(erwartet);
    }
  });

  test('Gruppierung nach Familie ergibt mehr Äste als der Vorschlag', () => {
    an('vorschlag');
    const vorschlag = lebensbaum('voegel').aeste.length;
    an('familie');
    const familien = lebensbaum('voegel').aeste.length;
    expect(familien).toBeGreaterThan(vorschlag);
    expect(katalogEintrag('amsel')?.gruppe).toBe('Turdidae');
  });

  test('Mystery und Waldplätze nutzen die Testarten', () => {
    an();
    expect(mysteryArten('pilze').length).toBeGreaterThan(10);
    expect(waldPlaetze('pflanzen').length).toBeGreaterThan(100);
  });
});

describe('Gliederung nach Konzept (Ast → Zweig → Art)', () => {
  test('höchstens 7 Äste, Zweige mit 2–12 Arten, Reihenfolge wie geplant', () => {
    an();
    for (const k of KATEGORIEN) {
      const baum = lebensbaum(k.id);
      expect(baum.aeste.length).toBeLessThanOrEqual(7);
      expect(baum.aeste.map((a) => a.name)).toEqual(
        GLIEDERUNG[k.id].map((a) => a.name).filter((n) => baum.aeste.some((a) => a.name === n)),
      );
      for (const a of baum.aeste) {
        const plan = GLIEDERUNG[k.id].find((p) => p.name === a.name)!;
        expect(a.zweige.map((z) => z.name)).toEqual(plan.zweige);
        for (const z of a.zweige) {
          expect(z.eintraege.length).toBeGreaterThanOrEqual(2);
          expect(z.eintraege.length).toBeLessThanOrEqual(12);
        }
      }
    }
  });

  test('jeder Zweig hat einen Schatz: sehr selten oder besonders markiert', () => {
    an();
    for (const k of KATEGORIEN) {
      for (const a of lebensbaum(k.id).aeste) {
        for (const z of a.zweige) {
          const schatz = z.eintraege.find((e) => e.id === z.schatz)!;
          expect(schatz).toBeDefined();
          expect(schatz.seltenheit >= MYSTERY_AB || !!schatz.besonders).toBe(true);
        }
      }
    }
  });

  test('jeder Ast außer „Meer & Küste“ hat eine sehr seltene Art', () => {
    an();
    for (const k of KATEGORIEN) {
      for (const a of lebensbaum(k.id).aeste) {
        if (a.name === 'Meer & Küste') continue;
        expect(a.eintraege.some((e) => e.seltenheit >= MYSTERY_AB)).toBe(true);
      }
    }
  });

  test('Fledermäuse und Insektenfresser sind Meisteräste', () => {
    an();
    const aeste = lebensbaum('saeuger').aeste;
    expect(aeste.filter((a) => a.mond).map((a) => a.name)).toEqual(['Insektenfresser', 'Fledermäuse']);
  });
});
