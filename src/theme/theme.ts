/**
 * Design-Tokens für Wildfund.
 * Stimmung „Hohlweg“: fast schwarzes Waldgrün, Licht nur am Ende des Weges, Moos im Licht,
 * warmes Laternenlicht. Schrift „Runenhain“: Cinzel (wie in Stein gemeißelt) + Alegreya Sans.
 * Bausteine, die diese Tokens benutzen: siehe docs/DESIGNSYSTEM.md.
 * Alle Farben, Schriften und Abstände der App kommen von hier –
 * so lässt sich der Look später an einer einzigen Stelle ändern.
 */

export const colors = {
  night: '#060907', // Nacht: tiefer Hintergrund
  forest: '#101A13', // Tiefgrün: Flächen, Karten
  moss: '#4F6B36', // Moos: Linien, Rahmen
  fog: '#A3B0A5', // Nebel: Nebentext
  moon: '#DCE3D6', // Haupttext
  amber: '#D9A24E', // Laterne: wichtigste Aktion, Belohnungen, Fenster
  rune: '#A9BC6A', // Mooslicht: Leuchten, Runen, „selten“
  rare: '#A595CC', // sehr selten
  legend: '#E2B85C', // legendär

  // Lehrbuch-Seiten (Tinte auf altem Papier, aus dem Prototyp übernommen)
  paper: '#EFE6CF',
  paperDark: '#E4D7B7',
  ink: '#3A2A1C',
  inkFaded: '#6B5640', // Bildunterschriften auf Papier
  warn: '#E07A5F', // Warnungen (Gift), gedämpft statt grell
  abgrund: '#030504', // Hintergrund der Sektion "Gefährlich & tödlich"
  blut: '#9E2F3A', // Dornen und Glut in der Gefahren-Sektion
  augenRot: '#E0402F', // glühende Augen im Schreck-Auftritt (Säugetiere)
  zahn: '#E8E0C8', // vergilbte Zähne im Schreck-Auftritt
  gift: '#A4B23C', // fahles Giftgrün (gedämpft, kein Neon): Totenkopf und Nebel im Gift-Auftritt
  giftNebel: '#4F6626', // dichter Giftnebel
  giftDunkel: '#0A1207', // Hintergrund des Gift-Auftritts

  // Deutschlandkarte: Landschaften von tief (Tiefland) bis hoch (Alpen), Wasser, Wald
  kartenTief: '#0F1A12',
  kartenHuegel: '#142017',
  kartenBerg: '#1B2A1D',
  kartenAlpen: '#263129',
  wasser: '#5B8389',
  waldSymbol: '#3F5E2E',
  shadow: '#000000',
  /** heller Nebel für Schwaden, Lichtschein und Vignetten-Übergänge */
  nebel: '#BAC5BB',
  /** Fläche einer Sektion: Tiefgrün, leicht durchscheinend (über Hintergrund und Nebel) */
  sektion: '#0C140FE6',

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
  /** Cinzel: Titel, Logo, Abschnitts-Überschriften (nur Großbuchstaben-Formen, sparsam einsetzen) */
  titel: 'Cinzel_700Bold',
  titelLeicht: 'Cinzel_600SemiBold',
  /** Cinzel klein und gesperrt: Etiketten, Abzeichen, Zahlen */
  etikett: 'Cinzel_600SemiBold',
  /** Alegreya Sans: gut lesbarer Text */
  body: 'AlegreyaSans_400Regular',
  bodyMedium: 'AlegreyaSans_500Medium',
  bodySemiBold: 'AlegreyaSans_700Bold',
  /** Alegreya Sans kursiv: kurze Forscher-Notizen und Beschriftungen in Grafiken */
  notiz: 'AlegreyaSans_400Regular_Italic',
  /** Handschrift nur noch für Lehrbuch-Zeichnungen auf Papier */
  hand: 'Kalam_400Regular',
} as const;

export const spacing = {
  xs: 4,
  s: 8,
  m: 16, // Standard-Seitenrand
  l: 24,
  xl: 32,
  xxl: 64,
} as const;

/** Kleine Radien: Kanten wirken eher geschnitzt als weich */
export const radius = { s: 4, m: 8, l: 12 } as const;
