import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { artById } from '@/data/arten';
import { SELTENHEIT } from '@/data/spiel';
import { ArtTaler } from '@/components/taler/ArtTaler';
import { WappenReihe } from '@/components/ui/Wappen';
import { Info } from '@/components/ui/Info';
import { HUETTEN_NAME, levelInfo, tagesKey, type Belohnung } from '@/logic/fortschritt';
import { fotoAufnehmen, fotoBehalten, type FotoQuelle } from '@/logic/foto';
import { istVerborgen, katalogEintrag } from '@/logic/katalog';
import { erkennungsServerUrl } from '@/logic/konfiguration';
import { echtPruefbar, ErkennungsFehler, validatePhoto, type Pruefergebnis, type Quelle } from '@/logic/validierung';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Sammel-Ablauf: Foto machen → Bild prüfen → Art freischalten.
 * Die Prüfung läuft über validatePhoto(): Pflanzen auf Wunsch echt (Pl@ntNet über den
 * eigenen Server), alles andere im Demo-Modus – das wird ehrlich angezeigt.
 */
type Schritt =
  | { art: 'start'; meldung?: string; zuEinstellungen?: boolean }
  | { art: 'pruefen'; foto: string; zeilen: string[] }
  | { art: 'erfolg'; foto: string; belohnung: Belohnung; quelle: Quelle }
  | { art: 'nicht'; foto: string; ergebnis: Exclude<Pruefergebnis, { status: 'treffer' }> };

const PAUSE = 650; // Zeit zwischen den Prüfschritten, wie im Prototyp

export default function Sammeln() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eintrag = katalogEintrag(id);
  const art = artById[id];
  const { pruefModus, demoFehlschlag, geraetId } = useEinstellungen();
  const serverUrl = erkennungsServerUrl();
  const sammeln = useSammlung((s) => s.sammeln);
  const verborgen = useSammlung((s) => istVerborgen(id, s.gefunden));
  const [schritt, setSchritt] = useState<Schritt>({ art: 'start' });

  if (!eintrag) return null;
  const s = SELTENHEIT[eintrag.seltenheit];
  const kategorie = art?.kategorie ?? 'pflanzen';
  // Wird dieses Foto wirklich geprüft? Nur Pflanzen, nur wenn eingeschaltet und Server eingerichtet
  const echt = pruefModus === 'echt' && !!serverUrl && echtPruefbar(kategorie);

  async function los(quelle: FotoQuelle) {
    try {
      const foto = await fotoAufnehmen(quelle);
      if (foto.status === 'abgebrochen') return;
      if (foto.status === 'keineErlaubnis') {
        setSchritt({
          art: 'start',
          zuEinstellungen: true,
          meldung:
            quelle === 'kamera'
              ? 'Wildfund darf die Kamera noch nicht benutzen. Du kannst das in den Einstellungen deines Handys erlauben.'
              : 'Wildfund darf deine Fotos noch nicht öffnen. Du kannst das in den Einstellungen deines Handys erlauben.',
        });
        return;
      }
      await pruefen(foto.uri);
    } catch {
      setSchritt({ art: 'start', meldung: 'Beim Foto ist etwas schiefgelaufen. Versuch es bitte noch einmal.' });
    }
  }

  async function pruefen(foto: string) {
    const zeilen = ['Bild wird geprüft …'];
    setSchritt({ art: 'pruefen', foto, zeilen: [...zeilen] });
    const warten = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

    // Prüfung und Anzeige der Schritte laufen gleichzeitig
    const ergebnisPromise = validatePhoto(
      { uri: foto },
      { id, name: eintrag!.name, lat: eintrag!.lat, kategorie },
      {
        modus: echt ? 'echt' : 'demo',
        demo: { fehlschlagQuote: demoFehlschlag ? 0.4 : 0 },
        server: serverUrl ? { url: serverUrl, geraetId } : undefined,
      },
    );
    await warten(PAUSE);
    zeilen.push(echt ? 'Pl@ntNet vergleicht mit Pflanzenfotos …' : 'Merkmale werden verglichen …');
    setSchritt({ art: 'pruefen', foto, zeilen: [...zeilen] });
    let ergebnis: Awaited<typeof ergebnisPromise>;
    try {
      ergebnis = await ergebnisPromise;
    } catch (e) {
      const text =
        e instanceof ErkennungsFehler
          ? e.message
          : 'Bei der Prüfung ist etwas schiefgelaufen. Versuch es bitte noch einmal.';
      setSchritt({ art: 'start', meldung: text });
      return;
    }
    await warten(PAUSE);

    if (ergebnis.status === 'treffer') {
      zeilen.push(`Treffer: ${eintrag!.lat} ✓`);
      setSchritt({ art: 'pruefen', foto, zeilen: [...zeilen] });
      await warten(PAUSE);
      zeilen.push(ergebnis.quelle === 'plantnet' ? 'Geprüft mit Pl@ntNet ✓' : 'Foto bleibt auf deinem Handy ✓');
      setSchritt({ art: 'pruefen', foto, zeilen: [...zeilen] });
      await warten(PAUSE);
      const dauerhaft = await fotoBehalten(foto, id);
      const belohnung = sammeln(id, { datum: tagesKey(new Date()), foto: dauerhaft, geprueft: ergebnis.quelle });
      setSchritt({ art: 'erfolg', foto: dauerhaft, belohnung, quelle: ergebnis.quelle });
    } else {
      zeilen.push('Keine sichere Übereinstimmung');
      setSchritt({ art: 'pruefen', foto, zeilen: [...zeilen] });
      await warten(PAUSE);
      setSchritt({ art: 'nicht', foto, ergebnis });
    }
  }

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          {schritt.art === 'start' && (
            <>
              <Kopfzeile
                etikett="Sammeln"
                titel={verborgen ? 'Mystery-Art' : eintrag.name}
                info="Fotografiere die Art dort, wo sie lebt. Danach prüft Wildfund, ob auf dem Foto wirklich diese Art zu sehen ist."
              />
              <View style={[stile.kasten, { borderColor: (art?.schutz ?? 0) > 0 ? colors.legend : colors.moss }]}>
                <Schrift art="klein">
                  {(art?.schutz ?? 0) === 2 ? 'Streng geschützt · Abstand halten' : 'Nur fotografieren'} · Auf dem Weg
                  bleiben
                  {kategorie === 'pilze' ? ' · Pilze nie essen' : ''}
                </Schrift>
              </View>
              {schritt.meldung && (
                <View style={[stile.kasten, { borderColor: colors.amber }]}>
                  <Schrift>{schritt.meldung}</Schrift>
                  {schritt.zuEinstellungen && (
                    <Knopf titel="Handy-Einstellungen öffnen" art="leise" onPress={() => Linking.openSettings()} />
                  )}
                </View>
              )}
              <Knopf titel="Kamera öffnen" symbol="pfeil" onPress={() => los('kamera')} />
              <Knopf titel="Foto aus der Galerie" art="leise" onPress={() => los('galerie')} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.s }}>
                <Schrift art="klein" style={{ opacity: 0.75 }}>
                  {echt ? 'Echte Prüfung · Pl@ntNet' : 'Demo-Prüfung'}
                </Schrift>
                <Info
                  titel="Prüfung"
                  text={`${
                    echt
                      ? 'Echte Prüfung: Das Foto wird über den Wildfund-Server an Pl@ntNet geschickt und dort nicht gespeichert.'
                      : pruefModus === 'echt' && !echtPruefbar(kategorie)
                        ? 'Für diese Gruppe gibt es noch keine echte Erkennung – die Prüfung wird simuliert.'
                        : 'Demo-Modus: Die Bilderkennung wird simuliert.'
                  } Deine Fotos bleiben auf deinem Handy, Standortdaten werden aus dem Bild entfernt.`}
                />
              </View>
            </>
          )}

          {schritt.art === 'pruefen' && (
            <View style={stile.mitte}>
              <Schrift art="etikett">Prüfung läuft</Schrift>
              <Scanbild foto={schritt.foto} />
              <View style={{ minHeight: 120, gap: 4 }} accessibilityLiveRegion="polite">
                {schritt.zeilen.map((z) => (
                  <Animated.View key={z} entering={FadeIn.duration(300)}>
                    <Schrift style={stile.zeile}>{z}</Schrift>
                  </Animated.View>
                ))}
              </View>
            </View>
          )}

          {schritt.art === 'erfolg' && (
            <View style={stile.mitte}>
              <Leuchtkreis foto={schritt.foto} farbe={s.farbe} />
              <Animated.View entering={FadeInDown.delay(300).duration(600)} style={{ alignItems: 'center', gap: 6 }}>
                <Schrift style={[stile.stufe, { color: s.farbe }]}>
                  {s.name} · {schritt.belohnung.neu ? 'Neu in deiner Sammlung' : 'Neues Foto gespeichert'}
                </Schrift>
                <Schrift art="titel" style={{ textAlign: 'center' }} accessibilityRole="header">
                  {eintrag.name}
                </Schrift>
              </Animated.View>
              {/* der Taler der Art: jetzt in Farbe freigeschaltet */}
              <Animated.View entering={FadeInDown.delay(700).duration(700)}>
                <ArtTaler
                  id={id}
                  seltenheit={eintrag.seltenheit}
                  zustand="gefunden"
                  groesse={120}
                  modell={art?.modell}
                  baumModell={eintrag.baumModell}
                />
              </Animated.View>
              {/* Wappen der Art als Belohnung: Wild-Wert, Seltenheit, Schutz … */}
              <Animated.View entering={FadeInDown.delay(700).duration(600)}>
                <WappenReihe id={id} seltenheit={eintrag.seltenheit} art={art} groesse={54} />
              </Animated.View>
              <BelohnungsText b={schritt.belohnung} />
              <Schrift art="klein" style={{ textAlign: 'center', opacity: 0.75 }}>
                {schritt.quelle === 'plantnet'
                  ? 'The image-based plant species identification service used, is based on the Pl@ntNet recognition API.'
                  : 'Simulierte Prüfung (Demo) – noch nicht echt geprüft.'}
              </Schrift>
              <Knopf
                titel="Art ansehen"
                symbol="pfeil"
                onPress={() => router.back()}
                style={{ alignSelf: 'stretch' }}
              />
            </View>
          )}

          {schritt.art === 'nicht' && (
            <View style={{ gap: spacing.m }}>
              <Image source={{ uri: schritt.foto }} style={stile.kleinesFoto} contentFit="cover" />
              <Schrift art="ueberschrift" accessibilityRole="header">
                {schritt.ergebnis.status === 'andereArt'
                  ? `Das sieht eher nach ${schritt.ergebnis.erkannt.name ?? schritt.ergebnis.erkannt.lat} aus.`
                  : 'Hmm, da bin ich mir noch nicht sicher.'}
              </Schrift>
              <Schrift>Kein Problem – mit diesen Tipps klappt es beim nächsten Foto bestimmt:</Schrift>
              <View style={[stile.kasten, { borderColor: colors.rune }]}>
                {schritt.ergebnis.tipps.map((t) => (
                  <Schrift key={t} art="klein" style={{ color: colors.moon }}>
                    • {t}
                  </Schrift>
                ))}
              </View>
              <Knopf titel="Noch einmal versuchen" symbol="pfeil" onPress={() => setSchritt({ art: 'start' })} />
              <Knopf titel="Später" art="leise" onPress={() => router.back()} />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

/** Punkte (zählen hoch), Serienbonus, Level-up, wachsende Hütte und neue Erfolge */
function BelohnungsText({ b }: { b: Belohnung }) {
  const ruhig = useReducedMotion();
  const gesamt = b.punkte + b.bonus;
  const [angezeigt, setAngezeigt] = useState(ruhig ? gesamt : 0);
  useEffect(() => {
    if (ruhig || gesamt === 0) return;
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 900);
      setAngezeigt(Math.round(gesamt * p));
      if (p >= 1) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [gesamt, ruhig]);

  if (!b.neu) {
    return (
      <Schrift art="klein" style={{ textAlign: 'center' }}>
        Foto aktualisiert · keine neuen Punkte
      </Schrift>
    );
  }
  return (
    <View style={{ alignItems: 'center', gap: spacing.s }} accessibilityLiveRegion="polite">
      <Animated.View entering={ZoomIn.delay(600).duration(500)}>
        <Schrift style={stile.punkte} accessibilityLabel={`plus ${gesamt} Aktivitätspunkte`}>
          +{angezeigt} AP
        </Schrift>
      </Animated.View>
      {b.bonus > 0 && (
        <Schrift art="klein">
          inklusive {b.bonus} AP Serienbonus ({b.serie} Tage in Folge)
        </Schrift>
      )}
      {b.levelNachher > b.levelVorher && (
        <Animated.View entering={FadeInDown.delay(1100).duration(600)}>
          <Schrift art="notiz" style={{ fontSize: 22, textAlign: 'center' }}>
            Level {b.levelNachher} erreicht: {levelInfo(b.stand.ap).rang}!
          </Schrift>
        </Animated.View>
      )}
      {b.huetteNachher > b.huetteVorher && (
        <Animated.View entering={FadeInDown.delay(1400).duration(600)}>
          <Schrift art="notiz" style={{ color: colors.rune, textAlign: 'center' }}>
            Deine Hütte ist gewachsen: {HUETTEN_NAME[b.huetteNachher]}
          </Schrift>
        </Animated.View>
      )}
      {b.neueErfolge.map((e, i) => (
        <Animated.View key={e.id} entering={FadeInDown.delay(1600 + i * 200).duration(500)} style={stile.erfolg}>
          <Schrift style={{ color: colors.amber }}>★</Schrift>
          <Schrift art="klein" style={{ color: colors.moon }}>
            Neuer Erfolg: {e.name}
          </Schrift>
        </Animated.View>
      ))}
    </View>
  );
}

/** Foto mit wandernder Scan-Linie (bei "Bewegung reduzieren" steht sie still) */
function Scanbild({ foto }: { foto: string }) {
  const ruhig = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (!ruhig) t.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [ruhig, t]);
  const linie = useAnimatedStyle(() => ({ top: `${6 + t.value * 86}%` }));
  return (
    <View style={stile.scan}>
      <Image source={{ uri: foto }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <Animated.View style={[stile.scanLinie, ruhig ? { top: '50%' } : linie]} />
    </View>
  );
}

/** Belohnung: Foto im leuchtenden Kreis mit langsam drehendem Runenring */
function Leuchtkreis({ foto, farbe }: { foto: string; farbe: string }) {
  const ruhig = useReducedMotion();
  const dreh = useSharedValue(0);
  useEffect(() => {
    if (!ruhig) dreh.value = withRepeat(withTiming(360, { duration: 9000, easing: Easing.linear }), -1);
  }, [ruhig, dreh]);
  const ring = useAnimatedStyle(() => ({ transform: [{ rotate: `${dreh.value}deg` }] }));
  return (
    <Animated.View entering={ZoomIn.duration(700)} style={stile.kreisPlatz}>
      <Animated.View style={[stile.ring, { borderColor: farbe, shadowColor: farbe }, ring]} />
      <Image source={{ uri: foto }} style={stile.kreisFoto} contentFit="cover" />
    </Animated.View>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl, flexGrow: 1 },
  mitte: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.l, paddingTop: spacing.xl },
  kasten: { borderWidth: 1.5, borderRadius: radius.m, padding: spacing.m, backgroundColor: colors.forest, gap: 6 },
  scan: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.l,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.rune,
    backgroundColor: colors.forest,
  },
  scanLinie: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.rune,
    shadowColor: colors.rune,
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  zeile: { fontFamily: fonts.etikett, fontSize: 14, color: colors.fog },
  stufe: { fontFamily: fonts.etikett, fontSize: 13, letterSpacing: 1.2, textTransform: 'uppercase' },
  kreisPlatz: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderStyle: 'dashed',
    shadowOpacity: 0.9,
    shadowRadius: 18,
  },
  kreisFoto: { width: 160, height: 160, borderRadius: 80 },
  punkte: {
    fontFamily: fonts.etikett,
    fontSize: 32,
    color: colors.amber,
    textShadowColor: colors.amber,
    textShadowRadius: 12,
  },
  erfolg: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.l,
    borderWidth: 1.5,
    borderColor: colors.amber,
  },
  kleinesFoto: { width: '100%', aspectRatio: 1.4, borderRadius: radius.m },
});
