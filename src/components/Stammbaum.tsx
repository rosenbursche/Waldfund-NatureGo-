import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import type { KategorieId } from '@/data/artTypen';
import type { Naturraum } from '@/data/typen';
import {
  alleImBaum,
  passtZumFilter,
  type KatalogEintrag,
  type Lebensbaum as LebensbaumDaten,
  type StammbaumFilter,
} from '@/logic/katalog';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { GefahrAuftritt, hatAuftritt } from './gefahr/GefahrAuftritt';
import { GefahrSektion } from './GefahrSektion';
import { Schrift } from './Schrift';
import { AstListe } from './stammbaum/AstListe';
import { AstPanel } from './stammbaum/AstPanel';
import { Lebensbaum, TOTER_AST } from './stammbaum/Lebensbaum';
import { Schatzkammer } from './stammbaum/Schatzkammer';

/**
 * Stammbaum-Ansicht einer Kategorie als Lebensbaum (siehe `stammbaum/Lebensbaum.tsx`).
 * Es ist immer nur ein Ast offen: seine Arten wachsen darunter heraus (`AstPanel`).
 * Der tote Ast über der Krone öffnet – nach einem Schreck-Auftritt – die Sektion "Gefährlich & tödlich".
 */
type Props = {
  kategorie: KategorieId;
  baum: LebensbaumDaten;
  /** für den Filter „Hier möglich“ */
  naturraum?: Naturraum;
  gefunden: Record<string, unknown>;
  verborgen: (id: string) => boolean;
  /** Text für den toten Ast, falls es keine gefährlichen Arten gibt */
  leerText?: string;
  /** meldet die Lage des geöffneten Bereichs, damit der Screen dorthin scrollen kann */
  onBereich?: (y: number) => void;
};

const FILTER: [StammbaumFilter, string][] = [
  ['alle', 'Alle'],
  ['fehlt', 'Fehlt noch'],
  ['hier', 'Hier möglich'],
  ['saison', 'Jetzt in Saison'],
];

export function Stammbaum({ kategorie, baum, naturraum, gefunden, verborgen, leerText, onBereich }: Props) {
  const [filter, setFilter] = useState<StammbaumFilter>('alle');
  const monat = new Date().getMonth() + 1;
  const passt = (e: KatalogEintrag) => passtZumFilter(e, filter, gefunden, naturraum, monat);
  const alle = alleImBaum(baum);
  const anzahlPassend = filter === 'alle' ? alle.length : alle.filter(passt).length;
  const ruhig = useReducedMotion();
  const [offen, setOffen] = useState<string | null>(null);
  const [auftritt, setAuftritt] = useState(false);
  const ast = baum.aeste.find((a) => a.name === offen);

  // Der tote Ast öffnet sich mit einem Schreck-Auftritt über den ganzen Bildschirm
  // (nicht bei „Bewegung reduzieren“ und nicht, wenn es in der Kategorie keine gefährlichen Arten gibt)
  const waehle = (ziel: string | null) => {
    if (ziel === TOTER_AST && offen !== TOTER_AST && !ruhig && hatAuftritt(kategorie) && baum.toterAst.length > 0) {
      setOffen(null);
      setAuftritt(true);
      return;
    }
    setOffen(ziel);
  };

  return (
    <View style={{ gap: spacing.m }}>
      <Schrift art="klein" style={{ textAlign: 'center' }}>
        Tippe einen Ast an – am Baum oder in der Liste darunter. Seine Zweige sind kleine Sammelsets, jedes mit einem
        Schatz. Die Sterne sind die legendären Arten – und am toten Ast ganz oben lauert Gefahr.
      </Schrift>

      {/* Filter: dunkeln im geöffneten Ast ab, verstecken nie – die ganze Sammlung bleibt sichtbar */}
      <View style={stile.filterReihe} accessibilityRole="radiogroup" accessibilityLabel="Filter für den Stammbaum">
        {FILTER.map(([wert, text]) => (
          <Pressable
            key={wert}
            onPress={() => setFilter(wert)}
            accessibilityRole="radio"
            accessibilityLabel={`Filter ${text}`}
            accessibilityState={{ selected: filter === wert }}
            style={[stile.filter, filter === wert && stile.filterAktiv]}
          >
            <Schrift style={[stile.filterText, filter === wert && { color: colors.amber }]}>{text}</Schrift>
          </Pressable>
        ))}
      </View>
      {filter !== 'alle' && (
        <Schrift art="klein" style={{ textAlign: 'center' }}>
          {anzahlPassend} von {alle.length} Arten passen
          {filter === 'hier' && !naturraum ? ' (wähle in den Einstellungen deine Gegend)' : ''} – die übrigen sind im
          geöffneten Ast abgedunkelt.
        </Schrift>
      )}

      <Lebensbaum kategorie={kategorie} baum={baum} gefunden={gefunden} offen={offen} onWaehle={waehle} />
      <Schatzkammer kategorie={kategorie} baum={baum} gefunden={gefunden} />
      <AstListe kategorie={kategorie} baum={baum} gefunden={gefunden} offen={offen} onWaehle={waehle} />

      {auftritt && (
        <GefahrAuftritt
          kategorie={kategorie}
          onHoehepunkt={() => setOffen(TOTER_AST)}
          onEnde={() => setAuftritt(false)}
        />
      )}

      {ast && (
        <View onLayout={(e) => onBereich?.(e.nativeEvent.layout.y)}>
          <AstPanel
            key={ast.name}
            kategorie={kategorie}
            ast={ast}
            gefunden={gefunden}
            passt={filter === 'alle' ? undefined : passt}
            onSchliessen={() => setOffen(null)}
          />
        </View>
      )}

      {offen === TOTER_AST && (
        <Animated.View entering={FadeIn.duration(400)} onLayout={(e) => onBereich?.(e.nativeEvent.layout.y)}>
          <Pressable
            onPress={() => setOffen(null)}
            accessibilityRole="button"
            accessibilityLabel="Gefahren schließen"
            hitSlop={8}
            style={({ pressed }) => [stile.schliessen, pressed && { opacity: 0.6 }]}
          >
            <Schrift style={stile.schliessenText}>✕ schließen</Schrift>
          </Pressable>
          <GefahrSektion
            eintraege={baum.toterAst}
            gefunden={gefunden}
            verborgen={verborgen}
            ausloeser={1}
            leerText={leerText}
          />
        </Animated.View>
      )}
    </View>
  );
}

const stile = StyleSheet.create({
  filterReihe: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.s },
  filter: {
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.night,
  },
  filterAktiv: { borderColor: colors.amber, backgroundColor: colors.forest },
  filterText: { fontFamily: fonts.etikett, fontSize: 11, color: colors.fog },
  schliessen: {
    alignSelf: 'flex-end',
    marginBottom: spacing.s,
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.blut,
    backgroundColor: colors.abgrund,
  },
  schliessenText: { fontFamily: fonts.etikett, fontSize: 12, color: colors.fog },
});
