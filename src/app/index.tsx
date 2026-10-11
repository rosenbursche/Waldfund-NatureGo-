import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Phase 0: Testscreen.
 * Zeigt alle Schriften und Farb-Tokens, damit wir prüfen können,
 * ob Theme und Schriftladen funktionieren. Wird in Phase 2/3 ersetzt.
 */
const swatches = ['night', 'forest', 'moss', 'fog', 'moon', 'amber', 'rune', 'rare', 'legend'] as const;

export default function Index() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>FELDTAGEBUCH · EINTRAG 0</Text>
        <Text style={styles.title}>Wildfund</Text>
        <Text style={styles.note}>Etwas lebt in diesem Wald, das du noch nicht kennst …</Text>

        <Text style={styles.body}>
          Das ist die Textschrift (Lexend). Sie ist gut lesbar und wird für Steckbriefe, Erklärungen und
          Buttons verwendet.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Handschrift (Kalam)</Text>
          <Text style={styles.type}>Schreibmaschine (Special Elite) · 150 AP · Rote Liste 3</Text>
        </View>

        <View style={styles.swatches}>
          {swatches.map((name) => (
            <View key={name} style={styles.swatch}>
              <View style={[styles.dot, { backgroundColor: colors[name] }]} />
              <Text style={styles.swatchLabel}>{name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  content: { padding: spacing.m, gap: spacing.m },
  kicker: { fontFamily: fonts.type, fontSize: 12, color: colors.fog, letterSpacing: 1.5, marginTop: spacing.l },
  title: { fontFamily: fonts.handBold, fontSize: 52, lineHeight: 60, color: colors.moon },
  note: { fontFamily: fonts.hand, fontSize: 20, lineHeight: 28, color: colors.amber },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.moon },
  card: {
    backgroundColor: colors.forest,
    borderColor: colors.moss,
    borderWidth: 1,
    borderRadius: radius.m,
    padding: spacing.m,
    gap: spacing.s,
  },
  cardTitle: { fontFamily: fonts.handBold, fontSize: 24, color: colors.rune },
  type: { fontFamily: fonts.type, fontSize: 13, color: colors.fog },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m },
  swatch: { alignItems: 'center', width: 64, gap: spacing.xs },
  dot: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.moss },
  swatchLabel: { fontFamily: fonts.type, fontSize: 11, color: colors.fog },
});
