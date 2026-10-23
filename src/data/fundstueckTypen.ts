/**
 * Datentypen für Fundstücke (Gesamtkonzept G1, `docs/KONZEPT-GESAMT.md` Abschnitt 2).
 * Jede Art hat mehrere Fundstücke: Spuren, Federn, Blätter, Stimmen … und die Sichtung selbst.
 * Gesammelt wird nur per Foto (oder Tonaufnahme), nie zum Mitnehmen.
 */

export type FundstueckTyp =
  | 'spur'
  | 'faehrte'
  | 'losung'
  | 'frass'
  | 'bau'
  | 'nest'
  | 'feder'
  | 'stimme'
  | 'haar'
  | 'blatt'
  | 'rinde'
  | 'knospe'
  | 'bluete'
  | 'frucht'
  | 'samen'
  | 'keimling'
  | 'fruchtkoerper'
  | 'sichtung'
  | 'ganz'
  | 'sonstiges';

/** 1 = fast jeder Spaziergang, 2 = öfter, 3 = selten, 4 = Glückstreffer */
export type Findbarkeit = 1 | 2 | 3 | 4;

/** Monat 1–12 */
export type Monat = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Fundstueck = {
  /** eindeutig innerhalb der Art, z. B. "suhle" */
  id: string;
  name: string;
  typ: FundstueckTyp;
  kurz: string;
  erkennen: string[];
  verwechslung?: string;
  /** Monate, in denen man das Fundstück findet */
  monate: Monat[];
  findbarkeit: Findbarkeit;
  wo: string;
  /** Schutz- oder Sicherheitshinweis (z. B. „nicht anfassen“) */
  schutz?: string;
  /** Quellen-IDs aus `ArtFundstuecke.quellen` */
  quellen: string[];
};

export type ArtFundstuecke = {
  artId: string;
  fundstuecke: Fundstueck[];
  quellen: Record<string, { titel: string; url: string }>;
};
