import { useCallback, useEffect, useRef } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import type { KategorieId } from '@/data/artTypen';
import { colors, fonts } from '@/theme/theme';

import { Schrift } from '../Schrift';
import { GiftNebel, GIFT_ABLAUF } from './GiftNebel';
import { MaulSchnappt, MAUL_ABLAUF } from './MaulSchnappt';

/**
 * Schreck-Auftritt über den ganzen Bildschirm, bevor sich „Gefährlich & tödlich“ öffnet:
 * - Säugetiere: Dunkelheit, zwei rote Augen, ein Maul schnappt zu (MaulSchnappt)
 * - Pflanzen und Pilze: Giftnebel, Totenkopf über der Giftpflanze, ein Tier kippt um (GiftNebel)
 * Im Höhepunkt (`onHoehepunkt`) öffnet der Aufrufer die Sektion, danach blendet der Auftritt aus (`onEnde`).
 *
 * Sicherheit: keine Lichtblitze, nur sanftes Ein- und Ausblenden; ein Tipp überspringt alles.
 * Gruselig, aber ohne Blut – das Tier fällt wie im Zeichentrick um.
 * Bei „Bewegung reduzieren“ zeigt der Aufrufer den Auftritt gar nicht erst.
 */
type Props = { kategorie: KategorieId; onHoehepunkt: () => void; onEnde: () => void };

/** Gibt es für diese Kategorie einen Auftritt? (Vögel sind nie gefährlich) */
export function hatAuftritt(kategorie: KategorieId): boolean {
  return kategorie !== 'voegel';
}

export function GefahrAuftritt({ kategorie, onHoehepunkt, onEnde }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const ablauf = kategorie === 'saeuger' ? MAUL_ABLAUF : GIFT_ABLAUF;
  const hoehepunktErreicht = useRef(false);
  const beendet = useRef(false);

  const hoehepunkt = useCallback(() => {
    if (hoehepunktErreicht.current) return;
    hoehepunktErreicht.current = true;
    onHoehepunkt();
  }, [onHoehepunkt]);
  const ende = useCallback(() => {
    if (beendet.current) return;
    beendet.current = true;
    onEnde();
  }, [onEnde]);

  // nach dem Höhepunkt blendet der ganze Auftritt weich aus
  const schleier = useSharedValue(1);
  useEffect(() => {
    schleier.value = withDelay(
      ablauf.hoehepunkt + 60,
      withTiming(0, { duration: ablauf.ende - ablauf.hoehepunkt - 60, easing: Easing.out(Easing.quad) }),
    );
    const t1 = setTimeout(hoehepunkt, ablauf.hoehepunkt);
    const t2 = setTimeout(ende, ablauf.ende);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ablauf, hoehepunkt, ende, schleier]);
  const schleierStil = useAnimatedStyle(() => ({ opacity: schleier.value }));

  const ueberspringen = () => {
    hoehepunkt();
    ende();
  };

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={ueberspringen}>
      <Animated.View style={[StyleSheet.absoluteFill, schleierStil]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={ueberspringen}
          accessibilityRole="button"
          accessibilityLabel="Schreck-Animation überspringen"
        >
          {kategorie === 'saeuger' ? (
            <MaulSchnappt W={W} H={H} />
          ) : (
            <GiftNebel W={W} H={H} pilz={kategorie === 'pilze'} />
          )}
          <View style={stile.hinweis} pointerEvents="none">
            <Schrift style={stile.hinweisText}>Tippen zum Überspringen</Schrift>
          </View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const stile = StyleSheet.create({
  hinweis: { position: 'absolute', bottom: 48, left: 0, right: 0, alignItems: 'center' },
  hinweisText: { fontFamily: fonts.etikett, fontSize: 11, color: colors.fog, opacity: 0.55 },
});
