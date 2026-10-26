import { leseSaison, saisonMonate, zustandImMonat } from '@/logic/jahreszeit';
import { wachstum, wachstumsBereich } from '@/logic/wachstum';

describe('Jahreslauf', () => {
  test('Saison-Texte werden gelesen', () => {
    expect(leseSaison('Blüte März–Mai')).toEqual({ bluete: [3, 4, 5], frucht: [] });
    expect(leseSaison('Blüte Jan–März, Nüsse Sep–Okt')).toEqual({ bluete: [1, 2, 3], frucht: [9, 10] });
    expect(leseSaison('ganzjährig')).toEqual({ bluete: [], frucht: [] });
  });

  test('Buschwindröschen blüht im April, im Dezember ruht es im Boden', () => {
    expect(zustandImMonat('buschwind', 4).bluete).toBe(true);
    expect(zustandImMonat('buschwind', 12).laub).toBe('kahl');
  });

  test('Holunder: Blüte im Juni, Beeren im August', () => {
    expect(zustandImMonat('holunder', 6)).toMatchObject({ bluete: true, frucht: false });
    expect(zustandImMonat('holunder', 8)).toMatchObject({ bluete: false, frucht: true });
  });

  test('Laubbäume werden im Oktober bunt und sind im Winter kahl, Nadelbäume nicht', () => {
    expect(zustandImMonat('rotbuche', 10).laub).toBe('herbst');
    expect(zustandImMonat('rotbuche', 1).laub).toBe('kahl');
    expect(zustandImMonat('fichte', 1).laub).toBe('gruen');
    expect(zustandImMonat('laerche', 1).laub).toBe('kahl'); // Lärche wirft ihre Nadeln ab
  });

  test('Bäume ohne Blütedaten sagen das ehrlich', () => {
    expect(zustandImMonat('hainbuche', 5).datenVorhanden).toBe(false);
  });
});

describe('Wachstum', () => {
  test('Bäume: Regler in Lebensjahren bis zum Höchstalter', () => {
    expect(wachstumsBereich('stieleiche')).toEqual({ max: 1000, einheit: 'Jahre' }); // Höchstalter laut SDW-Steckbrief Eiche
    expect(wachstum('stieleiche', 0).stufe).toBe('Keimling');
    expect(wachstum('stieleiche', 800).stufe).toBe('alter Baum');
    expect(wachstum('stieleiche', 300).groesse).toBe(1);
    expect(wachstum('stieleiche', 10).groesse).toBeLessThan(0.4);
  });

  test('Blumen und Büsche: drei Stufen', () => {
    expect(wachstumsBereich('buschwind')).toEqual({ max: 3, einheit: 'Stufe' });
    expect(wachstum('buschwind', 1).stufe).toBe('Keimling');
    expect(wachstum('hasel', 2).stufe).toBe('junger Strauch');
  });
});

describe('Saison für den Filter „Jetzt in Saison“', () => {
  test('Bereiche, ganzjährig und unbekannt', () => {
    expect(saisonMonate('Blüte März–Mai')).toEqual([3, 4, 5]);
    expect(saisonMonate('Aug–Nov')).toEqual([8, 9, 10, 11]);
    expect(saisonMonate('ganzjährig, nachtaktiv')).toHaveLength(12);
    expect(saisonMonate('März–Nov (Winterschlaf)')).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(saisonMonate('–')).toBeNull();
    expect(saisonMonate(undefined)).toBeNull();
  });
});
