import { useId, type ReactNode } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { ArtMiniatur } from '@/components/ArtMiniatur';
import type { ModellParameter, Seltenheit } from '@/data/artTypen';
import { ART_ICONS } from '@/data/icons';
import type { BaumModell } from '@/data/typen';
import type { Stufe } from '@/logic/fundstuecke';
import { iconKnoten, ICON_RADIUS, MITTE, talerRahmen, TALER_VIEWBOX, type Knoten } from '@/logic/taler/taler';
import { talerStufe, useSammlung } from '@/store/sammlung';
import { colors, fonts, talerPraegung, talerRang } from '@/theme/theme';

/**
 * Art-Taler: das eigene Icon einer Art im Rang-Emblem ihrer Seltenheit (Gestaltung: docs/ICONS.md).
 * - Seltenheit: Form, Email und Edelstein · Fortschritt (Fundstücke): Metall von Rohling über Holz bis Gold
 * - gefunden: Icon in Farbe · nicht gefunden: Icon unter leichtem Schleier · verborgen (Mystery): „?“
 * - Ohne eigenes Icon zeigt der Taler vorerst die bisherige Miniatur.
 * `groesse` ist die Breite des ganzen Emblems.
 */
type Props = {
  id: string;
  seltenheit: Seltenheit;
  zustand: 'gefunden' | 'umriss' | 'verborgen';
  groesse?: number;
  /** Ersatz, solange es noch kein eigenes Icon gibt */
  modell?: ModellParameter;
  baumModell?: BaumModell;
  /** Prägung (Fortschritt 0–4). Fehlt sie, kommt sie aus deiner Sammlung. */
  praegung?: Stufe;
};

const SVG: Record<Knoten['t'], React.ComponentType<Record<string, unknown>>> = {
  g: G as never,
  path: Path as never,
  circle: Circle as never,
  ellipse: Ellipse as never,
  rect: Rect as never,
  radialGradient: RadialGradient as never,
  linearGradient: LinearGradient as never,
  stop: Stop as never,
  clipPath: ClipPath as never,
  defs: Defs as never,
};

/** Knoten-Daten (src/logic/taler/taler.ts) → react-native-svg */
function zeichne(k: Knoten, schluessel: string): ReactNode {
  const Teil = SVG[k.t];
  return (
    <Teil key={schluessel} {...k.a}>
      {k.k?.map((kind, i) => zeichne(kind, `${schluessel}-${i}`))}
    </Teil>
  );
}

export function ArtTaler({ id, seltenheit, zustand, groesse = 64, modell, baumModell, praegung }: Props) {
  // eindeutige Verlaufs-IDs je Taler, damit mehrere Taler auf einer Seite sich nicht stören
  const praefix = `t${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const ausSammlung = useSammlung((s) => talerStufe(id, s));
  const metall = talerPraegung[praegung ?? ausSammlung].metall;
  const r = talerRahmen(seltenheit, { ...talerRang[seltenheit], metall }, colors, praefix);
  const icon = ART_ICONS[id];
  const hoehe = (groesse * TALER_VIEWBOX.h) / TALER_VIEWBOX.b;
  const v = TALER_VIEWBOX;

  let innen: ReactNode = null;
  if (zustand === 'verborgen') {
    innen = (
      <SvgText x={MITTE} y={MITTE + 14} textAnchor="middle" fontSize={40} fontFamily={fonts.titel} fill={colors.fog}>
        ?
      </SvgText>
    );
  } else if (icon) {
    // Icons sind immer in Farbe zu sehen; noch nicht gefundene Arten liegen unter einem leichten Nachtschleier
    innen = (
      <>
        {iconKnoten(icon, true, colors.moss, praefix).map((k, i) => zeichne(k, `i${i}`))}
        {zustand === 'umriss' && <Circle cx={MITTE} cy={MITTE} r={ICON_RADIUS} fill={colors.night} opacity={0.35} />}
      </>
    );
  }

  // noch kein eigenes Icon: bisherige Miniatur mittig über die Scheibe legen
  const ersatz = zustand !== 'verborgen' && !icon;
  const massstab = groesse / v.b;
  const ersatzGroesse = ICON_RADIUS * 1.45 * massstab;

  return (
    <View style={{ width: groesse, height: hoehe }}>
      <Svg width={groesse} height={hoehe} viewBox={`${v.x} ${v.y} ${v.b} ${v.h}`}>
        <Defs>{r.defs.map((k, i) => zeichne(k, `d${i}`))}</Defs>
        <G opacity={zustand === 'gefunden' ? 1 : 0.8}>
          {r.hinten.map((k, i) => zeichne(k, `h${i}`))}
          {r.scheibe.map((k, i) => zeichne(k, `s${i}`))}
          {innen}
          {r.innen.map((k, i) => zeichne(k, `n${i}`))}
          {r.vorn.map((k, i) => zeichne(k, `v${i}`))}
        </G>
      </Svg>
      {ersatz && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: (MITTE - v.x) * massstab - ersatzGroesse / 2,
            top: (MITTE - v.y) * massstab - ersatzGroesse / 2,
            width: ersatzGroesse,
            height: ersatzGroesse,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArtMiniatur
            modell={modell}
            baumModell={baumModell}
            stil={zustand === 'gefunden' ? 'farbe' : 'umriss'}
            akzent={colors.fog}
            groesse={ersatzGroesse}
          />
        </View>
      )}
    </View>
  );
}
