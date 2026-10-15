import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { KategorieId } from '@/data/artTypen';
import type { Lebensbaum as LebensbaumDaten } from '@/logic/katalog';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { GefahrSektion } from './GefahrSektion';
import { Schrift } from './Schrift';
import { AstPanel } from './stammbaum/AstPanel';
import { Lebensbaum, WURZELN } from './stammbaum/Lebensbaum';

/**
 * Stammbaum-Ansicht einer Kategorie als Lebensbaum (siehe `stammbaum/Lebensbaum.tsx`).
 * Es ist immer nur ein Ast offen: seine Arten wachsen darunter heraus (`AstPanel`).
 * Die Schattenwurzeln öffnen die Sektion "Gefährlich & tödlich".
 */
type Props = {
  kategorie: KategorieId;
  baum: LebensbaumDaten;
  gefunden: Record<string, unknown>;
  verborgen: (id: string) => boolean;
  /** Text für die Wurzeln, falls es keine gefährlichen Arten gibt */
  leerText?: string;
  /** meldet die Lage des geöffneten Bereichs, damit der Screen dorthin scrollen kann */
  onBereich?: (y: number) => void;
};

export function Stammbaum({ kategorie, baum, gefunden, verborgen, leerText, onBereich }: Props) {
  const [offen, setOffen] = useState<string | null>(null);
  const ast = baum.aeste.find((a) => a.name === offen);

  return (
    <View style={{ gap: spacing.m }}>
      <Schrift art="klein" style={{ textAlign: 'center' }}>
        Tippe einen Ast an, um seine Arten zu sehen. Die Sterne sind die seltensten Arten – und in den Schattenwurzeln
        lauert Gefahr.
      </Schrift>

      <Lebensbaum kategorie={kategorie} baum={baum} gefunden={gefunden} offen={offen} onWaehle={setOffen} />

      {ast && (
        <View onLayout={(e) => onBereich?.(e.nativeEvent.layout.y)}>
          <AstPanel
            key={ast.name}
            kategorie={kategorie}
            ast={ast}
            gefunden={gefunden}
            onSchliessen={() => setOffen(null)}
          />
        </View>
      )}

      {offen === WURZELN && (
        <Animated.View entering={FadeIn.duration(400)} onLayout={(e) => onBereich?.(e.nativeEvent.layout.y)}>
          <Pressable
            onPress={() => setOffen(null)}
            accessibilityRole="button"
            accessibilityLabel="Schattenwurzeln schließen"
            hitSlop={8}
            style={({ pressed }) => [stile.schliessen, pressed && { opacity: 0.6 }]}
          >
            <Schrift style={stile.schliessenText}>✕ schließen</Schrift>
          </Pressable>
          <GefahrSektion
            eintraege={baum.wurzeln}
            gefunden={gefunden}
            verborgen={verborgen}
            ausloeser={1}
            leerText={leerText}
          />
        </Animated.View>
      )}
    </View>
  );
}

const stile = StyleSheet.create({
  schliessen: {
    alignSelf: 'flex-end',
    marginBottom: spacing.s,
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.blut,
    backgroundColor: colors.abgrund,
  },
  schliessenText: { fontFamily: fonts.type, fontSize: 12, color: colors.fog },
});
