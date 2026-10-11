import weisswedelhirsch from '../../assets/modelle/test/weisswedelhirsch.glb';

/**
 * Realistische 3D-Modelle (GLB) mit Herkunft und Lizenz.
 * Jedes Modell aus fremder Quelle MUSS hier mit Namensnennung stehen (und in DATENQUELLEN.md).
 * Vorgaben für neue Modelle: docs/3D-PIPELINE.md
 */
export type ModellEintrag = {
  id: string;
  /** Art, die das Modell wirklich zeigt */
  zeigt: string;
  /** Art-ID in Wildfund, falls das Modell dort verwendet wird – sonst null (nur Test) */
  artId: string | null;
  titel: string;
  autor: string;
  lizenz: string;
  quelle: string;
  datei: number;
  animiert: boolean;
  dreiecke: number;
};

export const MODELLE: ModellEintrag[] = [
  {
    id: 'weisswedelhirsch-test',
    zeigt: 'Weißwedelhirsch (Odocoileus virginianus) – kein Reh, nur Technik-Test',
    artId: null,
    titel: 'Realistic Deer',
    autor: 'pighunt3r15',
    lizenz: 'CC BY 4.0',
    quelle: 'https://sketchfab.com/3d-models/realistic-deer-76039b75cdc0492a80680c2404725496',
    datei: weisswedelhirsch,
    animiert: false,
    dreiecke: 9754,
  },
];

/** Namensnennung im üblichen Format */
export const namensnennung = (m: ModellEintrag) => `„${m.titel}“ von ${m.autor} (Sketchfab), ${m.lizenz}`;
