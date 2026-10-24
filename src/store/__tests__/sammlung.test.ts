import AsyncStorage from '@react-native-async-storage/async-storage';

import { AST_BONUS, ZWEIG_BONUS } from '@/data/spiel';
import { talerStufe, useSammlung } from '@/store/sammlung';

describe('Sammlung speichert Punkte und Fortschritt', () => {
  beforeEach(() => useSammlung.getState().leeren());

  test('Fund bringt Punkte und wird gespeichert', async () => {
    const b = useSammlung.getState().sammeln('uhu', { datum: '2026-10-11' }, new Date('2026-10-11T10:00:00'));
    expect(b.punkte).toBe(300);
    // der Uhu ist in den App-Daten die einzige Art in Zweig „Eulen“ und Ast „Jäger der Lüfte“:
    // sein Fund vollendet beide und bringt den Sammelset-Bonus
    expect(b).toMatchObject({
      zweigeVoll: ['Eulen'],
      aesteVoll: ['Jäger der Lüfte'],
      setBonus: ZWEIG_BONUS + AST_BONUS,
    });
    expect(useSammlung.getState().ap).toBe(300 + ZWEIG_BONUS + AST_BONUS);

    // Ist der Stand auch im Gerätespeicher angekommen (übersteht also einen Neustart)?
    await new Promise((ok) => setTimeout(ok, 0));
    const gespeichert = JSON.parse((await AsyncStorage.getItem('wildfund-sammlung')) ?? '{}');
    expect(gespeichert.state.ap).toBe(300 + ZWEIG_BONUS + AST_BONUS);
    expect(gespeichert.state.gefunden.uhu.datum).toBe('2026-10-11');
  });

  test('Beispielfunde bringen keine Punkte, echter Fund danach schon', () => {
    useSammlung.getState().beispielfundeLaden();
    expect(useSammlung.getState().ap).toBe(0);
    const b = useSammlung.getState().sammeln('amsel', { datum: '2026-10-11' });
    expect(b.neu).toBe(true);
    expect(useSammlung.getState().gefunden.amsel.beispiel).toBeUndefined();
  });

  test('zweites Foto derselben Art bringt keine Punkte', () => {
    const { sammeln } = useSammlung.getState();
    sammeln('amsel', { datum: '2026-10-11', foto: 'a.jpg' });
    const b = sammeln('amsel', { datum: '2026-10-12', foto: 'b.jpg' });
    expect(b.punkte).toBe(0);
    expect(useSammlung.getState().gefunden.amsel).toEqual({ datum: '2026-10-11', foto: 'b.jpg' });
  });
});

describe('Fundstücke und Taler-Stufe', () => {
  beforeEach(() => useSammlung.getState().leeren());

  test('Fundstücke heben den Taler von Holz bis Bronze', () => {
    const { fundstueckSammeln } = useSammlung.getState();
    expect(fundstueckSammeln('wildschwein', 'suhle', { datum: '2026-10-24' })).toEqual({ vorher: 0, nachher: 1 });
    fundstueckSammeln('wildschwein', 'trittsiegel', { datum: '2026-10-24' });
    expect(fundstueckSammeln('wildschwein', 'losung', { datum: '2026-10-24' })).toEqual({ vorher: 1, nachher: 2 });
  });

  test('alter Art-Fund zählt wie die Sichtung (Silber)', () => {
    useSammlung.getState().sammeln('wildschwein', { datum: '2026-10-24' });
    expect(talerStufe('wildschwein', useSammlung.getState())).toBe(3);
  });

  test('zweites Foto ersetzt nur das Bild', () => {
    const { fundstueckSammeln } = useSammlung.getState();
    fundstueckSammeln('rotbuche', 'rinde', { datum: '2026-10-01', foto: 'a.jpg' });
    fundstueckSammeln('rotbuche', 'rinde', { datum: '2026-10-24', foto: 'b.jpg' });
    expect(useSammlung.getState().fundstuecke.rotbuche.rinde).toEqual({ datum: '2026-10-01', foto: 'b.jpg' });
  });
});
