# Wildfund – Arten-Datenbank (Entwurf 2)

Stand: 24.10.2026 · Entwurf zur Durchsicht · gehört zu `docs/KONZEPT-GESAMT.md`

Ziel: Eine große Datenbank mit sehr vielen Arten (Europa, später Amerika, 20.000+). Jede Art hat **feste Datenpunkte**. Wie viele davon belegt sind, entscheidet, ob die Art in die App kommt.

**Leitsatz: Die Datenbank wird von der Seite aus gedacht.** Jedes Kapitel einer Artenseite (Vorlage: Reh und Wildschwein) braucht bestimmte Datenpunkte. Genau diese recherchieren wir, nicht mehr und nicht weniger.

---

## 1. Drei Schichten

| Schicht | Was | Beispiel | Wo |
|---|---|---|---|
| **1. Wissen** | belegte Fakten, für alle Arten gleich aufgebaut | Schulterhöhe 55–110 cm, Frischlinge März–Mai, frisst Eicheln Sep–Dez | Datenbank, jede Angabe mit Quelle |
| **2. Medien** | Fotos und Stimmen mit Lizenz, je **Bildplatz** | Hero-Foto, Winterfell, Jungtier, Trittsiegel | Datenbank (Link, Lizenz, Platz) |
| **3. Gestaltung** | wie die Seite es zeichnet | Figur, Punkte auf der Zeichnung, Fellfarbe als Farbwert, 3D-Umgebung | nur für Arten in der App, in der App selbst |

Schicht 1 und 2 sind die große Datenbank. Schicht 3 entsteht erst, wenn eine Art in die App kommt. Heute steckt alles vermischt in `src/data/tiere/*.ts`; das trennen wir.

---

## 2. Von der Seite zur Datenbank: Tiere (Säugetiere)

Jede Zeile ist ein fester Datenpunkt. **P** = Pflicht für die App.

### Kopf (Hero und Wappen)
| Datenpunkt | Typ | P |
|---|---|---|
| Name deutsch (+ weitere Namen, andere Sprachen) | Text | P |
| wissenschaftlicher Name, Familie, Ordnung | Text (GBIF) | P |
| Seltenheit je Gebiet 1–4 | berechnet aus Verbreitung | P |
| Schutz: BNatSchG, FFH, Rote Liste DE/Land, IUCN | Liste | P |
| Gefahr für Menschen 0–3 | Zahl | P |
| Bild: Hero | Medien | P |

### Kapitel 1 – Erkunden (Erkennungszeichen)
| Datenpunkt | Typ | P |
|---|---|---|
| Merkmale: Körperstelle + kurzer Text (3–6) | Liste (Stelle, Text) | P |
| Unterschied Männchen / Weibchen | Text | |
| Jungtier: Name, Aussehen | Text | P |
| Verwechslung: mit welcher Art, woran erkennbar | Liste (Art-Verweis, Text) | P |
| Größe (Schulterhöhe oder Körperlänge) min–max cm | Spanne | P |
| Gewicht min–max | Spanne | P |
| Kennzahlen (Tempo, Sprungweite …) | Liste (Wert, Einheit, Etikett) | |
| Bilder: Männchen, Weibchen mit Merkmalspunkten | Medien | |

### Kapitel 2 – Ein Jahr
| Datenpunkt | Typ | P |
|---|---|---|
| Jahres-Ereignisse: Paarung, Geburt, Jungtier sichtbar, Geweih, Winterruhe … | Liste (Ereignis, Monate) | P |
| Fell je Monat (Sommer/Winter/Wechsel) | 12 Werte | |
| Jungtier-Zeichnung je Monat (Flecken, Streifen …) | Monate | |
| Bilder: Frühling, Sommer, Herbst, Winter, Jungtier, Fellwechsel | Medien | |

### Kapitel 3 – Ein Tag
| Datenpunkt | Typ | P |
|---|---|---|
| Aktivität je Stunde (ruht / kurz / sehr aktiv) | 24 Werte | P |
| Warum zu dieser Zeit? (1–3 Sätze) | Text | |
| Bilder: aktiv, ruhend | Medien | |

### Kapitel 4 – Zuhause (Lebensraum)
| Datenpunkt | Typ | P |
|---|---|---|
| Landschaften (Wald, Waldrand, Feld, Ufer, Stadt, Gebirge, Moor, Küste …) | Liste | P |
| drei Orte: Ruheplatz, Aktivplatz, Nahrungsplatz | Text × 3 | P |
| wo am Tag, wo in der Dämmerung | Ort | |
| Warum gerade dort? | Text | P |
| Wohnen: Bau, Kobel, Nest, Mulde … | Text | |
| Höhenstufen (Tiefland … Alpen) | Liste | |

### Kapitel 5 – Speiseplan
| Datenpunkt | Typ | P |
|---|---|---|
| Nahrung: Was + Monate (+ Art-Verweis, z. B. Rotbuche → Bucheckern) | Liste | P |

### Kapitel 6 – Spuren (Fundstücke)
| Datenpunkt | Typ | P |
|---|---|---|
| **4 Fundstücke + Sichtung**: Typ, Name, Erkennen, Monate, Findbarkeit, Wo, Schutz | Liste (max. 5) | P |
| Trittsiegel: Form, Länge/Breite vorne und hinten in cm | Spanne | |
| Fährte: versetzt / geschnürt / Sprung, Schrittlänge | Wert | |
| Bilder: je Fundstück | Medien | P |

### Kapitel 7 – Fressfeinde und Gefahren
| Datenpunkt | Typ | P |
|---|---|---|
| Fressfeinde (Art-Verweise), nur Jungtiere? | Liste | P |
| Menschengemachte Gefahren (Verkehr, Mähen …) | Liste | |

### Gefahr für Menschen
| Datenpunkt | Typ | P |
|---|---|---|
| Einschätzung, Situationen, Zahlen, richtiges Verhalten | Text/Liste | wenn Gefahr ≥ 1 |

### Karte und Vorkommen (siehe Abschnitt 4)
| Datenpunkt | Typ | P |
|---|---|---|
| Rasterzellen mit Nachweisen (Europa) | Raster | P |
| Status je Land/Region: heimisch, eingeführt, invasiv, ausgestorben, fehlt | Liste | P |
| Trend (zunehmend, abnehmend, Rückkehrer) | Wert | |

### Hinweis und Spiel
| Datenpunkt | Typ | P |
|---|---|---|
| Wusstest du? | Text | P |
| Rätsel (für seltene Arten) | Text | ab Seltenheit 3 |
| Sicherheitshinweis (Kitz nicht anfassen, Abstand …) | Text | |

---

## 3. Die anderen Gruppen

Gleiches Prinzip. Gemeinsam für alle: Kopf, Erkennen, Verwechslung, Jahr, Lebensraum, Fundstücke, Karte, Hinweis. Dazu je Gruppe:

| Gruppe | zusätzliche Datenpunkte |
|---|---|
| **Vögel** | **Stimmen** (Gesang, Ruf, Monate) · Zugverhalten (Standvogel/Zugvogel, Ankunft und Abflug) · Schnabel und Füße („Warum so gebaut?“) · Nest (nur Text, kein Fundstück an Brutplätzen) · Flugbild |
| **Bäume** | Blatt/Nadel, Rinde jung und alt, Knospe, Blüte, Frucht (je mit Monaten) · Laub je Monat (Austrieb, grün, Herbstfärbung, kahl) · Höhe, Höchstalter · Boden, Höhenstufe · heimisch oder angepflanzt je Naturraum · Partnerpilze |
| **Pflanzen** | Blatt, Blüte (Farbe, Monate), Frucht · Wuchshöhe · Boden, Licht · Giftigkeit (welche Teile) · Bestäuber |
| **Pilze** | Hut, Unterseite (Lamellen/Röhren/Leisten/Stacheln), Stiel, Knolle/Ring · Geruch · Saison · Partnerbaum oder Holz · **Giftigkeit und gefährliche Doppelgänger (Pflicht)** |

Die genaue Liste je Gruppe steht später als **Feldkatalog** im Code (siehe 5.1), damit Agenten genau diese Punkte recherchieren.

---

## 4. Die Karte: Verbreitung in ganz Europa (und später weltweit)

Heute: Raster aus Messtischblättern (TK25), nur Deutschland. Das reicht nicht für Europa.

**Vorschlag: ein weltweites Raster aus Sechsecken (H3, offene Lizenz).**
- Ein System für Deutschland, Europa und Amerika.
- Es gibt feine und grobe Stufen. Die App zeigt in Europa grobe Zellen (ca. 250 km²) und kann beim Hineinzoomen feiner werden.
- **Schutz:** Seltene und streng geschützte Arten bekommen **nur grobe Zellen**, nie genaue Orte.
- Daten: Nachweise aus GBIF, nur frei nutzbare Datensätze (wie heute), ohne Zoo- und Museumsbelege, ab 2000. Gespeichert wird **nur die Zelle und die Anzahl**, nie ein Punkt.
- Zusätzlich je Land der **Status** (heimisch, eingeführt …) aus Fachlisten. Die Karte zeigt dann zwei Dinge: „hier gemeldet“ (Zellen) und „hier heimisch“ (Länderfläche).
- Hintergrundkarte Europa: Natural Earth (gemeinfrei).

Leere Zelle heißt nicht „kommt nicht vor“, nur „nicht gemeldet“. Das zeigt die Karte ehrlich an.

---

## 5. Aufbau in der Datenbank

### 5.1 Feldkatalog statt hunderter Spalten
Würden wir jede Angabe als eigene Spalte anlegen, hätte eine Tabelle über 100 Spalten, und Vögel, Bäume und Pilze bräuchten andere. Deshalb:

- **`feld`** – der Katalog aller Datenpunkte aus Abschnitt 2 und 3: `id` (z. B. `groesse_schulter`), `gruppen` (für welche Gruppen), `kapitel`, `typ` (Zahl, Spanne, Monate, 24 Stunden, Text, Liste, Art-Verweis), `pflicht`.
- **`angabe`** – eine Zeile je Art und Datenpunkt: `art_id`, `feld_id`, `wert`, `quelle_ids`, `status` (`belegt`, `abgeleitet`, `offen`, `geprueft`).

So sind die Datenpunkte **fest** (der Katalog), aber jede Gruppe hat nur ihre eigenen. Als **Tabelle ansehen** geht trotzdem: eine Ansicht macht daraus „jede Art eine Zeile, jeder Datenpunkt eine Spalte“ (z. B. im DB Browser for SQLite oder als Export für Excel).

### 5.2 Weitere Tabellen
| Tabelle | Inhalt |
|---|---|
| `art` | ID, wissenschaftlicher Name, Taxonomie, Gruppe, GBIF- und Wikidata-Nummer |
| `name` | Namen je Sprache |
| `vorkommen` | Status je Land/Region/Naturraum, Nachweiszahl, Seltenheit, Monate |
| `zelle` | Verbreitung: Art, H3-Zelle, Anzahl Nachweise |
| `fundstueck` | max. 4 + Sichtung je Art |
| `medium` | Bild oder Ton: Link, Lizenz, Urheber, Datum, Land, **Platz** (hero, winter, jung, fundstueck:suhle …), **Rolle** (anzeige / referenz / test), geprüft, Fingerabdruck |
| `quelle` | Titel, Link, Herausgeber, abgerufen am |
| `datenstand` | Vollständigkeit 0–100, fehlende Pflichtpunkte, Vorschlag und deine Entscheidung „in die App“ |

### 5.3 Datenstand
Der Datenstand ist der Anteil der belegten **Pflicht-Datenpunkte** plus Medien:

| Teil | Anteil |
|---|---|
| Pflicht-Datenpunkte belegt (je Gruppe aus dem Katalog) | 50 |
| Pflicht-Bildplätze mit freiem Foto | 15 |
| 4 Fundstücke + Sichtung mit Bildern | 15 |
| Referenz- und Testbilder für die Erkennung | 15 |
| Erkennungstest bestanden | 5 |

In die App ab 80. Du entscheidest am Ende.

---

## 6. Wie die Datenbank gefüllt wird

| Schritt | Wer | Was |
|---|---|---|
| A | Skript | Arten, Namen, Taxonomie (GBIF, Wikidata), Verbreitungs-Zellen, Seltenheit, Bild-Kandidaten |
| B | Agenten | Pflicht-Datenpunkte nach Feldkatalog, mit Quellen. Der Auftrag entsteht automatisch aus dem Katalog. |
| C | Agenten + du | Bilder je Platz auswählen und prüfen |
| D | Skript | Datenstand berechnen, Kandidatenliste |
| E | Skript | App-Auszug je Region, dazu Gestaltung (Schicht 3) für neue Arten |

Die heutige Tierseiten-Pipeline (`/tierseite`) wird damit zu Schritt B + C und schreibt in die Datenbank statt in TS-Dateien.

---

## 7. Reihenfolge

| Schritt | Inhalt |
|---|---|
| D1 | Diesen Entwurf abstimmen |
| D2 | Feldkatalog für Säugetiere aus der Reh- und Wildschwein-Seite ableiten; SQLite-Datei anlegen; die 10 Säugetiere aus `src/data/tiere/` übernehmen (Prüfung: nichts geht verloren) |
| D3 | Karte: H3-Raster testen, Europa-Verbreitung für die 10 Säugetiere |
| D4 | Feldkatalog für Vögel, Bäume, Pflanzen, Pilze; restliche 63 Arten übernehmen |
| D5 | Stufe A für alle Arten in Deutschland, dann Europa |
| D6 | App liest aus dem Auszug der Datenbank |

## 7a. Stand 24.10.2026
- **D2 fertig:** 10 Säugetiere aus der App in der Datenbank, Rückweg geprüft (`npm run db`).
- **Stufe A Deutschland fertig:** 11.547 Arten (Säugetiere 315, Vögel 1.100, Gefäßpflanzen 7.578, Pilze/Agaricomycetes 2.554) mit Catalogue-of-Life-ID, Systematik, deutschem und englischem Namen und Anzahl Nachweise. Übersicht: `db/export/stufe-a-deutschland.csv`.
- **Hauptnummer je Art ist die COL-ID** (GBIF nutzt seit Juni 2026 den Catalogue of Life, das alte GBIF-Backbone wird nicht mehr gepflegt).
- Die Liste enthält auch Gäste, Irrläufer und Gartenflüchtlinge. Als Nächstes: Status heimisch/eingeführt (WCVP, GRIIS) und eine Mindestzahl an Nachweisen.
- **Offen:** Raster für die Europa-Karte – H3 (eigene Umrechnung) oder ISEA3H (rechnet GBIF selbst).

## 8. Offene Fragen
1. Welche Gruppen kommen danach? (Insekten, Amphibien, Reptilien, Fische?)
2. Reihenfolge Deutschland → Europa → Nordamerika?
3. Sprachen: zuerst nur Deutsch, Englisch später?
4. Mindestzahl Referenzbilder je Art (nach dem Erkennungstest).
