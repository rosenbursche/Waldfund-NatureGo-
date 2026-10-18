import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { Stammbaum } from '@/components/Stammbaum';
import { Vignette } from '@/components/Vignette';
import type { KategorieId } from '@/data/artTypen';
import { naturraumById } from '@/data/naturraeume';
import { KATEGORIEN } from '@/data/spiel';
import { fortschrittDerKategorie, istVerborgen, lebensbaum } from '@/logic/katalog';
import { stimmungJetzt } from '@/logic/tageszeit';
import { KategorieWald } from '@/scene/KategorieWald';
import { Steuerung, type Ziel } from '@/scene/steuerZustand';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Katalog einer Kategorie – zwei Ansichten, umschaltbar:
 * - Wald: alle Arten als 3D-Figuren an ihrem natürlichen Platz (gefunden farbig, sonst grau mit Schloss)
 * - Stammbaum: mystischer Lebensbaum – Äste = Gruppen (aufklappbar), Sterne = Mystery, Wurzeln = Gefahr
 */
const INFO_WALD =
  'Tippe eine Art an. Im Lichtkegel: gefunden · Schatten mit Irrlicht: noch zu entdecken · rot glimmend: gefährlich.';
const INFO_STAMMBAUM =
  'Tippe einen Ast an – am Baum oder in der Liste darunter. Seine Zweige sind kleine Sammelsets, jedes mit einem Schatz. Die Sterne sind die legendären Arten.';

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
          <Kopfzeile
            etikett={`Reich ${kat.tag} · ${f.gefunden}/${f.gesamt}`}
            titel={kat.name}
            info={ansicht === 'wald' ? INFO_WALD : INFO_STAMMBAUM}
          />
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
  const [steuer] = useState(() => {
    const s = new Steuerung();
    s.winkel = 0.12; // Start mit Blick den Hohlweg entlang ins Licht
    return s;
  });
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
      <Vignette />
    </View>
  );
}

/** Gefahren-Sektion bei Vögeln: ehrlich statt erfunden */
const LEER_TEXT: Partial<Record<KategorieId, string>> = {
  voegel:
    'Keine heimische Vogelart ist für Menschen gefährlich. Aber: Fass Vögel, Nester und tote Vögel nie an – sie können Krankheitserreger tragen. Und störe keine brütenden Vögel.',
};

/** Stammbaum als Lebensbaum: Äste = Gruppen, Sterne = Mystery-Arten, Schattenwurzeln = Gefahr */
function StammbaumAnsicht({ kategorie }: { kategorie: KategorieId }) {
  const naturraumId = useEinstellungen((s) => s.naturraumId);
  const gefunden = useSammlung((s) => s.gefunden);
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;
  const baum = lebensbaum(kategorie, naturraum);
  const verborgen = (id: string) => istVerborgen(id, gefunden);
  const scroll = useRef<ScrollView>(null);
  const [baumY, setBaumY] = useState(0);

  return (
    <ScrollView ref={scroll} contentContainerStyle={stile.inhalt}>
      <View onLayout={(e) => setBaumY(e.nativeEvent.layout.y)}>
        <Stammbaum
          kategorie={kategorie}
          baum={baum}
          gefunden={gefunden}
          verborgen={verborgen}
          leerText={LEER_TEXT[kategorie]}
          // geöffneten Ast ins Bild holen – das untere Stück des Baums bleibt sichtbar
          onBereich={(y) => scroll.current?.scrollTo({ y: Math.max(0, baumY + y - 220), animated: true })}
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
});
