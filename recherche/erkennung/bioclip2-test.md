# Machbarkeitstest: Fotoerkennung mit BioCLIP 2

Stand: 24.10.2026 · Test auf einem Mac (Apple Silicon, 8 GB RAM, MPS) · Testbilder mit Herkunft, Lizenz und Ergebnis je Bild: `testbilder.csv` (gleicher Ordner)

## Kurz gesagt

- **BioCLIP 2 erkennt die 73 App-Arten sehr gut, wenn es nur unter diesen 73 Arten wählen muss:** 96 % richtig auf Platz 1, 99 % unter den ersten 5 (708 Fotos, ca. 10 pro Art).
- Säugetiere, Vögel, Blumen/Sträucher und Pilze liegen bei 98–100 %. **Schwach sind die Bäume** (90 %): vor allem Stiel- vs. Traubeneiche, Sand- vs. Moorbirke, Winter- vs. Sommerlinde, Schwarz- vs. Grauerle und Fotos aus dem Winter (Knospen, Rinde).
- **Offen gefragt (ohne Kandidatenliste, ca. 867.000 Arten)** wird es deutlich schlechter: 71 % richtige Art, 91 % richtige Gattung. Oft nennt das Modell eine nahe verwandte, aber nicht heimische Art.
- **Große Falle: Hauskatze.** In der geschlossenen Auswahl wird jede getestete Hauskatze mit 78–100 % als **Wildkatze** erkannt. Das lässt sich mit „Gegenklassen“ beheben (siehe Abschnitt 5).
- **Fotos von Bildschirmen, Ausdrucken, Modellen und Zoo-Tieren werden genauso erkannt wie echte Funde.** BioCLIP 2 hilft also nur bei „Ist das die richtige Art?“, nicht bei „Ist das echt?“.
- **Fehler in der veröffentlichten Datei gefunden:** In der Liste mit den Art-Vektoren (`txt_emb_species.npy`) fehlen die Werte für 15.487 Arten, darunter **alle Nadelbäume**, die Eibe und alle Farne. Ohne Reparatur erkennt das Modell Fichte, Kiefer, Tanne, Lärche, Douglasie und Eibe **nie** (0 von 60). Nach der Reparatur (Abschnitt 7) klappt es.
- **Empfehlung:** Als Basis für den Baustein „Bilderkennung passt“ im Vertrauenswert reicht das, und zwar **auf dem Server** (nicht im Handy), mit der geschlossenen Auswahl plus Gegenklassen und einer Schwelle von **0,90**. Bäume sollten zunächst nur „Gattung passt“ verlangen oder einen niedrigeren Bonus geben.

## 1. Was wurde getestet?

| | |
|---|---|
| Modell | `imageomics/bioclip-2` (ViT-L/14, Lizenz MIT), geladen mit `open_clip` 3.3.0 und der Vorverarbeitung aus `pybioclip` 2.1.6 |
| Art-Liste (offen) | `imageomics/TreeOfLife-200M`, Datei `embeddings/txt_emb_species.npy` (867.455 Arten; SHA256 `c72442de…87db2`) |
| Testbilder | 708 Fotos der 73 Arten (`arten.ts` + `baumarten.ts`), meist 10 je Art; dazu 36 „Fallen“-Bilder |
| Rechner | Mac mit Apple Silicon, 8 GB RAM, Bildmodell auf MPS (Grafikchip), offene Suche auf der CPU |

**Drei Testarten:**

- **(a) Geschlossene Auswahl:** Das Modell wählt nur unter den 73 App-Arten. Zwei Varianten:
  - **(a) ToL**: die fertigen Art-Vektoren aus TreeOfLife-200M (Taxonomie + englischer Name), auf die 73 Arten eingeschränkt.
  - **(a') Latein**: Vektoren nur aus dem lateinischen Namen, so wie `pybioclip` das bei eigenen Listen macht (`CustomLabelsClassifier`).
- **(b) Offen:** Suche über alle 867.455 Arten des „Baums des Lebens“ (wie `TreeOfLifeClassifier`), Treffer auf Art- und Gattungsebene.
- **(c) Fallen:** Hauskatze, Zoo-Tiere, Fotos von Kamera-Displays, Pilz-Modelle, simulierte Bildschirm- und Ausdruck-Fotos.

Die Zahlen unten stammen aus dem Lauf **mit reparierter Art-Liste** (Abschnitt 7). Für die geschlossene Variante (a') spielt die Reparatur keine Rolle.

## 2. Testbilder und Datenleck-Risiko

**Herkunft:** GBIF-Medien von Beobachtungsportalen **ohne iNaturalist** (Arter.dk 321, Artsobservasjoner Norwegen 255, Observation.org 64, Pl@ntNet 18, Laji.fi 10, weitere 15) und Wikimedia Commons (27). Nur Bilder, deren **Medien-Lizenz** CC0, CC BY oder CC BY-SA ist (Lizenz des einzelnen Bildes geprüft, nicht nur die des Datensatzes). Herbarbelege und Fotofallen wurden über den Datensatztyp ausgeschlossen. Alle Bilder wurden auf Übersichtsbögen angesehen. Aussortiert wurden Mikroskopbilder, Küchen-/Teller-Fotos, Fotos ohne erkennbares Objekt, Bildschirmfotos (die kamen zu den Fallen) und doppelte Motive.

**Stichtag des Trainings:** BioCLIP 2 wurde auf TreeOfLife-200M trainiert. Laut Datensatz-Karte stammen die GBIF-Bilder aus einem **GBIF-Schnappschuss vom 01.05.2024** (DOI 10.15468/dl.bfv433), die EOL-Bilder wurden **im August 2024** abgerufen. Dazu kommen BIOSCAN-5M und FathomNet (keine heimischen Wirbeltiere/Pflanzen).

| Aufnahmedatum der 708 Testbilder | Anzahl | Leck-Risiko |
|---|---|---|
| 2025 oder 2026 | 678 | **sehr gering**: Foto entstand nach beiden Stichtagen |
| Juni–Dezember 2024 | 12 | gering: nach dem GBIF-Stichtag; 6 davon (Juni/August) theoretisch vor dem EOL-Abruf |
| älter (Commons-Ersatzbilder für Wildkatze 3, Uhu 7, Satans-Röhrling 5, Igel-Stachelbart 2) | 17 | **hoch**: auf Commons erst 2025/26 hochgeladen, aber teils Kopien älterer Flickr-Fotos. Diese können über EOL im Training gewesen sein. |

Hinweis auf ein Leck: Bei den 17 älteren Bildern lag das offene Modell 13-mal richtig, bei 11 neuen Bildern derselben Arten nur 4-mal. Die Stichprobe ist sehr klein, aber für Wildkatze, Uhu, Satans-Röhrling und Igel-Stachelbart sind die Ergebnisse deshalb eher **zu gut**. Für diese Arten gab es kaum frei lizenzierte Fotos ab 2025 (außer bei iNaturalist).

**Weitere Einschränkungen:**
- Die Artnamen der Testbilder stammen von den Beobachtern der Portale und sind nicht von Fachleuten geprüft.
- Viele Baumfotos stammen aus Skandinavien im Winter 2025/26 (Knospen, Rinde, kahle Äste). Das ist realistisch für eine App, macht Bäume aber schwerer.
- Wildkatze (5 Bilder), Luchs (6), Igel-Stachelbart (6), Biber (7) und Hallimasch (7) haben weniger als 8 Testbilder. Eine Wildkatze in freier Natur nach 2024 mit freier Lizenz gab es kaum.

## 3. Genauigkeit je Kategorie

Top-1 = richtige Art auf Platz 1, Top-5 = richtige Art unter den ersten fünf.

| Kategorie | Arten | Bilder | (a) ToL Top-1 | (a) ToL Top-5 | **(a') Latein Top-1** | (b) offen Art Top-1 | (b) offen Art Top-5 | (b) offen Gattung Top-1 |
|---|---|---|---|---|---|---|---|---|
| Säugetiere | 10 | 88 | 98 % | 100 % | **98 %** | 83 % | 98 % | 91 % |
| Vögel | 10 | 99 | 100 % | 100 % | **100 %** | 86 % | 100 % | 98 % |
| Pflanzen (ohne Bäume) | 16 | 160 | 100 % | 100 % | **100 %** | 73 % | 85 % | 93 % |
| Bäume | 28 | 280 | 89 % | 97 % | **90 %** | 61 % | 85 % | 85 % |
| Pilze | 9 | 81 | 99 % | 100 % | **99 %** | 72 % | 89 % | 96 % |
| **Alle** | 73 | 708 | 95 % | 99 % | **96 %** | 71 % | 89 % | 91 % |

Zum Vergleich mit der **unreparierten** Art-Liste: (a) ToL insgesamt 87 % (Bäume 68 %), offen 66 %. Alle sechs Nadelbaumarten lagen dabei bei 0 von 10.

### Schwächste Arten (geschlossen, Variante a')

| Art | richtig | häufigste Verwechslung |
|---|---|---|
| Moorbirke | 6/10 | verstreut (Salweide, Stieleiche, Zitterpappel, Grauerle) |
| Stieleiche | 6/10 | Traubeneiche (3×) |
| Elsbeere | 7/10 | Hainbuche |
| Winterlinde | 7/10 | Sommerlinde |
| Sommerlinde, Schwarzerle, Sandbirke, Bergulme, Weißtanne | 8/10 | Winterlinde, Grauerle, Bergulme, Fichte |
| Luchs, Igel-Stachelbart, Biber | 5/6, 5/6, 6/7 | Reh (unscharfes Foto), Krause Glucke, Eisvogel |

Alle anderen 57 Arten: 9 oder 10 von 10 richtig. **Stiel- vs. Traubeneiche:** Stieleiche 6× richtig, 3× als Traubeneiche erkannt. Traubeneiche 9× richtig. Das Modell neigt also zu „Traubeneiche“.

### Offene Suche: typische Fehler

Im offenen Modus nennt BioCLIP 2 oft eine **nahe Verwandte, die bei uns nicht vorkommt**. Beispiele: Wiedehopf → *Upupa antaios* (ausgestorbener Wiedehopf von St. Helena, 7 von 10), Herbstzeitlose → *Colchicum speciosum*, Eisenhut → *Aconitum cammarum*, Holunder → *Sambucus racemosa*, Satans-Röhrling → *Rubroboletus rubrosanguineus*, Luchs (Zoo) → Pardelluchs oder Kanadaluchs. Bei Bäumen landen auch **Schädlinge und Pilze auf dem Baum** auf Platz 1 (Gallmücken, Rostpilze, Wickler), weil ihre Trainingsfotos meist den Wirtsbaum zeigen. Auf **Gattungsebene** ist die offene Suche mit 91 % brauchbar.

## 4. Konfidenz: richtig vs. falsch (für den Vertrauenswert)

Die Zahl ist die Wahrscheinlichkeit, die das Modell der Art auf Platz 1 gibt (0 bis 1).

| | richtig: Median | richtig: 10 %-Quantil | falsch: Median | falsch: 25 %-Quantil |
|---|---|---|---|---|
| (a') geschlossen, Latein (677 richtig / 31 falsch) | 1,00 | 0,90 | 0,66 | 0,37 |
| (a) geschlossen, ToL (673 / 35) | 1,00 | 0,90 | 0,59 | 0,46 |
| (b) offen, Art (504 / 204) | 0,72 | 0,27 | 0,23 | 0,16 |

Richtige Treffer liegen fast immer über 0,9. Falsche streuen breit, ein Teil liegt aber auch hoch. Deshalb hilft eine Schwelle viel, aber nicht vollständig.

**Schwellenwerte, geschlossene Auswahl (a', Latein):**

| Schwelle | Bilder angenommen | davon richtig | Fehler, die trotzdem angenommen werden |
|---|---|---|---|
| 0,50 | 98 % | 97 % | 20 von 31 |
| 0,70 | 94 % | 98 % | 11 von 31 |
| 0,80 | 92 % | 98 % | 10 von 31 |
| **0,90** | **87 %** | **99,5 %** (3 Fehler bei ca. 616 angenommenen Bildern) | **3 von 31** |
| 0,95 | 82 % | 99,8 % | 1 von 31 |
| 0,99 | 72 % | 100 % | 0 von 31 |

**Kombination** „geschlossen ≥ 0,9 **und** offene Suche nennt dieselbe Art auf Platz 1“: 67 % der Bilder werden angenommen, davon 100 % richtig. Das ist strenger und kostet viele richtige Funde. Gut geeignet für seltene und legendäre Arten.

**Offene Suche allein:** ≥ 0,5 → 53 % angenommen, 94 % richtig; ≥ 0,8 → 32 % angenommen, 97 % richtig.

### Vorschlag für den Vertrauenswert (`// TODO fachlich prüfen` – Startwerte)

| Erkennung | Wirkung |
|---|---|
| geschlossen (mit Gegenklassen) ≥ 0,90 für die gemeldete Art | „Bilderkennung passt sicher“ (+) |
| zusätzlich offene Suche: gleiche Art auf Platz 1 | stärker (++), Pflicht für Seltenheit 3–4 |
| 0,50 bis 0,90 oder richtige Gattung | „unsicher“: kein Abzug, aber kein Bonus; bei seltenen Arten Community-Prüfung |
| < 0,50, eine Gegenklasse (z. B. Hauskatze) gewinnt oder andere Art auf Platz 1 | kein Bonus, Fund nicht als diese Art werten |
| Bäume | vorerst nur Gattung verlangen (Eiche, Birke, Linde, Erle) oder Schwelle 0,95 |

## 5. Fallen

| Falle | Ergebnis |
|---|---|
| **Hauskatze** (5 Fotos, getigert) | geschlossen: **5/5 als Wildkatze**, Wahrscheinlichkeit 0,78–1,00. Offen: 5/5 *Felis catus* (0,43–0,91). |
| Hauskatze **mit Gegenklassen** (Hauskatze, Hund, Wildkaninchen, Rothirsch, Damhirsch zusätzlich in der Auswahl) | 5/5 Hauskatze (0,87–0,99). Die 5 echten Wildkatzen bleiben Wildkatze. Säugetiere gesamt 85/88 statt 86/88: neu ist ein Feldhase, der als Wildkaninchen erkannt wird. |
| **Wildkatze im Zoo/Wildpark** (5) | geschlossen 5/5 Wildkatze. Offen 5/5 *Felis catus*. Mit Gegenklassen ca. 50:50 Wild- vs. Hauskatze. Das Modell trennt Wild- und Hauskatze nur unsicher. |
| **Luchs im Zoo** (3), **Uhu hinter Gitter** (1) | normal erkannt (0,96–1,00). Gitter und Zoo spielen keine Rolle. |
| **Foto vom Kamera-Display** (Eichelhäher, Schwarzstorch) | 1,00 richtige Art. Kein Hinweis auf „Bildschirm“. |
| **Simulierter Bildschirm** (5, Moiré-Raster, Spiegelung, Rahmen) | 5/5 richtige Art, meist ≥ 0,97 |
| **Simulierter Ausdruck** (5, Rasterpunkte, Papierrand) | 3/5 sicher richtig. Fuchs nur 0,46, Luchs → Wildkatze 0,73. |
| **Pilz-Modell/Diorama und Museums-Präparat** (Satans-Röhrling) | richtig erkannt (0,94 und 0,99) |

**Folge:** Die Echtheitsprüfung (Bildschirm, Ausdruck, Zoo) braucht eigene Bausteine wie im Konzept vorgesehen (App-Kamera, Kurzvideo, Ort/Zeit, Community). BioCLIP 2 erkennt das nicht von selbst. Die Bildschirm- und Ausdruck-Simulationen sind nur ein grober Ersatz für echte Abfotografier-Versuche.

## 6. Laufzeit, Größe, Speicher

| | |
|---|---|
| Modelldatei | 1,71 GB (`open_clip_model.safetensors`) |
| Art-Liste für offene Suche | 2,66 GB Vektoren + 92 MB Namen |
| Modell laden | ca. 7 s |
| Ein Bild erkennen (geschlossen, MPS) | **Median ca. 0,1 s** (Maximum 0,36 s; erstes Bild ca. 6–14 s zum Aufwärmen) |
| Offene Suche zusätzlich (CPU, 867.455 Arten) | ca. 0,3 s pro Bild (in Blöcken zu 64 Bildern) |
| Arbeitsspeicher | ca. 1,4 GB für den Prozess. Die Art-Liste wird stückweise von der Platte gelesen, Spitze gesamt ca. 4 GB. |

**Folge für die App:** Das ist zu groß für das Handy und läuft nicht in Expo Go. Passend ist ein **Server** (wie schon für Pl@ntNet in `server/` geplant). Ein Cloudflare Worker reicht dafür nicht, es braucht einen Rechner mit 4–8 GB RAM, besser eine GPU. Für die geschlossene Auswahl genügen das Modell und 73 (plus Gegenklassen) vorberechnete Vektoren. Die 2,7 GB große Art-Liste ist nur für die offene Suche nötig. Man kann sie auch auf europäische Arten kürzen.

## 7. Fehler in der Art-Liste von TreeOfLife-200M

- In `embeddings/txt_emb_species.npy` (identisch mit `txt_emb_bioclip-2.npy`, gleicher SHA256 auf Hugging Face) sind die **letzten 15.487 Spalten nur Nullen** (Index 851.968–867.454). Betroffen sind u. a. 11.819 Farne, 948 Nadelhölzer (alle Pinopsida mit Fichte, Kiefer, Tanne, Lärche, Douglasie, Eibe) und 1.747 Blütenpflanzen.
- Folge: Diese Arten kann `TreeOfLifeClassifier` von `pybioclip` **nie** vorhersagen. Bei Nadelbäumen nennt das Modell stattdessen ihre Schädlinge (z. B. Douglasien-Gallmücke, Eiben-Gallmücke).
- Das aktuelle Erzeugungs-Skript (`make_txt_embedding.py` im Repo TreeOfLife-toolbox) hat einen Kommentar, dass der **letzte, unvollständige Block** jetzt mitverarbeitet wird. Das passt genau zu diesem Fehlerbild. Die veröffentlichte Datei wurde vermutlich noch mit der alten Version erzeugt. Ob der Fehler den Autoren bekannt ist, habe ich nicht geprüft.
- **Reparatur im Test:** Die fehlenden Spalten wurden mit demselben Verfahren wie im Skript neu berechnet („an image of <7 Ränge> with common name <Name>.“, ca. 2,5 Minuten auf dem Mac). Zur Kontrolle wurde eine vorhandene Spalte nachgerechnet (Rotbuche). Sie stimmt mit Kosinus 0,98 überein, also sehr ähnlich, aber nicht bitgenau.
- Für Wildfund: Für die geschlossene Auswahl am besten **eigene Vektoren** berechnen (Variante a'). Dann ist man von dieser Datei unabhängig.

## 8. Reicht das als Basis?

**Ja, für „richtige Art?“ bei Tieren, Blumen, Sträuchern und Pilzen.** 98–100 % in der geschlossenen Auswahl ist sehr gut. Bei Schwelle 0,9 rutscht kaum ein Fehler durch. Dafür ist kein Nachtraining nötig.

**Mit Vorsicht bei Bäumen.** 90 % insgesamt, aber Artpaare innerhalb einer Gattung (Eichen, Birken, Linden, Erlen) sind unsicher, besonders im Winter. Vorschlag: zuerst nur die Gattung werten oder eine höhere Schwelle verwenden.

**Nicht geeignet** für die Echtheitsprüfung (Bildschirm, Ausdruck, Zoo).

**Wo es schwach ist:**
1. Hauskatze ↔ Wildkatze. Das ist kritisch, weil die Wildkatze selten ist und viele Punkte bringt. Gegenklassen helfen bei Hauskatzen, aber Zoo-Wildkatzen werden dann oft unsicher.
2. Nah verwandte Bäume (Stiel-/Traubeneiche, Sand-/Moorbirke, Winter-/Sommerlinde, Schwarz-/Grauerle), Winterbilder.
3. Offene Suche: bevorzugt nicht heimische Verwandte. Mit einer Liste der in Deutschland vorkommenden Arten (z. B. aus GBIF) eingrenzen.
4. Unscharfe oder kleine Motive (Luchs im Gebüsch → Reh, Biber im Wasser → Eisvogel).

**Was Nachtraining bräuchte** (z. B. ein kleiner Zusatzklassifikator auf den BioCLIP-Vektoren, kein komplettes Neutrainieren):
- Hauskatze vs. Wildkatze, mit eigenen, sauber bestimmten Fotos inkl. Wildpark-Tieren.
- Baumpaare mit Blatt-, Knospen-, Rinden- und Frucht-Fotos aus allen Jahreszeiten.
- Gegenklassen für „nicht in der App“: Haustiere, Menschen, Gartenpflanzen, gepflanzte Exoten (z. B. Rosskastanie, Thuja).
- Falls gewünscht ein eigener Detektor für Bildschirm/Ausdruck (gehört eher zur Echtheitsprüfung, Baustein 3.3).

**Offene Fragen, nicht geprüft:**
- Das Modell steht unter MIT-Lizenz, wurde aber mit Bildern trainiert, die teils nur nicht-kommerziell lizenziert sind (CC BY-NC) oder von iNaturalist stammen. Ob die kommerzielle Nutzung des Modells in der App unproblematisch ist, sollte **rechtlich geprüft** werden, bevor es eingebaut wird.
- Inzwischen gibt es auch BioCLIP 2.5 Huge (ViT-H/14, größer). Das wurde hier nicht getestet.

## 9. Wie der Test lief (zum Nachmachen)

Alles außerhalb des Repos im Arbeitsordner der Sitzung (`…/scratchpad/erkennung/`): eigene Python-Umgebung (Python 3.11, `pybioclip` 2.1.6, `torch` 2.14.1, `open_clip_torch` 3.3.0), Modell, Bilder und Skripte:
`gbif_kandidaten.py` / `commons_kandidaten.py` (Bilder suchen) → `laden.py` (laden, Übersichtsbögen) → Sichtprüfung → `auswerten.py` (Erkennung) → `reparieren.py` (Null-Spalten neu berechnen) → `gegenklassen.py` → `analyse.py` (Tabellen, CSV). Ins Repo kamen nur dieser Bericht und `testbilder.csv`.

**Spalten in `testbilder.csv`:** `test` (normal oder falle:…), Art, Bild-URL, Quellseite/GBIF-Datensatz, Herausgeber, Lizenz, Urheber, Aufnahmedatum, Upload-Datum (nur Commons) und die Ergebnisse der Varianten (a) ToL, (a') Latein und (b) offen, jeweils mit Wahrscheinlichkeit und richtig/falsch. Bei 9 GBIF-Bildern ist im Datensatz kein Urheber angegeben („unbekannt“). Die simulierten Bildschirm-/Ausdruck-Bilder sind aus Testbildern erzeugt und haben deren Lizenz.
