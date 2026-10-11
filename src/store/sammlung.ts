import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Deine Sammlung: welche Arten du schon gefunden hast – mit Datum und eigenem Foto.
 * Punkte und Serien kommen in Phase 7 dazu.
 */
export type Fund = { datum: string; beispiel?: boolean; foto?: string };

type SammlungState = {
  gefunden: Record<string, Fund>;
  /** Lädt Beispielfunde wie im Prototyp, damit man die Farben in der Szene sieht */
  beispielfundeLaden: () => void;
  /** Neuer Fund nach erfolgreicher Prüfung. Ein schon gesammelter Fund behält sein erstes Datum. */
  sammeln: (id: string, fund: Fund) => void;
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

export const useSammlung = create<SammlungState>()(
  persist(
    (set) => ({
      gefunden: {},
      beispielfundeLaden: () =>
        set((s) => ({
          gefunden: {
            ...Object.fromEntries(BEISPIELE.map((id) => [id, { datum: '2026-10-01', beispiel: true }])),
            ...s.gefunden,
          },
        })),
      sammeln: (id, fund) =>
        set((s) => {
          const alt = s.gefunden[id];
          // Beispielfund wird durch echten Fund ersetzt, echter Fund bekommt nur ein neues Foto
          const neu = alt && !alt.beispiel ? { ...alt, foto: fund.foto ?? alt.foto } : fund;
          return { gefunden: { ...s.gefunden, [id]: neu } };
        }),
      leeren: () => set({ gefunden: {} }),
    }),
    { name: 'wildfund-sammlung', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);
