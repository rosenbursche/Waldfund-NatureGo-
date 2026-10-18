import { KATEGORIEN } from '@/data/spiel';
import { TESTARTEN } from '@/data/testarten';
import { useEinstellungen } from '@/store/einstellungen';

import { fortschrittDerKategorie, katalogEintrag, lebensbaum, mysteryArten, waldPlaetze } from '../katalog';

const an = (testGruppierung: 'vorschlag' | 'familie' | 'ordnung' = 'vorschlag') =>
  useEinstellungen.setState({ belastungstest: true, testGruppierung });

afterEach(() => useEinstellungen.setState({ belastungstest: false, testGruppierung: 'vorschlag' }));

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
    expect(fortschrittDerKategorie('saeuger', {}).gesamt).toBeLessThan(20);
  });

  test('an: alle Testarten erscheinen genau einmal im Lebensbaum', () => {
    an();
    for (const k of KATEGORIEN) {
      const baum = lebensbaum(k.id);
      const ids = [...baum.aeste.flatMap((a) => a.eintraege), ...baum.sterne, ...baum.wurzeln].map((e) => e.id);
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
    expect(katalogEintrag('t-amsel')?.gruppe).toBe('Turdidae');
  });

  test('Mystery und Waldplätze nutzen die Testarten', () => {
    an();
    expect(mysteryArten('pilze').length).toBeGreaterThan(10);
    expect(waldPlaetze('pflanzen').length).toBeGreaterThan(100);
  });
});
