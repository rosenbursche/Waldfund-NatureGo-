import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArtIcon } from '@/components/ArtIcon';
import { ArtTaler } from '@/components/taler/ArtTaler';
import { Hintergrund } from '@/components/Hintergrund';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { naturraumById } from '@/data/naturraeume';
import { KATEGORIEN, LEVEL_SCHWELLEN } from '@/data/spiel';
import { erfolgeListe, HUETTEN_NAME, huettenStufe, levelInfo } from '@/logic/fortschritt';
import { fortschrittDerKategorie, katalogEintrag } from '@/logic/katalog';
import { useEinstellungen } from '@/store/einstellungen';
import { echteFunde, useSammlung } from '@/store/sammlung';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/** Feldtagebuch: Level, Rang, Hütte, Serie, Erfolge und die letzten Funde */
export default function Tagebuch() {
  const { gefunden, ap, serie } = useSammlung();
  const naturraumId = useEinstellungen((s) => s.naturraumId);
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;
  const info = levelInfo(ap);
  const stufe = huettenStufe(info.level);
  const echt = echteFunde(gefunden);
  const echtAlsObjekt = Object.fromEntries([...echt].map((id) => [id, true]));
  const erfolge = erfolgeListe();
  const zuletzt = Object.entries(gefunden)
    .filter(([, f]) => !f.beispiel)
    .sort((a, b) => b[1].datum.localeCompare(a[1].datum))
    .slice(0, 12);

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett="Dein Fortschritt" titel="Feldtagebuch" />

          <View style={[stile.karte, { borderColor: colors.amber }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.m }}>
              <View style={stile.level}>
                <Schrift style={stile.levelZahl}>{info.level}</Schrift>
              </View>
              <View style={{ flex: 1 }}>
                <Schrift art="ueberschrift">{info.rang}</Schrift>
                <Schrift art="klein">
                  {ap} AP ·{' '}
                  {info.level < LEVEL_SCHWELLEN.length
                    ? `noch ${info.fehlend} AP bis Level ${info.level + 1}`
                    : 'höchstes Level erreicht'}
                </Schrift>
              </View>
            </View>
            <View style={stile.spur}>
              <View style={[stile.fuellung, { width: `${info.fortschritt * 100}%` }]} />
            </View>
            <View style={stile.zahlen}>
              <Zahl wert={`${echt.size}`} name="Arten gefunden" />
              <Zahl wert={serie > 0 ? `${serie}` : '–'} name="Tage in Folge" />
              <Zahl wert={HUETTEN_NAME[stufe]} name="Deine Hütte" klein />
            </View>
            <Schrift art="klein">
              {stufe < 3
                ? `Ab Level ${[3, 6, 9][stufe]} wird deine Hütte zum ${HUETTEN_NAME[(stufe + 1) as 1 | 2 | 3]}.`
                : 'Deine Hütte ist voll ausgebaut – eine Sternwarte mitten im Wald.'}{' '}
              Finde jeden Tag eine neue Art: Ab dem zweiten Tag gibt es 5 AP Serienbonus pro Tag (höchstens 50).
            </Schrift>
          </View>

          <Schrift art="ueberschrift" accessibilityRole="header">
            Reiche
          </Schrift>
          <View style={stile.reiche}>
            {KATEGORIEN.map((k) => {
              const f = fortschrittDerKategorie(k.id, echtAlsObjekt, naturraum);
              return (
                <Pressable
                  key={k.id}
                  onPress={() => router.push({ pathname: '/katalog/[kategorie]', params: { kategorie: k.id } })}
                  accessibilityRole="button"
                  accessibilityLabel={`${k.name}: ${f.gefunden} von ${f.gesamt}`}
                  style={stile.reich}
                >
                  <ArtIcon name={k.icon} groesse={26} farbe={colors.rune} />
                  <Schrift art="etikett">{k.tag}</Schrift>
                  <Schrift style={stile.reichZahl}>
                    {f.gefunden}/{f.gesamt}
                  </Schrift>
                </Pressable>
              );
            })}
          </View>

          <Schrift art="ueberschrift" accessibilityRole="header">
            Erfolge · {erfolge.filter((e) => e.erreicht(echt)).length}/{erfolge.length}
          </Schrift>
          <View style={stile.chips}>
            {erfolge.map((e) => {
              const ok = e.erreicht(echt);
              return (
                <View
                  key={e.id}
                  style={[stile.chip, ok ? stile.chipAn : null]}
                  accessible
                  accessibilityLabel={`${e.name}: ${ok ? 'erreicht' : 'noch offen'}`}
                >
                  <Schrift style={{ color: ok ? colors.amber : colors.moss }}>★</Schrift>
                  <Schrift art="klein" style={{ color: ok ? colors.moon : colors.fog }}>
                    {e.name}
                  </Schrift>
                </View>
              );
            })}
          </View>

          <Schrift art="ueberschrift" accessibilityRole="header">
            Zuletzt gefunden
          </Schrift>
          {zuletzt.length === 0 ? (
            <Schrift art="klein">Noch nichts gefunden. Raus in die Natur! (Beispielfunde zählen hier nicht.)</Schrift>
          ) : (
            <View style={stile.funde}>
              {zuletzt.map(([id, f]) => {
                const e = katalogEintrag(id);
                if (!e) return null;
                return (
                  <Pressable
                    key={id}
                    onPress={() => router.push({ pathname: '/art/[id]', params: { id } })}
                    accessibilityRole="button"
                    accessibilityLabel={e.name}
                    style={stile.fund}
                  >
                    {f.foto ? (
                      <View>
                        <Image source={{ uri: f.foto }} style={stile.fundBild} contentFit="cover" />
                        {/* der Taler der Art als Abzeichen auf dem eigenen Foto */}
                        <View style={stile.fundTaler}>
                          <ArtTaler id={id} seltenheit={e.seltenheit} zustand="gefunden" groesse={40} />
                        </View>
                      </View>
                    ) : (
                      <View style={[stile.fundBild, { alignItems: 'center', justifyContent: 'center' }]}>
                        <ArtTaler id={id} seltenheit={e.seltenheit} zustand="gefunden" groesse={72} />
                      </View>
                    )}
                    <Schrift art="klein" numberOfLines={1} style={{ textAlign: 'center', fontSize: 12 }}>
                      {e.name}
                    </Schrift>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

function Zahl({ wert, name, klein }: { wert: string; name: string; klein?: boolean }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Schrift style={[stile.zahl, klein && { fontSize: 16, lineHeight: 22 }]} numberOfLines={1} adjustsFontSizeToFit>
        {wert}
      </Schrift>
      <Schrift art="etikett" style={{ fontSize: 10, textAlign: 'center' }}>
        {name}
      </Schrift>
    </View>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl },
  karte: {
    borderWidth: 1.5,
    borderRadius: radius.m,
    padding: spacing.m,
    backgroundColor: colors.forest,
    gap: spacing.m,
  },
  level: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.amber,
    shadowOpacity: 0.6,
    shadowRadius: 14,
    backgroundColor: colors.night,
  },
  levelZahl: { fontFamily: fonts.titel, fontSize: 28, lineHeight: 34, color: colors.amber },
  spur: { height: 6, borderRadius: 3, backgroundColor: colors.night, overflow: 'hidden' },
  fuellung: { height: '100%', backgroundColor: colors.amber },
  zahlen: { flexDirection: 'row', gap: spacing.s },
  zahl: { fontFamily: fonts.titel, fontSize: 24, lineHeight: 30, color: colors.moon },
  reiche: { flexDirection: 'row', gap: spacing.s },
  reich: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.m - 4,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.forest,
  },
  reichZahl: { fontFamily: fonts.etikett, fontSize: 13, color: colors.moon },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: radius.l,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.moss,
  },
  chipAn: {
    borderStyle: 'solid',
    borderColor: colors.amber,
    shadowColor: colors.amber,
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  funde: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  fund: { width: '31%', gap: 4 },
  fundTaler: { position: 'absolute', right: -6, bottom: -8 },
  fundBild: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.m,
    backgroundColor: colors.forest,
    borderWidth: 1,
    borderColor: colors.moss,
  },
});
