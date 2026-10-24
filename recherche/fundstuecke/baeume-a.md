# Fundstücke Gruppe baeume-a

Stand: 24.10.2026. Daten: `baeume-a.json` (14 Arten, 109 Fundstücke).

## Kurzfassung
- Je Art 5–10 Fundstücke: Blatt (Sommer, Herbst, teils Austrieb), Rinde/Borke (jung/alt, wo belegt), Knospe/Winterzweig, Blüte/Kätzchen, Frucht/Samen, Keimling (wo belegt), ganzer Baum, dazu einige Besonderheiten (Eichengallen, Absprünge, Teerflecken am Ahorn, Korkleisten am Feldahorn, rote Schnittfläche bei der Erle, Hexenbesen an der Birke, Stammknollen an der Linde).
- Hauptquellen: die Faltblatt-Texte der **Baum des Jahres Stiftung** (meist von Prof. A. Roloff, TU Dresden), die Artensteckbriefe der **Uni Bayreuth** (Feldbotanik-Zertifizierung), die Artseiten des **Forstbotanischen Gartens der Uni Göttingen**, **LfU Bayern** (Grauerle). Für die Lüneburger Heide: **NLWKN-Vollzugshinweise** zu den Wald-Lebensraumtypen und die **NSG-Verordnung „Lüneburger Heide“** (2020).
- Arbeitsweise: PDFs und Göttinger Seiten habe ich mit `curl` heruntergeladen und vollständig gelesen (PDF mit `pdftotext`), einige Seiten mit WebFetch. Damit ist jede Quelle geöffnet und gelesen, aber nicht jede über WebFetch.

## Lüneburger Heide: von Natur aus heimisch?
Im JSON steht in `lueneburgerHeideQuelle` nur die wichtigste Quelle (als Text, wie im Format verlangt). Alle Belege:

| Art | Urteil | Begründung (Quellen) |
|---|---|---|
| Rotbuche | ja | NSG-VO „Lüneburger Heide“ nennt Buche als standortheimisch; Buchenwälder (LRT 9110/9120) im Gebiet; NSG „Lünsholz“ (Südheide) ist alter Buchenwald. |
| Traubeneiche | ja | NSG-VO: standortheimisch; LRT 9190 (Hauptbaumart), größte Vorkommen in Niedersachsen in der Lüneburger Heide. |
| Stieleiche | ja | wie Traubeneiche; dazu Eichen-Hainbuchenwald (9160). |
| Hainbuche | ja | 9160 am Ostrand der Heide (Ilmenau-Täler); Nebenbaumart in 9190 und 9110. Im Inneren der Heide aber selten (NLWKN: Verbreitungslücke). |
| Bergahorn | nein | NLWKN: nur „im Bergland“ (91E0, 9130, 9110), Schluchtwälder (9180) nur im südöstlichen Bergland; Baum des Jahres 2009: natürliche Rückwanderung nur bis Norddeutschland, an der Küste vor 500 Jahren unbekannt. |
| Spitzahorn | unsicher (eher nein) | NLWKN nennt ihn nur für Berg- und Hügelland. Uni Göttingen: „z. T. auch auf Auenstandorten heimisch“, ohne Region. |
| Feldahorn | unsicher | Widerspruch: NLWKN nennt ihn als Nebenbaumart im Eichen-Hainbuchenwald (der am Heide-Ostrand vorkommt), Uni Göttingen schreibt, er „fehlt … im deutschen Tiefland“. |
| Esche | ja | 91E0 (Erlen-Eschenwälder): Hauptbaumart; die größten und besten Vorkommen liegen in den Tälern der Lüneburger Heide und der Stader Geest. Auch Hauptbaumart in 9160. |
| Winterlinde | unsicher | NLWKN: Hauptbaumart im 9160 „in SO-Niedersachsen“, im 9130 „im SO“. Göttingen/Baum des Jahres 1991: großes Lindenvorkommen „bei Gifhorn“, aber ohne Artangabe. |
| Sommerlinde | unsicher (eher nein) | NLWKN nennt sie nur als Hauptbaumart der Schluchtwälder (9180), die nur im Bergland vorkommen. Dorflinden sind gepflanzt. |
| Bergulme | unsicher (eher nein) | NLWKN: „im Bergland auch Ulmus glabra“ (91E0, 9130); Schluchtwälder nur im Bergland. Für das Tiefland nichts belegt. |
| Schwarzerle | ja | NSG-VO: standortheimisch; 91E0 und Erlenbrüche in den Heidetälern. |
| Grauerle | unsicher (eher nein) | NLWKN (91E0): „bis heute nicht endgültig geklärt, ob die Grau-Erle in Niedersachsen heimisch ist“; Harz-Vorkommen vermutlich aus Pflanzungen. LfU Bayern: Alpen und Alpenvorland. |
| Sandbirke | ja | NSG-VO: standortheimisch; 9190 Hauptbaumart; Baum des Jahres 2000: im nordwestdeutschen Tiefland „von Natur aus wichtige Baumart“. |

Am Rande: Laut NLWKN (9110) ist die Fichte „heimisch nur in Teilen des Harzes und evtl. in der Lüneburger Heide“, und die NSG-VO nennt die Fichte als standortheimisch. Das betrifft eine andere Gruppe, könnte aber die Regel in `CLAUDE.md` („Fichte nur Hochharz …“) berühren.

## Abweichungen von den App-Daten (`src/data/baumarten.ts`, `src/data/arten.ts`)
- **Hainbuche `boeden: ['kalkreich']`**: Die Quellen nennen frische, tiefgründige, meist lehmige (Bayreuth) und feuchte bis staunasse Böden (NLWKN 9160); dazu Nebenbaumart auf bodensauren Sanden (9190). Nur „kalkreich“ ist zu eng.
- **Hainbuche `hoechstalter: 150`**: Baum des Jahres 1996 nennt eine „ca. 300-jährige“ Hainbuche (Breitenbuch).
- **Spitzahorn `hoechstalter: 150`**: Baum des Jahres 1995: „bis 200jährig“.
- **Bergulme `hoechstalter: 400`**: Baum des Jahres 1992: Höchstalter „auf 500 Jahre geschätzt“.
- **Sandbirke `hoechstalter: 120`**: Baum des Jahres 2000: „max. etwa 100 Jahre“.
- **Feldahorn und Spitzahorn mit `grosslandschaften: 'tiefland'`**: Für Niedersachsen nennt NLWKN beide nur für das Berg-/Hügelland bzw. (Feldahorn) im Eichen-Hainbuchenwald; Göttingen schreibt, der Feldahorn fehle im deutschen Tiefland. Bitte prüfen.
- **Sommerlinde `grosslandschaften` ohne Tiefland**: passt zu den Quellen.
- **Bergahorn ohne Tiefland**: passt (siehe oben).
- **Grauerle nur Alpenvorland/Alpen, `hoechstalter: 50`**: passt (LfU: „selten ein Alter von 50 (100) Jahren“).
- **`arten.ts` Stieleiche** „Eicheln Sep–Okt“: passt (reifen im Nachsommer, fallen ab Oktober; im JSON 9–11). **Rotbuche** „Bucheckern Sep–Okt“: reifen Sep/Okt, fallen meist Okt/Nov (Göttingen); im JSON 9–11.

## Hinweise zu den Feldern
- `findbarkeit` ist meine Einschätzung für Spaziergänge in der Pilotregion, nicht aus Quellen. Gepflanzte Bäume (Ahorne, Linden an Alleen) sind oft leicht zu finden, auch wenn sie dort nicht heimisch sind.
- `monate`: Wo die Quelle Monate nennt, sind diese übernommen. Wo sie nur „im Herbst“, „im Sommer“ oder „im Winter“ sagt, habe ich daraus Monate abgeleitet. Bei Winterknospen und Rinde steht die laubfreie Zeit bzw. das ganze Jahr.
- `schutz`: Nur bei den Eichen (Raupen des Eichenprozessionsspinners, Gifthaare – Baum des Jahres 2014) und bei Birkenkätzchen (Pollen) ausgefüllt. Keine der 14 Arten ist geschützt; Bäume nicht beschädigen versteht sich von selbst und ist nicht eigens belegt.

## Offene Punkte
- Keimlinge belegt nur bei Rotbuche, Eichen, Bergahorn, Sandbirke. Für Esche, Linden, Erlen, Ulme und Spitz-/Feldahorn fehlen Beschreibungen.
- Herbstfärbung von Sandbirke und Sommerlinde nicht belegt. Knospen der Schwarzerle nicht belegt.
- Stiel- und Traubeneiche sind laut Baum des Jahres 2014 nur mit mindestens 3 Merkmalen sicher zu trennen; Mischformen sind häufig. Für die Foto-Erkennung wichtig.
- Linden in Städten sind oft Hybriden (Holländische Linde), daher schwer zuzuordnen.
- Heimat-Urteile „unsicher“ (Spitzahorn, Feldahorn, Winterlinde, Sommerlinde, Bergulme, Grauerle) ließen sich mit FloraWeb-Statusdaten (indigen/eingebürgert je TK25) oder dem Atlas der Gefäßpflanzen Niedersachsens (Garve 2007) klären. Die FloraWeb-Karten ließen sich hier nicht automatisch auslesen.
- Die Texte der Baum des Jahres Stiftung sind urheberrechtlich geschützt. Ich habe nur Fakten in eigenen Worten übernommen, keine Texte oder Bilder.
