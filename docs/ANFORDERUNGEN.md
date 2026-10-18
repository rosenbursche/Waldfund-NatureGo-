# Wildfund – Anforderungen und Stand

Stand: 11.10.2026 · Ursprünglicher Auftrag: `wildfund-prompt.md` · Projektregeln: `CLAUDE.md` · Datenquellen: `DATENQUELLEN.md` · 3D-Modelle: `docs/3D-PIPELINE.md` · Startszene-Bilder: `docs/SZENE-PROMPTS.md`

Legende: ✅ erledigt · 🟡 teilweise / vorbereitet · ⬜ offen · 🔒 wartet auf Material, Konto oder Entscheidung von außen

---

## 1. Grundauftrag (Phasen 0–9)

| Phase | Inhalt | Stand |
|---|---|---|
| 0 | Expo-Projekt, Ordner, Theme-Tokens, Schriften | ✅ |
| 1 | Arten aus dem Prototyp, Baumarten, Naturräume (Thünen-Grenzen), Regel-Engine, Tests | ✅ |
| 2 | Onboarding: Naturraum per Standort (grob), Ortssuche (offline), Liste; Ergebnisscreen | ✅ |
| 3 | 3D-Lichtung: Hütte, prozedurale Bäume, Runensteine, Nebel, Glühwürmchen, Tageszeit-Licht, Parallaxe | ✅ |
| 4 | Katalog mit Stammbaum und Mystery-Zone | ✅ (seither umgebaut, siehe 2.2) |
| 5 | Artenseite: 3D-Modell, Steckbrief, Lehrbuch-Zeichnung, Karte, Schutzstatus | ✅ |
| 6 | Fotografieren und Prüfen (Demo-Modus) | ✅ |
| 7 | Punkte, Level, Serien, Erfolge, wachsende Hütte, dauerhaft gespeichert | ✅ |
| 8 | Echte Bilderkennung | 🟡 App + Server vorbereitet (Pl@ntNet, nur Pflanzen) · 🔒 Konten Pl@ntNet und Cloudflare fehlen, Anleitung: `server/README.md` |
| 9 | Feinschliff: Icon, Splash, Barrierefreiheit, Bewegung reduzieren, Leistung | ✅ |

---

## 2. Erweiterungen nach dem Grundauftrag

### 2.1 Kategorie-Wald und Runen
| Anforderung | Stand |
|---|---|
| Antippen einer Rune: Kamera zoomt hinein, dann öffnet sich die Kategorie | ✅ |
| Umschalter **Wald / Stammbaum** in jeder Kategorie (Auswahl wird gemerkt) | ✅ |
| ~~Wald-Ansicht: gefunden farbig, sonst grau mit grauem Schloss~~ | ersetzt durch Zauberwald (unten) |
| Wald-Ansicht als **Zauberwald**: viel mehr 3D, mysteriöser, sehr detailliert (Vorbild: Nebelwald, uralte Moosbäume, Hohlweg mit Licht am Ende) | ✅ |
| Zauberwald: gefunden = farbig im warmen Lichtkegel, nicht gefunden = dunkler Schatten mit schwebendem Irrlicht | ✅ |
| Um jede Rune kreisen bis zu 3 gefundene Arten (seltenste zuerst) | ✅ |
| Gefährliche Arten im Wald rot hervorgehoben (Ring, Nebel, Dornen) | ✅ |

### 2.2 Stammbaum, Gruppen, Gefahr, Punkte
| Anforderung | Stand |
|---|---|
| ~~Stammbaum nach Seltenheit: Krone (legendär) → Äste → Stamm → Wurzeln (häufig)~~ | ersetzt durch Lebensbaum (unten) |
| **Lebensbaum**: mystischer Baum (Herr-der-Ringe-Stimmung), Äste = Gruppen, per Antippen aufklappbar, nicht alles auf einmal sichtbar | ✅ |
| Seltenheit im Lebensbaum: Sterne über der Krone (Mystery), seltene Arten an der Zweigspitze, Runenring zeigt Fortschritt | ✅ |
| Gefährliche Arten in den Schattenwurzeln (öffnen die Gefahren-Sektion) | ✅ |
| Jede Kategorie mit eigenem, sehr detailliertem Baum und eigener Farbe (Blütenbaum, Myzelbaum, Federbaum, Baumhirte) | ✅ |
| Gruselig-schöne Symbole für die Knöpfe im Baum | ✅ |
| Punkte je Stufe und je Art sichtbar | ✅ |
| Sinnvolle Gruppen je Kategorie (Pflanzen: Bäume, Büsche, Frühblüher …) | ✅ |
| Individuelle Miniatur je Art (statt allgemeiner Symbole) | ✅ |
| Sektion **„Gefährlich & tödlich“** in jeder Kategorie, mit gruseliger Animation beim Scrollen/Antippen | ✅ |
| Vögel: ehrlicher Text statt erfundener Gefahren | ✅ |
| Neue Pflanzen: Hasel, Holunder, Schlehe, Weißdorn, Eisenhut, Tollkirsche, Herbstzeitlose, Seidelbast, Eibe | ✅ (Daten zu prüfen) |
| Punkte überproportional nach Seltenheit: **10 / 60 / 300 / 1000**, Level-Grenzen angepasst | ✅ |

### 2.3 Artenseite – neue Inhalte

**Alle Arten**
| Anforderung | Stand |
|---|---|
| **Wild-Wert 1–100** ganz oben + Hinweis „bedroht / nicht bedroht“ | ✅ (Formel siehe 4.2, Demo-Daten) |
| **LiDAR-Effekt**: Laser-Punktwolke wird zum Modell | ✅ (für jedes Modell, auch später GLB) |
| Lebensraum mit Begründung („Warum gerade dort?“) | ✅ Tiere/Vögel · ⬜ Pilze/Pflanzen |

**Tiere (Säugetiere)**
| Anforderung | Stand |
|---|---|
| **Grafische Tierseite (Vorlage Reh):** fast ohne Text, jeder Abschnitt eine Grafik zum Antippen/Ziehen: Wild-Wert-Zeiger, Größenvergleich mit eigener Größe, Körper erkunden (Bock/Ricke, Leuchtpunkte), Jahresrad (Fell, Geweih, Kitz, Brunft, Keimruhe), Tagesuhr (äst/ruht), Lebensraum Tag/Dämmerung, Speiseplan je Monat, Spuren-Karten mit Trittsiegel 1:1, Gefahren, Kitz-Regel; Hero mit 3D-Lebensraum (Waldrand) und Name auf dem Bild; gezeichneter Nachtwald als Hintergrund mit Parallaxe; feine Details (Fellstriche, Muskelschatten, Afterklauen, Kehlflecken im Winter, Jahreszeiten am Rad, Monatsbalken, Fährte) | ✅ Reh fertig gestaltet, Bildrate auf dem Handy noch prüfen (`src/components/tier/`, Daten `src/data/tierSeiten.ts`) · ⬜ auf andere Tiere übertragen |
| **Fuchs-Seite** nach der Reh-Vorlage: eigene Zeichnung (Mäusesprung, eingerollt schlafend, dunkle Welpen), Jahr (Ranz, Welpen im Bau, Abwandern), nachtaktiver Tagesrhythmus, Speiseplan (Mäuse, Würmer, Käfer, Beeren, Aas), Spuren (Pfote, Losung, Bau, Rupfung, geschnürte Fährte), Gefahren (Luchs, Wolf, Straßen, Uhu für Welpen), Fuchsbau im 3D-Hero, Hinweis Fuchsbandwurm | ✅ Daten TODO fachlich prüfen  |
| **Alle Säugetiere grafisch:** Eichhörnchen (Baum, Kobel, Sprungspur, Winterruhe), Wildschwein (Suhle, gestreifte Frischlinge, Afterklauen), Dachs (Bau, Latrine, Winterruhe), Igel (Winterschlaf, Stachelkugel, Laubnest), Feldhase (Feld, Sasse, Y-Spur, Junghase allein), Biber (Ufer, Burg, schwimmt, Sanduhr-Nagespur), Wildkatze (Ringelschwanz, Kätzchen-Hinweis), Luchs (Pinselohren, gedeckte Beute); 3D-Hero als Wald, Feld oder Ufer | ✅ Daten TODO fachlich prüfen · Bildrate auf dem Handy prüfen |
| **Echte Fotos für Reh und Fuchs** (Wikimedia Commons, Lizenz geprüft): Foto-Hero mit Umschalter zum 3D-Modell, Erkunden mit Leuchtpunkten auf dem Foto (Bock/Ricke), Jahresrad mit Sommer-/Winterfoto und Jungtier, Tagesuhr (äst, Mäusesprung, ruht), Spuren-Fotos, Hinweis mit echtem Kitz bzw. Fuchs, Abschnitt „Fotos“ mit Urheber und Lizenz | ✅ · ⬜ Fotos für weitere Tiere |
| Key Features | ✅ |
| Nahrung, verknüpft mit Arten in der App | ✅ |
| Spuren (Trittsiegel, Losung, Fraßspuren) | ✅ Text · ⬜ eigene Spuren-Zeichnungen |
| Wohnen & Schlafen | ✅ Text · ⬜ Zeichnung/3D (Bau, Kobel …) |
| Ohren wackeln | ✅ (Low-Poly) · 🔒 realistisch mit GLB |
| **Alters-Regler** (z. B. Kitz → Bock, Welpe → alter Fuchs) | ⬜ 🔒 braucht Modelle je Alters-Stufe |

**Vögel**
| Anforderung | Stand |
|---|---|
| Füße & Krallen, Nest, „Warum so gebaut?“ | ✅ Text · ⬜ Zeichnungen |
| Federn putzen / schütteln | ✅ Schütteln + Plustern (Low-Poly) · 🔒 Putzen realistisch mit GLB |
| **Alters-Regler** Ei → Küken → Vogel | ⬜ 🔒 braucht Modelle je Stufe |
| Nahrung, Spuren, Schlafen | ✅ |

**Pilze**
| Anforderung | Stand |
|---|---|
| Wassertropfen fallen auf den Hut | ✅ |
| Sporen werden ausgestoßen | ✅ (rieseln) · ⬜ sichtbarer „Ausstoß“-Moment |
| Steckbrief-Sektionen (Lebensraum-Warum, Partnerbaum/Mykorrhiza, Verwechslung) | ⬜ |

**Pflanzen**
| Anforderung | Stand |
|---|---|
| Blätter wackeln | ✅ |
| „Wer frisst mich?“ – verknüpft mit Tieren in der App | ✅ (automatisch aus der Tier-Nahrung) |
| Wild-Wert | ✅ |
| **Biologie zerlegt** (Wurzel, Stamm/Stängel, Blatt, Blüte) – interaktive Explosionsansicht | ⬜ |
| **Blüten-/Frucht-Sektion mit Jahreszeiten-Regler** (Pflanze verändert sich über das Jahr) | ✅ Monate aus den Saison-Angaben; Laub (Austrieb, Herbst, kahl), Blüten, Früchte; Bäume ohne Blütedaten zeigen nur das Laub |
| **Wachstums-Regler** Keimling → großer Baum | ✅ Bäume in Lebensjahren bis zum ungefähren Höchstalter (TODO prüfen), Kräuter/Büsche in Stufen |
| Lebensraum-Sektionen | ⬜ |

### 2.4 Deutschlandkarte
| Anforderung | Stand |
|---|---|
| Statt Punkten: **gefüllte bzw. halb gefüllte (schraffierte) Flächen** – 82 Wuchsgebiete | ✅ |
| Lebendiger: Großlandschaften als Untergrund, Gebirge mit Namen, Waldgebiete, große Flüsse | ✅ (später genauer mit Höhenmodell/CORINE möglich – Lizenz prüfen) |
| Eigene Position einzeichnen | ✅ pulsierender Punkt, nur **grob** (ca. 10 km); ohne gespeicherten Standort: Mitte des Naturraums |
| Fundorte seltener Arten nie genauer als Rasterebene | ✅ gilt weiter |

### 2.5 Realistische 3D-Modelle
| Anforderung | Stand |
|---|---|
| Realistische, pixelgenaue 3D-Modelle von Tier, Pflanze, Pilz | 🔒 extern erzeugen/kaufen, siehe `docs/3D-PIPELINE.md` |
| Realistische Animationen (Ohren, Putzen, Schütteln, Tropfen …) | 🔒 Rigging/Animation extern, Einbau durch App |
| **Pilot: Fuchs** (Grundmodell + Alters-Stufen) | 🔒 Prompts fertig, wartet auf GLB-Dateien |
| GLB-Lader, LiDAR mit echtem Modell, Animations-Wechsel (falls Clips vorhanden) | ✅ Technik-Test mit „Realistic Deer“ (Weißwedelhirsch, CC BY) unter Einstellungen → 3D-Test |
| Alters-Regler mit Überblenden zwischen GLB-Stufen | ⬜ wartet auf Modelle je Alters-Stufe |
| Echtes Reh-Modell (Capreolus capreolus), geriggt | 🔒 noch zu finden – Test-Modell ist ein Weißwedelhirsch |

### 2.6 Fotorealistische Startszene (2,5D-Diorama)
| Anforderung | Stand |
|---|---|
| **3D-Lichtung detailreicher** (Wunsch nach Test des Dioramas): welliger Boden mit Farbflecken, Gras und Farne im Wind, Moos, Blumen, Steine, Pilzgruppen, Weg mit Trittsteinen, Tümpel mit Schilf und Seerosen, Holzstapel, Hackklotz, Laterne, umgestürzter Stamm, Baumstümpfe, Wald am Horizont, Mond, Lichtstrahlen | ✅ `src/scene/LichtungDetails.tsx` |
| Noch mehr Details: Falllaub, Zweige, Zapfen, Fliegenpilz-Tupfen, Hexenring, Moos auf Steinen, Zaun, Bank, Regentonne, Wegweiser; Bewegung: fallende Blätter, Motten an der Laterne, Vögel über dem Wald, Staub im Licht | ✅ `LichtungDetails.tsx`, `LichtungLeben.tsx` |
| **Alles fein detailliert:** Bäume aus Generator (Stamm mit Wurzelanläufen, Hauptäste, Zweige, hunderte gemalte Blatt-/Nadelbüschel, Rinde je Art: Buche glatt, Eiche gefurcht, Birke weiß mit schwarzen Streifen, Kiefer unten Borke/oben rötlich), Blockhütte aus Rundstämmen mit Schindeldach, Feldsteinsockel, gemauertem Kamin, Brettertür, Fenster mit Läden und Blumenkasten, Feldsteine statt Kugeln, Fichten-Umrisse am Horizont | ✅ `baumGenerator.ts`, `blattTexturen.ts`, `huettenTeile.ts` – Bildrate auf dem Handy noch prüfen |
| **Versteckte Kleinigkeiten:** Augenpaare im Gebüsch und am Waldrand, die in der Dämmerung aufleuchten, blinzeln und wieder verschwinden; Eule auf dem Wegweiser (dreht ruckartig den Kopf, blinzelt); leuchtendes Holz am umgestürzten Stamm; Spinnennetz mit glitzerndem Tau an der Laterne; Schnecke auf einem Baumstumpf; Frosch auf dem Seerosenblatt; Maus, die unter einem Stumpf hervorlugt; Rehspuren im Weg; Feder auf der Bank. Nur Stimmung, nicht antippbar, keine Punkte | ✅ `LichtungVerborgenes.tsx`, Logik in `src/logic/verborgenes.ts` |
| Startszene (Hütte) fotorealistisch wie das Referenzbild | 🟡 Technik fertig, Bilder kommen aus ChatGPT (`docs/SZENE-PROMPTS.md`) |
| Bildebenen (Himmel, Ferne, Mittelgrund, Lichtung, Hütte, Vordergrund) mit Parallaxe beim Kippen und Ziehen | ✅ mit Platzhalter-Bildern (`scripts/platzhalter-szene.mjs`) |
| Effekte aus Code: Nebelbänke, Glühwürmchen, Schornsteinrauch, Fensterlicht, Tümpel-Glitzern, Mondstrahlen | ✅ folgen der Tageszeit-Stimmung, stehen bei „Bewegung reduzieren“ still |
| Runensteine als gezeichnete, antippbare Steine mit Leuchten nach Fortschritt | ✅ |
| Umschalter Diorama ↔ 3D-Lichtung (Einstellungen → Darstellung) | ✅ 3D ist Standard (Wunsch: „3D-Space mit vielen Details“) |
| Magenta freistellen und komprimieren (`scripts/ebenen-freistellen.py`) | ✅ wartet auf die ChatGPT-Bilder |
| **Pilot: Lüneburger Heide in der Dämmerung** | 🔒 wartet auf die Bilder |
| Hütte je Ausbaustufe (Unterstand … Sternwarte) | 🔒 Prompts fertig, wartet auf Bilder (bis dahin Stufe 1) |
| Tageszeit-Varianten der Bilder (Morgen, Tag, goldene Stunde, Nacht) | ⬜ später |
| Eigene Szene je Naturraum (Mittelgebirge, Alpen, Küste …) | ⬜ nach dem Pilot |

### 2.7 Wettkampf, Zoo-Funde und Echtheitsprüfung
Konzept: `docs/KONZEPT-WETTKAMPF.md` (Entwurf). Offene Entscheidungen dort in Abschnitt 6, u. a. Konto nur für den Wettkampf (berührt Regel 4.5).

| Anforderung | Stand |
|---|---|
| Wettkampf gegen andere Spieler: Rangliste „Sammeln“ und Rangliste „Kämpfe“ | ⬜ Konzept |
| Zoo-Tiere sind erwünscht: **Zoofund → Gehegeform**, für Kämpfe nutzbar · **Wildfund → Wildform** mit Wild-Bonus und vollen Punkten | ⬜ Konzept |
| Unsichere Wildfunde zählen erst als Gehegeform, nach Bestätigung als Wildform | ⬜ Konzept |
| W1: Nur Fotos aus der App-Kamera zählen für den Wettkampf; Quelle, Zeit und grober Ort je Fund | ⬜ |
| W2: Zoo-Flächen aus OpenStreetMap (Lizenz prüfen), Plausibilität über Verbreitung, Jahreszeit, Tageszeit | ⬜ |
| W3: Server mit Konten, Ranglisten, Bild-Fingerabdruck, Community-Prüfung, Vertrauenswert | ⬜ 🔒 Cloudflare-Konto, Datenschutz |
| W4: Kurzvideo mit Sensoren und Parallaxe-Prüfung für sehr seltene/legendäre Wildfunde, Geräteprüfung | ⬜ 🔒 Development Build, Recherche |
| Kampfsystem | ⬜ Konzept, siehe 2.8 |

### 2.8 Spielsystem wie Pokémon GO: Kämpfe, Fähigkeiten, Pflanzen und Pilze
Konzept: `docs/KONZEPT-SPIELSYSTEM.md` (Entwurf). Offene Entscheidungen dort in Abschnitt 7.

| Anforderung | Stand |
|---|---|
| Aufbau wie Pokémon GO: Spuren (je Art), Humus (Währung), Füttern, Heranwachsen über Alters-Stufen | ⬜ Konzept |
| Kämpfe 3 gegen 3: Sofortangriff, Spezialangriff, Ausdauer, 2× Tarnen, Ligen nach Größenklasse | ⬜ Konzept |
| Sechs Lebensweisen statt Typen, Tag/Nacht-Bonus nach echter Uhrzeit | ⬜ Konzept |
| Angriffe aus echtem Verhalten (Mäusesprung, Trommelwirbel, Stachelkugel …) | ⬜ Konzept |
| Pflanzen = Futter nach Nahrungsnetz, Pilze = Humus, Bäume = Heimat und Hüterbäume | ⬜ Konzept |
| Besondere Gegenstände aus seltenen Funden (Leuchtholz, Arnika-Salbe, Myzel-Band, Essenzen) | ⬜ Konzept |
| Kampfanimationen (7 je Tier) für 6 Start-Tiere, gemeinsame Skelette | ⬜ 🔒 Modelle |
| K1: Kampf-Rechenlogik `src/logic/kampf.ts` mit Tests | 🟡 geparkt auf Branch `feature/kampf-arena`: Grundregeln + Kampfwerte Reh, weitere 5 Start-Tiere fehlen |
| Kampf-Arena als Test: Reh gegen Reh gegen den Computer, 3D-Arena mit Platzhalter-Modell | 🟡 **geparkt** auf Branch `feature/kampf-arena` (nicht in `main`, nicht in 1.0) · Mini-Spiel beim Spezialangriff fehlt noch |

### 2.9 Veröffentlichung im App Store und bei Google Play
Konzept: `docs/KONZEPT-VEROEFFENTLICHUNG.md` (Entwurf). Entscheidungen E1–E7 dort in Abschnitt 7.

| Anforderung | Stand |
|---|---|
| Umfang 1.0 festlegen: Pflanzen echt geprüft, Pilze/Tiere ehrlich selbst eintragen, Test-Ansichten nur im Entwicklungs-Build | ⬜ |
| Konten Apple, Google, Expo; Name, App-ID, Händlerstatus | ⬜ 🔒 Du |
| Pflanzenerkennung live, Pl@ntNet-Bedingungen für Store-Apps geklärt, Verhalten bei ausgelasteter Tagesgrenze | ⬜ 🔒 Konten, Antwort Pl@ntNet |
| Fachprüfung Stufe A (Gift, Verwechslung, Gefahren, Schutzstatus) | ⬜ 🔒 Fachleute |
| Datenschutzerklärung (Webseite), Datenschutz-Seite in der App, Erlaubnis-Texte korrigiert | ⬜ |
| App-IDs, Versionen, `eas.json`, erster echter Build, Fehlerseite, Leistungstest auf günstigem Android | ⬜ |
| GitHub Actions (Tests, Typprüfung, Lint), Test-Checkliste | ⬜ |
| Testphase: TestFlight und geschlossener Test bei Google (12 Tester, 14 Tage) | ⬜ 🔒 Tester |
| Store-Einträge, Screenshots, Altersfreigabe, Datenschutz-Angaben | ⬜ |

---

## 3. Vorgeschlagene Reihenfolge

1. **Schritt 1 – jetziges System (ohne externe Modelle)**
   - ✅ Wild-Wert, Tier-/Vogel-Sektionen, Nahrungsnetz, LiDAR, Tropfen/Schütteln/Blätter
   - ✅ Pflanzen: Jahreszeiten-Regler, Wachstums-Regler · ⬜ Biologie zerlegt
   - ✅ Lebendige Karte (Flächen, Landschaften, Gebirge, Wälder, Flüsse, grober Standort)
   - ⬜ Steckbriefe für Pilze und Pflanzen
   - ⬜ Zeichnungen für Spuren, Bauten, Nester, Vogelfüße (Tinten-Stil)
   - 🟡 Fotorealistische Startszene als Diorama (Technik fertig, Bilder aus ChatGPT ausstehend)
2. **Schritt 2 – Pilot mit realistischen Modellen** (Fuchs, ggf. Rotkehlchen, Fliegenpilz): GLB-Lader, Animationen, Alters-Regler, Größe/Bildrate auf dem Handy testen
3. **Schritt 3 – auf alle Arten ausweiten**, wenn der Pilot überzeugt

---

## 4. Entscheidungen und Regeln

### 4.1 Technik
- App bleibt bei **Expo + react-three-fiber**. Realistische Modelle als **GLB** mit eingebetteten Animationen.
- **Nicht** Unity (spaltet die App, kein Expo Go) und **nicht** Spline (für Web gedacht).
- KI-Bilder (z. B. ChatGPT) nur als Referenz, nicht für die Lehrbuch-Zeichnungen (die sollen nicht nach KI aussehen).
- Große Modelle später bei Bedarf herunterladen und offline speichern (App-Größe).

### 4.2 Wild-Wert
- Formel: 55 % Verbreitung (Anteil Rasterfelder ohne Nachweis) + 30 % Seltenheitsstufe + 15 % Rote Liste → 1–100.
- Solange die Verbreitung Demo-Daten sind, ist der Wild-Wert ein **Demo-Wert** (so angezeigt).

### 4.3 „Level“ für das Alter
- „Level“ ist bereits der Spieler-Fortschritt. Für das Alter von Arten: **„Lebensjahr“ / „Alters-Stufe“**.
- Länge des Reglers richtet sich nach der **echten Lebensdauer** der Art (nicht pauschal 0–30 bzw. 0–300). Im ersten Lebensjahr Zwischenstufen (z. B. 2 Wochen, 5 Wochen, 3 Monate, 7 Monate).

### 4.4 Inhalte und Fakten
- Nichts erfinden. Alle neuen Texte selbst formuliert und mit `TODO fachlich prüfen` markiert.
- Keine Texte aus Wikipedia übernehmen (Weitergabe-Pflicht der Lizenz).
- Gefahren ehrlich: Tiere nicht gefährlicher darstellen, als sie sind.

### 4.5 Schutz von Natur und Nutzern (unverändert, nicht verhandelbar)
- Fundorte nie genauer als Rasterebene; Standort nur grob und mit Zustimmung.
- Keine Mechanik, die Verfolgen von Tieren oder Verlassen der Wege belohnt.
- Kein Konto, Daten lokal. Echte Bilderkennung erst nach Hinweis einschaltbar (inkl. „unter 16: Eltern fragen“).
- Vor Veröffentlichung: Datenschutzerklärung, Einwilligung unter 16 (DSGVO) rechtlich prüfen, Pl@ntNet-Logo ergänzen.

---

## 5. Offene fachliche Prüfungen (`TODO fachlich prüfen`)
- Höhenstufe und Boden der 10 Demo-Naturräume; Baumarten-Zuordnung (u. a. Kiefer in der Lüneburger Heide)
- Schutzstatus und Rote Liste der Baumarten und der neuen Pflanzen
- Steckbrief-Texte der Tiere und Vögel (`src/data/steckbriefe.ts`)
- Gefahren-Texte (Wildschwein, Fuchs) und Giftigkeit der Pflanzen
- Verbreitungskarten (bisher Demo-Modell, später echte Rasterdaten)
- Höchstalter der Baumarten (`hoechstalter` in `src/data/baumarten.ts`)
