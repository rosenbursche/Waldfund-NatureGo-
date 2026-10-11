import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { GefahrSektion } from '@/components/GefahrSektion';
import { Schrift } from '@/components/Schrift';
import { Stammbaum } from '@/components/Stammbaum';
import type { KategorieId } from '@/data/artTypen';
import { naturraumById } from '@/data/naturraeume';
import { KATEGORIEN } from '@/data/spiel';
import { fortschrittDerKategorie, gefahrEintraege, istVerborgen, stammbaumStufen } from '@/logic/katalog';
import { stimmungJetzt } from '@/logic/tageszeit';
import { KategorieWald } from '@/scene/KategorieWald';
import { Steuerung, type Ziel } from '@/scene/steuerZustand';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Katalog einer Kategorie – zwei Ansichten, umschaltbar:
 * - Wald: alle Arten als 3D-Figuren an ihrem natürlichen Platz (gefunden farbig, sonst grau mit Schloss)
 * - Stammbaum: Gruppen als handgezeichneter Baum, darunter die Mystery-Zone
 */
export default function Katalog() {
  const { kategorie } = useLocalSearchParams<{ kategorie: KategorieId }>();
  const naturraumId = useEinstellungen((s) => s.naturraumId);
  const ansicht = useEinstellungen((s) => s.katalogAnsicht);
  const setAnsicht = useEinstellungen((s) => s.setKatalogAnsicht);
  const gefunden = useSammlung((s) => s.gefunden);
  const kat = KATEGORIEN.find((k) => k.id === kategorie);
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;

  if (!kat) {
    return (
      <Hintergrund>
        <SafeAreaView style={stile.inhalt}>
          <Kopfzeile titel="Unbekannte Kategorie" />
        </SafeAreaView>
      </Hintergrund>
    );
  }

  const f = fortschrittDerKategorie(kat.id, gefunden, naturraum);

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={stile.kopf}>
          <Kopfzeile etikett={`Reich ${kat.tag} · ${f.gefunden}/${f.gesamt}`} titel={kat.name} />
          <Umschalter ansicht={ansicht} onWechsel={setAnsicht} />
        </View>
        {ansicht === 'wald' ? <WaldAnsicht kategorie={kat.id} /> : <StammbaumAnsicht kategorie={kat.id} />}
      </SafeAreaView>
    </Hintergrund>
  );
}

function Umschalter({
  ansicht,
  onWechsel,
}: {
  ansicht: 'wald' | 'stammbaum';
  onWechsel: (a: 'wald' | 'stammbaum') => void;
}) {
  const knopf = (a: 'wald' | 'stammbaum', text: string) => {
    const an = ansicht === a;
    return (
      <Pressable
        onPress={() => onWechsel(a)}
        accessibilityRole="tab"
        accessibilityState={{ selected: an }}
        accessibilityLabel={`Ansicht ${text}`}
        style={[stile.tab, an && stile.tabAn]}
      >
        <Schrift style={[stile.tabText, an && { color: colors.night }]}>{text}</Schrift>
      </Pressable>
    );
  };
  return (
    <View style={stile.umschalter} accessibilityRole="tablist">
      {knopf('wald', 'Wald')}
      {knopf('stammbaum', 'Stammbaum')}
    </View>
  );
}

/** 3D-Wald: Arten an ihrem Platz; Ziehen dreht, Tippen öffnet die Art */
function WaldAnsicht({ kategorie }: { kategorie: KategorieId }) {
  const ruhig = useReducedMotion();
  const naturraumId = useEinstellungen((s) => s.naturraumId);
  const gefunden = useSammlung((s) => s.gefunden);
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;
  const [steuer] = useState(() => new Steuerung());
  const [stimmung] = useState(() => stimmungJetzt());

  // Szene pausieren, wenn eine Artenseite darüber liegt
  const [aktiv, setAktiv] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setAktiv(true);
      return () => setAktiv(false);
    }, []),
  );

  const gesten = useMemo(() => {
    const ziehen = Gesture.Pan()
      .runOnJS(true)
      .onBegin(() => steuer.fingerAuf(true))
      .onChange((e) => steuer.ziehen(e.changeX, e.changeY))
      .onFinalize(() => steuer.fingerAuf(false));
    const tippen = Gesture.Tap()
      .runOnJS(true)
      .maxDuration(300)
      .onEnd((e, ok) => {
        if (ok) steuer.tippen(e.x, e.y);
      });
    return Gesture.Race(ziehen, tippen);
  }, [steuer]);

  function onZiel(z: Ziel) {
    if (z.typ === 'art' && z.id) router.push({ pathname: '/art/[id]', params: { id: z.id } });
  }

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={gesten}>
        <View
          style={StyleSheet.absoluteFill}
          accessibilityLabel="3D-Wald mit allen Arten dieser Kategorie. Für eine Liste wähle die Ansicht Stammbaum."
        >
          <KategorieWald
            kategorie={kategorie}
            naturraum={naturraum}
            gefunden={gefunden}
            stimmung={stimmung}
            ruhig={ruhig}
            aktiv={aktiv}
            steuer={steuer}
            onZiel={onZiel}
          />
        </View>
      </GestureDetector>
      <SafeAreaView edges={['bottom']} style={stile.legende} pointerEvents="none">
        <Schrift art="notiz" style={stile.schatten}>
          Tippe eine Art an
        </Schrift>
        <Schrift art="klein" style={stile.schatten}>
          Farbig: gefunden · Grau mit Schloss: noch zu entdecken
        </Schrift>
      </SafeAreaView>
    </View>
  );
}

/** Gefahren-Sektion bei Vögeln: ehrlich statt erfunden */
const LEER_TEXT: Partial<Record<KategorieId, string>> = {
  voegel:
    'Keine heimische Vogelart ist für Menschen gefährlich. Aber: Fass Vögel, Nester und tote Vögel nie an – sie können Krankheitserreger tragen. Und störe keine brütenden Vögel.',
};

/** Stammbaum nach Seltenheit, darunter die Sektion "Gefährlich & tödlich" */
function StammbaumAnsicht({ kategorie }: { kategorie: KategorieId }) {
  const naturraumId = useEinstellungen((s) => s.naturraumId);
  const gefunden = useSammlung((s) => s.gefunden);
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;
  const stufen = stammbaumStufen(kategorie, naturraum);
  const gefahr = gefahrEintraege(kategorie, naturraum);
  const verborgen = (id: string) => istVerborgen(id, gefunden);

  // Gruselige Animation, sobald die Gefahren-Sektion ins Bild scrollt (einmal pro Besuch)
  const [gefahrY, setGefahrY] = useState<number | null>(null);
  const [ausloeser, setAusloeser] = useState(0);
  const [hoehe, setHoehe] = useState(0);
  function beimScrollen(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const sichtbarBis = e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
    if (ausloeser === 0 && gefahrY !== null && sichtbarBis > gefahrY + 120) setAusloeser(1);
  }

  return (
    <ScrollView
      contentContainerStyle={stile.inhalt}
      onScroll={beimScrollen}
      scrollEventThrottle={100}
      onLayout={(e) => setHoehe(e.nativeEvent.layout.height)}
    >
      <Schrift art="klein" style={{ textAlign: 'center' }}>
        Je höher im Baum, desto seltener – und desto mehr Punkte.
      </Schrift>
      <Stammbaum stufen={stufen} gefunden={gefunden} verborgen={verborgen} />

      <View
        onLayout={(e) => {
          const y = e.nativeEvent.layout.y;
          setGefahrY(y);
          // passt die Sektion schon ohne Scrollen ins Bild? Dann gleich auslösen
          if (ausloeser === 0 && hoehe > 0 && y + 120 < hoehe) setAusloeser(1);
        }}
      >
        <GefahrSektion
          eintraege={gefahr}
          gefunden={gefunden}
          verborgen={verborgen}
          ausloeser={ausloeser}
          leerText={LEER_TEXT[kategorie]}
        />
      </View>

      <Knopf
        titel="Alle Mystery-Arten"
        untertitel="Die seltensten Arten aus allen vier Reichen"
        art="leise"
        onPress={() => router.push('/mystery')}
        style={{ marginTop: spacing.l }}
      />
    </ScrollView>
  );
}

const stile = StyleSheet.create({
  kopf: { paddingHorizontal: spacing.m, paddingTop: spacing.m, gap: spacing.s },
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl },
  umschalter: {
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 3,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.forest,
    marginBottom: spacing.s,
  },
  tab: {
    paddingHorizontal: spacing.l,
    paddingVertical: 7,
    borderRadius: radius.l,
    minWidth: 110,
    alignItems: 'center',
  },
  tabAn: { backgroundColor: colors.rune },
  tabText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.fog },
  legende: { position: 'absolute', left: 0, right: 0, bottom: spacing.m, alignItems: 'center', gap: 2 },
  schatten: { textAlign: 'center', textShadowColor: colors.night, textShadowRadius: 8 },
});
