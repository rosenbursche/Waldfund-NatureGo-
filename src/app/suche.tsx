import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArtTaler } from '@/components/taler/ArtTaler';
import { Hintergrund } from '@/components/Hintergrund';
import { Icon } from '@/components/Icon';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { Abzeichen } from '@/components/ui/Abzeichen';
import { Sektion } from '@/components/ui/Sektion';
import { naturraumById } from '@/data/naturraeume';
import { KATEGORIEN, SELTENHEIT } from '@/data/spiel';
import {
  alleSuchEintraege,
  gefaehrlichste,
  istRaetsel,
  leichtZuFinden,
  seltensteInDerNaehe,
  sucheArten,
  zuletztEntdeckt,
  type SuchEintrag,
} from '@/logic/suche';
import { ArtGitter3D, type GitterZelle } from '@/scene/ArtGitter3D';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Suchen & Entdecken: Suchfeld, darunter die seltensten Arten im Naturraum (4 × 2 in 3D),
 * leicht zu findende Arten, die gefährlichsten Arten und die letzten Funde.
 * Jede Art zeigt Name, Wild-Wert und die Punkte, die sie beim Sammeln bringt.
 */
const SPALTEN = 4;
const BESCHRIFTUNG = 62; // Platz unter jedem 3D-Modell für Name und Abzeichen

export default function Suche() {
  const ruhig = useReducedMotion();
  const naturraumId = useEinstellungen((s) => s.naturraumId);
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;
  const gefunden = useSammlung((s) => s.gefunden);
  const [text, setText] = useState('');

  const alle = useMemo(() => alleSuchEintraege(naturraum), [naturraum]);
  const treffer = useMemo(() => sucheArten(text, alle, gefunden), [text, alle, gefunden]);
  const seltenste = useMemo(() => seltensteInDerNaehe(alle, naturraum), [alle, naturraum]);
  const leicht = useMemo(() => leichtZuFinden(alle, gefunden, naturraum), [alle, gefunden, naturraum]);
  const gefahr = useMemo(() => gefaehrlichste(alle, naturraum), [alle, naturraum]);
  const zuletzt = useMemo(() => zuletztEntdeckt(alle, gefunden), [alle, gefunden]);

  const oeffnen = (id: string) => router.push({ pathname: '/art/[id]', params: { id } });
  const suchtGerade = text.trim().length >= 2;

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={stile.inhalt} keyboardShouldPersistTaps="handled">
          <Kopfzeile etikett={naturraum ? `In ${naturraum.name}` : 'Alle Arten'} titel="Suchen & Entdecken" />

          <View style={stile.suchfeld}>
            <Icon name="lupe" groesse={20} farbe={colors.fog} />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Art suchen, z. B. Fuchs oder Amanita"
              placeholderTextColor={`${colors.fog}99`}
              style={stile.eingabe}
              autoCorrect={false}
              returnKeyType="search"
              accessibilityLabel="Art suchen"
            />
            {text.length > 0 && (
              <Pressable
                onPress={() => setText('')}
                accessibilityRole="button"
                accessibilityLabel="Suche leeren"
                hitSlop={8}
              >
                <Schrift style={{ color: colors.fog, fontSize: 18 }}>✕</Schrift>
              </Pressable>
            )}
          </View>

          {suchtGerade ? (
            <Sektion symbol="karte" titel="Treffer" rechts={<Abzeichen text={`${treffer.length}`} klein />}>
              {treffer.length === 0 ? (
                <Schrift art="notiz">
                  Nichts gefunden. Seltene Arten, die du noch nicht entdeckt hast, bleiben ein Rätsel – auch in der
                  Suche.
                </Schrift>
              ) : (
                treffer.map((e) => <Zeile key={e.id} e={e} gefunden={gefunden} onPress={() => oeffnen(e.id)} />)
              )}
            </Sektion>
          ) : (
            <>
              <Sektion symbol="auge" titel="Die Seltensten" geste="tippen">
                <Schrift art="notiz">Die Arten mit dem höchsten Wild-Wert in deinem Naturraum.</Schrift>
                <Raster3D eintraege={seltenste} gefunden={gefunden} ruhig={ruhig} onPress={oeffnen} />
              </Sektion>

              {leicht.length > 0 && (
                <Sektion symbol="tritt" titel="Leicht zu finden">
                  <Schrift art="notiz">
                    Häufig in deiner Nähe und noch nicht in deiner Sammlung – ein guter Anfang.
                  </Schrift>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stile.reihe}>
                    {leicht.map((e) => (
                      <Karte key={e.id} e={e} gefunden={gefunden} onPress={() => oeffnen(e.id)} />
                    ))}
                  </ScrollView>
                </Sektion>
              )}

              {gefahr.length > 0 && (
                <Sektion symbol="stopp" titel="Gefährlich & tödlich" art="warnung" geste="tippen">
                  <Schrift art="notiz">
                    Die gefährlichsten Arten in deinem Naturraum. Nicht anfassen, nicht essen – nur fotografieren.
                  </Schrift>
                  {gefahr.map((e, i) => (
                    <Zeile key={e.id} e={e} gefunden={gefunden} rang={i + 1} onPress={() => oeffnen(e.id)} />
                  ))}
                </Sektion>
              )}

              {zuletzt.length > 0 && (
                <Sektion symbol="buch" titel="Zuletzt entdeckt">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stile.reihe}>
                    {zuletzt.map((e) => (
                      <Karte key={e.id} e={e} gefunden={gefunden} onPress={() => oeffnen(e.id)} />
                    ))}
                  </ScrollView>
                </Sektion>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

/** Wild-Wert und Punkte als zwei kleine Abzeichen */
function Werte({ e, untereinander }: { e: SuchEintrag; untereinander?: boolean }) {
  const s = SELTENHEIT[e.seltenheit];
  return (
    <View style={[stile.werte, untereinander && { flexDirection: 'column', alignItems: 'center' }]}>
      <Abzeichen text={`Wild ${e.wildWert}`} farbe={colors.moon} klein />
      <Abzeichen text={`${e.punkte} AP`} farbe={s.farbe} leuchten={e.seltenheit === 4} klein />
    </View>
  );
}

/** Name – bei noch nicht gefundenen Mystery-Arten ein Rätsel (gefährliche Arten immer mit Namen) */
function anzeigeName(e: SuchEintrag, gefunden: Record<string, unknown>): string {
  return istRaetsel(e, gefunden) && !e.gefahr ? '???' : e.name;
}

/** 4 × 2 Arten als 3D-Modelle, darunter Name, Wild-Wert und Punkte */
function Raster3D({
  eintraege,
  gefunden,
  ruhig,
  onPress,
}: {
  eintraege: SuchEintrag[];
  gefunden: Record<string, unknown>;
  ruhig: boolean;
  onPress: (id: string) => void;
}) {
  const [breite, setBreite] = useState(0);
  const zelleB = breite / SPALTEN;
  const modellH = zelleB * 0.95;
  const reihen = Math.ceil(eintraege.length / SPALTEN);
  const hoehe = reihen * (modellH + BESCHRIFTUNG);
  const zellen: GitterZelle[] = eintraege.map((e, i) => ({
    id: e.id,
    x: (i % SPALTEN) * zelleB + zelleB / 2,
    y: Math.floor(i / SPALTEN) * (modellH + BESCHRIFTUNG) + modellH / 2,
    groesse: zelleB * 0.9,
    stil: e.id in gefunden ? 'farbe' : 'silhouette',
    farbe: SELTENHEIT[e.seltenheit].farbe,
  }));
  return (
    <View style={{ height: hoehe || 1 }} onLayout={(ev) => setBreite(ev.nativeEvent.layout.width)}>
      <ArtGitter3D zellen={zellen} breite={breite} hoehe={hoehe} ruhig={ruhig} />
      <View style={stile.gitter}>
        {eintraege.map((e) => (
          <Pressable
            key={e.id}
            onPress={() => onPress(e.id)}
            accessibilityRole="button"
            accessibilityLabel={`${anzeigeName(e, gefunden)}, Wild-Wert ${e.wildWert}, ${e.punkte} Punkte`}
            style={({ pressed }) => [{ width: zelleB, height: modellH + BESCHRIFTUNG }, pressed && { opacity: 0.6 }]}
          >
            <View style={{ height: modellH }} />
            <Schrift style={stile.gitterName} numberOfLines={1} adjustsFontSizeToFit>
              {anzeigeName(e, gefunden)}
            </Schrift>
            <Werte e={e} untereinander />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/** Kleine Karte mit 2D-Miniatur (für waagerechte Reihen) */
function Karte({ e, gefunden, onPress }: { e: SuchEintrag; gefunden: Record<string, unknown>; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${anzeigeName(e, gefunden)}, Wild-Wert ${e.wildWert}, ${e.punkte} Punkte`}
      style={({ pressed }) => [stile.karte, pressed && { opacity: 0.6 }]}
    >
      <ArtTaler
        id={e.id}
        seltenheit={e.seltenheit}
        zustand={e.id in gefunden ? 'gefunden' : 'umriss'}
        groesse={67}
        modell={e.modell}
        baumModell={e.baumModell}
      />
      <Schrift style={stile.gitterName} numberOfLines={2}>
        {anzeigeName(e, gefunden)}
      </Schrift>
      <Werte e={e} untereinander />
    </Pressable>
  );
}

/** Zeile für Suchtreffer und Gefahren-Liste */
function Zeile({
  e,
  gefunden,
  rang,
  onPress,
}: {
  e: SuchEintrag;
  gefunden: Record<string, unknown>;
  rang?: number;
  onPress: () => void;
}) {
  const kat = KATEGORIEN.find((k) => k.id === e.kategorie);
  const raetsel = istRaetsel(e, gefunden) && !e.gefahr;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${anzeigeName(e, gefunden)}${e.gefahr ? `, ${e.gefahr}` : ''}, Wild-Wert ${e.wildWert}, ${e.punkte} Punkte`}
      style={({ pressed }) => [stile.zeile, pressed && { opacity: 0.6 }]}
    >
      {rang !== undefined && <Schrift style={stile.rang}>{rang}</Schrift>}
      <ArtTaler
        id={e.id}
        seltenheit={e.seltenheit}
        zustand={raetsel ? 'verborgen' : e.id in gefunden ? 'gefunden' : 'umriss'}
        groesse={58}
        modell={e.modell}
        baumModell={e.baumModell}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <Schrift style={stile.zeileName} numberOfLines={1}>
          {anzeigeName(e, gefunden)}
        </Schrift>
        <Schrift art="klein" numberOfLines={1} style={{ color: e.gefahr ? colors.warn : colors.fog }}>
          {e.gefahr ?? (raetsel ? 'Noch ein Rätsel' : e.lat)} · {kat?.name}
        </Schrift>
      </View>
      <Werte e={e} untereinander />
    </Pressable>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl },
  suchfeld: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingHorizontal: spacing.m,
    minHeight: 50,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.sektion,
  },
  eingabe: { flex: 1, color: colors.moon, fontFamily: fonts.body, fontSize: 17, paddingVertical: spacing.s },
  gitter: { flexDirection: 'row', flexWrap: 'wrap' },
  gitterName: {
    fontFamily: fonts.titelLeicht,
    fontSize: 11.5,
    lineHeight: 15,
    letterSpacing: 0.6,
    color: colors.moon,
    textAlign: 'center',
    marginBottom: 3,
  },
  werte: { flexDirection: 'row', gap: 4 },
  reihe: { gap: spacing.s, paddingRight: spacing.s },
  karte: {
    width: 104,
    alignItems: 'center',
    gap: 4,
    padding: spacing.s,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: `${colors.moss}AA`,
    backgroundColor: colors.night,
  },
  zeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.s + 2, paddingVertical: 4 },
  rang: { width: 18, fontFamily: fonts.titel, fontSize: 15, color: colors.warn, textAlign: 'center' },
  zeileName: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.moon },
});
