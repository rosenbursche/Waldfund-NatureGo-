import type { BaumArt, Rolle } from '@/logic/baum/stil';
import { colors } from '@/theme/theme';

/**
 * Farbwelt jedes Lebensbaums. Die Geometrie (src/logic/baum) kennt nur Rollen wie "laub" oder "rinde" –
 * hier steht, welche Farbe aus dem Theme dahintersteht.
 */
export type Partikel = 'bluete' | 'spore' | 'feder' | 'gluehwurm';

export type BaumStil = {
  /** Name des Baums, z. B. für den Screenreader */
  name: string;
  /** Holzverlauf von unten nach oben */
  holz: [string, string, string];
  farben: Record<Exclude<Rolle, 'holz'>, string>;
  /** Farbe des leuchtenden Runenrings und der Knöpfe */
  ring: string;
  /** Lichtschein hinter dem Baum */
  schein: string;
  partikel: Partikel;
};

export const BAUM_STILE: Record<BaumArt, BaumStil> = {
  pflanzen: {
    name: 'Silberner Blütenbaum',
    holz: [colors.moss, colors.fog, colors.moon],
    farben: {
      laubHinten: colors.silberLaubDunkel,
      leuchten: colors.rune,
      holzSchatten: colors.silberLaubDunkel,
      rinde: colors.night,
      licht: colors.moon,
      moos: colors.moss,
      ranke: colors.moon,
      laub: colors.silberLaub,
      laubHell: colors.silberLaubHell,
      ader: colors.silberLaubDunkel,
      akzent: colors.amber,
      akzentHell: colors.moon,
      dunkel: colors.night,
    },
    ring: colors.rune,
    schein: colors.moon,
    partikel: 'bluete',
  },
  pilze: {
    name: 'Myzelbaum',
    holz: [colors.myzelStielDunkel, colors.myzelStielMitte, colors.myzelStiel],
    farben: {
      laubHinten: colors.pilzHutDunkel,
      leuchten: colors.myzelLicht,
      holzSchatten: colors.myzelStielDunkel,
      rinde: colors.myzelStielDunkel,
      licht: colors.myzelStiel,
      moos: colors.moss,
      ranke: colors.myzelStiel,
      laub: colors.pilzHut,
      laubHell: colors.pilzLamelle,
      ader: colors.pilzHutDunkel,
      akzent: colors.amber,
      akzentHell: colors.pilzLamelle,
      dunkel: colors.night,
    },
    ring: colors.amber,
    schein: colors.amber,
    partikel: 'spore',
  },
  voegel: {
    name: 'Federbaum im Wind',
    holz: [colors.federHolzDunkel, colors.federHolzMitte, colors.federHolz],
    farben: {
      laubHinten: colors.federDunkel,
      leuchten: colors.federHell,
      holzSchatten: colors.federHolzDunkel,
      rinde: colors.federHolzDunkel,
      licht: colors.federHolz,
      moos: colors.moss,
      ranke: colors.federHolzMitte,
      laub: colors.feder,
      laubHell: colors.federHell,
      ader: colors.federDunkel,
      akzent: colors.amber,
      akzentHell: colors.ei,
      dunkel: colors.night,
    },
    ring: colors.federHell,
    schein: colors.federHell,
    partikel: 'feder',
  },
  saeuger: {
    name: 'Uralter Baumhirte',
    holz: [colors.rindeDunkel, colors.rinde, colors.rindeHell],
    farben: {
      laubHinten: colors.eichenLaubDunkel,
      leuchten: colors.amber,
      holzSchatten: colors.rindeDunkel,
      rinde: colors.rindeDunkel,
      licht: colors.rindeHell,
      moos: colors.moss,
      ranke: colors.eichenLaub,
      laub: colors.eichenLaub,
      laubHell: colors.eichenLaubHell,
      ader: colors.eichenLaubDunkel,
      akzent: colors.eichel,
      akzentHell: colors.amber,
      dunkel: colors.night,
    },
    ring: colors.eichenLaubHell,
    schein: colors.amber,
    partikel: 'gluehwurm',
  },
};
