import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { KAMPFWERTE, LEBENSWEISE_NAME } from '@/data/kampfwerte';
import { modellFuerArt, namensnennung } from '@/data/modelle';
import {
  beschreibe,
  computerWahl,
  inAktivzeit,
  istMoeglich,
  MAX_KRAFT,
  neuerKaempfer,
  spieleRunde,
  starteKampf,
  TARNEN_PRO_KAMPF,
  type Aktion,
  type Kaempfer,
  type KampfZustand,
} from '@/logic/kampf';
import { KampfArena } from '@/scene/KampfArena';
import { KampfRegie } from '@/scene/kampfRegie';
import { colors, radius, spacing } from '@/theme/theme';

/**
 * Kampf-Arena (Test): Reh gegen Reh, gegen den Computer.
 * Konzept: docs/KONZEPT-SPIELSYSTEM.md, Abschnitt 3. Erreichbar über Einstellungen → Darstellung.
 */
const REH = KAMPFWERTE.reh;
const neu = () => starteKampf(neuerKaempfer('Dein Reh', REH), neuerKaempfer('Wildes Reh', REH));

export default function Kampf() {
  const ruhig = useReducedMotion();
  const modell = modellFuerArt('reh');
  const [regie] = useState(() => new KampfRegie());
  const [zustand, setZustand] = useState<KampfZustand>(neu);
  const [protokoll, setProtokoll] = useState<string[]>(['Zwei Rehe treffen sich auf der Lichtung.']);
  const [gesperrt, setGesperrt] = useState(false);
  const [status, setStatus] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const stunde = new Date().getHours();
  const aktiv = inAktivzeit(REH.aktiv, stunde);

  function handeln(aktion: Aktion) {
    if (gesperrt || zustand.sieger) return;
    const ergebnis = spieleRunde(zustand, aktion, computerWahl(zustand), new Date().getHours());
    const dauer = regie.abspielen(ergebnis.ereignisse);
    const zeilen = ergebnis.ereignisse.map((e) => beschreibe(e, ergebnis.zustand));
    if (ergebnis.zustand.sieger === 'spieler')
      zeilen.push('Gewonnen! Dein Reh hat das Kräftemessen für sich entschieden.');
    if (ergebnis.zustand.sieger === 'gegner') zeilen.push('Verloren. Dein Reh ruht sich aus – versuch es noch einmal.');
    // Anzeige erst nach der Bewegung aktualisieren, damit Balken und Bild zusammenpassen
    setGesperrt(true);
    timer.current = setTimeout(
      () => {
        setZustand(ergebnis.zustand);
        setProtokoll((p) => [...zeilen.reverse(), ...p].slice(0, 6));
        setGesperrt(false);
      },
      ruhig ? 150 : dauer * 1000,
    );
  }

  function nochmal() {
    regie.zuruecksetzen();
    setZustand(neu());
    setProtokoll(['Neuer Kampf. Zwei Rehe treffen sich auf der Lichtung.']);
  }

  const ich = zustand.spieler;
  const vorbei = !!zustand.sieger;

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett="Kampf-Arena · Test" titel="Reh gegen Reh" />
          {modell && (
            <View style={stile.buehne}>
              <KampfArena glb={modell.datei} blick={modell.blick} regie={regie} ruhig={ruhig} melden={setStatus} />
            </View>
          )}
          {status.startsWith('Fehler') && <Schrift style={{ color: colors.warn }}>{status}</Schrift>}

          <View style={stile.zeile}>
            <Anzeige k={zustand.spieler} farbe={colors.rune} />
            <Anzeige k={zustand.gegner} farbe={colors.amber} />
          </View>

          <Schrift art="klein" style={{ color: aktiv ? colors.amber : colors.fog }}>
            {aktiv
              ? 'Dämmerung: Rehe sind jetzt aktiv – beide kämpfen 20 % stärker.'
              : 'Rehe sind vor allem in der Dämmerung aktiv. Dann kämpfen sie stärker.'}
          </Schrift>

          {vorbei ? (
            <View style={[stile.kasten, { borderColor: zustand.sieger === 'spieler' ? colors.legend : colors.moss }]}>
              <Schrift art="ueberschrift">{zustand.sieger === 'spieler' ? 'Gewonnen!' : 'Verloren'}</Schrift>
              <Knopf titel="Neuer Kampf" onPress={nochmal} />
            </View>
          ) : (
            <View style={{ gap: spacing.s }}>
              <Knopf
                titel={REH.schnell.name}
                untertitel={`Sofortangriff · lädt ${REH.schnell.kraft} Kraft`}
                onPress={() => handeln({ typ: 'schnell' })}
                deaktiviert={gesperrt}
              />
              {REH.spezial.map((a, index) => (
                <Knopf
                  key={a.name}
                  titel={a.name}
                  untertitel={`Spezialangriff · kostet ${a.kraft} Kraft${a.kraftRaub ? ` · raubt ${a.kraftRaub} Kraft` : ''}`}
                  art="leise"
                  onPress={() => handeln({ typ: 'spezial', index })}
                  deaktiviert={gesperrt || !istMoeglich(ich, { typ: 'spezial', index })}
                />
              ))}
              <Knopf
                titel="Tarnen"
                untertitel={`blockt diese Runde jeden Angriff · noch ${ich.tarnen}×`}
                art="leise"
                onPress={() => handeln({ typ: 'tarnen' })}
                deaktiviert={gesperrt || ich.tarnen === 0}
              />
            </View>
          )}

          <View style={stile.kasten}>
            <Schrift art="etikett">Kampf-Protokoll · Runde {zustand.runde}</Schrift>
            {protokoll.map((z, i) => (
              <Schrift key={`${zustand.runde}-${i}`} art={i === 0 ? 'text' : 'klein'} style={{ opacity: 1 - i * 0.12 }}>
                {z}
              </Schrift>
            ))}
          </View>

          <View style={stile.kasten}>
            <Schrift art="etikett">Echtes Vorbild</Schrift>
            {[REH.schnell, ...REH.spezial].map((a) => (
              <Schrift key={a.name} art="klein">
                <Schrift art="klein" style={{ color: colors.amber }}>
                  {a.name}:{' '}
                </Schrift>
                {a.vorbild}
              </Schrift>
            ))}
            <Schrift art="klein" style={{ opacity: 0.7 }}>
              Werte sind eine Spiel-Vereinfachung, noch nicht fachlich geprüft.
            </Schrift>
          </View>

          {modell && (
            <Schrift art="klein" style={{ opacity: 0.8 }}>
              Platzhalter-Modell (Weißwedelhirsch, kein echtes Reh, ohne Skelett): {namensnennung(modell)}
            </Schrift>
          )}
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

/** Name, Lebensweise, Ausdauer, Kraft und Tarnungen eines Tiers */
function Anzeige({ k, farbe }: { k: Kaempfer; farbe: string }) {
  const lebensweise = k.werte.lebensweisen.map((l) => LEBENSWEISE_NAME[l]).join(' · ');
  return (
    <View style={[stile.anzeige, { borderColor: farbe }]}>
      <Schrift style={{ color: farbe }}>{k.name}</Schrift>
      <Schrift art="etikett">{lebensweise}</Schrift>
      <Balken
        wert={k.ausdauer}
        max={k.werte.ausdauer}
        farbe={colors.rune}
        text={`Ausdauer ${k.ausdauer}/${k.werte.ausdauer}`}
      />
      <Balken wert={k.kraft} max={MAX_KRAFT} farbe={colors.amber} text={`Kraft ${k.kraft}`} />
      <Schrift art="klein" accessibilityLabel={`Tarnen: noch ${k.tarnen} von ${TARNEN_PRO_KAMPF}`}>
        Tarnen {'◆'.repeat(k.tarnen)}
        {'◇'.repeat(TARNEN_PRO_KAMPF - k.tarnen)}
      </Schrift>
    </View>
  );
}

function Balken({ wert, max, farbe, text }: { wert: number; max: number; farbe: string; text: string }) {
  return (
    <View accessible accessibilityLabel={text} style={{ gap: 2 }}>
      <Schrift art="klein">{text}</Schrift>
      <View style={stile.balken}>
        <View style={{ width: `${Math.round((wert / max) * 100)}%`, height: '100%', backgroundColor: farbe }} />
      </View>
    </View>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl },
  buehne: { marginHorizontal: -spacing.m },
  zeile: { flexDirection: 'row', gap: spacing.s },
  anzeige: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.m,
    padding: spacing.s + 2,
    backgroundColor: colors.forest,
    gap: 4,
  },
  balken: { height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: colors.night },
  kasten: {
    borderWidth: 1.5,
    borderColor: colors.moss,
    borderRadius: radius.m,
    padding: spacing.m,
    backgroundColor: colors.forest,
    gap: 6,
  },
});
