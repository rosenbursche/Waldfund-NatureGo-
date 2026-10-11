import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { colors } from '@/theme/theme';

/** Symbole für Arten und Kategorien – Strichzeichnungen aus dem Prototyp übernommen. */
export type ArtIconName = 'leaf' | 'shroom' | 'bird' | 'paw' | 'tree' | 'flower' | 'mammal';

function Inhalt({ name }: { name: ArtIconName }) {
  switch (name) {
    case 'leaf':
      return (
        <>
          <Path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z" />
          <Path d="M5 19l9-9M10 14h4M12 12V8" />
        </>
      );
    case 'shroom':
      return (
        <>
          <Path d="M3 12C3 6.5 7 3 12 3s9 3.5 9 9z" />
          <Path d="M9.2 12l-.6 7.5c1.5 1.4 5.3 1.4 6.8 0L14.8 12" />
          <Circle cx={8} cy={8} r={1.1} />
          <Circle cx={13.5} cy={6} r={1} />
          <Circle cx={16.5} cy={9.3} r={1} />
        </>
      );
    case 'bird':
      return (
        <>
          <Path d="M3 14c3 0 4-5 8-6 2-3 6-3 7 0l3 1-3 1c0 5-4 9-10 8l-4 3 2-4c-2-1-3-2-3-3z" />
          <Path d="M10 12c2 2 4 1 5 0" />
          <Circle cx={16} cy={7.6} r={0.7} />
        </>
      );
    case 'paw':
      return (
        <>
          <Ellipse cx={12} cy={16} rx={4.6} ry={3.8} />
          <Ellipse cx={5.6} cy={10.4} rx={1.8} ry={2.3} />
          <Ellipse cx={9.4} cy={6.4} rx={1.8} ry={2.4} />
          <Ellipse cx={14.6} cy={6.4} rx={1.8} ry={2.4} />
          <Ellipse cx={18.4} cy={10.4} rx={1.8} ry={2.3} />
        </>
      );
    case 'tree':
      return (
        <>
          <Path d="M12 21v-8M12 16l-3-3M12 15l3-3" />
          <Path d="M6 13c-3 0-3-5 0-5 0-4 5-5 6-3 2-3 7-1 6 3 3 0 3 5 0 5z" />
        </>
      );
    case 'flower':
      return (
        <>
          <Path d="M12 21V11M12 17c-3 0-5-2-5-4 2 0 4 1 5 4M12 15c3 0 4-2 4-4-2 0-4 1-4 4" />
          <Circle cx={12} cy={4.6} r={2} />
          <Circle cx={14.6} cy={7} r={2} />
          <Circle cx={12} cy={9.2} r={1.6} />
          <Circle cx={9.4} cy={7} r={2} />
        </>
      );
    case 'mammal':
      return (
        <>
          <Path d="M7 9L5 3l5 4h4l5-4-2 6c1 4-2 9-5 10-3-1-6-6-5-10z" />
          <Circle cx={10} cy={11} r={0.7} />
          <Circle cx={14} cy={11} r={0.7} />
          <Path d="M11 15h2l-1 1z" />
        </>
      );
  }
}

export function ArtIcon({
  name,
  groesse = 24,
  farbe = colors.moon,
  strich = 1.6,
}: {
  name: ArtIconName;
  groesse?: number;
  farbe?: string;
  strich?: number;
}) {
  return (
    <Svg
      width={groesse}
      height={groesse}
      viewBox="0 0 24 24"
      fill="none"
      stroke={farbe}
      strokeWidth={strich}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Inhalt name={name} />
    </Svg>
  );
}
