/**
 * Lebensbaum je Kategorie – jede Kategorie hat ihre eigene Gestalt:
 * Pflanzen = Silberner Blütenbaum, Pilze = Myzelbaum, Vögel = Federbaum im Wind,
 * Säugetiere = Uralter Baumhirte. Das Gerüst (Äste, Sterne, Wurzeln, Runenring) ist überall gleich.
 */
import { astMalen } from './ast';
import { pflanzenBaum, GESTALT_PFLANZEN } from './pflanzen';
import { GESTALT_PILZE, pilzBaum } from './pilze';
import {
  Leinwand,
  rahmen,
  schattenWurzeln,
  type BaumArt,
  type Ebene,
  type Gestalt,
  type Rahmen,
  type Rune,
} from './rahmen';
import { GESTALT_SAEUGER, saeugerBaum } from './saeuger';
import { GESTALT_VOEGEL, vogelBaum } from './voegel';
import {
  bluete,
  eichel,
  eichenBlatt,
  ellipse,
  feder,
  mandelBlatt,
  pilzHut,
  seedAus,
  zufall,
  zwischen,
  type Kurve,
  type Punkt,
  type Zufall,
} from './werkzeug';

export type Augen = { punkt: Punkt; abstand: number; groesse: number };
export type StilErgebnis = { augen?: Augen };

export type BaumForm = {
  art: BaumArt;
  breite: number;
  hoehe: number;
  mitte: Punkt;
  ringRadius: number;
  boden: number;
  /** alle Zeichenebenen von hinten nach vorn */
  ebenen: Ebene[];
  /** Schattenwurzeln unter der Erde (Fläche) */
  schatten: string;
  astSpitzen: Punkt[];
  sternPlaetze: Punkt[];
  wurzelPlatz: Punkt;
  runen: Rune[];
  /** Augen im Stamm (nur beim Baumhirten) */
  augen?: Augen;
};

const BAUM: Record<BaumArt, { gestalt: Gestalt; malen: (R: Rahmen, L: Leinwand, rnd: Zufall) => StilErgebnis }> = {
  pflanzen: { gestalt: GESTALT_PFLANZEN, malen: pflanzenBaum },
  pilze: { gestalt: GESTALT_PILZE, malen: pilzBaum },
  voegel: { gestalt: GESTALT_VOEGEL, malen: vogelBaum },
  saeuger: { gestalt: GESTALT_SAEUGER, malen: saeugerBaum },
};

export function baumForm(breite: number, anzahlAeste: number, anzahlSterne: number, art: BaumArt): BaumForm {
  const rnd = zufall(seedAus(art));
  const { gestalt, malen } = BAUM[art];
  const R = rahmen(breite, anzahlAeste, anzahlSterne, rnd, gestalt);
  const L = new Leinwand();
  const extra = malen(R, L, rnd);
  return {
    art,
    breite,
    hoehe: R.hoehe,
    mitte: R.mitte,
    ringRadius: R.ringRadius,
    boden: R.boden,
    ebenen: L.ebenen(),
    schatten: schattenWurzeln(breite, R.boden, rnd, art === 'pilze'),
    astSpitzen: R.astSpitzen,
    sternPlaetze: R.sternPlaetze,
    wurzelPlatz: R.wurzelPlatz,
    runen: R.runen,
    augen: extra.augen,
  };
}

/**
 * Ein aufgeklappter Ast (senkrecht, Zweige links/rechts zu den Arten) im Stil der Kategorie.
 * `knoten` sind die Mittelpunkte der Art-Knöpfe, der Ast läuft bei x = breite/2 von oben nach unten.
 */
export function astPanelForm(
  art: BaumArt,
  breite: number,
  hoehe: number,
  knoten: Punkt[],
  knotenRadius: number,
): Ebene[] {
  const rnd = zufall(seedAus(art + knoten.length));
  const z = (a: number, b: number) => zwischen(rnd, a, b);
  const L = new Leinwand();
  const m = breite / 2;
  const dick = art === 'saeuger' ? 0.07 : art === 'pilze' ? 0.055 : 0.045;
  astMalen(
    L,
    [
      { x: m, y: 0 },
      { x: m - breite * 0.03, y: hoehe * 0.35 },
      { x: m + breite * 0.03, y: hoehe * 0.7 },
      { x: m, y: hoehe - 8 },
    ],
    breite * dick,
    breite * 0.008,
    rnd,
    {
      schritte: 30,
      rinde: art === 'saeuger' ? 8 : 3,
      rau: art === 'saeuger' ? 0.1 : 0,
      wellig: art === 'saeuger' ? 0.25 : 0.1,
    },
  );
  knoten.forEach((p, i) => {
    const seite = p.x > m ? 1 : -1;
    const start = { x: m, y: p.y + 34 };
    const ende = { x: p.x - seite * (knotenRadius + 2), y: p.y + 6 };
    const weite = Math.abs(ende.x - start.x);
    const k: Kurve = [
      start,
      { x: m + seite * weite * 0.45, y: p.y + 34 },
      { x: ende.x - seite * weite * 0.3, y: ende.y + 6 },
      ende,
    ];
    astMalen(L, k, breite * (art === 'saeuger' ? 0.026 : 0.018), breite * 0.004, rnd, {
      schritte: 14,
      rau: art === 'saeuger' ? 0.12 : 0,
    });
    // Verzierung am Zweig, passend zur Kategorie
    const q = { x: m + seite * weite * 0.55, y: p.y + 28 - i * 0 };
    const g = breite * 0.04;
    const w = -Math.PI / 2 + seite * 0.6;
    if (art === 'pflanzen') {
      for (let n = 0; n < 4; n++) L.flaeche(n % 2 ? 'laubHell' : 'laub', mandelBlatt(q, w + z(-1, 1), g * z(0.8, 1.1)));
      if (rnd() < 0.6) {
        const b = bluete({ x: q.x + seite * 6, y: q.y - g * 0.6 }, g * 0.38, rnd() * 3);
        L.flaeche('akzentHell', b.blaetter);
        L.flaeche('akzent', b.mitte);
      }
    } else if (art === 'pilze') {
      const fuss = { x: q.x, y: q.y - 2 };
      const kopf = { x: q.x + seite * 3, y: q.y - g * 0.9 };
      astMalen(
        L,
        [fuss, { x: fuss.x, y: fuss.y - g * 0.4 }, { x: kopf.x, y: kopf.y + g * 0.3 }, kopf],
        g * 0.25,
        g * 0.18,
        rnd,
        { schritte: 6 },
      );
      const h = pilzHut(kopf, g * 1.1, rnd() < 0.5 ? 'kuppel' : 'glocke', rnd);
      L.flaeche('laub', h.hut);
      L.strich('ader', h.lamellen, 0.6, 0.7);
      L.flaeche('akzentHell', h.tupfen, 0.9);
      L.flaeche('leuchten', ellipse(q.x - seite * 10, q.y + 4, 1.6, 1.6), 0.9);
    } else if (art === 'voegel') {
      for (let n = 0; n < 2; n++) {
        const f = feder(q, w + z(-0.5, 0.5) + 0.2, g * 1.4);
        L.flaeche(n ? 'laubHell' : 'laub', f.fahne);
        L.strich('ader', f.kiel, 0.6, 0.7);
      }
    } else {
      for (let n = 0; n < 4; n++)
        L.flaeche(n % 3 ? 'laub' : 'laubHell', eichenBlatt(q, w + z(-1.2, 1.2), g * z(0.9, 1.2)));
      if (rnd() < 0.6) {
        const e = eichel({ x: q.x + seite * 4, y: q.y + 2 }, g * 0.32);
        L.flaeche('akzent', e.frucht);
        L.flaeche('holzSchatten', e.kappe);
      }
    }
  });
  return L.ebenen();
}

export type { BaumArt, Ebene, Rolle, Rune } from './rahmen';
export { sternPfad, type Punkt } from './werkzeug';
