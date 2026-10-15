import { useId } from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { colors } from '@/theme/theme';

import { Bodenschatten, FellVerlauf, figurFarben, Schlafkugel, type FigurProps } from './teile';

/**
 * Zwei Wildkatzen-Arten, gezeichnet aus derselben Grundform:
 *
 * Wildkatze: kräftige, graugelbe Katze mit verwaschenen Streifen, dunklem Rückenstrich (endet an der
 * Schwanzwurzel), buschigem Schwanz mit dunklen Ringen und stumpfem, schwarzem Ende, rosa Nase.
 *
 * Luchs: hochbeinig, Pinselohren, Backenbart, gefleckt, kurzer Stummelschwanz mit schwarzer Spitze,
 * große Pfoten.
 *
 * aktiv = schleicht geduckt (Jagd), liegt = eingerollt.
 */
export const WILDKATZE_MASS = { ausschnitt: { y0: 66, hoehe: 90 }, laenge: 104 };
export const LUCHS_MASS = { ausschnitt: { y0: 30, hoehe: 126 }, schulterY: 84 };

type Art = 'wildkatze' | 'luchs';

/** Formen je Art (Luchs: höhere Beine, größerer Kopf) */
const FORM: Record<
  Art,
  {
    koerper: string;
    kopf: string;
    ohr: string;
    ohrHinten: string;
    vorder: string;
    hinter: string;
    auge: [number, number];
    nase: [number, number];
  }
> = {
  wildkatze: {
    koerper:
      'M66 106 C80 100 112 100 132 102 C140 104 144 110 142 118 C140 124 132 126 124 126 C106 128 86 128 74 124 C66 122 62 116 66 106 Z',
    kopf: 'M128 104 C131 93 142 86 153 87 C162 88 168 95 168 103 C168 109 162 113 153 113 C145 113 136 111 132 108 Z',
    ohr: 'M139 93 L141 78 L150 90 Z',
    ohrHinten: 'M147 89 L153 76 L158 90 Z',
    vorder: 'M126 120 L127 147 L133 147 L134 120 Z',
    hinter: 'M70 116 C80 116 86 124 84 132 L80 136 L82 147 L76 147 L73 136 C69 130 66 122 70 116 Z',
    auge: [158, 99],
    nase: [167.5, 103],
  },
  luchs: {
    koerper:
      'M60 92 C76 84 116 84 136 88 C146 92 148 102 144 110 C140 116 130 118 120 118 C100 120 80 120 68 116 C60 112 56 102 60 92 Z',
    kopf: 'M132 88 C136 75 148 68 161 70 C172 72 178 80 178 89 C178 97 171 103 161 104 C152 104 142 100 136 96 Z',
    ohr: 'M146 76 L148 54 L158 72 Z',
    ohrHinten: 'M156 71 L162 52 L168 74 Z',
    vorder: 'M128 112 L129 146 L138 146 L139 112 Z',
    hinter: 'M64 104 C78 104 86 116 82 128 L78 134 L80 146 L72 146 L70 134 C64 126 60 114 64 104 Z',
    auge: [166, 83],
    nase: [177.5, 90],
  },
};

/** Flecken des Luchses */
const LUCHS_FLECKEN: [number, number][] = [
  [72, 98],
  [82, 94],
  [94, 92],
  [106, 92],
  [118, 94],
  [128, 98],
  [78, 106],
  [90, 104],
  [102, 104],
  [114, 106],
  [126, 108],
  [86, 112],
  [100, 114],
  [114, 114],
  [130, 124],
  [133, 132],
  [74, 120],
  [77, 128],
];

export function KatzeFigur({ art, ...p }: FigurProps & { art: Art }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const k = figurFarben(p);
  const f = FORM[art];
  const verlauf = p.umriss ?? `url(#ka${id})`;
  const luchs = art === 'luchs';
  const box = luchs ? LUCHS_MASS.ausschnitt : WILDKATZE_MASS.ausschnitt;
  const viewBox = `0 ${box.y0} 200 ${box.hoehe}`;
  const def = (
    <FellVerlauf
      id={`ka${id}`}
      grund={k.grund}
      dunkel={p.farben.dunkel}
      hell={p.farben.hell}
      von={luchs ? 70 : 90}
      bis={150}
    />
  );

  if (p.pose === 'liegt') {
    return (
      <Svg width="100%" height="100%" viewBox={viewBox}>
        {def}
        <Bodenschatten x={100} breite={50} an={k.zeichnen} />
        <Schlafkugel
          farben={k}
          verlauf={verlauf}
          ohr={luchs ? 'pinsel' : 'spitz'}
          schwanz={luchs ? 'kurz' : 'ringel'}
          breite={luchs ? 44 : 34}
          hoehe={luchs ? 20 : 15}
        />
      </Svg>
    );
  }

  // Schleichen: Körper tiefer, Kopf vorgestreckt
  const schleicht = p.pose === 'aktiv';
  const koerperLage = schleicht ? 'translate(0 10)' : undefined;
  const kopfLage = schleicht ? 'translate(6 18)' : undefined;

  return (
    <Svg width="100%" height="100%" viewBox={viewBox}>
      {def}
      <Bodenschatten x={104} breite={luchs ? 54 : 48} an={k.zeichnen} />
      {/* ferne Beine */}
      <Path d={f.vorder} fill={k.ferne} transform="translate(-8 1)" />
      <Path d={f.hinter} fill={k.ferne} transform="translate(9 1)" />
      <G transform={koerperLage}>
        {/* Schwanz */}
        {luchs ? (
          <G>
            <Path d="M61 94 C54 96 49 100 47 106 C50 108 55 106 60 102 Z" fill={verlauf} />
            <Path d="M47 106 C47 103 49 100 52 98.5 C52 102 50 105 47 106 Z" fill={k.dunkel} />
          </G>
        ) : (
          <G>
            <Path d="M67 110 C53 113 43 123 39 137 C38 143 42 147 48 145 C51 135 59 123 71 118 Z" fill={verlauf} />
            {/* dunkle Ringe und stumpfes schwarzes Ende */}
            {['M58 116 C55 119 54 121 54 123', 'M51 122 C48 126 47 128 47 131'].map((d) => (
              <Path key={d} d={d} stroke={k.dunkel} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
            ))}
            <Path d="M39 137 C38 143 42 147 48 145 C48 141 46 138 44 136 C42 136 40 136 39 137 Z" fill={k.dunkel} />
          </G>
        )}
        <Path d={f.koerper} fill={verlauf} stroke={k.dunkel} strokeWidth={0.8} strokeOpacity={0.45} />
        {k.zeichnen &&
          (luchs ? (
            LUCHS_FLECKEN.map(([x, y]) => (
              <Ellipse key={`${x}-${y}`} cx={x} cy={y} rx={2.2} ry={1.6} fill={p.farben.dunkel} opacity={0.55} />
            ))
          ) : (
            <G>
              {/* Rückenstrich endet an der Schwanzwurzel; verwaschene Querstreifen */}
              <Path
                d="M70 104 C90 100 114 100 132 103"
                stroke={p.farben.dunkel}
                strokeWidth={2.4}
                opacity={0.6}
                fill="none"
              />
              {[82, 94, 106, 118].map((x) => (
                <Path
                  key={x}
                  d={`M${x} 104 C${x - 2} 110 ${x - 3} 116 ${x - 4} 122`}
                  stroke={p.farben.dunkel}
                  strokeWidth={1.6}
                  opacity={0.3}
                  fill="none"
                />
              ))}
            </G>
          ))}
      </G>
      {/* nahe Beine, große Pfoten */}
      <Path d={f.vorder} fill={verlauf} />
      <Path d={f.hinter} fill={verlauf} />
      <Ellipse cx={luchs ? 134 : 130} cy={146.5} rx={luchs ? 7 : 5} ry={2.4} fill={k.ferne} />
      <Ellipse cx={luchs ? 76 : 79} cy={146.5} rx={luchs ? 7 : 5} ry={2.4} fill={k.ferne} />
      {k.zeichnen &&
        !luchs &&
        [120, 132].map((y) => (
          <Path key={y} d={`M127 ${y} l7 0`} stroke={p.farben.dunkel} strokeWidth={1.2} opacity={0.35} />
        ))}
      <G transform={kopfLage}>
        <Path d={f.ohrHinten} fill={k.ferne} />
        {luchs && (
          // Backenbart: helle Haarkrause mit dunklen Streifen unter dem Kopf
          <Path
            d="M140 96 C146 104 154 110 164 108 C160 112 152 114 146 112 C150 116 146 118 140 114 C138 108 138 102 140 96 Z"
            fill={k.hell}
            stroke={k.dunkel}
            strokeWidth={0.6}
          />
        )}
        <Path d={f.kopf} fill={verlauf} stroke={k.dunkel} strokeWidth={0.8} strokeOpacity={0.45} />
        <Path d={f.ohr} fill={verlauf} stroke={k.dunkel} strokeWidth={0.7} strokeOpacity={0.6} />
        {luchs && (
          <G>
            {/* Pinselohren */}
            <Path d="M148 54 l-0.5 -10 M162 52 l0.5 -10" stroke={k.dunkel} strokeWidth={1.8} strokeLinecap="round" />
            {k.zeichnen && (
              <Path d="M146 108 l4 4 M152 110 l3 4" stroke={p.farben.dunkel} strokeWidth={1} opacity={0.7} />
            )}
          </G>
        )}
        {k.zeichnen && (
          <G>
            {/* Augen mit senkrechter Pupille, helle Schnauzenpartie, Nase, Schnurrhaare */}
            <Ellipse cx={f.auge[0]} cy={f.auge[1]} rx={3.2} ry={2.4} fill={p.farben.auge} />
            <Ellipse cx={f.auge[0] + 0.4} cy={f.auge[1]} rx={0.7} ry={2.1} fill={p.farben.dunkel} />
            <Circle cx={f.auge[0] + 1.2} cy={f.auge[1] - 0.8} r={0.5} fill={colors.moon} />
            <Path
              d={`M${f.auge[0] - 4} ${f.auge[1] - 3.5} C${f.auge[0] - 1} ${f.auge[1] - 5} ${f.auge[0] + 2} ${f.auge[1] - 5} ${f.auge[0] + 4} ${f.auge[1] - 3}`}
              stroke={p.farben.dunkel}
              strokeWidth={0.8}
              fill="none"
            />
            <Ellipse cx={f.nase[0] - 6} cy={f.nase[1] + 4} rx={6} ry={3.6} fill={k.hell} opacity={0.75} />
            <Path
              d={`M${f.nase[0] - 2} ${f.nase[1] - 1} L${f.nase[0] + 1} ${f.nase[1] - 1} L${f.nase[0]} ${f.nase[1] + 1.4} Z`}
              fill={k.akzent}
            />
            <Path
              d={`M${f.nase[0] - 3} ${f.nase[1] + 3} l12 -2 M${f.nase[0] - 3} ${f.nase[1] + 4} l12 2 M${f.nase[0] - 4} ${f.nase[1] + 2} l10 -5`}
              stroke={colors.moon}
              strokeWidth={0.35}
              opacity={0.7}
            />
            {!luchs && (
              <Path
                d={`M${f.auge[0] - 8} ${f.auge[1] - 8} l-4 -2 M${f.auge[0] - 6} ${f.auge[1] - 10} l-3 -3`}
                stroke={p.farben.dunkel}
                strokeWidth={1.2}
                opacity={0.5}
              />
            )}
          </G>
        )}
      </G>
    </Svg>
  );
}
