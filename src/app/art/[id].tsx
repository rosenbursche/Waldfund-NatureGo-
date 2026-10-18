import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Icon } from '@/components/Icon';
import { TierHintergrund } from '@/components/tier/TierHintergrund';
import { TierTafel } from '@/components/tier/TierTafel';
import {
  Abzeichen,
  RoteListeAbzeichen,
  SCHUTZ_FARBE,
  SchutzAbzeichen,
  SeltenheitAbzeichen,
} from '@/components/ui/Abzeichen';
import { Kapitelkopf } from '@/components/ui/Kapitelkopf';
import { FotoHero } from '@/components/tier/TierFoto';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { ArtMiniatur } from '@/components/ArtMiniatur';
import { LehrbuchKarte } from '@/components/LehrbuchZeichnung';
import { Schrift } from '@/components/Schrift';
import { VerbreitungsKarte } from '@/components/VerbreitungsKarte';
import { artById } from '@/data/arten';
import { modellFuerArt, namensnennung } from '@/data/modelle';
import { STECKBRIEFE } from '@/data/steckbriefe';
import { baumById } from '@/data/baumarten';
import { NATURRAEUME, naturraumById } from '@/data/naturraeume';
import { KATEGORIEN, ROTE_LISTE_NAME, SCHUTZ_NAME, SELTENHEIT } from '@/data/spiel';
import { BODEN_NAME, GROSSLANDSCHAFT_NAME, HOEHENSTUFE_NAME } from '@/data/typen';
import { istVerborgen, katalogEintrag } from '@/logic/katalog';
import { wirdGefressenVon } from '@/logic/nahrungsnetz';
import { berechneWildWert } from '@/logic/wildwert';
import { MONATE, MONATE_LANG, zustandImMonat } from '@/logic/jahreszeit';
import { herkunftsText, istHeimisch } from '@/logic/regelEngine';
import { wachstum, wachstumsBereich } from '@/logic/wachstum';
import { stimmungJetzt } from '@/logic/tageszeit';
import { ArtBuehne } from '@/scene/ArtBuehne';
import { TierSeiteInhalt } from '@/components/tier/TierSeiteInhalt';
import { tierSeite } from '@/data/tierSeiten';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';
import { colors, fonts, radius, spacing } from '@/theme/theme';

const datumText = (d: string) => {
  const [j, m, t] = d.split('-');
  return `${Number(t)}. ${MONATE[Number(m) - 1]} ${j}`;
};

const SCHUTZ_HINWEIS = [
  'Trotzdem: nur beobachten und fotografieren.',
  'Nicht pflücken oder fangen, Fundort schonen.',
  'Nicht stören, fangen oder pflücken. Nur aus Abstand fotografieren.',
];

/**
 * Artenseite: 3D-Modell, Steckbrief, Lehrbuch-Zeichnung, Verbreitungskarte,
 * Schutzstatus, Rote Liste, Giftwarnung bei Pilzen und „Wusstest du?“.
 * Funktioniert für die 39 Arten aus dem Prototyp und für alle Baumarten.
 */
export default function ArtSeite() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ruhig = useReducedMotion();
  const naturraumId = useEinstellungen((s) => s.naturraumId);
  const sammlung = useSammlung((s) => s.gefunden);
  // Pflanzen-Regler: Monat (Start: aktueller Monat) und Wachstum (Start: ausgewachsen)
  const [monat, setMonat] = useState(() => new Date().getMonth() + 1);
  const [wuchsWert, setWuchsWert] = useState(() => standardWuchs(id));
  const [modellStatus, setModellStatus] = useState('');
  // Grafische Seite: Scrollweg für die Parallaxe des Hintergrunds, Licht im Hero nach Uhrzeit
  const [scroll] = useState(() => new Animated.Value(0));
  const [stimmung] = useState(() => stimmungJetzt());
  const [zeige3d, setZeige3d] = useState(false);

  const eintrag = katalogEintrag(id);
  const art = artById[id];
  const baum = baumById[id];
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;

  if (!eintrag) {
    return (
      <Hintergrund>
        <SafeAreaView style={stile.inhalt}>
          <Kopfzeile titel="Unbekannte Art" />
        </SafeAreaView>
      </Hintergrund>
    );
  }

  const fund = sammlung[id];
  const gefunden = !!fund;
  const verborgen = istVerborgen(id, sammlung);
  const s = SELTENHEIT[eintrag.seltenheit];
  const kategorie = KATEGORIEN.find((k) => k.id === (art?.kategorie ?? 'pflanzen'))!;
  const gruppe = art?.gruppe === 'Mystery' ? 'Mystery-Zone' : (art?.gruppe ?? 'Bäume');
  const istPilz = art?.kategorie === 'pilze';
  const istPflanze = art ? art.kategorie === 'pflanzen' : !!baum;
  const realistisch = modellFuerArt(id);
  const steckbrief = STECKBRIEFE[id];
  const fressfeinde = wirdGefressenVon(id);
  // Grafische Seite (Vorlage Reh): Bilder statt Text, sobald die Art nicht mehr verborgen ist
  const tier = tierSeite(id);
  const grafisch = !!tier && !verborgen;

  const seite = (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <Animated.ScrollView
        contentContainerStyle={stile.inhalt}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scroll } } }], { useNativeDriver: true })}
      >
        {grafisch && tier ? (
          /* Hero: echtes Foto (falls vorhanden) oder das Tier in seinem Lebensraum (3D), Name groß auf dem Bild */
          <View style={stile.hero}>
            {tier.fotos && !zeige3d ? (
              <View style={{ height: 470 }}>
                <FotoHero id={tier.fotos.hero} x={tier.fotos.heroX} gefunden={gefunden} ruhig={ruhig} />
              </View>
            ) : (
              <ArtBuehne
                glb={realistisch?.datei}
                melden={realistisch ? setModellStatus : undefined}
                modell={art?.modell}
                silhouette={!gefunden}
                ruhig={ruhig}
                hoehe={470}
                umgebung={{ art: tier.umgebung, stimmung, extras: tier.extras }}
              />
            )}
            <LinearGradient pointerEvents="none" colors={['transparent', colors.night]} style={stile.heroVerlauf} />
            <View style={stile.heroOben} pointerEvents="box-none">
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Zurück"
                hitSlop={8}
                style={({ pressed }) => [stile.heroZurueck, pressed && { opacity: 0.6 }]}
              >
                <Icon name="zurueck" groesse={20} />
              </Pressable>
              <View style={stile.heroEtikett}>
                <Schrift art="etikett" style={{ color: colors.moon }}>
                  {kategorie.name}
                </Schrift>
              </View>
            </View>
            {/* KONZEPT: zur lebendigen Tierseite (nur auf dem Branch feature/tierseite-lebendig) */}
            {tier.fotos && (
              <Pressable
                onPress={() => router.push({ pathname: '/konzept', params: { id } })}
                accessibilityRole="button"
                accessibilityLabel="Lebendige Seite ansehen (Konzept)"
                style={({ pressed }) => [stile.hero3d, stile.heroKonzept, pressed && { opacity: 0.6 }]}
              >
                <Schrift art="etikett" style={{ color: colors.night }}>
                  Lebendig ✦
                </Schrift>
              </Pressable>
            )}
            {/* Umschalter Foto ↔ 3D-Modell */}
            {tier.fotos && (
              <Pressable
                onPress={() => setZeige3d(!zeige3d)}
                accessibilityRole="button"
                accessibilityLabel={zeige3d ? 'Foto zeigen' : '3D-Modell zeigen'}
                style={({ pressed }) => [stile.hero3d, pressed && { opacity: 0.6 }]}
              >
                <Schrift art="etikett" style={{ color: colors.night }}>
                  {zeige3d ? 'Foto' : '3D'}
                </Schrift>
              </Pressable>
            )}
            <View style={stile.heroUnten} pointerEvents="none">
              {!gefunden && (
                <Schrift art="notiz" style={stile.heroHinweis}>
                  Fotografiere die Art, um sie in Farbe freizuschalten
                </Schrift>
              )}
              <Kapitelkopf etikett={gruppe} titel={eintrag.name} unter={eintrag.lat} groesse="gross" />
              <View style={stile.chips}>
                <SeltenheitAbzeichen stufe={eintrag.seltenheit} punkte />
                {art && art.schutz > 0 && <SchutzAbzeichen schutz={art.schutz} />}
                {gefunden && <Abzeichen text="Gesammelt" farbe={colors.amber} art="voll" />}
              </View>
            </View>
          </View>
        ) : (
          <Kopfzeile etikett={`${kategorie.name} · ${gruppe}`} titel={verborgen ? '???' : eintrag.name} />
        )}

        {/* 3D-Modell: Silhouette, solange nicht gesammelt */}
        {!grafisch && (
          <View style={stile.buehne}>
            <ArtBuehne
              glb={realistisch?.datei}
              melden={realistisch ? setModellStatus : undefined}
              modell={art?.modell}
              baum={baum?.modell}
              silhouette={!gefunden}
              ruhig={ruhig}
              pflanze={istPflanze ? pflanzenZustand(id, monat, wuchsWert) : undefined}
            />
            {!gefunden && (
              <Schrift art="notiz" style={stile.sperre} pointerEvents="none">
                {verborgen
                  ? 'Unbekannte Art – nur die Silhouette ist zu sehen'
                  : 'Fotografiere die Art, um sie in Farbe freizuschalten'}
              </Schrift>
            )}
          </View>
        )}

        {realistisch && (
          <View style={stile.platzhalter}>
            <Schrift art="klein">
              Realistisches 3D-Modell (Platzhalter): zeigt einen Weißwedelhirsch, kein Reh – ein echtes Reh-Modell
              folgt. Modell: {namensnennung(realistisch)}.
            </Schrift>
            {modellStatus.startsWith('Fehler') || modellStatus.includes('geladen …') ? (
              <Schrift art="klein" style={{ color: modellStatus.startsWith('Fehler') ? colors.warn : colors.fog }}>
                {modellStatus}
              </Schrift>
            ) : null}
          </View>
        )}

        {istPflanze && !verborgen && (
          <PflanzenRegler id={id} monat={monat} setMonat={setMonat} wuchsWert={wuchsWert} setWuchsWert={setWuchsWert} />
        )}

        {!grafisch && (
          <View>
            <Schrift art="titel" accessibilityRole="header">
              {verborgen ? 'Mystery-Art' : eintrag.name}
            </Schrift>
            <Schrift style={stile.latein}>{verborgen ? 'Species incognita' : eintrag.lat}</Schrift>
          </View>
        )}

        {!grafisch && <WildWertAnzeige id={id} />}

        {!grafisch && (
          <View style={stile.chips}>
            <SeltenheitAbzeichen stufe={eintrag.seltenheit} punkte />
            {art && !verborgen && <SchutzAbzeichen schutz={art.schutz} />}
            {art?.roteListe && !verborgen && <RoteListeAbzeichen stufe={art.roteListe} />}
            {art?.giftig && <Abzeichen text={art.giftig} farbe={colors.warn} />}
          </View>
        )}

        {gefunden ? (
          <Kasten>
            <View style={{ flexDirection: 'row', gap: spacing.m, alignItems: 'center' }}>
              {fund.foto ? (
                <Image
                  source={{ uri: fund.foto }}
                  style={stile.fundFoto}
                  contentFit="cover"
                  accessibilityLabel="Dein Foto"
                />
              ) : null}
              <View style={{ flex: 1 }}>
                <Schrift art="ueberschrift" style={{ color: colors.amber, fontSize: 21 }}>
                  Gesammelt
                </Schrift>
                <Schrift art="klein">
                  am {datumText(fund.datum)}
                  {fund.beispiel
                    ? ' · Beispielfund'
                    : fund.geprueft === 'plantnet'
                      ? ' · geprüft mit Pl@ntNet'
                      : fund.geprueft === 'demo'
                        ? ' · Demo-Prüfung'
                        : ''}
                </Schrift>
              </View>
            </View>
            {fund.beispiel && (
              <Knopf
                titel="Selbst fotografieren"
                art="leise"
                onPress={() => router.push({ pathname: '/sammeln/[id]', params: { id } })}
                style={{ marginTop: spacing.s }}
              />
            )}
          </Kasten>
        ) : (
          <Knopf
            titel="Foto machen & sammeln"
            untertitel={`${s.punkte} AP · nur fotografieren, nichts mitnehmen`}
            symbol="pfeil"
            onPress={() => router.push({ pathname: '/sammeln/[id]', params: { id } })}
          />
        )}

        {verborgen && art?.raetsel && (
          <Kasten>
            <Schrift art="notiz" style={{ color: colors.moon, fontSize: 21, lineHeight: 28 }}>
              „{art.raetsel}“
            </Schrift>
          </Kasten>
        )}

        {/* Pilze: immer warnen – auch bei Speisepilzen */}
        {istPilz && (
          <Kasten farbe={colors.warn}>
            <Schrift>
              <Schrift style={{ color: colors.warn, fontFamily: fonts.bodySemiBold }}>Achtung: </Schrift>
              {art?.giftig === 'tödlich giftig' ? 'Tödlich giftig. ' : art?.giftig ? 'Giftig. ' : ''}
              Iss niemals Pilze, die nicht von einer Pilzsachverständigen oder einem Pilzsachverständigen geprüft
              wurden. Sammeln nur mit Erwachsenen.
            </Schrift>
          </Kasten>
        )}

        {/* Giftige Pflanzen */}
        {art?.giftig && art.kategorie === 'pflanzen' && (
          <Kasten farbe={colors.blut}>
            <Schrift>
              <Schrift style={{ color: colors.warn, fontFamily: fonts.bodySemiBold }}>☠ {art.giftig}: </Schrift>
              Nichts davon in den Mund nehmen – auch keine Beeren oder Blätter. Am besten gar nicht anfassen und danach
              die Hände waschen. Bei Verdacht auf Vergiftung sofort den Giftnotruf oder 112 anrufen.
            </Schrift>
          </Kasten>
        )}

        {/* Gefährliche Tiere */}
        {art?.gefahr && (
          <Kasten farbe={colors.blut}>
            <Schrift>
              <Schrift style={{ color: colors.warn, fontFamily: fonts.bodySemiBold }}>☠ Vorsicht: </Schrift>
              {art.gefahr}
            </Schrift>
          </Kasten>
        )}

        {art && art.schutz > 0 && !verborgen && (
          <Kasten farbe={SCHUTZ_FARBE[art.schutz]}>
            <Schrift>Geschützte Art: Nur fotografieren – nicht pflücken, nicht fangen, nicht stören.</Schrift>
          </Kasten>
        )}

        {grafisch && tier && (
          <TierSeiteInhalt
            id={id}
            tier={tier}
            art={art}
            sammlung={sammlung}
            ruhig={ruhig}
            futterArten={<ArtVerweise ids={steckbrief?.nahrungIds ?? []} sammlung={sammlung} />}
          />
        )}

        {!verborgen && !grafisch && (
          <Abschnitt titel="Steckbrief">
            {art ? (
              <>
                <Zeile name="Lebensraum" wert={art.lebensraum} />
                <Zeile name="Saison" wert={art.saison} />
                <Zeile name="Größe" wert={art.groesse} />
                <Zeile name="Gruppe" wert={gruppe} />
              </>
            ) : null}
            {baum && (
              <>
                <Zeile
                  name="Höhenstufen"
                  wert={baum.hoehenstufen.map((h) => HOEHENSTUFE_NAME[h].split(' ')[0]).join(', ') || '–'}
                />
                <Zeile name="Böden" wert={baum.boeden.map((b) => BODEN_NAME[b]).join('; ') || '–'} />
                <Zeile
                  name="Von Natur aus"
                  wert={
                    baum.status === 'eingefuehrt'
                      ? 'nicht in Deutschland heimisch'
                      : baum.grosslandschaften.map((g) => GROSSLANDSCHAFT_NAME[g]).join(', ')
                  }
                />
              </>
            )}
            {baum && naturraum && (
              <Schrift art="notiz" style={{ marginTop: spacing.s }}>
                {herkunftsText(baum, naturraum)} ({naturraum.name})
              </Schrift>
            )}
          </Abschnitt>
        )}

        {steckbrief && !verborgen && !grafisch && (
          <>
            <Abschnitt titel="Key Features">
              {steckbrief.merkmale.map((m) => (
                <View key={m} style={stile.merkmal}>
                  <Schrift style={stile.rune}>ᛟ</Schrift>
                  <Schrift style={{ flex: 1 }}>{m}</Schrift>
                </View>
              ))}
            </Abschnitt>

            <Abschnitt titel="Lebensraum">
              <Schrift art="notiz" style={{ color: colors.moon }}>
                {art?.lebensraum}
              </Schrift>
              <Schrift>
                <Schrift style={{ color: colors.rune }}>Warum gerade dort? </Schrift>
                {steckbrief.lebensraumWarum}
              </Schrift>
            </Abschnitt>

            <Abschnitt titel="Nahrung">
              <Schrift>{steckbrief.nahrung}</Schrift>
              <ArtVerweise ids={steckbrief.nahrungIds} titel="Davon in Wildfund:" sammlung={sammlung} />
            </Abschnitt>

            {art?.kategorie === 'voegel' && (
              <>
                <Abschnitt titel="Füße & Krallen">
                  <Schrift>{steckbrief.fuesse}</Schrift>
                </Abschnitt>
                <Abschnitt titel="Nest">
                  <Schrift>{steckbrief.nest}</Schrift>
                </Abschnitt>
                <Kasten farbe={colors.rune}>
                  <Schrift art="etikett">Warum so gebaut?</Schrift>
                  <Schrift>{steckbrief.warumSoGebaut}</Schrift>
                </Kasten>
              </>
            )}

            <Abschnitt titel="Spuren">
              <Schrift>{steckbrief.spuren}</Schrift>
            </Abschnitt>

            <Abschnitt titel={art?.kategorie === 'voegel' ? 'Schlafen' : 'Wohnen & Schlafen'}>
              <Schrift>{steckbrief.wohnen}</Schrift>
            </Abschnitt>
          </>
        )}

        {!verborgen && !grafisch && fressfeinde.length > 0 && (
          <Abschnitt titel={art?.kategorie === 'pflanzen' || !art ? 'Wer frisst mich?' : 'Fressfeinde'}>
            <ArtVerweise ids={fressfeinde} sammlung={sammlung} />
          </Abschnitt>
        )}

        {grafisch ? (
          <>
            <TierTafel symbol="buch" titel="Skizzenbuch">
              <LehrbuchKarte
                id={id}
                name={eintrag.name}
                zeichnung={art?.zeichnung ?? { t: 'tree' }}
                modell={art?.modell}
              />
            </TierTafel>
            {art && (
              <TierTafel symbol="karte" titel="Wo in Deutschland">
                <VerbreitungsKarte art="raster" artId={id} modell={art.verbreitung} farbe={s.farbe} />
              </TierTafel>
            )}
          </>
        ) : (
          <>
            <Abschnitt titel="">
              <LehrbuchKarte
                id={id}
                name={eintrag.name}
                zeichnung={art?.zeichnung ?? { t: 'tree' }}
                modell={art?.modell}
                gesperrt={verborgen}
              />
            </Abschnitt>

            <Abschnitt titel={verborgen ? 'Hier könntest du suchen' : 'Verbreitung in Deutschland'}>
              {art ? (
                <VerbreitungsKarte art="raster" artId={id} modell={art.verbreitung} farbe={s.farbe} />
              ) : baum ? (
                <VerbreitungsKarte
                  art="naturraeume"
                  naturraeume={NATURRAEUME.filter((n) => istHeimisch(baum.id, n))}
                  farbe={colors.rune}
                  eigenerId={naturraumId ?? undefined}
                />
              ) : null}
            </Abschnitt>
          </>
        )}

        {art && !verborgen && !grafisch && (
          <View style={stile.status}>
            <Kasten style={{ flex: 1 }}>
              <Schrift art="ueberschrift" style={{ fontSize: 19, color: SCHUTZ_FARBE[art.schutz] }}>
                {SCHUTZ_NAME[art.schutz]}
              </Schrift>
              <Schrift art="klein">{SCHUTZ_HINWEIS[art.schutz]}</Schrift>
            </Kasten>
            <Kasten style={{ flex: 1 }}>
              <Schrift art="ueberschrift" style={{ fontSize: 19 }}>
                {art.roteListe ? ROTE_LISTE_NAME[art.roteListe] : 'Nicht bewertet'}
              </Schrift>
              <Schrift art="klein">
                {art.roteListe ? `Rote Liste Deutschland, Kategorie ${art.roteListe}` : 'Noch nicht hinterlegt'}
              </Schrift>
            </Kasten>
          </View>
        )}
        {baum && (
          <Kasten>
            <Schrift art="klein">
              {/* TODO fachlich prüfen: Schutzstatus und Rote Liste der Baumarten ergänzen */}
              Schutzstatus und Rote Liste für Baumarten sind noch nicht hinterlegt.
            </Schrift>
          </Kasten>
        )}

        {art && !verborgen && !grafisch && (
          <Kasten>
            <Schrift art="etikett">Wusstest du?</Schrift>
            <Schrift style={{ marginTop: spacing.xs }}>{art.wusstestDu}</Schrift>
          </Kasten>
        )}

        <Schrift art="klein" style={{ opacity: 0.7 }}>
          Verbreitung und Schutzstatus sind vereinfacht (Demo-Daten).
        </Schrift>
      </Animated.ScrollView>
    </SafeAreaView>
  );

  return grafisch ? (
    <TierHintergrund scroll={scroll} ruhig={ruhig}>
      {seite}
    </TierHintergrund>
  ) : (
    <Hintergrund>{seite}</Hintergrund>
  );
}

/** Startwert Wachstum: Bäume als junger, ausgewachsener Baum (ca. 30 % des Höchstalters), sonst "ausgewachsen" */
function standardWuchs(id: string): number {
  const b = wachstumsBereich(id);
  return b.einheit === 'Jahre' ? Math.round(b.max * 0.3) : 3;
}

/** Zustand für die 3D-Bühne aus Monat und Wachstum */
function pflanzenZustand(id: string, monat: number, wuchsWert: number) {
  const z = zustandImMonat(id, monat);
  return {
    // ohne hinterlegte Blütezeit bleibt die Blüte sichtbar
    bluete: z.datenVorhanden ? z.bluete : true,
    frucht: z.frucht,
    laub: z.laub,
    wuchs: wachstum(id, wuchsWert).groesse,
  };
}

/** Zwei Regler: Jahreszeit (Jan–Dez) und Wachstum (Keimling → alter Baum) */
function PflanzenRegler({
  id,
  monat,
  setMonat,
  wuchsWert,
  setWuchsWert,
}: {
  id: string;
  monat: number;
  setMonat: (m: number) => void;
  wuchsWert: number;
  setWuchsWert: (w: number) => void;
}) {
  const z = zustandImMonat(id, monat);
  const w = wachstum(id, wuchsWert);
  return (
    <View style={stile.regler}>
      <Schrift art="etikett">Blüte & Frucht im Jahreslauf</Schrift>
      <Slider
        value={monat}
        minimumValue={1}
        maximumValue={12}
        step={1}
        onValueChange={setMonat}
        minimumTrackTintColor={colors.rune}
        maximumTrackTintColor={colors.moss}
        thumbTintColor={colors.amber}
        accessibilityLabel={`Monat: ${MONATE_LANG[monat - 1]}`}
      />
      <View style={stile.monate}>
        {MONATE.map((m, i) => (
          <Schrift key={m} style={[stile.monat, i + 1 === monat && { color: colors.amber }]}>
            {m[0]}
          </Schrift>
        ))}
      </View>
      <Schrift art="notiz" style={{ fontSize: 17, lineHeight: 23 }}>
        {z.text}
      </Schrift>
      {!z.datenVorhanden && (
        <Schrift art="klein">
          Blüte- und Fruchtzeit sind für diese Art noch nicht hinterlegt – gezeigt wird das Laub.
        </Schrift>
      )}

      <Schrift art="etikett" style={{ marginTop: spacing.m }}>
        Wachstum
      </Schrift>
      <Slider
        value={wuchsWert}
        minimumValue={0}
        maximumValue={w.max}
        step={w.einheit === 'Jahre' ? 1 : 1}
        onValueChange={setWuchsWert}
        minimumTrackTintColor={colors.rune}
        maximumTrackTintColor={colors.moss}
        thumbTintColor={colors.amber}
        accessibilityLabel={w.einheit === 'Jahre' ? `Alter: ${wuchsWert} Jahre` : `Wachstumsstufe: ${w.stufe}`}
      />
      <Schrift art="notiz" style={{ fontSize: 17, lineHeight: 23 }}>
        {w.einheit === 'Jahre' ? `${wuchsWert} ${wuchsWert === 1 ? 'Jahr' : 'Jahre'} · ${w.stufe}` : w.stufe}
      </Schrift>
      {w.einheit === 'Jahre' && (
        <Schrift art="klein">Kann etwa {w.max} Jahre alt werden (ungefähr, noch fachlich zu prüfen).</Schrift>
      )}
    </View>
  );
}

/** Wild-Wert: 1–100, wie selten die Art ist – dazu der Hinweis, ob sie bedroht ist */
function WildWertAnzeige({ id }: { id: string }) {
  const w = berechneWildWert(id);
  const farbe = w.wert >= 80 ? colors.legend : w.wert >= 55 ? colors.rare : w.wert >= 30 ? colors.rune : colors.fog;
  return (
    <View
      style={stile.wild}
      accessible
      accessibilityLabel={`Wild-Wert ${w.wert} von 100. ${w.bedroht ?? (w.vorwarnung ? 'Auf der Vorwarnliste' : 'Nicht bedroht')}`}
    >
      <View style={[stile.wildKreis, { borderColor: farbe, shadowColor: farbe }]}>
        <Schrift style={[stile.wildZahl, { color: farbe }]}>{w.wert}</Schrift>
      </View>
      <View style={{ flex: 1 }}>
        <Schrift art="etikett">Wild-Wert · 1–100</Schrift>
        <Schrift art="klein" style={{ color: w.bedroht ? colors.warn : colors.fog }}>
          {w.bedroht ? `⚠ ${w.bedroht}` : w.vorwarnung ? 'Auf der Vorwarnliste' : 'Nicht bedroht'}
        </Schrift>
        <Schrift art="klein" style={{ fontSize: 11, opacity: 0.7 }}>
          aus Verbreitung, Seltenheit und Roter Liste (Demo-Daten)
        </Schrift>
      </View>
    </View>
  );
}

/** Verknüpfte Arten als antippbare Chips mit Miniatur (Mystery-Arten bleiben verborgen) */
function ArtVerweise({ ids, titel, sammlung }: { ids: string[]; titel?: string; sammlung: Record<string, unknown> }) {
  if (ids.length === 0) return null;
  return (
    <View style={{ gap: spacing.s }}>
      {titel && <Schrift art="etikett">{titel}</Schrift>}
      <View style={stile.verweise}>
        {ids.map((vid) => {
          const e = katalogEintrag(vid);
          if (!e) return null;
          const versteckt = istVerborgen(vid, sammlung);
          const ok = vid in sammlung;
          const s = SELTENHEIT[e.seltenheit];
          return (
            <Pressable
              key={vid}
              onPress={() => router.push({ pathname: '/art/[id]', params: { id: vid } })}
              accessibilityRole="button"
              accessibilityLabel={versteckt ? 'Unbekannte Art' : e.name}
              style={({ pressed }) => [
                stile.verweis,
                { borderColor: ok ? s.farbe : colors.moss },
                pressed && { opacity: 0.6 },
              ]}
            >
              <ArtMiniatur
                modell={e.modell}
                baumModell={e.baumModell}
                stil={ok ? 'farbe' : versteckt ? 'verborgen' : 'umriss'}
                akzent={s.farbe}
                groesse={28}
              />
              <Schrift art="klein" style={{ color: ok ? colors.moon : colors.fog }}>
                {versteckt ? '???' : e.name}
              </Schrift>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Kasten({ farbe = colors.moss, style, children }: { farbe?: string; style?: object; children: ReactNode }) {
  return <View style={[stile.kasten, { borderColor: farbe }, style]}>{children}</View>;
}

function Abschnitt({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <View style={{ gap: spacing.s, marginTop: spacing.s }}>
      {titel ? (
        <Schrift art="ueberschrift" accessibilityRole="header">
          {titel}
        </Schrift>
      ) : null}
      {children}
    </View>
  );
}

function Zeile({ name, wert }: { name: string; wert: string }) {
  return (
    <View style={stile.zeile}>
      <Schrift art="etikett" style={stile.zeileName}>
        {name}
      </Schrift>
      <Schrift style={{ flex: 1 }}>{wert}</Schrift>
    </View>
  );
}

const stile = StyleSheet.create({
  platzhalter: { borderLeftWidth: 2, borderLeftColor: colors.amber, paddingLeft: spacing.s, gap: 2 },
  regler: {
    borderWidth: 1.5,
    borderColor: colors.moss,
    borderRadius: radius.m,
    padding: spacing.m,
    backgroundColor: colors.forest,
    gap: 4,
  },
  monate: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6 },
  monat: { fontFamily: fonts.etikett, fontSize: 11, color: colors.fog, width: 14, textAlign: 'center' },
  wild: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  wildKreis: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  wildZahl: { fontFamily: fonts.titel, fontSize: 26, lineHeight: 32 },
  merkmal: { flexDirection: 'row', gap: spacing.s, alignItems: 'flex-start' },
  rune: { color: colors.rune, fontSize: 15, lineHeight: 23 },
  verweise: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  verweis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 4,
    paddingRight: 10,
    paddingVertical: 3,
    borderRadius: radius.l,
    borderWidth: 1.2,
    backgroundColor: colors.forest,
  },
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl },
  buehne: { marginHorizontal: -spacing.m },
  hero: { marginHorizontal: -spacing.m, marginTop: -spacing.m, marginBottom: -spacing.s },
  heroVerlauf: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 260 },
  heroOben: {
    position: 'absolute',
    top: spacing.m,
    left: spacing.m,
    right: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroZurueck: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.moss,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEtikett: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.l,
    backgroundColor: colors.night,
    borderWidth: 1,
    borderColor: colors.moss,
  },
  hero3d: {
    position: 'absolute',
    right: spacing.m,
    bottom: spacing.m,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.l,
    backgroundColor: colors.amber,
  },
  heroKonzept: { bottom: spacing.m + 40, backgroundColor: colors.rune },
  heroUnten: { position: 'absolute', left: spacing.m, right: spacing.m, bottom: spacing.m },
  heroHinweis: { color: colors.fog, fontSize: 16, marginBottom: spacing.xs },
  sperre: { position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', color: colors.fog, fontSize: 15 },
  latein: { fontFamily: fonts.etikett, color: colors.fog, fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  kasten: { borderWidth: 1.5, borderRadius: radius.m, padding: spacing.m, backgroundColor: colors.forest, gap: 4 },
  status: { flexDirection: 'row', gap: spacing.s },
  fundFoto: { width: 64, height: 64, borderRadius: radius.s },
  zeile: { flexDirection: 'row', gap: spacing.m, paddingVertical: 3 },
  zeileName: { width: 104, paddingTop: 3, textTransform: 'none', fontSize: 12 },
});
