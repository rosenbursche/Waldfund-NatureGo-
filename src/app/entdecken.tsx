import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
import {
  appArtId,
  auswahlKandidaten,
  erkenneFoto,
  ErkennungNichtErreichbar,
  erkennungsUrl,
  istBestaetigt,
  vergleichsbilder,
  type Erkennungsergebnis,
  type Kandidat,
  type Vergleichsbild,
} from '@/logic/erkennung';
import { tagesKey, type Belohnung } from '@/logic/fortschritt';
import { STUFEN_NAMEN, type Stufe } from '@/logic/fundstuecke';
import { fundKandidat, fundstueckKatalog } from '@/logic/fundstueckErkennung';
import { FundMoment } from '@/components/fundstuecke/FundMoment';
import { fundstueckeById } from '@/data/fundstuecke';
import { fotoAufnehmen, fotoBehalten, type FotoQuelle } from '@/logic/foto';
import { useEntdeckungen } from '@/store/entdeckungen';
import { gefundeneFundstuecke, useSammlung } from '@/store/sammlung';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Entdecken (Gesamtkonzept Abschnitt 17): Foto machen → Analyse mit Animation → 4–6 Arten, die es sein könnten →
 * selbst vergleichen → antippen = gesammelt. Ob das Foto ein ganzes Lebewesen oder ein Fundstück zeigt (Spur, Losung,
 * Blatt, Rinde …), erkennt der Server selbst. Die Erkennung läuft auf dem eigenen Server (Ordner erkennung/).
 */
type Schritt =
  | { art: 'start'; meldung?: string; zuEinstellungen?: boolean }
  | { art: 'analyse'; foto: string }
  | { art: 'auswahl'; foto: string; ergebnis: Erkennungsergebnis }
  | { art: 'vergleich'; foto: string; ergebnis: Erkennungsergebnis; kandidat: Kandidat }
  | {
      art: 'gesammelt';
      foto: string;
      kandidat: Kandidat;
      bestaetigt: boolean;
      /** gesammeltes Fundstück (für den Kreis aus Kuchenstücken) */
      fund?: { artId: string; fundstueckId: string };
      belohnung?: Belohnung;
      stufe?: { vorher: Stufe; nachher: Stufe };
    };

const MIN_ANALYSE = 2400; // so lange läuft die Animation mindestens, auch wenn der Server schneller ist

const KATALOG = fundstueckKatalog();
const FUNDSTUECK_ZAHL = Object.values(KATALOG).reduce((n, l) => n + l.length, 0);

const GRUPPE_NAME: Record<string, string> = {
  saeuger: 'Säugetier',
  voegel: 'Vogel',
  pflanzen: 'Pflanze',
  pilze: 'Pilz',
};

export default function Entdecken() {
  const [schritt, setSchritt] = useState<Schritt>({ art: 'start' });
  const sammeln = useSammlung((s) => s.sammeln);
  const merken = useEntdeckungen((s) => s.merken);
  const fundstueckSammeln = useSammlung((s) => s.fundstueckSammeln);
  const serverDa = !!erkennungsUrl();

  async function los(quelle: FotoQuelle) {
    try {
      const foto = await fotoAufnehmen(quelle);
      if (foto.status === 'abgebrochen') return;
      if (foto.status === 'keineErlaubnis') {
        setSchritt({
          art: 'start',
          zuEinstellungen: true,
          meldung:
            'Wildfund darf die Kamera noch nicht benutzen. Du kannst das in den Einstellungen deines Handys erlauben.',
        });
        return;
      }
      await analysieren(foto.uri);
    } catch {
      setSchritt({ art: 'start', meldung: 'Beim Foto ist etwas schiefgelaufen. Versuch es bitte noch einmal.' });
    }
  }

  async function analysieren(foto: string) {
    try {
      setSchritt({ art: 'analyse', foto });
      const [ergebnis] = await Promise.all([
        erkenneFoto(foto, { fundstuecke: KATALOG }),
        new Promise((ok) => setTimeout(ok, MIN_ANALYSE)),
      ]);
      setSchritt({ art: 'auswahl', foto, ergebnis });
    } catch (e) {
      setSchritt({
        art: 'start',
        meldung:
          e instanceof ErkennungNichtErreichbar
            ? e.message
            : 'Beim Foto ist etwas schiefgelaufen. Versuch es bitte noch einmal.',
      });
    }
  }

  async function waehlen(foto: string, ergebnis: Erkennungsergebnis, k: Kandidat) {
    if (k.gegenklasse) {
      setSchritt({ art: 'gesammelt', foto, kandidat: k, bestaetigt: false });
      return;
    }
    const fk = fundKandidat(k.typ, k.wiss);
    if (fk) {
      // Fundstücke zählen erst nach Bestätigung durch die Community voll (Gesamtkonzept 17.4)
      const dauerhaft = await fotoBehalten(foto, `${fk.artId}-${fk.fundstueck.id}`);
      const stufe = fundstueckSammeln(fk.artId, fk.fundstueck.id, { datum: tagesKey(new Date()), foto: dauerhaft });
      setSchritt({
        art: 'gesammelt',
        foto: dauerhaft,
        kandidat: k,
        bestaetigt: false,
        stufe,
        fund: { artId: fk.artId, fundstueckId: fk.fundstueck.id },
      });
      return;
    }
    const bestaetigt = istBestaetigt(ergebnis, k);
    const appId = appArtId(k);
    const dauerhaft = await fotoBehalten(foto, appId ?? k.id);
    let belohnung: Belohnung | undefined;
    if (appId) {
      // TODO fachlich prüfen: unbestätigte Funde sollen erst nach Bestätigung durch die Community voll zählen
      // (Gesamtkonzept 17.3). Das kommt mit den Konten, bis dahin zählen sie wie bisher.
      belohnung = sammeln(appId, {
        datum: tagesKey(new Date()),
        foto: dauerhaft,
        geprueft: bestaetigt ? 'erkannt' : 'gewaehlt',
      });
    } else {
      merken({
        id: k.id,
        name: k.name,
        wiss: k.wiss,
        gruppe: k.gruppe,
        datum: tagesKey(new Date()),
        foto: dauerhaft,
        bestaetigt,
      });
    }
    setSchritt({ art: 'gesammelt', foto: dauerhaft, kandidat: k, bestaetigt, belohnung });
  }

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          {schritt.art === 'start' && (
            <>
              <Kopfzeile
                etikett="Entdecken"
                titel="Was hast du gefunden?"
                info="Fotografiere eine Pflanze, einen Pilz, einen Vogel oder ein Tier – oder eine Spur, Losung, Feder, Fraßspur, ein Blatt, Rinde, eine Knospe oder Frucht. Wildfund erkennt selbst, was es ist, und schlägt dir Arten vor. Du vergleichst und wählst aus."
              />
              <View style={[stile.kasten, { borderColor: colors.moss }]}>
                <Schrift art="klein">Nur fotografieren · Auf dem Weg bleiben · Pilze nie essen</Schrift>
              </View>
              {!serverDa && (
                <View style={[stile.kasten, { borderColor: colors.amber }]}>
                  <Schrift art="klein">
                    Noch kein Erkennungs-Server eingetragen. Zum Testen in .env.local:
                    EXPO_PUBLIC_ERKENNUNG_URL=http://IP-des-Macs:8765
                  </Schrift>
                </View>
              )}
              {schritt.meldung && (
                <View style={[stile.kasten, { borderColor: colors.amber }]}>
                  <Schrift>{schritt.meldung}</Schrift>
                  {schritt.zuEinstellungen && (
                    <Knopf titel="Handy-Einstellungen öffnen" art="leise" onPress={() => Linking.openSettings()} />
                  )}
                </View>
              )}
              <Knopf titel="Kamera öffnen" symbol="pfeil" onPress={() => los('kamera')} deaktiviert={!serverDa} />
              {/* Galerie nur beim Entwickeln: Funde zählen später nur mit der App-Kamera (Echtheitsprüfung W1) */}
              {__DEV__ && (
                <Knopf
                  titel="Test: Foto aus der Galerie"
                  art="leise"
                  onPress={() => los('galerie')}
                  deaktiviert={!serverDa}
                />
              )}
              <Knopf titel="Zurück" art="leise" onPress={() => router.back()} />
            </>
          )}

          {schritt.art === 'analyse' && (
            <Analyse
              foto={schritt.foto}
              vergleich={`Vergleich mit 11.550 Arten und ${FUNDSTUECK_ZAHL} Fundstücken …`}
            />
          )}

          {schritt.art === 'auswahl' && (
            <Auswahl
              foto={schritt.foto}
              ergebnis={schritt.ergebnis}
              onWaehle={(k) =>
                setSchritt({ art: 'vergleich', foto: schritt.foto, ergebnis: schritt.ergebnis, kandidat: k })
              }
              onKeine={() =>
                setSchritt({
                  art: 'start',
                  meldung:
                    'Kein Problem. Versuch ein Foto aus einem anderen Winkel, näher dran oder mit einem typischen Merkmal (Blatt, Blüte, Hut-Unterseite …).',
                })
              }
            />
          )}

          {schritt.art === 'vergleich' && (
            <Vergleich
              foto={schritt.foto}
              kandidat={schritt.kandidat}
              hinweis={schritt.ergebnis.hinweis}
              onDasIstEs={() => waehlen(schritt.foto, schritt.ergebnis, schritt.kandidat)}
              onZurueck={() => setSchritt({ art: 'auswahl', foto: schritt.foto, ergebnis: schritt.ergebnis })}
            />
          )}

          {schritt.art === 'gesammelt' && <Gesammelt {...schritt} onNochmal={() => setSchritt({ art: 'start' })} />}
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

/** Die Analyse als eigener Moment: Scanlinie, drehender Runenring, Zeilen, die nacheinander erscheinen */
function Analyse({ foto, vergleich }: { foto: string; vergleich: string }) {
  const ruhig = useReducedMotion();
  const t = useSharedValue(0);
  const dreh = useSharedValue(0);
  const [zeilen, setZeilen] = useState(['Formen werden gelesen …']);
  useEffect(() => {
    if (!ruhig) {
      t.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }), -1, true);
      dreh.value = withRepeat(withTiming(360, { duration: 6000, easing: Easing.linear }), -1);
    }
    const a = setTimeout(() => setZeilen((z) => [...z, vergleich]), 800);
    const b = setTimeout(() => setZeilen((z) => [...z, 'Ähnliche Arten werden gesucht …']), 1600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [ruhig, t, dreh, vergleich]);
  const linie = useAnimatedStyle(() => ({ top: `${6 + t.value * 86}%` }));
  const ring = useAnimatedStyle(() => ({ transform: [{ rotate: `${dreh.value}deg` }] }));
  return (
    <View style={stile.mitte}>
      <Schrift art="etikett">Analyse</Schrift>
      <View style={stile.analysePlatz}>
        <Animated.View style={[stile.ring, ring]} />
        <View style={stile.analyseFoto}>
          <Image source={{ uri: foto }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <Animated.View style={[stile.scanLinie, ruhig ? { top: '50%' } : linie]} />
        </View>
      </View>
      <View style={{ minHeight: 90, gap: 4 }} accessibilityLiveRegion="polite">
        {zeilen.map((z) => (
          <Animated.View key={z} entering={FadeIn.duration(300)}>
            <Schrift style={stile.zeile}>{z}</Schrift>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

function Auswahl({
  foto,
  ergebnis,
  onWaehle,
  onKeine,
}: {
  foto: string;
  ergebnis: Erkennungsergebnis;
  onWaehle: (k: Kandidat) => void;
  onKeine: () => void;
}) {
  const titel =
    ergebnis.status === 'sicher'
      ? 'Das sieht sehr nach dieser Art aus'
      : ergebnis.status === 'gattung'
        ? `Wahrscheinlich eine Art der Gattung ${ergebnis.gattung?.name}`
        : ergebnis.status === 'kein_wildfund'
          ? 'Das sieht nach einem Haustier aus'
          : 'Was könnte es sein?';
  return (
    <View style={{ gap: spacing.m }}>
      <View style={{ flexDirection: 'row', gap: spacing.m, alignItems: 'center' }}>
        <Image source={{ uri: foto }} style={stile.eigenKlein} contentFit="cover" />
        <View style={{ flex: 1, gap: 4 }}>
          <Schrift art="etikett">Dein Foto</Schrift>
          <Schrift art="ueberschrift" accessibilityRole="header">
            {titel}
          </Schrift>
        </View>
      </View>
      <Schrift art="klein">Tippe eine Art an, vergleiche mit den Fotos und wähle selbst.</Schrift>
      {ergebnis.hinweis && (
        <View style={[stile.kasten, { borderColor: colors.warn }]}>
          <Schrift art="klein" style={{ color: colors.moon }}>
            {ergebnis.hinweis}
          </Schrift>
        </View>
      )}
      <View style={stile.raster}>
        {auswahlKandidaten(ergebnis).map((k, i) => (
          <Animated.View
            key={`${k.typ ?? 'ganz'}-${k.id}`}
            entering={FadeInDown.delay(i * 90).duration(400)}
            style={stile.karteHuelle}
          >
            <KandidatKarte
              kandidat={k}
              oben={i === 0}
              fundstueck={fundKandidat(k.typ, k.wiss)?.fundstueck.name}
              onPress={() => onWaehle(k)}
            />
          </Animated.View>
        ))}
      </View>
      <Knopf titel="Keine davon" art="leise" onPress={onKeine} />
    </View>
  );
}

/** Lädt die Vergleichsfotos einer Art einmal (für Karte und Vergleich) */
function useVergleichsbilder(id: string) {
  const [bilder, setBilder] = useState<Vergleichsbild[] | null>(null);
  useEffect(() => {
    let aktiv = true;
    vergleichsbilder(id).then((b) => aktiv && setBilder(b));
    return () => {
      aktiv = false;
    };
  }, [id]);
  return bilder;
}

function KandidatKarte({
  kandidat,
  oben,
  fundstueck,
  onPress,
}: {
  kandidat: Kandidat;
  oben: boolean;
  fundstueck?: string;
  onPress: () => void;
}) {
  const bilder = useVergleichsbilder(kandidat.id);
  const bild = bilder?.[0];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${kandidat.name}, ${kandidat.wiss}. Zum Vergleichen öffnen`}
      style={({ pressed }) => [stile.karte, oben && { borderColor: colors.amber }, pressed && { opacity: 0.7 }]}
    >
      <View style={stile.karteBild}>
        {bild ? (
          <Image source={{ uri: bild.url }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
        ) : (
          <Schrift art="klein" style={{ opacity: 0.6 }}>
            {bilder ? 'kein Foto' : '…'}
          </Schrift>
        )}
      </View>
      <View style={{ padding: spacing.s, gap: 2 }}>
        <Schrift style={stile.karteName} numberOfLines={2}>
          {kandidat.name}
        </Schrift>
        <Schrift art="notiz" style={stile.karteWiss} numberOfLines={1}>
          {kandidat.wiss}
        </Schrift>
        {kandidat.gegenklasse ? (
          <Schrift style={[stile.marke, { color: colors.fog }]}>Haustier · keine Punkte</Schrift>
        ) : oben ? (
          <Schrift style={[stile.marke, { color: colors.amber }]}>am wahrscheinlichsten</Schrift>
        ) : (
          <Schrift style={[stile.marke, { color: colors.fog }]}>
            {fundstueck ?? GRUPPE_NAME[kandidat.gruppe] ?? ''}
          </Schrift>
        )}
      </View>
    </Pressable>
  );
}

function Vergleich({
  foto,
  kandidat,
  hinweis,
  onDasIstEs,
  onZurueck,
}: {
  foto: string;
  kandidat: Kandidat;
  hinweis: string | null;
  onDasIstEs: () => void;
  onZurueck: () => void;
}) {
  const bilder = useVergleichsbilder(kandidat.id);
  const fs = fundKandidat(kandidat.typ, kandidat.wiss)?.fundstueck;
  return (
    <View style={{ gap: spacing.m }}>
      <Kopfzeile etikett={fs ? `Vergleichen · ${fs.name}` : 'Vergleichen'} titel={kandidat.name} />
      <Schrift art="notiz">{kandidat.wiss}</Schrift>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.s }}>
        <View style={{ gap: 4 }}>
          <Image
            source={{ uri: foto }}
            style={[stile.vergleichBild, { borderColor: colors.amber }]}
            contentFit="cover"
          />
          <Schrift art="klein">Dein Foto</Schrift>
        </View>
        {(bilder ?? []).map((b) => (
          <View key={b.url} style={{ gap: 4, width: 220 }}>
            <Image source={{ uri: b.url }} style={stile.vergleichBild} contentFit="cover" transition={200} />
            <Schrift art="klein" style={stile.nennung} numberOfLines={2}>
              © {b.urheber} · {b.lizenz} · GBIF
            </Schrift>
          </View>
        ))}
      </ScrollView>
      {bilder && bilder.length === 0 && (
        <Schrift art="klein">Für diese Art haben wir noch keine Vergleichsfotos.</Schrift>
      )}
      {fs && (
        <View style={[stile.kasten, { borderColor: colors.moss }]}>
          <Schrift art="etikett">So erkennst du: {fs.name}</Schrift>
          {fs.erkennen.map((e) => (
            <Schrift key={e} art="klein" style={{ color: colors.moon }}>
              • {e}
            </Schrift>
          ))}
          {fs.verwechslung && (
            <Schrift art="klein" style={{ color: colors.fog }}>
              Verwechslung: {fs.verwechslung}
            </Schrift>
          )}
          {fs.schutz && (
            <Schrift art="klein" style={{ color: colors.amber }}>
              {fs.schutz}
            </Schrift>
          )}
        </View>
      )}
      {hinweis && kandidat.gruppe === 'pilze' && (
        <View style={[stile.kasten, { borderColor: colors.warn }]}>
          <Schrift art="klein" style={{ color: colors.moon }}>
            {hinweis}
          </Schrift>
        </View>
      )}
      <Knopf titel="Das ist es" symbol="pfeil" onPress={onDasIstEs} />
      <Knopf titel="Zurück zur Auswahl" art="leise" onPress={onZurueck} />
    </View>
  );
}

function Gesammelt({
  foto,
  kandidat,
  bestaetigt,
  fund,
  belohnung,
  stufe,
  onNochmal,
}: {
  foto: string;
  kandidat: Kandidat;
  bestaetigt: boolean;
  fund?: { artId: string; fundstueckId: string };
  belohnung?: Belohnung;
  stufe?: { vorher: Stufe; nachher: Stufe };
  onNochmal: () => void;
}) {
  const appId = appArtId(kandidat);
  const fs = fundKandidat(kandidat.typ, kandidat.wiss)?.fundstueck;
  const gefunden = useSammlung((s) => (fund ? gefundeneFundstuecke(fund.artId, s.fundstuecke, s.gefunden) : null));
  const alle = fund ? fundstueckeById[fund.artId]?.fundstuecke : undefined;
  const punkte = belohnung && belohnung.neu ? belohnung.punkte + belohnung.bonus + belohnung.setBonus : 0;
  if (kandidat.gegenklasse) {
    return (
      <View style={stile.mitte}>
        <Image source={{ uri: foto }} style={stile.eigenGross} contentFit="cover" />
        <Schrift art="ueberschrift" style={{ textAlign: 'center' }}>
          {kandidat.name}
        </Schrift>
        <Schrift style={{ textAlign: 'center' }}>Schön! Haustiere geben aber keine Wildfund-Punkte.</Schrift>
        <Knopf titel="Weiter entdecken" symbol="pfeil" onPress={onNochmal} style={{ alignSelf: 'stretch' }} />
      </View>
    );
  }
  return (
    <View style={stile.mitte}>
      {fund && alle && gefunden ? (
        <FundMoment art="fundstueck" artId={fund.artId} alle={alle} neu={fund.fundstueckId} gefunden={gefunden} />
      ) : appId ? (
        <FundMoment art="sichtung" artId={appId} />
      ) : (
        <Animated.View entering={ZoomIn.duration(600)}>
          <Image source={{ uri: foto }} style={stile.eigenGross} contentFit="cover" />
        </Animated.View>
      )}
      <Animated.View entering={FadeInDown.delay(250).duration(500)} style={{ alignItems: 'center', gap: 6 }}>
        <Schrift art="etikett" style={{ color: colors.amber }}>
          {fs ? `Fundstück gesammelt · ${fs.name}` : 'Gesammelt'}
        </Schrift>
        <Schrift art="titel" style={{ textAlign: 'center' }} accessibilityRole="header">
          {kandidat.name}
        </Schrift>
        <Schrift art="notiz">{kandidat.wiss}</Schrift>
      </Animated.View>
      {punkte > 0 && (
        <Animated.View entering={ZoomIn.delay(500).duration(500)}>
          <Schrift style={stile.punkte}>+{punkte} AP</Schrift>
        </Animated.View>
      )}
      {stufe && stufe.nachher > stufe.vorher && (
        <Animated.View entering={ZoomIn.delay(500).duration(500)}>
          <Schrift style={stile.punkte}>{STUFEN_NAMEN[stufe.nachher]}!</Schrift>
        </Animated.View>
      )}
      <Schrift art="klein" style={{ textAlign: 'center' }}>
        {fs
          ? 'Selbst bestimmt · Fundstücke zählen voll, sobald die Community sie bestätigt.'
          : bestaetigt
            ? 'Erkennung und deine Wahl stimmen überein.'
            : 'Selbst bestimmt · noch unbestätigt. Später kann die Community deinen Fund bestätigen.'}
      </Schrift>
      {!appId && (
        <Schrift art="klein" style={{ textAlign: 'center', opacity: 0.8 }}>
          Für diese Art gibt es noch keine eigene Seite. Dein Fund ist trotzdem gespeichert.
        </Schrift>
      )}
      {appId && (
        <Knopf
          titel="Art ansehen"
          art="leise"
          onPress={() => router.replace({ pathname: '/art/[id]', params: { id: appId } })}
          style={{ alignSelf: 'stretch' }}
        />
      )}
      <Knopf titel="Weiter entdecken" symbol="pfeil" onPress={onNochmal} style={{ alignSelf: 'stretch' }} />
    </View>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl, flexGrow: 1 },
  mitte: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.l, paddingTop: spacing.xl },
  kasten: { borderWidth: 1.5, borderRadius: radius.m, padding: spacing.m, backgroundColor: colors.forest, gap: 6 },
  analysePlatz: { width: 280, height: 280, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.rune,
    shadowColor: colors.rune,
    shadowOpacity: 0.9,
    shadowRadius: 16,
  },
  analyseFoto: { width: 236, height: 236, borderRadius: 118, overflow: 'hidden', backgroundColor: colors.forest },
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
  zeile: { fontFamily: fonts.etikett, fontSize: 14, color: colors.fog, textAlign: 'center' },
  eigenKlein: { width: 84, height: 84, borderRadius: radius.m, borderWidth: 1.5, borderColor: colors.amber },
  eigenGross: { width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: colors.amber },
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  karteHuelle: { width: '48.5%' },
  karte: {
    borderWidth: 1.5,
    borderColor: colors.moss,
    borderRadius: radius.m,
    backgroundColor: colors.forest,
    overflow: 'hidden',
  },
  karteBild: { aspectRatio: 1.1, backgroundColor: colors.night, alignItems: 'center', justifyContent: 'center' },
  karteName: { fontFamily: fonts.etikett, fontSize: 15, color: colors.moon },
  karteWiss: { fontSize: 13, color: colors.fog },
  marke: { fontFamily: fonts.etikett, fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 2 },
  vergleichBild: { width: 220, height: 220, borderRadius: radius.m, borderWidth: 1.5, borderColor: colors.moss },
  nennung: { fontSize: 11, opacity: 0.75 },
  punkte: {
    fontFamily: fonts.etikett,
    fontSize: 30,
    color: colors.amber,
    textShadowColor: colors.amber,
    textShadowRadius: 12,
  },
});
