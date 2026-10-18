import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { Leuchtpunkt } from '@/components/tier/TierTafel';
import { TierSymbol } from '@/components/tier/TierSymbol';
import { Schalter } from '@/components/ui/Schalter';
import { FOTOS, fotoNachweis } from '@/data/fotos';
import type { FotoBlick, TierSeite } from '@/data/tierSeiten';
import { colors, fonts, spacing } from '@/theme/theme';

/**
 * Erkunden mit der Lupe: Das echte Foto über die volle Breite. Tippt man einen Leuchtpunkt an,
 * öffnet sich darüber eine runde Lupe, die genau diese Stelle vergrößert zeigt –
 * wie ein Forscher, der mit dem Vergrößerungsglas hinschaut. Darunter gleitet die Erklärung herein.
 */
const LUPE = 150; // Durchmesser der Lupe
const ZOOM = 2.6;

export function Lupe({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const g = tier.geschlechter;
  const e = tier.fotos?.erkunden;
  const [maennlich, setMaennlich] = useState(true);
  const blick: FotoBlick | undefined = g ? (maennlich ? e?.maennlich : e?.weiblich) : e?.alle;
  if (!blick) return null;
  return (
    <View style={{ gap: spacing.m }}>
      {g && (
        <Schalter
          wahl={maennlich ? 'm' : 'w'}
          optionen={[
            { wert: 'm', symbol: 'geweih', name: g.maennlich },
            { wert: 'w', symbol: 'herz', name: g.weiblich },
          ]}
          onWahl={(w) => setMaennlich(w === 'm')}
        />
      )}
      {/* key: beim Wechsel Bock/Ricke startet die Lupe neu */}
      <LupenFoto key={blick.foto} tier={tier} blick={blick} maennlich={maennlich} ruhig={ruhig} />
    </View>
  );
}

function LupenFoto({
  tier,
  blick,
  maennlich,
  ruhig,
}: {
  tier: TierSeite;
  blick: FotoBlick;
  maennlich: boolean;
  ruhig: boolean;
}) {
  const f = FOTOS[blick.foto];
  const [breite, setBreite] = useState(0);
  const hoehe = breite * (f.hoehe / f.breite);
  const punkte = tier.koerper.filter((p) => (maennlich || !p.nurMaennlich) && blick.punkte[p.id]);
  const [wahl, setWahl] = useState<string | null>(null);
  const gewaehlt = punkte.find((p) => p.id === wahl);

  return (
    <View>
      <View
        style={{ width: '100%', aspectRatio: f.breite / f.hoehe }}
        onLayout={(ev) => setBreite(ev.nativeEvent.layout.width)}
      >
        <Image source={f.quelle} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityIgnoresInvertColors />
        {/* abgedunkelt, solange die Lupe offen ist: der Blick geht in die Lupe */}
        {gewaehlt && <View style={stile.dunkel} pointerEvents="none" />}
        {punkte.map((p) => {
          const [l, o] = blick.punkte[p.id];
          return (
            <Pressable
              key={p.id}
              onPress={() => setWahl(p.id === wahl ? null : p.id)}
              accessibilityRole="button"
              accessibilityLabel={p.kurz}
              hitSlop={10}
              style={[stile.punktOrt, { left: `${l}%`, top: `${o}%` }]}
            >
              <Leuchtpunkt an={p.id === wahl} ruhig={ruhig} />
            </Pressable>
          );
        })}
        {gewaehlt && breite > 0 && (
          <Linse
            key={gewaehlt.id}
            quelle={f.quelle}
            breite={breite}
            hoehe={hoehe}
            px={(blick.punkte[gewaehlt.id][0] / 100) * breite}
            py={(blick.punkte[gewaehlt.id][1] / 100) * hoehe}
            ruhig={ruhig}
          />
        )}
        <Schrift style={stile.nachweis} numberOfLines={1}>
          {fotoNachweis(f)}
        </Schrift>
      </View>
      <Erklaerung key={gewaehlt?.id ?? 'leer'} icon={gewaehlt?.icon} text={gewaehlt?.kurz} ruhig={ruhig} />
    </View>
  );
}

/** Die runde Lupe: zeigt dasselbe Foto, vergrößert und so verschoben, dass der Punkt in der Mitte liegt */
function Linse({
  quelle,
  breite,
  hoehe,
  px,
  py,
  ruhig,
}: {
  quelle: number;
  breite: number;
  hoehe: number;
  px: number;
  py: number;
  ruhig: boolean;
}) {
  const [auf] = useState(() => new Animated.Value(ruhig ? 1 : 0));
  useEffect(() => {
    if (ruhig) return;
    Animated.spring(auf, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
  }, [ruhig, auf]);
  // Lupe über dem Punkt; ist oben kein Platz, darunter. Seitlich im Bild halten.
  const links = Math.min(Math.max(px - LUPE / 2, 6), breite - LUPE - 6);
  const oben = py - LUPE - 22 >= 6 ? py - LUPE - 22 : Math.min(py + 22, hoehe - LUPE - 6);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        stile.linse,
        {
          left: links,
          top: oben,
          opacity: auf,
          transform: [{ scale: auf.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }],
        },
      ]}
    >
      <View style={stile.linseInnen}>
        <Image
          source={quelle}
          contentFit="cover"
          style={{
            position: 'absolute',
            width: breite * ZOOM,
            height: hoehe * ZOOM,
            left: -(px * ZOOM - LUPE / 2),
            top: -(py * ZOOM - LUPE / 2),
          }}
        />
        {/* Glanz auf dem Glas */}
        <View style={stile.glanz} />
      </View>
    </Animated.View>
  );
}

/** Erklärung unter dem Foto: gleitet beim Wechsel von rechts herein */
function Erklaerung({
  icon,
  text,
  ruhig,
}: {
  icon?: Parameters<typeof TierSymbol>[0]['name'];
  text?: string;
  ruhig: boolean;
}) {
  const [t] = useState(() => new Animated.Value(ruhig ? 1 : 0));
  useEffect(() => {
    if (ruhig) return;
    Animated.timing(t, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [ruhig, t]);
  return (
    <Animated.View
      style={[
        stile.erklaerung,
        { opacity: t, transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] },
      ]}
    >
      <View style={stile.symbol}>
        <TierSymbol name={icon ?? 'tippen'} groesse={26} farbe={colors.amber} />
      </View>
      <Schrift style={[stile.text, !text && { color: colors.fog }]}>{text ?? 'Tippe auf einen Leuchtpunkt'}</Schrift>
    </Animated.View>
  );
}

const stile = StyleSheet.create({
  dunkel: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: `${colors.night}66` },
  punktOrt: { position: 'absolute', marginLeft: -15, marginTop: -15 },
  linse: {
    position: 'absolute',
    width: LUPE,
    height: LUPE,
    borderRadius: LUPE / 2,
    borderWidth: 3,
    borderColor: colors.amber,
    backgroundColor: colors.night,
    shadowColor: colors.amber,
    shadowOpacity: 0.55,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  linseInnen: { flex: 1, borderRadius: LUPE / 2, overflow: 'hidden' },
  glanz: {
    position: 'absolute',
    left: LUPE * 0.18,
    top: LUPE * 0.1,
    width: LUPE * 0.35,
    height: LUPE * 0.18,
    borderRadius: LUPE,
    backgroundColor: colors.moon,
    opacity: 0.18,
    transform: [{ rotate: '-25deg' }],
  },
  nachweis: {
    position: 'absolute',
    right: 6,
    bottom: 4,
    fontFamily: fonts.body,
    fontSize: 9.5,
    color: colors.moon,
    opacity: 0.8,
    textShadowColor: colors.night,
    textShadowRadius: 4,
  },
  erklaerung: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
  },
  symbol: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, fontFamily: fonts.notiz, fontSize: 21, lineHeight: 27, color: colors.moon },
});
