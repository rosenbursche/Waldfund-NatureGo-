import type { Geometrie, Naturraum, Ring } from '@/data/typen';

/**
 * Punkt-in-Polygon: Liegt ein Punkt (Länge, Breite) in einem Ring?
 * Methode "Strahl werfen": Wir zählen, wie oft ein Strahl vom Punkt nach rechts
 * die Grenze schneidet. Ungerade Anzahl = innen.
 */
export function punktInRing(lon: number, lat: number, ring: Ring): boolean {
  let innen = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const schneidet = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (schneidet) innen = !innen;
  }
  return innen;
}

/** Polygon = Außenring + evtl. Löcher (z. B. eine Enklave). */
function punktInPolygon(lon: number, lat: number, polygon: Ring[]): boolean {
  const [aussen, ...loecher] = polygon;
  if (!punktInRing(lon, lat, aussen)) return false;
  return !loecher.some((loch) => punktInRing(lon, lat, loch));
}

export function punktInGeometrie(lon: number, lat: number, g: Geometrie): boolean {
  if (g.type === 'Polygon') return punktInPolygon(lon, lat, g.coordinates);
  return g.coordinates.some((poly) => punktInPolygon(lon, lat, poly));
}

/** Findet den Naturraum, in dem der Punkt liegt – oder `undefined`, wenn keiner passt. */
export function findeNaturraum(lon: number, lat: number, naturraeume: Naturraum[]): Naturraum | undefined {
  return naturraeume.find((n) => punktInGeometrie(lon, lat, n.geometrie));
}

/**
 * Standort grob machen (Datenschutz): auf 0,1° runden, das sind etwa 7–11 km.
 * Nur dieser grobe Wert darf gespeichert werden.
 */
export function vergroebern(lon: number, lat: number): { lon: number; lat: number } {
  return { lon: Math.round(lon * 10) / 10, lat: Math.round(lat * 10) / 10 };
}

/** Abstand Punkt → Strecke in km (flache Näherung, reicht für Deutschland). */
function abstandZuStrecke(lon: number, lat: number, a: [number, number], b: [number, number]): number {
  const kx = 111.32 * Math.cos((lat * Math.PI) / 180); // km pro Längengrad
  const ky = 110.57; // km pro Breitengrad
  const ax = (a[0] - lon) * kx;
  const ay = (a[1] - lat) * ky;
  const bx = (b[0] - lon) * kx;
  const by = (b[1] - lat) * ky;
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2));
  return Math.hypot(ax + t * dx, ay + t * dy);
}

function abstandZuGeometrie(lon: number, lat: number, g: Geometrie): number {
  if (punktInGeometrie(lon, lat, g)) return 0;
  const polygone = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  let min = Infinity;
  for (const poly of polygone) {
    for (const ring of poly) {
      for (let i = 1; i < ring.length; i++) min = Math.min(min, abstandZuStrecke(lon, lat, ring[i - 1], ring[i]));
    }
  }
  return min;
}

/** Nächster Naturraum und Entfernung in km (0 = Punkt liegt darin). */
export function naechsterNaturraum(
  lon: number,
  lat: number,
  naturraeume: Naturraum[],
): { naturraum: Naturraum; km: number } {
  let bester = { naturraum: naturraeume[0], km: Infinity };
  for (const n of naturraeume) {
    const km = abstandZuGeometrie(lon, lat, n.geometrie);
    if (km < bester.km) bester = { naturraum: n, km };
  }
  return bester;
}
