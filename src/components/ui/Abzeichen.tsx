import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import type { RoteListe, Schutz, Seltenheit } from '@/data/artTypen';
import { ROTE_LISTE_NAME, SCHUTZ_NAME, SELTENHEIT } from '@/data/spiel';
import { colors, fonts, radius } from '@/theme/theme';

/**
 * Abzeichen (Badge): kurzes Etikett in Cinzel, gesperrt, mit Rahmen.
 * - art "rand": nur Rahmen und Schrift in der Farbe (Standard)
 * - art "voll": gefüllt, dunkle Schrift – für den wichtigsten Status
 * - leuchten: weicher Schein (nur für Legendäres und Belohnungen)
 * - steine: 1–4 kleine Edelsteine vor dem Text (Seltenheitsstufe)
 */
export function Abzeichen({
  text,
  farbe = colors.fog,
  art = 'rand',
  leuchten = false,
  steine,
  klein = false,
}: {
  text: string;
  farbe?: string;
  art?: 'rand' | 'voll';
  leuchten?: boolean;
  steine?: number;
  klein?: boolean;
}) {
  const voll = art === 'voll';
  return (
    <View
      accessible
      accessibilityLabel={text}
      style={[
        stile.abzeichen,
        klein && stile.klein,
        { borderColor: farbe },
        voll && { backgroundColor: farbe },
        leuchten && [stile.leuchten, { shadowColor: farbe }],
      ]}
    >
      {steine !== undefined && (
        <View style={stile.steine}>
          {[1, 2, 3, 4].map((i) => (
            <Edelstein key={i} farbe={voll ? colors.night : farbe} voll={i <= steine} />
          ))}
        </View>
      )}
      <Schrift style={[stile.text, klein && stile.textKlein, { color: voll ? colors.night : farbe }]}>{text}</Schrift>
    </View>
  );
}

function Edelstein({ farbe, voll }: { farbe: string; voll: boolean }) {
  return (
    <Svg width={8} height={10} viewBox="0 0 8 10">
      <Path d="M4 0.6 L7.4 3.6 L4 9.4 L0.6 3.6 Z" stroke={farbe} strokeWidth={1} fill={voll ? farbe : 'none'} />
    </Svg>
  );
}

/** Seltenheit einer Art: Edelsteine + Name, legendär leuchtet. `punkte`: AP dahinter zeigen */
export function SeltenheitAbzeichen({
  stufe,
  punkte = false,
  klein,
}: {
  stufe: Seltenheit;
  punkte?: boolean;
  klein?: boolean;
}) {
  const s = SELTENHEIT[stufe];
  return (
    <Abzeichen
      text={punkte ? `${s.name} · ${s.punkte} AP` : s.name}
      farbe={s.farbe}
      steine={stufe}
      leuchten={stufe === 4}
      klein={klein}
    />
  );
}

/** Schutzstatus (Bundesartenschutz): nicht / besonders / streng geschützt */
export const SCHUTZ_FARBE = [colors.fog, colors.rune, colors.legend] as const;
export function SchutzAbzeichen({ schutz, klein }: { schutz: Schutz; klein?: boolean }) {
  return <Abzeichen text={SCHUTZ_NAME[schutz]} farbe={SCHUTZ_FARBE[schutz]} klein={klein} />;
}

/** Rote Liste: gefährdete Stufen (1–3) in Warnfarbe */
export function RoteListeAbzeichen({ stufe, klein }: { stufe: RoteListe; klein?: boolean }) {
  return (
    <Abzeichen
      text={`Rote Liste ${stufe} · ${ROTE_LISTE_NAME[stufe]}`}
      farbe={'123'.includes(stufe) ? colors.warn : colors.fog}
      klein={klein}
    />
  );
}

const stile = StyleSheet.create({
  abzeichen: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.s,
    borderWidth: 1,
    backgroundColor: `${colors.night}B3`,
  },
  klein: { paddingHorizontal: 7, paddingVertical: 2, gap: 4 },
  leuchten: { shadowOpacity: 0.55, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 4 },
  steine: { flexDirection: 'row', gap: 2 },
  text: { fontFamily: fonts.etikett, fontSize: 11, lineHeight: 15, letterSpacing: 1.6, textTransform: 'uppercase' },
  textKlein: { fontSize: 9.5, lineHeight: 13, letterSpacing: 1.2 },
});
