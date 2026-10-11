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
  shadow: '#000000',
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
