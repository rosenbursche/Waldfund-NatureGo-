import type { Baumart, Hoehenstufe } from './typen';

/**
 * Baumarten mit ihren Standortansprüchen.
 *
 * Als TypeScript-Datei statt JSON, damit jede Angabe einen
 * "// TODO fachlich prüfen"-Kommentar tragen kann und TypeScript Tippfehler findet.
 *
 * Grundlage: allgemeines forstliches Lehrbuchwissen (Höhenstufen, Bodenansprüche,
 * natürliche Verbreitung in Deutschland). Die Werte sind für ein Spiel vereinfacht.
 * TODO fachlich prüfen: Alle Höhenstufen, Böden, Großlandschaften und Rollen
 * sollten mit einer Fachquelle abgeglichen werden (z. B. BfN-Karte der PNV,
 * Standortskarten der Länder, Leuschner & Ellenberg "Vegetation Mitteleuropas").
 */

const ALLE_STUFEN: Hoehenstufe[] = ['planar', 'kollin', 'submontan', 'montan', 'hochmontan'];
const BIS_SUBMONTAN: Hoehenstufe[] = ['planar', 'kollin', 'submontan'];
const BIS_MONTAN: Hoehenstufe[] = ['planar', 'kollin', 'submontan', 'montan'];

export const BAUMARTEN: Baumart[] = [
  {
    id: 'rotbuche',
    name: 'Rotbuche',
    lat: 'Fagus sylvatica',
    status: 'heimisch',
    hoehenstufen: BIS_MONTAN, // TODO fachlich prüfen: in den Alpen auch höher
    boeden: ['sauer', 'kalkreich', 'sandig'], // meidet staunasse Böden
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland', 'alpen'],
    rollen: [
      { hoehenstufen: ['kollin', 'submontan', 'montan'], rolle: 'haupt' },
      { boeden: ['sauer', 'kalkreich'], rolle: 'haupt' },
      { rolle: 'neben' },
    ],
    modell: { krone: 'rund', laub: '#5E8A3E', rinde: '#8E918C', hoehe: 1.2 },
  },
  {
    id: 'traubeneiche',
    name: 'Traubeneiche',
    lat: 'Quercus petraea',
    status: 'heimisch',
    hoehenstufen: BIS_SUBMONTAN,
    boeden: ['sauer', 'sandig', 'kalkreich'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland'],
    rollen: [{ hoehenstufen: ['planar', 'kollin'], boeden: ['sandig', 'sauer'], rolle: 'neben' }],
    modell: { krone: 'ausladend', laub: '#55803A', rinde: '#5B4A3A', hoehe: 1.1 },
  },
  {
    id: 'stieleiche',
    name: 'Stieleiche',
    lat: 'Quercus robur',
    status: 'heimisch',
    hoehenstufen: BIS_SUBMONTAN,
    boeden: ['sandig', 'feucht', 'kalkreich', 'sauer'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland'],
    rollen: [
      { hoehenstufen: ['planar'], boeden: ['sandig', 'feucht'], rolle: 'haupt' },
      { hoehenstufen: ['planar', 'kollin'], rolle: 'neben' },
    ],
    modell: { krone: 'ausladend', laub: '#4F7F36', rinde: '#5B4330', hoehe: 1.1 },
  },
  {
    id: 'hainbuche',
    name: 'Hainbuche',
    lat: 'Carpinus betulus',
    status: 'heimisch',
    hoehenstufen: BIS_SUBMONTAN,
    boeden: ['kalkreich'], // TODO fachlich prüfen: auch auf wechselfeuchten Lehmböden
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland'],
    rollen: [{ hoehenstufen: ['planar', 'kollin'], rolle: 'neben' }],
    modell: { krone: 'oval', laub: '#6A9443', rinde: '#9A9C95', hoehe: 0.8 },
  },
  {
    id: 'bergahorn',
    name: 'Bergahorn',
    lat: 'Acer pseudoplatanus',
    status: 'heimisch',
    hoehenstufen: ['kollin', 'submontan', 'montan'], // TODO fachlich prüfen: in den Alpen bis in die Hochlagen
    boeden: ['sauer', 'kalkreich'],
    grosslandschaften: ['mittelgebirge', 'alpenvorland', 'alpen'], // im Tiefland nicht von Natur aus
    rollen: [{ hoehenstufen: ['montan'], rolle: 'neben' }],
    modell: { krone: 'rund', laub: '#5C8C3C', rinde: '#8C7F6E', hoehe: 1.1 },
  },
  {
    id: 'spitzahorn',
    name: 'Spitzahorn',
    lat: 'Acer platanoides',
    status: 'heimisch',
    hoehenstufen: BIS_SUBMONTAN,
    boeden: ['kalkreich'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland'], // TODO fachlich prüfen: Tiefland nur teilweise
    modell: { krone: 'rund', laub: '#6B9A40', rinde: '#5E554B', hoehe: 0.95 },
  },
  {
    id: 'feldahorn',
    name: 'Feldahorn',
    lat: 'Acer campestre',
    status: 'heimisch',
    hoehenstufen: ['planar', 'kollin'],
    boeden: ['kalkreich'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland'],
    modell: { krone: 'rund', laub: '#6E9A48', rinde: '#7A6A58', hoehe: 0.6 },
  },
  {
    id: 'esche',
    name: 'Gemeine Esche',
    lat: 'Fraxinus excelsior',
    status: 'heimisch',
    hoehenstufen: BIS_MONTAN,
    boeden: ['kalkreich'], // TODO fachlich prüfen: auch nährstoffreiche feuchte Auen
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland', 'alpen'],
    rollen: [{ hoehenstufen: BIS_SUBMONTAN, rolle: 'neben' }],
    modell: { krone: 'oval', laub: '#6E9B4A', rinde: '#8D8C83', hoehe: 1.15 },
  },
  {
    id: 'winterlinde',
    name: 'Winterlinde',
    lat: 'Tilia cordata',
    status: 'heimisch',
    hoehenstufen: BIS_SUBMONTAN,
    boeden: ['kalkreich', 'sauer'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland'],
    modell: { krone: 'oval', laub: '#5F8F3F', rinde: '#6E6255', hoehe: 1 },
  },
  {
    id: 'sommerlinde',
    name: 'Sommerlinde',
    lat: 'Tilia platyphyllos',
    status: 'heimisch',
    hoehenstufen: ['kollin', 'submontan'],
    boeden: ['kalkreich'],
    grosslandschaften: ['mittelgebirge', 'alpenvorland'], // TODO fachlich prüfen
    modell: { krone: 'oval', laub: '#62923F', rinde: '#6E6255', hoehe: 1.05 },
  },
  {
    id: 'bergulme',
    name: 'Bergulme',
    lat: 'Ulmus glabra',
    status: 'heimisch',
    hoehenstufen: ['kollin', 'submontan', 'montan'],
    boeden: ['kalkreich'],
    grosslandschaften: ['mittelgebirge', 'alpenvorland', 'alpen'], // TODO fachlich prüfen
    modell: { krone: 'ausladend', laub: '#5A8A3A', rinde: '#6A5E50', hoehe: 1 },
  },
  {
    id: 'schwarzerle',
    name: 'Schwarzerle',
    lat: 'Alnus glutinosa',
    status: 'heimisch',
    hoehenstufen: BIS_SUBMONTAN,
    boeden: ['feucht'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland'],
    rollen: [{ boeden: ['feucht'], rolle: 'neben' }],
    modell: { krone: 'kegel', laub: '#3E6A35', rinde: '#3F3A34', hoehe: 0.9 },
  },
  {
    id: 'grauerle',
    name: 'Grauerle',
    lat: 'Alnus incana',
    status: 'heimisch',
    hoehenstufen: ['submontan', 'montan'],
    boeden: ['feucht'],
    grosslandschaften: ['alpenvorland', 'alpen'], // TODO fachlich prüfen: v. a. Flussauen im Süden
    modell: { krone: 'oval', laub: '#5A7F46', rinde: '#8A8C88', hoehe: 0.7 },
  },
  {
    id: 'sandbirke',
    name: 'Sandbirke',
    lat: 'Betula pendula',
    status: 'heimisch',
    hoehenstufen: BIS_MONTAN,
    boeden: ['sandig', 'sauer'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland', 'alpen'],
    rollen: [{ hoehenstufen: ['planar'], boeden: ['sandig'], rolle: 'neben' }],
    modell: { krone: 'haengend', laub: '#8DB05A', rinde: '#E8E6DF', hoehe: 0.9 },
  },
  {
    id: 'moorbirke',
    name: 'Moorbirke',
    lat: 'Betula pubescens',
    status: 'heimisch',
    hoehenstufen: ALLE_STUFEN,
    boeden: ['feucht'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland'],
    modell: { krone: 'oval', laub: '#7FA554', rinde: '#E2DFD6', hoehe: 0.75 },
  },
  {
    id: 'vogelbeere',
    name: 'Vogelbeere',
    lat: 'Sorbus aucuparia',
    status: 'heimisch',
    hoehenstufen: ALLE_STUFEN,
    boeden: ['sauer', 'sandig'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland', 'alpen'],
    rollen: [{ hoehenstufen: ['hochmontan'], rolle: 'neben' }],
    modell: { krone: 'oval', laub: '#6C9846', rinde: '#7E7468', hoehe: 0.55 },
  },
  {
    id: 'vogelkirsche',
    name: 'Vogelkirsche',
    lat: 'Prunus avium',
    status: 'heimisch',
    hoehenstufen: BIS_SUBMONTAN,
    boeden: ['kalkreich'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland'],
    modell: { krone: 'oval', laub: '#679643', rinde: '#7A4A3C', hoehe: 0.85 },
  },
  {
    id: 'elsbeere',
    name: 'Elsbeere',
    lat: 'Sorbus torminalis',
    status: 'heimisch',
    hoehenstufen: ['kollin', 'submontan'],
    boeden: ['kalkreich'],
    grosslandschaften: ['mittelgebirge'], // TODO fachlich prüfen: wärmeliebend, eher selten
    modell: { krone: 'rund', laub: '#5E8E3D', rinde: '#6A5A4A', hoehe: 0.7 },
  },
  {
    id: 'waldkiefer',
    name: 'Waldkiefer',
    lat: 'Pinus sylvestris',
    status: 'heimisch',
    hoehenstufen: ['planar', 'kollin', 'submontan', 'montan'],
    boeden: ['sandig', 'sauer', 'feucht', 'kalkreich'], // feucht: Moore; kalkreich: trockene Kalkhänge der Alpen
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland', 'alpen'],
    // Von Natur aus vor allem auf armen Sanden im Osten und an Sonderstandorten (Moore, Felsen).
    // TODO fachlich prüfen: ob die Lüneburger Heide dazugehört, ist umstritten.
    heimisch_in: ['mittelbrandenburg', 'lueneburger-heide', 'alpen'],
    forstlich_angebaut: true,
    rollen: [{ naturraeume: ['mittelbrandenburg'], rolle: 'haupt' }],
    modell: { krone: 'schirm', laub: '#3F6B3E', rinde: '#A0583A', hoehe: 1.1 },
  },
  {
    id: 'weisstanne',
    name: 'Weißtanne',
    lat: 'Abies alba',
    status: 'heimisch',
    hoehenstufen: ['submontan', 'montan', 'hochmontan'],
    boeden: ['sauer', 'kalkreich'],
    grosslandschaften: ['mittelgebirge', 'alpenvorland', 'alpen'],
    // Im Harz, Sauerland und in der Eifel z. B. nicht von Natur aus.
    // TODO fachlich prüfen: Liste der Mittelgebirge mit natürlichem Tannenvorkommen
    heimisch_in: ['schwarzwald', 'innerer-bayerischer-wald', 'oberes-erzgebirge', 'alpenvorland', 'alpen'],
    rollen: [{ hoehenstufen: ['submontan', 'montan'], rolle: 'neben' }],
    modell: { krone: 'kegel-flach', laub: '#2F5038', rinde: '#9A9A94', hoehe: 1.3 },
  },
  {
    id: 'fichte',
    name: 'Gemeine Fichte',
    lat: 'Picea abies',
    status: 'heimisch',
    hoehenstufen: ['montan', 'hochmontan'],
    boeden: ['sauer', 'feucht', 'kalkreich'], // kalkreich: in den Kalkalpen
    grosslandschaften: ['mittelgebirge', 'alpen'],
    // Nur Hochharz, hohe Lagen von Erzgebirge und Bayerischem Wald sowie die Alpen.
    // TODO fachlich prüfen
    heimisch_in: ['hochharz', 'oberes-erzgebirge', 'innerer-bayerischer-wald', 'alpen'],
    forstlich_angebaut: true,
    rollen: [
      { hoehenstufen: ['hochmontan'], rolle: 'haupt' },
      { hoehenstufen: ['montan'], rolle: 'neben' },
    ],
    modell: { krone: 'kegel', laub: '#2C4A34', rinde: '#6B5444', hoehe: 1.3 },
  },
  {
    id: 'laerche',
    name: 'Europäische Lärche',
    lat: 'Larix decidua',
    status: 'heimisch',
    hoehenstufen: ['montan', 'hochmontan'],
    boeden: ['kalkreich', 'sauer'],
    grosslandschaften: ['alpen'],
    heimisch_in: ['alpen'], // nur in den Alpen heimisch
    forstlich_angebaut: true,
    modell: { krone: 'kegel', laub: '#8FAF5E', rinde: '#7A5040', hoehe: 1.15 },
  },
  {
    id: 'eibe',
    name: 'Eibe',
    lat: 'Taxus baccata',
    status: 'heimisch',
    hoehenstufen: ['kollin', 'submontan', 'montan'],
    boeden: ['kalkreich'],
    grosslandschaften: ['mittelgebirge', 'alpenvorland', 'alpen'], // TODO fachlich prüfen: sehr zerstreut
    modell: { krone: 'oval', laub: '#24402C', rinde: '#8A4A36', hoehe: 0.5 },
  },
  {
    id: 'zitterpappel',
    name: 'Zitterpappel',
    lat: 'Populus tremula',
    status: 'heimisch',
    hoehenstufen: BIS_MONTAN,
    boeden: ['sauer', 'kalkreich', 'sandig', 'feucht'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland', 'alpen'],
    modell: { krone: 'oval', laub: '#7EA552', rinde: '#B8BBA8', hoehe: 0.85 },
  },
  {
    id: 'silberweide',
    name: 'Silberweide',
    lat: 'Salix alba',
    status: 'heimisch',
    hoehenstufen: ['planar', 'kollin'],
    boeden: ['feucht'], // Flussauen
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland'],
    modell: { krone: 'haengend', laub: '#9FB58A', rinde: '#7C7668', hoehe: 0.9 },
  },
  {
    id: 'salweide',
    name: 'Salweide',
    lat: 'Salix caprea',
    status: 'heimisch',
    hoehenstufen: BIS_MONTAN,
    boeden: ['sauer', 'kalkreich', 'sandig', 'feucht'],
    grosslandschaften: ['tiefland', 'mittelgebirge', 'alpenvorland', 'alpen'],
    modell: { krone: 'rund', laub: '#7C9A5E', rinde: '#6E675C', hoehe: 0.5 },
  },

  // --- Nicht heimisch, aber häufig gepflanzt. Damit die App "nicht heimisch" anzeigen kann. ---
  {
    id: 'douglasie',
    name: 'Douglasie',
    lat: 'Pseudotsuga menziesii',
    status: 'eingefuehrt', // stammt aus Nordamerika
    hoehenstufen: [],
    boeden: [],
    grosslandschaften: [],
    forstlich_angebaut: true,
    modell: { krone: 'kegel', laub: '#34573D', rinde: '#5A4234', hoehe: 1.4 },
  },
  {
    id: 'roteiche',
    name: 'Roteiche',
    lat: 'Quercus rubra',
    status: 'eingefuehrt', // stammt aus Nordamerika
    hoehenstufen: [],
    boeden: [],
    grosslandschaften: [],
    forstlich_angebaut: true,
    modell: { krone: 'rund', laub: '#5C7E3A', rinde: '#6A645C', hoehe: 1.1 },
  },
];

export const baumById: Record<string, Baumart> = Object.fromEntries(BAUMARTEN.map((b) => [b.id, b]));
