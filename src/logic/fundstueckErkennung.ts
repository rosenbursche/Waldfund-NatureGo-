import { artById } from '@/data/arten';
import { FUNDSTUECKE } from '@/data/fundstuecke';
import type { Fundstueck } from '@/data/fundstueckTypen';

/**
 * Was hast du fotografiert? (Gesamtkonzept 17.4) – Der Nutzer wählt zuerst den Typ, weil die Erkennung
 * Spur, Losung, Blatt … allein nicht sicher unterscheidet (recherche/erkennung/fundstuecke-test.md).
 * Danach vergleicht der Server das Foto nur mit den Arten, die genau dieses Fundstück haben.
 */
export type FundTyp = 'ganz' | 'trittsiegel' | 'losung' | 'feder' | 'frass' | 'blatt' | 'rinde' | 'knospe' | 'frucht';

export const FUND_TYPEN: { id: FundTyp; name: string; beispiel: string }[] = [
  { id: 'ganz', name: 'Ganzes Lebewesen', beispiel: 'Tier, Vogel, Pflanze, Pilz' },
  { id: 'trittsiegel', name: 'Spur', beispiel: 'Trittsiegel, Fährte' },
  { id: 'losung', name: 'Losung', beispiel: 'Kot' },
  { id: 'feder', name: 'Feder', beispiel: '' },
  { id: 'frass', name: 'Fraßspur', beispiel: 'Zapfen, Nagespur' },
  { id: 'blatt', name: 'Blatt', beispiel: 'auch Nadeln' },
  { id: 'rinde', name: 'Rinde', beispiel: '' },
  { id: 'knospe', name: 'Knospe', beispiel: '' },
  { id: 'frucht', name: 'Frucht', beispiel: 'Nuss, Zapfen, Samen' },
];

/** Welche Fundstücke der Daten zu welchem Typ gehören (wie erkennung/fundstueck_vektoren.py) */
function passt(f: Fundstueck, typ: FundTyp): boolean {
  switch (typ) {
    case 'trittsiegel':
      return f.typ === 'faehrte' || (f.typ === 'spur' && (f.id === 'trittsiegel' || f.id === 'spur'));
    case 'frucht':
      return f.typ === 'frucht' || f.typ === 'samen';
    case 'ganz':
      return false;
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

const norm = (s: string) => s.toLowerCase().trim().split(/\s+/).slice(0, 2).join(' ');

/** Fundstück-Kandidat zu einem Vorschlag des Servers (über den wissenschaftlichen Namen) */
export function fundKandidat(typ: FundTyp, wiss: string): FundKandidat | undefined {
  for (const k of kandidatenFuerTyp(typ).values()) if (norm(k.lat) === norm(wiss)) return k;
  return undefined;
}
