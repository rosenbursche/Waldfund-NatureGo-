import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Funde von Arten, die (noch) keine eigene Seite in der App haben, z. B. eine Segge oder ein Pilz aus der großen
 * Arten-Datenbank. Bleibt auf dem Handy. App-Arten landen weiter in der Sammlung (store/sammlung.ts).
 */
export type Entdeckung = {
  id: string; // Art-ID der Datenbank
  name: string;
  wiss: string;
  gruppe: string;
  datum: string;
  foto?: string;
  /** false = unbestätigt (Erkennung war unsicher oder der Nutzer hat anders gewählt) */
  bestaetigt: boolean;
};

type EntdeckungenState = { funde: Record<string, Entdeckung>; merken: (e: Entdeckung) => void; leeren: () => void };

export const useEntdeckungen = create<EntdeckungenState>()(
  persist(
    (set) => ({
      funde: {},
      // gleiche Art noch einmal: neues Foto, aber einmal bestätigt bleibt bestätigt
      merken: (e) =>
        set((s) => {
          const alt = s.funde[e.id];
          return {
            funde: {
              ...s.funde,
              [e.id]: alt ? { ...alt, foto: e.foto, bestaetigt: alt.bestaetigt || e.bestaetigt } : e,
            },
          };
        }),
      leeren: () => set({ funde: {} }),
    }),
    { name: 'wildfund-entdeckungen', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);
