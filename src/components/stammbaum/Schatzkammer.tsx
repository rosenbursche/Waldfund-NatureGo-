import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import type { KategorieId } from '@/data/artTypen';
import { SELTENHEIT } from '@/data/spiel';
import { alleImBaum, istVerborgen, schatzkammerAus, type KatalogEintrag, type Lebensbaum } from '@/logic/katalog';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { ArtMiniatur } from '../ArtMiniatur';
import { Schrift } from '../Schrift';

/**
 * Schatzkammer unter dem Lebensbaum – das Schaufenster der Rune:
 * - Die Seltensten: die 5 seltensten Arten. Fehlen sie noch, liegen sie verhüllt im Schatten
 *   (nur Seltenheit sichtbar), gefunden leuchten sie in Farbe.
 * - Die Gefährlichsten: die gefährlichste Art groß, daneben die nächsten zwei. Sie stehen immer mit
 *   Namen da – Wissen, das schützt, wird nicht versteckt. Grau, bis man sie gefunden (fotografiert) hat.
 */
type Props = { kategorie: KategorieId; baum: Lebensbaum; gefunden: Record<string, unknown> };

const STUFE: Record<1 | 2 | 3, string> = { 1: 'Vorsicht', 2: 'sehr gefährlich', 3: 'tödlich' };

export function Schatzkammer({ kategorie, baum, gefunden }: Props) {
  const { seltenste, gefaehrlichste } = schatzkammerAus(alleImBaum(baum));
  if (!seltenste.length && !gefaehrlichste.length) return null;
  const [erste, ...weitere] = gefaehrlichste;
  return (
    <View style={stile.kammer} accessibilityLabel="Schatzkammer">
      {seltenste.length > 0 && (
        <>
          <Schrift style={stile.titel}>
            ✦ {kategorie === 'pflanzen' ? 'Die seltensten Pflanzen' : 'Die Seltensten'} ✦
          </Schrift>
          <View style={stile.reihe}>
            {seltenste.map((e) => (
              <Schatz key={e.id} e={e} ok={e.id in gefunden} verborgen={istVerborgen(e.id, gefunden)} />
            ))}
          </View>
        </>
      )}

      {erste && (
        <>
          <Schrift style={[stile.titel, { color: colors.warn }]}>☠ Die Gefährlichsten ☠</Schrift>
          <View style={stile.gefahrReihe}>
            <Gefahr e={erste} ok={erste.id in gefunden} gross />
            <View style={stile.gefahrKlein}>
              {weitere.map((e) => (
                <Gefahr key={e.id} e={e} ok={e.id in gefunden} />
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

function Schatz({ e, ok, verborgen }: { e: KatalogEintrag; ok: boolean; verborgen: boolean }) {
  const s = SELTENHEIT[e.seltenheit];
  const zeichen = e.seltenheit === 4 ? '★' : e.seltenheit === 3 ? '☆' : '◇';
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/art/[id]', params: { id: e.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${verborgen ? 'Verhüllter Schatz' : e.name}, ${s.name}, ${ok ? 'gefunden' : 'noch nicht gefunden'}`}
      style={({ pressed }) => [stile.schatz, pressed && { opacity: 0.6 }]}
    >
      <View
        style={[
          stile.sockel,
          { borderColor: s.farbe },
          ok ? { backgroundColor: colors.forest, shadowColor: s.farbe, shadowOpacity: 0.9 } : { opacity: 0.55 },
        ]}
      >
        <ArtMiniatur
          modell={e.modell}
          baumModell={e.baumModell}
          stil={ok ? 'farbe' : verborgen ? 'verborgen' : 'umriss'}
          akzent={s.farbe}
          groesse={34}
        />
      </View>
      <Schrift style={[stile.zeichen, { color: s.farbe }]}>{zeichen}</Schrift>
      <Schrift style={[stile.name, ok && { color: colors.moon }]} numberOfLines={2}>
        {verborgen ? '???' : e.name}
      </Schrift>
    </Pressable>
  );
}

function Gefahr({ e, ok, gross }: { e: KatalogEintrag; ok: boolean; gross?: boolean }) {
  const stufe = STUFE[e.gefahrStufe ?? 1];
  const g = gross ? 58 : 34;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/art/[id]', params: { id: e.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${gross ? 'Die gefährlichste Art: ' : ''}${e.name}, ${stufe}, ${ok ? 'gefunden' : 'noch nicht gefunden'}`}
      style={({ pressed }) => [gross ? stile.gefahrGross : stile.gefahrZeile, pressed && { opacity: 0.6 }]}
    >
      <View
        style={[
          stile.gefahrKreis,
          { width: g + 10, height: g + 10, borderRadius: (g + 10) / 2 },
          ok && { backgroundColor: colors.abgrund, shadowColor: colors.blut, shadowOpacity: 0.9 },
        ]}
      >
        <ArtMiniatur
          modell={e.modell}
          baumModell={e.baumModell}
          stil={ok ? 'farbe' : 'umriss'}
          akzent={colors.warn}
          groesse={g}
        />
      </View>
      <View style={{ flex: gross ? undefined : 1, alignItems: gross ? 'center' : 'flex-start' }}>
        <Schrift
          style={[gross ? stile.gefahrNameGross : stile.gefahrName, ok && { color: colors.moon }]}
          numberOfLines={2}
        >
          {e.name}
        </Schrift>
        <Schrift style={stile.stufe}>{stufe}</Schrift>
      </View>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  kammer: {
    gap: spacing.s,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.forest,
    backgroundColor: colors.night,
  },
  titel: { fontFamily: fonts.titel, fontSize: 13, color: colors.legend, textAlign: 'center', letterSpacing: 1 },
  reihe: { flexDirection: 'row', justifyContent: 'space-between' },
  schatz: { flex: 1, alignItems: 'center', gap: 2 },
  sockel: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  zeichen: { fontSize: 11, marginTop: -2 },
  // normale Textschrift: die Großbuchstaben-Schrift würde lange Namen mitten im Wort trennen
  name: { fontFamily: fonts.bodyMedium, fontSize: 10.5, lineHeight: 13, color: colors.fog, textAlign: 'center' },
  gefahrReihe: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  gefahrGross: { width: '42%', alignItems: 'center', gap: 4 },
  gefahrKlein: { flex: 1, gap: spacing.s },
  gefahrZeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  gefahrKreis: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.4,
    borderColor: colors.blut,
    backgroundColor: colors.night,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  gefahrNameGross: { fontFamily: fonts.titel, fontSize: 13, lineHeight: 16, color: colors.fog, textAlign: 'center' },
  gefahrName: { fontFamily: fonts.titel, fontSize: 11.5, lineHeight: 14, color: colors.fog },
  stufe: { fontFamily: fonts.etikett, fontSize: 10, color: colors.warn },
});
