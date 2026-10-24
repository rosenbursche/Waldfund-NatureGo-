/**
 * Feldkatalog Säugetiere: alle festen Datenpunkte einer Säugetier-Seite (Vorlage Reh und Wildschwein).
 * Entwurf: docs/DATENBANK-ARTEN.md Abschnitt 2.
 *
 * - `kapitel`: wo die Angabe auf der Seite erscheint
 * - `typ`: Form des Werts (für Prüfung und Rechercheauftrag)
 * - `pflicht`: nötig, damit die Art in die App kommt
 * - `app`: wo der Wert heute in den App-Daten steht (art = src/data/arten.ts, steckbrief = src/data/steckbriefe.ts,
 *   seite = src/data/tiere/<id>.ts). Nur für Import und Rückweg in die App.
 * - `beschreibung`: Auftrag für die Recherche, in einfachen Worten
 */
export const FELDER_SAEUGER = [
  // ---------- Kopf ----------
  {
    id: 'seltenheit_de',
    kapitel: 'kopf',
    typ: 'zahl',
    pflicht: true,
    app: 'art.seltenheit',
    beschreibung: 'Seltenheit in Deutschland: 1 häufig, 2 selten, 3 sehr selten, 4 legendär',
  },
  {
    id: 'schutz_de',
    kapitel: 'kopf',
    typ: 'zahl',
    pflicht: true,
    app: 'art.schutz',
    beschreibung: 'Schutz nach BNatSchG: 0 nicht geschützt, 1 besonders geschützt, 2 streng geschützt',
  },
  {
    id: 'rote_liste_de',
    kapitel: 'kopf',
    typ: 'text',
    pflicht: true,
    app: 'art.roteListe',
    beschreibung: 'Rote Liste Deutschland: *, V, 3, 2, 1',
  },
  {
    id: 'gefahr_kurz',
    kapitel: 'kopf',
    typ: 'text',
    pflicht: false,
    app: 'art.gefahr',
    beschreibung: 'Kurzer Warntext, falls das Tier Menschen gefährlich werden kann oder Krankheiten überträgt',
  },
  {
    id: 'gefahr_stufe',
    kapitel: 'kopf',
    typ: 'zahl',
    pflicht: false,
    app: 'art.gefahrStufe',
    beschreibung: 'Gefahr für Menschen: 1 Vorsicht, 2 kann angreifen, 3 lebensgefährlich',
  },

  // ---------- Kapitel 1: Erkunden ----------
  {
    id: 'merkmale',
    kapitel: 'erkunden',
    typ: 'liste',
    pflicht: true,
    app: 'steckbrief.merkmale',
    beschreibung: '3–5 Erkennungsmerkmale in je einem Satz',
  },
  {
    id: 'koerper_merkmale',
    kapitel: 'erkunden',
    typ: 'liste',
    pflicht: true,
    app: 'seite.koerper',
    beschreibung: 'Merkmale an Körperstellen (Ohr, Nase, Bein …), je 2–4 Wörter; nur Männchen?',
  },
  {
    id: 'geschlechter',
    kapitel: 'erkunden',
    typ: 'objekt',
    pflicht: false,
    app: 'seite.geschlechter',
    beschreibung: 'Namen von Männchen und Weibchen, falls sie sich sichtbar unterscheiden',
  },
  {
    id: 'jung_name',
    kapitel: 'erkunden',
    typ: 'text',
    pflicht: true,
    app: 'seite.jungName',
    beschreibung: 'Name des Jungtiers (Kitz, Welpe, Frischling …)',
  },
  {
    id: 'verwechslung',
    kapitel: 'erkunden',
    typ: 'liste',
    pflicht: true,
    app: null,
    beschreibung: 'Mit welchen Arten verwechselbar, und woran man sie unterscheidet',
  },
  {
    id: 'groesse',
    kapitel: 'erkunden',
    typ: 'objekt',
    pflicht: true,
    app: 'seite.groesse',
    beschreibung: 'Schulterhöhe oder Kopf-Rumpf-Länge (cm, min–max) und Gewicht (min–max, kg oder g)',
  },
  {
    id: 'groesse_kurz',
    kapitel: 'erkunden',
    typ: 'text',
    pflicht: false,
    app: 'art.groesse',
    beschreibung: 'Größe als kurzer Text für Listen',
  },
  {
    id: 'kennzahlen',
    kapitel: 'erkunden',
    typ: 'liste',
    pflicht: false,
    app: 'seite.kennzahlen',
    beschreibung: 'Belegte Kennzahlen (Tempo, Sprungweite, Zähne …) mit Einheit',
  },

  // ---------- Kapitel 2: Ein Jahr ----------
  {
    id: 'jahres_ereignisse',
    kapitel: 'jahr',
    typ: 'liste',
    pflicht: true,
    app: 'seite.jahr',
    beschreibung: 'Ereignisse im Jahr mit Monaten: Paarung, Geburt, Geweih, Fellwechsel, Winterruhe …',
  },
  {
    id: 'geburt_ereignis',
    kapitel: 'jahr',
    typ: 'text',
    pflicht: true,
    app: 'seite.geburt',
    beschreibung: 'Welches Ereignis die Geburt der Jungen ist',
  },
  {
    id: 'winterruhe',
    kapitel: 'jahr',
    typ: 'objekt',
    pflicht: false,
    app: 'seite.ruhe',
    beschreibung: 'Winterschlaf oder Winterruhe: Monate und kurzer Name',
  },
  {
    id: 'fell_monate',
    kapitel: 'jahr',
    typ: 'monatswerte',
    pflicht: false,
    app: 'seite.fell',
    beschreibung: 'Fell je Monat: 0 Winterfell, 1 Sommerfell, dazwischen Wechsel',
  },
  {
    id: 'geweih_monate',
    kapitel: 'jahr',
    typ: 'monatswerte',
    pflicht: false,
    app: 'seite.geweih',
    beschreibung: 'Geweih des Männchens je Monat (keins, Bast, blank) – nur Hirsche',
  },
  {
    id: 'jung_monate',
    kapitel: 'jahr',
    typ: 'objekt',
    pflicht: true,
    app: 'seite.jung',
    beschreibung: 'Wann Jungtiere zu sehen sind, wann mit Flecken, Streifen oder dunklem Fell',
  },
  {
    id: 'saison_kurz',
    kapitel: 'jahr',
    typ: 'text',
    pflicht: false,
    app: 'art.saison',
    beschreibung: 'Wann man das Tier am besten sieht, als kurzer Text',
  },

  // ---------- Kapitel 3: Ein Tag ----------
  {
    id: 'aktivitaet',
    kapitel: 'tag',
    typ: 'stunden',
    pflicht: true,
    app: 'seite.aktivitaet',
    beschreibung: 'Aktive Zeiten (Stunden 0–24), Hauptaktivität oder kurz unterwegs',
  },
  {
    id: 'aktiv_warum',
    kapitel: 'tag',
    typ: 'objekt',
    pflicht: false,
    app: 'seite.aktivHinweis',
    beschreibung: 'Warum ist das Tier zu dieser Zeit aktiv? Titel und 2–4 belegte Sätze',
  },

  // ---------- Kapitel 4: Zuhause ----------
  {
    id: 'lebensraum_kurz',
    kapitel: 'zuhause',
    typ: 'text',
    pflicht: true,
    app: 'art.lebensraum',
    beschreibung: 'Lebensraum in wenigen Wörtern',
  },
  {
    id: 'lebensraum_warum',
    kapitel: 'zuhause',
    typ: 'text',
    pflicht: true,
    app: 'steckbrief.lebensraumWarum',
    beschreibung: 'Warum lebt das Tier gerade dort? (1–2 Sätze)',
  },
  {
    id: 'lebensraum_orte',
    kapitel: 'zuhause',
    typ: 'objekt',
    pflicht: true,
    app: 'seite.lebensraum',
    beschreibung: 'Landschaft, drei Orte (Ruhe-, Aktiv-, Nahrungsplatz), wo am Tag, wo in der Dämmerung',
  },
  {
    id: 'wohnen',
    kapitel: 'zuhause',
    typ: 'text',
    pflicht: false,
    app: 'steckbrief.wohnen',
    beschreibung: 'Wie und wo das Tier schläft und wohnt (Bau, Kobel, Mulde …)',
  },

  // ---------- Kapitel 5: Speiseplan ----------
  {
    id: 'nahrung',
    kapitel: 'speiseplan',
    typ: 'liste',
    pflicht: true,
    app: 'seite.nahrung',
    beschreibung: 'Was das Tier frisst, je mit Monaten',
  },
  {
    id: 'nahrung_text',
    kapitel: 'speiseplan',
    typ: 'text',
    pflicht: false,
    app: 'steckbrief.nahrung',
    beschreibung: 'Nahrung als kurzer Text',
  },
  {
    id: 'nahrung_arten',
    kapitel: 'speiseplan',
    typ: 'artverweise',
    pflicht: false,
    app: 'steckbrief.nahrungIds',
    beschreibung: 'Arten aus der Datenbank, die das Tier frisst (für das Nahrungsnetz)',
  },

  // ---------- Kapitel 6: Spuren ----------
  {
    id: 'spuren',
    kapitel: 'spuren',
    typ: 'liste',
    pflicht: false,
    app: 'seite.spuren',
    beschreibung: 'Spuren-Karten (Trittsiegel, Losung, Bau …) mit Maßen in cm',
  },
  {
    id: 'spuren_text',
    kapitel: 'spuren',
    typ: 'text',
    pflicht: false,
    app: 'steckbrief.spuren',
    beschreibung: 'Spuren als kurzer Text',
  },
  {
    id: 'tritt_form',
    kapitel: 'spuren',
    typ: 'text',
    pflicht: true,
    app: 'seite.tritt',
    beschreibung:
      'Form des Trittsiegels: Huf, Huf mit Afterklauen, Pfote, Katze, Pfote mit 5 Zehen, Hase, Nager, Biber',
  },
  {
    id: 'faehrte',
    kapitel: 'spuren',
    typ: 'text',
    pflicht: false,
    app: 'seite.faehrte',
    beschreibung: 'Fährte: versetzt, geschnürt oder Sprungspur',
  },

  // ---------- Kapitel 7: Fressfeinde ----------
  {
    id: 'fressfeinde',
    kapitel: 'fressfeinde',
    typ: 'liste',
    pflicht: true,
    app: 'seite.gefahren',
    beschreibung: 'Fressfeinde und Gefahren (Art aus der Datenbank oder Symbol), nur für Jungtiere?',
  },

  // ---------- Gefahr für Menschen ----------
  {
    id: 'gefahr_mensch',
    kapitel: 'gefahr',
    typ: 'objekt',
    pflicht: false,
    app: 'seite.gefahrMensch',
    beschreibung: 'Einschätzung, Situationen, Zahlen und richtiges Verhalten – nur bei Tieren mit Gefahr',
  },

  // ---------- Hinweis und Spiel ----------
  {
    id: 'wusstest_du',
    kapitel: 'hinweis',
    typ: 'text',
    pflicht: true,
    app: 'art.wusstestDu',
    beschreibung: 'Ein überraschender, belegter Satz',
  },
  {
    id: 'raetsel',
    kapitel: 'hinweis',
    typ: 'text',
    pflicht: false,
    app: 'art.raetsel',
    beschreibung: 'Rätsel in der Ich-Form (für sehr seltene Arten)',
  },
];
