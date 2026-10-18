import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArtIcon } from '@/components/ArtIcon';
import { Fortschrittsanzeige } from '@/components/Fortschrittsanzeige';
import { Hintergrund } from '@/components/Hintergrund';
import { Icon } from '@/components/Icon';
import { Schrift } from '@/components/Schrift';
import type { KategorieId } from '@/data/artTypen';
import { naturraumById } from '@/data/naturraeume';
import { KATEGORIEN } from '@/data/spiel';
import type { Naturraum } from '@/data/typen';
import { huettenStufe, levelInfo } from '@/logic/fortschritt';
import { fortschrittDerKategorie, vitrinenArten } from '@/logic/katalog';
import { stimmungJetzt } from '@/logic/tageszeit';
import { DIORAMA_SZENEN } from '@/data/szenen';
import { Diorama } from '@/scene/Diorama';
import { Lichtung, RUNEN_POSITIONEN } from '@/scene/Lichtung';
import { FpsKanal, PunkteKanal, Steuerung, type BildschirmPunkt, type Ziel } from '@/scene/steuerZustand';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';
import { useGeladen } from '@/store/useGeladen';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Startseite: die 3D-Lichtung mit Hütte, heimischen Bäumen und Runensteinen.
 * Noch kein Naturraum gewählt → weiter zum Onboarding.
 */
export default function Start() {
  const geladen = useGeladen();
  const naturraumId = useEinstellungen((s) => s.naturraumId);

  if (!geladen) return <Hintergrund />;
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;
  if (!naturraum) return <Redirect href="/onboarding" />;
  return <LichtungScreen naturraum={naturraum} />;
}

function LichtungScreen({ naturraum }: { naturraum: Naturraum }) {
  const ruhig = useReducedMotion();
  const gefunden = useSammlung((s) => s.gefunden);
  const ap = useSammlung((s) => s.ap);
  const huette = huettenStufe(levelInfo(ap).level);
  const [steuer] = useState(() => new Steuerung());
  const [kanal] = useState(() => new PunkteKanal());
  const [fpsKanal] = useState(() => new FpsKanal());
  const leistungAnzeigen = useEinstellungen((s) => s.leistungAnzeigen);
  const diorama = useEinstellungen((s) => s.startSzene) === 'diorama';

  // Szene pausieren, solange eine andere Seite darüber liegt – spart Akku und Leistung
  const [aktiv, setAktiv] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setAktiv(true);
      steuer.zoomZurueck(); // nach dem Zurückkommen wieder die ganze Lichtung zeigen
      return () => setAktiv(false);
    }, [steuer]),
  );

  // Licht nach Uhrzeit, jede Minute neu berechnet
  const [stimmung, setStimmung] = useState(() => stimmungJetzt());
  useEffect(() => {
    const t = setInterval(() => setStimmung(stimmungJetzt()), 60_000);
    return () => clearInterval(t);
  }, []);

  const fortschritt = useMemo(() => {
    const f = {} as Record<KategorieId, { gefunden: number; gesamt: number; anteil: number }>;
    for (const k of KATEGORIEN) f[k.id] = fortschrittDerKategorie(k.id, gefunden, naturraum);
    return f;
  }, [gefunden, naturraum]);
  const vitrinen = useMemo(
    () =>
      Object.fromEntries(KATEGORIEN.map((k) => [k.id, vitrinenArten(k.id, gefunden, naturraum)])) as Record<
        KategorieId,
        string[]
      >,
    [gefunden, naturraum],
  );
  const anteile = useMemo(
    () => Object.fromEntries(KATEGORIEN.map((k) => [k.id, fortschritt[k.id].anteil])) as Record<KategorieId, number>,
    [fortschritt],
  );

  /** Runenstein gewählt: Kamera fliegt auf den Stein zu, dann geht es in die Kategorie hinein */
  function inKategorie(id: KategorieId) {
    if (steuer.zoomZiel) return; // läuft schon
    const stein = RUNEN_POSITIONEN.find((r) => r.id === id);
    const weiter = () => router.push({ pathname: '/katalog/[kategorie]', params: { kategorie: id } });
    if (ruhig || !stein || diorama) return weiter();
    steuer.zoomZu(stein.position);
    setTimeout(weiter, 650);
  }

  function onZiel(z: Ziel) {
    if (z.typ === 'baum' && z.id) router.push({ pathname: '/art/[id]', params: { id: z.id } });
    if (z.typ === 'kategorie' && z.id) inKategorie(z.id as KategorieId);
  }

  // Finger: ziehen dreht die Szene, kurz tippen wählt aus
  const gesten = useMemo(() => baueGesten(steuer), [steuer]);

  return (
    <View style={stile.flaeche}>
      {diorama ? (
        <Diorama
          szene={DIORAMA_SZENEN[0]}
          aktiv={aktiv}
          huette={huette}
          stimmung={stimmung}
          ruhig={ruhig}
          fortschritt={anteile}
          zaehler={fortschritt}
          onRune={inKategorie}
        />
      ) : (
        <>
          <GestureDetector gesture={gesten}>
            <View style={StyleSheet.absoluteFill} accessibilityLabel={`3D-Lichtung im Naturraum ${naturraum.name}`}>
              <Lichtung
                aktiv={aktiv}
                naturraum={naturraum}
                gefunden={gefunden}
                huette={huette}
                fortschritt={anteile}
                vitrinen={vitrinen}
                stimmung={stimmung}
                ruhig={ruhig}
                steuer={steuer}
                kanal={kanal}
                fps={fpsKanal}
                onZiel={onZiel}
              />
            </View>
          </GestureDetector>

          <RunenBeschriftung kanal={kanal} fortschritt={fortschritt} onWaehle={inKategorie} />
        </>
      )}
      {leistungAnzeigen && !diorama && <BildrateAnzeige kanal={fpsKanal} />}

      <SafeAreaView style={stile.oben} pointerEvents="box-none">
        <View style={{ flex: 1, gap: spacing.s }} pointerEvents="box-none">
          <Fortschrittsanzeige />
          <Schrift art="etikett" style={stile.schatten} pointerEvents="none">
            {naturraum.name} · {stimmung.name}
          </Schrift>
        </View>
        <Pressable
          onPress={() => router.push('/einstellungen')}
          accessibilityRole="button"
          accessibilityLabel="Einstellungen"
          hitSlop={8}
          style={({ pressed }) => [stile.rund, pressed && { opacity: 0.6 }]}
        >
          <Icon name="zahnrad" groesse={20} />
        </Pressable>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} style={stile.unten} pointerEvents="box-none">
        <Schrift art="notiz" style={[stile.zentriert, stile.schatten]} pointerEvents="none">
          {diorama ? 'Kippe das Handy · tippe einen Runenstein an' : 'Tippe einen Baum oder Runenstein an'}
        </Schrift>
        <View style={stile.knopfReihe}>
          {/* Alternative zur 3D-Szene: die Bäume der Lichtung als Liste (auch für Screenreader) */}
          <Pressable
            onPress={() => router.push({ pathname: '/katalog/[kategorie]', params: { kategorie: 'pflanzen' } })}
            accessibilityRole="button"
            accessibilityLabel="Bäume und Pflanzen der Lichtung als Liste"
            style={({ pressed }) => [stile.rundUnten, pressed && { opacity: 0.6 }]}
          >
            <ArtIcon name="tree" groesse={24} farbe={colors.rune} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/mystery')}
            accessibilityRole="button"
            accessibilityLabel="Mystery-Zone: die seltensten Arten"
            style={({ pressed }) => [stile.mystery, pressed && { opacity: 0.6 }]}
          >
            <Schrift style={stile.mysteryText}>M?</Schrift>
          </Pressable>
          <Pressable
            onPress={() => router.push('/tagebuch')}
            accessibilityRole="button"
            accessibilityLabel="Feldtagebuch"
            style={({ pressed }) => [stile.rundUnten, pressed && { opacity: 0.6 }]}
          >
            <ArtIcon name="leaf" groesse={22} farbe={colors.amber} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/**
 * Gesten außerhalb der Komponente gebaut: Die Funktionen laufen erst bei Berührung,
 * nicht beim Zeichnen – so ist der React-Compiler zufrieden.
 */
function baueGesten(steuer: Steuerung) {
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
}

/** Bildrate (Bilder pro Sekunde) – grün ab 55, sonst bernstein */
function BildrateAnzeige({ kanal }: { kanal: FpsKanal }) {
  const [fps, setFps] = useState<number | null>(null);
  useEffect(() => kanal.abonnieren(setFps), [kanal]);
  return (
    <View style={stile.fps} pointerEvents="none">
      <Schrift style={[stile.fpsText, { color: fps !== null && fps >= 55 ? colors.rune : colors.amber }]}>
        {fps === null ? '… fps' : `${fps} fps`}
      </Schrift>
    </View>
  );
}

/** Lesbare Beschriftungen über den Runensteinen – auch für Screenreader als Knöpfe nutzbar */
function RunenBeschriftung({
  kanal,
  fortschritt,
  onWaehle,
}: {
  kanal: PunkteKanal;
  onWaehle: (id: KategorieId) => void;
  fortschritt: Record<KategorieId, { gefunden: number; gesamt: number }>;
}) {
  const [punkte, setPunkte] = useState<BildschirmPunkt[]>([]);
  useEffect(() => kanal.abonnieren(setPunkte), [kanal]);

  return (
    <>
      {punkte.map((p) => {
        const k = KATEGORIEN.find((x) => x.id === p.id)!;
        const f = fortschritt[k.id];
        if (!p.sichtbar) return null;
        return (
          <Pressable
            key={p.id}
            onPress={() => onWaehle(k.id)}
            accessibilityRole="button"
            accessibilityLabel={`${k.name}: ${f.gefunden} von ${f.gesamt} gesammelt`}
            style={[stile.label, { left: p.x - 50, top: p.y - 34 }]}
          >
            <Schrift art="etikett" style={[stile.zentriert, { color: colors.rune }]}>
              {k.tag}
            </Schrift>
            <Schrift art="etikett" style={[stile.zentriert, { fontSize: 10 }]}>
              {f.gefunden}/{f.gesamt}
            </Schrift>
          </Pressable>
        );
      })}
    </>
  );
}

const stile = StyleSheet.create({
  flaeche: { flex: 1, backgroundColor: colors.night },
  oben: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.s,
  },
  unten: { position: 'absolute', bottom: spacing.m, left: 0, right: 0 },
  zentriert: { textAlign: 'center' },
  schatten: { textShadowColor: colors.night, textShadowRadius: 8 },
  knopfReihe: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.l,
    marginTop: spacing.s,
  },
  rundUnten: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: colors.moss,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fps: {
    position: 'absolute',
    top: 110,
    right: spacing.m,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.s,
    backgroundColor: colors.night,
    borderWidth: 1,
    borderColor: colors.moss,
  },
  fpsText: { fontFamily: fonts.etikett, fontSize: 12 },
  mystery: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.rare,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.rare,
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  mysteryText: { fontFamily: fonts.titel, fontSize: 20, color: colors.rare },
  rund: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.moss,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.s,
  },
  label: { position: 'absolute', width: 100, paddingVertical: 2, borderRadius: radius.s },
});
