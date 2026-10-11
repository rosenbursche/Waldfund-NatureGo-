import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { artById } from '@/data/arten';
import { berechneBelohnung, type Belohnung } from '@/logic/fortschritt';

/**
 * Deine Sammlung: welche Arten du gefunden hast (mit Datum und Foto),
 * dazu Aktivitätspunkte (AP) und deine Serie. Alles bleibt auf dem Handy
 * und übersteht einen Neustart der App.
 */
export type Fund = { datum: string; beispiel?: boolean; foto?: string };

type SammlungState = {
  gefunden: Record<string, Fund>;
  ap: number;
  serie: number;
  letzterTag: string | null;

  /** Lädt Beispielfunde wie im Prototyp (ohne Punkte), damit man die Farben in der Szene sieht */
  beispielfundeLaden: () => void;
  /** Neuer Fund nach erfolgreicher Prüfung. Gibt zurück, was der Fund eingebracht hat. */
  sammeln: (id: string, fund: Fund, jetzt?: Date) => Belohnung;
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

export const useSammlung = create<SammlungState>()(
  persist(
    (set, get) => ({
      gefunden: {},
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
        const belohnung = berechneBelohnung(
          { ap: s.ap, serie: s.serie, letzterTag: s.letzterTag, gesammelt: echteFunde(s.gefunden) },
          artById[id],
          id,
          jetzt,
        );
        const alt = s.gefunden[id];
        // Beispielfund wird durch echten Fund ersetzt, echter Fund bekommt nur ein neues Foto
        const neuerFund = alt && !alt.beispiel ? { ...alt, foto: fund.foto ?? alt.foto } : fund;
        set({ gefunden: { ...s.gefunden, [id]: neuerFund }, ...belohnung.stand });
        return belohnung;
      },

      leeren: () => set({ gefunden: {}, ap: 0, serie: 0, letzterTag: null }),
    }),
    {
      name: 'wildfund-sammlung',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      // Version 1 kannte noch keine Punkte – alte Daten übernehmen, Punkte bei 0 starten
      migrate: (alt, version) => {
        const s = alt as Partial<SammlungState>;
        if (version < 2) return { gefunden: s.gefunden ?? {}, ap: 0, serie: 0, letzterTag: null };
        return s as SammlungState;
      },
    },
  ),
);
