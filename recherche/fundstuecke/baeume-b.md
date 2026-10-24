# Fundstücke – Gruppe baeume-b

14 Baumarten, 82 Fundstücke. Daten: `baeume-b.json`. Stand: 24.10.2026.

## Quellen (kurz)
- **SDW/RP Freiburg „Der Wald, seine Bäume und Sträucher“**: Steckbriefe für alle Arten außer Moorbirke (nur das Sammelblatt „Birke“).
- **SDW-Faltblätter** (Bundesverband): Eberesche, Vogelkirsche, Elsbeere, Waldkiefer, Weißtanne, Fichte, Europäische Lärche, Eibe, Zitterpappel, Weiden, Douglasie.
- **LWF Bayern**: Moorbirke (LWF Wissen 87), Eibe (LWF Wissen 10), Roteiche (LWF Wissen 89, G. Aas); waldwissen.net (Eibe in Bayern, Roteiche/WSL).
- **Universitäten**: Innsbruck (Steckbriefe mit Blütezeit: Vogelbeere, Kiefer, Tanne, Lärche, Silber- und Salweide), Bayreuth (Kiefer).
- **Für die Lüneburger Heide**: NLWKN-Vollzugshinweise LRT 9190 (bodensaure Eichenwälder) und 91E0* (Weiden-Auwälder), NW-FVA-Steckbrief Eibe, Jahn (1985, Tuexenia) zu Kiefer und Fichte.
- Die PDFs wurden mit WebFetch bzw. curl geladen und der Text mit `pdftotext` gelesen (WebFetch allein konnte die PDFs nicht entpacken).

## Lüneburger Heide: von Natur aus heimisch?
| Art | Ergebnis | Begründung |
|---|---|---|
| Moorbirke | ja | NLWKN: typische Baumart der bodensauren Eichenwälder (Schwerpunkt Lüneburger Heide); LWF: Schwerpunkt nordwestdeutsches Tiefland |
| Vogelbeere | ja | NLWKN 9190 (Neben- und Pionierbaumart) |
| Zitterpappel | ja | NLWKN 9190 (Neben- und Pionierbaumart) |
| Waldkiefer | ja | NLWKN 9190 (lebensraumtypisch, in jungen Stadien vorherrschend); Jahn 1985: hat sich an Sonderstandorten (Moorränder, Dünen) wohl natürlich gehalten. **Die meisten heutigen Kiefernforste sind aber gepflanzt.** |
| Fichte | **unsicher** | Siehe unten |
| Salweide | unsicher | wahrscheinlich ja, aber nicht ausdrücklich belegt |
| Silberweide | unsicher | in Niedersachsen heimisch (Weichholzaue), Schwerpunkte aber Elbe, Leine, Aller, Wümme, Ems |
| Vogelkirsche | unsicher | keine regionale Quelle; meidet saure Böden (SDW) |
| Elsbeere | nein | Verbreitungsgrenze im Nordwesten sind die Mittelgebirge (SDW) |
| Weißtanne | nein | natürlich nur Süden und Mittelgebirge bis Thüringer Wald/Erzgebirge |
| Lärche | nein | in Deutschland natürlich nur in den bayerischen Alpen (SDW) |
| Eibe | nein | Lüneburger Heide gehört nicht zu den drei Verbreitungsschwerpunkten (NW-FVA) |
| Douglasie, Roteiche | nein | aus Nordamerika eingeführt |

### Wichtig: Fichte in der Lüneburger Heide
CLAUDE.md sagt: Fichte nur Hochharz, Erzgebirge, Bayerischer Wald, Alpen. Zwei Quellen sagen für die Heide etwas anderes:
- **NLWKN (LRT 9190, 2020):** „Auf feuchten Standorten der Lüneburger Heide und Südheide sind möglicherweise auch geringe Fichtenanteile standortgerecht (indigene Fichtenvorkommen).“
- **Jahn (1985):** Pollenanalysen und Archive sprechen dafür, dass Fichte und Kiefer sich an Hochmoorrändern und auf nassen Böden der „Hohen Heide“ ohne Zutun des Menschen gehalten haben.

Für die App gilt trotzdem: fast alle Fichten dort sind Aufforstungen, „hier angepflanzt“ bleibt für normale Fichtenforste richtig. Ob `fichte.heimisch_in` einen Sonderfall für feuchte Standorte der Heide braucht, muss fachlich entschieden werden.

## Abweichungen von den App-Daten
- **`arten.ts` Eibe `schutz: 0`**: Wild wachsende Eiben sind nach BArtSchV **besonders geschützt** und stehen auf der Roten Liste (waldwissen/LWF 2021, NW-FVA, SDW). Der Wert sollte höher sein.
- **Eibe `boeden: ['kalkreich']`, ohne `tiefland`**: Laut NW-FVA wächst die Eibe auf vielen Böden (bevorzugt basenreich), ein Schwerpunkt liegt an der Ostseeküste.
- **Elsbeere `grosslandschaften: ['mittelgebirge']`**: SDW sagt, im Osten reicht sie über Mecklenburg und Rügen bis Südschweden, also auch ins Tiefland. `hoechstalter: 300` → SDW: bis 200 Jahre.
- **Waldkiefer**: Der TODO („umstritten“) wird durch NLWKN und Jahn eher zugunsten von `lueneburger-heide` in `heimisch_in` beantwortet.
- **Douglasie `hoechstalter: 700`**: SDW und RP nennen bis etwa 400 Jahre (in Nordamerika mehrere hundert).
- **Roteiche `hoechstalter: 400`**: LWF: in Mitteleuropa 250 Jahre, in der Heimat 400–500.
- **Salweide `hoechstalter: 60`**: keine Quelle gefunden.
- Die übrigen Höchstalter passen ungefähr zu den Quellen.
- Neu: Die Roteiche war **Baum des Jahres 2025**, die Zitterpappel ist **Baum des Jahres 2026**. Laut Berliner Senat (2025) führt das BfN die Roteiche auf seiner Managementliste als invasive Art.

## Auffälligkeiten
- **Eibe**: Das RP-Freiburg-Blatt schreibt „unterseits deutliche weiße Streifen“, das neuere SDW-Faltblatt (mit G. Aas) „Unterseite gelbgrün“. Übernommen wurde das SDW-Faltblatt. Das ist wichtig für die Unterscheidung von der Tanne.
- **Eibe – Schutz**: In `schutz` stehen jetzt Giftigkeit (Taxin, Herzgift, nur der rote Samenmantel ist ungiftig, der Samen darin nicht; für Pferde tödlich) und der besondere Schutz wild wachsender Eiben.
- **Moorbirke**: Für ein sicheres Erkennen sind die behaarten jungen Zweige wichtig (LWF). Moorwälder sind gesetzlich geschützt (§ 30 BNatSchG) → steht in `schutz`.
- **Lärche**: In Forsten steht oft die Japanische Lärche (Zapfenschuppen wie eine kleine Rose zurückgebogen). Das steht als Verwechslung beim Zapfen.
- **Tanne**: Echte Tannenzapfen findet man nicht am Boden. Was man findet, sind meist Fichtenzapfen. Das ist ein guter „Wusstest du?“-Inhalt.
- **Findbarkeit** ist eine Einschätzung für Wanderungen in Norddeutschland und kommt nicht aus einer Quelle.

## Offene Punkte
- Viele **Monate** sind aus Angaben wie „Herbst“ oder „Spätsommer“ abgeleitet. Dazu gehört auch, dass Zapfen ganzjährig am Boden liegen. Das steht jeweils in `offen`.
- **Keimlinge**: Für keine Art gibt es eine Quelle mit Erkennungsmerkmalen, daher fehlen sie überall.
- Nicht belegt: Rinde und Knospe der Salweide, Knospe der Zitterpappel, Herbstfarbe der Moorbirke, Monate der Fichtengallen.
- Lüneburger Heide „unsicher“ bei Salweide, Silberweide und Vogelkirsche: Eine regionale Flora (z. B. Verbreitungsatlas Niedersachsen/Garve) wurde nicht geprüft.
- BfN-Originalliste zur Roteiche und die aktuelle Rote-Liste-Kategorie der Eibe wurden nicht selbst geöffnet.
