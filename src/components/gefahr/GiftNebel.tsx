import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, G, Line, Path, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '@/theme/theme';

import { ruck, schweben } from './helfer';

/**
 * Pflanzen und Pilze: Giftgrüner Nebel zieht auf, über der Giftpflanze (bzw. dem Giftpilz) steigt ein
 * leuchtender Totenkopf auf. Eine Maus läuft herbei, schnuppert, schwankt – und kippt mit X-Augen um.
 * Dann füllt der Nebel den Bildschirm. Wie im Zeichentrick: kein Blut, nichts Echtes.
 */
export const GIFT_ABLAUF = { hoehepunkt: 4000, ende: 4550 };

/** Nebelschwaden: Startpunkt (Anteile des Bildschirms), Drift und Größe */
const SCHWADEN = [
  { x: -0.2, y: 0.85, dx: 0.25, dy: -0.1, r: 0.55, t: 0 },
  { x: 1.1, y: 0.8, dx: -0.3, dy: -0.12, r: 0.6, t: 200 },
  { x: 0.5, y: 1.05, dx: 0, dy: -0.18, r: 0.65, t: 400 },
  { x: -0.15, y: 0.45, dx: 0.3, dy: 0.05, r: 0.45, t: 700 },
  { x: 1.15, y: 0.35, dx: -0.35, dy: 0.06, r: 0.5, t: 900 },
  { x: 0.3, y: 0.15, dx: 0.1, dy: 0.1, r: 0.4, t: 1200 },
  { x: 0.8, y: 0.6, dx: -0.1, dy: -0.06, r: 0.45, t: 1500 },
];

export function GiftNebel({ W, H, pilz }: { W: number; H: number; pilz: boolean }) {
  const dunkel = useSharedValue(0);
  const pflanze = useSharedValue(0);
  const schaedel = useSharedValue(0);
  const schaedelHoch = useSharedValue(0);
  const schaedelSchweben = useSharedValue(0);
  const tierX = useSharedValue(-W * 0.45);
  const tierHuepf = useSharedValue(0);
  const tierDreh = useSharedValue(0);
  const tierFall = useSharedValue(0);
  const xAugen = useSharedValue(0);
  const flut = useSharedValue(0);

  const boden = H * 0.7;
  const pflanzeX = W * 0.6;
  const tierZiel = pflanzeX - W * 0.36;

  useEffect(() => {
    dunkel.value = withTiming(1, { duration: 450 });
    pflanze.value = withDelay(400, withTiming(1, { duration: 600 }));
    // Totenkopf steigt aus der Pflanze auf und schwebt
    schaedel.value = withDelay(900, withTiming(1, { duration: 700 }));
    schaedelHoch.value = withDelay(900, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));
    schaedelSchweben.value = withDelay(1800, schweben(6, 900));
    // Maus läuft herbei (hüpfende Schritte) …
    tierX.value = withDelay(1300, withTiming(tierZiel, { duration: 1300, easing: Easing.out(Easing.quad) }));
    tierHuepf.value = withDelay(
      1300,
      withRepeat(withSequence(withTiming(-6, { duration: 105 }), withTiming(0, { duration: 105 })), 6),
    );
    // … schnuppert, schwankt …
    tierDreh.value = withDelay(
      2800,
      withSequence(
        withTiming(-8, { duration: 120 }),
        withTiming(10, { duration: 160 }),
        withTiming(-14, { duration: 180 }),
        withTiming(12, { duration: 180 }),
        // … und kippt um
        withTiming(95, { duration: 300, easing: Easing.in(Easing.quad) }),
      ),
    );
    tierFall.value = withDelay(3420, withTiming(1, { duration: 300, easing: Easing.in(Easing.quad) }));
    xAugen.value = withDelay(3480, withTiming(1, { duration: 120 }));
    // Nebel flutet den Bildschirm
    flut.value = withDelay(3550, withTiming(1, { duration: 450, easing: Easing.in(Easing.quad) }));
    const t = [setTimeout(() => ruck(false), 3700)];
    return () => t.forEach(clearTimeout);
  }, [
    dunkel,
    pflanze,
    schaedel,
    schaedelHoch,
    schaedelSchweben,
    tierX,
    tierZiel,
    tierHuepf,
    tierDreh,
    tierFall,
    xAugen,
    flut,
  ]);

  const dunkelStil = useAnimatedStyle(() => ({ opacity: dunkel.value }));
  const pflanzeStil = useAnimatedStyle(() => ({ opacity: pflanze.value }));
  const schaedelStil = useAnimatedStyle(() => ({
    opacity: schaedel.value,
    transform: [
      { translateY: -schaedelHoch.value * H * 0.14 + schaedelSchweben.value },
      { scale: 0.6 + schaedelHoch.value * 0.4 },
    ],
  }));
  const tierStil = useAnimatedStyle(() => ({
    transform: [
      { translateX: tierX.value },
      { translateY: tierHuepf.value + tierFall.value * 14 },
      { rotate: `${tierDreh.value}deg` },
    ],
  }));
  const flutStil = useAnimatedStyle(() => ({ opacity: flut.value }));

  const pflanzeG = Math.min(W, H) * 0.42;
  const schaedelG = Math.min(W, H) * 0.34;
  const tierB = Math.min(W, H) * 0.26;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.giftDunkel }, dunkelStil]} />

      {SCHWADEN.map((s, i) => (
        <Schwade key={i} s={s} W={W} H={H} index={i} />
      ))}

      {/* Giftpflanze bzw. Giftpilz am Boden */}
      <Animated.View
        style={[
          stile.frei,
          { left: pflanzeX - pflanzeG / 2, top: boden - pflanzeG, width: pflanzeG, height: pflanzeG },
          pflanzeStil,
        ]}
      >
        {pilz ? <Giftpilz g={pflanzeG} /> : <Giftpflanze g={pflanzeG} />}
      </Animated.View>

      {/* Totenkopf schwebt darüber */}
      <Animated.View
        style={[
          stile.frei,
          {
            left: pflanzeX - schaedelG / 2,
            top: boden - pflanzeG - schaedelG * 0.75,
            width: schaedelG,
            height: schaedelG,
          },
          schaedelStil,
        ]}
      >
        <Totenkopf g={schaedelG} />
      </Animated.View>

      {/* Maus */}
      <Animated.View
        style={[stile.frei, { left: 0, top: boden - tierB * 0.55, width: tierB, height: tierB * 0.6 }, tierStil]}
      >
        <Maus b={tierB} xAugen={xAugen} />
      </Animated.View>

      {/* Bodennebel vorn */}
      <Svg width={W} height={H} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id="bodennebel">
            <Stop offset={0} stopColor={colors.giftNebel} stopOpacity={0.7} />
            <Stop offset={1} stopColor={colors.giftNebel} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={W / 2} cy={boden + 10} rx={W * 0.8} ry={H * 0.08} fill="url(#bodennebel)" />
      </Svg>

      {/* zum Schluss flutet der Nebel alles */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.giftNebel }, flutStil]} />
    </View>
  );
}

function Schwade({ s, W, H, index }: { s: (typeof SCHWADEN)[number]; W: number; H: number; index: number }) {
  const da = useSharedValue(0);
  const drift = useSharedValue(0);
  useEffect(() => {
    da.value = withDelay(s.t, withTiming(1, { duration: 1400 }));
    drift.value = withDelay(s.t, withTiming(1, { duration: 4200, easing: Easing.out(Easing.quad) }));
  }, [da, drift, s.t]);
  const r = Math.max(W, H) * s.r;
  const stil = useAnimatedStyle(() => ({
    opacity: da.value * 0.8,
    transform: [
      { translateX: drift.value * s.dx * W },
      { translateY: drift.value * s.dy * H },
      { scale: 0.7 + drift.value * 0.5 },
    ],
  }));
  return (
    <Animated.View style={[stile.frei, { left: s.x * W - r, top: s.y * H - r, width: r * 2, height: r * 2 }, stil]}>
      <Svg width={r * 2} height={r * 2}>
        <Defs>
          <RadialGradient id={`schwade${index}`}>
            <Stop offset={0} stopColor={index % 2 ? colors.gift : colors.giftNebel} stopOpacity={0.45} />
            <Stop offset={0.55} stopColor={colors.giftNebel} stopOpacity={0.22} />
            <Stop offset={1} stopColor={colors.giftNebel} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={r} cy={r} r={r} fill={`url(#schwade${index})`} />
      </Svg>
    </Animated.View>
  );
}

/** Totenkopf aus fahlem Giftgrün mit Lichthof */
function Totenkopf({ g }: { g: number }) {
  return (
    <Svg width={g} height={g} viewBox="0 0 32 32">
      <Defs>
        <RadialGradient id="schaedelSchein">
          <Stop offset={0} stopColor={colors.gift} stopOpacity={0.6} />
          <Stop offset={1} stopColor={colors.gift} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={16} cy={15} r={16} fill="url(#schaedelSchein)" />
      <G>
        <Path d="M8 14 C8 6 24 6 24 14 C24 17.5 22 18.5 22 21 L10 21 C10 18.5 8 17.5 8 14 Z" fill={colors.gift} />
        <Path d="M11 21 L11 24.5 L21 24.5 L21 21 Z" fill={colors.gift} />
        <Path
          d="M13.4 21 L13.4 24.5 M16 21 L16 24.5 M18.6 21 L18.6 24.5"
          stroke={colors.giftDunkel}
          strokeWidth={0.7}
        />
        <Path d="M10.2 14.2 C10.2 11.6 14.4 11.6 14.4 14.6 C14.4 16.4 10.2 16.6 10.2 14.2 Z" fill={colors.giftDunkel} />
        <Path d="M21.8 14.2 C21.8 11.6 17.6 11.6 17.6 14.6 C17.6 16.4 21.8 16.6 21.8 14.2 Z" fill={colors.giftDunkel} />
        <Path d="M16 16.4 L14.8 19 L17.2 19 Z" fill={colors.giftDunkel} />
      </G>
      {/* gekreuzte Knochen */}
      <Path d="M4 26 L28 30 M28 26 L4 30" stroke={colors.gift} strokeWidth={1.6} strokeLinecap="round" opacity={0.85} />
    </Svg>
  );
}

/** Giftpflanze: hoher Stängel mit hängenden Glockenblüten (an Fingerhut angelehnt) */
function Giftpflanze({ g }: { g: number }) {
  return (
    <Svg width={g} height={g} viewBox="0 0 40 40">
      <Path d="M20 40 C20 30 21 18 19.5 5" stroke={colors.giftNebel} strokeWidth={1.4} fill="none" />
      <Path
        d="M20 38 C15 36 11 37 8 39.5 M20 37 C25 35 29 36 32 39"
        stroke={colors.giftNebel}
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
      />
      {[8, 13, 18, 23, 28].map((y, i) => {
        const s = i % 2 ? 1 : -1;
        const x = 20 + s * 2.2;
        return (
          <Path
            key={y}
            d={`M${x} ${y} C${x + s * 4.5} ${y + 0.5} ${x + s * 5.5} ${y + 4} ${x + s * 4.8} ${y + 6} C${x + s * 3} ${y + 6.8} ${x + s * 1.2} ${y + 5.6} ${x} ${y} Z`}
            fill={colors.gift}
            stroke={colors.giftDunkel}
            strokeWidth={0.4}
            opacity={0.9}
          />
        );
      })}
    </Svg>
  );
}

/** Giftpilz: hoher, heller Hut, Ring am Stiel und Knolle (an den Knollenblätterpilz angelehnt) */
function Giftpilz({ g }: { g: number }) {
  return (
    <Svg width={g} height={g} viewBox="0 0 40 40">
      <Path
        d="M5 19 C5 9 12 5 20 5 C28 5 35 9 35 19 C28 21 12 21 5 19 Z"
        fill={colors.gift}
        stroke={colors.giftDunkel}
        strokeWidth={0.5}
      />
      <Path
        d="M9 19.6 L12 21.4 M14 20.3 L15.4 21.8 M26 20.3 L24.6 21.8 M31 19.6 L28 21.4"
        stroke={colors.giftDunkel}
        strokeWidth={0.5}
      />
      <Path d="M17 21 C16.6 27 16.4 31 15.6 34 L24.4 34 C23.6 31 23.4 27 23 21 Z" fill={colors.giftNebel} />
      <Path d="M15.8 25 C17.8 26.6 22.2 26.6 24.2 25 C23 27.6 17 27.6 15.8 25 Z" fill={colors.gift} opacity={0.8} />
      <Path
        d="M13.5 34 C13.5 38.5 26.5 38.5 26.5 34 C24 32.4 16 32.4 13.5 34 Z"
        fill={colors.giftNebel}
        stroke={colors.gift}
        strokeWidth={0.5}
      />
    </Svg>
  );
}

/** Maus von der Seite (schaut nach rechts); die Augen wechseln von Punkt zu X */
function Maus({ b, xAugen }: { b: number; xAugen: SharedValue<number> }) {
  const augeStil = useAnimatedStyle(() => ({ opacity: 1 - xAugen.value }));
  const xStil = useAnimatedStyle(() => ({ opacity: xAugen.value }));
  const h = b * 0.6;
  const k = b / 90;
  const auge = { x: 71 * k, y: 23 * k };
  return (
    <View style={{ width: b, height: h }}>
      <Svg width={b} height={h} viewBox="0 0 90 54">
        <Path d="M16 38 C6 42 2 32 9 25" stroke={colors.fog} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <Ellipse cx={40} cy={34} rx={26} ry={15} fill={colors.fog} />
        <Circle cx={62} cy={14} r={8} fill={colors.fog} />
        <Circle cx={62} cy={14} r={4.5} fill={colors.warn} opacity={0.5} />
        <Path d="M56 22 C62 16 74 18 84 27 C76 31 64 33 56 32 Z" fill={colors.fog} />
        <Circle cx={84} cy={27} r={1.8} fill={colors.warn} />
        <Line x1={30} y1={47} x2={29} y2={52} stroke={colors.fog} strokeWidth={2} strokeLinecap="round" />
        <Line x1={50} y1={47} x2={51} y2={52} stroke={colors.fog} strokeWidth={2} strokeLinecap="round" />
      </Svg>
      <Animated.View style={[stile.frei, { left: auge.x - 3, top: auge.y - 3, width: 6, height: 6 }, augeStil]}>
        <View style={[stile.punktAuge, { backgroundColor: colors.giftDunkel }]} />
      </Animated.View>
      <Animated.View style={[stile.frei, { left: auge.x - 5, top: auge.y - 5, width: 10, height: 10 }, xStil]}>
        <Svg width={10} height={10}>
          <Path d="M2 2 L8 8 M8 2 L2 8" stroke={colors.giftDunkel} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const stile = StyleSheet.create({
  frei: { position: 'absolute' },
  punktAuge: { width: 6, height: 6, borderRadius: 3 },
});
