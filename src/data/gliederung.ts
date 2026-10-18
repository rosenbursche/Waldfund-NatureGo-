import type { KategorieId } from './artTypen';

/**
 * Gliederung der vier Lebensbäume: Rune → Ast → Zweig → Art (Konzept: docs/KONZEPT-STAMMBAUM-GLIEDERUNG.md).
 * Die Reihenfolge hier ist die Reihenfolge im Baum. Höchstens 7 Äste je Rune, 2–12 Arten je Zweig.
 * `kurz`: Name am Knopf im Baum (der volle Name steht im geöffneten Ast).
 * `mond`: Meisterast – schwer zu finden (nachts, sehr klein oder sehr scheu).
 */
export type AstPlan = {
  name: string;
  /** kurzer Name für den Knopf am Baum */ kurz: string;
  zweige: string[];
  mond?: boolean;
};

export const GLIEDERUNG: Record<KategorieId, AstPlan[]> = {
  saeuger: [
    { name: 'Huftiere', kurz: 'Huftiere', zweige: ['Hirsche', 'Wildrinder, Wildschafe & Wildschwein'] },
    { name: 'Raubtiere', kurz: 'Raubtiere', zweige: ['Hunde & Waschbär', 'Marder', 'Katzen & Bär'] },
    {
      name: 'Nagetiere & Hasen',
      kurz: 'Nager',
      zweige: ['Hörnchen & Biber', 'Bilche', 'Wühlmäuse & Hamster', 'Mäuse & Ratten', 'Hasen'],
    },
    { name: 'Insektenfresser', kurz: 'Igel & Co.', zweige: ['Igel, Maulwurf & Spitzmäuse'], mond: true },
    {
      name: 'Fledermäuse',
      kurz: 'Fledermäuse',
      zweige: ['Mausohren', 'Abendsegler & Zwergfledermäuse', 'Langohren, Hufeisennasen & Co.'],
      mond: true,
    },
    { name: 'Meer & Küste', kurz: 'Küste', zweige: ['Robben & Wal'] },
  ],
  voegel: [
    {
      name: 'Kleine Sänger',
      kurz: 'Sänger',
      zweige: ['Meisen, Kleiber & Baumläufer', 'Winzlinge, Laubsänger & Grasmücken', 'Rohrsänger'],
    },
    {
      name: 'Drosseln & Finken',
      kurz: 'Finken',
      zweige: ['Drosseln', 'Schnäpper & Rotschwänze', 'Finken', 'Sperlinge & Ammern'],
    },
    {
      name: 'Rabenvögel & Offenland',
      kurz: 'Raben',
      zweige: ['Rabenvögel', 'Würger, Star & Pirol', 'Schwalben, Lerchen & Stelzen'],
    },
    {
      name: 'Spechte, Tauben & Juwelen',
      kurz: 'Juwelen',
      zweige: ['Spechte', 'Tauben & Kuckuck', 'Bunte Juwelen', 'Hühnervögel'],
    },
    {
      name: 'Jäger der Lüfte',
      kurz: 'Jäger',
      zweige: ['Bussarde, Milane & Adler', 'Habichte, Weihen & Falken', 'Eulen'],
    },
    {
      name: 'Am Wasser',
      kurz: 'Wasser',
      zweige: [
        'Enten, Gänse & Schwäne',
        'Taucher, Rallen & Kormoran',
        'Reiher, Störche & Kraniche',
        'Watvögel & Möwen',
      ],
    },
  ],
  pilze: [
    {
      name: 'Röhrlinge',
      kurz: 'Röhrlinge',
      zweige: ['Steinpilze & Hexen', 'Maronen, Rotkappen & Birkenpilze', 'Schmierröhrlinge & Krempling'],
    },
    {
      name: 'Wulstlinge, Champignons & Täublinge',
      kurz: 'Wulstlinge',
      zweige: ['Wulstlinge, Schirmlinge & Champignons', 'Täublinge & Milchlinge'],
    },
    {
      name: 'Weitere Blätterpilze',
      kurz: 'Blätterpilze',
      zweige: [
        'Büschel am Holz',
        'Ritterlinge & Rötlinge',
        'Tintlinge, Schwindlinge & Rüblinge',
        'Häublinge, Risspilze & Rauköpfe',
      ],
    },
    {
      name: 'Leisten, Stacheln & Porlinge',
      kurz: 'Porlinge',
      zweige: ['Pfifferlinge, Stoppelpilze & Stachelbärte', 'Porlinge & Baumschwämme'],
    },
    {
      name: 'Wunderliche Formen',
      kurz: 'Wunderliche',
      zweige: ['Korallen, Keulen & Gallert', 'Boviste, Erdsterne & Stinkmorcheln', 'Morcheln, Becherlinge & Trüffel'],
    },
  ],
  pflanzen: [
    { name: 'Bäume', kurz: 'Bäume', zweige: ['Laubbäume', 'Nadelbäume'] },
    {
      name: 'Sträucher & Ranken',
      kurz: 'Sträucher',
      zweige: ['Beeren- & Dornsträucher', 'Holunder, Schneeball & Heckensträucher', 'Ranken, Immergrüne & Ginster'],
    },
    {
      name: 'Frühblüher',
      kurz: 'Frühblüher',
      zweige: ['Weiße & gelbe Teppiche', 'Glöckchen, Schlüsselblumen & Veilchen'],
    },
    {
      name: 'Waldboden',
      kurz: 'Waldboden',
      zweige: ['Beeren, Heide & Schattenlilien', 'Kräuter im Schatten', 'Giftige Schönheiten'],
    },
    {
      name: 'Wiese & Feld',
      kurz: 'Wiese',
      zweige: [
        'Korbblüten der Wiese',
        'Klee & Glockenblumen',
        'Bunte Wiesenblumen',
        'Ackerblumen & Schuttplätze',
        'Am Wegrand',
        'Doldenblütler',
      ],
    },
    { name: 'Wasser & Moor', kurz: 'Moor', zweige: ['Ufer & Bach', 'Im Wasser & Röhricht', 'Moor'] },
    {
      name: 'Orchideen & Farne',
      kurz: 'Orchideen',
      zweige: ['Orchideen & Türkenbund', 'Farne', 'Schachtelhalme & Bärlapp'],
    },
  ],
};

/** Heimische Nadelbäume (Zweig „Nadelbäume“ im Ast „Bäume“), alle anderen Baumarten sind Laubbäume */
export const NADELBAEUME = new Set(['waldkiefer', 'weisstanne', 'fichte', 'laerche', 'eibe', 'douglasie']);

/**
 * Gefahrenstufe: 3 = tödlich giftig / lebensgefährlich, 2 = sehr giftig / kann angreifen, 1 = giftig / Vorsicht.
 * Bei gleicher Stufe gilt diese Reihenfolge (wissenschaftliche Namen) für „Die Gefährlichsten“ in der Schatzkammer.
 * TODO fachlich prüfen
 */
export const GEFAHR_REIHENFOLGE = [
  'Ursus arctos',
  'Sus scrofa',
  'Vulpes vulpes',
  'Amanita phalloides',
  'Cortinarius orellanus',
  'Galerina marginata',
  'Aconitum napellus',
  'Conium maculatum',
  'Cicuta virosa',
];
