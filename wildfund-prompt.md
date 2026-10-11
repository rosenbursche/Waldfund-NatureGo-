# Wildfund – Projektauftrag für Claude Code

Du hilfst mir, **Wildfund** als echte mobile App (iOS und Android) zu bauen. Ich bin Einsteiger im Programmieren. Erkläre deshalb jeden Schritt kurz in einfachem Deutsch. Sag mir genau, welche Befehle ich ausführen muss und was ich auf dem Handy sehen sollte.

Im Ordner liegt `prototyp-wildfund.html`. Das ist ein klickbarer Web-Prototyp. Er zeigt Aufbau, Inhalte, Artdaten, Punktelogik, Lehrbuch-Zeichnungen und Verbreitungskarte. Übernimm daraus Struktur und Daten, aber **nicht** das Farbschema (siehe „Look & Feel“).

---

## 1. Die Idee in einem Satz

Ein „Pokémon Go für Naturliebhaber“: Junge Leute finden heimische Arten in ihrer Region, fotografieren sie, schalten sie im Katalog frei und sammeln Punkte. Der Reiz liegt im Sammeln und vor allem darin, **seltene** Arten zu finden.

Zielgruppe: Jugendliche und junge Erwachsene, etwa 12–25 Jahre.

## 2. Tech-Stack (bitte so verwenden, außer du hast einen sehr guten Grund)

- **Expo (React Native) mit TypeScript**, Projekt anlegen mit `npx create-expo-app@latest`. Testen über **Expo Go** auf meinem Handy.
- **expo-router** für die Navigation.
- **@react-three/fiber** (native) + **expo-gl** + **@react-three/drei** für alle 3D-Szenen.
- **@shopify/react-native-skia** für Leuchten, Nebel, Partikel und handgezeichnete 2D-Grafiken.
- **react-native-svg** (+ roughjs als Generator für Pfade) für die Lehrbuch-Zeichnungen und die Karte, falls einfacher als Skia.
- **expo-camera** oder **expo-image-picker** für Fotos, **expo-location** für den Standort, **expo-sensors** (Gyroskop) für Parallaxe.
- **Zustand** für den App-Zustand, gespeichert mit **AsyncStorage** (oder MMKV, falls Expo Go das unterstützt).
- Alles soll **offline** funktionieren. Daten liegen als JSON im Projekt.

Nimm jeweils die aktuelle stabile Version, die zum Expo-SDK passt (`npx expo install ...`).

## 3. Neu: Onboarding mit Naturraum

Beim ersten Start gibt man seinen **Naturraum** ein. Danach berechnet die App automatisch, welche **Baumarten dort von Natur aus heimisch** sind.

**Ablauf:**
1. Begrüßungsscreen im mystischen Stil, ein Satz zur Idee.
2. Naturraum wählen, auf drei Wegen:
   - **Standort verwenden** (GPS, nur einmalig, nur grob gespeichert),
   - **Ort oder Postleitzahl suchen**,
   - **Naturraum aus Liste wählen** (z. B. „Lüneburger Heide“, „Schwarzwald“).
3. Die App ordnet den Punkt einem Naturraum zu (Punkt-in-Polygon auf einer vereinfachten GeoJSON-Datei).
4. Ergebnisscreen: „Dein Naturraum: …“ mit Großlandschaft, Höhenstufe und den heimischen Baumarten. Die Bäume „wachsen“ dabei in die Szene hinein.
5. Der Naturraum lässt sich später in den Einstellungen ändern.

**Datenmodell (bitte so umsetzen):**
- `naturraeume.json`: id, Name, Großlandschaft (Norddeutsches Tiefland, Mittelgebirge, Alpenvorland, Alpen), typische Höhenstufe (planar, kollin, submontan, montan, hochmontan), vorherrschender Boden (sauer, kalkreich, sandig, feucht/moorig), vereinfachte Polygon-Geometrie.
- `baumarten.json`: id, Name, wissenschaftlicher Name, Höhenstufen, Böden, Großlandschaften, `heimisch_in` (Liste von Regionen, in denen die Art natürlich vorkommt), 3D-Modell-Parameter.
- **Regel-Engine** `getHeimischeBaeume(naturraum)`: filtert Baumarten nach Großlandschaft, Höhenstufe und Boden und gibt eine nach Wichtigkeit sortierte Liste mit Anteilen zurück (Hauptbaumart, Nebenbaumart, Begleiter).

**Ganz wichtig, fachlich:** „Heimisch“ heißt **von Natur aus dort vorkommend**, nicht „häufig gepflanzt“. Beispiele:
- Die Fichte ist nur im Hochharz, in den hohen Lagen von Erzgebirge und Bayerischem Wald sowie in den Alpen heimisch. Anderswo ist sie forstlich gepflanzt.
- Die Europäische Lärche ist nur in den Alpen heimisch.
- Douglasie und Roteiche sind nicht heimisch.

Die App soll das unterscheiden und z. B. anzeigen: „Fichte – hier angepflanzt, nicht heimisch“.

**Startliste heimischer Baumarten:** Rotbuche, Traubeneiche, Stieleiche, Hainbuche, Bergahorn, Spitzahorn, Feldahorn, Gemeine Esche, Winterlinde, Sommerlinde, Bergulme, Schwarzerle, Grauerle, Sandbirke, Moorbirke, Vogelbeere, Vogelkirsche, Elsbeere, Waldkiefer, Weißtanne, Gemeine Fichte, Europäische Lärche, Eibe, Zitterpappel, Silberweide, Salweide.

**Zum Plausibilisieren** (bitte prüfen, nicht blind übernehmen):
- Lüneburger Heide: Stieleiche, Sandbirke, Waldkiefer, Traubeneiche, Rotbuche; an nassen Stellen Moorbirke und Schwarzerle.
- Hochlagen Bayerischer Wald: Fichte, Weißtanne, Rotbuche, Bergahorn, Vogelbeere.

**Datenquellen:** Recherchiere zuerst und schreib mir auf, was du gefunden hast und unter welcher Lizenz es steht. In Frage kommen die naturräumliche Gliederung Deutschlands des Bundesamts für Naturschutz (BfN), die BfN-Karte der potentiellen natürlichen Vegetation (PNV) und die forstlichen Wuchsgebiete. Wenn du keine frei nutzbaren Geodaten findest, bau zunächst eine kleine Demo-Datei mit 8–10 Naturräumen. Markiere alle Daten, die noch fachlich geprüft werden müssen, im Code mit `// TODO fachlich prüfen`. **Erfinde keine Fakten.**

## 4. Neu: Startszene mit Haus und heimischen Bäumen

Das große Fragezeichen aus dem Prototyp wird ersetzt. In der Mitte steht jetzt eine **3D-Szene**:

- Eine **kleine, geheimnisvolle Waldhütte** auf einer Lichtung, low-poly und stilisiert. Die Fenster glimmen warm, aus dem Schornstein steigt Rauch auf.
- **Rundherum stehen die heimischen Bäume des gewählten Naturraums**, prozedural erzeugt. Jede Baumart hat eine eigene erkennbare Form:
  - Buche: breite, runde Krone, glatter grauer Stamm
  - Eiche: knorrig, ausladend
  - Fichte: schmal, spitz
  - Tanne: breiter, flache Spitze
  - Kiefer: Schirmkrone, rötlicher Stamm oben
  - Birke: weißer Stamm, lockere hängende Krone
  - Erle: dunkel, am Wasser
  - Weitere Arten entsprechend.
- Anzahl und Anteil der Bäume richten sich nach dem Ergebnis der Regel-Engine (Hauptbaumart häufiger).
- **Gesammelte Baumarten** stehen in vollen Farben da. **Noch nicht gefundene** stehen als dunkle Silhouetten im Nebel.
- Antippen eines Baums öffnet die Artenseite.
- **Die vier Kategorien** (Pflanzen, Pilze, Vögel, Säugetiere) schweben als leuchtende **Runensteine oder Laternen** um die Lichtung. Je mehr man in einer Kategorie gesammelt hat, desto heller leuchten sie. Antippen öffnet den Katalog der Kategorie.
- **Optionaler Fortschritt:** Die Hütte wächst mit dem Level, zum Beispiel Unterstand → Waldhütte → Forsthaus → Baumhaus-Sternwarte.
- Die Szene lässt sich mit dem Finger drehen. Ohne Berührung schwebt die Kamera langsam um die Lichtung.

## 5. Look & Feel: mystisch statt neon

Der Prototyp war zu neongrün. Die echte App soll **mystisch, ruhig und lebendig** wirken: wie ein Wald in der Dämmerung, ein altes Naturforscher-Tagebuch und ein Geheimnis, das man lüften will.

**Farben** (als Design-Tokens in einer `theme.ts`):

| Token | Farbe | Verwendung |
|---|---|---|
| `night` | #0B1414 | tiefer Hintergrund |
| `forest` | #142420 | Flächen, Karten |
| `moss` | #3D5A45 | Linien, gedämpftes Grün |
| `fog` | #9FB3AD | Nebel, Nebentext |
| `moon` | #D9E0E6 | Haupttext, Mondlicht |
| `amber` | #E8B86A | Laternenlicht, Belohnungen, Fenster |
| `rune` | #8FD1C4 | gedämpftes Türkis für Leuchten und Runen |
| `rare` | #B79CE0 | sehr selten |
| `legend` | #E9C46A | legendär |

Kein knalliges Neongrün mehr. Leuchten ist **weich**: Bloom, Nebel und Licht in Schichten statt harter Glow-Ränder.

**Dynamik:**
- Volumetrischer Nebel, der langsam zieht.
- Glühwürmchen- bzw. Sporen-Partikel.
- Leichter Wind in den Baumkronen.
- **Tageszeit-Licht nach echter Uhrzeit:** Morgendunst, goldene Stunde, Mondnacht mit Sternen.
- **Parallaxe** über das Gyroskop: Kippt man das Handy, verschiebt sich die Szene leicht.
- Sanfte Übergänge zwischen den Screens.
- Alle Animationen werden bei „Bewegung reduzieren“ (Systemeinstellung) abgeschwächt.

**Schrift:** eine handschriftliche Display-Schrift für Überschriften und Notizen (Tagebuch-Gefühl), dazu eine gut lesbare Textschrift. Laden über `expo-font` / `@expo-google-fonts`.

**Lehrbuch-Zeichnungen** bleiben wie im Prototyp: Tinte auf altem Papier, handgezeichnet mit Beschriftungslinien. Sie sollen nicht KI-generiert aussehen, sondern wie aus einem Biologiebuch.

## 6. Übernahme aus dem Prototyp

Bitte aus `prototyp-wildfund.html` übernehmen und sauber in TypeScript-Module aufteilen:

- **Artendaten** (`S`-Array): 39 Arten in 4 Kategorien mit Seltenheit, Schutzstatus, Rote Liste, Steckbrief, Rätsel, 3D-Parametern und Zeichnungs-Typ. → `data/arten.ts`
- **Seltenheitsstufen** Häufig / Selten / Sehr selten / Legendär mit 10 / 50 / 150 / 400 Aktivitätspunkten.
- **Level, Ränge, Serienbonus, Erfolge.**
- **Kategorie-Stammbaum** mit Gruppen und der **Mystery-Zone** (Arten mit Seltenheit ≥ 3 erscheinen nur als Rätsel, bis man sie findet).
- **Artenseite:**
  - animiertes 3D-Modell (Silhouette, solange nicht gesammelt)
  - Steckbrief
  - Lehrbuch-Zeichnung
  - Deutschlandkarte im Messtischblatt-Raster (TK25, 10′ × 6′)
  - Schutzstatus und Rote Liste
  - Giftwarnung bei Pilzen
  - „Wusstest du?“
- **Sammel-Ablauf:** Foto → Prüfung → Belohnungs-Animation mit Punkten, Level-up und neuen Erfolgen.

Die Baumarten aus Abschnitt 3 werden zusätzlich Teil der Kategorie Pflanzen.

## 7. Bilderkennung (Validierung)

- Baue eine Schnittstelle `validatePhoto(photo, erwarteteArt)` mit zwei Umsetzungen:
  - **Demo-Modus** (simuliert, wie im Prototyp) zum Testen,
  - **echter Modus**.
- Für den echten Modus: Recherchiere die **Pl@ntNet-API** (Pflanzen) und die Möglichkeiten von **iNaturalist** (alle Gruppen). Prüfe Nutzungsbedingungen, Kosten und ob API-Schlüssel nötig sind.
- **API-Schlüssel niemals in die App einbauen.** Wenn ein Schlüssel nötig ist, schlage einen kleinen Server bzw. eine Serverless-Funktion als Zwischenstück vor und erkläre mir, warum.
- Ein Fund zählt nur, wenn die erkannte Art mit ausreichender Sicherheit passt. Sonst sieht man eine freundliche Meldung mit Tipps für ein besseres Foto.

## 8. Schutz von Natur und Nutzern (nicht verhandelbar)

- **Fundorte seltener und geschützter Arten nie genau anzeigen oder teilen.** Höchstens auf Rasterfeld-Ebene. Sonst werden Fundstellen gestört oder geplündert.
- Hinweise wie „Nur fotografieren, nicht pflücken, nicht stören“ bei geschützten Arten. Bei Pilzen immer eine Warnung, dass man nichts essen darf, was nicht von Sachverständigen geprüft wurde.
- Keine Mechanik, die belohnt, Tiere zu verfolgen oder Wege zu verlassen.
- **Datenschutz:** Zielgruppe sind teils Minderjährige. Kein Konto im MVP, Daten nur lokal auf dem Gerät, Standort nur grob und nur mit Zustimmung. Wenn später Konten oder Server dazukommen, weise mich auf DSGVO und das Thema Einwilligung bei unter 16-Jährigen hin.

## 9. Vorgehen in Phasen

Arbeite **Phase für Phase**. Nach jeder Phase hältst du an und schreibst mir:
- was du gebaut hast,
- welchen Befehl ich ausführe,
- was ich auf dem Handy sehen sollte.

Dann wartest du auf mein OK. Lege am Anfang eine `CLAUDE.md` mit den wichtigsten Projektregeln aus diesem Dokument an.

| Phase | Inhalt | Fertig, wenn … |
|---|---|---|
| 0 | Expo-Projekt anlegen, Ordnerstruktur, Theme-Tokens, Schriften, Git-Repo | Die App startet in Expo Go mit dunklem Screen und Testtext in den richtigen Schriften. |
| 1 | Daten: Arten aus dem Prototyp, Baumarten, Naturräume (Demo), Regel-Engine mit Tests | `npm test` zeigt grüne Tests für mindestens 3 Naturräume. |
| 2 | Onboarding: Naturraum per GPS, Suche oder Liste, Ergebnisscreen | Ich wähle einen Naturraum und sehe meine heimischen Bäume. |
| 3 | Startszene: Hütte, prozedurale Bäume, Runensteine, Nebel, Partikel, Tageszeit, Gyroskop | Die Szene läuft flüssig (Ziel: 60 fps auf einem Mittelklasse-Handy) und reagiert auf Antippen. |
| 4 | Katalog: Stammbaum pro Kategorie und Mystery-Zone | Ich komme von der Startszene in jede Kategorie und zurück. |
| 5 | Artenseite: 3D-Modell, Steckbrief, Zeichnung, Karte, Schutzstatus | Alle 39 Arten plus Baumarten haben eine vollständige Seite. |
| 6 | Fotografieren und Validierung (Demo-Modus) | Ich mache ein Foto und die Art wird freigeschaltet. |
| 7 | Belohnungen: Punkte, Level, Serien, Erfolge, Hütte wächst | Punkte und Fortschritt bleiben nach Neustart erhalten. |
| 8 | Echte Bilderkennung (nach Recherche und meinem OK) | Ein echtes Foto einer Art wird korrekt erkannt. |
| 9 | Feinschliff: Barrierefreiheit, Bewegung reduzieren, Leistung, App-Icon, Splash-Screen | Ich kann die App einem Freund auf dessen Handy zeigen. |

## 10. Regeln für dich

- Kleine, verständliche Schritte statt riesiger Code-Blöcke auf einmal.
- Kommentiere den Code auf Deutsch, dort wo es beim Verstehen hilft.
- Wenn du etwas nicht weißt (Daten, Lizenzen, API-Bedingungen): recherchieren oder nachfragen, **nicht raten**.
- Wenn eine Bibliothek in Expo Go nicht läuft, sag es mir und schlag eine Alternative vor (z. B. einen Development Build).
- Mach nach jeder abgeschlossenen Phase einen Git-Commit mit einer klaren Nachricht.

**Starte jetzt mit Phase 0.** Lies vorher `prototyp-wildfund.html`, damit du weißt, wohin die Reise geht.
