import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Deine Sammlung: welche Arten du schon gefunden hast.
 * Punkte, Serien und Fotos kommen in Phase 6/7 dazu.
 */
type Fund = { datum: string; beispiel?: boolean };

type SammlungState = {
  gefunden: Record<string, Fund>;
  /** Lädt Beispielfunde wie im Prototyp, damit man die Farben in der Szene sieht */
  beispielfundeLaden: () => void;
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
      leeren: () => set({ gefunden: {} }),
    }),
    { name: 'wildfund-sammlung', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);
