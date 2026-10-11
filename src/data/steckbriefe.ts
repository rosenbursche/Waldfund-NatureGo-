/**
 * Ausführliche Steckbriefe für Tiere und Vögel: Merkmale, Lebensraum (mit Begründung),
 * Nahrung (verknüpft mit Arten in der App), Spuren, Wohnen & Schlafen –
 * bei Vögeln zusätzlich Füße, Nest und "Warum so gebaut?".
 *
 * TODO fachlich prüfen: Alle Texte sind allgemeines Bestimmungsbuch-Wissen, selbst formuliert
 * und vereinfacht. Bitte von einer Fachperson gegenlesen lassen.
 *
 * `nahrungIds` verweist nur auf Arten, die es in der App gibt. Daraus entsteht bei
 * Pflanzen automatisch "Wer frisst mich?" (siehe src/logic/nahrungsnetz.ts).
 */
export type Steckbrief = {
  merkmale: string[];
  lebensraumWarum: string;
  nahrung: string;
  nahrungIds: string[];
  spuren: string;
  wohnen: string;
  /** nur Vögel */
  fuesse?: string;
  nest?: string;
  warumSoGebaut?: string;
};

export const STECKBRIEFE: Record<string, Steckbrief> = {
  // ---------- Säugetiere ----------
  reh: {
    merkmale: [
      'Weißer Fleck am Hinterteil („Spiegel“) – ein Warnsignal bei der Flucht',
      'Nur die Böcke tragen ein kleines Geweih und werfen es jeden Herbst ab',
      'Kräftige Hinterläufe: guter Springer, aber kein Ausdauerläufer',
    ],
    lebensraumWarum:
      'Am Waldrand hat das Reh beides direkt nebeneinander: Deckung im Gebüsch und frisches Futter auf Wiesen und Feldern.',
    nahrung:
      'Knospen, junge Triebe, Kräuter, Blätter und im Herbst Eicheln. Rehe sind wählerisch und suchen sich die nahrhaftesten Teile aus.',
    nahrungIds: ['weisstanne', 'bergahorn', 'stieleiche', 'rotbuche', 'hainbuche', 'vogelbeere'],
    spuren:
      'Schmales, herzförmiges Trittsiegel aus zwei Hufhälften, etwa 4–5 cm lang. Losung: kleine, längliche dunkle Kügelchen.',
    wohnen: 'Kein Bau: Rehe ruhen in einer flachen Mulde im hohen Gras oder Dickicht und kauen dort wieder.',
  },
  eichhoernchen: {
    merkmale: [
      'Buschiger Schwanz als Steuer und Balancierstange beim Springen',
      'Klettert kopfüber Stämme hinunter – die Hinterfüße lassen sich nach hinten drehen',
      'Fell rotbraun bis fast schwarz, der Bauch ist immer hell',
    ],
    lebensraumWarum:
      'Wälder mit vielen Samenbäumen liefern das ganze Jahr Zapfen, Nüsse und Bucheckern – und hohe Bäume als Zuflucht.',
    nahrung: 'Samen aus Zapfen, Nüsse, Bucheckern, Eicheln, Knospen und Pilze; manchmal auch Vogeleier.',
    nahrungIds: ['hasel', 'rotbuche', 'stieleiche', 'fichte', 'waldkiefer', 'steinpilz'],
    spuren:
      'Sprungspur: Die großen Hinterfüße (5 Zehen) landen vor den Vorderfüßen (4 Zehen). Abgenagte Zapfen mit ausgefranstem Ende.',
    wohnen:
      'Kugelnest aus Zweigen hoch im Baum, der „Kobel“ – oft hat ein Tier mehrere. Im Winter hält es Winterruhe, keinen Winterschlaf.',
  },
  wildschwein: {
    merkmale: [
      'Rüssel mit Riechscheibe: findet Futter tief im Boden',
      'Keiler tragen große, scharfe Eckzähne',
      'Frischlinge sind längs gestreift – Tarnung im Licht des Waldbodens',
    ],
    lebensraumWarum:
      'Laub- und Mischwälder mit feuchten Stellen: Hier finden sie Eicheln und Bucheckern und können sich im Schlamm suhlen – das kühlt und hilft gegen Parasiten.',
    nahrung: 'Allesfresser: Eicheln, Bucheckern, Wurzeln, Pilze, Würmer, Insektenlarven und Mäuse.',
    nahrungIds: ['stieleiche', 'traubeneiche', 'rotbuche'],
    spuren:
      'Trittsiegel aus zwei Hufen mit tief sitzenden Afterklauen dahinter. Umgewühlter Boden und Schlammspuren an Baumstämmen.',
    wohnen:
      'Ruhen tagsüber in einer mit Pflanzen ausgepolsterten Mulde im Dickicht. Sie leben in Familiengruppen, den „Rotten“.',
  },
  dachs: {
    merkmale: [
      'Schwarz-weiß gestreifter Kopf',
      'Kräftige Grabkrallen an den Vorderpfoten',
      'Hält im Winter Winterruhe im Bau',
    ],
    lebensraumWarum:
      'Laubwälder an Hängen: Im lockeren Boden gräbt er seinen Bau, an Waldrändern und Wiesen sucht er nachts Futter.',
    nahrung: 'Vor allem Regenwürmer, dazu Insekten, Wurzeln, Früchte, Pilze und Mäuse.',
    nahrungIds: ['vogelkirsche', 'stieleiche'],
    spuren: 'Breites Trittsiegel mit fünf Zehen und langen Krallenabdrücken. Er legt kleine Gruben als Toilette an.',
    wohnen:
      'Großer Erdbau mit vielen Röhren und Kammern, oft über Generationen bewohnt. Die Schlafkammer polstert er mit Gras und Laub.',
  },
  fuchs: {
    merkmale: [
      'Buschiger Schwanz („Lunte“), oft mit weißer Spitze',
      'Hört Mäuse unter dem Schnee und fängt sie mit einem hohen Sprung',
      'Schlitzförmige Pupillen – gutes Sehen in der Dämmerung',
    ],
    lebensraumWarum:
      'Sehr anpassungsfähig: Waldränder, Felder und sogar Städte – Hauptsache, es gibt Verstecke und Futter.',
    nahrung: 'Vor allem Mäuse, dazu Kaninchen, junge Hasen, Vögel, Insekten, Regenwürmer, Beeren und Obst.',
    nahrungIds: ['feldhase'],
    spuren:
      'Schmales, ovales Trittsiegel mit vier Zehen und Krallen. Die Abdrücke stehen wie auf einer Perlenkette hintereinander.',
    wohnen: 'Erdbau, oft von Dachsen übernommen. Außerhalb der Jungenzeit schläft er meist oberirdisch im Dickicht.',
  },
  igel: {
    merkmale: [
      'Etwa 6.000–8.000 Stacheln – umgebildete Haare',
      'Rollt sich bei Gefahr zu einer Stachelkugel ein',
      'Hält Winterschlaf, etwa von November bis März',
    ],
    lebensraumWarum:
      'Hecken, Gärten und Waldränder mit Laub und Unterholz bieten Insekten zum Fressen und Verstecke zum Schlafen.',
    nahrung: 'Käfer, Raupen, Regenwürmer, Schnecken und andere Kleintiere – kein Obst und niemals Milch!',
    nahrungIds: [],
    spuren: 'Kleines Trittsiegel mit fünf Zehen, etwa 2,5 cm. Losung: dunkle Würstchen mit glänzenden Insektenresten.',
    wohnen:
      'Schläft tagsüber in Nestern aus Laub unter Hecken oder Reisighaufen – im Winter in einem besonders dicken Winternest.',
  },
  feldhase: {
    merkmale: [
      'Sehr lange Ohren mit schwarzer Spitze',
      'Bis zu etwa 70 km/h schnell, schlägt scharfe Haken',
      'Augen seitlich am Kopf: fast Rundumsicht',
    ],
    lebensraumWarum:
      'Auf offenen Feldern und Wiesen sieht er Feinde früh und vertraut auf Tarnung und Schnelligkeit statt auf Verstecke.',
    nahrung: 'Gräser, Kräuter, Knospen und Feldfrüchte; im Winter auch Rinde.',
    nahrungIds: [],
    spuren: 'Typisches Y-Muster: Die langen Hinterläufe landen vor den kurzen Vorderläufen.',
    wohnen:
      'Kein Bau: ruht gut getarnt in einer flachen Mulde auf dem Feld. Die Jungen kommen schon mit Fell und offenen Augen zur Welt.',
  },
  biber: {
    merkmale: [
      'Flacher, schuppiger Schwanz („Kelle“) als Steuer und Warnsignal',
      'Orange Nagezähne – Eisen im Zahnschmelz macht sie besonders hart',
      'Schwimmhäute an den Hinterfüßen',
    ],
    lebensraumWarum:
      'An langsamen Flüssen mit Weiden und Pappeln am Ufer findet er Futter und Baumaterial direkt am Wasser.',
    nahrung:
      'Reiner Pflanzenfresser: im Sommer Kräuter und Wasserpflanzen, im Winter Rinde und Zweige, vor allem von Weiden und Pappeln.',
    nahrungIds: ['silberweide', 'salweide', 'zitterpappel'],
    spuren: 'Gefällte Bäume mit sanduhrförmigen Nagespuren, Rutschen am Ufer, Trittsiegel mit Schwimmhäuten.',
    wohnen: 'Burg aus Ästen und Schlamm oder Erdbau im Ufer – der Eingang liegt immer unter Wasser.',
  },
  wildkatze: {
    merkmale: [
      'Buschiger Schwanz mit dunklen Ringen und stumpfem, schwarzem Ende',
      'Verwaschene Fellzeichnung mit dunklem Strich auf dem Rücken',
      'Sehr scheu – meidet Menschen konsequent',
    ],
    lebensraumWarum: 'Große, ruhige Laubwälder mit Lichtungen: Dort jagt sie Mäuse und findet ungestörte Verstecke.',
    nahrung: 'Vor allem Mäuse, seltener Vögel oder junge Kaninchen.',
    nahrungIds: [],
    spuren: 'Rundliches Trittsiegel mit vier Zehen, ohne Krallenabdrücke – die Krallen bleiben beim Laufen eingezogen.',
    wohnen: 'Versteckt in Baumhöhlen, Felsspalten, unter Wurzeltellern oder in Holzstapeln.',
  },
  luchs: {
    merkmale: [
      'Pinselohren und Backenbart',
      'Kurzer Stummelschwanz mit schwarzer Spitze',
      'Große, behaarte Pfoten – wie Schneeschuhe',
    ],
    lebensraumWarum: 'Große, zusammenhängende Wälder: Ein Luchs braucht ein riesiges Revier und viel Ruhe.',
    nahrung: 'Vor allem Rehe, dazu Füchse, Hasen und kleinere Tiere. Er jagt durch Anschleichen und Überraschung.',
    nahrungIds: ['reh', 'fuchs', 'feldhase'],
    spuren: 'Große, runde Trittsiegel ohne Krallenabdrücke, etwa 7–9 cm breit.',
    wohnen: 'Ruheplätze auf Felsen oder unter umgestürzten Bäumen; keine festen Bauten.',
  },

  // ---------- Vögel ----------
  amsel: {
    merkmale: [
      'Männchen schwarz mit gelbem Schnabel, Weibchen braun',
      'Melodischer Gesang, oft schon in der Morgendämmerung',
      'Sucht hüpfend am Boden nach Würmern',
    ],
    lebensraumWarum:
      'Wälder, Parks und Gärten mit Büschen: Im Gebüsch nistet sie, auf Rasen und Laubboden findet sie Futter.',
    nahrung: 'Regenwürmer, Insekten und Schnecken; im Herbst und Winter viele Beeren.',
    nahrungIds: ['holunder', 'vogelbeere', 'weissdorn', 'vogelkirsche'],
    spuren: 'Paarweise Hüpfspuren am Boden und umgewendetes Laub, wo sie nach Würmern gesucht hat.',
    wohnen: 'Schläft im dichten Gebüsch oder in Nadelbäumen.',
    fuesse:
      'Sitzfüße: drei Zehen nach vorn, eine nach hinten. Damit hält sie sich sicher an Zweigen fest – sogar im Schlaf.',
    nest: 'Napf aus Gras und Zweigen, innen mit Lehm verstrichen, in Büschen und Hecken.',
    warumSoGebaut: 'Der kräftige Schnabel ist ideal, um Regenwürmer aus dem Boden zu ziehen.',
  },
  kohlmeise: {
    merkmale: [
      'Schwarzer Kopf mit weißen Wangen, gelber Bauch',
      'Schwarzer Bauchstreifen – beim Männchen breiter',
      'Ruft „zi-zi-bä“',
    ],
    lebensraumWarum: 'Wälder, Gärten und Parks mit alten Bäumen: Sie braucht Höhlen zum Brüten.',
    nahrung: 'Im Sommer Raupen und Insekten, im Winter Samen und Nüsse.',
    nahrungIds: ['rotbuche', 'hasel'],
    spuren: 'Aufgehackte Samenschalen unter Bäumen und am Futterplatz.',
    wohnen: 'Schläft in Baumhöhlen oder Nistkästen.',
    fuesse: 'Kleine Sitzfüße mit spitzen Krallen – sie hängt sogar kopfüber an dünnen Zweigen.',
    nest: 'In Baumhöhlen oder Nistkästen, gepolstert mit Moos, Haaren und Federn.',
    warumSoGebaut: 'Der kurze, spitze Schnabel pickt Insekten aus Ritzen und hackt harte Samen auf.',
  },
  rotkehlchen: {
    merkmale: [
      'Orangerote Kehle und Brust',
      'Große, dunkle Augen – aktiv auch in der Dämmerung',
      'Singt sogar im Winter',
    ],
    lebensraumWarum: 'Unterholz in Wäldern und Gärten bietet Deckung, und am Boden findet es Insekten.',
    nahrung: 'Insekten, Spinnen und Würmer; im Herbst auch Beeren.',
    nahrungIds: ['holunder', 'vogelbeere'],
    spuren: 'Kaum Spuren – am ehesten sieht man es, wenn es beim Umgraben ganz nah herankommt.',
    wohnen: 'Schläft versteckt im dichten Gebüsch.',
    fuesse: 'Lange, dünne Beine – gemacht zum Hüpfen am Boden.',
    nest: 'Gut versteckt in Bodennähe: in Böschungen, zwischen Wurzeln oder in Mauerlöchern.',
    warumSoGebaut: 'Die großen Augen helfen bei der Futtersuche im dunklen Unterholz.',
  },
  eichelhaeher: {
    merkmale: [
      'Blau-schwarz gebänderte Federn am Flügel',
      'Warnt laut vor Gefahren – die „Polizei des Waldes“',
      'Kann andere Vögel nachahmen',
    ],
    lebensraumWarum: 'Laub- und Mischwälder mit Eichen und Buchen liefern seine wichtigste Herbstnahrung.',
    nahrung: 'Eicheln, Bucheckern, Haselnüsse und Insekten; manchmal auch Eier und Jungvögel anderer Vögel.',
    nahrungIds: ['stieleiche', 'traubeneiche', 'rotbuche', 'hasel'],
    spuren: 'Vergrabene Eicheln – aus vergessenen Verstecken wachsen junge Eichen.',
    wohnen: 'Schläft in dichten Baumkronen.',
    fuesse: 'Kräftige Sitzfüße, mit denen er eine Eichel festhält, während er sie aufhackt.',
    nest: 'Lockere Schale aus Zweigen in Bäumen oder hohen Büschen.',
    warumSoGebaut: 'Im Kehlsack kann er mehrere Eicheln auf einmal tragen und verstecken.',
  },
  buntspecht: {
    merkmale: [
      'Schwarz-weißes Gefieder mit rotem Unterschwanz',
      'Trommelt im Frühjahr, um sein Revier anzuzeigen',
      'Sehr lange Zunge zum Herausangeln von Larven',
    ],
    lebensraumWarum: 'Wälder und Parks mit alten Bäumen: Nur dort kann er Höhlen zimmern und Larven im Holz finden.',
    nahrung: 'Insektenlarven aus dem Holz; im Winter Samen aus Zapfen.',
    nahrungIds: ['fichte', 'waldkiefer'],
    spuren:
      '„Spechtschmiede“: Zapfen, die er in eine Rindenspalte klemmt und aufhackt – darunter liegen viele leere Zapfen.',
    wohnen: 'Schläft in Baumhöhlen.',
    fuesse:
      'Kletterfüße: zwei Zehen nach vorn, zwei nach hinten. Dazu stützt er sich mit den steifen Schwanzfedern am Stamm ab.',
    nest: 'Selbst gezimmerte Höhle im Stamm, ohne Polster.',
    warumSoGebaut: 'Sein Kopf ist so gebaut, dass er die Wucht der Schläge beim Hämmern abfedert.',
  },
  schwarzspecht: {
    merkmale: [
      'Größter Specht Europas, fast ganz schwarz',
      'Roter Scheitel – beim Weibchen nur am Hinterkopf',
      'Weit hallender Ruf im Flug',
    ],
    lebensraumWarum: 'Alte Buchen- und Nadelwälder: Nur dicke Stämme sind groß genug für seine Höhle.',
    nahrung: 'Vor allem Ameisen und holzbewohnende Käferlarven.',
    nahrungIds: [],
    spuren: 'Große, längliche Hackspuren an Baumstümpfen, wo er nach Ameisen gesucht hat.',
    wohnen: 'Schläft in Baumhöhlen.',
    fuesse: 'Kletterfüße wie alle Spechte: zwei Zehen vorn, zwei hinten.',
    nest: 'Große, ovale Höhle hoch im Stamm, meist in Buchen.',
    warumSoGebaut: 'Seine verlassenen Höhlen sind Wohnungen für viele andere Tiere – er ist ein Baumeister des Waldes.',
  },
  eisvogel: {
    merkmale: ['Leuchtend blauer Rücken, orange Brust', 'Langer, dolchförmiger Schnabel', 'Stößt kopfüber ins Wasser'],
    lebensraumWarum:
      'Klare, langsam fließende Gewässer mit kleinen Fischen – und steile Ufer, in die er seine Bruthöhle graben kann.',
    nahrung: 'Kleine Fische, Wasserinsekten und Kaulquappen.',
    nahrungIds: [],
    spuren: 'Brutröhren in steilen Lehmufern, oft mit Fischgräten am Eingang.',
    wohnen: 'Ruht auf Ästen dicht über dem Wasser.',
    fuesse: 'Sehr kleine Füße – er läuft kaum, sondern sitzt still auf seiner Warte über dem Wasser.',
    nest: 'Brutröhre, die er selbst in ein steiles Ufer gräbt.',
    warumSoGebaut: 'Der spitze Schnabel durchschneidet beim Sturzflug das Wasser fast ohne Spritzer.',
  },
  uhu: {
    merkmale: [
      'Größte Eule Europas mit Federohren',
      'Leuchtend orange Augen',
      'Fast lautloser Flug durch weiche Federränder',
    ],
    lebensraumWarum: 'Felsen und Steinbrüche als sichere Brutplätze, offene Flächen in der Nähe zum Jagen.',
    nahrung: 'Ratten, Mäuse, Igel, Kaninchen und Vögel – sogar andere Eulen.',
    nahrungIds: ['igel'],
    spuren: 'Gewölle: ausgewürgte Ballen aus Fell und Knochen unter dem Schlafplatz.',
    wohnen: 'Tagsüber gut getarnt in Felsnischen oder dichten Baumkronen.',
    fuesse: 'Kräftige Greiffüße mit langen Krallen, bis zu den Zehen befiedert.',
    nest: 'Kein gebautes Nest: Die Eier liegen in einer Felsnische oder einer Mulde am Boden.',
    warumSoGebaut: 'Der Gesichtsschleier wirkt wie eine Schüssel und lenkt Geräusche zu den Ohren.',
  },
  wiedehopf: {
    merkmale: ['Aufklappbare Federhaube', 'Langer, gebogener Schnabel', 'Schwarz-weiß gebänderte Flügel'],
    lebensraumWarum: 'Warme, offene Landschaften mit kurzem Gras zum Stochern und alten Bäumen mit Höhlen.',
    nahrung: 'Große Insekten wie Grillen und Käferlarven, die er aus dem Boden zieht.',
    nahrungIds: [],
    spuren: 'Kleine Stocherlöcher in kurzem Gras.',
    wohnen: 'Schläft in Höhlen oder auf geschützten Ästen.',
    fuesse: 'Kurze Beine mit kräftigen Zehen – er läuft viel am Boden.',
    nest: 'In Baumhöhlen, Mauerlöchern oder Nistkästen, ohne Polster.',
    warumSoGebaut: 'Mit dem langen Schnabel erreicht er Larven tief im Boden.',
  },
  schwarzstorch: {
    merkmale: [
      'Schwarz glänzendes Gefieder mit weißem Bauch',
      'Roter Schnabel und rote Beine',
      'Sehr scheu – brütet versteckt im Wald',
    ],
    lebensraumWarum: 'Große, ruhige Wälder mit Bächen und feuchten Wiesen: Dort fischt er ungestört.',
    nahrung: 'Fische, Frösche und Wasserinsekten.',
    nahrungIds: [],
    spuren: 'Große, dreizehige Trittsiegel im Schlamm an Bächen.',
    wohnen: 'Übernachtet auf hohen Bäumen.',
    fuesse: 'Lange Stelzenbeine zum Waten im flachen Wasser.',
    nest: 'Großer Horst aus Ästen hoch in alten Waldbäumen.',
    warumSoGebaut: 'Lange Beine und langer Schnabel – ideal zum Fischen im flachen Wasser.',
  },
};
