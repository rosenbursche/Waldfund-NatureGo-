import { appArtId, auswahlKandidaten, istBestaetigt, type Erkennungsergebnis, type Kandidat } from '@/logic/erkennung';

const k = (id: string, wiss: string, sicherheit: number): Kandidat => ({
  id,
  name: id,
  wiss,
  gruppe: 'saeuger',
  gegenklasse: false,
  sicherheit,
});

describe('Erkennung mit Auswahl', () => {
  test('App-Art wird über den wissenschaftlichen Namen gefunden', () => {
    expect(appArtId({ wiss: 'Capreolus capreolus' })).toBe('reh');
    expect(appArtId({ wiss: 'Sambucus nigra' })).toBe('holunder');
    expect(appArtId({ wiss: 'Carex arenaria' })).toBeUndefined();
  });

  test('bestätigt nur, wenn die Erkennung sicher war und der Nutzer dieselbe Art wählt', () => {
    const reh = k('reh', 'Capreolus capreolus', 0.97);
    const dam = k('dama-dama', 'Dama dama', 0.02);
    const sicher: Erkennungsergebnis = {
      status: 'sicher',
      art: reh,
      gattung: null,
      vorschlaege: [reh, dam],
      hinweis: null,
    };
    expect(istBestaetigt(sicher, reh)).toBe(true);
    expect(istBestaetigt(sicher, dam)).toBe(false);
    expect(istBestaetigt({ ...sicher, status: 'unsicher', art: null }, reh)).toBe(false);
  });

  test('Auswahl: zwei Vorschläge, eine dritte nur, wenn sie ernsthaft in Frage kommt', () => {
    const e = (p3: number): Erkennungsergebnis => ({
      status: 'unsicher',
      art: null,
      gattung: null,
      vorschlaege: [k('a', 'A a', 0.6), k('b', 'B b', 0.2), k('c', 'C c', p3), k('d', 'D d', 0.01)],
      hinweis: null,
    });
    expect(auswahlKandidaten(e(0.03)).map((x) => x.id)).toEqual(['a', 'b']);
    expect(auswahlKandidaten(e(0.15)).map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });
});
