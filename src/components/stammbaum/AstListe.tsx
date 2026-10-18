import { Pressable, StyleSheet, View } from 'react-native';

import type { KategorieId } from '@/data/artTypen';
import type { Lebensbaum as LebensbaumDaten } from '@/logic/katalog';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { Schrift } from '../Schrift';
import { BAUM_STILE } from './baumStile';
import { GruppenIcon, SCHATTENWURZELN } from './GruppenIcon';
import { WURZELN } from './Lebensbaum';

/**
 * Die Äste als aufgeräumte Liste unter dem Lebensbaum: Symbol (wie am Knopf im Baum), Name,
 * Fortschritt und Zahl der Zweige. Antippen öffnet den Ast – genau wie der Knopf am Baum.
 * So bleibt der Baum selbst frei von Text und damit übersichtlich.
 */
type Props = {
  kategorie: KategorieId;
  baum: LebensbaumDaten;
  gefunden: Record<string, unknown>;
  offen: string | null;
  onWaehle: (ziel: string | null) => void;
};

export function AstListe({ kategorie, baum, gefunden, offen, onWaehle }: Props) {
  const stil = BAUM_STILE[kategorie];
  const wurzelnGefunden = baum.wurzeln.filter((e) => e.id in gefunden).length;
  return (
    <View style={stile.raster}>
      {baum.aeste.map((a, i) => {
        const n = a.eintraege.filter((e) => e.id in gefunden).length;
        return (
          <Karte
            key={a.name}
            name={a.name}
            zeile={`${n}/${a.eintraege.length} · ${a.zweige.length} ${a.zweige.length === 1 ? 'Zweig' : 'Zweige'}${a.mond ? ' · ☾' : ''}`}
            anteil={a.eintraege.length ? n / a.eintraege.length : 0}
            voll={n === a.eintraege.length}
            aktiv={offen === a.name}
            farbe={stil.ring}
            index={i}
            beschreibung={`${a.name}: ${n} von ${a.eintraege.length} gefunden, ${a.zweige.length} Zweige${
              a.mond ? ', Meisterast' : ''
            }`}
            onPress={() => onWaehle(offen === a.name ? null : a.name)}
          />
        );
      })}
      <Karte
        name={SCHATTENWURZELN}
        zeile={baum.wurzeln.length ? `${wurzelnGefunden}/${baum.wurzeln.length} · gefährlich` : 'keine Gefahr'}
        anteil={baum.wurzeln.length ? wurzelnGefunden / baum.wurzeln.length : 0}
        voll={false}
        aktiv={offen === WURZELN}
        farbe={colors.warn}
        index={baum.aeste.length}
        gefahr
        beschreibung={`Gefährliche Arten in den Schattenwurzeln: ${wurzelnGefunden} von ${baum.wurzeln.length} gefunden`}
        onPress={() => onWaehle(offen === WURZELN ? null : WURZELN)}
      />
    </View>
  );
}

function Karte({
  name,
  zeile,
  anteil,
  voll,
  aktiv,
  farbe,
  index,
  gefahr,
  beschreibung,
  onPress,
}: {
  name: string;
  zeile: string;
  anteil: number;
  voll: boolean;
  aktiv: boolean;
  farbe: string;
  index: number;
  gefahr?: boolean;
  beschreibung: string;
  onPress: () => void;
}) {
  const akzent = voll ? colors.legend : farbe;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ expanded: aktiv }}
      accessibilityLabel={beschreibung}
      style={({ pressed }) => [
        stile.karte,
        // die Schattenwurzeln immer über die ganze Breite, damit der lange Name nicht umbricht
        gefahr && { flexBasis: '100%', borderColor: colors.blut, backgroundColor: colors.abgrund },
        aktiv && { borderColor: akzent, backgroundColor: colors.forest },
        pressed && { opacity: 0.7 },
      ]}
    >
      <GruppenIcon
        name={name}
        farbe={aktiv ? colors.moon : akzent}
        augenFarbe={gefahr ? colors.warn : colors.amber}
        groesse={26}
        phase={index}
      />
      <View style={stile.text}>
        <Schrift style={[stile.name, aktiv && { color: colors.moon }]} numberOfLines={3}>
          {name}
        </Schrift>
        <Schrift style={[stile.zeile, { color: akzent }]} numberOfLines={1}>
          {zeile}
        </Schrift>
        <View style={stile.balken}>
          <View style={[stile.fuellung, { width: `${Math.round(anteil * 100)}%`, backgroundColor: akzent }]} />
        </View>
      </View>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  karte: {
    // zwei Karten je Reihe
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.s,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.night,
  },
  text: { flex: 1, gap: 2 },
  name: { fontFamily: fonts.titel, fontSize: 12.5, lineHeight: 16, color: colors.fog },
  zeile: { fontFamily: fonts.etikett, fontSize: 10.5 },
  balken: { height: 2, borderRadius: 1, backgroundColor: colors.forest, overflow: 'hidden', marginTop: 2 },
  fuellung: { height: 2, borderRadius: 1 },
});
