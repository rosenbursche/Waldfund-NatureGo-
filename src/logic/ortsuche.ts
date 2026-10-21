/**
 * Offline-Suche nach Ort oder Postleitzahl.
 * Daten: [PLZ, Ort, Breite, Länge] aus src/data/orte.json (GeoNames, CC BY 4.0).
 */

export type OrtEintrag = [plz: string, ort: string, lat: number, lon: number];

export type Treffer = { plz: string; ort: string; lat: number; lon: number };

/** Kleinschreibung, Umlaute vereinheitlichen: "Lüneburg" und "lueneburg" finden dasselbe. */
export function normalisiere(s: string): string {
  return s.toLowerCase().trim().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
}

export function sucheOrte(eingabe: string, orte: OrtEintrag[], max = 20): Treffer[] {
  const q = normalisiere(eingabe);
  if (q.length < 2) return [];
  const zuTreffer = ([plz, ort, lat, lon]: OrtEintrag): Treffer => ({ plz, ort, lat, lon });

  // Nur Ziffern → Postleitzahl-Suche (Anfang muss passen)
  if (/^\d+$/.test(q)) {
    return orte
      .filter((o) => o[0].startsWith(q))
      .slice(0, max)
      .map(zuTreffer);
  }

  // Sonst Ortsname: Treffer am Wortanfang zuerst, jeder Ort nur einmal
  const anfang: OrtEintrag[] = [];
  const enthalten: OrtEintrag[] = [];
  const gesehen = new Set<string>();
  for (const o of orte) {
    const name = normalisiere(o[1]);
    if (gesehen.has(name)) continue;
    if (name.startsWith(q)) anfang.push(o);
    else if (name.includes(q)) enthalten.push(o);
    else continue;
    gesehen.add(name);
  }
  const sortiert = (l: OrtEintrag[]) => l.sort((a, b) => a[1].length - b[1].length || a[1].localeCompare(b[1], 'de'));
  return [...sortiert(anfang), ...sortiert(enthalten)].slice(0, max).map(zuTreffer);
}
