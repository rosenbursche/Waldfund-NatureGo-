import { FUND_TYPEN, fundKandidat, fundstueckKatalog, kandidatenFuerTyp } from '@/logic/fundstueckErkennung';

describe('Fundstücke erkennen', () => {
  test('jeder Fundstück-Typ hat Kandidaten', () => {
    for (const t of FUND_TYPEN) expect(kandidatenFuerTyp(t).size).toBeGreaterThan(0);
  });

  test('Katalog für den Server: alle Typen mit wissenschaftlichen Namen', () => {
    const k = fundstueckKatalog();
    expect(Object.keys(k).sort()).toEqual([...FUND_TYPEN].sort());
    expect(k.losung).toContain('Capreolus capreolus');
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
    expect(fundKandidat(null, 'Capreolus capreolus')).toBeUndefined();
  });
});
