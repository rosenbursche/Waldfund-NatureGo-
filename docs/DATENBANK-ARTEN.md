# Wildfund – Arten-Datenbank (Entwurf)

Stand: 24.10.2026 · Entwurf zur Durchsicht · gehört zu `docs/KONZEPT-GESAMT.md`

Ziel: Eine große Datenbank mit sehr vielen Arten (Europa, später Amerika, 20.000+), jede mit **festen Spalten**. Wie viel wir über eine Art wissen, entscheidet, ob sie in die App kommt.

---

## 1. Grundidee

- **Stufe A (automatisch, für alle Arten):** Name, Taxonomie, Verbreitung je Kontinent/Land, Häufigkeit, Bild-Kandidaten. Quellen: GBIF und Wikidata. Kostet fast nichts.
- **Stufe B (Recherche durch Agenten, nur für ausgewählte Arten):** Steckbrief, Jahreslauf, Fundstücke, Schutz, Gefahren, geprüfte Referenzbilder. Jede Angabe mit Quelle.
- **Datenstand je Art:** ein Wert 0–100, wie vollständig die Art ist. Daraus folgt der Vorschlag „in die App: ja / nein / offen“. Du entscheidest.

Technik: **jetzt SQLite** (eine Datei, Skripte und Agenten schreiben hinein), so aufgebaut, dass ein Umzug nach **Supabase/Postgres** später ein Skript ist. Die App bekommt daraus einen **Offline-Auszug** je Region (wie heute `src/data/*.json`). Nutzerdaten (Konten, Funde) kommen später getrennt auf Supabase.

Gebiete werden einheitlich benannt: Kontinent (`EU`, `NA` …), Land nach ISO 3166 (`DE`, `AT`), Bundesland nach ISO 3166-2 (`DE-NI`), dazu unsere Naturräume (`lueneburger-heide`).

---

## 2. Tabellen und Spalten

### 2.1 `art` – eine Zeile je Art (Stufe A)
| Spalte | Beispiel | Herkunft |
|---|---|---|
| `id` | `wildschwein` | wir (Kurzname, eindeutig) |
| `gbif_key` | (Zahl aus GBIF) | GBIF |
| `wiss_name` | Sus scrofa | GBIF |
| `autor` | Linnaeus, 1758 | GBIF |
| `reich`, `stamm`, `klasse`, `ordnung`, `familie`, `gattung` | Animalia … Sus | GBIF |
| `kategorie` | `saeuger` / `voegel` / `pflanzen` / `baeume` / `pilze` / später `insekten`, `amphibien` … | wir |
| `wikidata_id` | (Q-Nummer) | Wikidata |

### 2.2 `name` – Namen je Sprache (Stufe A)
`art_id`, `sprache` (`de`, `en` …), `name`, `haupt` (ja/nein). Beispiel: Wildschwein, Schwarzwild.

### 2.3 `vorkommen` – wo die Art lebt (Stufe A, in B geprüft)
| Spalte | Werte |
|---|---|
| `art_id`, `gebiet` | `DE`, `DE-NI`, `lueneburger-heide` … |
| `status` | `heimisch` · `eingefuehrt` · `invasiv` · `unsicher` · `fehlt` |
| `nachweise` | Zahl der GBIF-Nachweise seit 2000 (nur freie Lizenzen) |
| `seltenheit` | 1–4, abgeleitet aus Nachweisen und Fläche (Regel in 3.2) |
| `monate` | wann man sie dort findet |
| `quelle_ids` | Belege |

### 2.4 `schutz` – Schutz und Gefährdung (Stufe B)
`art_id`, `gebiet` (`DE`, `EU`, `DE-NI`), `system` (`BNatSchG`, `BArtSchV`, `FFH`, `RoteListe`, `IUCN`), `wert` (z. B. „besonders geschützt“, „2“), `quelle_ids`.

### 2.5 `steckbrief` – feste Fachspalten (Stufe B)
Für alle Arten gleich, leere Spalten sind erlaubt (dann sinkt der Datenstand):

| Spalte | Beispiel |
|---|---|
| `groesse_min_cm`, `groesse_max_cm`, `mass` | 55–110, Schulterhöhe |
| `gewicht_min_g`, `gewicht_max_g` | |
| `hoechstalter_jahre` | |
| `lebensraum` | Laub- und Mischwald, Felder |
| `lebensraum_warum` | kurzer Satz |
| `aktivitaet` | tag / nacht / daemmerung (+ Stunden) |
| `nahrung` | Text + `nahrung_art_ids` (Nahrungsnetz) |
| `merkmale` | 3–5 Erkennungsmerkmale |
| `verwechslung` | mit welcher Art, woran unterscheidbar |
| `giftig` / `gefahr` + `gefahr_stufe` 1–3 | |
| `wusstest_du` | ein Satz |
| `raetsel` | für seltene Arten |
| `quelle_ids` | je Spalte (siehe 2.10) |

### 2.6 `jahreslauf` (Stufe B)
`art_id`, `ereignis` (Paarung, Geburt, Blüte, Frucht, Winterschlaf, Zug …), `monate`, `quelle_ids`.

### 2.7 `fundstueck` (Stufe B)
**Höchstens 4 Zeichen + 1 Sichtung je Art.** Spalten wie heute in `src/data/fundstueckTypen.ts`: `id`, `typ`, `name`, `kurz`, `erkennen`, `verwechslung`, `monate`, `findbarkeit` 1–4, `wo`, `schutz`, `reihenfolge`, `quelle_ids`.

### 2.8 `bild` – Referenzbilder (für Erkennung, Test und Anzeige)
| Spalte | Bedeutung |
|---|---|
| `art_id`, `fundstueck_id` (optional) | wozu das Bild gehört (z. B. Trittsiegel) |
| `url`, `lizenz`, `urheber`, `quelle` | nur CC0, CC BY, CC BY-SA. **Keine Bilder von iNaturalist.** |
| `aufgenommen`, `land` | Datum und Land |
| `rolle` | `referenz` (Nachtraining) · `test` (Genauigkeit messen) · `anzeige` (in der App) |
| `merkmale` | z. B. männlich, Winterfell, Jungtier, Herbstlaub |
| `geprueft` | von einem Menschen angesehen: richtige Art? |
| `fingerabdruck` | Bild-Fingerabdruck (pHash), erkennt doppelte Bilder |

Ziel je Art in der App: **mindestens 20 Referenzbilder** und **10 Testbilder**, verteilt über Geschlecht, Alter, Jahreszeit (Zahlen nach dem Erkennungs-Test anpassen).

### 2.9 `stimme` (nur Vögel)
`art_id`, `typ` (Gesang, Ruf, Warnruf, Trommeln), `url`, `lizenz`, `urheber`, `monate`, `geprueft`.

### 2.10 `quelle` und Belege
- `quelle`: `id`, `titel`, `url`, `herausgeber`, `abgerufen_am`.
- Jede Fachangabe zeigt auf mindestens eine Quelle (`quelle_ids`). Abgeleitete Werte (z. B. Monate aus „im Herbst“) bekommen den Vermerk `abgeleitet`.

### 2.11 `datenstand` – wie viel wir wissen
| Spalte | Bedeutung |
|---|---|
| `art_id`, `stufe` | A oder B |
| `vollstaendig` | 0–100 (Regel in 3.1) |
| `fehlt` | Liste der leeren Pflichtspalten |
| `app_vorschlag` | ja / nein / offen |
| `app_entscheidung` | deine Entscheidung |
| `geprueft_von`, `geprueft_am` | Fachprüfung (später) |

---

## 3. Regeln

### 3.1 Datenstand (Vorschlag)
| Teil | Punkte |
|---|---|
| Stufe A vollständig (Name de, Taxonomie, Vorkommen) | 20 |
| Steckbrief-Pflichtspalten (Größe, Lebensraum, Merkmale, Verwechslung, Nahrung) | 25 |
| Schutzstatus mit Quelle | 10 |
| 4 Fundstücke + Sichtung mit Quellen | 20 |
| ≥ 20 geprüfte Referenzbilder + 10 Testbilder | 20 |
| Erkennungstest bestanden (Schwelle aus dem Test) | 5 |

**In die App** nur ab 80 Punkten und mit bestandenem Erkennungstest. Ausnahme: Arten, die man ohne Foto nur über Fundstücke und Bestimmungsschlüssel sammelt (z. B. Wildkatze), sind als „unbestätigt“ erlaubt.

### 3.2 Seltenheit
Aus GBIF-Nachweisen je Gebiet, nur freie Lizenzen, Zoos und Museen ausgeschlossen. Genaue Schwellen nach dem ersten Import festlegen (`TODO fachlich prüfen`). Nicht nur aus Nachweisen ableiten: häufig gemeldete Arten sind nicht immer häufig (siehe `ANFORDERUNGEN.md` 2.10).

### 3.3 Schutz von Natur und Nutzern
- Fundorte nie genauer als Rasterfeld; streng geschützte Arten ohne Ortsangabe.
- Bilder ohne GPS-Daten speichern.

---

## 4. Reihenfolge

| Schritt | Inhalt |
|---|---|
| D1 | Diesen Entwurf abstimmen |
| D2 | SQLite-Datei + Aufbau als SQL (Postgres-tauglich), Import der heutigen 73 Arten samt Fundstücken |
| D3 | Stufe A automatisch: alle Arten mit Nachweisen in Deutschland aus GBIF (Säugetiere, Vögel, Gefäßpflanzen, Großpilze), dann Europa |
| D4 | Datenstand berechnen, Liste „Kandidaten für die App“ |
| D5 | Stufe B für die Kandidaten mit Agenten (feste Spalten = fester Auftrag), Referenzbilder sammeln |
| D6 | App-Auszug je Region erzeugen, App liest daraus |
| später | Umzug nach Supabase, wenn Konten und Server kommen |

## 5. Offene Fragen
1. Welche Gruppen kommen nach Säugetieren, Vögeln, Pflanzen, Bäumen, Pilzen? (Insekten, Amphibien, Reptilien, Fische?)
2. Reicht „Deutschland → Europa → Nordamerika“ als Reihenfolge?
3. Mindestzahl Referenzbilder je Art (nach dem Erkennungstest).
