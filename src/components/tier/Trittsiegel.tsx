import { Ellipse, G, Path } from 'react-native-svg';

import type { TrittForm } from '@/data/tierSeiten';

/**
 * Trittsiegel (Fußabdruck) eines Tieres, gezeichnet in einem Raster von −15 … 15 (Höhe 30, Spitze oben).
 * Wird für Spuren-Karte, Fährte und die 1:1-Ansicht gemeinsam benutzt.
 *
 * - huf: zwei schmale Schalenhälften (Reh)
 * - huf_af: breitere Hufe mit zwei Afterklauen dahinter (Wildschwein)
 * - pfote: schmal-oval, 4 Zehen mit Krallen (Fuchs)
 * - katze: rund, 4 Zehen ohne Krallen, dreilappiger Ballen (Wildkatze, Luchs)
 * - pfote5: breiter Ballen, 5 Zehen mit langen Krallen (Dachs, Igel)
 * - hase: langer, behaarter Hinterlauf ohne klare Ballen
 * - nager: schmaler Fuß mit 5 langen, gespreizten Zehen (Eichhörnchen)
 * - biber: großer Hinterfuß mit 5 Zehen und Schwimmhäuten
 */
export function TrittsiegelForm({ form, farbe }: { form: TrittForm; farbe: string }) {
  switch (form) {
    case 'huf':
      return (
        <G>
          <Path d="M-2 -15 C-9 -10 -10 5 -6.5 15 C-3 15.5 -1 12 -1 7 Z" fill={farbe} />
          <Path d="M2 -15 C9 -10 10 5 6.5 15 C3 15.5 1 12 1 7 Z" fill={farbe} />
        </G>
      );
    case 'huf_af':
      return (
        <G>
          <Path d="M-2 -15 C-11 -11 -12 0 -8 7 C-4 8 -1 5 -1 1 Z" fill={farbe} />
          <Path d="M2 -15 C11 -11 12 0 8 7 C4 8 1 5 1 1 Z" fill={farbe} />
          {/* Afterklauen: tief sitzend, seitlich hinter den Hufen */}
          <Ellipse cx={-10} cy={12} rx={2.6} ry={3.4} fill={farbe} />
          <Ellipse cx={10} cy={12} rx={2.6} ry={3.4} fill={farbe} />
        </G>
      );
    case 'pfote':
      return (
        <G>
          <Path d="M-6 9 C-6 3 6 3 6 9 C6 14 -6 14 -6 9 Z" fill={farbe} />
          {[
            [-3.5, -7],
            [3.5, -7],
            [-7.5, 1],
            [7.5, 1],
          ].map(([x, y]) => (
            <G key={`${x}-${y}`}>
              <Ellipse cx={x} cy={y} rx={2.5} ry={3.5} fill={farbe} />
              <Path d={`M${x} ${y - 3.8} l${x / 8} -3.5`} stroke={farbe} strokeWidth={1.2} strokeLinecap="round" />
            </G>
          ))}
        </G>
      );
    case 'katze':
      return (
        <G>
          {/* Ballen mit drei Lappen hinten, Zehen im Bogen, keine Krallen */}
          <Path d="M-8 6 C-8 0 8 0 8 6 C8 9 6 12 4 11 C2 13 -2 13 -4 11 C-6 12 -8 9 -8 6 Z" fill={farbe} />
          {[
            [-9, -3],
            [-3.5, -9],
            [3.5, -9],
            [9, -3],
          ].map(([x, y]) => (
            <Ellipse key={`${x}-${y}`} cx={x} cy={y} rx={3} ry={3.6} fill={farbe} />
          ))}
        </G>
      );
    case 'pfote5':
      return (
        <G>
          <Path d="M-11 6 C-11 -1 11 -1 11 6 C11 11 -11 11 -11 6 Z" fill={farbe} />
          {[-10, -5, 0, 5, 10].map((x) => {
            const y = -4 - (6 - Math.abs(x) * 0.4);
            return (
              <G key={x}>
                <Ellipse cx={x} cy={y} rx={2.2} ry={2.8} fill={farbe} />
                <Path d={`M${x} ${y - 3} l${x * 0.08} -6`} stroke={farbe} strokeWidth={1.3} strokeLinecap="round" />
              </G>
            );
          })}
        </G>
      );
    case 'hase':
      return (
        <G>
          <Path
            d="M0 -15 C6 -15 7 -6 6 4 C5 12 3 15 0 15 C-3 15 -5 12 -6 4 C-7 -6 -6 -15 0 -15 Z"
            fill={farbe}
            opacity={0.85}
          />
          {[-3, 0, 3].map((x) => (
            <Ellipse key={x} cx={x} cy={-11} rx={1.4} ry={2} fill={farbe} />
          ))}
        </G>
      );
    case 'nager':
      return (
        <G>
          <Path d="M-4 4 C-4 -1 4 -1 4 4 C4 12 2 15 0 15 C-2 15 -4 12 -4 4 Z" fill={farbe} />
          {[-9, -5, 0, 5, 9].map((x, i) => (
            <Path
              key={x}
              d={`M${x * 0.3} -1 L${x} ${-10 - (i === 2 ? 4 : i % 4 === 0 ? -3 : 2)}`}
              stroke={farbe}
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          ))}
        </G>
      );
    case 'biber':
      return (
        <G>
          {/* Schwimmhaut zwischen den Zehen, dann Zehen und Sohle */}
          <Path d="M-12 -10 C-6 -16 6 -16 12 -10 L8 2 L-8 2 Z" fill={farbe} opacity={0.45} />
          {[-12, -6, 0, 6, 12].map((x) => (
            <Path key={x} d={`M${x * 0.5} 0 L${x} -12`} stroke={farbe} strokeWidth={2.4} strokeLinecap="round" />
          ))}
          <Path d="M-7 0 C-7 -3 7 -3 7 0 C7 10 4 15 0 15 C-4 15 -7 10 -7 0 Z" fill={farbe} />
        </G>
      );
  }
}
