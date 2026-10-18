import type { FotoId } from './fotos';
import { BIBER } from './tiere/biber';
import { DACHS } from './tiere/dachs';
import { EICHHOERNCHEN } from './tiere/eichhoernchen';
import { FELDHASE } from './tiere/feldhase';
import { FUCHS } from './tiere/fuchs';
import { IGEL } from './tiere/igel';
import { LUCHS } from './tiere/luchs';
import { REH } from './tiere/reh';
import { WILDKATZE } from './tiere/wildkatze';
import { WILDSCHWEIN } from './tiere/wildschwein';

/**
 * Daten für die grafischen Tierseiten. Alles, was dort gezeichnet wird, kommt aus diesen Daten:
 * Größe, Körpermerkmale, Jahreslauf, Tagesrhythmus, Futter, Spuren, Gefahren, Sicherheits-Hinweis.
 * Jedes Tier hat eine eigene Datei in `src/data/tiere/` – und eigene Besonderheiten
 * (Winterschlaf, Leben am Wasser oder im Baum, gestreifte Frischlinge …).
 *
 * Die Seite soll fast ohne Text auskommen – deshalb sind die Beschriftungen kurz (2–4 Wörter).
 *
 * TODO fachlich prüfen: Alle Angaben sind allgemeines Bestimmungsbuch- und Jagdkunde-Wissen,
 * selbst zusammengefasst und für die Grafik vereinfacht (z. B. Monatsgrenzen). Bitte von einer
 * Fachperson gegenlesen lassen.
 */

/** Welche Zeichnung (Figur) eine Art bekommt */
export type FigurName =
  'reh' | 'fuchs' | 'eichhoernchen' | 'wildschwein' | 'dachs' | 'igel' | 'feldhase' | 'biber' | 'wildkatze' | 'luchs';

export type KoerperIcon =
  | 'spiegel'
  | 'geweih'
  | 'ohr'
  | 'nase'
  | 'bein'
  | 'auge'
  | 'lunte'
  | 'pfote'
  | 'zahn'
  | 'stachel'
  | 'kelle'
  | 'krallen'
  | 'streifen';

export type NahrungIcon =
  | 'knospe'
  | 'trieb'
  | 'kraut'
  | 'blatt'
  | 'eichel'
  | 'maus'
  | 'wurm'
  | 'kaefer'
  | 'beere'
  | 'knochen'
  | 'zapfen'
  | 'nuss'
  | 'pilz'
  | 'wurzel'
  | 'mais'
  | 'raupe'
  | 'schnecke'
  | 'gras'
  | 'rinde'
  | 'vogel'
  | 'reh'
  | 'hase'
  | 'fuchs';

/** Spuren-Karten. `tritt` ist das Trittsiegel – seine Form steht in `TierSeite.tritt` */
export type SpurIcon =
  | 'tritt'
  | 'losung'
  | 'verbiss'
  | 'fegen'
  | 'kot'
  | 'bau'
  | 'rupfung'
  | 'zapfen'
  | 'nuss'
  | 'kobel'
  | 'latrine'
  | 'suhle'
  | 'malbaum'
  | 'sanduhr'
  | 'burg'
  | 'sasse'
  | 'riss'
  | 'laubnest'
  | 'holzstapel'
  | 'gebraech';

/** Form des Trittsiegels: Huf (Reh), Huf mit Afterklauen (Wildschwein), Pfoten verschiedener Tiere */
export type TrittForm = 'huf' | 'huf_af' | 'pfote' | 'katze' | 'pfote5' | 'hase' | 'nager' | 'biber';
export type GefahrIcon = 'wolf' | 'maehen' | 'auto' | 'marder' | 'greif';
export type GeweihZustand = { art: 'keins' | 'bast' | 'blank'; groesse: number };

/** Landschaft für Lebensraum-Bild und 3D-Hero */
export type Landschaft = 'waldrand' | 'wald' | 'feld' | 'ufer';
/** 3D-Umgebung im Hero (passend zum Lebensraum) */
export type Umgebung = Landschaft;
/** Zusätzliche Dinge in der 3D-Umgebung */
export type Extra = 'bau' | 'suhle' | 'burg' | 'kobel' | 'laubnest';
/** Zone im Lebensraum-Bild: 0 = links, 1 = Mitte, 2 = rechts (Bedeutung je Landschaft) */
export type Zone = 0 | 1 | 2;

/** Foto mit antippbaren Punkten (Prozent von links/oben), Schlüssel = id aus `koerper` */
export type FotoBlick = { foto: FotoId; punkte: Record<string, [number, number]> };

/** Echte Fotos einer Tierseite (alle optional außer dem Hero-Foto) */
export type TierFotos = {
  hero: FotoId;
  /** waagerechter Bildausschnitt im Hero in Prozent (0 = linker Rand, 100 = rechter Rand) */
  heroX?: number;
  erkunden?: { maennlich?: FotoBlick; weiblich?: FotoBlick; alle?: FotoBlick };
  sommer?: FotoId;
  winter?: FotoId;
  jung?: FotoId;
  aktiv?: FotoId;
  ruhe?: FotoId;
  spuren?: Partial<Record<SpurIcon, FotoId>>;
  hinweis?: FotoId;
  /** Landschaftsfoto für den Lebensraum: Lage der drei Zonen aus `lebensraum.orte` (Prozent links/oben) */
  lebensraum?: { foto: FotoId; zonen: [[number, number], [number, number], [number, number]] };
};

export type TierSeite = {
  figur: FigurName;
  umgebung: Umgebung;
  extras?: Extra[];
  /** echte Fotos (Wikimedia Commons, siehe src/data/fotos.ts) */
  fotos?: TierFotos;
  /** Fellfarben (Daten, keine UI-Farben). `jung`: Fell junger Tiere (dunkle Welpen, braune Frischlinge) */
  farben: {
    sommer: string;
    winter: string;
    hell: string;
    spiegel: string;
    dunkel: string;
    geweih: string;
    auge: string;
    jung?: string;
    /** Nase, Zähne o. Ä. (z. B. rosa Nase der Wildkatze, orange Biberzähne) */
    akzent?: string;
  };
  /** Nur wenn sich die Geschlechter sichtbar unterscheiden (Reh: Geweih) */
  geschlechter?: { maennlich: string; weiblich: string };
  jungName: string;
  /** Größe: Schulterhöhe oder (bei kleinen Tieren) Kopf-Rumpf-Länge in cm; Gewicht in kg oder g */
  groesse: { mass: 'schulter' | 'laenge'; cm: [number, number]; gewicht: [number, number]; einheit: 'kg' | 'g' };
  /** Antippbare Punkte auf der Zeichnung (Koordinaten im Zeichenraster der Figur, Breite 200) */
  koerper: { id: string; x: number; y: number; icon: KoerperIcon; kurz: string; nurMaennlich?: boolean }[];
  /** Aktive Zeiten (Stunden 0–24); staerke 2 = Hauptaktivität, 1 = kurz unterwegs */
  aktivitaet: { von: number; bis: number; staerke: 1 | 2 }[];
  /** Beschriftung der Tagesuhr: [ruht, kurz aktiv, sehr aktiv] und Symbol für „aktiv“ */
  aktivTexte: [string, string, string];
  aktivSymbol: NahrungIcon;
  /** Ereignisse im Jahr (Monate 1–12); `symbol` ist der Name eines Symbols aus TierSymbol */
  jahr: { id: string; kurz: string; monate: number[]; farbe: 'amber' | 'rune' | 'fog' | 'rare'; symbol: string }[];
  /** Ereignis, in dem die Jungen geboren werden: Die Mutter liegt dann bei den Jungen */
  geburt: string;
  /** Winterschlaf oder Winterruhe: In diesen Monaten liegt das Tier im Jahresrad eingerollt */
  ruhe?: { monate: number[]; kurz: string };
  /** Fell je Monat: 0 = Winterfell, 1 = Sommerfell, dazwischen Fellwechsel */
  fell: number[];
  /** Geweih des Männchens je Monat (Index 0 = Januar) – nur beim Reh */
  geweih?: GeweihZustand[];
  /** Jungtier: wann es draußen zu sehen ist, wann mit Flecken (Kitz), Streifen (Frischling) oder dunklem Fell */
  jung: { sichtbar: number[]; flecken?: number[]; streifen?: number[]; dunkel?: number[] };
  nahrung: { icon: NahrungIcon; kurz: string; monate: number[] }[];
  spuren: { icon: SpurIcon; kurz: string; cm?: [number, number] }[];
  tritt: TrittForm;
  /** Fährte: paarig versetzt (Reh), „geschnürt“ auf einer Linie (Fuchs, Katzen) oder Sprungspur in Vierergruppen */
  faehrte: 'versetzt' | 'geschnuert' | 'sprung';
  gefahren: { artId?: string; icon?: GefahrIcon; kurz: string; nurJung?: boolean }[];
  /** Lebensraum-Bild: Landschaft, Zone am Tag und in der Dämmerung, Beschriftung der drei Zonen;
   *  `oben`: In dieser Zone sitzt das Tier hoch im Baum (Eichhörnchen) */
  lebensraum: {
    landschaft: Landschaft;
    tag: Zone;
    nacht: Zone;
    orte: [string, string, string];
    oben?: Zone[];
    /** Haltung am Tag und in der Dämmerung (Standard: steht, aktiv) – z. B. Igel schläft tagsüber */
    posen?: ['steht' | 'aktiv' | 'liegt', 'steht' | 'aktiv' | 'liegt'];
  };
  /** Hinweis am Ende: Titel, Bild (Jungtier im Gras oder Tier auf Abstand) und Text –
   *  aus arten.ts („wusstestDu“ bzw. „gefahr“) oder ein eigener Text */
  hinweis: { titel: string; bild: 'jung' | 'abstand'; text: 'wusstestDu' | 'gefahr' | 'eigen'; eigenerText?: string };
};

export const TIER_SEITEN: Record<string, TierSeite> = {
  reh: REH,
  fuchs: FUCHS,
  eichhoernchen: EICHHOERNCHEN,
  wildschwein: WILDSCHWEIN,
  dachs: DACHS,
  igel: IGEL,
  feldhase: FELDHASE,
  biber: BIBER,
  wildkatze: WILDKATZE,
  luchs: LUCHS,
};

export const tierSeite = (id: string): TierSeite | undefined => TIER_SEITEN[id];
