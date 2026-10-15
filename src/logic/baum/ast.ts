import type { Leinwand } from './rahmen';
import { lichtKante, rindenLinien, schattenSeite, verjuengt, type Kurve, type Zufall } from './werkzeug';

const halb = (n: number) => Math.max(0.5, Math.round(n * 2) / 2);

/**
 * Einen Ast mit allen Details malen: Holz, Schattenseite, Lichtkante, Rindenfurchen.
 * So wirkt jeder Ast rund statt flach.
 */
export function astMalen(
  L: Leinwand,
  k: Kurve,
  w0: number,
  w1: number,
  rnd: Zufall,
  o: { rinde?: number; rau?: number; schritte?: number; wellig?: number; schatten?: number } = {},
) {
  const schritte = o.schritte ?? 18;
  L.flaeche('holz', verjuengt(k, w0, w1, schritte, o.rau ?? 0, rnd));
  if (w0 > 2.5) L.flaeche('holzSchatten', schattenSeite(k, w0, w1, schritte), o.schatten ?? 0.55);
  if (w0 > 4) L.strich('licht', lichtKante(k, w0, w1), halb(w0 * 0.07), 0.6);
  if (o.rinde) L.strich('rinde', rindenLinien(k, w0, w1, o.rinde, rnd, o.wellig ?? 0.15), halb(w0 * 0.05), 0.5);
}
