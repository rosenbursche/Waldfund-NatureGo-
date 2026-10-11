import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { MODELLE, namensnennung } from '@/data/modelle';
import { ArtBuehne } from '@/scene/ArtBuehne';
import { colors, radius, spacing } from '@/theme/theme';

/**
 * Test-Ansicht für realistische 3D-Modelle (GLB): Laden, LiDAR-Effekt, Bewegung, Leistung.
 * Erreichbar über Einstellungen → Darstellung. Nicht Teil des Katalogs.
 */
export default function Modelltest() {
  const ruhig = useReducedMotion();
  const m = MODELLE[0];
  const [status, setStatus] = useState('Szene startet …');
  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett="Technik-Test" titel="Realistisches 3D-Modell" />
          <View style={{ marginHorizontal: -spacing.m }}>
            <ArtBuehne glb={m.datei} silhouette={false} ruhig={ruhig} hoehe={360} melden={setStatus} />
          </View>
          <View style={[stile.kasten, { borderColor: status.startsWith('Fehler') ? colors.warn : colors.rune }]}>
            <Schrift art="etikett">Ladestatus</Schrift>
            <Schrift>{status}</Schrift>
          </View>
          <View style={stile.kasten}>
            <Schrift art="etikett">Was das Modell zeigt</Schrift>
            <Schrift>{m.zeigt}</Schrift>
            <Schrift art="klein">
              {m.dreiecke.toLocaleString('de-DE')} Dreiecke ·{' '}
              {m.animiert ? 'mit Animationen' : 'ohne Skelett – sanftes Atmen statt echter Bewegung'}
            </Schrift>
          </View>
          <View style={stile.kasten}>
            <Schrift art="etikett">Was hier getestet wird</Schrift>
            <Schrift art="klein">
              Laden aus dem App-Paket, LiDAR-Enthüllung mit echtem Modell, Bewegung und Bildrate. Ziehen dreht das
              Modell. Für das Reh brauchen wir später ein echtes Reh-Modell mit Skelett (siehe docs/3D-PIPELINE.md).
            </Schrift>
          </View>
          <Schrift art="klein" style={{ opacity: 0.8 }}>
            Modell: {namensnennung(m)}
          </Schrift>
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl },
  kasten: {
    borderWidth: 1.5,
    borderColor: colors.moss,
    borderRadius: radius.m,
    padding: spacing.m,
    backgroundColor: colors.forest,
    gap: 4,
  },
});
