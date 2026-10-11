import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { LehrbuchKarte } from '@/components/LehrbuchZeichnung';
import { Schrift } from '@/components/Schrift';
import { VerbreitungsKarte } from '@/components/VerbreitungsKarte';
import { artById } from '@/data/arten';
import { baumById } from '@/data/baumarten';
import { NATURRAEUME, naturraumById } from '@/data/naturraeume';
import { KATEGORIEN, ROTE_LISTE_NAME, SCHUTZ_NAME, SELTENHEIT } from '@/data/spiel';
import { BODEN_NAME, GROSSLANDSCHAFT_NAME, HOEHENSTUFE_NAME } from '@/data/typen';
import { istVerborgen, katalogEintrag } from '@/logic/katalog';
import { herkunftsText, istHeimisch } from '@/logic/regelEngine';
import { ArtBuehne } from '@/scene/ArtBuehne';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';
import { colors, fonts, radius, spacing } from '@/theme/theme';

const MONATE = ['Jan', 'Feb', 'März', 'April', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const datumText = (d: string) => {
  const [j, m, t] = d.split('-');
  return `${Number(t)}. ${MONATE[Number(m) - 1]} ${j}`;
};

const SCHUTZ_FARBE = [colors.fog, colors.rune, colors.legend] as const;
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

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett={`${kategorie.name} · ${gruppe}`} titel={verborgen ? '???' : eintrag.name} />

          {/* 3D-Modell: Silhouette, solange nicht gesammelt */}
          <View style={stile.buehne}>
            <ArtBuehne modell={art?.modell} baum={baum?.modell} silhouette={!gefunden} ruhig={ruhig} />
            {!gefunden && (
              <Schrift art="notiz" style={stile.sperre} pointerEvents="none">
                {verborgen
                  ? 'Unbekannte Art – nur die Silhouette ist zu sehen'
                  : 'Fotografiere die Art, um sie in Farbe freizuschalten'}
              </Schrift>
            )}
          </View>

          <View>
            <Schrift art="titel" accessibilityRole="header">
              {verborgen ? 'Mystery-Art' : eintrag.name}
            </Schrift>
            <Schrift style={stile.latein}>{verborgen ? 'Species incognita' : eintrag.lat}</Schrift>
          </View>

          <View style={stile.chips}>
            <Pille farbe={s.farbe} voll>
              {s.name} · {s.punkte} AP
            </Pille>
            {art && !verborgen && <Pille farbe={SCHUTZ_FARBE[art.schutz]}>{SCHUTZ_NAME[art.schutz]}</Pille>}
            {art?.roteListe && !verborgen && (
              <Pille farbe={'123'.includes(art.roteListe) ? colors.warn : colors.fog}>
                Rote Liste {art.roteListe} · {ROTE_LISTE_NAME[art.roteListe]}
              </Pille>
            )}
            {art?.giftig && <Pille farbe={colors.warn}>{art.giftig}</Pille>}
          </View>

          {gefunden ? (
            <Kasten>
              <Schrift art="ueberschrift" style={{ color: colors.amber, fontSize: 21 }}>
                Gesammelt
              </Schrift>
              <Schrift art="klein">
                am {datumText(fund.datum)}
                {fund.beispiel ? ' · Beispielfund' : ''}
              </Schrift>
            </Kasten>
          ) : (
            <Knopf
              titel="Foto machen & sammeln"
              untertitel="Kommt in Phase 6"
              symbol="pfeil"
              onPress={() => {}}
              deaktiviert
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

          {art && art.schutz > 0 && !verborgen && (
            <Kasten farbe={SCHUTZ_FARBE[art.schutz]}>
              <Schrift>Geschützte Art: Nur fotografieren – nicht pflücken, nicht fangen, nicht stören.</Schrift>
            </Kasten>
          )}

          {!verborgen && (
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

          {art && !verborgen && (
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

          {art && !verborgen && (
            <Kasten>
              <Schrift art="etikett">Wusstest du?</Schrift>
              <Schrift style={{ marginTop: spacing.xs }}>{art.wusstestDu}</Schrift>
            </Kasten>
          )}

          <Schrift art="klein" style={{ opacity: 0.7 }}>
            Verbreitung und Schutzstatus sind vereinfacht (Demo-Daten).
          </Schrift>
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

function Pille({ farbe, voll, children }: { farbe: string; voll?: boolean; children: ReactNode }) {
  return (
    <View style={[stile.pille, { borderColor: farbe }, voll && { backgroundColor: farbe }]}>
      <Schrift art="klein" style={{ color: voll ? colors.night : farbe, fontSize: 12.5 }}>
        {children}
      </Schrift>
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
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl },
  buehne: { marginHorizontal: -spacing.m },
  sperre: { position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', color: colors.fog, fontSize: 15 },
  latein: { fontFamily: fonts.type, color: colors.fog, fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  pille: { borderWidth: 1.5, borderRadius: radius.l, paddingHorizontal: 10, paddingVertical: 3 },
  kasten: { borderWidth: 1.5, borderRadius: radius.m, padding: spacing.m, backgroundColor: colors.forest, gap: 4 },
  status: { flexDirection: 'row', gap: spacing.s },
  zeile: { flexDirection: 'row', gap: spacing.m, paddingVertical: 3 },
  zeileName: { width: 104, paddingTop: 3, textTransform: 'none', fontSize: 12 },
});
