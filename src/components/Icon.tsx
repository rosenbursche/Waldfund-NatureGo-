import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '@/theme/theme';

/**
 * Kleine, handgezeichnet wirkende Symbole (Strichzeichnungen).
 * Achtung: Nicht "Symbol" nennen – das ist ein eingebauter JavaScript-Name.
 */
export type IconArt = 'standort' | 'lupe' | 'liste' | 'zurueck' | 'zahnrad' | 'pfeil' | 'kampf';

const PFADE: Record<IconArt, React.ReactNode> = {
  standort: (
    <>
      <Path d="M12 21s-6.5-6.2-6.5-11.3A6.5 6.5 0 0 1 18.5 9.7C18.5 14.8 12 21 12 21z" />
      <Circle cx={12} cy={9.6} r={2.4} />
    </>
  ),
  lupe: (
    <>
      <Circle cx={10.5} cy={10.5} r={6} />
      <Path d="M15 15l5.5 5.5" />
    </>
  ),
  liste: <Path d="M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.5M4 12h.5M4 17.5h.5" />,
  zurueck: <Path d="M15 5l-7 7 7 7" />,
  pfeil: <Path d="M5 12h14M13 6l6 6-6 6" />,
  // zwei gekreuzte Klingen mit Griff (Kampf-Arena)
  kampf: <Path d="M5 4l10.5 10.5M19 4L8.5 14.5M13 17l4-4M7 13l4 4M16.5 16.5L20 20M7.5 16.5L4 20" />,
  zahnrad: (
    <>
      <Circle cx={12} cy={12} r={3.2} />
      <Path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </>
  ),
};

export function Icon({ name, groesse = 22, farbe = colors.moon }: { name: IconArt; groesse?: number; farbe?: string }) {
  return (
    <Svg
      width={groesse}
      height={groesse}
      viewBox="0 0 24 24"
      fill="none"
      stroke={farbe}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PFADE[name]}
    </Svg>
  );
}
