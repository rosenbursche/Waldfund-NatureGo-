# Fundstücke Säugetiere (Gruppe `saeuger`)

Stand: 24.10.2026. Daten: `saeuger.json`. Pilotregion Lüneburger Heide (Polygon aus `src/data/naturraeume.json`).

## Überblick

| Art | Fundstücke | Lüneburger Heide | Beleg Vorkommen |
|---|---|---|---|
| Reh | 7 | ja | GBIF: 5.840 Nachweise seit 2000 |
| Eichhörnchen | 7 | ja | GBIF: 2.965 |
| Wildschwein | 6 | ja | GBIF: 355 |
| Dachs | 5 | ja | GBIF: 217 |
| Rotfuchs | 5 | ja | GBIF: 619 |
| Igel | 4 | ja | GBIF: 1.712 |
| Feldhase | 6 | ja | GBIF: 2.019 |
| Biber | 7 | ja | GBIF: 470 (u. a. Örtze, Böhme, Ilmenau, Aller, Gerdau) |
| Wildkatze | 2 | ja (selten) | BUND/NLWKN 2017: genetisch an der Lopau und im Landkreis Gifhorn |
| Luchs | 4 | unsicher | nur 1 ungeprüfte GBIF-Meldung (Garlstorf, 2022) |

Insgesamt 53 Fundstücke.

**Wie GBIF abgefragt wurde:** Die GBIF-API wurde direkt mit dem Polygon „Lüneburger Heide“ abgefragt: ab 2000, ohne Geo-Fehler, nur Beobachtungen (keine Museums- oder Zoobelege). Alle Lizenzen wurden mitgezählt. Die Zahlen zeigen also nur, *dass* die Art im Gebiet gemeldet ist. Für Kartendaten in der App gilt weiter `scripts/gbif-verbreitung.mjs`, das nur CC0/CC BY nutzt. Es wurden keine Projektdateien außer diesen beiden geschrieben.

**Findbarkeit** (1–4) ist meine eigene Einschätzung nach den Quellen, zum Beispiel „häufigste Huftierspur“ (ANL) oder „nachtaktiv, selten zu sehen“. Keine Quelle nennt solche Stufen.

## Wichtigste Quellen
- DWS-Ratgeber „Fährten und Spuren“: Maße der Trittsiegel, Fraßspuren an Haselnuss und Zapfen.
- ANL Bayern „Tierspuren“ und „Dem Biber auf der Spur“: Spurbilder, Beobachtungstipps, Hinweis „Losung nicht anfassen (Fuchsbandwurm)“.
- waldwissen.net: Kot und Losung, Verbiss bei Reh, Hase und Eichhörnchen.
- DWS-Artsteckbriefe, Wallis- und Fribourg-Infoblätter, WSL (Malbaum), KORA- und WWF-Luchsleitfaden, Wildtierportal Bayern (Wildkatze), BUND-Bericht Wildkatze 2017, NLWKN-Steckbrief Biber.
- Rechtliches: BJagdG § 1 Abs. 5 (Abwurfstangen), Stadt Münster (Igel besonders geschützt), NRW (Brut- und Setzzeit 1.3.–31.7.).

PDFs wurden heruntergeladen und als Text gelesen, Webseiten mit WebFetch geöffnet.

## Auffälligkeiten
- **Wildkatze im Pilotgebiet:** Die Lüneburger Heide liegt am Nordrand der Verbreitung. Für Spaziergänger gibt es kaum sichere Fundstücke: Die Trittsiegel gleichen denen der Hauskatze, und sicher ist nur ein Gentest. Deshalb nur 2 Fundstücke. Die App sollte die Sichtung immer als „unbestätigt“ führen.
- **Luchs:** Für die Heide wurde kein gesichertes Vorkommen gefunden. Als Pilot-Art taugt er nur als „Legende“ ohne Fundort.
- **Biber** ist in der Heide verbreiteter als gedacht (Südheide-Flüsse, Aller, Ilmenau). Nagespuren sind dort gute Fundstücke für die Stufen 2–3.
- **Rechtliche Hinweise:** Abwurfstangen darf man nicht mitnehmen (Aneignungsrecht des Jägers). Igel, Biber, Wildkatze und Luchs sind geschützt. Bei Kitz, Junghase und Wildkätzchen gilt: nicht anfassen.
- **Stimmen** (Rehbellen, Fuchsranz, Luchsruf, Igelschmatzen) sind belegt, wurden aber laut Auftrag nicht aufgenommen (nur bei Vögeln).

## Abweichungen von den App-Daten
- `src/data/tiere/fuchs.ts`: Spur „Federkiele abgebissen“ (Rupfung) konnte nicht belegt werden.
- `src/data/tiere/dachs.ts`: „5 Zehen“ und „Altes Polster vor dem Bau“ stehen in keiner geöffneten Quelle. Die Winterruhe-Monate (Dez–Jan) sind ebenfalls nicht belegt, die DWS sagt nur „im Winter“.
- `src/data/tiere/feldhase.ts`: Die App sagt „Y-Spur“, die ANL beschreibt das Spurbild als „T-förmig“.
- `src/data/arten.ts` Igel: `saison` „März–Nov“, die DWS nennt dagegen Winterschlaf etwa Nov–März (aktiv also etwa Apr–Okt).
- Maße, die zu den App-Daten passen: Reh 4–5 cm, Fuchs etwa 5 cm, Igel 2–3 cm, Luchs 7–9 cm, Wildschwein 6–12 cm.
- `src/data/tiere/eichhoernchen.ts`: Das Zapfen-Fraßbild ist nur für Fichte belegt. In der Heide herrscht Kiefer vor, und Fichte ist dort nicht heimisch.

## Offene Punkte
1. Luchs: Abgleich mit dem Luchs-Monitoring Niedersachsen (Nationalpark Harz) für die Heide fehlt.
2. Wildkatze: Es gibt nur Daten von 2017. Neuere BUND- oder NLWKN-Ergebnisse für Heidekreis, Uelzen und Celle sind nicht geprüft.
3. Fuchs-Rupfung und eine eigene Quelle zu Fuchsbandwurm bei toten Tieren (z. B. RKI/BfR) fehlen.
4. Dachs: Zehenzahl, Polster vor dem Bau, Wechsel und Monate der Winterruhe.
5. Monate für Haselnuss- und Zapfenreste und für Plätzstellen des Rehs sind nicht belegt.
6. Reh-Fegezeit nur nach Wallis (März–Mai). Ein Beleg für das Tiefland fehlt.
7. Eichhörnchen: Fraßbild an Kiefernzapfen und Schutzstatus sind nicht belegt.
8. Biber: NLWKN-Verbreitungskarte nicht geöffnet. Die genauen Gewässer stammen nur aus GBIF-Ortsangaben.
