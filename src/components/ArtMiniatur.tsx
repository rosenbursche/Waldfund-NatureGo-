import type { ReactNode } from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { ModellParameter } from '@/data/artTypen';
import type { BaumModell } from '@/data/typen';
import { colors, fonts } from '@/theme/theme';

import { BaumSilhouette } from './BaumSilhouette';

/**
 * Individuelle Miniatur einer Art – aus denselben Merkmalen gezeichnet wie das 3D-Modell
 * (Blütenform und -farbe, Hutform, Gefieder, Ohren, Schwanz …). So sieht jede Art anders aus.
 *
 * Stil:
 * - 'farbe': gefunden, in echten Farben
 * - 'umriss': noch nicht gefunden – nur der Umriss in der Seltenheitsfarbe
 * - 'verborgen': Mystery-Art, noch nicht gefunden – nur ein "?"
 */
export type MiniaturStil = 'farbe' | 'umriss' | 'verborgen';

type Props = {
  modell?: ModellParameter;
  baumModell?: BaumModell;
  stil: MiniaturStil;
  /** Farbe für Umriss und "?" (Seltenheitsfarbe) */
  akzent: string;
  groesse?: number;
};

export function ArtMiniatur({ modell, baumModell, stil, akzent, groesse = 40 }: Props) {
  if (stil === 'verborgen') {
    return (
      <Svg width={groesse} height={groesse} viewBox="0 0 48 48">
        <SvgText x={24} y={34} textAnchor="middle" fontSize={30} fontFamily={fonts.handBold} fill={akzent}>
          ?
        </SvgText>
      </Svg>
    );
  }
  if (baumModell) {
    return (
      <BaumSilhouette modell={baumModell} breite={groesse * 0.72} umriss={stil === 'umriss' ? akzent : undefined} />
    );
  }
  if (!modell) return null;

  // Malfarbe: im Umriss-Stil alles dunkel gefüllt mit farbigem Rand
  const um = stil === 'umriss';
  const f = (c: unknown) => ({
    fill: um ? colors.night : String(c ?? '#888888'),
    stroke: um ? akzent : '#0B1414',
    strokeWidth: um ? 1.3 : 0.5,
  });
  const linie = (c: unknown) => ({
    stroke: um ? akzent : String(c ?? '#333333'),
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
  });

  let inhalt: ReactNode = null;
  switch (modell.t) {
    case 'shrub':
      inhalt = <Busch m={modell} f={f} um={um} />;
      break;
    case 'flower':
      inhalt = <Blume m={modell} f={f} linie={linie} />;
      break;
    case 'shroom':
      inhalt = <Pilz m={modell} f={f} um={um} />;
      break;
    case 'bird':
      inhalt = <Vogel m={modell} f={f} linie={linie} />;
      break;
    case 'mammal':
      inhalt = <Saeuger m={modell} f={f} linie={linie} />;
      break;
  }
  return (
    <Svg width={groesse} height={groesse} viewBox="0 0 48 48">
      {inhalt}
    </Svg>
  );
}

type Mal = (c: unknown) => { fill: string; stroke: string; strokeWidth: number };
type Strich = (c: unknown) => { stroke: string; strokeWidth: number; strokeLinecap: 'round' };
const zahl = (m: ModellParameter, k: string, std = 0) => (typeof m[k] === 'number' ? (m[k] as number) : std);

function Busch({ m, f, um }: { m: ModellParameter; f: Mal; um: boolean }) {
  return (
    <G>
      <Path d="M22 44 L21 32 M26 44 L27 31 M24 44 L24 30" stroke={um ? f(0).stroke : '#5B4A3A'} strokeWidth={1.6} />
      <Circle cx={24} cy={22} r={11} {...f(m.c1)} />
      <Circle cx={14} cy={27} r={8} {...f(m.c1)} />
      <Circle cx={34} cy={27} r={8} {...f(m.c1)} />
      {!um && m.fruechte
        ? [
            [16, 24],
            [30, 20],
            [24, 28],
            [35, 29],
            [12, 29],
            [21, 17],
          ].map(([x, y]) => <Circle key={`${x}${y}`} cx={x} cy={y} r={1.8} fill={String(m.c2)} />)
        : null}
      {!um && m.bluetenDolden
        ? [
            [18, 16],
            [30, 18],
            [24, 12],
          ].map(([x, y]) => <Ellipse key={`${x}${y}`} cx={x} cy={y} rx={4} ry={1.8} fill={String(m.c2)} />)
        : null}
    </G>
  );
}

function Blume({ m, f, linie }: { m: ModellParameter; f: Mal; linie: Strich }) {
  const n = zahl(m, 'n', 6);
  const form = m.shape as string;
  if (form === 'drosera') {
    return (
      <G>
        {Array.from({ length: 7 }, (_, i) => {
          const a = (i / 7) * Math.PI * 2;
          const x = 24 + Math.cos(a) * 12;
          const y = 32 + Math.sin(a) * 6;
          return (
            <G key={i}>
              <Line x1={24} y1={32} x2={x} y2={y} {...linie(m.leaf)} />
              <Circle cx={x} cy={y} r={3.2} {...f(m.c1)} />
            </G>
          );
        })}
        <Line x1={24} y1={32} x2={24} y2={10} {...linie(m.leaf)} />
        <Circle cx={24} cy={9} r={2} {...f(m.c2)} />
      </G>
    );
  }
  if (form === 'clover') {
    return (
      <G>
        <Line x1={24} y1={44} x2={24} y2={26} {...linie(m.leaf)} />
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
          return <Ellipse key={i} cx={24 + Math.cos(a) * 6} cy={24 + Math.sin(a) * 6} rx={6} ry={5} {...f(m.leaf)} />;
        })}
        <Circle cx={36} cy={14} r={4} {...f(m.c1)} />
      </G>
    );
  }
  if (form === 'slipper') {
    return (
      <G>
        <Line x1={24} y1={44} x2={24} y2={24} {...linie(m.leaf)} />
        {[-1, 1].map((s) => (
          <Path key={s} d={`M24 20 Q${24 + s * 14} ${10} ${24 + s * 16} ${26}`} fill="none" {...linie(m.c2)} />
        ))}
        <Ellipse cx={24} cy={26} rx={7} ry={8} {...f(m.c1)} />
      </G>
    );
  }
  if (form === 'bell') {
    const glocken = Math.max(1, Math.min(n, 5));
    return (
      <G>
        <Path d="M14 44 Q14 14 30 10" fill="none" {...linie(m.leaf)} />
        {Array.from({ length: glocken }, (_, i) => {
          const t = glocken === 1 ? 0.9 : 0.35 + (i / (glocken - 1)) * 0.6;
          const x = 14 + (30 - 14) * t * t + 2;
          const y = 44 - (44 - 10) * t + 4;
          return (
            <G key={i}>
              <Path d={`M${x - 4} ${y + 8} Q${x} ${y - 2} ${x + 4} ${y + 8} Z`} {...f(m.c1)} />
              <Circle cx={x} cy={y + 9} r={1.2} fill={f(m.c2).fill} />
            </G>
          );
        })}
      </G>
    );
  }
  if (form === 'lily') {
    return (
      <G>
        <Line x1={24} y1={44} x2={24} y2={20} {...linie(m.leaf)} />
        {Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2;
          return (
            <Path
              key={i}
              d={`M24 20 Q${24 + Math.cos(a) * 12} ${14} ${24 + Math.cos(a) * 9} ${8 + Math.abs(Math.sin(a)) * 4}`}
              fill="none"
              {...linie(m.c1)}
              strokeWidth={3}
            />
          );
        })}
        <Circle cx={24} cy={20} r={2.5} {...f(m.c2)} />
      </G>
    );
  }
  // Stern- und Margeritenblüten
  const blaetter = form === 'daisy' ? Math.min(n, 12) : n;
  const r = form === 'daisy' ? 10 : 9;
  return (
    <G>
      <Line x1={24} y1={44} x2={24} y2={24} {...linie(m.leaf)} />
      <Ellipse cx={18} cy={36} rx={5} ry={2} {...f(m.leaf)} />
      {Array.from({ length: blaetter }, (_, i) => {
        const a = (i / blaetter) * 360;
        return (
          <Ellipse
            key={i}
            cx={24}
            cy={18 - r / 2}
            rx={form === 'daisy' ? 2 : 3.2}
            ry={r / 2}
            {...f(m.c1)}
            transform={`rotate(${a} 24 18)`}
          />
        );
      })}
      <Circle cx={24} cy={18} r={form === 'daisy' ? 4.5 : 3} {...f(m.c2)} />
    </G>
  );
}

function Pilz({ m, f, um }: { m: ModellParameter; f: Mal; um: boolean }) {
  const form = m.shape as string;
  const einzeln = (dx: number, s: number, key: number) => {
    let hut: ReactNode;
    if (form === 'coral') {
      hut = (
        <G>
          {[
            [0, -8],
            [-6, -4],
            [6, -4],
            [-3, -12],
            [4, -12],
            [0, 0],
          ].map(([x, y], i) => (
            <Circle key={i} cx={24 + x} cy={28 + y} r={5} {...f(m.c1)} />
          ))}
        </G>
      );
    } else if (form === 'icicle') {
      hut = (
        <G>
          <Ellipse cx={24} cy={18} rx={12} ry={7} {...f(m.c1)} />
          {[-8, -4, 0, 4, 8].map((x) => (
            <Path key={x} d={`M${24 + x - 1.5} 22 L${24 + x} 34 L${24 + x + 1.5} 22 Z`} {...f(m.c2)} />
          ))}
        </G>
      );
    } else if (form === 'funnel') {
      hut = <Path d="M11 18 Q24 14 37 18 L27 30 L21 30 Z" {...f(m.c1)} />;
    } else if (form === 'tall') {
      hut = <Path d="M17 34 Q15 12 24 8 Q33 12 31 34 Z" {...f(m.c1)} />;
    } else {
      const flach = form === 'flat';
      hut = <Path d={flach ? 'M8 26 Q24 14 40 26 Z' : 'M8 26 Q8 8 24 8 Q40 8 40 26 Z'} {...f(m.c1)} />;
    }
    const dick = !!m.thick;
    return (
      <G key={key} transform={`translate(${dx} ${(1 - s) * 40}) scale(${s})`}>
        {form !== 'coral' && form !== 'icicle' && (
          <Path d={dick ? 'M18 26 Q16 40 19 44 L29 44 Q32 40 30 26 Z' : 'M21 26 L20 44 L28 44 L27 26 Z'} {...f(m.c2)} />
        )}
        {m.volva ? <Ellipse cx={24} cy={43} rx={7} ry={3} {...f('#EFE5CF')} /> : null}
        {m.ring ? <Rect x={19} y={31} width={10} height={2.5} rx={1} {...f('#F3EDE0')} /> : null}
        {hut}
        {m.spots && !um
          ? [
              [16, 18],
              [24, 12],
              [31, 17],
              [20, 22],
              [28, 22],
            ].map(([x, y]) => <Circle key={`${x}${y}`} cx={x} cy={y} r={1.6} fill="#FFFFFF" />)
          : null}
      </G>
    );
  };
  const n = zahl(m, 'cluster', 1);
  if (n > 1) return <G>{[einzeln(-6, 0.75, 0), einzeln(7, 0.6, 1), einzeln(0, 0.95, 2)]}</G>;
  return einzeln(0, 1, 0);
}

function Vogel({ m, f, linie }: { m: ModellParameter; f: Mal; linie: Strich }) {
  const langBeine = !!m.longLegs;
  const eule = !!m.owl;
  const y0 = langBeine ? -6 : 0;
  return (
    <G transform={`translate(0 ${y0})`}>
      {/* Beine */}
      <Line
        x1={21}
        y1={34}
        x2={20}
        y2={langBeine ? 50 : 40}
        {...linie(langBeine ? m.beak : '#5A4A3A')}
        strokeWidth={1.2}
      />
      <Line
        x1={26}
        y1={34}
        x2={27}
        y2={langBeine ? 50 : 40}
        {...linie(langBeine ? m.beak : '#5A4A3A')}
        strokeWidth={1.2}
      />
      {/* Schwanz */}
      <Path d="M10 26 L2 30 L4 33 L12 30 Z" {...f(m.stripes ? '#1B1B1B' : m.c1)} />
      {/* Körper und Bauch */}
      <Ellipse cx={22} cy={27} rx={12} ry={9} {...f(m.c1)} />
      <Ellipse cx={25} cy={30} rx={8} ry={5.5} {...f(m.c2)} />
      {m.under ? <Circle cx={13} cy={31} r={2.5} {...f(m.under)} /> : null}
      {/* Flügel */}
      <Ellipse cx={18} cy={25} rx={7} ry={4} {...f(m.wing ?? (m.stripes ? '#1B1B1B' : m.c1))} />
      {m.stripes ? <Path d="M14 24 h3 M18 24 h3" stroke="#FFFFFF" strokeWidth={1.2} /> : null}
      {/* Kopf */}
      <Circle cx={33} cy={17} r={eule ? 8 : 6.5} {...f(m.head)} />
      {m.cheek ? <Circle cx={34} cy={19} r={2.6} fill="#FFFFFF" /> : null}
      {m.crown ? <Ellipse cx={33} cy={11} rx={4} ry={2} {...f(m.crown)} /> : null}
      {eule ? (
        <>
          <Path d="M28 11 L27 5 L31 9 Z M38 11 L39 5 L35 9 Z" {...f(m.c1)} />
          <Circle cx={30} cy={16} r={2.2} fill="#FF9A1A" />
          <Circle cx={36} cy={16} r={2.2} fill="#FF9A1A" />
        </>
      ) : (
        <Circle cx={35} cy={16} r={1.2} fill="#0A0A0A" />
      )}
      {m.crest ? <Path d="M30 11 L26 3 M32 10 L30 2 M34 10 L34 2" {...linie('#B06A3A')} /> : null}
      {/* Schnabel */}
      <Path d={m.longBeak ? 'M38 16 L48 18 L38 19 Z' : 'M38 16 L43 17.5 L38 19 Z'} {...f(m.beak)} />
    </G>
  );
}

function Saeuger({ m, f, linie }: { m: ModellParameter; f: Mal; linie: Strich }) {
  const beine = 6 + zahl(m, 'legs', 1) * 6;
  const yKoerper = 40 - beine - 6;
  const ohren = m.ears as string;
  const schwanz = m.tail as string;
  const kopfFarbe = m.stripes ? '#F0F0EA' : m.c1;
  return (
    <G>
      {/* Beine */}
      {[13, 18, 29, 34].map((x) => (
        <Line key={x} x1={x} y1={yKoerper + 4} x2={x} y2={yKoerper + 4 + beine} {...linie(m.c1)} strokeWidth={2.4} />
      ))}
      {/* Schwanz */}
      {schwanz === 'bushy' && <Ellipse cx={5} cy={yKoerper + 4} rx={6} ry={3} {...f(m.c1)} />}
      {schwanz === 'bushyUp' && <Ellipse cx={6} cy={yKoerper - 6} rx={3.5} ry={8} {...f(m.c1)} />}
      {schwanz === 'flat' && <Ellipse cx={5} cy={yKoerper + 6} rx={5} ry={2.5} {...f('#3A2A1A')} />}
      {schwanz === 'puff' && <Circle cx={9} cy={yKoerper} r={2.5} {...f('#F4F0E6')} />}
      {(schwanz === 'thin' || schwanz === 'short') && (
        <Line x1={11} y1={yKoerper} x2={schwanz === 'short' ? 8 : 5} y2={yKoerper + 4} {...linie(m.c1)} />
      )}
      {/* Körper */}
      <Ellipse cx={23} cy={yKoerper} rx={13} ry={7} {...f(m.c1)} />
      {m.spikes ? (
        <Path
          d={`M12 ${yKoerper - 4} l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5`}
          fill="none"
          {...linie('#3A2E24')}
          strokeWidth={1.2}
        />
      ) : null}
      {/* Kopf und Ohren */}
      {ohren === 'long' && <Ellipse cx={36} cy={yKoerper - 14} rx={2} ry={7} {...f(m.c1)} />}
      {ohren === 'round' && <Circle cx={36} cy={yKoerper - 9} r={2.2} {...f(m.c1)} />}
      {(ohren === 'pointy' || ohren === 'tuft' || ohren === 'lynx' || !ohren) && (
        <Path d={`M34 ${yKoerper - 6} L36 ${yKoerper - 13} L39 ${yKoerper - 6} Z`} {...f(m.c1)} />
      )}
      {(ohren === 'tuft' || ohren === 'lynx') && (
        <Line x1={36} y1={yKoerper - 13} x2={36} y2={yKoerper - 17} {...linie('#111111')} />
      )}
      {m.antler ? (
        <Path
          d={`M35 ${yKoerper - 9} L33 ${yKoerper - 17} M33 ${yKoerper - 13} L30 ${yKoerper - 15}`}
          fill="none"
          {...linie('#6B5440')}
        />
      ) : null}
      <Circle cx={37} cy={yKoerper - 3} r={5.5} {...f(kopfFarbe)} />
      {m.stripes ? <Path d={`M34 ${yKoerper - 6} L40 ${yKoerper - 4}`} stroke="#111111" strokeWidth={1.6} /> : null}
      <Path
        d={`M41 ${yKoerper - 4} L${45 + zahl(m, 'snout', 0.3) * 3} ${yKoerper - 1} L41 ${yKoerper + 1} Z`}
        {...f(kopfFarbe)}
      />
      <Circle cx={38} cy={yKoerper - 4} r={1} fill="#0A0A0A" />
    </G>
  );
}
