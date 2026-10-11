import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSammlung } from '@/store/sammlung';

describe('Sammlung speichert Punkte und Fortschritt', () => {
  beforeEach(() => useSammlung.getState().leeren());

  test('Fund bringt Punkte und wird gespeichert', async () => {
    const b = useSammlung.getState().sammeln('uhu', { datum: '2026-10-11' }, new Date('2026-10-11T10:00:00'));
    expect(b.punkte).toBe(150);
    expect(useSammlung.getState().ap).toBe(150);

    // Ist der Stand auch im Gerätespeicher angekommen (übersteht also einen Neustart)?
    await new Promise((ok) => setTimeout(ok, 0));
    const gespeichert = JSON.parse((await AsyncStorage.getItem('wildfund-sammlung')) ?? '{}');
    expect(gespeichert.state.ap).toBe(150);
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
