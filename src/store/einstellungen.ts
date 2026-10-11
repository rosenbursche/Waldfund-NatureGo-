import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { PruefModus } from '@/logic/validierung';

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

  /** Bilderkennung: Demo (simuliert) oder echt (Pflanzen über den eigenen Server) */
  pruefModus: PruefModus;
  setPruefModus: (m: PruefModus) => void;
  /** Zufällige Geräte-ID – nur für das Tageskontingent des Servers, keine persönlichen Daten */
  geraetId: string;
  /** Nur Demo: manche Fotos "nicht erkennen", um die Tipps zu testen */
  demoFehlschlag: boolean;
  setDemoFehlschlag: (an: boolean) => void;
  /** Bildrate auf der Lichtung anzeigen (zum Prüfen der Leistung) */
  leistungAnzeigen: boolean;
  setLeistungAnzeigen: (an: boolean) => void;

  setNaturraum: (
    id: string,
    per: 'standort' | 'suche' | 'liste',
    grobStandort?: { lon: number; lat: number } | null,
  ) => void;
  allesZuruecksetzen: () => void;
};

/** Zufällige ID im UUID-Format (kein Bezug zu Person oder Gerät) */
function zufallsId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const useEinstellungen = create<EinstellungenState>()(
  persist(
    (set) => ({
      naturraumId: null,
      gewaehltPer: null,
      grobStandort: null,
      pruefModus: 'demo',
      setPruefModus: (m) => set({ pruefModus: m }),
      geraetId: zufallsId(),
      demoFehlschlag: false,
      setDemoFehlschlag: (an) => set({ demoFehlschlag: an }),
      leistungAnzeigen: false,
      setLeistungAnzeigen: (an) => set({ leistungAnzeigen: an }),

      setNaturraum: (id, per, grobStandort = null) => set({ naturraumId: id, gewaehltPer: per, grobStandort }),
      allesZuruecksetzen: () =>
        set({ naturraumId: null, gewaehltPer: null, grobStandort: null, pruefModus: 'demo', geraetId: zufallsId() }),
    }),
    { name: 'wildfund-einstellungen', storage: createJSONStorage(() => AsyncStorage), version: 1 },
  ),
);
