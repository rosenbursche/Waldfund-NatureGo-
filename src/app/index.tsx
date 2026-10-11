import { Redirect, router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Schrift } from '@/components/Schrift';
import { WaldStreifen } from '@/components/WaldStreifen';
import { naturraumById } from '@/data/naturraeume';
import { getHeimischeBaeume } from '@/logic/regelEngine';
import { useEinstellungen } from '@/store/einstellungen';
import { useGeladen } from '@/store/useGeladen';
import { spacing } from '@/theme/theme';

/**
 * Startseite.
 * - Noch kein Naturraum gewählt → weiter zum Onboarding.
 * - Sonst: vorläufige Lichtung. In Phase 3 kommt hier die 3D-Szene mit Hütte hin.
 */
export default function Start() {
  const geladen = useGeladen();
  const naturraumId = useEinstellungen((s) => s.naturraumId);

  if (!geladen) return <Hintergrund />;

  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;
  if (!naturraum) return <Redirect href="/onboarding" />;

  const baeume = getHeimischeBaeume(naturraum);

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Schrift art="etikett">Deine Lichtung</Schrift>
          <Schrift art="titel">{naturraum.name}</Schrift>
          <Schrift art="notiz">Hier wird bald deine Waldhütte stehen …</Schrift>

          <View style={{ marginVertical: spacing.l }}>
            <WaldStreifen baeume={baeume} />
          </View>

          <Schrift art="klein">
            {baeume.length} heimische Baumarten warten darauf, von dir gefunden zu werden. Die 3D-Lichtung folgt in
            Phase 3.
          </Schrift>

          <Knopf
            titel="Einstellungen"
            untertitel="Naturraum ändern, Datenquellen"
            symbol="zahnrad"
            art="leise"
            onPress={() => router.push('/einstellungen')}
            style={{ marginTop: spacing.l }}
          />
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, paddingTop: spacing.xl, gap: spacing.s },
});
