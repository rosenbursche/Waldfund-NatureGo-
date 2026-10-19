import type { TierSeite } from '../tierSeiten';

/**
 * Wildschwein (Sus scrofa) – Allesfresser, wühlt, suhlt sich, lebt in Rotten; Frischlinge erst gestreift, dann rotbraun.
 * Daten aus der Tierseiten-Pipeline: recherche/wildschwein/ (fakten.json, bilder.json, spuren.json),
 * geprüft in recherche/wildschwein/pruefung.md (Freigabe mit Auflagen, alle Pflichtkorrekturen übernommen).
 * Quellen-IDs (q1 …) in den Kommentaren verweisen auf `quellen` unten.
 *
 * Belegt, aber (noch) nicht auf der Seite – für spätere Kapitel:
 * - Suhlen: keine funktionierenden Schweißdrüsen, Schlamm kühlt, vermutlich auch gegen Parasiten (q13, q4); auch im Winter (q16)
 * - Rotte bis 30–40 Tiere, Leitbache stimmt die Paarung ab (q1, q6, q3, q10)
 * - Nachwuchs: Zuwachs 100–300 % pro Jahr je nach Gebiet und Mast (q1, q11) // TODO fachlich prüfen (Widerspruch 100–150 % vs. 200–300 %)
 * - Junge Keiler verlassen die Rotte mit 10–12 Monaten (q10) bis spätestens 1,5 Jahren (q3) // TODO fachlich prüfen
 * - Gewaff des Keilers über 20 cm, nur etwa ein Drittel sichtbar (q4)
 * - Streifgebiete je nach Gebiet sehr verschieden; Literaturwerte in q7: 39 ha (Bache, Stadt Rostock) bis 13.600 ha (Frankreich)
 * - Schutz: Rote Liste ungefährdet, Zunahme (q14); Jagdrecht § 2 BJagdG (q15). BNatSchG-Status // TODO fachlich prüfen (nicht geprüft)
 */
export const WILDSCHWEIN: TierSeite = {
  figur: 'wildschwein',
  umgebung: 'wald',
  extras: ['suhle'],
  // Fotos: Wikimedia Commons, ausgewählt in recherche/wildschwein/bilder.json, Nachweis in DATENQUELLEN.md
  fotos: {
    hero: 'wildschwein/hero',
    heroX: 45,
    erkunden: {
      // kein frei lebender Keiler mit sichtbarem Gewaff gefunden → nur ein Foto für alle (Zahn und Afterklauen nicht sichtbar)
      alle: { foto: 'wildschwein/hero', punkte: { ruessel: [6, 47], borsten: [45, 13], ohr: [23, 14] } },
    },
    jahreszeiten: {
      fruehling: 'wildschwein/jahreszeit-fruehling',
      sommer: 'wildschwein/jahreszeit-sommer',
      herbst: 'wildschwein/jahreszeit-herbst', // aufgenommen 11.12. (astronomisch noch Herbst)
      winter: 'wildschwein/jahreszeit-winter',
    },
    // für das Jahresrad: Sommer- bzw. Winterfell
    sommer: 'wildschwein/jahreszeit-sommer',
    winter: 'wildschwein/jahreszeit-winter',
    jung: 'wildschwein/jung',
    jungSpaeter: 'wildschwein/jung-rotbraun',
    aktiv: 'wildschwein/aktiv',
    ruhe: 'wildschwein/ruhe',
    spuren: {
      tritt: 'wildschwein/spur-tritt', // TODO fachlich prüfen: Ort unbekannt (Prüfer); Afterklauen deutlich seitlich-hinten
      suhle: 'wildschwein/spur-suhle',
      malbaum: 'wildschwein/spur-malbaum',
      gebraech: 'wildschwein/spur-gebraech',
    },
    hinweis: 'wildschwein/hinweis',
  },
  farben: {
    sommer: '#4A3A2E', // wie das 3D-Modell
    winter: '#3A302A', // Winterfell dichter und dunkler
    hell: '#D8C9A8',
    spiegel: '#D8C9A8',
    dunkel: '#17120F',
    geweih: '#D9BE7A', // helle Streifen der Frischlinge
    auge: '#17120F',
    jung: '#7A5A3A', // Frischlinge rotbraun
    akzent: '#5A4A44', // Rüsselscheibe
  },
  jungName: 'Frischling',
  // q6, q4, q24, q10, q11: Schulter bis 110 cm (q6); Keiler 100–150 kg, bis 200 kg (q6, q4); meist etwa 70 kg (q5)
  // TODO fachlich prüfen: Untergrenze 55 cm nur aus Wildpark-Steckbrief (q24); 50 kg abgeleitet (Bache 50 % von 100 kg, q6)
  groesse: { mass: 'schulter', cm: [55, 110], gewicht: [50, 200], einheit: 'kg' },
  // Punkte auf der Zeichnung (grafische Seite); auf dem Foto nur Rüssel, Borsten, Ohr
  koerper: [
    { id: 'ruessel', x: 186, y: 117, icon: 'nase', kurz: 'Rüssel: gräbt und riecht' }, // q1, q4, q11
    { id: 'borsten', x: 110, y: 74, icon: 'streifen', kurz: 'Lange, dunkle Borsten' }, // q4
    { id: 'zahn', x: 178, y: 114, icon: 'zahn', kurz: 'Keiler: Eckzähne über 20 cm' }, // q4
    { id: 'ohr', x: 151, y: 80, icon: 'ohr', kurz: 'Hört sehr gut' }, // TODO fachlich prüfen (keine Quelle)
    { id: 'huf', x: 70, y: 141, icon: 'bein', kurz: 'Afterklauen hinter den Hufen' }, // q5, q8
  ],
  // q7 (Telemetrie BW): nachts 65,6 % aktiv, tags 19,4 %; Maximum um Mitternacht. Von Natur aus auch tagaktiv,
  // durch Störung nachtaktiv (q11, q3, q6).
  // TODO fachlich prüfen: Uhrzeiten gelten für Mitte Oktober in Oberschwaben (Dämmerung = Sonnenstand ±1,5 h),
  // sie verschieben sich mit der Jahreszeit.
  aktivitaet: [
    { von: 20, bis: 24, staerke: 2 },
    { von: 0, bis: 6, staerke: 2 },
    { von: 18.5, bis: 20, staerke: 1 },
    { von: 6, bis: 7.5, staerke: 1 },
  ],
  aktivTexte: ['Ruht im Dickicht', 'Kurz unterwegs', 'Wühlt nach Futter'],
  aktivSymbol: 'wurzel',
  jahr: [
    // q3, q6, q4, q1: Schwerpunkt Nov–Jan (Spanne Okt–März)
    { id: 'rauschzeit', kurz: 'Paarungszeit', monate: [11, 12, 1], farbe: 'amber', symbol: 'herz' },
    // q1, q2: zweite Rauschzeit im September/Oktober
    { id: 'zweiteRausche', kurz: 'Zweite Paarungszeit', monate: [9, 10], farbe: 'amber', symbol: 'herz' },
    // q3, q10, q11, q1, q6: meiste Geburten März–Mai (Spanne bis Juni); Bache einige Tage im Wurfkessel
    { id: 'frischzeit', kurz: 'Frischlinge kommen', monate: [3, 4, 5], farbe: 'rune', symbol: 'mulde' },
    // q4, q16, q13 – TODO fachlich prüfen: Monate 6–8 = „Sommer“ (Zuordnung, nicht aus Quelle); gesuhlt wird ganzjährig
    { id: 'suhlen', kurz: 'Suhlen gegen Hitze', monate: [6, 7, 8], farbe: 'fog', symbol: 'suhle' },
    // q21, q22, q20: Eicheln Ende Sep–Okt, Bucheckern Sep–Nov
    { id: 'mast', kurz: 'Eicheln & Bucheckern', monate: [9, 10, 11], farbe: 'rare', symbol: 'eichel' },
  ],
  geburt: 'frischzeit',
  // q23, q4, q6: Unterwolle fällt ab April aus, wächst ab Aug/Sep nach.
  // TODO fachlich prüfen: Werte Mai–Jul (1), Aug (0,5) und Okt–Dez (0) nur abgeleitet; q23 ist eine Sekundärquelle
  //      J  F  M  A    M  J  J  A    S    O  N  D
  fell: [0, 0, 0, 0.5, 1, 1, 1, 0.5, 0.5, 0, 0, 0],
  // q1, q3, q10: Frischling heißt das Tier das ganze erste Jahr; Streifen 3–5 Monate (q4, q6, q10, q16),
  // danach rotbraunes Jugendkleid bis etwa zum 12. Monat (q10, q4)
  // TODO fachlich prüfen: Streifen-Monate 3–8 und Rotbraun-Monate 9–2 aus Geburtszeit + Dauer abgeleitet
  jung: {
    sichtbar: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    streifen: [3, 4, 5, 6, 7, 8],
    dunkel: [9, 10, 11, 12, 1, 2],
    dunkelKurz: 'Frischling: rotbraun',
  },
  nahrung: [
    // q3, q2, q1, q21, q22, q20: am liebsten Eicheln, bis 5 kg am Tag; im Winter heruntergefallene Früchte
    { icon: 'eichel', kurz: 'Eicheln & Bucheckern', monate: [9, 10, 11, 12, 1, 2] },
    // q20, q11: im Winter Wurzeln, Knollen, Ernterückstände
    { icon: 'wurzel', kurz: 'Wurzeln & Knollen', monate: [12, 1, 2] },
    // q7 – TODO fachlich prüfen: Aufenthalt in Getreide-/Maisfeldern (Telemetrie BW), kein Mageninhalt
    { icon: 'gras', kurz: 'Getreide', monate: [4, 5, 6] },
    { icon: 'mais', kurz: 'Mais', monate: [7, 8, 9] },
    // q1, q7, q11: bis 900 Larven in einem Magen; keine Monate belegt
    { icon: 'wurm', kurz: 'Würmer & Engerlinge', monate: [], monateOffen: true },
  ],
  spuren: [
    // q5, q8, q10: 6–10 cm (DWS), 9–12 cm (ANL), 5–11 cm (Freiburg); Afterklauen fast immer im Abdruck
    { icon: 'tritt', kurz: 'Trittsiegel mit Afterklauen', cm: [6, 12] },
    { icon: 'suhle', kurz: 'Suhle: Schlammbad' }, // q12, q6
    { icon: 'malbaum', kurz: 'Malbaum: Schlamm an der Rinde' }, // q12, q4 (bis 1 m hoch)
    { icon: 'gebraech', kurz: 'Gebräch: umgewühlter Boden' }, // q3, q11, q2
  ],
  tritt: 'huf_af',
  // Echte Form nach Fotos und Fachzeichnungen (spuren.json; q5, q8, q10, q30). Länge = ganzer Abdruck mit Afterklauen.
  // TODO fachlich prüfen: Vorder- und Hinterfuß gleich gezeichnet (keine Quelle für Unterschiede)
  trittPfad: {
    vorne:
      'M -1.3 -15 C -4.4 -14.2 -6.8 -8.5 -7.3 -1.5 C -7.6 2.8 -6.2 5.4 -3.9 5.5 C -1.8 5.4 -0.6 4 -0.6 1.5 L -0.6 -12.8 C -0.6 -14.3 -0.8 -15 -1.3 -15 Z M 1.3 -15 C 4.4 -14.2 6.8 -8.5 7.3 -1.5 C 7.6 2.8 6.2 5.4 3.9 5.5 C 1.8 5.4 0.6 4 0.6 1.5 L 0.6 -12.8 C 0.6 -14.3 0.8 -15 1.3 -15 Z M -9.8 8.4 C -8.2 9 -6 11.6 -5.6 13.6 C -5.3 15 -6.6 15.4 -7.6 14.6 C -9 13.4 -10.2 11.2 -10.2 9.4 C -10.2 8.8 -10.1 8.4 -9.8 8.4 Z M 9.8 8.4 C 8.2 9 6 11.6 5.6 13.6 C 5.3 15 6.6 15.4 7.6 14.6 C 9 13.4 10.2 11.2 10.2 9.4 C 10.2 8.8 10.1 8.4 9.8 8.4 Z',
    hinten:
      'M -1.3 -15 C -4.4 -14.2 -6.8 -8.5 -7.3 -1.5 C -7.6 2.8 -6.2 5.4 -3.9 5.5 C -1.8 5.4 -0.6 4 -0.6 1.5 L -0.6 -12.8 C -0.6 -14.3 -0.8 -15 -1.3 -15 Z M 1.3 -15 C 4.4 -14.2 6.8 -8.5 7.3 -1.5 C 7.6 2.8 6.2 5.4 3.9 5.5 C 1.8 5.4 0.6 4 0.6 1.5 L 0.6 -12.8 C 0.6 -14.3 0.8 -15 1.3 -15 Z M -9.8 8.4 C -8.2 9 -6 11.6 -5.6 13.6 C -5.3 15 -6.6 15.4 -7.6 14.6 C -9 13.4 -10.2 11.2 -10.2 9.4 C -10.2 8.8 -10.1 8.4 -9.8 8.4 Z M 9.8 8.4 C 8.2 9 6 11.6 5.6 13.6 C 5.3 15 6.6 15.4 7.6 14.6 C 9 13.4 10.2 11.2 10.2 9.4 C 10.2 8.8 10.1 8.4 9.8 8.4 Z',
    laengeCm: [6, 12],
  },
  // q8, q5: „ziehend“ Tritte links und rechts im Wechsel.
  // TODO fachlich prüfen: Schrittlänge und Spurbreite nicht belegt – Fährte nur als Muster, ohne cm
  faehrte: 'versetzt',
  gefahren: [
    // q1, q11, q19: einziger wirklich gefährlicher Feind; 16,3 % der Wolfsbeute in der Lausitz
    { icon: 'wolf', kurz: 'Wolf' },
    // q4 nennt den Fuchs als Feind. TODO fachlich prüfen: ob nur für Frischlinge, ist nicht belegt
    { artId: 'fuchs', kurz: 'Fuchs', nurJung: true },
    // q17: 40 % der Wildschwein-Unfälle Oktober bis Dezember
    { icon: 'auto', kurz: 'Straßen' },
    // q3: nasskalte Witterung in den ersten Wochen kann zu hohen Ausfällen führen
    { icon: 'schnee', kurz: 'Nasskaltes Wetter', nurJung: true },
  ],
  // q6, q7, q11, q10: Laub-/Mischwald mit Dickungen und feuchten Böden, nachts Nahrung auch auf Feldern und Wiesen
  lebensraum: {
    landschaft: 'waldrand',
    tag: 0,
    nacht: 2,
    orte: ['Dickicht', 'Suhle', 'Feld & Wiese'],
    // echtes Foto mit den drei Orten (Prozent links/oben) und Nahfotos je Ort (bilder.json)
    panorama: {
      foto: 'landschaft/waldrand-wiese',
      zonen: [
        [90, 52],
        [78, 64],
        [30, 78],
      ],
      orte: ['landschaft/dickicht', 'wildschwein/spur-suhle', 'landschaft/wiese'],
    },
  },
  // q16: Warnlaut „Blasen“ (lautes Schnauben). Gefahr durch Bachen mit Frischlingen: arten.ts
  // TODO fachlich prüfen: Verhaltensrat „ruhig zurückgehen“ ist eine Empfehlung, keine Quellenangabe
  hinweis: {
    titel: 'Wildschweine gesehen?',
    bild: 'abstand',
    text: 'eigen',
    eigenerText:
      'Hörst du lautes Schnauben? So warnen Wildschweine. Geh ruhig zurück und halte großen Abstand – vor allem zu einer Bache mit Frischlingen.',
  },
  quellen: [
    {
      id: 'q1',
      titel: 'Schwarzwildbiologie – Frischlinge intensiv bejagen! (Petrak, Forschungsstelle für Jagdkunde NRW)',
      url: 'https://www.lave.nrw.de/system/files/media/document/file/fo-st-rwj-9-16-saujagd.pdf',
    },
    {
      id: 'q2',
      titel: 'Das Schwarzwild kehrt zurück (Petrak 2009, waldwissen.net)',
      url: 'https://www.waldwissen.net/de/lebensraum-wald/wald-und-wild/wildtiermanagement/das-schwarzwild-kehrt-zurueck',
    },
    {
      id: 'q3',
      titel: 'Warum werden Wildschweine zum Problem? (LWF Bayern, waldwissen.net)',
      url: 'https://www.waldwissen.net/de/lebensraum-wald/wald-und-wild/wildtiermanagement/wildschweinproblem',
    },
    {
      id: 'q4',
      titel: 'Wildschwein – Steckbrief (Deutsche Wildtier Stiftung)',
      url: 'https://www.deutschewildtierstiftung.de/wildtiere/wildschwein',
    },
    {
      id: 'q5',
      titel: 'Ratgeber Fährten und Spuren (Deutsche Wildtier Stiftung)',
      url: 'https://www.deutschewildtierstiftung.de/media/pages/landingpages/ratgeber/450acca148-1707642927/ratgeber-faehrten-und-spuren_ratgeber-faehrten-und-spuren.pdf',
    },
    {
      id: 'q6',
      titel: 'Das Wildschwein – Wildtiere im Stadtgebiet (Senatsverwaltung Berlin)',
      url: 'https://www.berlin.de/sen/uvk/natur-und-gruen/jagd-und-wildtiere/wildtiere-im-stadtgebiet/wildschwein/',
    },
    {
      id: 'q7',
      titel: 'Schwarzwildproblematik im Umfeld von Schutzgebieten (Wildforschungsstelle Baden-Württemberg)',
      url: 'https://fortbildung-lazbw.lgl-bw.de/lazbw/webbasys/download/Shop/WFS_Bd14_Projektbericht_Schwarzwildproblematik.pdf',
    },
    {
      id: 'q8',
      titel: 'Tierspuren – Anlagen, Projekt Tiere live (ANL Bayern)',
      url: 'https://www.anl.bayern.de/projekte/tierelive/doc/014_tierspuren_ges_ba.pdf',
    },
    {
      id: 'q9',
      titel: 'Mehr als ein Haufen: Was Kot verrät (waldwissen.net / FVA Baden-Württemberg)',
      url: 'https://www.waldwissen.net/de/lebensraum-wald/tiere-im-wald/wildtierkot-erkennen',
    },
    {
      id: 'q10',
      titel: 'Das Wildschwein – Infoblatt (Amt für Wald und Natur, Kanton Freiburg)',
      url: 'https://www.fr.ch/de/document/76231',
    },
    {
      id: 'q11',
      titel: 'Wildtiere im Wallis – Das Wildschwein (Kanton Wallis)',
      url: 'https://www.vs.ch/documents/33024802/33033352/Infoblatt_Wildschwein_2025/32d68642-6fbc-c2c6-c24a-ecdf50452f86',
    },
    {
      id: 'q12',
      titel: 'Wildschwein (Reiben) – Diagnose online (Waldschutz Schweiz, WSL)',
      url: 'https://waldschutz.wsl.ch/fileadmin/user_upload/WSL/Microsite/Waldschutz-Schweiz/Diagnose_online/de/Wildschwein_Reiben_63.pdf',
    },
    {
      id: 'q13',
      titel: 'Review of wallowing in pigs (Bracke 2011, Wageningen University)',
      url: 'https://research.wur.nl/en/publications/review-of-wallowing-in-pigs-description-of-the-behaviour-and-its-',
    },
    {
      id: 'q14',
      titel: 'Rote Liste der Säugetiere Deutschlands: Wildschwein (Rote-Liste-Zentrum / BfN)',
      url: 'https://www.rote-liste-zentrum.de/detail/pdf/54013',
    },
    {
      id: 'q15',
      titel: 'Bundesjagdgesetz § 2 Tierarten (gesetze-im-internet.de)',
      url: 'https://www.gesetze-im-internet.de/bjagdg/__2.html',
    },
    {
      id: 'q16',
      titel: 'Fragen und Antworten zur Jägerprüfung, Fach 1 (Landesjagdverband Baden-Württemberg)',
      url: 'https://dev-1.v12.landesjagdverband.de/fileadmin/rootpages/1/Fach_1_Stand_12.07.2021_mit_L%C3%B6sungen.pdf',
    },
    {
      id: 'q17',
      titel: 'Hirsche und Wildschweine verursachen jetzt viele Wildunfälle (Deutscher Jagdverband)',
      url: 'https://www.jagdverband.de/hirsche-und-wildschweine-verursachen-jetzt-viele-wildunfaelle',
    },
    {
      id: 'q18',
      titel: 'Afrikanische Schweinepest (Friedrich-Loeffler-Institut)',
      url: 'https://www.fli.de/de/aktuelles/tierseuchengeschehen/afrikanische-schweinepest/',
    },
    {
      id: 'q19',
      titel: 'Speisezettel der Wölfe (NABU, Senckenberg-Kotanalysen)',
      url: 'https://www.nabu.de/tiere-und-pflanzen/saeugetiere/wolf/wissen/15572.html',
    },
    {
      id: 'q20',
      titel: 'Meldung zum Wildschwein (Amt für Jagd und Fischerei Graubünden)',
      url: 'https://www.gr.ch/DE/institutionen/verwaltung/diem/ajf/ueberuns/aktuelles/Seiten/202412042.aspx',
    },
    {
      id: 'q21',
      titel: 'LIFEGENMON – Leitfaden genetisches Monitoring der Eichen (LWF Bayern)',
      url: 'https://lwf.bayern.de/mam/cms02/asp/dateien/lifegenmon_leitfaden_eichen.pdf',
    },
    {
      id: 'q22',
      titel: 'LIFEGENMON – Leitfaden genetisches Monitoring der Rotbuche (LWF Bayern)',
      url: 'https://lwf.bayern.de/mam/cms02/asp/dateien/lifegenmon_leitfaden_rotbuche.pdf',
    },
    {
      id: 'q23',
      titel: 'Wild boar – Artporträt mit Literaturangaben (Wildlife Online, UK)',
      url: 'https://www.wildlifeonline.me.uk/animals/species/wild-boar',
    },
    {
      id: 'q24',
      titel: 'Wildschwein – Steckbrief (Wildpark Eekholt)',
      url: 'https://www.wildpark-eekholt.de/download/Wildschw.pdf',
    },
    {
      id: 'q30',
      titel: 'Einheimische Paarhufer, Arbeitsblätter (Naturhistorisches Museum der Universität Zürich)',
      url: 'https://www.nmz.uzh.ch/dam/jcr:ff2e2ed8-0dba-4286-8702-9e3731c27692/2024_Paarhufer_Arbeitsblaetter.pdf',
    },
  ],
};
