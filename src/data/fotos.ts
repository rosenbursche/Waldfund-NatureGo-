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
} satisfies Record<string, Foto>;

export type FotoId = keyof typeof FOTOS;

/** Kurzer Bildnachweis, z. B. „Foto: Uoaei1, CC BY-SA 4.0“ */
export const fotoNachweis = (f: Foto) => (f.autor ? `Foto: ${f.autor}, ${f.lizenz}` : `Foto: ${f.lizenz}`);
