# Artendatenbanken klonen statt selbst bauen? (Ergänzung zum Bericht „Offene Artendatenbanken für Wildfund“)

Stand der Recherche: 25.10.2026. Nur NEUE Befunde gegenüber `reports/Offene Artendatenbanken für Wildfund.md`. Quellen, die dort schon geklärt sind (COL, Wikidata, WCVP, GRIIS, GBIF, EEA, EIVE, AVONET, AnAge, Storchová & Hořák, TRY, BIEN, BiolFlor/FloraWeb, DGfM, EOL-Etikett „gemischt“), werden hier nicht wiederholt. Mehrere Seiten haben automatische Abrufe blockiert (eol.org: HTTP 403, xeno-canto.org: „BotStopper“), und eine Wikidata-Zählabfrage lief in einen Timeout. Diese Punkte stehen bei den Lücken.

## 1. Wikipedia: Darf Wildfund Fakten herausziehen und umformulieren, und was heißt „share-alike“?

### Takeaway
Ja. Die Wikimedia-Nutzungsbedingungen sagen ausdrücklich, dass **Fakten ohne Namensnennung frei weiterverwendet werden dürfen**. Share-alike (CC BY-SA 4.0) betrifft nur **übernommenen oder bearbeiteten Text**, nicht Fakten, die Wildfund in eigenen Worten neu formuliert. Kommerzielle Nutzung ist ausdrücklich erlaubt. Wer Wikipedia-Sätze (auch gekürzt oder leicht verändert) übernimmt, muss das Ergebnis unter CC BY-SA stellen, Autoren bzw. den Artikel nennen und die Änderung kennzeichnen.

### Cited Findings
- Wikimedia Terms of Use: „facts you contribute to the projects may be reused freely without attribution“. Fakten unterliegen also weder der Namensnennungs- noch der Share-alike-Pflicht. — [Wikimedia Terms of Use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)
- Wer Text verändert oder ergänzt, muss die Änderungen unter CC BY-SA 4.0 (oder später) lizenzieren, die Änderung kennzeichnen und einen Lizenzhinweis beifügen. — [Wikimedia Terms of Use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)
- Die Lizenzen erlauben ausdrücklich kommerzielle Nutzung („these licenses do allow commercial uses“). Text steht unter CC BY-SA 4.0 und GFDL, Nachnutzer dürfen sich eine der beiden aussuchen. — [Wikimedia Terms of Use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)
- Namensnennung ist möglich per Hyperlink oder URL zum Artikel, über eine stabile, frei zugängliche Kopie oder durch eine Liste aller Autoren. — [Wikimedia Terms of Use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)
- Beitragende, die ein Sui-generis-Datenbankrecht an ihren Beiträgen haben, verzichten unter CC BY-SA 4.0 darauf. — [Wikimedia Terms of Use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)
- API-Zugang: Jede Anfrage braucht einen User-Agent-Header mit Kontaktangabe, sonst kann sie ohne Vorwarnung gesperrt werden. Lizenz und Namensnennung können je Wiki und API unterschiedlich sein. — [Wikimedia APIs/Access policy](https://www.mediawiki.org/wiki/Wikimedia_APIs/Access_policy)
- Der REST-Endpunkt `/api/rest_v1/page/summary/TITLE` liefert Einleitungsabsatz, Kurzbeschreibung und Vorschaubild. Für den Volltext nimmt man die Action API. Begriffsklärungsseiten kommen mit eigenem `type` zurück. — [Community-Wiki, inoffiziell](https://moltchat-agent-commons.onrender.com/wiki/Wikipedia_API_get_page_summary_and_extract); bei Überschreitung gibt es HTTP 429, Clients sollen Backoff einbauen — [MediaWiki REST overview (Mintlify-Spiegel)](https://www.mintlify.com/wikimedia/mediawiki/api/rest/overview)
- Rate-Limits sind uneinheitlich angegeben: Ein Leitfaden nennt höchstens 3 gleichzeitige Anfragen, zwei Zweitquellen nennen rund 200 Anfragen pro Sekunde. Beides ist nicht offiziell bestätigt. — [policylayer](https://policylayer.com/tools/io-github-pipeworx-io-wikimedia-rest/page-summary), [Access policy](https://www.mediawiki.org/wiki/Wikimedia_APIs/Access_policy)
- Qualität: Laut einer Studie von 2025 (arXiv-Preprint) haben die englische und die deutsche Wikipedia in fast allen 18 Themenbereichen die höchste Qualität. „Taxon“ ist einer davon; in diesem Bereich liegt Englisch vorn. — [arXiv 2505.16506](https://arxiv.org/pdf/2505.16506)
- Über 74 % der Konzepte gibt es nur in einer einzigen Wikipedia-Sprache. Das ist ein allgemeiner Wert, keiner für Arten. — [arXiv 1904.01689](https://arxiv.org/pdf/1904.01689)

### Inferences
- Für Wildfund ist der saubere Weg: **Wikipedia als Faktenquelle lesen und dann neu schreiben**. Ein Agent zieht Fakten heraus (z. B. „Paarungszeit Juli–August“), und ein Texter oder Modell formuliert sie ohne Satzübernahme neu. Diese Texte gehören dann Wildfund. Wer dagegen die Einleitung per API 1:1 anzeigt (wie iNaturalist, siehe Abschnitt 3), muss sie als CC BY-SA mit Link kennzeichnen. Das ist erlaubt, macht diese Texte aber für Mitbewerber kopierbar.
- Grauzone: Je enger eine „Umformulierung“ am Original bleibt (gleiche Gliederung, gleiche Bilder, gleiche Auswahl), desto eher ist sie eine Bearbeitung und fällt damit unter CC BY-SA. Das ist eine Schlussfolgerung, keine Rechtsauskunft.
- Wikipedia (CC BY-SA 4.0) verzichtet auf das Datenbankrecht. Fakten massenhaft aus den Dumps zu ziehen ist damit unproblematisch.

### Gaps
- **Wie viele europäische oder deutsche Arten einen Artikel in der deutschen Wikipedia haben, ließ sich nicht beziffern.** Eine Studie dazu wurde nicht gefunden, und die eigene Zählabfrage bei Wikidata (Sitelinks dewiki/enwiki für Rang „Art“) brach mit „upstream request timeout“ ab. Wildfund kann das offline zählen: Im ChecklistBank-Export „Wikidata Species“ oder im Wikidata-Dump die Sitelinks `dewiki` je Art auszählen und mit der Artenliste abgleichen.
- Offizielle Rate-Limits der Wikimedia-REST-API (Stand 2026) wurden nicht bestätigt.
- **Wikispecies** wurde nicht geprüft. Zu erwarten ist CC BY-SA, als Wikimedia-Projekt, aber das ist nicht verifiziert. Inhaltlich ist Wikispecies vor allem Taxonomie, die COL schon liefert.

## 2. Weitere Kandidaten: Inhalt, Lizenz, Format, kommerziell?

### Takeaway
Keine der neu geprüften Quellen liefert fertige, kommerziell freie Artentexte. Brauchbar sind **GloBI** (Interaktionen, viele Formate, Lizenz aber je Datensatz), **BHL** (gemeinfreie Altliteratur und CC0-Metadaten), **BOLD-Bilder** (seit etwa 2022 zu 85 % CC BY) und **Mushroom Observer** (Bilder je Lizenz filtern). Ungeklärt oder blockiert sind POWO-Texte, FungalTraits, EOL TraitBank und xeno-canto API v3.

### Cited Findings
**GloBI (Global Biotic Interactions)**
- GloBI ist ein Suchindex über bestehende offene Datensätze, kein zentrales Archiv, und durchsucht laufend Datenregister. — [GloBI About](https://www.globalbioticinteractions.org/about)
- Downloads gibt es als TSV, CSV, Parquet und N-Quads, dazu Darwin-Core-Archive, eine Neo4j-v5.26-Graphdatenbank sowie Taxon-Maps und Zitationsdateien. SQLite oder DuckDB lassen sich daraus bauen. Stabile Versionen liegen auf Zenodo (Konzept-DOI 10.5281/zenodo.3950589), aktuelle „instabile“ Snapshots auf depot.globalbioticinteractions.org. — [GloBI Data](https://www.globalbioticinteractions.org/data)
- Auf der Datenseite steht **keine Gesamtlizenz**. Jeder Eintrag hat eine Referenz und ein Datensatz-Zitat, und Nutzer sollen die ursprünglichen Beitragenden nennen. — [GloBI Data](https://www.globalbioticinteractions.org/data)
- Die Zahl der Interaktionen und die Update-Frequenz stehen nicht auf den Seiten. — [GloBI Data](https://www.globalbioticinteractions.org/data)

**Plants of the World Online (POWO, Kew)**
- Für Daten, die nicht unter CC BY stehen, verweist Kew auf die jeweiligen Bedingungen und Metadaten. Für Daten Dritter legt Kew keine zusätzlichen Einschränkungen auf. Eine Standardlizenz für die POWO-Beschreibungstexte wurde nicht gefunden. — [Kew Terms of Use](https://www.kew.org/node/2426)
- Bilder auf POWO können beim Fotografen urheberrechtlich geschützt bleiben. Belegt ist das nur durch einen einzelnen Brief von Kew an einen Fotografen. — [efloraofindia](https://efloraofindia.com/?p=1524700)

**Biodiversity Heritage Library (BHL)**
- Alle BHL-**Metadaten** stehen unter CC0. — [BHL FAQ](https://about.biodiversitylibrary.org/?p=1027)
- Vieles in BHL ist gemeinfrei bzw. 1924 oder früher erschienen. — [NYBG](https://nybg.org/planttalk/the-biodiversity-heritage-library)
- Urheberrechtlich geschützte Werke (mit Erlaubnis eingestellt) sind nur nicht-kommerziell nutzbar (CC BY-NC-SA 4.0). Für kommerzielle Nutzung muss man den Rechteinhaber fragen, BHL selbst kann das nicht erlauben. — [BHL FAQ](https://about.biodiversitylibrary.org/?p=1027)
- Gewünschte Namensnennung: „Image from the Biodiversity Heritage Library. Contributed by [Holding Institution]“. — [BHL FAQ](https://about.biodiversitylibrary.org/?p=1027)

**BOLD Systems (DNA-Barcodes)**
- Etwa 2022 wurden 85 % der Exemplarbilder von CC BY-NC-SA auf **CC BY** umgestellt, damit ist auch kommerzielle Nutzung mit Namensnennung erlaubt. — [Centre for Biodiversity Genomics](https://biodiversitygenomics.net/projects/bold/)
- BOLD v5 bietet programmatischen Zugriff, wöchentliche Datenpakete und DOIs für Referenzdatensätze. — [iBOL Europe 2025](https://iboleurope.org/wp-content/uploads/2025/01/BOLD-v5-iBOL-Europe-27-Jan-2025.pdf)
- Für Sequenzen und Metadaten in v5 wurde keine Lizenz gefunden.

**Mushroom Observer**
- Die Inhalte stehen unter CC BY-SA, je nach Beitrag mit oder ohne NC. — [Wikipedia: Mushroom Observer](https://en.wikipedia.org/wiki/Mushroom_Observer)
- MycoPortal nennt für den Sammlungs-Snapshot (Stand 2.7.2025) „CC BY“ und rund 1.004.804 Bilder. Das ist die Angabe eines Aggregators, nicht von Mushroom Observer selbst. — [MycoPortal MUOB](https://www.mycoportal.org/portal/collections/misc/collprofiles.php?collid=36)
- Commons lehnt NC-Bilder von Mushroom Observer ab. — [Commons User talk](https://commons.wikimedia.org/wiki/User_talk:Alan_Rockefeller)

**FungalTraits**
- Eine Tabelle mit 17 Lebensweise-Merkmalen je **Gattung** (Pilze und Stramenopila), erschienen in Fungal Diversity 105 (2020), DOI 10.1007/s13225-020-00466-2, mit einer Korrektur 2021. — [Univ. Tartu PDF](https://sisu.ut.ee/wp-content/uploads/sites/474/polme2020_article_fungaltraitsauser-friendlytrai.pdf); [Memphis](https://digitalcommons.memphis.edu/facpubs/531); [KU](https://researchprofiles.ku.dk/en/publications/fungaltraits-a-user-friendly-traits-database-of-fungi-and-fungus-/)
- Eine Datenlizenz wurde nicht gefunden.

**EU-Datenbankrecht (§ 87a ff. UrhG)**
- Laut EuGH zählen als Investition nur die Mittel, mit denen vorhandene Elemente ermittelt und zusammengestellt werden, nicht die Mittel, mit denen sie erzeugt werden (Pferdewetten/Fixtures-Urteile, u. a. C-203/02). — [lexetius EuGH](https://lexetius.com/2004,2512)
- Entnahme und Weiterverwendung setzen keinen direkten Zugriff auf die Datenbank voraus. Ob ein Teil quantitativ wesentlich ist, bemisst sich am entnommenen Volumen im Verhältnis zum Gesamtinhalt. — [lexetius EuGH](https://lexetius.com/2004,2512)
- § 87b Abs. 1: Geschützt sind die ganze Datenbank oder ein nach Art oder Umfang wesentlicher Teil. Auch die **wiederholte, systematische Entnahme unwesentlicher Teile** ist verboten, wenn sie der normalen Auswertung zuwiderläuft. Die Fassung von 2026 verweist in Abs. 3 auf Art. 43 des Data Act (VO 2023/2854). — [§ 87b UrhG](https://gesetze.legal/bund/urhg/87b)
- BGH „HIT BILANZ“: Daten zu entnehmen und neu anzuordnen kann eine Verletzung sein, die neue Anordnung ändert daran nichts. Die Schutzschwelle gilt in der Literatur als niedrig. — [Haufe](https://www.haufe.de/id/beitrag/3-recht-der-werknutzung-2-schutzrecht-sui-generis-HI15189613.html)

### Inferences
- **Einzelne Fakten sind frei, ganze Datenbanken nicht.** Wer per Skript systematisch alle Blütezeiten aus BiolFlor oder FloraWeb übernimmt, verletzt wahrscheinlich § 87b, auch wenn jede einzelne Angabe ungeschützt ist und neu angeordnet wird (HIT BILANZ). Wer dagegen je Art Fakten aus vielen verschiedenen Quellen sammelt (Literatur, Wikipedia, mehrere Datenbanken), entnimmt aus keiner einzelnen Datenbank einen wesentlichen Teil. Genau das macht Stufe B. Ein Fachanwalt sollte das bestätigen.
- Das EuGH-Kriterium „Erzeugen statt Sammeln“ kann bei Datensätzen helfen, die ihre Daten selbst gemessen haben (z. B. eigene Feldmessungen). Das ist aber unsicher und für die Planung nicht verlässlich.
- Für GloBI braucht es einen Lizenzfilter je Quelldatensatz über die mitgelieferten Zitations- und Datensatzangaben. Ohne Filter ist kein Gesamtimport möglich (deckt sich mit dem bisherigen Bericht).
- BHL taugt als Fundgrube für **gemeinfreie Kulturgeschichte und alte Illustrationen** (vor 1924 bzw. nach dem Tod der Urheber + 70 Jahre). Das passt zum Lehrbuch-Stil der App. Die Bilder je Werk sind auf Gemeinfreiheit zu prüfen.

### Gaps
- **EOL TraitBank / EOL-Textobjekte**: eol.org lieferte HTTP 403. Lizenz, Abdeckung und Aktualität sind über den alten Stand („gemischt inkl. NC“) hinaus nicht verifiziert.
- **xeno-canto API v3**: Die Seite war durch „BotStopper“ blockiert, die Bedingungen bleiben nicht verifiziert.
- **Plazi/TreatmentBank, Open Traits Network, Avibase, FUNGuild, Wikispecies**: nicht geprüft, weil das Budget an Abrufen aufgebraucht war. Laut dem Stand vor dieser Recherche erklärt Plazi taxonomische Behandlungen als nicht schutzfähig bzw. CC0 (**nicht verifiziert**). Avibase ist eine Taxonomie- und Namensdatenbank von Denis Lepage, die Lizenz ist **nicht verifiziert**.
- Für POWO-Beschreibungen, FungalTraits und BOLD-v5-Sequenzdaten wurde keine Lizenz gefunden.
- Ob die DGfM über die Checkliste hinaus (z. B. Pilzporträts) offene Inhalte hat, wurde nicht geprüft.

## 3. Woher haben andere Natur-Apps ihre Artentexte und Bilder?

### Takeaway
Öffentlich belegt ist wenig. **iNaturalist/Seek** zeigen eine gekürzte **Wikipedia-Einleitung** und verlinken den Artikel. **Merlin** nutzt **eigene, redaktionell geschriebene Bestimmungstexte** (Autoren und Lektoren sind namentlich genannt) und kuratierte **Macaulay-Library-Medien** aus der eigenen Institution. **Flora Incognita** hat eigene Steckbriefe (Aussehen, Giftigkeit, Schutzstatus, Blühzeit, Verbreitungskarten für Deutschland), deren Textquelle nicht öffentlich ist. Für PictureThis, Pl@ntNet, Picture Insect und ObsIdentify wurde keine belastbare Angabe gefunden.

### Cited Findings
- Die iNaturalist-Apps zeigen eine gekürzte Wikipedia-Zusammenfassung mit „more info“-Knopf, Seek verlinkt den Wikipedia-Artikel. Laut Staff ist Seek nicht zum Nachlesen über Arten gedacht. — [iNat Forum](https://forum.inaturalist.org/t/missing-link-to-wikipedia-article-for-species/43222/1); [iNat Forum Seek-Suche](https://forum.inaturalist.org/t/search-for-a-species-in-seek/17555)
- Merlin: Fotos und Töne stammen von mehr als 5.000 Beitragenden der Macaulay Library und werden vom Macaulay-Team ausgewählt und bearbeitet, damit sie die Variation jeder Art abdecken. Die Bestimmungstexte sind eigens für den Moment im Feld geschrieben, Autoren und Lektoren nennt die Seite „the story“. — [Merlin – the story](https://merlin.allaboutbirds.org/the-story/); [Macaulay Library](https://www.macaulaylibrary.org/?p=6254)
- Für die Vogelpakete kann Merlin auf mehr als 25 Mio. weitere Fotos und knapp 1 Mio. Tonaufnahmen zugreifen. — [Macaulay Library](https://www.macaulaylibrary.org/?p=6254)
- Flora Incognita: Steckbriefe mit Aussehen, Giftigkeit, Schutzstatus und Blühzeitraum, Verbreitungskarten für deutsche Arten, in Version 2.0 rund 4.800 Arten. Entwickelt von MPI für Biogeochemie Jena und TU Ilmenau, gefördert von BMBF, BMUB, BfN und Naturschutzstiftung Thüringen. — [appgefahren](https://www.appgefahren.de/?p=250889); [mobiflip](https://www.mobiflip.de/?p=373619)
- PictureThis wirbt mit „a botanist in your pocket“; der Chat mit Botanikern war (Stand 2020) eine Premiumfunktion für 30 $. Die Artenzahlen in den Eigenangaben widersprechen sich (17.000+ bzw. 400.000+ Arten). Wer die Texte schreibt, ist nicht belegt. — [Input/Inverse Review](https://www.inverse.com/input/reviews/picturethis-app-review-plant-care-identifier-for-dummies); [stork.ai](https://www.stork.ai/en/picturethis)
- Pl@ntNet: Die Modellgewichte sind proprietär. Geteilte Beobachtungen werden nur dann unter CC veröffentlicht, wenn der Artname als gültig gilt. Eine Quelle für die Artentexte ist nicht belegt. — [Wikipedia Pl@ntNet](https://en.wikipedia.org/wiki/Pl@ntNet); [INPN](https://inpn.mnhn.fr/espece/cadre/54847?lg=en)

### Inferences
- Es gibt zwei Muster: **gemeinnützige Apps übernehmen Wikipedia** (iNaturalist), **Premium-Apps schreiben selbst** (Merlin mit eigener Redaktion und eigenem Archiv). Die Apps, die am besten bewertet werden, unterscheiden sich durch eigene, auf die Bestimmung zugeschnittene Texte. Für Wildfund spricht das für eigene deutsche Texte, die aus offenen Fakten gebaut werden.
- Merlins Vorteil ist eine institutseigene Medienbibliothek. Wildfund hat keine und muss sie aus Commons, aus nach CC0/CC BY gefilterten GBIF- und BOLD-Bildern und aus eigenen Nutzerfotos aufbauen.

### Gaps
- Keine öffentlichen Angaben gefunden zu den Textquellen von Picture Insect, ObsIdentify (Observation International), Pl@ntNet-Artenseiten und PictureThis (Redaktion oder KI?). Bei Flora Incognita ist offen, ob Wikipedia verwendet wird. Klären ließe sich das, indem man die Apps selbst ansieht (Quellenhinweise auf den Artenseiten) oder die Anbieter anschreibt.

## 4. Was fehlt auch nach dem Klonen aller offenen Quellen?

### Takeaway
Ein reiner Klon liefert Gerüst und Zahlen: Taxonomie, Namen, Status, Karte, Merkmalszahlen, Interaktionen sowie Fotos aus Commons, BOLD und Mushroom Observer (gefiltert). Es fehlen **eigene deutsche Texte** und alles **Erzählerische und Praktische**. Diese Lücke füllt nur eigene Recherche, und genau sie macht die App einzigartig.

### Cited Findings
- Deutschsprachige Wikipedia-Texte gibt es nur unter CC BY-SA. Übernommene Sätze machen Wildfund-Texte share-alike, frei sind nur die Fakten. — [Wikimedia Terms of Use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)
- Auch erfolgreiche Apps schreiben ihre Bestimmungstexte selbst (Merlin). — [Merlin – the story](https://merlin.allaboutbirds.org/the-story/)
- Für urheberrechtlich geschützte Fachliteratur in BHL ist keine kommerzielle Nutzung möglich, nur für gemeinfreie Werke. — [BHL FAQ](https://about.biodiversitylibrary.org/?p=1027)
- Systematisches Entnehmen aus einer einzelnen geschützten Datenbank ist nach § 87b UrhG auch in kleinen Teilen riskant. — [§ 87b UrhG](https://gesetze.legal/bund/urhg/87b)

### Inferences
Nach dem Klonen fehlen weiterhin, und keine der geprüften Quellen liefert dafür offen nutzbare Inhalte:
- **Deutsche „Wusstest du?“-Fakten und Artentexte** in eigenem Ton für 12–25-Jährige und Familien
- **Spuren und Zeichen**: Trittsiegel, Fraßspuren, Losung, Gewölle, Nester
- **Verwechslungsarten** mit Unterscheidungsmerkmalen
- **Kulturgeschichte, Volksnamen, Mythen**: BHL hilft nur bei gemeinfreien Altwerken; Wikipedia liefert Fakten
- **Rezepte und Nutzung**: rechtlich und haftungsseitig heikel, besonders bei Pilzen
- **Phänologie je Region**, z. B. „wann sieht man was im Harz“: nur indirekt aus GBIF-Fundmonaten ableitbar
- **Sicherheit**: Giftigkeit, Gefahr für Menschen
- **Partnerbäume von Pilzen**
- **Spielmechanik-Felder** (Seltenheit für die App, Punkte)

Die Antwort auf die Ausgangsfrage lautet deshalb: **Ja, das Gerüst lässt sich klonen und um eigene Spalten erweitern.** Die Inhalte, die die App ausmachen, sind aber eine eigene Datenbank: eine eigene Faktenschicht mit Quelle je Angabe, wie im Entwurf mit `angabe`/`quelle` geplant, und daraus eigene Texte.

### Gaps
- Wie viele europäische Arten einen deutschen Wikipedia-Artikel haben, ist offen (Zählabfrage per Timeout abgebrochen). Ohne diese Zahl lässt sich nicht abschätzen, wie viel Faktengrundlage Wikipedia für die „Zehntausende Arten“ liefert.
- Eine rechtliche Bewertung, ob ein KI-generierter Text aus Wikipedia-Fakten noch als Bearbeitung gilt, wurde nicht gefunden. Diese Frage gehört zum Anwaltstermin.
