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
