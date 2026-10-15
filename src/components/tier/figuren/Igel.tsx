import { useId } from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { colors } from '@/theme/theme';

import { Bodenschatten, FellVerlauf, figurFarben, type FigurProps } from './teile';

/**
 * Igel: Stachelkleid als Kuppel, spitze Schnauze mit dunkler Nase, kleine Beine.
 * aktiv = schnüffelt mit gesenkter Nase, liegt = zur Stachelkugel eingerollt (Schutz und Winterschlaf).
 */
export const IGEL_MASS = { ausschnitt: { y0: 88, hoehe: 68 }, laenge: 110 };

const KUPPEL =
  'M60 140 C58 116 80 100 106 100 C128 100 146 112 150 132 C150 138 146 142 140 142 L66 142 C62 142 60 141 60 140 Z';
const GESICHT = 'M142 124 C152 124 162 130 170 137 C168 142 160 142 152 142 L142 141 Z';

/** Stacheln entlang einer Bogenlinie, nach außen und hinten gerichtet */
function stacheln(cx: number, cy: number, rx: number, ry: number, von: number, bis: number, anzahl: number) {
  const liste: string[] = [];
  for (let i = 0; i < anzahl; i++) {
    const w = von + ((bis - von) * i) / (anzahl - 1);
    for (const r of [0.8, 1]) {
      const x = cx + Math.cos(w) * rx * r;
      const y = cy - Math.sin(w) * ry * r;
      const l = 7 + ((i * 7) % 4);
      // nach außen und leicht nach hinten (links) geneigt
      const nx = Math.cos(w + 0.5) * l;
      const ny = -Math.sin(w + 0.5) * l;
      liste.push(`M${x} ${y} l${nx} ${ny}`);
    }
  }
  return liste;
}
const STACHELN = stacheln(104, 142, 44, 40, 0.25, Math.PI - 0.1, 26);
const KUGEL_STACHELN = stacheln(104, 128, 22, 20, 0, Math.PI * 2, 30);

export function IgelFigur(p: FigurProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const k = figurFarben(p);
  const verlauf = p.umriss ?? `url(#ig${id})`;
  const def = (
    <FellVerlauf id={`ig${id}`} grund={k.grund} dunkel={p.farben.dunkel} hell={p.farben.hell} von={96} bis={142} />
  );

  if (p.pose === 'liegt') {
    return (
      <Svg width="100%" height="100%" viewBox="0 88 200 68">
        {def}
        <Bodenschatten x={104} breite={28} an={k.zeichnen} />
        <Circle cx={104} cy={128} r={22} fill={verlauf} />
        {KUGEL_STACHELN.map((d, i) => (
          <Path
            key={i}
            d={d}
            stroke={i % 2 ? k.dunkel : k.hell}
            strokeWidth={1.3}
            strokeLinecap="round"
            opacity={0.85}
          />
        ))}
      </Svg>
    );
  }

  const nase = p.pose === 'aktiv' ? 'rotate(14 144 132)' : undefined;
  return (
    <Svg width="100%" height="100%" viewBox="0 88 200 68">
      {def}
      <Bodenschatten x={110} breite={52} an={k.zeichnen} />
      {/* Beinchen */}
      {[72, 88, 124, 136].map((x) => (
        <Path key={x} d={`M${x} 138 l-1 10 l5 0 l0 -10 Z`} fill={k.ferne} />
      ))}
      <G transform={nase}>
        <Path d={GESICHT} fill={k.akzent} />
        {k.zeichnen && (
          <G>
            <Circle cx={154} cy={130} r={1.8} fill={p.farben.dunkel} />
            <Circle cx={154.5} cy={129.5} r={0.5} fill={colors.moon} />
            <Ellipse cx={170} cy={137.5} rx={2.2} ry={1.8} fill={p.farben.dunkel} />
            <Ellipse cx={146} cy={124} rx={3} ry={2.4} fill={k.akzent} stroke={p.farben.dunkel} strokeWidth={0.4} />
          </G>
        )}
      </G>
      <Path d={KUPPEL} fill={verlauf} />
      {/* Stacheln: helle Spitzen und dunkle Bänder abwechselnd */}
      {STACHELN.map((d, i) => (
        <Path
          key={i}
          d={d}
          stroke={i % 3 === 0 ? k.hell : k.dunkel}
          strokeWidth={1.2}
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
    </Svg>
  );
}
