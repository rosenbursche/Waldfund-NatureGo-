import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, G, Line, Path, Pattern, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { FLUESSE, GEBIRGE, GROSSLANDSCHAFTEN, UMRISS, WALDGEBIETE, WUCHSGEBIETE } from '@/data/karte';
import { naturraumById } from '@/data/naturraeume';
import type { Geometrie, Naturraum } from '@/data/typen';
import { ECHTE_VERBREITUNG } from '@/data/nachweise';
import { gebietsAnteile, hatEchteDaten, KARTE, projiziere, rasterZellen } from '@/logic/verbreitung';
import { useEinstellungen } from '@/store/einstellungen';
import { colors, fonts } from '@/theme/theme';

import { Schrift } from './Schrift';
import { skizze, SkizzePfad } from './Skizze';

/**
 * Lebendige Deutschlandkarte:
 * - Untergrund: Großlandschaften von Tiefland bis Alpen, große Flüsse, Gebirge, Waldgebiete
 * - Verbreitung als Flächen (Wuchsgebiete): voll gefüllt = häufig, schraffiert = vereinzelt
 *   (bei Baumarten: die Demo-Naturräume, in denen sie von Natur aus wachsen)
 * - Dein Standort als pulsierender Punkt – nur ungefähr (±10 km)
 *
 * Schutz der Natur: Flächen sind gröber als Rasterfelder, Fundorte bleiben geheim.
 */
type Props =
  | { art: 'raster'; artId: string; modell: string; farbe: string }
  | { art: 'naturraeume'; naturraeume: Naturraum[]; farbe: string; eigenerId?: string };

const LANDSCHAFT_FARBE: Record<string, string> = {
  'Norddeutsches Tiefland': colors.kartenTief,
  Lösshügelländer: colors.kartenHuegel,
  'Mesozoisches Schichtstufenland': colors.kartenHuegel,
  'Östliche Mittelgebirgsschwelle': colors.kartenBerg,
  'Westliche Mittelgebirgsschwelle': colors.kartenBerg,
  Alpenvorland: colors.kartenHuegel,
  Alpen: colors.kartenAlpen,
};

/** GeoJSON-Fläche → SVG-Pfad in Kartenkoordinaten */
function flaechenPfad(g: Geometrie): string {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  return polys
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
}

/** Größter Ring einer Fläche (für den handgezeichneten Umriss) */
function groessterRing(g: Geometrie): [number, number][] {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  return polys.map((p) => p[0]).sort((a, b) => b.length - a.length)[0];
}

/** Mittelpunkt einer Fläche (grob: Durchschnitt der Eckpunkte des größten Rings) */
function mitte(g: Geometrie): [number, number] {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  const ring = polys.map((p) => p[0]).sort((a, b) => b.length - a.length)[0];
  const s = ring.reduce((a, [x, y]) => [a[0] + x, a[1] + y], [0, 0]);
  return projiziere(s[0] / ring.length, s[1] / ring.length);
}

// Statische Kartenebenen nur einmal berechnen
let untergrund: {
  landschaften: { d: string; farbe: string }[];
  gebiete: { id: number; d: string }[];
  fluesse: string[];
  waelder: [number, number][];
} | null = null;
function statischeEbenen() {
  if (untergrund) return untergrund;
  untergrund = {
    landschaften: GROSSLANDSCHAFTEN.map((l) => ({
      d: flaechenPfad(l.geo),
      farbe: LANDSCHAFT_FARBE[l.name] ?? colors.kartenTief,
    })),
    gebiete: WUCHSGEBIETE.map((g) => ({ id: g.id, d: flaechenPfad(g.geo) })),
    fluesse: FLUESSE.map((f) => {
      const linien = f.geo.type === 'LineString' ? [f.geo.coordinates] : f.geo.coordinates;
      return linien
        .map(
          (l) =>
            'M' +
            l
              .map(([lon, lat]) =>
                projiziere(lon, lat)
                  .map((v) => v.toFixed(1))
                  .join(' '),
              )
              .join('L'),
        )
        .join('');
    }),
    waelder: WUCHSGEBIETE.filter((g) => WALDGEBIETE.includes(g.id)).map((g) => mitte(g.geo)),
  };
  return untergrund;
}

export function VerbreitungsKarte(props: Props) {
  const ebenen = statischeEbenen();
  const { grobStandort, naturraumId } = useEinstellungen();

  const umriss = useMemo(
    () =>
      skizze.polygon(
        groessterRing(UMRISS).map(([lon, lat]) => projiziere(lon, lat)),
        { stroke: colors.fog, strokeWidth: 1.4, roughness: 0.9, seed: 3 },
      ),
    [],
  );

  // Flächen für diese Art
  const flaechen = useMemo(() => {
    if (props.art === 'raster') {
      const stufen = new Map(gebietsAnteile(props.artId, props.modell).map((g) => [g.id, g.stufe]));
      const voll = ebenen.gebiete.filter((g) => stufen.get(g.id) === 'voll');
      const teil = ebenen.gebiete.filter((g) => stufen.get(g.id) === 'teil');
      // Echte Daten: jedes Rasterfeld mit Fund als Kästchen (genauer wird nie gezeigt).
      // Vorkommensgebiet = Felder mit Fund und ihre direkten Nachbarn (füllt kleine Meldelücken,
      // bleibt bei seltenen Arten wie dem Luchs trotzdem eng um die bekannten Gebiete).
      const echt = ECHTE_VERBREITUNG[props.artId];
      const kaestchen = (i: number, j: number) => {
        const [x0, y0] = projiziere(5.9 + i / 6, 47.3 + (j + 1) * 0.1);
        const [x1, y1] = projiziere(5.9 + (i + 1) / 6, 47.3 + j * 0.1);
        return `M${x0.toFixed(1)} ${y0.toFixed(1)}H${x1.toFixed(1)}V${y1.toFixed(1)}H${x0.toFixed(1)}Z`;
      };
      let zellen = '';
      let gebiet = '';
      if (echt) {
        const mitFund = new Set(Object.keys(echt.zellen));
        for (const z of rasterZellen()) {
          const k = `${z.i}-${z.j}`;
          if (mitFund.has(k)) zellen += kaestchen(z.i, z.j);
          let nah = false;
          for (let di = -1; di <= 1 && !nah; di++)
            for (let dj = -1; dj <= 1 && !nah; dj++) nah = mitFund.has(`${z.i + di}-${z.j + dj}`);
          if (nah) gebiet += kaestchen(z.i, z.j);
        }
      }
      return {
        voll: voll.map((g) => g.d).join(''),
        teil: teil.map((g) => g.d).join(''),
        nVoll: voll.length,
        nTeil: teil.length,
        zellen,
        gebiet,
      };
    }
    const eigene = props.naturraeume.filter((n) => n.id === props.eigenerId).map((n) => flaechenPfad(n.geometrie));
    const andere = props.naturraeume.filter((n) => n.id !== props.eigenerId).map((n) => flaechenPfad(n.geometrie));
    return {
      voll: eigene.join(''),
      teil: andere.join(''),
      nVoll: eigene.length,
      nTeil: andere.length,
      zellen: '',
      gebiet: '',
    };
  }, [props, ebenen]);

  // Standort: grober Punkt (nur wenn gewählt) – sonst Mitte des eigenen Naturraums
  const standort = useMemo(() => {
    if (grobStandort) return { punkt: projiziere(grobStandort.lon, grobStandort.lat), text: 'Du (ungefähr)' };
    const n = naturraumId ? naturraumById[naturraumId] : undefined;
    return n ? { punkt: mitte(n.geometrie), text: 'Dein Naturraum' } : null;
  }, [grobStandort, naturraumId]);

  const farbe = props.farbe;
  return (
    <View>
      <View style={stile.flaeche}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${KARTE.breite} ${KARTE.hoehe}`}>
          <Defs>
            {/* Schraffur für "vereinzelt" */}
            <Pattern id="teil" patternUnits="userSpaceOnUse" width={6} height={6} patternTransform="rotate(45)">
              <Rect width={6} height={6} fill={farbe} fillOpacity={0.12} />
              <Line x1={0} y1={0} x2={0} y2={6} stroke={farbe} strokeWidth={2.2} strokeOpacity={0.85} />
            </Pattern>
          </Defs>

          {/* Untergrund: Landschaften von Tiefland bis Alpen */}
          {ebenen.landschaften.map((l, i) => (
            <Path key={i} d={l.d} fill={l.farbe} />
          ))}
          {/* Grenzen der Wuchsgebiete, ganz fein */}
          <Path
            d={ebenen.gebiete.map((g) => g.d).join('')}
            fill="none"
            stroke={colors.moss}
            strokeWidth={0.4}
            strokeOpacity={0.6}
          />

          {flaechen.zellen ? (
            <>
              {/* Echte Daten: Vorkommensgebiet hellgrün, darauf die Rasterfelder mit Fund */}
              <Path d={flaechen.gebiet} fill={colors.vorkommen} fillOpacity={0.3} />
              <Path d={flaechen.zellen} fill={colors.vorkommen} fillOpacity={0.95} />
            </>
          ) : (
            <>
              {/* Verbreitung der Art als Flächen */}
              <Path d={flaechen.teil} fill="url(#teil)" stroke={farbe} strokeWidth={0.6} strokeOpacity={0.6} />
              <Path d={flaechen.voll} fill={farbe} fillOpacity={0.38} stroke={farbe} strokeWidth={0.8} />
            </>
          )}

          {/* Flüsse */}
          {ebenen.fluesse.map((d, i) => (
            <Path
              key={i}
              d={d}
              fill="none"
              stroke={colors.wasser}
              strokeWidth={1.3}
              strokeOpacity={0.85}
              strokeLinecap="round"
            />
          ))}

          {/* Große Waldgebiete: kleine Tannen */}
          {ebenen.waelder.map(([x, y], i) => (
            <G key={i} opacity={0.9}>
              <Tanne x={x - 5} y={y + 2} />
              <Tanne x={x + 4} y={y} gross />
              <Tanne x={x + 1} y={y + 6} />
            </G>
          ))}

          {/* Gebirge: handgezeichnete Gipfel mit Namen */}
          {GEBIRGE.map((g) => {
            const [x, y] = projiziere(g.lon, g.lat);
            return (
              <G key={g.name}>
                <Berg x={x} y={y} hoch={g.hoch} />
                <SvgText
                  x={x + (g.dx ?? 0)}
                  y={y + (g.hoch ? 16 : 13) + (g.dy ?? 0)}
                  fill={colors.moon}
                  fontSize={g.hoch ? 11 : 8.5}
                  fontFamily={fonts.notiz}
                  textAnchor="middle"
                  opacity={0.85}
                >
                  {g.name}
                </SvgText>
              </G>
            );
          })}

          <SkizzePfad drawable={umriss} />
          {[
            ['Nordsee', 40, 58],
            ['Ostsee', 230, 40],
          ].map(([t, x, y]) => (
            <SvgText key={t} x={x} y={y} fill={colors.wasser} fontSize={13} fontFamily={fonts.notiz}>
              {t}
            </SvgText>
          ))}
        </Svg>
        {standort && <StandortPunkt x={standort.punkt[0]} y={standort.punkt[1]} text={standort.text} />}
      </View>

      {/* Echte Daten = gemeldete Funde (GBIF). Leere Felder heißen oft nur: niemand hat dort etwas gemeldet. */}
      {props.art === 'raster' && hatEchteDaten(props.artId) && (
        <View style={stile.meldeHinweis} accessibilityRole="text">
          <Schrift art="klein" style={stile.meldeHinweisText}>
            Gemeldete Funde – nicht die ganze Verbreitung. Leere Felder heißen nicht, dass die Art dort fehlt.
          </Schrift>
        </View>
      )}

      {flaechen.zellen ? (
        <View style={stile.legende}>
          <View style={[stile.kaestchenVoll, { backgroundColor: colors.vorkommen }]} />
          <Schrift art="klein">Rasterfeld mit Fund</Schrift>
          <View style={[stile.kaestchenVoll, { backgroundColor: `${colors.vorkommen}55` }]} />
          <Schrift art="klein">Vorkommensgebiet</Schrift>
          <View style={[stile.punkt, { backgroundColor: colors.amber }]} />
          <Schrift art="klein">{standort?.text ?? 'Standort'}</Schrift>
        </View>
      ) : (
        <View style={stile.legende}>
          <Kaestchen farbe={farbe} />
          <Schrift art="klein">{props.art === 'raster' ? 'häufig nachgewiesen' : 'dein Naturraum'}</Schrift>
          <Kaestchen farbe={farbe} schraffiert />
          <Schrift art="klein">{props.art === 'raster' ? 'vereinzelt' : 'von Natur aus heimisch'}</Schrift>
          <View style={[stile.punkt, { backgroundColor: colors.amber }]} />
          <Schrift art="klein">{standort?.text ?? 'Standort'}</Schrift>
        </View>
      )}
      <Schrift art="etikett" style={stile.fuss}>
        {props.art === 'raster'
          ? hatEchteDaten(props.artId)
            ? `${Object.keys(ECHTE_VERBREITUNG[props.artId].zellen).length} Rasterfelder mit Fund · ${ECHTE_VERBREITUNG[props.artId].funde.toLocaleString('de-DE')} Funde seit ${ECHTE_VERBREITUNG[props.artId].seit} · GBIF.org (CC0 / CC BY 4.0)`
            : `${flaechen.nVoll} Gebiete häufig · ${flaechen.nTeil} vereinzelt · 82 Wuchsgebiete · Demo-Daten`
          : `${flaechen.nVoll + flaechen.nTeil} von 10 Demo-Naturräumen`}
      </Schrift>
    </View>
  );
}

/** Kleine Tanne als Waldsymbol */
function Tanne({ x, y, gross = false }: { x: number; y: number; gross?: boolean }) {
  const s = gross ? 1.25 : 1;
  return (
    <Polygon
      points={`${x},${y - 7 * s} ${x + 3.2 * s},${y} ${x - 3.2 * s},${y}`}
      fill={colors.waldSymbol}
      stroke={colors.night}
      strokeWidth={0.4}
    />
  );
}

/** Zwei bis drei Gipfel, die Alpen mit Schneekappen */
function Berg({ x, y, hoch = false }: { x: number; y: number; hoch?: boolean }) {
  const s = hoch ? 1.6 : 1;
  const gipfel = (dx: number, h: number, b: number) => `M${x + dx - b} ${y} L${x + dx} ${y - h} L${x + dx + b} ${y} Z`;
  return (
    <G>
      <Path
        d={gipfel(-5 * s, 8 * s, 6 * s)}
        fill={colors.kartenAlpen}
        stroke={colors.fog}
        strokeWidth={0.7}
        strokeOpacity={0.8}
      />
      <Path
        d={gipfel(3 * s, 11 * s, 7 * s)}
        fill={colors.kartenAlpen}
        stroke={colors.fog}
        strokeWidth={0.7}
        strokeOpacity={0.8}
      />
      {hoch && (
        <>
          <Path
            d={`M${x + 3 * s - 2.5 * s} ${y - 7.5 * s} L${x + 3 * s} ${y - 11 * s} L${x + 3 * s + 2.5 * s} ${y - 7.5 * s} Z`}
            fill={colors.moon}
          />
          <Path
            d={`M${x - 5 * s - 2 * s} ${y - 5.5 * s} L${x - 5 * s} ${y - 8 * s} L${x - 5 * s + 2 * s} ${y - 5.5 * s} Z`}
            fill={colors.moon}
          />
        </>
      )}
    </G>
  );
}

function Kaestchen({ farbe, schraffiert = false }: { farbe: string; schraffiert?: boolean }) {
  return (
    <View
      style={[
        stile.kaestchen,
        schraffiert
          ? { borderColor: farbe, borderStyle: 'dashed', backgroundColor: 'transparent' }
          : { backgroundColor: farbe, borderColor: farbe },
      ]}
    />
  );
}

/** Pulsierender Standort-Punkt (über der Karte, in Prozent positioniert) */
function StandortPunkt({ x, y, text }: { x: number; y: number; text: string }) {
  const ruhig = useReducedMotion();
  const puls = useSharedValue(0);
  useEffect(() => {
    if (!ruhig) puls.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), -1, false);
  }, [ruhig, puls]);
  const ring = useAnimatedStyle(() => ({
    opacity: 0.7 * (1 - puls.value),
    transform: [{ scale: 1 + puls.value * 2.2 }],
  }));
  return (
    <View
      pointerEvents="none"
      accessible
      accessibilityLabel={`${text}, ungefähr, auf etwa 10 Kilometer genau`}
      style={[stile.standort, { left: `${(x / KARTE.breite) * 100}%`, top: `${(y / KARTE.hoehe) * 100}%` }]}
    >
      <Animated.View style={[stile.standortRing, ring]} />
      <View style={stile.standortKern} />
      <Schrift style={stile.standortText}>{text}</Schrift>
    </View>
  );
}

const stile = StyleSheet.create({
  flaeche: { width: '100%', aspectRatio: KARTE.breite / KARTE.hoehe },
  kaestchenVoll: { width: 12, height: 12, borderRadius: 2 },
  legende: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 6 },
  kaestchen: { width: 12, height: 12, borderRadius: 2, borderWidth: 1.5, marginLeft: 6 },
  punkt: { width: 10, height: 10, borderRadius: 5, marginLeft: 6 },
  fuss: { fontSize: 10, marginTop: 6, textTransform: 'none' },
  meldeHinweis: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.amber,
    backgroundColor: colors.forest,
    borderRadius: 4,
  },
  meldeHinweisText: { color: colors.amber },
  standort: { position: 'absolute', width: 0, height: 0, alignItems: 'center', justifyContent: 'center' },
  standortRing: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.amber,
  },
  standortKern: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.amber,
    borderWidth: 1.5,
    borderColor: colors.night,
    shadowColor: colors.amber,
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  standortText: {
    position: 'absolute',
    top: 8,
    width: 110,
    textAlign: 'center',
    fontFamily: fonts.notiz,
    fontSize: 12,
    color: colors.amber,
    textShadowColor: colors.night,
    textShadowRadius: 4,
  },
});
