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
  /** Ansicht im Katalog: 3D-Wald oder Stammbaum */
  katalogAnsicht: 'wald' | 'stammbaum';
  setKatalogAnsicht: (a: 'wald' | 'stammbaum') => void;
  /** Bildrate auf der Lichtung anzeigen (zum Prüfen der Leistung) */
  leistungAnzeigen: boolean;
  setLeistungAnzeigen: (an: boolean) => void;
  /** Startszene: gebaute 3D-Lichtung (Standard) oder Bild-Diorama (2,5D, Test) */
  startSzene: 'diorama' | '3d';
  setStartSzene: (s: 'diorama' | '3d') => void;

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
      katalogAnsicht: 'wald',
      setKatalogAnsicht: (a) => set({ katalogAnsicht: a }),
      leistungAnzeigen: false,
      setLeistungAnzeigen: (an) => set({ leistungAnzeigen: an }),
      startSzene: '3d',
      setStartSzene: (sz) => set({ startSzene: sz }),

      setNaturraum: (id, per, grobStandort = null) => set({ naturraumId: id, gewaehltPer: per, grobStandort }),
      allesZuruecksetzen: () =>
        set({ naturraumId: null, gewaehltPer: null, grobStandort: null, pruefModus: 'demo', geraetId: zufallsId() }),
    }),
    {
      name: 'wildfund-einstellungen',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      // Version 2: Startszene wieder standardmäßig 3D (das Diorama war kurz Standard)
      migrate: (alt, version) => {
        const s = alt as Partial<EinstellungenState>;
        if (version < 2) s.startSzene = '3d';
        return s as EinstellungenState;
      },
    },
  ),
);
