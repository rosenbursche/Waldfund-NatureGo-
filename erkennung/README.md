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

## Grenzen (ehrlich)
- **Seltene Arten haben es schwerer.** Das Vorwissen bevorzugt häufige Arten. Eine echte Seltenheit wird dadurch eher „unsicher“ als falsch „sicher“. Für sie braucht es die Bestätigung durch die Community. Später wird das Vorwissen genauer: je Rasterfeld und Monat statt für ganz Deutschland.
- **Getestet wurde an denselben Bildern, an denen das Gewicht 0,5 gewählt wurde.** Ein Gegentest mit neuen Bildern steht noch aus, am besten mit deinen eigenen Handyfotos.
- **BioCLIP 2 hat womöglich manche dieser GBIF-Bilder beim Training gesehen.** Die echten Werte können deshalb niedriger liegen.
- **Typische Verwechslungen:** Wildschwein und Hausschwein, Wildkatze und Hauskatze, Holunder und Trauben-Holunder, Herbstzeitlose und ihre Gartenverwandten.
- **Pilze:** Die Antwort enthält immer den Hinweis, dass die Erkennung nie etwas über Essbarkeit sagt.
- **Fälschungen** wie Bildschirmfotos erkennt das Modell nicht. Dafür ist die Echtheitsprüfung zuständig (`docs/KONZEPT-WETTKAMPF.md`).
- **Rechtlich offen:** BioCLIP 2 wurde teils mit nicht kommerziellen Bildern trainiert. Das prüft ein Anwalt. Als Ersatz ist DINOv2 vorgesehen.

## Nächste Schritte
1. Gegentest mit eigenen Handyfotos.
2. Referenzbilder je Art (nur CC0 und CC BY, Lizenz je Bild geprüft) als zusätzliche Fingerabdrücke.
3. Vorauswahl je Rasterfeld und Monat aus einem GBIF-Download.
4. Server bei Modal bereitstellen und an den vorhandenen Cloudflare-Worker (`server/`) anschließen.
