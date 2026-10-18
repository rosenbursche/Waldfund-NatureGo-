import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { Abzeichen, RoteListeAbzeichen, SchutzAbzeichen, SeltenheitAbzeichen } from '@/components/ui/Abzeichen';
import { Kapitelkopf } from '@/components/ui/Kapitelkopf';
import { Kennzahl } from '@/components/ui/Kennzahl';
import { Schalter } from '@/components/ui/Schalter';
import { Sektion } from '@/components/ui/Sektion';
import { GiftWappen, RoteListeWappen, SchutzWappen, SeltenheitWappen, WildWertWappen } from '@/components/ui/Wappen';
import { Zierlinie } from '@/components/ui/Zierlinie';
import { colors, spacing } from '@/theme/theme';

/**
 * Übersicht aller festen Bausteine (Designsystem) mit Beispielen von der Reh-Seite.
 * Erreichbar über Einstellungen → Darstellung. Beschreibung: docs/DESIGNSYSTEM.md.
 */
const FARBEN: { name: string; farbe: string }[] = [
  { name: 'Nacht', farbe: colors.night },
  { name: 'Tiefgrün', farbe: colors.forest },
  { name: 'Moos', farbe: colors.moss },
  { name: 'Mooslicht', farbe: colors.rune },
  { name: 'Nebel', farbe: colors.fog },
  { name: 'Laterne', farbe: colors.amber },
  { name: 'Sehr selten', farbe: colors.rare },
  { name: 'Legendär', farbe: colors.legend },
  { name: 'Warnung', farbe: colors.warn },
];

export default function Bausteine() {
  const [geschlecht, setGeschlecht] = useState<'bock' | 'ricke'>('bock');
  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett="Designsystem" titel="Bausteine" />

          <Sektion symbol="spiegel" titel="Farben">
            <View style={stile.farben}>
              {FARBEN.map((f) => (
                <View key={f.name} style={stile.farbe}>
                  <View style={[stile.klecks, { backgroundColor: f.farbe }]} />
                  <Schrift art="klein" style={{ fontSize: 12 }}>
                    {f.name}
                  </Schrift>
                </View>
              ))}
            </View>
          </Sektion>

          <Sektion symbol="buch" titel="Schrift">
            <Schrift art="titel">Wildfund</Schrift>
            <Schrift art="ueberschrift">Überschrift</Schrift>
            <Schrift>Text in Alegreya Sans: Das Reh ist der kleinste Hirsch in Deutschland.</Schrift>
            <Schrift art="notiz">Notiz: Kitz nie anfassen!</Schrift>
            <Schrift art="klein">Klein: Nebentext und Erklärungen</Schrift>
            <Schrift art="etikett">Etikett · Säugetiere</Schrift>
          </Sektion>

          <Sektion symbol="geweih" titel="Kapitelkopf">
            <Kapitelkopf etikett="Hirsche" titel="Reh" unter="Capreolus capreolus" groesse="gross" />
            <Zierlinie />
            <Kapitelkopf etikett="Abschnitt" titel="Ein Jahr" />
          </Sektion>

          <Sektion symbol="schild" titel="Abzeichen">
            <View style={stile.reihe}>
              <SeltenheitAbzeichen stufe={1} />
              <SeltenheitAbzeichen stufe={2} />
              <SeltenheitAbzeichen stufe={3} />
              <SeltenheitAbzeichen stufe={4} />
            </View>
            <View style={stile.reihe}>
              <SeltenheitAbzeichen stufe={2} punkte />
              <SchutzAbzeichen schutz={1} />
              <SchutzAbzeichen schutz={2} />
            </View>
            <View style={stile.reihe}>
              <RoteListeAbzeichen stufe="V" />
              <RoteListeAbzeichen stufe="2" />
            </View>
            <View style={stile.reihe}>
              <Abzeichen text="Gesammelt" farbe={colors.amber} art="voll" />
              <Abzeichen text="Neu" farbe={colors.rune} klein />
              <Abzeichen text="Giftig" farbe={colors.warn} klein />
            </View>
          </Sektion>

          <Sektion symbol="schild" titel="Wappen">
            <View style={stile.reihe}>
              <WildWertWappen wert={12} />
              <WildWertWappen wert={48} />
              <WildWertWappen wert={72} />
              <WildWertWappen wert={94} />
            </View>
            <View style={stile.reihe}>
              <SeltenheitWappen stufe={1} />
              <SeltenheitWappen stufe={2} />
              <SeltenheitWappen stufe={3} />
              <SeltenheitWappen stufe={4} />
            </View>
            <View style={stile.reihe}>
              <SchutzWappen schutz={1} />
              <SchutzWappen schutz={2} />
              <RoteListeWappen stufe="2" />
              <GiftWappen text="Sehr giftig" />
            </View>
          </Sektion>

          <Sektion symbol="lineal" titel="Kennzahlen">
            <View style={stile.reihe}>
              <Kennzahl wert="60–90" einheit="cm" etikett="Schulter" />
              <Kennzahl wert="15–30" einheit="kg" etikett="Gewicht" />
              <Kennzahl wert="12/48" etikett="Säugetiere" farbe={colors.rune} />
            </View>
          </Sektion>

          <Sektion symbol="herz" titel="Schalter" geste="tippen">
            <Schalter
              wahl={geschlecht}
              onWahl={setGeschlecht}
              optionen={[
                { wert: 'bock', symbol: 'geweih', name: 'Bock' },
                { wert: 'ricke', symbol: 'herz', name: 'Ricke' },
              ]}
            />
          </Sektion>

          <Sektion symbol="tippen" titel="Knöpfe">
            <Knopf titel="Fund aufnehmen" untertitel="Foto machen und bestimmen" symbol="lupe" onPress={() => {}} />
            <Knopf titel="Im Katalog ansehen" art="leise" onPress={() => {}} />
          </Sektion>

          <Sektion symbol="wolf" titel="Gefahren" art="warnung" geste="tippen">
            <Schrift art="klein">Sektion in der Art „warnung“: für Gefahren und Sicherheits-Hinweise.</Schrift>
          </Sektion>
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, paddingBottom: spacing.xxl, gap: spacing.m },
  farben: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  farbe: { width: 72, gap: 4 },
  klecks: { height: 40, borderRadius: 4, borderWidth: 1, borderColor: `${colors.moon}22` },
  reihe: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, alignItems: 'center' },
});
