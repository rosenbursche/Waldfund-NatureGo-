import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BaumSilhouette } from '@/components/BaumSilhouette';
import { Hintergrund } from '@/components/Hintergrund';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { artById } from '@/data/arten';
import { baumById } from '@/data/baumarten';
import { naturraumById } from '@/data/naturraeume';
import { istVerborgen } from '@/logic/katalog';
import { herkunftsText } from '@/logic/regelEngine';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';
import { spacing } from '@/theme/theme';

/**
 * Artenseite – vorläufige Version.
 * In Phase 5 kommen 3D-Modell, Steckbrief, Lehrbuch-Zeichnung, Karte und Schutzstatus dazu.
 */
export default function ArtSeite() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const naturraumId = useEinstellungen((s) => s.naturraumId);
  const sammlung = useSammlung((s) => s.gefunden);
  const gefunden = id in sammlung;
  // Sehr seltene Arten bleiben ein Rätsel, bis man sie gefunden hat
  const verborgen = istVerborgen(id, sammlung);

  const art = artById[id];
  const baum = baumById[id];
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;
  const name = verborgen ? 'Mystery-Art' : (art?.name ?? baum?.name ?? 'Unbekannte Art');
  const lat = verborgen ? 'Species incognita' : (art?.lat ?? baum?.lat ?? '');

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett={gefunden ? 'Gesammelt' : 'Noch nicht gefunden'} titel={name} />
          {baum && (
            <View style={stile.bild}>
              <BaumSilhouette modell={baum.modell} breite={140} dunkel={!gefunden} />
            </View>
          )}
          <Schrift art="klein" style={{ fontStyle: 'italic' }}>
            {lat}
          </Schrift>
          {baum && naturraum && <Schrift art="notiz">{herkunftsText(baum, naturraum)}</Schrift>}
          {verborgen && art?.raetsel && <Schrift art="notiz">„{art.raetsel}“</Schrift>}
          {art && !verborgen && <Schrift>{art.wusstestDu}</Schrift>}
          <Schrift art="klein" style={{ marginTop: spacing.l }}>
            Die vollständige Artenseite mit 3D-Modell, Steckbrief, Lehrbuch-Zeichnung und Karte folgt in Phase 5.
          </Schrift>
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m },
  bild: { alignItems: 'center', marginVertical: spacing.m },
});
