import { artById } from '@/data/arten';
import { FUNDSTUECKE } from '@/data/fundstuecke';
import type { Fundstueck } from '@/data/fundstueckTypen';

/**
 * Fundstücke erkennen (Gesamtkonzept 17.4): Die App fragt nicht, was fotografiert wurde. Der Server erkennt selbst,
 * ob das Foto ein ganzes Lebewesen oder ein Fundstück zeigt (Spur, Losung, Feder, Fraßspur, Blatt, Rinde, Knospe,
 * Frucht), und vergleicht dann mit den Arten, die genau dieses Fundstück haben.
 * Die App schickt dafür einmal mit, welche Arten welches Fundstück haben (aus src/data/fundstuecke.json).
 */
export type FundTyp = 'trittsiegel' | 'losung' | 'feder' | 'frass' | 'blatt' | 'rinde' | 'knospe' | 'frucht';

export const FUND_TYPEN: FundTyp[] = ['trittsiegel', 'losung', 'feder', 'frass', 'blatt', 'rinde', 'knospe', 'frucht'];

/** Welche Fundstücke der Daten zu welchem Typ gehören (wie erkennung/fundstueck_vektoren.py) */
function passt(f: Fundstueck, typ: FundTyp): boolean {
  switch (typ) {
    case 'trittsiegel':
      return f.typ === 'faehrte' || (f.typ === 'spur' && (f.id === 'trittsiegel' || f.id === 'spur'));
    case 'frucht':
      return f.typ === 'frucht' || f.typ === 'samen';
    default:
      return f.typ === typ;
  }
}

export type FundKandidat = { artId: string; lat: string; fundstueck: Fundstueck };

/** Alle App-Arten mit einem Fundstück dieses Typs → nach wissenschaftlichem Namen (für den Server) */
export function kandidatenFuerTyp(typ: FundTyp): Map<string, FundKandidat> {
  const aus = new Map<string, FundKandidat>();
  for (const art of FUNDSTUECKE) {
    const lat = artById[art.artId]?.lat;
    const f = art.fundstuecke.find((x) => passt(x, typ));
    if (lat && f && !aus.has(lat)) aus.set(lat, { artId: art.artId, lat, fundstueck: f });
  }
  return aus;
}

/** Für den Server: je Fundstück-Typ die wissenschaftlichen Namen der Arten, die es haben */
export function fundstueckKatalog(): Record<FundTyp, string[]> {
  return Object.fromEntries(FUND_TYPEN.map((t) => [t, [...kandidatenFuerTyp(t).keys()]])) as Record<FundTyp, string[]>;
}

const norm = (s: string) => s.toLowerCase().trim().split(/\s+/).slice(0, 2).join(' ');

/** Fundstück-Kandidat zu einem Vorschlag des Servers (über den wissenschaftlichen Namen) */
export function fundKandidat(typ: FundTyp | null | undefined, wiss: string): FundKandidat | undefined {
  if (!typ) return undefined;
  for (const k of kandidatenFuerTyp(typ).values()) if (norm(k.lat) === norm(wiss)) return k;
  return undefined;
}
