import { FUND_TYPEN, fundKandidat, kandidatenFuerTyp } from '@/logic/fundstueckErkennung';

describe('Was hast du fotografiert?', () => {
  test('jeder Fundstück-Typ hat Kandidaten, „ganz“ keine', () => {
    for (const t of FUND_TYPEN) {
      const n = kandidatenFuerTyp(t.id).size;
      if (t.id === 'ganz') expect(n).toBe(0);
      else expect(n).toBeGreaterThan(0);
    }
  });

  test('Spuren: Reh und Wildschwein sind dabei, Bäume nicht', () => {
    const spuren = kandidatenFuerTyp('trittsiegel');
    expect(spuren.has('Capreolus capreolus')).toBe(true);
    expect(spuren.has('Sus scrofa')).toBe(true);
    expect(spuren.has('Fagus sylvatica')).toBe(false);
  });

  test('Vorschlag des Servers wird dem Fundstück der App zugeordnet', () => {
    const k = fundKandidat('trittsiegel', 'Capreolus capreolus');
    expect(k?.artId).toBe('reh');
    expect(['faehrte', 'spur']).toContain(k?.fundstueck.typ);
    expect(fundKandidat('feder', 'Capreolus capreolus')).toBeUndefined();
  });
});
