import type { FigurName, GeweihZustand, TierSeite } from '@/data/tierSeiten';

import { FUCHS_AUSSCHNITT, FUCHS_SCHULTER_Y, FuchsFigur } from './FuchsFigur';
import { RehFigur } from './RehFigur';

/**
 * Zeichnet die passende Figur für eine Tierseite (Reh, Fuchs …) mit gemeinsamen Eigenschaften.
 * pose 'aktiv' heißt je nach Tier: Reh äst, Fuchs macht den Mäusesprung.
 */
export type FigurPose = 'steht' | 'aktiv' | 'liegt';

/** Schulterhöhe in der Zeichnung (Boden liegt immer bei y = 150) – für den Größenvergleich */
export const SCHULTER_Y: Record<FigurName, number> = { reh: 60, fuchs: FUCHS_SCHULTER_Y };

/** Bildausschnitt jeder Figur: Breite immer 200, oben bei y0, Höhe `hoehe` (Boden bei y = 150) */
export const AUSSCHNITT: Record<FigurName, { y0: number; hoehe: number }> = {
  reh: { y0: -24, hoehe: 180 },
  fuchs: FUCHS_AUSSCHNITT,
};

type Props = {
  tier: TierSeite;
  pose?: FigurPose;
  fell?: number;
  geweih?: GeweihZustand;
  /** Jungtier: Flecken (Kitz) bzw. dunkles Fell (Welpe) */
  flecken?: boolean;
  dunkel?: boolean;
  umriss?: string;
  licht?: boolean;
};

export function TierFigur({ tier, pose = 'steht', fell, geweih, flecken, dunkel, umriss, licht }: Props) {
  if (tier.figur === 'fuchs') {
    return <FuchsFigur farben={tier.farben} pose={pose} fell={fell} dunkel={dunkel} umriss={umriss} licht={licht} />;
  }
  return (
    <RehFigur
      farben={tier.farben}
      pose={pose === 'aktiv' ? 'aest' : pose}
      fell={fell}
      geweih={geweih}
      flecken={flecken}
      umriss={umriss}
      licht={licht}
    />
  );
}
