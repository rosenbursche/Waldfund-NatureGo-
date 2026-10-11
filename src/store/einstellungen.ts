import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Einstellungen der App, dauerhaft auf dem Handy gespeichert (AsyncStorage).
 * Nichts davon verlässt das Gerät.
 *
 * Datenschutz: Vom Standort speichern wir höchstens einen auf ~10 km
 * gerundeten Punkt – und nur, wenn er über "Standort verwenden" kam.
 */
type EinstellungenState = {
  naturraumId: string | null;
  /** Wie der Naturraum gewählt wurde – nur zur Anzeige in den Einstellungen */
  gewaehltPer: 'standort' | 'suche' | 'liste' | null;
  /** grober Standort (0,1°) oder null */
  grobStandort: { lon: number; lat: number } | null;

  setNaturraum: (
    id: string,
    per: 'standort' | 'suche' | 'liste',
    grobStandort?: { lon: number; lat: number } | null,
  ) => void;
  allesZuruecksetzen: () => void;
};

export const useEinstellungen = create<EinstellungenState>()(
  persist(
    (set) => ({
      naturraumId: null,
      gewaehltPer: null,
      grobStandort: null,

      setNaturraum: (id, per, grobStandort = null) => set({ naturraumId: id, gewaehltPer: per, grobStandort }),
      allesZuruecksetzen: () => set({ naturraumId: null, gewaehltPer: null, grobStandort: null }),
    }),
    {
      name: 'wildfund-einstellungen',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
