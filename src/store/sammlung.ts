import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { artById } from '@/data/arten';
import { fundstueckeById } from '@/data/fundstuecke';
import { naturraumById } from '@/data/naturraeume';
import { berechneBelohnung, type Belohnung } from '@/logic/fortschritt';
import { artStufe, istBegegnung, type Stufe } from '@/logic/fundstuecke';
import { vollendeteSets } from '@/logic/katalog';

import { useEinstellungen } from './einstellungen';

/**
 * Deine Sammlung: welche Arten du gefunden hast (mit Datum und Foto),
 * dazu Aktivitätspunkte (AP) und deine Serie. Alles bleibt auf dem Handy
 * und übersteht einen Neustart der App.
 */
/** geprueft: wie der Fund geprüft wurde – 'demo' (simuliert) oder 'plantnet' (echt) */
export type Fund = { datum: string; beispiel?: boolean; foto?: string; geprueft?: 'demo' | 'plantnet' };

/** Ein gesammeltes Fundstück (Spur, Feder, Blatt …): wann und mit welchem Foto */
export type FundstueckFund = { datum: string; foto?: string };

type SammlungState = {
  gefunden: Record<string, Fund>;
  /** Art-ID → Fundstück-ID → Fund (Gesamtkonzept G1) */
  fundstuecke: Record<string, Record<string, FundstueckFund>>;
  ap: number;
  serie: number;
  letzterTag: string | null;

  /** Lädt Beispielfunde wie im Prototyp (ohne Punkte), damit man die Farben in der Szene sieht */
  beispielfundeLaden: () => void;
  /** Neuer Fund nach erfolgreicher Prüfung. Gibt zurück, was der Fund eingebracht hat. */
  sammeln: (id: string, fund: Fund, jetzt?: Date) => Belohnung;
  /** Fundstück einer Art gesammelt. Gibt die Taler-Stufe vorher und nachher zurück. */
  fundstueckSammeln: (artId: string, fundstueckId: string, fund: FundstueckFund) => { vorher: Stufe; nachher: Stufe };
  leeren: () => void;
};

const BEISPIELE = [
  'stieleiche',
  'rotbuche',
  'sandbirke',
  'buschwind',
  'fliegenpilz',
  'steinpilz',
  'amsel',
  'kohlmeise',
  'reh',
  'eichhoernchen',
];

/** IDs der echten Funde (Beispielfunde zählen nicht für Punkte und Erfolge) */
export const echteFunde = (g: Record<string, Fund>) =>
  new Set(
    Object.entries(g)
      .filter(([, f]) => !f.beispiel)
      .map(([id]) => id),
  );

/**
 * IDs der gefundenen Fundstücke einer Art. Ein Art-Fund aus der alten Sammlung
 * (Foto der ganzen Art) zählt wie die Sichtung bzw. die ganze Pflanze.
 */
export function gefundeneFundstuecke(
  artId: string,
  fundstuecke: SammlungState['fundstuecke'],
  gefunden: Record<string, Fund>,
): Set<string> {
  const ids = new Set(Object.keys(fundstuecke[artId] ?? {}));
  const f = gefunden[artId];
  if (f && !f.beispiel) {
    const begegnung = fundstueckeById[artId]?.fundstuecke.find(istBegegnung);
    if (begegnung) ids.add(begegnung.id);
  }
  return ids;
}

/** Taler-Stufe einer Art (0 = verborgen … 4 = Gold) */
export function talerStufe(artId: string, s: Pick<SammlungState, 'fundstuecke' | 'gefunden'>): Stufe {
  const daten = fundstueckeById[artId];
  if (!daten) return 0;
  return artStufe(daten.fundstuecke, gefundeneFundstuecke(artId, s.fundstuecke, s.gefunden));
}

export const useSammlung = create<SammlungState>()(
  persist(
    (set, get) => ({
      gefunden: {},
      fundstuecke: {},
      ap: 0,
      serie: 0,
      letzterTag: null,

      beispielfundeLaden: () =>
        set((s) => ({
          gefunden: {
            ...Object.fromEntries(BEISPIELE.map((id) => [id, { datum: '2026-10-01', beispiel: true }])),
            ...s.gefunden,
          },
        })),

      sammeln: (id, fund, jetzt = new Date()) => {
        const s = get();
        const gesammelt = echteFunde(s.gefunden);
        const naturraumId = useEinstellungen.getState().naturraumId;
        // schließt der Fund einen Zweig oder Ast im Lebensbaum ab? Dann gibt es einen Bonus
        const sets = vollendeteSets(id, gesammelt, naturraumId ? naturraumById[naturraumId] : undefined);
        const belohnung = berechneBelohnung(
          { ap: s.ap, serie: s.serie, letzterTag: s.letzterTag, gesammelt },
          artById[id],
          id,
          jetzt,
          sets,
        );
        const alt = s.gefunden[id];
        // Beispielfund wird durch echten Fund ersetzt, echter Fund bekommt nur ein neues Foto
        const neuerFund =
          alt && !alt.beispiel
            ? { ...alt, foto: fund.foto ?? alt.foto, geprueft: fund.geprueft ?? alt.geprueft }
            : fund;
        set({ gefunden: { ...s.gefunden, [id]: neuerFund }, ...belohnung.stand });
        return belohnung;
      },

      fundstueckSammeln: (artId, fundstueckId, fund) => {
        const s = get();
        const vorher = talerStufe(artId, s);
        const alt = s.fundstuecke[artId]?.[fundstueckId];
        // erneutes Foto ersetzt nur das Bild, das erste Datum bleibt
        const neu = alt ? { ...alt, foto: fund.foto ?? alt.foto } : fund;
        const fundstuecke = { ...s.fundstuecke, [artId]: { ...s.fundstuecke[artId], [fundstueckId]: neu } };
        set({ fundstuecke });
        return { vorher, nachher: talerStufe(artId, { fundstuecke, gefunden: s.gefunden }) };
      },

      leeren: () => set({ gefunden: {}, fundstuecke: {}, ap: 0, serie: 0, letzterTag: null }),
    }),
    {
      name: 'wildfund-sammlung',
      storage: createJSONStorage(() => AsyncStorage),
      version: 3,
      // Version 1 kannte noch keine Punkte – alte Daten übernehmen, Punkte bei 0 starten.
      // Version 2 kannte noch keine Fundstücke.
      migrate: (alt, version) => {
        const s = alt as Partial<SammlungState>;
        if (version < 2) return { gefunden: s.gefunden ?? {}, fundstuecke: {}, ap: 0, serie: 0, letzterTag: null };
        if (version < 3) return { ...s, fundstuecke: {} } as SammlungState;
        return s as SammlungState;
      },
    },
  ),
);
