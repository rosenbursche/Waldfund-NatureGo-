/**
 * Echte Fotos für die Tierseiten – alle von Wikimedia Commons, frei nutzbar (CC0, gemeinfrei, CC BY, CC BY-SA).
 * Die Bilder wurden nur verkleinert (nicht beschnitten oder verändert) und liegen offline in `assets/fotos/`.
 *
 * Pflicht: Urheber und Lizenz müssen sichtbar sein – das passiert auf der Artenseite (kleiner Hinweis am Foto
 * und Abschnitt „Fotos“) und in DATENQUELLEN.md. Neue Fotos nur mit geprüfter Lizenz hier eintragen.
 */
export type Foto = {
  quelle: number;
  breite: number;
  hoehe: number;
  autor: string;
  lizenz: string;
  lizenzUrl: string;
  /** Dateiseite auf Wikimedia Commons */
  seite: string;
};

export const FOTOS = {
  'reh/bock': {
    quelle: require('../../assets/fotos/reh/bock.jpg'),
    breite: 1200,
    hoehe: 800,
    autor: 'Uoaei1',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Capreolus_capreolus_Wien_Zentralfriedhof_20221021_05.jpg',
  },
  'reh/ricke-sommer': {
    quelle: require('../../assets/fotos/reh/ricke-sommer.jpg'),
    breite: 826,
    hoehe: 1200,
    autor: 'caroline legg',
    lizenz: 'CC BY 2.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by/2.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Roe_Deer_-_Doe.jpg',
  },
  'reh/bock-aest-winter': {
    quelle: require('../../assets/fotos/reh/bock-aest-winter.jpg'),
    breite: 1200,
    hoehe: 800,
    autor: 'W.carter',
    lizenz: 'CC0',
    lizenzUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
    seite: 'https://commons.wikimedia.org/wiki/File:Roe_deer_in_Brastad_3.jpg',
  },
  'reh/kitz': {
    quelle: require('../../assets/fotos/reh/kitz.jpg'),
    breite: 1200,
    hoehe: 803,
    autor: 'Gilles San Martin from Namur, Belgium',
    lizenz: 'CC BY-SA 2.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Roe_deer_fawn_(3722431080).jpg',
  },
  'reh/trittsiegel': {
    quelle: require('../../assets/fotos/reh/trittsiegel.jpg'),
    breite: 800,
    hoehe: 518,
    autor: 'Tomasz Kuran aka Meteor2017',
    lizenz: 'CC BY 2.5',
    lizenzUrl: 'https://creativecommons.org/licenses/by/2.5',
    seite: 'https://commons.wikimedia.org/wiki/File:Roe_deer_track01.jpg',
  },
  'reh/losung': {
    quelle: require('../../assets/fotos/reh/losung.jpg'),
    breite: 1200,
    hoehe: 900,
    autor: 'Ejdzej',
    lizenz: 'Public domain',
    lizenzUrl: '',
    seite: 'https://commons.wikimedia.org/wiki/File:Roe_deer_droppings.jpg',
  },
  'fuchs/sitzt-sommer': {
    quelle: require('../../assets/fotos/fuchs/sitzt-sommer.jpg'),
    breite: 1000,
    hoehe: 700,
    autor: 'Malene Thyssen',
    lizenz: 'CC BY 2.5',
    lizenzUrl: 'https://creativecommons.org/licenses/by/2.5',
    seite: 'https://commons.wikimedia.org/wiki/File:R%C3%B8d_r%C3%A6v_(Vulpes_vulpes).jpg',
  },
  'fuchs/maeusesprung': {
    quelle: require('../../assets/fotos/fuchs/maeusesprung.jpg'),
    breite: 1200,
    hoehe: 800,
    autor: 'Justin Jensen',
    lizenz: 'CC BY 2.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by/2.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Redfox_Pounce_(4453887453).jpg',
  },
  'fuchs/ruht': {
    quelle: require('../../assets/fotos/fuchs/ruht.jpg'),
    breite: 1200,
    hoehe: 900,
    autor: 'Böhringer Friedrich',
    lizenz: 'CC BY-SA 2.5',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/2.5',
    seite: 'https://commons.wikimedia.org/wiki/File:Rotfuchs,_Vulpes_vulpes_1.JPG',
  },
  'fuchs/welpe': {
    quelle: require('../../assets/fotos/fuchs/welpe.jpg'),
    breite: 1200,
    hoehe: 937,
    autor: 'Karl Pinnow',
    lizenz: 'CC BY 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by/4.0',
    seite:
      'https://commons.wikimedia.org/wiki/File:Vulpes_vulpes_puppy_Naturschutzgebiet_Z%C3%BClowgrabenniederung_11.05.25.jpg',
  },
  'fuchs/spur': {
    quelle: require('../../assets/fotos/fuchs/spur.jpg'),
    breite: 1200,
    hoehe: 798,
    autor: 'BorealFox',
    lizenz: 'CC0',
    lizenzUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
    seite: 'https://commons.wikimedia.org/wiki/File:Red_fox_track_in_snow.jpg',
  },
  'fuchs/losung': {
    quelle: require('../../assets/fotos/fuchs/losung.jpg'),
    breite: 1200,
    hoehe: 944,
    autor: 'gailhampshire from Cradley, Malvern, U.K',
    lizenz: 'CC BY 2.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by/2.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Scat...Fox_-_Flickr_-_gailhampshire.jpg',
  },
  'fuchs/steht': {
    quelle: require('../../assets/fotos/fuchs/steht.jpg'),
    breite: 1200,
    hoehe: 800,
    autor: 'Uoaei1',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Vulpes_vulpes_Mallnitz_01.jpg',
  },
  // Landschaften für das Lebensraum-Kapitel
  'landschaft/waldrand-wiese': {
    quelle: require('../../assets/fotos/landschaft/waldrand-wiese.jpg'),
    breite: 1800,
    hoehe: 675,
    autor: 'Stephan van Helden',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Wiese_am_Waldrand_s%C3%BCdlich_von_Schweickershausen.jpg',
  },
  'landschaft/wald-buchen': {
    quelle: require('../../assets/fotos/landschaft/wald-buchen.jpg'),
    breite: 1800,
    hoehe: 608,
    autor: 'Chicken-foto',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Buchenwald_im_Nationalpark_Jasmund.jpg',
  },
  'landschaft/feld-morgen': {
    quelle: require('../../assets/fotos/landschaft/feld-morgen.jpg'),
    breite: 1500,
    hoehe: 1000,
    autor: 'Dietmar Rabich',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite:
      'https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Kirchspiel,_B%C3%B6rnste,_Felder_und_B%C3%A4ume_--_2017_--_3220-6.jpg',
  },
  'landschaft/ufer-bach': {
    quelle: require('../../assets/fotos/landschaft/ufer-bach.jpg'),
    breite: 1800,
    hoehe: 597,
    autor: 'UuMUfQ',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite:
      'https://commons.wikimedia.org/wiki/File:Schlitz_Unter-Schwarz_Stream_Schwarzbach_Beaver_Dam_Pond_Pano_Cyl_2022_Mar.png',
  },
  'landschaft/dickicht': {
    quelle: require('../../assets/fotos/landschaft/dickicht.jpg'),
    breite: 1000,
    hoehe: 563,
    autor: 'Vollgenervt',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite:
      'https://commons.wikimedia.org/wiki/File:Naturschutzgebiet_W%C3%BCstn%C3%A4chstenbach_und_Haferbuckel_Dickicht.jpg',
  },
  'landschaft/waldboden': {
    quelle: require('../../assets/fotos/landschaft/waldboden.jpg'),
    breite: 1000,
    hoehe: 666,
    autor: 'Lisabeth08',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Die_Kleinigkeiten_haben_auch_Bedeutung_in_dem_Bayerischen_Wald.jpg',
  },
  'landschaft/wiese': {
    quelle: require('../../assets/fotos/landschaft/wiese.jpg'),
    breite: 1000,
    hoehe: 563,
    autor: 'Ulrike62',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Knabenkrautwiese_Gleistalhang.jpg',
  },
  'landschaft/hecke': {
    quelle: require('../../assets/fotos/landschaft/hecke.jpg'),
    breite: 1000,
    hoehe: 626,
    autor: 'Roman Eisele',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite:
      'https://commons.wikimedia.org/wiki/File:Heilbronn_-_Biberach_-_Michelbachtal_-_Feldhecke_an_Fr%C3%BChlingsabend_(1).jpg',
  },
  'landschaft/biberdamm': {
    quelle: require('../../assets/fotos/landschaft/biberdamm.jpg'),
    breite: 1000,
    hoehe: 593,
    autor: 'Lorbas76',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Biberdamm_im_NSG_Biesenthaler_Becken.jpg',
  },
  // Wildschwein im Frühling (Mai) auf einer Wiese am Stadtrand von Łódź, ganz seitlich
  'wildschwein/hero': {
    quelle: require('../../assets/fotos/wildschwein/hero.jpg'),
    breite: 1200,
    hoehe: 826,
    autor: 'Jerzy Strzelecki',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Locha(js).jpg',
  },
  // Bache mit gestreiften Frischlingen im kahlen Birkenwald, März
  'wildschwein/jahreszeit-fruehling': {
    quelle: require('../../assets/fotos/wildschwein/jahreszeit-fruehling.jpg'),
    breite: 1200,
    hoehe: 799,
    autor: 'Jerzy Strzelecki',
    lizenz: 'CC BY-SA 3.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Sus_scrofa,_Lodz,_Poland_(js)41.jpg',
  },
  // Wildschwein im kurzen Sommerfell vor grünem Gebüsch, Juli
  'wildschwein/jahreszeit-sommer': {
    quelle: require('../../assets/fotos/wildschwein/jahreszeit-sommer.jpg'),
    breite: 1200,
    hoehe: 800,
    autor: 'Jerzystrzelecki',
    lizenz: 'CC BY 3.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by/3.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Sus_scrofa,_Lodz,_Poland_(js)27.jpg',
  },
  // Rotte wühlt im Falllaub nach Futter, Bois de Roly (Belgien)
  'wildschwein/jahreszeit-herbst': {
    quelle: require('../../assets/fotos/wildschwein/jahreszeit-herbst.jpg'),
    breite: 1200,
    hoehe: 669,
    autor: 'Trougnouf (Benoit Brummer)',
    lizenz: 'CC BY 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Wild_boars_searching_for_food_under_dead_leaves,_cropped_(DSC07838).jpg',
  },
  // Wildschwein im Winterfell läuft durch Schnee, Deelerwoud (Veluwe), Januar
  'wildschwein/jahreszeit-winter': {
    quelle: require('../../assets/fotos/wildschwein/jahreszeit-winter.jpg'),
    breite: 1200,
    hoehe: 800,
    autor: 'Henk Monster',
    lizenz: 'CC BY 3.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by/3.0',
    seite: 'https://commons.wikimedia.org/wiki/File:When_they_did_smell_me_they_went_away_in_a_hurry._Deelerwoud_26_Januari_2013_-_panoramio.jpg',
  },
  // Gestreifter Frischling im Gras, Pfälzerwald, Juni
  'wildschwein/jung': {
    quelle: require('../../assets/fotos/wildschwein/jung.jpg'),
    breite: 1200,
    hoehe: 900,
    autor: 'Fischer.H',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:IMG_Wildschwein_Frischling_0925.jpg',
  },
  // Zwei Frischlinge im rotbraunen Jugendkleid, Ardennen, August
  'wildschwein/jung-rotbraun': {
    quelle: require('../../assets/fotos/wildschwein/jung-rotbraun.jpg'),
    breite: 1200,
    hoehe: 797,
    autor: 'Hikerbiker',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Ardennen-4.jpg',
  },
  // Wildschwein wühlt mit dem Rüssel im Schlamm, NSG Schellbruch Lübeck
  'wildschwein/aktiv': {
    quelle: require('../../assets/fotos/wildschwein/aktiv.jpg'),
    breite: 1200,
    hoehe: 800,
    autor: 'Canaturephoto',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Dreckschwein.jpg',
  },
  // Wildschwein ruht sitzend am Rand eines Birkendickichts, April
  'wildschwein/ruhe': {
    quelle: require('../../assets/fotos/wildschwein/ruhe.jpg'),
    breite: 1200,
    hoehe: 800,
    autor: 'Jerzy Strzelecki',
    lizenz: 'CC BY 3.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by/3.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Sus_scrofa,_Lodz,_Poland_(js)33.jpg',
  },
  // Bache mit sechs gestreiften Frischlingen am Birkenwald, März
  'wildschwein/rotte': {
    quelle: require('../../assets/fotos/wildschwein/rotte.jpg'),
    breite: 1200,
    hoehe: 800,
    autor: 'Jerzy Strzelecki',
    lizenz: 'CC BY-SA 3.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Sus_scrofa,_Lodz,_Poland_(js)38.jpg',
  },
  // Bache mit Frischlingen in freier Natur, Hambach an der Weinstraße
  'wildschwein/hinweis': {
    quelle: require('../../assets/fotos/wildschwein/hinweis.jpg'),
    breite: 1200,
    hoehe: 800,
    autor: 'Fischer.H',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Wildschwein.jpg',
  },
  // Trittsiegel im Schlamm: zwei Schalen, dahinter seitlich die Afterklauen (Ort unbekannt)
  'wildschwein/spur-tritt': {
    quelle: require('../../assets/fotos/wildschwein/spur-tritt.jpg'),
    breite: 800,
    hoehe: 1200,
    autor: 'Chris Le Jeune',
    lizenz: 'CC BY-SA 4.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Empreinte_de_sanglier_-4.jpg',
  },
  // Wildschweinsuhle im Wald, Schorlenberg (Pfalz)
  'wildschwein/spur-suhle': {
    quelle: require('../../assets/fotos/wildschwein/spur-suhle.jpg'),
    breite: 1200,
    hoehe: 900,
    autor: 'Hans Buch',
    lizenz: 'Public domain',
    lizenzUrl: '',
    seite: 'https://commons.wikimedia.org/wiki/File:Schorlenberg,_Wildschweinsuhle.jpg',
  },
  // Malbaum mit Schlammkruste am Stamm, Barnim (Brandenburg)
  'wildschwein/spur-malbaum': {
    quelle: require('../../assets/fotos/wildschwein/spur-malbaum.jpg'),
    breite: 998,
    hoehe: 1200,
    autor: 'Rainer Altenkamp, Berlin',
    lizenz: 'CC BY-SA 3.0',
    lizenzUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
    seite: 'https://commons.wikimedia.org/wiki/File:Susscr_Malbaum_frei_Rehahn_BAR_070802.jpg',
  },
  // Von einer Rotte umgebrochene Grasnarbe (Gebräch), Mammolshain (Taunus)
  'wildschwein/spur-gebraech': {
    quelle: require('../../assets/fotos/wildschwein/spur-gebraech.jpg'),
    breite: 1200,
    hoehe: 900,
    autor: 'Dontworry',
    lizenz: 'CC BY-SA 3.0',
    lizenzUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    seite: 'https://commons.wikimedia.org/wiki/File:Schweinerei-einer-schwarzkittelrotte-001.jpg',
  },
} satisfies Record<string, Foto>;

export type FotoId = keyof typeof FOTOS;

/** Kurzer Bildnachweis, z. B. „Foto: Uoaei1, CC BY-SA 4.0“ */
export const fotoNachweis = (f: Foto) => (f.autor ? `Foto: ${f.autor}, ${f.lizenz}` : `Foto: ${f.lizenz}`);
