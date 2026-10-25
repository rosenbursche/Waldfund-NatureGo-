# Wildfund-Erkennung (Prototyp)

Foto rein, Art mit Sicherheit raus. Das Modell ist BioCLIP 2 (MIT-Lizenz) und läuft auf einem eigenen Server, nicht in der App. Hintergrund und Kosten stehen in `reports/Bilderkennung und Artenpipeline skalieren.md`, der erste Test in `recherche/erkennung/bioclip2-test.md`.

```
App ──Foto (+ später grober Ort, Monat)──▶ Server: Fingerabdruck → Vergleich mit allen Arten → Entscheidung
App ◀──sicher / Gattung / unsicher / kein Wildfund + 5 Vorschläge────────────┘
```

## Dateien
| Datei | Aufgabe |
|---|---|
| `artvektoren.py` | Berechnet einmal den Fingerabdruck jeder Art aus der Datenbank (`db/wildfund.sqlite`) plus Gegenklassen → `daten/artvektoren.npz` (17 MB, nicht im Repo) |
| `gegenklassen.json` | Haustiere und Menschen, damit z. B. aus einer Hauskatze keine Wildkatze wird. Sie geben nie Punkte |
| `erkenner.py` | Die Erkennung: Vorauswahl, Vergleich, Vorwissen (häufige Arten leicht bevorzugt), Entscheidung |
| `server.py` | Kleiner Web-Server: `POST /erkennen` (Foto, optional `gruppe`), `GET /gesund`. Speichert keine Fotos |
| `testen.py` | Prüft die Erkennung mit Testbildern bekannter Art |
| `testfotos_holen.py` | Lädt Testfotos für Zufallsarten aus GBIF: nur 2025/2026, freie Bildlizenz, ohne iNaturalist |

## Starten (Mac)
Die Python-Umgebung und das Modell (1,7 GB) liegen vom ersten Test im Arbeitsordner der Claude-Sitzung. Neu einrichten: `python3.11 -m venv venv && venv/bin/pip install -r requirements.txt` (das Modell lädt beim ersten Start).

```
venv/bin/python artvektoren.py                      # einmal, ca. 1 Minute
venv/bin/python -m uvicorn server:app --port 8765    # Server starten
```
Danach im Browser `http://localhost:8765/docs` öffnen → `/erkennen` → „Try it out“ → Foto wählen.

## Ergebnis vom 25.10.2026
Auswahl: **alle 11.550 Arten in Deutschland** (Stufe A plus 9 Gegenklassen). Es gibt keine Vorgabe aus 73 Arten. Testbilder: 711 Fotos mit freier Lizenz von GBIF und Commons (aus dem ersten Test). Die Elsbeere fehlt, weil ihr Name in der Datenbank anders lautet.

| Gruppe | Bilder | Top-1 | Top-5 | „sicher“ | davon richtig |
|---|---|---|---|---|---|
| alle | 711 | **89,2 %** | 97,9 % | 66,2 % | **98,9 %** |
| Pflanzen | 430 | 87,7 % | 97,2 % | 60,9 % | 98,9 % |
| Pilze | 83 | 88,0 % | 97,6 % | 55,4 % | 97,8 % |
| Säugetiere | 96 | 87,5 % | 99,0 % | 68,8 % | 100 % |
| Vögel | 102 | 98,0 % | 100 % | 95,1 % | 99,0 % |

- **Top-1:** Der erste Vorschlag ist richtig. **Top-5:** Die richtige Art ist unter den ersten fünf.
- **„sicher“:** Die Erkennung ist sich zu mindestens 90 % sicher. In diesen Fällen stimmt sie zu 99 %. In den übrigen Fällen fragt die App nach („Welche ist es?“) oder nennt nur die Gattung.
- **Tempo:** 0,11 Sekunden je Foto auf dem Mac (Grafikeinheit), 21 Sekunden zum Laden.

**Was die Verbesserung gebracht hat:** Zuerst lag Top-1 bei 75,7 %. Zwei Änderungen haben es auf 89,2 % gehoben:
- **Mischlinge (×) raus:** Kreuzungen wie „Traubeneiche × Stieleiche“ zogen Treffer von den echten Arten ab.
- **Vorwissen:** Häufige Arten werden leicht bevorzugt, nach der Zahl der GBIF-Nachweise in Deutschland. Vorher gewannen oft Gartenpflanzen und Irrläufer wie die Balsam-Tanne statt der Weißtanne. Getestet wurden die Gewichte 0, 0,5, 1, 1,5 und 2; 0,5 war am besten.

## Gegentest mit neuen Fotos und Zufallsarten (25.10.2026)
Der erste Test nutzte die 73 App-Arten und Fotos, an denen das Gewicht 0,5 gewählt wurde. Darum gab es einen zweiten, strengeren Test:
- **162 zufällige Arten aus der Datenbank**, keine App-Arten, jeweils mindestens 200 Nachweise in Deutschland.
- **486 Fotos**, 3 je Art von verschiedenen Fotografen.
- **Nur Aufnahmen aus 2025 und 2026**, also nach dem Trainingsstichtag von BioCLIP 2. Das Modell kann sie nicht kennen.
- Nur Bildlizenz CC0, CC BY oder CC BY-SA, jedes Bild einzeln geprüft, ohne iNaturalist.
- Die Fotos wurden nicht von Hand angesehen. Einzelne zeigen vielleicht Spuren, Lebensraum oder tote Tiere.

| Gruppe | Arten | Bilder | Top-1 | Top-5 | „sicher“ | davon richtig |
|---|---|---|---|---|---|---|
| alle | 162 | 486 | **72,0 %** | **93,0 %** | 41,6 % | **97,0 %** |
| Pflanzen | 35 | 105 | 61,0 % | 93,3 % | 27,6 % | 93,1 % |
| Pilze | 50 | 150 | 82,0 % | 94,7 % | 43,3 % | 98,5 % |
| Säugetiere | 27 | 81 | 54,3 % | 86,4 % | 22,2 % | 100 % |
| Vögel | 50 | 150 | 79,3 % | 94,7 % | 60,0 % | 96,7 % |

**Was das bedeutet:**
- **Bei Zufallsarten ist es deutlich schwerer.** Darunter sind viele Arten, die auch Fachleute auf einem Foto kaum unterscheiden: Fledermäuse (Zwerg- gegen Mückenfledermaus), Mäuse (Wald- gegen Gelbhalsmaus), Seggen, Gräser, Nachtkerzen, Ehrenpreis-Arten, Weißdorn-Arten.
- **Die Fehler sind fast immer nahe Verwandte.** Die richtige Art steht dann meist auf Platz 2. Darum passt die Auswahl mit 4–6 Kandidaten (Gesamtkonzept Abschnitt 17) sehr gut: In 93 % der Fälle ist die richtige Art dabei.
- **„Sicher“ bleibt verlässlich (97 %).** Es gab 6 falsche „sicher“, alle bei schwer trennbaren Paaren: Grauspecht/Grünspecht, Küstenseeschwalbe/Flussseeschwalbe, Strandpieper/Wiesenpieper, zwei Weißdorn- und zwei Spierstrauch-Arten, Gift-Häubling/Fälbling. Der Fall **Gift-Häubling** zeigt erneut: Bei Pilzen darf es nie eine Aussage zur Essbarkeit geben.
- **Freie Fotos sind knapp.** Für viele Säugetiere, vor allem Fledermäuse und Mäuse, gab es keine 3 frei lizenzierten Fotos aus 2025/2026. Darum sind es dort nur 27 Arten.
- **Verbessern lässt sich das** mit Referenzbildern je Art als zusätzlichen Fingerabdrücken, mit einer Vorauswahl je Rasterfeld und Monat und mit einem Zusatzklassifikator für Verwechslungspaare.

## Grenzen (ehrlich)
- **Seltene Arten haben es schwerer.** Das Vorwissen bevorzugt häufige Arten. Eine echte Seltenheit wird dadurch eher „unsicher“ als falsch „sicher“. Für sie braucht es die Bestätigung durch die Community. Später wird das Vorwissen genauer: je Rasterfeld und Monat statt für ganz Deutschland.
- **Getestet wurde an denselben Bildern, an denen das Gewicht 0,5 gewählt wurde.** Ein Gegentest mit neuen Bildern steht noch aus, am besten mit deinen eigenen Handyfotos.
- **BioCLIP 2 hat womöglich manche dieser GBIF-Bilder beim Training gesehen.** Die echten Werte können deshalb niedriger liegen.
- **Typische Verwechslungen:** Wildschwein und Hausschwein, Wildkatze und Hauskatze, Holunder und Trauben-Holunder, Herbstzeitlose und ihre Gartenverwandten.
- **Pilze:** Die Antwort enthält immer den Hinweis, dass die Erkennung nie etwas über Essbarkeit sagt.
- **Fälschungen** wie Bildschirmfotos erkennt das Modell nicht. Dafür ist die Echtheitsprüfung zuständig (`docs/KONZEPT-WETTKAMPF.md`).
- **Rechtlich offen:** BioCLIP 2 wurde teils mit nicht kommerziellen Bildern trainiert. Das prüft ein Anwalt. Als Ersatz ist DINOv2 vorgesehen.

## Nächste Schritte
1. Test mit eigenen Handyfotos (Fotos aus dem Feld, nicht von Fotografen).
2. Referenzbilder je Art (nur CC0 und CC BY, Lizenz je Bild geprüft) als zusätzliche Fingerabdrücke.
3. Vorauswahl je Rasterfeld und Monat aus einem GBIF-Download.
4. Server bei Modal bereitstellen und an den vorhandenen Cloudflare-Worker (`server/`) anschließen.
