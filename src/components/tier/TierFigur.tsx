import type { FigurName, GeweihZustand, TierSeite } from '@/data/tierSeiten';

import { BiberFigur, BIBER_MASS } from './figuren/Biber';
import { DachsFigur, DACHS_MASS } from './figuren/Dachs';
import { EichhoernchenFigur, EICHHOERNCHEN_MASS } from './figuren/Eichhoernchen';
import { FeldhaseFigur, FELDHASE_MASS } from './figuren/Feldhase';
import { IgelFigur, IGEL_MASS } from './figuren/Igel';
import { KatzeFigur, LUCHS_MASS, WILDKATZE_MASS } from './figuren/Katze';
import type { FigurPose } from './figuren/teile';
import { WildschweinFigur, WILDSCHWEIN_MASS } from './figuren/Wildschwein';
import { FUCHS_AUSSCHNITT, FUCHS_SCHULTER_Y, FuchsFigur } from './FuchsFigur';
import { RehFigur } from './RehFigur';

/**
 * Zeichnet die passende Figur für eine Tierseite mit gemeinsamen Eigenschaften.
 * pose 'aktiv' heißt je nach Tier etwas anderes: Reh äst, Fuchs macht den Mäusesprung,
 * Wildschwein wühlt, Biber schwimmt, Katzen schleichen, Hase rennt, Eichhörnchen springt …
 */
export type { FigurPose };

/**
 * Maße jeder Figur im Zeichenraster (Breite 200, Boden bei y = 150):
 * - ausschnitt: sichtbarer Bereich (oben y0, Höhe)
 * - schulterY: Höhe der Schulter (für Tiere, die über die Schulterhöhe verglichen werden)
 * - laenge: Kopf-Rumpf-Länge in Zeichen-Einheiten (für kleine Tiere, die über die Länge verglichen werden)
 */
export const FIGUR_MASS: Record<
  FigurName,
  { ausschnitt: { y0: number; hoehe: number }; schulterY?: number; laenge?: number }
> = {
  reh: { ausschnitt: { y0: -24, hoehe: 180 }, schulterY: 60 },
  fuchs: { ausschnitt: FUCHS_AUSSCHNITT, schulterY: FUCHS_SCHULTER_Y },
  eichhoernchen: EICHHOERNCHEN_MASS,
  wildschwein: WILDSCHWEIN_MASS,
  dachs: DACHS_MASS,
  igel: IGEL_MASS,
  feldhase: FELDHASE_MASS,
  biber: BIBER_MASS,
  wildkatze: WILDKATZE_MASS,
  luchs: LUCHS_MASS,
};

type Props = {
  tier: TierSeite;
  pose?: FigurPose;
  fell?: number;
  geweih?: GeweihZustand;
  /** Jungtier: Flecken (Kitz), Streifen (Frischling) bzw. dunkles Fell (Welpe) */
  flecken?: boolean;
  streifen?: boolean;
  dunkel?: boolean;
  umriss?: string;
  licht?: boolean;
};

export function TierFigur({ tier, pose = 'steht', fell, geweih, flecken, streifen, dunkel, umriss, licht }: Props) {
  const p = { farben: tier.farben, pose, fell, dunkel, streifen, umriss, licht };
  switch (tier.figur) {
    case 'reh':
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
    case 'fuchs':
      return <FuchsFigur {...p} />;
    case 'eichhoernchen':
      return <EichhoernchenFigur {...p} />;
    case 'wildschwein':
      return <WildschweinFigur {...p} />;
    case 'dachs':
      return <DachsFigur {...p} />;
    case 'igel':
      return <IgelFigur {...p} />;
    case 'feldhase':
      return <FeldhaseFigur {...p} />;
    case 'biber':
      return <BiberFigur {...p} />;
    case 'wildkatze':
      return <KatzeFigur art="wildkatze" {...p} />;
    case 'luchs':
      return <KatzeFigur art="luchs" {...p} />;
  }
}
