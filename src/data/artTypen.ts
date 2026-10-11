/** Datentypen für die Arten im Katalog (Pflanzen, Pilze, Vögel, Säugetiere). */

export type KategorieId = 'pflanzen' | 'pilze' | 'voegel' | 'saeuger';

/** 1 = Häufig, 2 = Selten, 3 = Sehr selten, 4 = Legendär */
export type Seltenheit = 1 | 2 | 3 | 4;

/** 0 = nicht geschützt, 1 = besonders geschützt, 2 = streng geschützt */
export type Schutz = 0 | 1 | 2;

/** Kategorien der Roten Liste Deutschlands */
export type RoteListe = '*' | 'V' | '3' | '2' | '1';

export type IconName = 'tree' | 'flower' | 'shroom' | 'bird' | 'mammal';

/**
 * Parameter für das 3D-Modell und die Lehrbuch-Zeichnung.
 * Die Kurznamen stammen aus dem Prototyp und werden in Phase 5 von den
 * Zeichen-Funktionen gelesen. "t" ist der Modelltyp, c1/c2 sind Farben.
 */
export type ModellParameter = { t: 'tree' | 'flower' | 'shroom' | 'bird' | 'mammal' } & Record<
  string,
  string | number
>;
export type ZeichnungParameter = { t: string } & Record<string, string | number>;

export type Art = {
  id: string;
  kategorie: KategorieId;
  /** Gruppe im Stammbaum, z. B. "Frühblüher". "Mystery" = erscheint in der Mystery-Zone */
  gruppe: string;
  name: string;
  lat: string;
  icon: IconName;
  seltenheit: Seltenheit;
  schutz: Schutz;
  roteListe?: RoteListe;
  /** nur bei Pilzen: "giftig" oder "tödlich giftig" */
  giftig?: string;
  lebensraum: string;
  saison: string;
  groesse: string;
  wusstestDu: string;
  /** Rätseltext für die Mystery-Zone (nur Seltenheit ≥ 3) */
  raetsel?: string;
  /** manuelle Zeilenumbrüche für lange Namen im Stammbaum */
  namensZeilen?: string[];
  /** Schlüssel in VERBREITUNG (src/data/verbreitung.ts) */
  verbreitung: string;
  modell: ModellParameter;
  zeichnung: ZeichnungParameter;
};
