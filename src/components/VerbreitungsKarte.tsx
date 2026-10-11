import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

import { DEUTSCHLAND_UMRISS } from '@/data/verbreitung';
import type { Naturraum } from '@/data/typen';
import { KARTE, projiziere, rasterZellen, vorkommen } from '@/logic/verbreitung';
import { colors, fonts } from '@/theme/theme';

import { Schrift } from './Schrift';
import { skizze, SkizzePfad } from './Skizze';

/**
 * Deutschlandkarte. Zwei Varianten:
 * - Arten: Rasterpunkte (TK25) mit Demo-Vorkommen
 * - Baumarten: die Demo-Naturräume, in denen die Art von Natur aus heimisch ist
 *
 * Nie genauer als ein Rasterfeld – damit Fundorte seltener Arten geschützt bleiben.
 */
type Props =
  | { art: 'raster'; artId: string; modell: string; farbe: string }
  | { art: 'naturraeume'; naturraeume: Naturraum[]; farbe: string; eigenerId?: string };

/** Viele kleine Kreise als ein einziger SVG-Pfad – viel schneller als tausende Einzelkreise. */
function kreisPfad(punkte: [number, number][], r: number): string {
  return punkte.map(([x, y]) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`).join('');
}

export function VerbreitungsKarte(props: Props) {
  const umriss = useMemo(
    () =>
      skizze.polygon(
        DEUTSCHLAND_UMRISS.map(([lon, lat]) => projiziere(lon, lat)),
        { stroke: colors.fog, strokeWidth: 1.4, roughness: 0.9, seed: 3 },
      ),
    [],
  );

  const inhalt = useMemo(() => {
    if (props.art === 'raster') {
      const occ = vorkommen(props.artId, props.modell);
      const zellen = rasterZellen();
      const ja: [number, number][] = [];
      const nein: [number, number][] = [];
      zellen.forEach((z, i) => (occ[i] ? ja : nein).push(projiziere(z.lon, z.lat)));
      return {
        typ: 'raster' as const,
        ja: kreisPfad(ja, 2.3),
        nein: kreisPfad(nein, 1.2),
        n: ja.length,
        gesamt: zellen.length,
      };
    }
    const flaechen = props.naturraeume.map((n) => {
      const polys = n.geometrie.type === 'Polygon' ? [n.geometrie.coordinates] : n.geometrie.coordinates;
      const d = polys
        .map((poly) =>
          poly
            .map(
              (ring) =>
                'M' +
                ring
                  .map(([lon, lat]) =>
                    projiziere(lon, lat)
                      .map((v) => v.toFixed(1))
                      .join(' '),
                  )
                  .join('L') +
                'Z',
            )
            .join(''),
        )
        .join('');
      return { id: n.id, d };
    });
    return { typ: 'naturraeume' as const, flaechen };
  }, [props]);

  return (
    <View>
      <View style={stile.flaeche}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${KARTE.breite} ${KARTE.hoehe}`}>
          {inhalt.typ === 'raster' ? (
            <>
              <Path d={inhalt.nein} fill={colors.moss} opacity={0.45} />
              <Path d={inhalt.ja} fill={props.farbe} />
            </>
          ) : (
            inhalt.flaechen.map((f) => (
              <Path
                key={f.id}
                d={f.d}
                fill={props.farbe}
                fillOpacity={props.art === 'naturraeume' && f.id === props.eigenerId ? 0.85 : 0.5}
                stroke={props.farbe}
                strokeWidth={0.8}
              />
            ))
          )}
          <SkizzePfad drawable={umriss} />
          {[
            ['Nordsee', 40, 58],
            ['Ostsee', 230, 40],
            ['Alpen', 232, 436],
          ].map(([t, x, y]) => (
            <SvgText key={t} x={x} y={y} fill={colors.fog} fontSize={13} fontFamily={fonts.hand}>
              {t}
            </SvgText>
          ))}
        </Svg>
      </View>
      <View style={stile.legende}>
        <Punkt farbe={props.farbe} />
        <Schrift art="klein">{props.art === 'raster' ? 'Nachweis im Rasterfeld' : 'von Natur aus heimisch'}</Schrift>
        {props.art === 'raster' && (
          <>
            <Punkt farbe={colors.moss} />
            <Schrift art="klein">kein Nachweis</Schrift>
          </>
        )}
      </View>
      <Schrift art="etikett" style={stile.fuss}>
        {inhalt.typ === 'raster'
          ? `${inhalt.n} von ${inhalt.gesamt} Feldern · TK25-Raster (10′ × 6′) · Demo-Daten`
          : `${props.art === 'naturraeume' ? props.naturraeume.length : 0} von 10 Demo-Naturräumen`}
      </Schrift>
    </View>
  );
}

function Punkt({ farbe }: { farbe: string }) {
  return <View style={[stile.punkt, { backgroundColor: farbe }]} />;
}

const stile = StyleSheet.create({
  flaeche: { width: '100%', aspectRatio: KARTE.breite / KARTE.hoehe },
  legende: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 6 },
  punkt: { width: 10, height: 10, borderRadius: 5, marginLeft: 6 },
  fuss: { fontSize: 10, marginTop: 6, textTransform: 'none' },
});
