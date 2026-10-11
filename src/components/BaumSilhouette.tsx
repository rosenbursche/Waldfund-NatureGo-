import Svg, { Circle, Ellipse, G, Path, Polygon, Rect } from 'react-native-svg';

import type { BaumModell } from '@/data/typen';
import { colors } from '@/theme/theme';

/**
 * Stilisierte 2D-Silhouette einer Baumart. Jede Kronenform ist erkennbar:
 * Buche rund, Eiche knorrig-ausladend, Fichte schmal-spitz, Tanne mit flacher
 * Spitze, Kiefer mit Schirmkrone, Birke mit weißem Stamm und hängender Krone.
 *
 * Zeichenfläche 100 × 140, der Boden liegt bei y = 140.
 * In Phase 3 bekommen die Bäume echte 3D-Formen nach denselben Parametern.
 */
type Props = { modell: BaumModell; breite?: number; dunkel?: boolean };

export function BaumSilhouette({ modell, breite = 60, dunkel = false }: Props) {
  // "dunkel" = noch nicht gefunden: dunkle Silhouette statt Farbe
  const laub = dunkel ? colors.forest : modell.laub;
  const rinde = dunkel ? colors.forest : modell.rinde;
  const schatten = colors.night;

  return (
    <Svg width={breite} height={breite * 1.4} viewBox="0 0 100 140">
      <Krone krone={modell.krone} laub={laub} rinde={rinde} schatten={schatten} />
    </Svg>
  );
}

function Krone({ krone, laub, rinde, schatten }: { krone: BaumModell['krone']; laub: string; rinde: string; schatten: string }) {
  switch (krone) {
    case 'rund': // Buche: breite, runde Krone, glatter grauer Stamm
      return (
        <G>
          <Rect x={46} y={78} width={8} height={62} rx={3} fill={rinde} />
          <Ellipse cx={50} cy={56} rx={40} ry={40} fill={laub} />
          <Ellipse cx={58} cy={66} rx={30} ry={26} fill={schatten} opacity={0.22} />
        </G>
      );
    case 'ausladend': // Eiche: knorrig, ausladend
      return (
        <G>
          <Path d="M46 140 L47 96 L32 78 M53 140 L54 92 L70 74 M50 100 L50 70" stroke={rinde} strokeWidth={8} strokeLinecap="round" fill="none" />
          <Circle cx={28} cy={64} r={22} fill={laub} />
          <Circle cx={72} cy={60} r={24} fill={laub} />
          <Circle cx={50} cy={44} r={26} fill={laub} />
          <Circle cx={14} cy={80} r={12} fill={laub} />
          <Circle cx={86} cy={78} r={13} fill={laub} />
          <Circle cx={64} cy={72} r={18} fill={schatten} opacity={0.2} />
        </G>
      );
    case 'kegel': // Fichte: schmal, spitz
      return (
        <G>
          <Rect x={47} y={110} width={6} height={30} fill={rinde} />
          <Polygon points="50,4 70,54 30,54" fill={laub} />
          <Polygon points="50,30 76,86 24,86" fill={laub} />
          <Polygon points="50,58 80,118 20,118" fill={laub} />
          <Polygon points="50,58 80,118 56,118" fill={schatten} opacity={0.2} />
        </G>
      );
    case 'kegel-flach': // Tanne: breiter, flache (abgerundete) Spitze
      return (
        <G>
          <Rect x={46} y={110} width={8} height={30} fill={rinde} />
          <Polygon points="42,10 58,10 74,52 26,52" fill={laub} />
          <Polygon points="38,34 62,34 84,86 16,86" fill={laub} />
          <Polygon points="34,62 66,62 92,118 8,118" fill={laub} />
          <Polygon points="50,62 66,62 92,118 56,118" fill={schatten} opacity={0.2} />
        </G>
      );
    case 'schirm': // Kiefer: Schirmkrone, oben rötlicher Stamm
      return (
        <G>
          <Rect x={46} y={40} width={8} height={100} rx={3} fill={rinde} />
          <Path d="M50 60 L30 44 M50 52 L72 38" stroke={rinde} strokeWidth={5} strokeLinecap="round" />
          <Ellipse cx={50} cy={32} rx={40} ry={16} fill={laub} />
          <Ellipse cx={26} cy={42} rx={14} ry={8} fill={laub} />
          <Ellipse cx={76} cy={36} rx={14} ry={8} fill={laub} />
          <Ellipse cx={56} cy={38} rx={28} ry={8} fill={schatten} opacity={0.2} />
        </G>
      );
    case 'haengend': // Birke: weißer Stamm, lockere hängende Krone
      return (
        <G>
          <Rect x={47} y={40} width={6} height={100} rx={2} fill={rinde} />
          <Path d="M47 70h4M49 92h4M47 112h3M50 56h3" stroke={schatten} strokeWidth={2} />
          <Ellipse cx={50} cy={50} rx={30} ry={42} fill={laub} opacity={0.85} />
          <Path d="M26 60 Q22 90 28 108 M74 60 Q78 90 72 108 M38 70 Q34 96 38 112 M62 70 Q66 96 62 112" stroke={laub} strokeWidth={3} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'saeule':
      return (
        <G>
          <Rect x={47} y={100} width={6} height={40} fill={rinde} />
          <Ellipse cx={50} cy={58} rx={16} ry={52} fill={laub} />
        </G>
      );
    case 'oval':
    default:
      return (
        <G>
          <Rect x={46} y={84} width={8} height={56} rx={3} fill={rinde} />
          <Ellipse cx={50} cy={54} rx={28} ry={44} fill={laub} />
          <Ellipse cx={56} cy={64} rx={20} ry={30} fill={schatten} opacity={0.2} />
        </G>
      );
  }
}
