import rough from 'roughjs';
import type { Drawable } from 'roughjs/bin/core';
import { Path } from 'react-native-svg';

/**
 * Handgezeichnete Linien mit roughjs (wie im Prototyp).
 * roughjs rechnet nur Pfade aus – gezeichnet wird mit react-native-svg.
 * Mit festem "seed" sieht die Zeichnung bei jedem Öffnen gleich aus.
 */
export const skizze = rough.generator();

export function SkizzePfad({ drawable, deckkraft = 1 }: { drawable: Drawable; deckkraft?: number }) {
  return (
    <>
      {skizze.toPaths(drawable).map((p, i) => (
        <Path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill={p.fill ?? 'none'}
          strokeLinecap="round"
          opacity={deckkraft}
        />
      ))}
    </>
  );
}
