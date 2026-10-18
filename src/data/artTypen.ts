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
export type ModellParameter = { t: 'tree' | 'shrub' | 'flower' | 'shroom' | 'bird' | 'mammal' } & Record<
  string,
  string | number
>;
export type ZeichnungParameter = { t: string } & Record<string, string | number>;

export type Art = {
  id: string;
  kategorie: KategorieId;
  /** Ast im Lebensbaum, z. B. "Frühblüher" (Reihenfolge: src/data/gliederung.ts) */
  gruppe: string;
  /** Zweig am Ast, z. B. "Weiße & gelbe Teppiche" */
  zweig?: string;
  /** Grund, warum die Art der Schatz ihres Zweigs ist (nur nötig, wenn der Zweig keine sehr seltene Art hat) */
  besonders?: string;
  name: string;
  lat: string;
  icon: IconName;
  seltenheit: Seltenheit;
  schutz: Schutz;
  roteListe?: RoteListe;
  /** Giftigkeit bei Pflanzen und Pilzen: "giftig", "sehr giftig" oder "tödlich giftig" */
  giftig?: string;
  /** Gefahr bei Tieren, die nicht giftig sind (z. B. Angriff, Krankheitserreger) – kurzer Warntext */
  gefahr?: string;
  /** 3 = tödlich / lebensgefährlich, 2 = sehr giftig / kann angreifen, 1 = giftig / Vorsicht. Fehlt sie, gilt die Giftigkeit. */
  gefahrStufe?: 1 | 2 | 3;
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
