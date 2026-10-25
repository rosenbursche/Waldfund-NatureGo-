# Test: Erkennt BioCLIP 2 Fundstücke?

Stand: 25.10.2026 · Mac (Apple Silicon, MPS) · Erkenner `erkennung/erkenner.py` unverändert (6 Vorschläge, 11.550 Einträge in `daten/artvektoren.npz`, davon 11 Gegenklassen) · Bildliste mit Herkunft, Lizenz und Ergebnis je Bild: `fundstuecke-testbilder.csv` (gleicher Ordner)

## Kurz gesagt

- **Die Art wird an Fundstücken überraschend oft erkannt, aber selten „sicher“.** Mit Auswahl aus den App-Arten (Variante B) ist die richtige Art bei **78 % auf Platz 1** und bei **99 % unter den ersten 6**. Ohne Auswahl, wie heute (A, 11.550 Arten): **64 % Platz 1, 93 % unter 6**.
- **Gut:** Federn (Eichelhäher, Buntspecht, Amsel), Fraßspuren (Biber, Schwarzspecht, Spechtschmiede, Eichhörnchen-Zapfen), Blätter, Früchte. **Mittel:** Trittsiegel, Rinde. **Schwach:** Losung (A: 46 % Platz 1) und Knospen (Platz 1 nur 63–67 %, Verwechslung innerhalb der Gattung).
- **Die Auswahl nach Fundstück-Typ (B) bringt am meisten:** +14 Prozentpunkte auf Platz 1 gegenüber heute. Eigene Text-Vektoren je Fundstück (C) helfen allein nicht mehr als B. Die **Mischung aus Art- und Fundstück-Vektor (CB) ist am besten: 80 % Platz 1, 100 % unter 6.**
- **Achtung, die Kandidatenlisten sind klein:** Für Trittsiegel gibt es nur 10 App-Arten, für Losung 7, für Federn 3. „Unter den ersten 6“ ist dort fast geschenkt (Zufall: 60 % / 86 % / 100 %). Aussagekräftig ist vor allem **Platz 1**.
- **„Welcher Typ ist das?“ (D) klappt per Text nicht.** Nur Losung wird zuverlässig als Losung erkannt (88–100 %). Trittsiegel werden meist für „Tier“ oder „Losung“ gehalten, Federn für „Vogel“, Blätter für „Pflanze“. Mit **eigenen Referenzbildern je Typ** steigt das auf **85 %** (grob geschätzt, siehe Abschnitt 6).
- **Empfehlung:** Bei Fundstücken **wählt der Nutzer zuerst den Typ** („Spur“, „Losung“, „Feder“, „Fraßspur“, „Blatt“, „Rinde“, „Knospe“, „Frucht“). Dann zeigt die App die 4–6 wahrscheinlichsten App-Arten (Variante CB oder B) und der Nutzer wählt selbst (Gesamtkonzept 17). Punkte zählen bei Fundstücken nur nach Bestätigung, nie allein durch die Erkennung.

## 1. Testaufbau

| | |
|---|---|
| Modell | BioCLIP 2 über die Klasse `Erkenner` (kein eigener Server, keine Änderung an `erkenner.py`) |
| Testbilder | **473 Fotos** von 31 Arten, jedes Bild von Hand auf Übersichtsbögen geprüft |
| Quellen | Wikimedia Commons (kuratierte Kategorien wie „Roe deer tracks“, „Vulpes vulpes feces“, „Fagus sylvatica (bark)“) und iNaturalist (nur Beobachtungen ab 01.01.2025, Forschungsqualität, Anmerkung „Hinweis auf Anwesenheit: Spur / Kot / Feder“) |
| Lizenzen | nur CC0, gemeinfrei, CC BY, CC BY-SA – Lizenz jedes einzelnen Fotos geprüft (CC BY-SA 291, CC BY 125, CC0 54, gemeinfrei 3) |
| Skripte | `erkennung/fundstueck_vektoren.py` (Text-Vektoren je Fundstück, Typ-Prompts), `erkennung/fundstuecke_testen.py` (alle Varianten, Tabellen). Rohergebnis je Bild: `erkennung/daten/testergebnis-fundstuecke.json` |

**Bilder je Typ**

| Typ | Bilder | Arten | davon Aufnahme ab 2025 |
|---|---|---|---|
| Trittsiegel | 84 | 11 (Reh, Wildschwein, Fuchs, Dachs, Igel, Feldhase, Eichhörnchen, Biber, Luchs + Rothirsch, Wolf) | 49 |
| Losung | 68 | 8 (Reh, Wildschwein, Fuchs, Dachs, Igel, Feldhase + Rothirsch, Wolf) | 40 |
| Fraßspuren | 40 | 5 (Biber, Schwarzspecht, Eichhörnchen, Wildschwein-Gebräch, Spechtschmiede) | 21 |
| Federn | 25 | 3 (Eichelhäher, Buntspecht, Amsel) | 15 |
| Blatt | 68 | 14 Bäume | 6 |
| Rinde | 64 | 14 Bäume | 16 |
| Knospe | 54 | 11 Laubbäume | 1 |
| Frucht (inkl. Zapfen, Birkensamen) | 70 | 14 Bäume | 9 |
| **zusammen** | **473** | | **157** |

Bäume: Rotbuche, Stieleiche, Traubeneiche, Bergahorn, Spitzahorn, Sandbirke (Hängebirke), Winterlinde, Sommerlinde, Esche, Waldkiefer, Fichte, Weißtanne, Schwarzerle, Hainbuche. Dazu 60 Fotos ganzer Tiere aus dem ersten Test (nur für die Typ-Erkennung).

**Nicht genug freie Fotos gab es für:** Wildkatze-Trittsiegel (nur Zeichnungen), Luchs-Losung (keine prüfbare), Igel-Trittsiegel (1 Bild), Amsel-Federn auf Commons (keine). Rothirsch und Wolf sind keine App-Arten mit Fundstücken; sie zählen nur in A und D.

**Aussortiert** wurden u. a.: Zeichnungen und Kupferstiche, Spuren von Grauhörnchen, Kanadaluchs und Kanadischem Biber (Nordamerika), Hausschwein-Kot aus dem Zoo, Rotschulterstärling statt Amsel, „Hasenspuren“, die auch vom Schneehasen sein können, Fotos mit Tier statt Spur, Suhlen statt Trittsiegel, Rinde voller Pilze, Blut-/Zierformen (Blutbuche, Schlitzblatt-Birke).

**Varianten**

- **A** wie heute: alle 11.550 Arten, einmal offen, einmal mit Gruppe (Säugetiere, Vögel, Pflanzen).
- **B** nur die App-Arten, die diesen Fundstück-Typ in `src/data/fundstuecke.json` haben, Art-Vektoren wie heute (mit Vorwissen und Gegenklassen, also genau `Erkenner.erkennen(kandidaten=…)`). Zuordnung: Trittsiegel = `faehrte` oder `spur` mit ID „trittsiegel“/„spur“; Frucht = `frucht` oder `samen`. Zahl der Kandidaten: Trittsiegel 10, Losung 7, Fraß 9, Feder 3, Blatt 41, Rinde 33, Knospe 18, Frucht 34.
- **C** eigene Text-Vektoren je Art und Typ, z. B. „a photo of the droppings of Vulpes vulpes (red fox)“, „scat of … on the ground“, „feces of …“ (3–4 Formulierungen gemittelt, BioCLIP-2-Textkodierer). Für Fraßspuren eigene Sätze je Art (Sanduhr beim Biber, Zapfen beim Eichhörnchen, Hackspuren beim Schwarzspecht …). Kandidaten wie B, ohne Vorwissen.
- **CB** Mittel aus Art-Vektor (B) und Fundstück-Vektor (C), Kandidaten wie B.
- **D** Typ-Erkennung per Text: „animal footprints in mud“, „animal droppings“, „a single bird feather“, „tree bark“ … plus „ganzes Tier“, „ganze Pflanze“, „Blüte“.

## 2. Ergebnisse je Variante (alle 473 Bilder)

Platz 1 / unter den ersten 5 / unter den ersten 6. In Klammern bei B, C, CB: Zufallswert für Platz 1 bei dieser Kandidatenzahl.

| Typ | A offen | A mit Gruppe | B App-Arten | C Fundstück-Text | **CB Mischung** |
|---|---|---|---|---|---|
| Trittsiegel | 50 / 88 / 89 % | 51 / 88 / 89 % | 71 / 98 / 100 % (10 %) | 70 / 97 / 98 % | **74 / 98 / 100 %** |
| Losung | 46 / 81 / 84 % | 47 / 82 / 85 % | 65 / 96 / 98 % (14 %) | 71 / 100 / 100 % | **67 / 100 / 100 %** |
| Fraßspuren | 82 / 95 / 98 % | 85 / 100 / 100 % | 92 / 100 / 100 % (11 %) | 90 / 100 / 100 % | **95 / 100 / 100 %** |
| Federn | 92 / 100 / 100 % | 92 / 100 / 100 % | 96 / 100 / 100 % (33 %) | 100 / 100 / 100 % | **100 / 100 / 100 %** |
| Blatt | 78 / 99 / 99 % | 78 / 99 / 99 % | 85 / 100 / 100 % (2 %) | 84 / 100 / 100 % | **87 / 100 / 100 %** |
| Rinde | 50 / 86 / 89 % | 52 / 86 / 89 % | 69 / 95 / 95 % (3 %) | 45 / 94 / 95 % | **72 / 98 / 98 %** |
| Knospe | 63 / 98 / 98 % | 63 / 98 / 98 % | 67 / 100 / 100 % (6 %) | 57 / 100 / 100 % | **67 / 100 / 100 %** |
| Frucht | 79 / 96 / 96 % | 79 / 96 / 96 % | 87 / 100 / 100 % (3 %) | 86 / 99 / 100 % | **90 / 100 / 100 %** |
| **alle** | **64 / 92 / 93 %** | 65 / 92 / 93 % | 78 / 99 / 99 % | 73 / 98 / 99 % | **80 / 100 / 100 %** |

Bilder: A 473; B, C, CB 431 (ohne Rothirsch und Wolf, die keine Fundstück-Art der App sind, und ohne Schwarzerle-Knospen, weil die Schwarzerle in der App keine Knospe hat).

**„Sicher“ (≥ 0,90) in A:** nur 31 % der Fotos, davon 92 % richtig. Bei Trittsiegeln und Rinde sind falsche „sicher“ häufiger (17 % bzw. 23 % der sicheren falsch, z. B. Wildschwein-Trittsiegel → sicher Reh). Für Fundstücke darf „sicher“ deshalb **keine Punkte allein** auslösen.

**Gattung statt Art (A, Platz 1):** Blatt 97 %, Feder 92 %, Knospe 91 %, Frucht 91 %, Fraß 82 %, Rinde 61 %, Trittsiegel 56 %, Losung 51 %.

## 3. Datenleck: Aufnahmen ab 2025 getrennt

BioCLIP 2 wurde mit Bildern bis Mai/August 2024 trainiert (GBIF-Schnappschuss, EOL-Abruf, siehe `bioclip2-test.md`). Commons-Bilder können über EOL im Training gewesen sein. Darum getrennt:

| Teil | Bilder | A Platz 1 | A unter 6 | B Platz 1 | CB Platz 1 |
|---|---|---|---|---|---|
| Aufnahme ab 2025 | 157 | 66 % | 96 % | 83 % | 86 % |
| Aufnahme vor 2025 | 316 | 63 % | 92 % | 76 % | 78 % |

Für Tier-Fundstücke gibt es genug neue Bilder (Trittsiegel 49, Losung 40, Fraß 21, Federn 15). **Ein Leck ist nicht zu sehen:** Die neuen iNaturalist-Fotos schneiden sogar besser ab als die älteren Commons-Fotos (A Platz 1: Trittsiegel 60 % gegen 38 %, Losung 54 % gegen 34 %). Wahrscheinlich, weil iNaturalist-Fotos näher und schärfer sind (oft mit Hand oder Maßstab), Commons dagegen oft Spuren-Reihen im Schnee zeigt. **Bei Bäumen** sind fast alle Fotos älter (Knospe: 1 Bild ab 2025). Dort sind die Werte womöglich zu gut.

## 4. Typische Verwechslungen

- **Wildschwein-Trittsiegel und -Losung → Reh** (9 von 10 Fehlern bei Wildschwein-Spuren). Auch **Rothirsch → Reh**. Das Modell erkennt „Paarhufer-Spur“, wählt dann aber die häufigste Art. Afterklauen und Größe sieht es nicht.
- **Wolf → Haushund** (Gegenklasse) bei Trittsiegeln und Losung. Fachlich auch für Menschen kaum trennbar. In der App wäre das „kein Wildfund“, also kein falscher Punkt, aber ein echter Wolfsnachweis ginge verloren.
- **Igel-Losung ↔ Fuchs-Losung**, Fuchs ↔ Dachs/Luchs, Fuchs-Trittsiegel → Feldhase/Dachs (Schnee).
- **Biber-Trittsiegel → Waschbär** (A), Hirsch-Trittsiegel einmal → Nandu (Vogel!).
- **Bäume: fast nur Paare innerhalb der Gattung**: Stieleiche ↔ Traubeneiche (Blatt, Knospe), Bergahorn ↔ Spitzahorn (Knospe), Winterlinde ↔ Sommerlinde (Blatt, Frucht), Sandbirke ↔ Moorbirke. Bei Nadelbäumen ohne Auswahl: Schwarzkiefer, Gelbkiefer, Korea-Tanne.
- **Rinde ist der schwächste Baum-Typ** (A 50 %): Bergahorn → Rotbuche (glatte graue Rinde), Kiefer → Gelbkiefer. Mit eigenem Rinden-Text (C) wird es schlechter (45 %), weil „bark of …“ allein zu wenig unterscheidet; in der Mischung (CB) wird es besser (72 %).
- **Fraßspuren**: Gebräch → Feldmaus/Maulwurf, Eichhörnchen-Zapfen → Feldhase/Haselmaus/Schopftintling. Mit Auswahl fast fehlerfrei, aber nur 5 Arten getestet.

## 5. Typ-Erkennung (D): Was ist auf dem Foto?

| echter Typ | D (mit „Tier“, „Pflanze“, „Blüte“) | D2 (nur die 8 Fundstück-Typen) | D3 (Nutzer sagt vorher „Tier“ oder „Baum“) |
|---|---|---|---|
| Trittsiegel | 18 % (meist „Tier“ oder „Losung“) | 29 % | 29 % |
| Losung | 88 % | 100 % | 100 % |
| Fraßspuren | 0 % | 0 % | 0 % (alles „Losung“) |
| Feder | 0 % (alles „Tier“) | 56 % | 60 % |
| Blatt | 0 % (alles „Pflanze“) | 43 % | 51 % |
| Rinde | 25 % | 84 % | 92 % |
| Knospe | 2 % | 17 % | 19 % (meist „Frucht“) |
| Frucht | 16 % | 63 % | 69 % |
| ganzes Tier (60 Fotos) | 100 % | – | – |
| **gesamt (Fundstücke)** | **~22 %** | **51 %** | **55 %** |

**Folge:** BioCLIP 2 erkennt per Text-Beschreibung nicht zuverlässig, *welche Art* von Fundstück es ist. Es denkt in Arten, nicht in „Kot“ oder „Spur“. Ein ganzes Tier erkennt es dagegen immer als Tier. Damit lässt sich zumindest „Sichtung oder Fundstück?“ grob trennen.

## 6. Was würden Referenzbilder bringen? (grobe Schätzung)

Mit den Bild-Fingerabdrücken der Testbilder selbst als „Referenzbilder“:

- **Typ per Referenzbild** (Mittelwert je Typ, Bilder derselben Art jeweils herausgelassen): **85 % richtig** (Trittsiegel 100 %, Losung 96 %, Feder 92 %, Knospe 89 %, Blatt 85 %, Rinde 84 %, Fraß 62 %, Frucht 61 %). Das ist viel besser als per Text (55 %).
- **Art per nächstem Referenzbild** (innerhalb des Typs): Blatt 97 %, Feder 100 %, Fraß 88 %, Frucht 86 %, Losung 74 %, Knospe 65 %, Rinde 64 %, Trittsiegel 64 %. **Zu optimistisch**, weil oft mehrere Fotos aus derselben Serie stammen. Es zeigt aber die Richtung: Bei Losung und Trittsiegel helfen Referenzbilder etwas, bei Rinde und Knospe kaum.

## 7. Ehrliche Grenzen

- **Kleine Zahlen:** 473 Bilder, je Art und Typ höchstens 10. Ein einzelnes Bild ändert die Prozente je Typ um 1–4 Punkte.
- **Kleine Kandidatenlisten:** „unter den ersten 6“ ist bei Trittsiegeln (10 Arten), Losung (7) und Federn (3) fast immer erreicht. Bei mehr App-Arten mit Fundstücken wird es schwerer.
- **Fotos von Fachleuten und Naturfreunden**, nicht von Kindern mit dem Handy. Viele haben Maßstab oder Hand im Bild, sind scharf und gut ausgeleuchtet.
- **Artbestimmung der Spuren** stammt von den Fotografen bzw. der iNaturalist-Community, nicht von uns geprüft. Bei Losung (Fuchs/Dachs/Igel/Marder) und Spuren im Schnee irren auch Fachleute.
- **iNaturalist** wurde hier (anders als in den ersten beiden Tests) genutzt, weil nur dort genug freie Spuren-, Kot- und Federfotos ab 2025 zu finden waren. Nur Fotos mit CC0/CC BY/CC BY-SA.
- **Baumfotos meist vor 2025** und teils Blatt-Scans auf weißem Grund (Stieleiche, Winterlinde, Esche). Möglicher Lerneffekt (Leck), echte Werte vermutlich niedriger.
- **Der Erkenner nimmt an, dass das Foto ein Lebewesen zeigt.** Die Gegenklassen (Haushund, Hausrind …) können bei Spuren gewinnen. Das ist bei Wolf gegen Hund gewollt, bei anderen Spuren Zufall.
- Fehlende Typen: keine echten Sasse-, Bau-, Nest- oder Suhlen-Fotos getestet, keine Fraßspuren von Reh, Hase, Dachs.

## 8. Empfehlung

**Was schon geht (mit Nutzer-Auswahl, Gesamtkonzept 17):**
- **Federn, Fraßspuren (Biber, Specht, Eichhörnchen), Blätter, Früchte/Zapfen:** Typ vom Nutzer, dann 4–6 Kandidaten nach Variante CB. Platz 1 stimmt in 87–100 %, die richtige Art ist praktisch immer dabei.
- **Trittsiegel und Rinde:** genauso, aber nur als Vorschlagsliste. Platz 1 stimmt nur in etwa 70 %.

**Was eigene Referenzbilder oder Nutzerfotos braucht:**
- **Typ-Erkennung** („Ist das Kot oder eine Spur?“): nicht per Text, sondern mit Referenzbildern je Typ (ca. 50–100 geprüfte Fotos je Typ, freie Lizenz). Schätzung 85 % statt 55 %.
- **Losung und Knospen:** Referenzbilder je Art und später echte Nutzerfotos (mit Community-Bestätigung) als zusätzliche Fingerabdrücke.
- **Paare** Wildschwein/Reh-Spur, Stiel-/Traubeneiche, Berg-/Spitzahorn-Knospe, Winter-/Sommerlinde: kleiner Zusatzklassifikator oder Bestimmungsfragen („Afterklauen sichtbar?“, „Blattstiel lang oder kurz?“).

**Was realistisch nur mit Auswahl durch den Nutzer geht:**
- Der Nutzer wählt **immer zuerst den Fundstück-Typ** (ein Tipp, große Symbole). Danach Kandidaten aus den App-Arten mit diesem Typ, Vergleichsansicht mit den Merkmalen aus `fundstuecke.json` (`erkennen`, `verwechslung`) und dem Bestimmungsschlüssel als Rätsel (Gesamtkonzept 2.4).
- **Keine automatische Punktvergabe für Fundstücke durch die Erkennung allein.** Auch „sicher“ ist bei Trittsiegeln und Rinde zu oft falsch (17–23 %). Vorschlag: Erkennung als Hinweis im Vertrauenswert, volle Punkte erst nach Community-Bestätigung, bei Wolf/Luchs/Wildkatze immer. `// TODO fachlich prüfen`
- **Wolf gegen Hund und Wildschwein gegen Reh** nicht dem Modell überlassen.

## 9. Zum Nachmachen

Arbeitsordner (außerhalb des Repos): `…/scratchpad/fundstueck-test/` mit `bilder/` (Downloads) und `skripte/` (`sammeln.py`, `inat_sammeln.py`, `laden.py`, `baumbogen.py`, `testset.py`, `typ_d2.py`, `referenz.py`, `csv_bauen.py`). Ablauf: Kandidaten sammeln → laden und Übersichtsbögen → Sichtprüfung (`auswahl.txt`) → `testset.py` → Auswertung:

```
cd erkennung
venv/bin/python fundstuecke_testen.py <testbilder.json> <arten.json> [ergebnis.json]
```

Ins Repo kamen nur dieser Bericht, `fundstuecke-testbilder.csv` (ohne Bilder), `erkennung/fundstueck_vektoren.py`, `erkennung/fundstuecke_testen.py` und das Rohergebnis `erkennung/daten/testergebnis-fundstuecke.json`.
