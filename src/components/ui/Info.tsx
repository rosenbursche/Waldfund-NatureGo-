import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { Zierlinie } from './Zierlinie';

/**
 * Info-Zeichen „i“ neben einem Titel. Antippen öffnet einen kleinen Kasten mit der Erklärung,
 * Antippen irgendwo schließt ihn wieder. So bleibt die Seite selbst fast ohne Erklärtext.
 */
export function Info({ titel, text }: { titel?: string; text: string }) {
  const [offen, setOffen] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => setOffen(true)}
        accessibilityRole="button"
        accessibilityLabel={titel ? `Info: ${titel}` : 'Info'}
        accessibilityHint={text}
        hitSlop={10}
        style={({ pressed }) => [stile.knopf, pressed && { opacity: 0.6 }]}
      >
        <Schrift style={stile.i}>i</Schrift>
      </Pressable>
      <Modal visible={offen} transparent animationType="fade" onRequestClose={() => setOffen(false)}>
        <Pressable style={stile.schleier} onPress={() => setOffen(false)} accessibilityLabel="Info schließen">
          <View style={stile.kasten}>
            {titel ? <Schrift style={stile.titel}>{titel}</Schrift> : null}
            {titel ? <Zierlinie /> : null}
            <Schrift style={stile.text}>{text}</Schrift>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const stile = StyleSheet.create({
  knopf: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: `${colors.fog}99`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  i: { fontFamily: fonts.titel, fontSize: 12, lineHeight: 15, color: colors.fog },
  schleier: {
    flex: 1,
    backgroundColor: `${colors.night}CC`,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.l,
  },
  kasten: {
    maxWidth: 420,
    width: '100%',
    gap: spacing.s,
    padding: spacing.m,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.forest,
  },
  titel: { fontFamily: fonts.titel, fontSize: 17, letterSpacing: 1.2, color: colors.moon },
  text: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.moon },
});
