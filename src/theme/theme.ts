/**
 * Design-Tokens für Wildfund.
 * Stimmung: Wald in der Dämmerung, altes Naturforscher-Tagebuch.
 * Alle Farben, Schriften und Abstände der App kommen von hier –
 * so lässt sich der Look später an einer einzigen Stelle ändern.
 */

export const colors = {
  night: '#0B1414', // tiefer Hintergrund
  forest: '#142420', // Flächen, Karten
  moss: '#3D5A45', // Linien, gedämpftes Grün
  fog: '#9FB3AD', // Nebel, Nebentext
  moon: '#D9E0E6', // Haupttext, Mondlicht
  amber: '#E8B86A', // Laternenlicht, Belohnungen, Fenster
  rune: '#8FD1C4', // gedämpftes Türkis für Leuchten und Runen
  rare: '#B79CE0', // sehr selten
  legend: '#E9C46A', // legendär

  // Lehrbuch-Seiten (Tinte auf altem Papier, aus dem Prototyp übernommen)
  paper: '#EFE6CF',
  paperDark: '#E4D7B7',
  ink: '#3A2A1C',
  inkFaded: '#6B5640', // Bildunterschriften auf Papier
  warn: '#E07A5F', // Warnungen (Gift), gedämpft statt grell
  abgrund: '#050808', // Hintergrund der Sektion "Gefährlich & tödlich"
  blut: '#9E2F3A', // Dornen und Glut in der Gefahren-Sektion

  // Deutschlandkarte: Landschaften von tief (Tiefland) bis hoch (Alpen), Wasser, Wald
  kartenTief: '#17271F',
  kartenHuegel: '#1C2D24',
  kartenBerg: '#24372B',
  kartenAlpen: '#2F3D36',
  wasser: '#5D8FA3',
  waldSymbol: '#3A6B48',
  shadow: '#000000',

  // Lebensbäume im Katalog – jede Kategorie hat ihre eigene Farbwelt
  // Pflanzen: Silberner Blütenbaum
  silberLaub: '#7E9C88',
  silberLaubHell: '#B4CDBD',
  silberLaubDunkel: '#2C4236',
  // Pilze: Myzelbaum in Bernstein und Rost
  myzelStiel: '#E6D2AE',
  myzelStielMitte: '#B8946A',
  myzelStielDunkel: '#5E4630',
  pilzHut: '#A4532F',
  pilzHutDunkel: '#3D2016',
  pilzLamelle: '#E9D7B5',
  myzelLicht: '#F1C978',
  // Vögel: Federbaum in Mondblau
  federHolz: '#E4ECF2',
  federHolzMitte: '#9DB4C6',
  federHolzDunkel: '#3B5266',
  feder: '#6F93AE',
  federHell: '#BFD3E2',
  federDunkel: '#24394A',
  ei: '#CFE0E6',
  // Säugetiere: Uralter Baumhirte in Rinde und Moos
  rindeHell: '#9B805E',
  rinde: '#6A543C',
  rindeDunkel: '#2F2419',
  eichenLaub: '#4F6A3A',
  eichenLaubHell: '#8AA05A',
  eichenLaubDunkel: '#1F2D1A',
  eichel: '#A57A44',

  // Zauberwald (3D-Ansicht im Katalog): Moos, Nebel und ein Licht am Ende des Hohlwegs
  zauberHimmel: '#141E19',
  zauberNebel: '#4A5F56',
  zauberNebelHell: '#8FA69A',
  zauberLicht: '#E4E8C8',
  zauberMoos: '#3E5A2A',
  zauberMoosHell: '#6E8A40',
  zauberMoosDunkel: '#16220F',
  zauberErde: '#2E2A22',
  zauberLaub: '#4A3B2A',
  zauberRinde: '#3A3128',
  zauberStamm: '#56605A',
  zauberFarn: '#36552F',
  zauberStumpf: '#4A3A2E',
} as const;

export type ColorToken = keyof typeof colors;

/**
 * Schriften. Die Namen müssen genau zu den Schlüsseln passen,
 * mit denen sie in `src/app/_layout.tsx` geladen werden.
 */
export const fonts = {
  /** Handschrift für Überschriften und Notizen (Tagebuch-Gefühl) */
  hand: 'Kalam_400Regular',
  handBold: 'Kalam_700Bold',
  /** Gut lesbare Textschrift */
  body: 'Lexend_400Regular',
  bodyMedium: 'Lexend_500Medium',
  bodySemiBold: 'Lexend_600SemiBold',
  /** Schreibmaschine für Etiketten, Zahlen, Fundnotizen */
  type: 'SpecialElite_400Regular',
} as const;

export const spacing = {
  xs: 4,
  s: 8,
  m: 16, // Standard-Seitenrand
  l: 24,
  xl: 32,
  xxl: 64,
} as const;

export const radius = { s: 6, m: 14, l: 20 } as const;
