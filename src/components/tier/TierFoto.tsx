import { Image, type ImageContentPosition } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, Easing, Linking, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { FOTOS, fotoNachweis, type FotoId } from '@/data/fotos';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { TierTafel } from './TierTafel';

/**
 * Echte Fotos auf der Tierseite.
 * - TierFoto: ein Foto (füllt seinen Rahmen), auf Wunsch mit kleinem Bildnachweis unten rechts
 * - FotoHero: großes Foto oben, langsames Heranzoomen (bei „Bewegung reduzieren“ still);
 *   solange die Art nicht gesammelt ist, verschwommen und abgedunkelt
 * - Bildnachweis: Liste aller Fotos der Seite mit Urheber, Lizenz und Link
 */
export function TierFoto({
  id,
  style,
  nachweis = false,
  verschwommen = false,
  position,
}: {
  id: FotoId;
  style?: ViewStyle;
  nachweis?: boolean;
  verschwommen?: boolean;
  /** Bildausschnitt (Standard: Mitte) */
  position?: ImageContentPosition;
}) {
  const f = FOTOS[id];
  return (
    <View style={[stile.rahmen, style]}>
      <Image
        source={f.quelle}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition={position}
        blurRadius={verschwommen ? 22 : 0}
        transition={250}
        accessibilityIgnoresInvertColors
      />
      {nachweis && (
        <View style={stile.nachweis} pointerEvents="none">
          <Schrift style={stile.nachweisText} numberOfLines={1}>
            {fotoNachweis(f)}
          </Schrift>
        </View>
      )}
    </View>
  );
}

export function FotoHero({ id, gefunden, ruhig, x }: { id: FotoId; gefunden: boolean; ruhig: boolean; x?: number }) {
  const [zoom] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (ruhig) return;
    // ganz langsames Heranzoomen und zurück („Ken-Burns“), damit das Foto lebendig wirkt
    const schleife = Animated.loop(
      Animated.sequence([
        Animated.timing(zoom, { toValue: 1, duration: 16000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(zoom, { toValue: 0, duration: 16000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    schleife.start();
    return () => schleife.stop();
  }, [ruhig, zoom]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ scale: zoom.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }] },
        ]}
      >
        <TierFoto
          id={id}
          style={StyleSheet.absoluteFill}
          verschwommen={!gefunden}
          position={x !== undefined ? { left: `${x}%`, top: '50%' } : undefined}
        />
      </Animated.View>
      {!gefunden && <View style={stile.abdunkeln} pointerEvents="none" />}
      <View style={stile.heroNachweis} pointerEvents="none">
        <Schrift style={stile.nachweisText} numberOfLines={1}>
          {fotoNachweis(FOTOS[id])}
        </Schrift>
      </View>
    </View>
  );
}

/** Alle Fotos der Seite mit Urheber, Lizenz und Link zur Quelle (Pflicht bei CC-Lizenzen) */
export function Bildnachweis({ ids }: { ids: FotoId[] }) {
  const eindeutig = [...new Set(ids)];
  if (eindeutig.length === 0) return null;
  return (
    <TierTafel symbol="karte" titel="Fotos">
      <View style={stile.liste}>
        {eindeutig.map((id) => {
          const f = FOTOS[id];
          return (
            <Pressable
              key={id}
              onPress={() => Linking.openURL(f.seite)}
              accessibilityRole="link"
              accessibilityLabel={`${fotoNachweis(f)}, Quelle öffnen`}
              style={({ pressed }) => [stile.eintrag, pressed && { opacity: 0.6 }]}
            >
              <TierFoto id={id} style={stile.mini} />
              <View style={{ flex: 1 }}>
                <Schrift art="klein" style={{ color: colors.moon }}>
                  {f.autor || 'Urheber unbekannt'}
                </Schrift>
                <Schrift art="klein">{f.lizenz} · Wikimedia Commons</Schrift>
              </View>
            </Pressable>
          );
        })}
      </View>
      <Schrift art="klein" style={{ opacity: 0.75 }}>
        Fotos nur verkleinert, nicht verändert. Antippen öffnet die Quelle mit der vollständigen Lizenz.
      </Schrift>
    </TierTafel>
  );
}

const stile = StyleSheet.create({
  rahmen: { overflow: 'hidden', backgroundColor: colors.night },
  nachweis: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    maxWidth: '90%',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.s,
    backgroundColor: `${colors.night}B3`,
  },
  heroNachweis: {
    position: 'absolute',
    right: spacing.s,
    top: 70,
    maxWidth: '70%',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.s,
    backgroundColor: `${colors.night}99`,
  },
  nachweisText: { fontFamily: fonts.body, fontSize: 9.5, lineHeight: 13, color: colors.moon, opacity: 0.85 },
  abdunkeln: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: `${colors.night}8C` },
  liste: { gap: spacing.s },
  eintrag: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  mini: { width: 52, height: 40, borderRadius: radius.s },
});
