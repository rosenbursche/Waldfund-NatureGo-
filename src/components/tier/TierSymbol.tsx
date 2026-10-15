import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { colors } from '@/theme/theme';

/**
 * Kleine, handgezeichnet wirkende Symbole für die grafische Tierseite (Raster 24 × 24, Strichzeichnung).
 * Sie ersetzen Text: Futter, Spuren, Körperteile, Tageszeiten, Gesten-Hinweise.
 */
export type SymbolName =
  | 'spiegel'
  | 'geweih'
  | 'ohr'
  | 'nase'
  | 'bein'
  | 'auge'
  | 'knospe'
  | 'trieb'
  | 'kraut'
  | 'blatt'
  | 'eichel'
  | 'tritt'
  | 'losung'
  | 'verbiss'
  | 'fegen'
  | 'wolf'
  | 'maehen'
  | 'sonne'
  | 'mond'
  | 'herz'
  | 'uhr'
  | 'rad'
  | 'mulde'
  | 'tippen'
  | 'ziehen'
  | 'stopp'
  | 'lineal'
  | 'waage'
  | 'schild'
  | 'baum'
  | 'wiese'
  | 'gebuesch'
  | 'keim'
  | 'schnee'
  | 'bluete'
  | 'karte'
  | 'buch'
  | 'lunte'
  | 'pfote'
  | 'maus'
  | 'wurm'
  | 'kaefer'
  | 'beere'
  | 'knochen'
  | 'bau'
  | 'auto';

type Props = { name: SymbolName; groesse?: number; farbe?: string; dicke?: number };

export function TierSymbol({ name, groesse = 24, farbe = colors.moon, dicke = 1.6 }: Props) {
  const s = { stroke: farbe, strokeWidth: dicke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const f = { fill: farbe };
  return (
    <Svg width={groesse} height={groesse} viewBox="0 0 24 24" fill="none">
      {zeichnen(name, s, f)}
    </Svg>
  );
}

type Strich = { stroke: string; strokeWidth: number; strokeLinecap: 'round'; strokeLinejoin: 'round' };

function zeichnen(name: SymbolName, s: Strich, f: { fill: string }) {
  switch (name) {
    case 'spiegel':
      return (
        <G>
          <Path d="M4 10 C8 6 16 6 20 9" {...s} />
          <Path d="M7 9 C5 13 6 18 10 20 C13 17 13 12 11 9" {...s} />
        </G>
      );
    case 'geweih':
      return (
        <G>
          <Path d="M9 21 C9 15 8 9 9 3 M9 12 L13 9 M8.5 6 L5 4" {...s} />
          <Path d="M15 21 C15 15 16 9 15 3 M15 12 L19 9 M15.5 6 L19 4" {...s} />
        </G>
      );
    case 'ohr':
      return <Path d="M8 21 C4 14 4 7 7 2 C13 5 16 12 15 21 M9 17 C8 12 8 9 9 6" {...s} />;
    case 'nase':
      return (
        <G>
          <Path d="M3 9 C9 7 15 8 19 11 C21 13 20 16 17 16 C12 16 7 15 3 15" {...s} />
          <Ellipse cx={18} cy={12.5} rx={1.6} ry={1.3} {...f} />
          <Path d="M8 5 C9 3.5 10.5 3 12 3.5 M5 6 C6 4 7 3.3 8 3" {...s} strokeWidth={s.strokeWidth * 0.7} />
        </G>
      );
    case 'bein':
      return <Path d="M7 3 C14 4 16 9 13 13 L10 16 L12 22 M14 22 L10 22" {...s} />;
    case 'auge':
      return (
        <G>
          <Path d="M2 12 C6 6 18 6 22 12 C18 18 6 18 2 12 Z" {...s} />
          <Circle cx={12} cy={12} r={3} {...f} />
        </G>
      );
    case 'knospe':
      return (
        <G>
          <Path d="M12 22 L12 10" {...s} />
          <Path d="M12 11 C8 9 8 4 12 2 C16 4 16 9 12 11 Z" {...s} />
          <Path d="M12 16 L16 13 M16 13 C17 11 19 11 19 12 C19 14 17 14 16 13" {...s} />
        </G>
      );
    case 'trieb':
      return (
        <G>
          <Path d="M12 22 C12 16 12 10 13 4" {...s} />
          <Path d="M12 14 C8 13 6 10 6 7 C9 7 12 10 12 14 M13 9 C16 8 18 6 18 3 C15 3 13 5 13 9" {...s} />
        </G>
      );
    case 'kraut':
      return (
        <G>
          <Path d="M12 22 L12 8 M12 15 L7 11 M12 12 L17 8 M12 18 L17 15" {...s} />
          <Circle cx={12} cy={6} r={2} {...s} />
          <Circle cx={6.5} cy={10.5} r={1.4} {...f} />
          <Circle cx={17.5} cy={7.5} r={1.4} {...f} />
        </G>
      );
    case 'blatt':
      return (
        <G>
          <Path d="M4 20 C4 10 10 4 20 4 C20 14 14 20 4 20 Z" {...s} />
          <Path d="M4 20 L15 9 M9 15 L9 11 M12 12 L15 13" {...s} />
        </G>
      );
    case 'eichel':
      return (
        <G>
          <Path d="M6 10 C6 6 18 6 18 10 Z" {...s} />
          <Path d="M7 10 C7 17 10 21 12 21 C14 21 17 17 17 10" {...s} />
          <Path d="M12 6 L13 3" {...s} />
        </G>
      );
    case 'tritt':
      return (
        <G>
          <Path d="M11 3 C7 6 6 13 8 20 C10 20 11 18 11 15 Z" {...s} {...f} />
          <Path d="M13 3 C17 6 18 13 16 20 C14 20 13 18 13 15 Z" {...s} {...f} />
        </G>
      );
    case 'losung':
      return (
        <G>
          {[
            [8, 9],
            [13, 8],
            [17, 11],
            [10, 14],
            [15, 15],
            [7, 18],
            [12, 19],
          ].map(([x, y]) => (
            <Ellipse key={`${x}-${y}`} cx={x} cy={y} rx={2.2} ry={1.6} {...f} />
          ))}
        </G>
      );
    case 'verbiss':
      return (
        <G>
          <Path d="M12 22 L12 9 M12 15 L17 11" {...s} />
          <Path d="M10 9 L11 6 L12 8 L13 5 L14 9" {...s} />
        </G>
      );
    case 'fegen':
      return (
        <G>
          <Path d="M9 22 L9 2 M15 22 L15 2" {...s} />
          <Path d="M9 8 C11 9 13 7 15 8 M9 14 C11 15 13 13 15 14" {...s} />
          <Path d="M15 9 L19 7 M15 12 L20 12 M9 11 L4 10" {...s} strokeWidth={s.strokeWidth * 0.7} />
        </G>
      );
    case 'wolf':
      return (
        <G>
          <Path
            d="M3 14 C5 11 8 10 11 10 L14 6 L15 9 L17 6 L18 10 C20 11 21 13 21 14 L17 15 C16 18 14 21 12 21 C9 19 7 16 3 14 Z"
            {...s}
          />
          <Circle cx={15.5} cy={11.5} r={0.9} {...f} />
        </G>
      );
    case 'maehen':
      return (
        <G>
          <Path d="M3 18 L13 18 L15 12 L19 12 L21 18 L19 18" {...s} />
          <Circle cx={7} cy={19} r={2.4} {...s} />
          <Circle cx={18} cy={19.5} r={1.8} {...s} />
          <Path d="M3 14 L1 22 M5 14 L4 22 M9 14 L8 22" {...s} strokeWidth={s.strokeWidth * 0.6} />
        </G>
      );
    case 'sonne':
      return (
        <G>
          <Circle cx={12} cy={12} r={4} {...s} />
          <Path
            d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12 M5 5 L7 7 M17 17 L19 19 M5 19 L7 17 M17 7 L19 5"
            {...s}
          />
        </G>
      );
    case 'mond':
      return <Path d="M16 3 C10 4 7 9 8 14 C9 19 14 22 20 20 C14 19 11 15 12 10 C12.5 7 14 4.5 16 3 Z" {...s} />;
    case 'herz':
      return <Path d="M12 20 C5 15 3 11 4 8 C5 5 9 4 12 8 C15 4 19 5 20 8 C21 11 19 15 12 20 Z" {...s} />;
    case 'uhr':
      return (
        <G>
          <Circle cx={12} cy={12} r={9} {...s} />
          <Path d="M12 7 L12 12 L16 14" {...s} />
        </G>
      );
    case 'rad':
      return (
        <G>
          <Circle cx={12} cy={12} r={9} {...s} />
          <Circle cx={12} cy={12} r={3} {...s} />
          <Path d="M12 3 L12 9 M12 15 L12 21 M3 12 L9 12 M15 12 L21 12" {...s} />
        </G>
      );
    case 'mulde':
      return (
        <G>
          <Path d="M2 18 C6 22 18 22 22 18" {...s} />
          <Path d="M6 17 C6 13 10 12 14 13 L16 9 L18 13 C19 14 19 16 18 17 Z" {...s} />
          <Path d="M3 16 L4 12 M21 16 L20 11 M5 17 L7 13" {...s} strokeWidth={s.strokeWidth * 0.6} />
        </G>
      );
    case 'tippen':
      return (
        <G>
          <Path
            d="M10 21 L7 15 C6 13 8 12 9 14 L10 15 L10 6 C10 4.5 12 4.5 12 6 L12 12 L16 12.5 C18 13 18.5 14 18 16 L17 21"
            {...s}
          />
          <Path d="M7 5 C7 2 15 2 15 5" {...s} strokeWidth={s.strokeWidth * 0.7} />
        </G>
      );
    case 'ziehen':
      return (
        <G>
          <Path
            d="M10 22 L7 16 C6 14 8 13 9 15 L10 16 L10 8 C10 6.5 12 6.5 12 8 L12 13 L16 13.5 C18 14 18.5 15 18 17 L17 22"
            {...s}
          />
          <Path
            d="M3 5 L21 5 M3 5 L5.5 3 M3 5 L5.5 7 M21 5 L18.5 3 M21 5 L18.5 7"
            {...s}
            strokeWidth={s.strokeWidth * 0.8}
          />
        </G>
      );
    case 'stopp':
      return (
        <G>
          <Path
            d="M8 21 L6 13 L6 8 C6 7 8 7 8 8 L8 12 L8 5 C8 4 10 4 10 5 L10 11 L10 4 C10 3 12 3 12 4 L12 11 L12 5 C12 4 14 4 14 5 L14 13 L16 11 C17 10 18.5 11 17.5 12.5 L14 19 L14 21"
            {...s}
          />
          <Path d="M2 2 L22 22" {...s} strokeWidth={s.strokeWidth * 1.3} />
        </G>
      );
    case 'lineal':
      return (
        <G>
          <Path d="M3 20 L20 3 L22 5 L5 22 Z" {...s} />
          <Path d="M8 15 L10 17 M11 12 L12.5 13.5 M14 9 L16 11 M17 6 L18.5 7.5" {...s} />
        </G>
      );
    case 'waage':
      return (
        <G>
          <Path d="M12 3 L12 20 M7 20 L17 20 M4 7 L20 7" {...s} />
          <Path d="M4 7 L1.5 13 L6.5 13 Z M20 7 L17.5 13 L22.5 13 Z" {...s} />
        </G>
      );
    case 'schild':
      return <Path d="M12 2 L20 5 C20 13 17 18 12 22 C7 18 4 13 4 5 Z M12 6 L12 18" {...s} />;
    case 'baum':
      return (
        <G>
          <Path d="M12 22 L12 14" {...s} />
          <Path d="M12 2 L18 10 L15 10 L20 16 L4 16 L9 10 L6 10 Z" {...s} />
        </G>
      );
    case 'wiese':
      return (
        <Path d="M2 21 L22 21 M4 21 L5 15 M7 21 L6 13 M10 21 L11 16 M14 21 L13 12 M17 21 L18 15 M20 21 L19 14" {...s} />
      );
    case 'gebuesch':
      return (
        <Path d="M3 20 C1 15 4 11 8 12 C8 7 14 6 15 10 C19 9 22 13 20 17 C21 19 20 20 19 20 Z M3 20 L21 20" {...s} />
      );
    case 'schnee':
      return (
        <G>
          <Path d="M12 2 L12 22 M3.3 7 L20.7 17 M3.3 17 L20.7 7" {...s} />
          <Path d="M9.5 3.5 L12 6 L14.5 3.5 M9.5 20.5 L12 18 L14.5 20.5" {...s} strokeWidth={s.strokeWidth * 0.7} />
        </G>
      );
    case 'bluete':
      return (
        <G>
          {[0, 72, 144, 216, 288].map((w) => (
            <Ellipse key={w} cx={12} cy={6.5} rx={3} ry={4.5} {...s} transform={`rotate(${w} 12 12)`} />
          ))}
          <Circle cx={12} cy={12} r={2} {...f} />
        </G>
      );
    case 'karte':
      return (
        <G>
          <Path d="M3 6 L9 3 L15 6 L21 3 L21 18 L15 21 L9 18 L3 21 Z M9 3 L9 18 M15 6 L15 21" {...s} />
        </G>
      );
    case 'buch':
      return (
        <G>
          <Path
            d="M12 6 C9 4 5 4 3 5 L3 19 C5 18 9 18 12 20 C15 18 19 18 21 19 L21 5 C19 4 15 4 12 6 Z M12 6 L12 20"
            {...s}
          />
        </G>
      );
    case 'lunte':
      return (
        <G>
          <Path d="M20 4 C14 6 6 12 3 19 C2 21 4 22 6 21 C12 18 18 12 21 7 Z" {...s} />
          <Path d="M3 19 C2 21 4 22 6 21 C5 20 4.5 19.5 4.8 18 Z" {...f} />
        </G>
      );
    case 'pfote':
      return (
        <G>
          <Ellipse cx={12} cy={16} rx={4.5} ry={3.8} {...f} />
          {[
            [8.5, 9],
            [15.5, 9],
            [6, 13.5],
            [18, 13.5],
          ].map(([x, y]) => (
            <Ellipse key={`${x}-${y}`} cx={x} cy={y} rx={1.8} ry={2.4} {...f} />
          ))}
          <Path d="M8.5 6 L8.5 4.5 M15.5 6 L15.5 4.5" {...s} />
        </G>
      );
    case 'maus':
      return (
        <G>
          <Path d="M4 16 C4 11 9 9 13 10 C16 10.5 19 12 20 15 L21 16 C17 17 8 18 4 16 Z" {...s} />
          <Circle cx={10} cy={9.5} r={2} {...s} />
          <Circle cx={17.5} cy={13.5} r={0.8} {...f} />
          <Path d="M4 16 C2 16 1.5 18 3 19.5 C5 21 8 19.5 9 21" {...s} />
        </G>
      );
    case 'wurm':
      return (
        <Path
          d="M3 15 C5 10 8 10 10 14 C12 18 15 18 17 13 C18.5 10 21 10 21.5 12"
          {...s}
          strokeWidth={s.strokeWidth * 1.4}
        />
      );
    case 'kaefer':
      return (
        <G>
          <Ellipse cx={12} cy={14} rx={5} ry={6.5} {...s} />
          <Circle cx={12} cy={6.5} r={2.2} {...s} />
          <Path
            d="M12 8.7 L12 20.5 M7 11 L3 9 M7 14 L3 14 M7 17 L3.5 19 M17 11 L21 9 M17 14 L21 14 M17 17 L20.5 19 M11 4.5 L9 2 M13 4.5 L15 2"
            {...s}
            strokeWidth={s.strokeWidth * 0.8}
          />
        </G>
      );
    case 'beere':
      return (
        <G>
          <Path d="M12 3 C12 6 11 8 9 10 M12 3 C13 6 15 8 16 9 M12 3 L16 2" {...s} />
          <Circle cx={8} cy={14} r={3.4} {...f} />
          <Circle cx={15.5} cy={13} r={3.4} {...f} />
          <Circle cx={12} cy={19} r={3.2} {...f} />
        </G>
      );
    case 'knochen':
      return (
        <Path
          d="M7 8 C5 6 2.5 7.5 4 9.5 C2 10.5 3.5 13 5.5 11.5 L12.5 18.5 C11 20.5 13.5 22 14.5 20 C16.5 21.5 18 19 16 17.5 C18 16.5 16.5 14 14.5 15.5 L7.5 8.5 Z"
          {...s}
        />
      );
    case 'bau':
      return (
        <G>
          <Path d="M2 19 C4 11 9 8 12 8 C16 8 20 11 22 19 Z" {...s} />
          <Path d="M8 19 C8 15 10 13 12 13 C14 13 16 15 16 19 Z" {...f} />
        </G>
      );
    case 'auto':
      return (
        <G>
          <Path
            d="M3 16 L3 12 L6 11 L8 7 L16 7 L18.5 11 L21 12 L21 16 Z M8.5 8.5 L7.2 11 L16.8 11 L15.5 8.5 Z"
            {...s}
          />
          <Circle cx={7} cy={17} r={2} {...f} />
          <Circle cx={17} cy={17} r={2} {...f} />
        </G>
      );
    case 'keim':
      return (
        <G>
          <Circle cx={12} cy={12} r={7} {...s} strokeDasharray="2 2.5" />
          <Circle cx={12} cy={12} r={2.2} {...f} />
        </G>
      );
  }
}

/**
 * Größere Spuren-Zeichnungen für die Karten (Raster 100 × 80): Trittsiegel im Boden,
 * Losung, verbissener Zweig mit ausgefranster Bissstelle, gefegtes Bäumchen.
 */
export function SpurBild({ name, farben }: { name: SpurName; farben: SpurFarben }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 80">
      {name === 'tritt' && (
        <G>
          <Ellipse cx={50} cy={44} rx={40} ry={26} fill={farben.boden} />
          {[
            [32, 50, -8],
            [64, 34, 6],
          ].map(([x, y, w]) => (
            <G key={x} transform={`translate(${x} ${y}) rotate(${w})`}>
              <Path d="M-2 -14 C-8 -10 -9 4 -6 12 C-3 13 -1 10 -1 6 Z" fill={farben.tief} />
              <Path d="M2 -14 C8 -10 9 4 6 12 C3 13 1 10 1 6 Z" fill={farben.tief} />
              <Path d="M-2 -14 C-8 -10 -9 4 -6 12" stroke={farben.kante} strokeWidth={0.8} fill="none" />
              <Path d="M2 -14 C8 -10 9 4 6 12" stroke={farben.kante} strokeWidth={0.8} fill="none" />
            </G>
          ))}
        </G>
      )}
      {name === 'pfote' && (
        <G>
          <Ellipse cx={50} cy={44} rx={40} ry={26} fill={farben.boden} />
          {/* Fuchs-Trittsiegel: schmal-oval, vier Zehen mit Krallen, Ballen; die beiden vorderen Zehen ragen weit vor */}
          <G transform="translate(50 46)">
            <Path d="M-7 6 C-7 0 7 0 7 6 C7 12 -7 12 -7 6 Z" fill={farben.tief} />
            {[
              [-4, -9],
              [4, -9],
              [-8.5, -1],
              [8.5, -1],
            ].map(([x, y]) => (
              <G key={`${x}-${y}`}>
                <Ellipse cx={x} cy={y} rx={2.8} ry={3.8} fill={farben.tief} />
                <Path
                  d={`M${x} ${y - 4} l${x / 10} -3.5`}
                  stroke={farben.tief}
                  strokeWidth={1.3}
                  strokeLinecap="round"
                />
              </G>
            ))}
            <Path
              d="M-7 -14 L7 -14 M0 -14 L0 2"
              stroke={farben.markierung}
              strokeWidth={0.6}
              strokeDasharray="1.5 1.5"
              opacity={0.6}
            />
          </G>
        </G>
      )}
      {name === 'kot' && (
        <G>
          <Ellipse cx={50} cy={60} rx={34} ry={8} fill={farben.boden} />
          {/* wurstförmig, an einem Ende gedreht und spitz, auf einem Stein als Markierung */}
          <Ellipse cx={50} cy={57} rx={18} ry={7} fill={farben.kante} opacity={0.7} />
          <Path
            d="M30 46 C30 40 40 38 52 40 C62 42 70 44 76 40 C74 46 66 49 56 48 C46 47 38 50 30 46 Z"
            fill={farben.tief}
          />
          <Path d="M76 40 C78 38 80 36 83 35" stroke={farben.tief} strokeWidth={1.6} strokeLinecap="round" />
          <Path d="M40 41 l2 4 M50 41 l1.5 4 M60 43 l1 3.5" stroke={farben.glanz} strokeWidth={0.7} opacity={0.35} />
        </G>
      )}
      {name === 'bau' && (
        <G>
          <Path d="M4 70 C14 40 34 28 50 28 C66 28 86 40 96 70 Z" fill={farben.boden} />
          {/* zwei Röhren, davor ausgescharrte Erde */}
          <Path d="M26 70 C26 58 32 52 38 52 C44 52 48 58 48 70 Z" fill={farben.tief} />
          <Path d="M60 70 C60 61 64 57 69 57 C74 57 77 61 77 70 Z" fill={farben.tief} />
          <Path d="M16 72 C26 66 44 66 54 72 Z" fill={farben.holz} opacity={0.8} />
          <Path
            d="M30 30 l-3 -8 M50 27 l0 -9 M70 31 l3 -8"
            stroke={farben.kante}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </G>
      )}
      {name === 'rupfung' && (
        <G>
          <Ellipse cx={50} cy={60} rx={36} ry={9} fill={farben.boden} />
          {/* Federn mit abgebissenen, gequetschten Kielen */}
          {[
            [30, 54, -25],
            [48, 50, 10],
            [64, 56, 40],
            [40, 62, -60],
            [58, 63, 75],
          ].map(([x, y, w]) => (
            <G key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${w})`}>
              <Path d="M0 0 C-4 -6 -4 -16 0 -22 C4 -16 4 -6 0 0 Z" fill={farben.hell} opacity={0.9} />
              <Path d="M0 2 L0 -20" stroke={farben.holz} strokeWidth={0.8} />
              <Path d="M-1.2 2 L0 4.5 L1.2 2" stroke={farben.markierung} strokeWidth={1} fill="none" />
            </G>
          ))}
        </G>
      )}
      {name === 'losung' && (
        <G>
          <Ellipse cx={50} cy={58} rx={34} ry={10} fill={farben.boden} />
          {[
            [38, 52, 20],
            [47, 50, -15],
            [56, 53, 35],
            [44, 57, 70],
            [53, 58, 5],
            [62, 57, -30],
            [50, 46, 60],
            [41, 47, -40],
            [58, 47, 15],
            [35, 58, -10],
          ].map(([x, y, w]) => (
            <G key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${w})`}>
              <Ellipse cx={0} cy={0} rx={4.6} ry={3.2} fill={farben.tief} />
              <Ellipse cx={-1.2} cy={-1.1} rx={1.6} ry={0.8} fill={farben.glanz} opacity={0.6} />
            </G>
          ))}
        </G>
      )}
      {name === 'verbiss' && (
        <G>
          <Path
            d="M50 78 C50 60 49 44 51 26"
            stroke={farben.holz}
            strokeWidth={3.2}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M50 56 C58 50 64 44 70 36"
            stroke={farben.holz}
            strokeWidth={2.2}
            strokeLinecap="round"
            fill="none"
          />
          <Path d="M50 44 C44 40 38 36 32 30" stroke={farben.holz} strokeWidth={2} strokeLinecap="round" fill="none" />
          {/* Knospen an den Seitenzweigen */}
          <Ellipse cx={71} cy={34} rx={2.2} ry={3.6} fill={farben.knospe} transform="rotate(35 71 34)" />
          <Ellipse cx={31} cy={28} rx={2.2} ry={3.6} fill={farben.knospe} transform="rotate(-40 31 28)" />
          {/* ausgefranste Bissstelle oben: Rehe haben oben keine Schneidezähne */}
          <Path
            d="M48 27 L49 20 L50.5 25 L51.5 18 L52.5 24 L54 21 L53.5 27 Z"
            fill={farben.hell}
            stroke={farben.holz}
            strokeWidth={0.6}
          />
          <Ellipse
            cx={51}
            cy={14}
            rx={9}
            ry={9}
            fill="none"
            stroke={farben.markierung}
            strokeWidth={1.2}
            strokeDasharray="3 2"
          />
        </G>
      )}
      {name === 'fegen' && (
        <G>
          <Path d="M44 78 L44 6 L56 6 L56 78 Z" fill={farben.holz} />
          {/* abgeriebene Stelle: helles Holz, Rindenfetzen hängen herab */}
          <Path d="M44 24 L56 24 L56 56 L44 56 Z" fill={farben.hell} />
          <Path
            d="M44 24 C40 30 39 38 41 44 M56 26 C61 32 62 40 60 47 M48 56 C47 62 46 66 44 70"
            stroke={farben.holz}
            strokeWidth={1.6}
            strokeLinecap="round"
            fill="none"
          />
          <Path d="M47 30 L47 50 M50 28 L50 52 M53 31 L53 49" stroke={farben.holz} strokeWidth={0.6} opacity={0.5} />
          <Ellipse cx={50} cy={78} rx={20} ry={3} fill={farben.boden} />
        </G>
      )}
    </Svg>
  );
}

export type SpurName = 'tritt' | 'losung' | 'verbiss' | 'fegen' | 'pfote' | 'kot' | 'bau' | 'rupfung';

export type SpurFarben = {
  boden: string;
  tief: string;
  kante: string;
  glanz: string;
  holz: string;
  hell: string;
  knospe: string;
  markierung: string;
};
