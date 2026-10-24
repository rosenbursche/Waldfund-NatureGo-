import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Knopf } from '@/components/Knopf';
import { Schrift } from '@/components/Schrift';
import { TierSymbol, type SymbolName } from '@/components/tier/TierSymbol';
import { Sektion } from '@/components/ui/Sektion';
import { fundstueckeById } from '@/data/fundstuecke';
import type { Fundstueck, FundstueckTyp, Monat } from '@/data/fundstueckTypen';
import { artFortschritt, inSaison, monatsSpannen, STUFEN_NAMEN } from '@/logic/fundstuecke';
import { fotoAufnehmen, fotoBehalten } from '@/logic/foto';
import { MONATE } from '@/logic/jahreszeit';
import { gefundeneFundstuecke, talerStufe, useSammlung } from '@/store/sammlung';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Album-Seite einer Art (Gesamtkonzept G1): jedes Fundstück ist ein Platz, der sich mit einem Foto füllt.
 * Gesammelt wird nur mit der App-Kamera (Echtheitsprüfung W1), nie aus der Galerie.
 */

const SYMBOL: Record<FundstueckTyp, SymbolName> = {
  spur: 'tritt',
  faehrte: 'tritt',
  losung: 'losung',
  frass: 'verbiss',
  bau: 'bau',
  nest: 'bau',
  feder: 'trieb',
  stimme: 'ohr',
  haar: 'pfote',
  blatt: 'blatt',
  rinde: 'baum',
  knospe: 'knospe',
  bluete: 'bluete',
  frucht: 'beere',
  samen: 'nuss',
  keimling: 'keim',
  fruchtkoerper: 'mulde',
  sichtung: 'auge',
  ganz: 'auge',
  sonstiges: 'karte',
};

/** „Okt–Nov“, „Feb–März, Okt–Nov“ bzw. „ganzjährig“ */
function monateText(m: readonly Monat[]): string {
  const spannen = monatsSpannen(m);
  if (spannen.length === 0) return 'ganzjährig';
  return spannen
    .map(([von, bis]) => (von === bis ? MONATE[von - 1] : `${MONATE[von - 1]}–${MONATE[bis - 1]}`))
    .join(', ');
}

export function FundstueckAlbum({ artId }: { artId: string }) {
  const daten = fundstueckeById[artId];
  const fundstuecke = useSammlung((s) => s.fundstuecke);
  const gefunden = useSammlung((s) => s.gefunden);
  const sammeln = useSammlung((s) => s.fundstueckSammeln);
  const [offen, setOffen] = useState<string | null>(null);
  const [meldung, setMeldung] = useState('');
  if (!daten) return null;

  const monat = (new Date().getMonth() + 1) as Monat;
  const ids = gefundeneFundstuecke(artId, fundstuecke, gefunden);
  const stufe = talerStufe(artId, { fundstuecke, gefunden });
  const { gefunden: anzahl, gesamt } = artFortschritt(daten.fundstuecke, ids);
  const auswahl = daten.fundstuecke.find((f) => f.id === offen);

  async function fotografieren(f: Fundstueck) {
    setMeldung('');
    const foto = await fotoAufnehmen('kamera');
    if (foto.status === 'keineErlaubnis') return setMeldung('Ohne Kamera-Erlaubnis geht es nicht.');
    if (foto.status !== 'ok') return;
    const uri = await fotoBehalten(foto.uri, `${artId}-${f.id}`);
    const { vorher, nachher } = sammeln(artId, f.id, { datum: new Date().toISOString().slice(0, 10), foto: uri });
    setMeldung(nachher > vorher ? `Neu: ${STUFEN_NAMEN[nachher]}!` : `${f.name} gesammelt.`);
    setOffen(null);
  }

  return (
    <Sektion
      symbol="tritt"
      titel="Fundstücke"
      info="Jedes Zeichen zählt: Spuren, Federn, Blätter, Stimmen. Nur fotografieren, nichts mitnehmen."
      rechts={
        <Schrift art="etikett" style={{ color: colors.amber }}>
          {anzahl}/{gesamt}
        </Schrift>
      }
    >
      <Schrift art="ueberschrift" style={{ color: stufe ? colors.amber : colors.fog }}>
        {STUFEN_NAMEN[stufe]}
      </Schrift>

      <View style={stile.raster}>
        {daten.fundstuecke.map((f) => {
          const da = ids.has(f.id);
          const foto = fundstuecke[artId]?.[f.id]?.foto;
          const saison = inSaison(f, monat);
          return (
            <Pressable
              key={f.id}
              onPress={() => setOffen(offen === f.id ? null : f.id)}
              accessibilityRole="button"
              accessibilityLabel={`${f.name}${da ? ', gesammelt' : saison ? '' : ', gerade nicht in Saison'}`}
              style={({ pressed }) => [
                stile.platz,
                da && stile.platzDa,
                !da && !saison && { opacity: 0.45 },
                offen === f.id && { borderColor: colors.amber },
                pressed && { opacity: 0.7 },
              ]}
            >
              {foto ? (
                <Image source={{ uri: foto }} style={stile.foto} contentFit="cover" />
              ) : (
                <TierSymbol name={SYMBOL[f.typ]} groesse={34} farbe={da ? colors.amber : colors.fog} dicke={1.2} />
              )}
              <Schrift art="klein" numberOfLines={2} style={stile.platzName}>
                {f.name}
              </Schrift>
            </Pressable>
          );
        })}
      </View>

      {auswahl && (
        <View style={stile.detail}>
          <Schrift art="ueberschrift">{auswahl.name}</Schrift>
          <Schrift>{auswahl.kurz}</Schrift>
          {auswahl.erkennen.map((e) => (
            <Schrift key={e} art="klein">
              · {e}
            </Schrift>
          ))}
          <Schrift art="klein">
            {monateText(auswahl.monate)} · {auswahl.wo}
          </Schrift>
          {auswahl.verwechslung && <Schrift art="notiz">Verwechslung: {auswahl.verwechslung}</Schrift>}
          {auswahl.schutz && (
            <Schrift style={{ color: colors.warn, fontFamily: fonts.bodySemiBold }}>{auswahl.schutz}</Schrift>
          )}
          {auswahl.typ === 'stimme' ? (
            <Schrift art="klein">Tonaufnahme kommt bald.</Schrift>
          ) : (
            <Knopf
              titel={ids.has(auswahl.id) ? 'Neues Foto' : 'Foto machen'}
              untertitel="nur fotografieren, nichts mitnehmen"
              symbol="pfeil"
              onPress={() => fotografieren(auswahl)}
            />
          )}
        </View>
      )}

      {meldung ? (
        <Schrift art="notiz" accessibilityLiveRegion="polite">
          {meldung}
        </Schrift>
      ) : null}
    </Sektion>
  );
}

const stile = StyleSheet.create({
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  platz: {
    width: '31%',
    aspectRatio: 0.9,
    borderRadius: radius.m,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    gap: spacing.xs,
  },
  platzDa: { borderStyle: 'solid', borderColor: colors.amber, backgroundColor: colors.forest },
  platzName: { textAlign: 'center', fontSize: 12, lineHeight: 15 },
  foto: { width: '100%', flex: 1, borderRadius: radius.s },
  detail: {
    gap: spacing.xs,
    padding: spacing.m,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.forest,
  },
});
