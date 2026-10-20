import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import type { KategorieId } from '@/data/artTypen';
import type { Lebensbaum as LebensbaumDaten } from '@/logic/katalog';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { GefahrAuftritt, hatAuftritt } from './gefahr/GefahrAuftritt';
import { GefahrSektion } from './GefahrSektion';
import { Schrift } from './Schrift';
import { AstListe } from './stammbaum/AstListe';
import { AstPanel } from './stammbaum/AstPanel';
import { Lebensbaum, TOTER_AST } from './stammbaum/Lebensbaum';
import { Schatzkammer } from './stammbaum/Schatzkammer';

/**
 * Stammbaum-Ansicht einer Kategorie als Lebensbaum (siehe `stammbaum/Lebensbaum.tsx`).
 * Es ist immer nur ein Ast offen: seine Arten wachsen darunter heraus (`AstPanel`).
 * Der tote Ast über der Krone öffnet – nach einem Schreck-Auftritt – die Sektion "Gefährlich & tödlich".
 */
type Props = {
  kategorie: KategorieId;
  baum: LebensbaumDaten;
  gefunden: Record<string, unknown>;
  verborgen: (id: string) => boolean;
  /** Text für den toten Ast, falls es keine gefährlichen Arten gibt */
  leerText?: string;
  /** meldet die Lage des geöffneten Bereichs, damit der Screen dorthin scrollen kann */
  onBereich?: (y: number) => void;
};

export function Stammbaum({ kategorie, baum, gefunden, verborgen, leerText, onBereich }: Props) {
  const ruhig = useReducedMotion();
  const [offen, setOffen] = useState<string | null>(null);
  const [auftritt, setAuftritt] = useState(false);
  const ast = baum.aeste.find((a) => a.name === offen);

  // Der tote Ast öffnet sich mit einem Schreck-Auftritt über den ganzen Bildschirm
  // (nicht bei „Bewegung reduzieren“ und nicht, wenn es in der Kategorie keine gefährlichen Arten gibt)
  const waehle = (ziel: string | null) => {
    if (ziel === TOTER_AST && offen !== TOTER_AST && !ruhig && hatAuftritt(kategorie) && baum.toterAst.length > 0) {
      setOffen(null);
      setAuftritt(true);
      return;
    }
    setOffen(ziel);
  };

  return (
    <View style={{ gap: spacing.m }}>
      <Schrift art="klein" style={{ textAlign: 'center' }}>
        Tippe einen Ast an – am Baum oder in der Liste darunter. Seine Zweige sind kleine Sammelsets, jedes mit einem
        Schatz. Die Sterne sind die legendären Arten – und am toten Ast ganz oben lauert Gefahr.
      </Schrift>

      <Lebensbaum kategorie={kategorie} baum={baum} gefunden={gefunden} offen={offen} onWaehle={waehle} />
      <Schatzkammer kategorie={kategorie} baum={baum} gefunden={gefunden} />
      <AstListe kategorie={kategorie} baum={baum} gefunden={gefunden} offen={offen} onWaehle={waehle} />

      {auftritt && (
        <GefahrAuftritt
          kategorie={kategorie}
          onHoehepunkt={() => setOffen(TOTER_AST)}
          onEnde={() => setAuftritt(false)}
        />
      )}

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

      {offen === TOTER_AST && (
        <Animated.View entering={FadeIn.duration(400)} onLayout={(e) => onBereich?.(e.nativeEvent.layout.y)}>
          <Pressable
            onPress={() => setOffen(null)}
            accessibilityRole="button"
            accessibilityLabel="Gefahren schließen"
            hitSlop={8}
            style={({ pressed }) => [stile.schliessen, pressed && { opacity: 0.6 }]}
          >
            <Schrift style={stile.schliessenText}>✕ schließen</Schrift>
          </Pressable>
          <GefahrSektion
            eintraege={baum.toterAst}
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
  schliessenText: { fontFamily: fonts.etikett, fontSize: 12, color: colors.fog },
});
