# Wildfund – Dokumentation

Stand: 15.10.2026 · Diese Datei beschreibt die App, wie sie im Code steht: Bedienung, Spielregeln, Daten, 3D-Welt, Technik, Prüfen und Arbeitsablauf.

Weitere Dokumente:

| Datei | Inhalt |
|---|---|
| `wildfund-prompt.md` | ursprünglicher Auftrag (Phasen 0–9) |
| `docs/ANFORDERUNGEN.md` | alle Anforderungen mit Stand (✅ / 🟡 / ⬜ / 🔒) – bei neuen Wünschen dort ergänzen |
| `CLAUDE.md` | Projektregeln für die Zusammenarbeit und den Code |
| `DATENQUELLEN.md` | Herkunft und Lizenz aller Daten und Modelle |
| `docs/3D-PIPELINE.md` | Vorgaben für realistische 3D-Modelle (GLB), Fuchs-Pilot |
| `docs/SZENE-PROMPTS.md` | Prompts für die Bild-Startszene (Diorama) |
| `server/README.md` | Erkennungsserver für Pl@ntNet einrichten |
| `prototyp-wildfund.html` | klickbarer Web-Prototyp (Farbschema **nicht** übernehmen) |

---

## 1. Was ist Wildfund?

„Pokémon Go für Naturliebhaber“: Man findet heimische Arten, fotografiert sie und schaltet sie im Katalog frei. Dafür gibt es Punkte. Der Reiz liegt in **seltenen** Arten. Zielgruppe: 12–25 Jahre.

Grundsätze:
- **Offline:** Alle Daten liegen in der App, es gibt kein Konto. Gespeichert wird nur auf dem Handy.
- **Mystisch statt neon:** Wald in der Dämmerung, altes Naturforscher-Tagebuch.
- **Schutz von Natur und Nutzern** (Abschnitt 10): Fundorte bleiben ungenau, der Standort ist nur grob, und es gibt keine Belohnung dafür, Tieren nachzustellen.

---

## 2. Schnellstart

### 2.1 Einmalig vorbereiten
```
cd ~/Waldfund-NatureGo-
npm install
```
Auf dem Handy die App **Expo Go** installieren (App Store bzw. Google Play).

### 2.2 App starten
```
cd ~/Waldfund-NatureGo-
npx expo start
```
- Im Terminal erscheint ein QR-Code. iPhone: mit der Kamera-App scannen. Android: in Expo Go scannen.
- Handy und Computer müssen im **selben WLAN** sein. Wenn das nicht geht, starte mit `npx expo start --tunnel`.
- Auf dem Handy erscheint beim ersten Start das Onboarding, danach die 3D-Lichtung mit der Hütte.

### 2.3 Während der Server läuft (Tasten im Terminal)
| Taste | Wirkung |
|---|---|
| `r` | App neu laden (nach Code-Änderungen) |
| `j` | Debugger öffnen |
| `Strg + C` | Server beenden |

Auf dem Handy: Schütteln öffnet das Entwicklermenü, dort „Reload“.

### 2.4 Probleme beim Start
| Problem | Lösung |
|---|---|
| „Port 8081 is being used“ | Es läuft schon ein Expo-Server. Entweder dort `r` drücken oder ihn beenden: `lsof -iTCP:8081 -sTCP:LISTEN` zeigt die Prozessnummer (PID), dann `kill <PID>` |
| QR-Code verbindet nicht | `npx expo start --tunnel` |
| Seltsame Fehler nach Paket-Änderungen | `npx expo start -c` (leert den Zwischenspeicher) |
| App zeigt alten Stand | Im Terminal `r` drücken |

### 2.5 Die App einem Freund zeigen
`npx expo start --tunnel`: Der Freund scannt den QR-Code mit Expo Go. Das geht nur, solange der Server bei dir läuft. Ohne deinen Computer braucht es einen eigenen Build über EAS (siehe `README.md`).

---

## 3. Die App benutzen (Bildschirme)

Die Routen liegen in `src/app/` (expo-router: Der Dateiname ist der Pfad).

| Bildschirm | Datei | Inhalt |
|---|---|---|
| Willkommen | `onboarding/index.tsx` | Begrüßung (Schritt 1) |
| Naturraum wählen | `onboarding/waehlen.tsx` | per **Standort** (grob), **Suche** oder **Liste** (Schritt 2) |
| Ortssuche | `onboarding/suche.tsx` | Ort oder Postleitzahl suchen, komplett offline (ca. 19.000 Einträge, werden erst hier geladen) |
| Liste | `onboarding/liste.tsx` | alle Naturräume, nach Großlandschaft gruppiert |
| Ergebnis | `onboarding/ergebnis.tsx` | „Dein Naturraum“ mit den heimischen Bäumen (Schritt 3) |
| Start / Lichtung | `index.tsx` | 3D-Lichtung (oder Diorama, siehe 7.9). Ohne gewählten Naturraum geht es zum Onboarding |
| Katalog | `katalog/[kategorie].tsx` | eine Kategorie, umschaltbar: **Wald** (3D) oder **Stammbaum** |
| Artenseite | `art/[id].tsx` | Modell, Wild-Wert, Steckbrief, Lehrbuch-Zeichnung, Karte … (siehe 8.1) |
| Sammeln | `sammeln/[id].tsx` | Foto machen → prüfen → freischalten |
| Mystery-Zone | `mystery.tsx` | die seltensten Arten aus allen vier Kategorien |
| Feldtagebuch | `tagebuch.tsx` | Level, Rang, Hütte, Serie, Erfolge, letzte Funde |
| Einstellungen | `einstellungen.tsx` | siehe 3.2 |
| 3D-Test | `modelltest.tsx` | Test für realistische GLB-Modelle (über Einstellungen erreichbar) |

### 3.1 Bedienung der Lichtung
- Die Kamera kreist ohne Berührung langsam um die Hütte. Mit dem **Finger ziehen** dreht man sie, **Kippen des Handys** verschiebt sie leicht (Parallaxe).
- Einen **Baum antippen** öffnet die Artenseite der Baumart.
- Einen **Runenstein antippen**: Die Kamera fliegt hinein, dann öffnet sich der Katalog der Kategorie. Vorn rechts steht Pflanzen, vorn links Pilze, hinten links Vögel, hinten rechts Säugetiere.
- Die **Fortschrittsanzeige** oben (Level, Rang, Punkte, Serie) öffnet beim Antippen das Feldtagebuch. Das **Zahnrad** öffnet die Einstellungen.

### 3.2 Einstellungen
| Bereich | Möglichkeiten |
|---|---|
| Dein Naturraum | anzeigen, „Naturraum ändern“ |
| Sammlung | „Beispielfunde laden“ (zum Ausprobieren, ohne Punkte), „Sammlung leeren“ (löscht auch Fund-Fotos) |
| Bilderkennung | „Echte Erkennung für Pflanzen (Pl@ntNet)“ (nur schaltbar, wenn ein Server eingetragen ist). Im Demo-Modus zusätzlich: „manche Fotos nicht erkennen“, um die Foto-Tipps zu testen |
| Darstellung | „Startszene als Bild-Diorama (Test)“, „Bildrate auf der Lichtung anzeigen“, „3D-Test: realistisches Modell“ |
| Belastungstest (nur Entwicklung) | „500 echte Testarten im Katalog“ und Gruppierung im Stammbaum nach **Konzept** (Ast → Zweig, Standard), Vorschlag, Familie oder Ordnung. Zuordnung der Testarten: `src/data/testGliederung.ts`. In Expo Go standardmäßig an, in der Store-Version nicht vorhanden. Daten: `src/data/testarten.json`, neu bauen mit `node scripts/testarten-bauen.mjs` |
| Deine Daten | „Alles zurücksetzen“ |
| Datenquellen | Pflicht-Namensnennungen (Thünen, Karte, 3D-Modell, GeoNames, ggf. Pl@ntNet) |

---

## 4. Spielregeln

Die Werte stehen in `src/data/spiel.ts`, die Rechenregeln in `src/logic/fortschritt.ts`.

### 4.1 Seltenheit und Punkte
| Stufe | Name | Punkte (AP) |
|---|---|---|
| 1 | Häufig | 10 |
| 2 | Selten | 60 |
| 3 | Sehr selten | 300 |
| 4 | Legendär | 1000 |

- Punkte gibt es nur beim **ersten echten Fund** einer Art. Ein weiterer Fund ersetzt nur das Foto.
- Baumarten ohne eigenen Eintrag in `arten.ts` zählen als „häufig“ (10 AP).
- Ab Stufe 3 erscheint eine Art in der **Mystery-Zone** nur als Rätsel („?“), bis man sie findet (`MYSTERY_AB = 3`).
- Beispielfunde zählen weder für Punkte noch für Erfolge.

### 4.2 Serie
- Findet man an aufeinanderfolgenden Tagen etwas, wächst die Serie. Gezählt wird nach der Ortszeit des Handys.
- Bonus ab dem 2. Tag: 5 AP × Serientage, höchstens 50 AP. Er gibt es einmal pro Tag beim ersten Fund.

### 4.3 Level und Ränge
| Level | ab AP | Rang |
|---|---|---|
| 1 | 0 | Entdecker |
| 2 | 40 | Spurenleser |
| 3 | 120 | Spurenleser |
| 4 | 260 | Waldläufer |
| 5 | 480 | Waldläufer |
| 6 | 800 | Feldforscher |
| 7 | 1250 | Feldforscher |
| 8 | 1900 | Artenkenner |
| 9 | 2800 | Naturdetektiv |
| 10 | 4000 | Biotop-Profi |
| 11 | 5600 | Wildnis-Legende |
| 12 | 7600 | Wildnis-Legende |

### 4.4 Die Hütte wächst mit dem Level
| Level | Stufe | Name |
|---|---|---|
| 1–2 | 0 | Unterstand |
| 3–5 | 1 | Waldhütte |
| 6–8 | 2 | Forsthaus |
| ab 9 | 3 | Baumhaus-Sternwarte |

### 4.5 Erfolge
Erster Fund · Alle vier Reiche (je Kategorie mindestens eine Art) · Pilzkenner (5 Pilze) · Vogelohr (5 Vögel) · Seltenheitsjäger (eine Art ab „sehr selten“) · Legende (eine legendäre Art).

---

## 5. Inhalte und Daten

### 5.1 Arten (`src/data/arten.ts`, 48 Arten)
Es sind 39 Arten aus dem Prototyp plus 9 ergänzte Pflanzen. In Klammern steht die Seltenheitsstufe.

- **Pflanzen (19):** Stieleiche (1), Rotbuche (1), Buschwindröschen (1), Märzenbecher (2), Wald-Sauerklee (1), Echte Schlüsselblume (2), Türkenbund-Lilie (2), Arnika (3), Rundblättriger Sonnentau (3), Gelber Frauenschuh (4), Gewöhnliche Hasel (1), Schwarzer Holunder (1), Schlehe (1), Eingriffeliger Weißdorn (1), Blauer Eisenhut (2), Tollkirsche (2), Herbstzeitlose (2), Echter Seidelbast (2), Eibe (2)
- **Pilze (9):** Fliegenpilz (1), Grüner Knollenblätterpilz (1), Schopf-Tintling (1), Hallimasch (1), Fichten-Steinpilz (1), Pfifferling (2), Krause Glucke (2), Satans-Röhrling (3), Igel-Stachelbart (4)
- **Vögel (10):** Amsel (1), Kohlmeise (1), Rotkehlchen (1), Eichelhäher (1), Buntspecht (1), Schwarzspecht (2), Eisvogel (2), Uhu (3), Wiedehopf (4), Schwarzstorch (4)
- **Säugetiere (10):** Reh (1), Eichhörnchen (1), Wildschwein (1), Dachs (2), Rotfuchs (1), Braunbrustigel (1), Feldhase (2), Biber (2), Europäische Wildkatze (3), Eurasischer Luchs (4)

Jede Kategorie hat Gruppen (z. B. Bäume, Büsche, Frühblüher) und die Gruppe **„Gefährlich & tödlich“**.

Weitere Inhalte stehen in eigenen Dateien:
- `src/data/steckbriefe.ts`: Texte für Tiere und Vögel, mit Nahrung als Verweis auf Arten in der App.
- `src/data/verbreitung.ts`: Demo-Verbreitungsmodelle.
- `src/data/modelle.ts`: realistische GLB-Modelle mit Lizenz.

### 5.2 Baumarten (`src/data/baumarten.ts`, 28 Arten)
Rotbuche, Traubeneiche, Stieleiche, Hainbuche, Bergahorn, Spitzahorn, Feldahorn, Gemeine Esche, Winterlinde, Sommerlinde, Bergulme, Schwarzerle, Grauerle, Sandbirke, Moorbirke, Vogelbeere, Vogelkirsche, Elsbeere, Waldkiefer, Weißtanne, Gemeine Fichte, Europäische Lärche, Eibe, Zitterpappel, Silberweide, Salweide, **Douglasie** und **Roteiche**. Douglasie und Roteiche stammen nicht aus Europa und gelten nie als heimisch.

Jede Baumart hat Standortansprüche: Großlandschaft, Höhenstufe, Boden, Rollen und Höchstalter. Dazu kommt ein 3D-Bauplan aus Kronenform, Laub- und Rindenfarbe und Höhe. Die Kronenformen sind `rund`, `oval`, `ausladend`, `kegel`, `kegel-flach`, `schirm` und `haengend`. Die Datei ist TypeScript statt JSON, damit jede Angabe ein `// TODO fachlich prüfen` tragen kann.

### 5.3 Naturräume (`src/data/naturraeume.json`, 10 Demo-Naturräume)
Lüneburger Heide · Mittelbrandenburger Talsand- und Moränenland · Ostholsteinisch-Westmecklenburger Jungmoränenland · Hochharz · Oberes Erzgebirge · Innerer Bayerischer Wald · Schwarzwald · Schwäbische Alb · Oberbayerische Jungmoräne und Molassevorberge · Bayerische Alpen.

- Die Grenzen sind echte, vereinfachte Grenzen der forstlichen Wuchsbezirke (© Thünen-Institut, dl-de/by-2-0).
- Höhenstufe, Boden und Großlandschaft habe ich selbst eingestuft. Sie sind als **zu prüfen** markiert.
- Die Datei wird mit `node scripts/naturraeume-bauen.mjs` erzeugt und **nicht von Hand geändert**.

### 5.4 Regel-Engine „heimisch“ (`src/logic/regelEngine.ts`)
„Heimisch“ heißt **von Natur aus dort vorkommend**, nicht „häufig gepflanzt“. Eine Baumart ist in einem Naturraum heimisch, wenn alles zutrifft:
1. Status „heimisch“ (nicht aus anderen Kontinenten eingeführt).
2. Großlandschaft passt.
3. Höhenstufe passt.
4. Boden passt (vorherrschender Boden oder ein Nebenboden).
5. Falls `heimisch_in` gesetzt ist: Naturraum oder Großlandschaft steht in der Liste.

Für die Anteile in der Szene gilt das Gewicht haupt 6 / neben 3 / begleiter 1. Das ist eine **Spiel-Vereinfachung**, keine forstlichen Flächenanteile. Angepflanzte, aber nicht heimische Arten zeigt die App mit einem Hinweis, z. B. „Fichte – hier angepflanzt, nicht heimisch“.

### 5.5 Weitere Daten
| Datei | Inhalt | Erzeugt mit |
|---|---|---|
| `src/data/orte.json` | ca. 19.000 PLZ/Orte (GeoNames, CC BY 4.0), Koordinaten auf ~1 km gerundet | `node scripts/orte-bauen.mjs` |
| `src/data/karte.json` | Wuchsgebiete, Großlandschaften, Flüsse für die Deutschlandkarte | `node scripts/karte-bauen.mjs` |
| `src/data/szenen.ts` | Bildebenen und Punkte der Diorama-Startszene | von Hand |

Neue Daten dürfen nur mit geprüfter Lizenz hinein und müssen in `DATENQUELLEN.md` eingetragen werden.

---

## 6. Logik-Module (`src/logic/`)

Alle Module sind reine Rechenfunktionen ohne Bildschirm und deshalb testbar. Die Tests liegen in `src/logic/__tests__/`.

| Datei | Aufgabe |
|---|---|
| `regelEngine.ts` | heimische Baumarten je Naturraum, Herkunftstext |
| `geo.ts` | Punkt-in-Polygon, Naturraum zu einem Standort finden, Standort **vergröbern** (0,1° ≈ 7–11 km) |
| `ortsuche.ts` | Offline-Suche nach Ort/PLZ; Umlaute egal („lueneburg“ = „Lüneburg“) |
| `fortschritt.ts` | Punkte, Level, Serie, Erfolge, Hüttenstufe, Belohnung eines Fundes |
| `katalog.ts` | Arten je Kategorie, Gruppen, Lebensbaum (Äste/Sterne/Wurzeln), Mystery, Wald-Plätze, Gefahr-Einträge |
| `baum/` | Geometrie der vier Lebensbäume (`pflanzen.ts`, `pilze.ts`, `voegel.ts`, `saeuger.ts`), Gerüst (`rahmen.ts`), Zeichenwerkzeuge (`werkzeug.ts`), Einstieg `stil.ts` |
| `validierung.ts` | Foto-Prüfung: Demo oder echt (über eigenen Server), Mindest-Sicherheit 0,6, Foto-Tipps |
| `foto.ts` | Foto aufnehmen, verkleinern, auf dem Handy ablegen (EXIF/GPS wird dabei entfernt) |
| `tageszeit.ts` | Lichtstimmung nach echter Uhrzeit (siehe 7.4) |
| `jahreszeit.ts` | Blüte, Frucht und Laub je Monat (für den Jahreszeiten-Regler) |
| `wachstum.ts` | Wachstums-Regler: Bäume in Lebensjahren bis zum Höchstalter, sonst 3 Stufen |
| `wildwert.ts` | Wild-Wert 1–100 (siehe 8.2) |
| `verbreitung.ts` | Raster der TK25-Messtischblätter, Demo-Vorkommen, Flächenanteile für die Karte |
| `nahrungsnetz.ts` | „Wer frisst wen?“ und rückwärts „Wer frisst mich?“ |
| `lichtung.ts` | Zufall mit Startwert (mulberry32), Bäume im Ring um die Hütte verteilen |
| `lichtungDetails.ts` | Weg, Tümpel, Ausstattung, freie Flächen, Streuen von Gras/Steinen/…, Sichtachse zur Hütte |
| `zauberwald.ts` | Zauberwald im Katalog: Bodenhöhe mit Moospolstern und Hohlweg, Wegverlauf, Licht am Ende, Ring der Moosbäume, hohe Stämme, Streuen ohne Arten und Weg zu treffen |
| `verborgenes.ts` | versteckte Kleinigkeiten: Dunkelheit, Augen-Plätze, Blinzeln, Maus, Eulenkopf |
| `konfiguration.ts` | öffentliche Server-Adresse aus `app.json → extra` |

**Startwert-Prinzip:** Alles „Zufällige“ der Szene hängt am Naturraum (`startwertAus(naturraum.id)`). Derselbe Naturraum sieht deshalb immer gleich aus.

---

## 7. Die 3D-Lichtung

### 7.1 Technik in Kürze
- `@react-three/fiber` (native) + `expo-gl` + `three` 0.186. `@react-three/drei` wird **bewusst nicht** genutzt.
- Alles Grafische entsteht im Code: Leuchten, Nebel, Blätter, Nadeln und das Spinnennetz. Es gibt keine Bilddateien außer dem Diorama.
- `expo-gl` zeichnet in voller Pixeldichte. Leistung entsteht deshalb durch geteilte Geometrien und Materialien (`src/scene/material.ts`) und **InstancedMesh**: hunderte gleiche Dinge in einem einzigen Zeichenaufruf.
- **Bewegung reduzieren** (Systemeinstellung des Handys): Die Szene steht still, Animationen sind abgeschwächt oder aus.

### 7.2 Koordinaten der Lichtung
Die Hütte steht im Ursprung (0, 0, 0), ihre Tür zeigt nach vorn (+z). y ist die Höhe. Die Standard-Kamera blickt von vorn (+z) auf die Hütte.

| Ding | Lage |
|---|---|
| Weg | von der Tür (z 1,05) bis z 14, leicht geschwungen (`wegX(z)`) |
| Tümpel | Mitte (4,3 / 0,4), Halbachsen 1,15 × 0,8 |
| Runensteine | Pflanzen (3,6 / 3,2), Pilze (−3,6 / 3,2), Vögel (−3,8 / −2,9), Säugetiere (3,8 / −2,9), schwebend in 1,4 Höhe |
| Bäume | 30 Stück im Ring um die Hütte. Vor der Hütte bleibt entlang des Weges ein Streifen frei (Sichtachse). |
| Ausstattung | Holzstapel, Hackklotz, Laterne und Wegweiser am Weg, Bank und Regentonne an der Hütte, Zaun dahinter, umgestürzter Stamm, 3 Baumstümpfe, Hexenring (`AUSSTATTUNG` in `lichtungDetails.ts`) |

### 7.3 Aufbau der Szene (`src/scene/`)
`Lichtung.tsx` setzt alles zusammen:

| Datei | Inhalt |
|---|---|
| `Atmosphaere.tsx` | Himmel, Nebel, Licht, Sterne, Glühwürmchen, Nebelschwaden |
| `Huette.tsx` + `huettenTeile.ts` | Hütte je Stufe. Waldhütte, Forsthaus und Sternwarte nutzen die fein gebaute Blockhütte: Rundstämme mit überstehenden Ecken, Schindeldach, Feldsteinsockel, gemauerter Kamin, Brettertür, Fenster mit Läden und Blumenkasten, Rauch, leuchtende Fenster |
| `Baum3D.tsx` + `baumGenerator.ts` + `blattTexturen.ts` | fein verästelte Bäume (siehe 7.5) |
| `LichtungDetails.tsx` | welliger Boden, Weg mit Trittsteinen, Gras und Farne im Wind, Moos, Blumen, Feldsteine, Pilze mit Fliegenpilz-Tupfen, Hexenring, Falllaub, Zweige, Zapfen, Sträucher, Tümpel mit Schilf und Seerosen, Ausstattung, Fichten-Umrisse am Horizont, Mond und Lichtstrahlen |
| `LichtungLeben.tsx` | fallende Blätter, Motten an der Laterne, Vögel hoch über dem Wald, Staub im Licht (bei „Bewegung reduzieren“ aus) |
| `LichtungVerborgenes.tsx` | versteckte Kleinigkeiten (siehe 7.6) |
| `Runenstein.tsx` | schwebende Runensteine. Je mehr Arten der Kategorie gesammelt sind, desto heller leuchten sie. Bis zu 3 gefundene Arten kreisen darum. |
| `Steuerung.tsx` + `steuerZustand.ts` | Kamera (Kreisen, Finger, Kippen), Antippen, Bildschirm-Positionen, Bildraten-Messer |
| `material.ts`, `texturen.ts` | geteilte Materialien und Grundformen, weiche Leuchttextur |

### 7.4 Tageszeit (`src/logic/tageszeit.ts`)
Das Licht folgt der **echten Uhrzeit** des Handys. Zwischen festen Schlüsselzeiten wird weich übergeblendet:

| Uhrzeit | Stimmung |
|---|---|
| 0:00–4:30 | Mondnacht |
| 6:30 | Morgendunst |
| 10:00–16:30 | Tag im Wald |
| 19:00 | Goldene Stunde |
| 21:00 | Dämmerung |
| ab 22:30 | Mondnacht |

Jede Stimmung legt diese Werte fest: Himmel, Nebel und Nebeldichte, Umgebungslicht, Sonnen- bzw. Mondlicht, Lichthöhe, Sterne, Anteil der Glühwürmchen und Helligkeit der Hüttenfenster.

### 7.5 Bäume (`baumGenerator.ts`)
- Jeder Baum wächst aus Code: Stamm mit Wurzelanläufen, Hauptäste, Zweige, Zweiglein und hunderte Blatt- bzw. Nadelbüschel. Die Büschel sind ein InstancedMesh mit gemalter Textur.
- Je Kronenform gibt es einen **Bauplan** mit Abgangswinkel, Biegung, Knorrigkeit, Blattart und Rindenmuster:

  | Kronenform | Gestalt |
  |---|---|
  | rund | Buche: glatt, dicht |
  | ausladend | Eiche: knorrig, gefurcht |
  | kegel | Fichte: Astquirle mit Nadelzweigen |
  | kegel-flach | Tanne: waagerechte Äste, flache Spitze |
  | schirm | Kiefer: unten Borke, oben rötlich |
  | haengend | Birke: weiß mit schwarzen Streifen, hängende Zweiglein |

- Jede Kronenform gibt es in 3 Varianten (aus der Position gewählt). Gebaute Bäume werden zwischengespeichert.
- Die Rinde steckt als Graustufe in den Eckpunkten, die Farbe kommt vom Material. So funktionieren die Silhouette (nicht gefunden) und die graue Darstellung mit denselben Bäumen.
- Blätter und Nadeln wiegen sich über einen kleinen Shader-Zusatz im Wind.

### 7.6 Versteckte Kleinigkeiten (`LichtungVerborgenes.tsx`, Logik in `verborgenes.ts`)
| Detail | Wo | Verhalten |
|---|---|---|
| Augenpaare (12) | 8 an der Außenseite von Sträuchern, 4 am Waldrand | Nur in Dämmerung und Nacht. Sie tauchen auf, leuchten, blinzeln, schauen sich um und verschwinden wieder. Jedes Paar hat einen eigenen Takt von 16–38 s. |
| Eule | auf dem Wegweiser | dreht ruckartig den Kopf, blinzelt |
| Leuchtendes Holz | umgestürzter Stamm | türkise Flecken, nur nachts |
| Spinnennetz | zwischen Laternenpfahl und -arm | Tautropfen glitzern im Laternenlicht |
| Schnecke | Baumstumpf rechts vom Weg | eine Runde in etwa 2,5 Minuten |
| Frosch | Seerosenblatt im Tümpel | Kehle bewegt sich beim Atmen |
| Maus | Baumstumpf hinten rechts | lugt etwa alle 19 s hervor |
| Rehspuren | im Sand des Weges | fest |
| Feder | auf der Bank | fest |

Wichtig: Diese Dinge sind **nicht antippbar und bringen keine Punkte**. Das folgt aus der Regel „keine Mechanik, die belohnt, Tiere zu verfolgen“. Bei „Bewegung reduzieren“ leuchtet ein Teil der Augen still, alles andere bleibt stehen.

### 7.7 Kategorie-Wald als Zauberwald (`KategorieWald.tsx`, `Zauberwald.tsx`, `logic/zauberwald.ts`)
- Im Katalog in der Ansicht „Wald“ stehen alle Arten auf einer moosigen Lichtung in einem verwunschenen Nebelwald: Pflanzen und Pilze am Boden, Vögel auf bemoosten Baumstümpfen, Säugetiere zwischen den Moospolstern.
- **Kulisse:** Ring aus uralten, knorrigen Moosbäumen (eigener Bauplan „uralt“ im Baum-Generator, Moos auf allen nach oben zeigenden Flächen und am Stammfuß), hohe schlanke Stämme im Nebel, ferner Wald, Farne, Gras, bemooste Steine, umgestürzte Stämme. Ein **Hohlweg** mit Böschungen und Laub führt von der Lichtung nach hinten auf ein **helles Licht im Nebel** zu. Dazu schräge Lichtstrahlen, Bodennebel und schwebende Lichtpunkte (Farbe je Kategorie). Ein dunkler Rand (Vignette) lenkt den Blick in die Mitte.
- Beim Öffnen schaut die Kamera den Hohlweg entlang ins Licht. Ziehen dreht wie gewohnt um die Lichtung.
- **Gefunden:** Art in Farbe, ein warmer Lichtkegel fällt von oben, kleine Funken steigen auf.
- **Noch nicht gefunden:** dunkler Schatten, darüber schwebt ein flackerndes Irrlicht, am Boden ein schwacher Runenkreis.
- Gefährliche Arten bekommen weiter eine rote Markierung (Ring, Nebel, Dornen).
- Bei „Bewegung reduzieren“ stehen Wind, Irrlichter, Funken, Nebel und Lichtpunkte still.

### 7.8 Artmodelle (`artModell.ts`, `ArtBuehne.tsx`, `Lidar.tsx`, `GlbModell.tsx`)
- **Low-Poly-Modelle** aus den Parametern des Prototyps. Jedes hat eine eigene Bewegung, zum Beispiel Flügelschlag, wippende Blüte oder Ohrenzucken.
- **LiDAR-Effekt:** Das Modell erscheint zuerst als Laser-Punktwolke (4000 Punkte), eine Scan-Linie fährt hoch, dann blendet das Modell ein.
- **GLB-Modelle** (realistisch) werden aus dem App-Paket geladen. Haben sie Animationen, läuft `idle` in Schleife. Vorgaben dafür stehen in `docs/3D-PIPELINE.md`. Zurzeit gibt es nur den Test-Hirsch („Realistic Deer“, CC BY 4.0). Er dient als Platzhalter auf der Reh-Seite.
- Solange eine Art nicht gesammelt ist, zeigt die Artenseite nur eine dunkle Silhouette.

### 7.9 Bild-Diorama (Option)
- Unter Einstellungen → Darstellung lässt sich die Startszene auf ein **2,5D-Diorama** umschalten. Das sind übereinanderliegende Bildebenen, die sich beim Kippen verschieben. Effekte wie Nebel, Rauch, Glühwürmchen und Mondstrahlen kommen aus dem Code.
- Standard ist die 3D-Lichtung.
- Zurzeit sind dort Platzhalter-Bilder eingebaut (`node scripts/platzhalter-szene.mjs`). Echte Bilder sollen aus ChatGPT kommen (`docs/SZENE-PROMPTS.md`) und werden mit `python3 scripts/ebenen-freistellen.py <ordner>` freigestellt.

### 7.10 Leistung prüfen
Einstellungen → Darstellung → „Bildrate auf der Lichtung anzeigen“. Ziel sind 55–60 Bilder pro Sekunde. Auf dem Handy ist das mit allen Details **noch nicht geprüft**. Wenn es ruckelt: Weit entfernte Bäume könnten einfacher gezeichnet werden (offen).

---

## 8. Artenseite, Karte, Wild-Wert

### 8.1 Artenseite (`src/app/art/[id].tsx`)
Von oben nach unten:
1. **3D-Bühne:** Ziehen dreht das Modell, beim Öffnen läuft der LiDAR-Effekt. Ist die Art noch nicht gesammelt, sieht man nur eine Silhouette.
2. Nur bei Pflanzen: **Blüte & Frucht im Jahreslauf** (Monatsregler) und **Wachstums-Regler** (Keimling → großer Baum). Das Modell verändert sich mit.
3. Name und lateinischer Name. Ist die Art eine Mystery-Art, steht dort „???“ bzw. „Species incognita“.
4. **Wild-Wert** (1–100) mit dem Hinweis „bedroht / nicht bedroht“.
5. Seltenheit und Punkte. Danach entweder der eigene Fund (Datum, Foto, „Demo-Prüfung“ bzw. „geprüft mit Pl@ntNet“) oder der Knopf „**Foto machen & sammeln**“.
6. **Steckbrief:** Schutzstatus, Rote Liste, Lebensraum. Bei Bäumen zusätzlich, wo sie von Natur aus vorkommen, und ob sie im gewählten Naturraum heimisch sind. Bei geschützten Arten steht dort: „Nur fotografieren – nicht pflücken, nicht fangen, nicht stören.“
7. Bei Tieren und Vögeln: **Key Features**, **Lebensraum** (mit Begründung), **Nahrung** (mit Verweisen auf Arten in der App), **Spuren** und **Wohnen & Schlafen** bzw. **Schlafen**. Bei Vögeln zusätzlich **Füße & Krallen**, **Nest** und „**Warum so gebaut?**“.
8. „**Wer frisst mich?**“ (Pflanzen) bzw. „**Fressfeinde**“ (Tiere), automatisch aus der Nahrung der Tiere.
9. **Lehrbuch-Zeichnung** im Stil „Tinte auf altem Papier“ (`LehrbuchZeichnung.tsx`).
10. **Verbreitung in Deutschland**. Bei Mystery-Arten heißt der Abschnitt „Hier könntest du suchen“.

**Grafische Tierseiten (alle 10 Säugetiere):** Gibt es für eine Art einen Eintrag in `src/data/tierSeiten.ts`, ersetzt eine Bild-Seite die Text-Abschnitte (Steckbrief, Key Features, Nahrung, Spuren, Wohnen, Fressfeinde, Wusstest du). Bausteine in `src/components/tier/`:

| Datei | Abschnitte |
|---|---|
| `RehFigur.tsx` | Reh als Zeichnung aus Code: steht, äst oder liegt; Sommer-/Winterfell; Geweih blank, im Bast oder keins; Kitz mit Flecken |
| `FuchsFigur.tsx` | Fuchs als Zeichnung: steht, Mäusesprung oder eingerollt mit der Lunte über der Nase; Winterfell mit buschigerer Lunte; dunkle Welpen |
| `figuren/` | Zeichnungen von Eichhörnchen, Wildschwein, Dachs, Igel, Feldhase, Biber, Wildkatze und Luchs (je steht / aktiv / liegt), gemeinsame Teile wie Fellverlauf und schlafend eingerolltes Tier |
| `TierFigur.tsx` | wählt die passende Figur, dazu Bildausschnitt, Schulterhöhe bzw. Körperlänge je Figur |
| `Trittsiegel.tsx` | Trittsiegel-Formen: Huf, Huf mit Afterklauen, Fuchspfote, Katzenpfote, 5-Zehen-Pfote, Hase, Nager, Biber |
| `TierSymbol.tsx` | kleine Strich-Symbole und Spuren-Zeichnungen |
| `TierTafel.tsx` | Rahmen je Abschnitt, Symbol-Umschalter, pulsierender Leuchtpunkt, Fingerfläche für Drehräder |
| `KoerperTafeln.tsx` | „So groß“ (Reh neben dir, eigene Größe per Regler), „Erkunden“ (Leuchtpunkte, Bock/Ricke) |
| `ZeitTafeln.tsx` | „Ein Jahr“ (Jahresrad zum Drehen), „Ein Tag“ (Tagesuhr zum Drehen) |
| `UmweltTafeln.tsx` | „Zuhause“ (Wald/Waldrand/Wiese, Tag/Dämmerung), „Speiseplan“ (je Monat), „Spuren lesen“ (Karten, Trittsiegel 1 : 1), „Gefahren“, „Kitz gefunden?“ |
| `TierSeiteInhalt.tsx` | setzt alles zusammen, Wild-Wert als Zeiger |
| `TierHintergrund.tsx` | gezeichneter Nachtwald hinter der Seite (Sterne, Mond, Höhenzug, Waldsaum, Nebel, Stämme, Glühwürmchen) mit Parallaxe beim Scrollen |

**Hero:** Oben steht das Tier in einer 3D-Umgebung passend zu seinem Lebensraum (`src/scene/Lebensraum3D.tsx`, beim Reh ein Waldrand: Wiese mit Gras und Blumen, Hecke aus gemalten Blattzweigen mit Beeren, zwei Reihen heimischer Laubbäume aus dem Baum-Generator, Glühwürmchen). Licht und Nebel folgen der Uhrzeit. Der Name steht groß auf dem Bild, darunter ein weicher Übergang in die Seite.

Die Rechenlogik (Monat, Uhrzeit, Fingerposition, Zentimeter → Bildschirmpunkte) steht in `src/logic/tierJahr.ts`. **Echte Fotos (Reh, Fuchs):** In `src/data/fotos.ts` stehen die Fotos mit Urheber und Lizenz (Wikimedia Commons), in den Tierdaten unter `fotos` steht, wo sie gezeigt werden: Hero (mit Umschalter „3D“ zum Modell), Erkunden (Leuchtpunkte in Prozent auf dem Foto), Jahresrad (Sommer, Winter, Jungtier), Tagesuhr (aktiv, Ruhe), Spuren-Karten und Hinweis. Der Abschnitt „Fotos“ am Ende listet alle Urheber mit Link. Ohne Foto zeigt die Seite automatisch die Zeichnung. Neue Fotos: Lizenz prüfen, nur verkleinern, in `fotos.ts` und `DATENQUELLEN.md` eintragen.

**Jedes Tier ist anders** – die Daten (`src/data/tiere/<art>.ts`) steuern die Besonderheiten:
- Größe über Schulterhöhe (große Tiere) oder Körperlänge (kleine Tiere), Gewicht in kg oder g
- Lebensraum-Landschaft `waldrand`, `wald`, `feld` oder `ufer` – als Bild (Abschnitt „Zuhause“) und als 3D-Hero; Extras im Hero: Bau, Suhle, Biberburg, Kobel, Laubnest
- Winterschlaf/Winterruhe (`ruhe`): das Tier liegt im Jahresrad eingerollt
- Jungtiere mit Flecken (Kitz), Streifen (Frischling) oder dunklem Fell (Welpen)
- Fährte versetzt, geschnürt oder als Sprungspur; eigene Spuren-Karten (Zapfen, Nuss, Suhle, Malbaum, Sanduhr-Nagespur …)
- Hinweis am Ende: Jungtier im Gras („nicht anfassen“) oder Tier auf Abstand, mit Text aus `arten.ts` oder eigenem Text

**Neue Tierart hinzufügen:**
1. In `src/data/tiere/` eine Datei anlegen (Vorlagen: `reh.ts`, `igel.ts`, `biber.ts` …) und in `src/data/tierSeiten.ts` eintragen. Dort stehen Größe, Körperpunkte, Jahreslauf, Tagesrhythmus, Futter, Spuren, Gefahren und der Sicherheits-Hinweis. Neue Fachangaben mit `TODO fachlich prüfen` markieren.
2. Eine Figur zeichnen (in `src/components/tier/figuren/`) und in `TierFigur.tsx` eintragen: Bildausschnitt und Schulterhöhe bzw. Körperlänge.
3. Fehlen Symbole (Futter, Spuren), in `TierSymbol.tsx` ergänzen.
4. Einen Render-Test in `src/app/__tests__/screens.test.tsx` anlegen.

### 8.2 Wild-Wert (`src/logic/wildwert.ts`)
Er setzt sich zusammen aus 55 % Verbreitung (Anteil der Rasterfelder ohne Nachweis), 30 % Seltenheitsstufe und 15 % Rote Liste. Ergebnis ist eine Zahl von 1 bis 100. Weil die Verbreitung Demo-Daten sind, ist auch der Wild-Wert ein **Demo-Wert** und wird so angezeigt.

### 8.3 Deutschlandkarte (`VerbreitungsKarte.tsx`)
- **Untergrund:** Großlandschaften (Tiefland bis Alpen), große Flüsse, Gebirge mit Namen und Waldgebiete.
- **Verbreitung:** 82 Wuchsgebiete als Flächen. Voll gefüllt bedeutet häufig, schraffiert bedeutet vereinzelt.
- **Eigener Standort:** pulsierender Punkt, nur **ungefähr** (ca. 10 km). Ohne gespeicherten Standort steht er in der Mitte des Naturraums.
- Die Flächen sind gröber als Rasterfelder. **Fundorte seltener Arten werden nie genauer gezeigt.**

### 8.4 Katalog
- **Stammbaum** (`Stammbaum.tsx`, Bausteine in `components/stammbaum/`): ein mystischer **Lebensbaum** (eigene Zeichnung, keine Kopie bekannter Motive). **Jede Kategorie hat ihren eigenen Baum** mit eigener Form und Farbwelt; die Geometrie liegt in `logic/baum/` (eine Datei je Baum), die Farben in `components/stammbaum/baumStile.ts` (Tokens in `theme.ts`):
  - **Pflanzen – Silberner Blütenbaum:** geflochtener Stamm, silbergrünes Laub, weiße Blüten, Frühblüher am Boden, fallende Blütenblätter.
  - **Pilze – Myzelbaum:** Pilzstiel mit Knolle und Manschette, Äste enden in Hüten (Kuppel, Schirm, Glocke, Trichter) mit Lamellen, Baumschwämme, leuchtendes Myzel, aufsteigende Sporen.
  - **Vögel – Federbaum im Wind:** Birkenstamm, Federn statt Blätter, Nest mit Eiern, sitzende Vögel, schwebende Federn.
  - **Säugetiere – Uralter Baumhirte:** knorrige Eiche mit Gesicht (Brauen, Augen, die sich öffnen, Nase, Moosbart), Eichenlaub, Eicheln, Farne, Glühwürmchen.
  - Jeder Ast ist mit Schattenseite, Lichtkante und Rindenfurchen gezeichnet. Welche Art wohin gehört, bestimmt `lebensbaum()` in `logic/katalog.ts`.
  - **Knöpfe** an den Astspitzen: gruseliges Symbol je Gruppe mit glimmenden, blinzelnden Augen (`GruppenIcon.tsx`, z. B. Hirschschädel für „Wald“, Totenkopf mit Wurzeln für die Schattenwurzeln) und Fortschrittsring.
  - **Gliederung Rune → Ast → Zweig → Art** (Konzept: `docs/KONZEPT-STAMMBAUM-GLIEDERUNG.md`, feste Reihenfolge in `src/data/gliederung.ts`): höchstens 7 Äste je Baum, jeder Zweig hat 2–12 Arten. Jede Art hängt genau einmal an einem Zweig – auch gefährliche und sehr seltene.
  - **Hauptäste:** Am Baum nur Knopf mit Symbol und Fortschrittsring, **ohne Text** – so überlappt nichts. Ab 5 Ästen fächert der Baum weiter auf (mindestens 66 Punkte zwischen zwei Knöpfen). Jeder Ast hat innerhalb seiner Rune ein eigenes Symbol (neu: Wolf, Igel, Fledermaus, Fink, Pilzbüschel, Baumschwamm, Pusteblume, Orchidee).
  - **Ast-Liste unter dem Baum** (`AstListe.tsx`): je Ast eine Karte mit demselben Symbol, vollem Namen, Fortschritt, Zahl der Zweige und ☾ für Meisteräste (schwer zu finden, z. B. Fledermäuse); darunter die Schattenwurzeln über die ganze Breite. Antippen (Karte oder Knopf) zoomt auf den Ast, darunter wächst er mit seinen **Zweigen** heraus (`AstPanel.tsx`). Es ist immer nur ein Ast offen.
  - **Zweige:** Kopf mit Name, Fortschritt als Balken und einem Hinweis: „Schatz: …“, „Noch 2 – dann blüht der Zweig“ oder „✿ Zweig vollständig“. Darunter die Arten im Raster (4 je Reihe), häufige vorn, seltene hinten. Sehr seltene Arten erscheinen als „???“, bis man sie findet.
  - **Zweig-Schatz** (✦, goldener Rand): die seltenste Art ab „sehr selten“; hat der Zweig keine, eine als besonders markierte Art (`Art.besonders`), sonst die seltenste Art (`zweigSchatz()` in `logic/katalog.ts`).
  - **Sterne über der Krone** = nur noch die legendären Arten (zweite Sicht, sie hängen auch an ihrem Zweig). Matt, bis man sie findet, dann leuchten und funkeln sie.
  - **Schattenwurzeln** = „Gefährlich & tödlich“ (zweite Sicht, die Arten hängen auch an ihrem Zweig, dort mit ☠). Antippen öffnet die Gefahren-Sektion.
  - **Schatzkammer** (Logik fertig: `schatzkammer()`, Anzeige folgt): die 5 seltensten und die 3 gefährlichsten Arten der Rune, nach Gefahrenstufe 1–3 (`Art.gefahrStufe`, sonst aus der Giftigkeit).
  - **Runenring** (selbst erfundene Zeichen) leuchtet in der Farbe des Baums anteilig mit dem Fortschritt der Kategorie.
  - Jede Art hat eine eigene Miniatur (`ArtMiniatur.tsx`). Bei „Bewegung reduzieren“ entfallen Zoom, Wachsen, Funkeln, Teilchen und Augen-Animationen.
- **Mystery-Zone:** Arten ab „sehr selten“ erscheinen als Rätselkarte, bis man sie findet.
- **„Gefährlich & tödlich“** (`GefahrSektion.tsx`, geöffnet über die Schattenwurzeln): dunkle Sektion mit Animation (Dornen wachsen, Augen öffnen sich, Herzschlag-Vibration). Höchstens zwei sanfte Flacker-Blitze, bei „Bewegung reduzieren“ still.
- Die gewählte Ansicht (Wald oder Stammbaum) wird gemerkt.

---

## 9. Fotografieren und Erkennung

### 9.1 Ablauf (`src/app/sammeln/[id].tsx`)
1. Foto mit der Kamera aufnehmen oder aus der Galerie wählen.
2. Prüfen: Die App zeigt die Prüfschritte nacheinander an.
3. Ergebnis:
   - **Treffer** → Art freigeschaltet, Punkte, ggf. Level-Aufstieg, neue Hüttenstufe, Erfolge.
   - **Zu unsicher** → freundliche Bitte um ein besseres Foto, mit Foto-Tipps je Kategorie.
   - **Andere Art erkannt** → Die App sagt, was es vermutlich ist.

Ein Fund zählt nur, wenn die erkannte Art passt **und** die Sicherheit mindestens 0,6 beträgt (`MIN_SICHERHEIT`, mit echten Fotos noch abzustimmen).

### 9.2 Demo und echte Erkennung
| Modus | Gilt für | Wie |
|---|---|---|
| Demo (Standard) | alles | Erkennung wird simuliert, das Foto verlässt das Handy nie. Der Fund wird als `geprueft: 'demo'` gespeichert und ehrlich so angezeigt. |
| Echt | nur **Pflanzen** | Das Foto geht an den **eigenen Server** (`server/`), dieser fragt Pl@ntNet. Pilze, Vögel und Säugetiere bleiben im Demo-Modus. |

Die echte Erkennung ist **standardmäßig aus**. Sie lässt sich erst nach einem Hinweis einschalten, der auch „unter 16: Eltern fragen“ enthält.

### 9.3 Erkennungsserver (`server/`)
- Er ist ein Cloudflare Worker zwischen App und Pl@ntNet. Der **API-Schlüssel liegt nur auf dem Server** und nie in der App.
- In `app.json → extra.erkennungsServer` steht nur die öffentliche Adresse. Zurzeit ist sie leer, die Erkennung ist also noch nicht eingerichtet.
- Der Server speichert keine Fotos und keine IP-Adressen. Ein Gerät darf höchstens 20 Erkennungen am Tag machen, alle zusammen höchstens 450 (die kostenlose Grenze von Pl@ntNet liegt bei 500).
- Gezählt wird über eine zufällige Geräte-ID ohne Bezug zur Person (`geraetId` in den Einstellungen).
- Einrichtung Schritt für Schritt: `server/README.md`. Es braucht ein Pl@ntNet-Konto und ein Cloudflare-Konto, beide fehlen noch.

---

## 10. Speichern, Datenschutz, Schutz der Natur

### 10.1 Was wird gespeichert?
Alles liegt nur auf dem Handy, in AsyncStorage über Zustand mit `persist`.

| Speicher | Datei | Inhalt |
|---|---|---|
| `wildfund-einstellungen` (Version 2) | `src/store/einstellungen.ts` | Naturraum, wie er gewählt wurde, grober Standort (0,1°), Prüfmodus, zufällige Geräte-ID, Demo-Fehlschlag, Katalog-Ansicht, Bildraten-Anzeige, Startszene |
| `wildfund-sammlung` (Version 2) | `src/store/sammlung.ts` | Funde (Datum, Foto-Pfad, Prüfart, Beispiel ja/nein), Punkte (AP), Serie, letzter Fundtag |
| Fotos | App-Ordner `funde` | verkleinerte Fotos **ohne EXIF/GPS** |

Ändert sich der Aufbau eines Speichers, wird `version` erhöht und eine `migrate`-Funktion ergänzt, damit alte Daten weiter funktionieren.

### 10.2 Regeln (nicht verhandelbar)
- Fundorte seltener oder geschützter Arten werden **nie genau** angezeigt oder geteilt, höchstens auf Rasterfeld-Ebene (TK25).
- Geschützte Arten: Auf der Artenseite und beim Sammeln steht „Nur fotografieren – nicht pflücken, nicht fangen, nicht stören.“ Beim Sammeln von Pilzen steht immer: „Pilze niemals essen, wenn sie nicht von Sachverständigen geprüft wurden.“
- Keine Mechanik, die belohnt, Tiere zu verfolgen oder Wege zu verlassen.
- Kein Konto, Daten nur lokal. Den Standort gibt es nur grob und nur mit Zustimmung.
- **API-Schlüssel nie in die App.**
- Kommen später Konten oder Server mit persönlichen Daten dazu: Hinweis auf **DSGVO** und auf die **Einwilligung bei unter 16-Jährigen** (Art. 8 DSGVO). Vor einer Veröffentlichung braucht es eine Datenschutzerklärung, eine rechtliche Prüfung und das Pl@ntNet-Logo.

---

## 11. Technik

### 11.1 Stack
| Bereich | Bibliothek |
|---|---|
| Grundlage | Expo SDK 57, React Native 0.86, React 19.2, TypeScript 6 |
| Navigation | expo-router (typisierte Routen) |
| 3D | @react-three/fiber 9 (native), expo-gl, three 0.186 |
| Zustand | zustand 5 + AsyncStorage |
| Animation/Gesten | react-native-reanimated 4, react-native-gesture-handler |
| Zeichnungen/Karte | react-native-svg, roughjs |
| Gerät | expo-image-picker, expo-location, expo-sensors, expo-haptics, expo-file-system |
| Schriften | Cinzel (Titel, Etiketten, Abzeichen), Alegreya Sans (Text, kursiv für Notizen), Kalam (nur Lehrbuch-Zeichnungen) |

Pakete werden immer mit `npx expo install <paket>` installiert, damit die Version zu Expo passt.

### 11.2 Ordner
| Ordner | Inhalt |
|---|---|
| `src/app/` | Screens (nur Routen), Render-Tests in `__tests__/` |
| `src/components/ui/` | Feste Bausteine des Designsystems: Sektion, Kapitelkopf, Abzeichen, Kennzahl, Schalter, Zierlinie, Schleier (siehe `docs/DESIGNSYSTEM.md`) |
| `src/components/` | UI-Bausteine: Knopf, Schrift, Kopfzeile, Hintergrund, Icons, Miniaturen, Stammbaum, Karte, Lehrbuch-Zeichnung, Gefahr-Sektion |
| `src/scene/` | 3D-Szenen und Diorama |
| `src/logic/` | Rechenlogik mit Tests |
| `src/data/` | Arten, Baumarten, Naturräume, Orte, Karte, Spielregeln, Steckbriefe, Szenen |
| `src/store/` | gespeicherter Zustand |
| `src/theme/theme.ts` | Design-Tokens (Farben, Schriften, Abstände) |
| `server/` | Erkennungsserver (eigene `tsconfig.json`) |
| `scripts/` | Skripte zum Erzeugen von Daten, Icons und Platzhalter-Bildern |
| `assets/` | Icons, Splash, `modelle/` (GLB), `szene/` (Diorama-Bilder) |

### 11.3 Farben (Design-Tokens)
Farbwelt „Hohlweg“: night `#060907` · forest `#101A13` · moss `#4F6B36` · rune (Mooslicht) `#A9BC6A` · fog `#A3B0A5` · moon `#DCE3D6` · amber (Laterne) `#D9A24E` · rare `#A595CC` · legend `#E2B85C`, dazu `nebel` und `sektion`. Für Lehrbuch-Seiten gibt es zusätzlich paper, paperDark, ink und inkFaded. Alle Regeln und Bausteine: **`docs/DESIGNSYSTEM.md`**.

Regel: **Keine Farbwerte direkt in Komponenten**, sondern aus `src/theme/theme.ts`. In den 3D-Szenen stehen gedämpfte Naturfarben gesammelt als Konstante oben in der Datei. **Kein Neongrün.**

### 11.4 Stolperfallen (aus Erfahrung)
- **three.js auf dem Handy:** `metro.config.js` leitet `three` auf `three.module.js` um. Die CommonJS-Datei ruft `process.emitWarning()` auf, und daran stürzt die App ab.
- **Namen von JavaScript-Globals** wie `Symbol` oder `Map` nicht als eigene Namen verwenden. Die Lint-Regel `id-denylist` prüft das; das hat in Phase 2 einen Absturz verursacht.
- **React-Compiler-Lint ist streng:** In 3D-Szenen Werte nur über Refs (`ref.current`), Klassen mit Methoden (`steuerZustand.ts`) oder Hilfsfunktionen außerhalb der Komponente ändern. Nicht über Props oder `useMemo`-Werte.
- **DataTexture:** Zeile 0 liegt unten (v = 0). Wer Texturen im Code malt, darf y nicht umdrehen.
- **mergeGeometries** braucht bei allen Teilen dieselben Attribute. Vorher in nicht-indizierte Geometrie umwandeln und `uv` entfernen (`vereinheitlichen()` in `huettenTeile.ts`).
- **Hermes:** Neuere Array-Methoden wie `toSorted` vermeiden und stattdessen `[...liste].sort()` verwenden.
- **Bewegung reduzieren:** Jede neue Animation muss den `ruhig`-Wert beachten.
- **Antippen:** Deko-Objekte bekommen `raycast = () => {}`, damit sie keine Tipps auf Bäume oder Runen abfangen.

---

## 12. Prüfen und Tests

Vor jedem „fertig“ müssen alle drei Prüfungen ohne Fehler laufen:
```
npx tsc --noEmit      # Typprüfung der App
npx expo lint         # Code-Regeln (inkl. React Compiler, id-denylist)
npm test              # alle Tests (Jest)
```
Für den Server zusätzlich: `npx tsc -p server`.

Stand 15.10.2026: **17 Test-Dateien, 160 Tests**, alle bestanden.

| Test | Prüft |
|---|---|
| `src/app/__tests__/screens.test.tsx` | Jeder Screen wird einmal dargestellt. Die 3D-Szene ist dabei durch eine Attrappe ersetzt, weil es im Test keine Grafikkarte gibt. |
| `src/logic/__tests__/*.test.ts` (14 Dateien) | Regel-Engine, Geo, Ortssuche, Fortschritt, Katalog, Validierung, Tageszeit, Jahreszeit, Wild-Wert, Verbreitung, Lichtung, Lichtungs-Details, Verborgenes, Szenen |
| `src/store/__tests__/sammlung.test.ts` | Fund bringt Punkte, Beispielfunde ohne Punkte, zweites Foto ohne Punkte |
| `server/src/__tests__/logik.test.ts` | Pl@ntNet-Antwort übersetzen, Kontingent pro Gerät und gesamt, Geräte-ID, Tageswechsel |

Formatieren: Prettier mit `.prettierrc` (einfache Anführungszeichen, 120 Zeichen). Formatiert werden **nur geänderte Dateien**:
```
npx prettier --write <datei> <datei> …
```

---

## 13. Skripte (`scripts/`)

| Befehl | Erzeugt |
|---|---|
| `node scripts/naturraeume-bauen.mjs` | `src/data/naturraeume.json` aus Thünen-Wuchsbezirken (lädt aus dem Netz) |
| `node scripts/karte-bauen.mjs` | `src/data/karte.json` (Wuchsgebiete, Großlandschaften, Flüsse) |
| `node scripts/orte-bauen.mjs` | `src/data/orte.json` aus GeoNames |
| `node scripts/icons-bauen.mjs` | App-Icon, Android-Icons, Splash, Favicon aus `assets/icon-quelle/icon.svg` |
| `node scripts/platzhalter-szene.mjs` | Platzhalter-Bilder für das Diorama |
| `python3 scripts/ebenen-freistellen.py <ordner>` | stellt Diorama-Ebenen frei (Magenta-Hintergrund) und komprimiert sie |

---

## 14. Arbeitsablauf mit Git

- Repo: `rosenbursche/Waldfund-NatureGo-`, Branch `main`. Es wird **kein neues Repo** angelegt.
- Nach jedem abgeschlossenen Schritt: alle Prüfungen laufen lassen (Abschnitt 12), dann einen Commit machen:
  ```
  git add -A
  git commit -m "Kurze Beschreibung auf Deutsch"
  ```
- `git push` erst nach **ausdrücklicher Zustimmung**:
  ```
  git push
  ```
- Stand prüfen: `git status`. „voraus N“ bedeutet: N Commits sind noch nicht hochgeladen.
- Neue Wünsche werden in `docs/ANFORDERUNGEN.md` eingetragen, mit Stand.

---

## 15. Offene Punkte (Kurzfassung)

Die vollständige Liste steht in `docs/ANFORDERUNGEN.md`.

| Thema | Stand |
|---|---|
| Bildrate der fein detaillierten Lichtung auf dem Handy | ⬜ prüfen |
| Unterstand (Hüttenstufe 0) fein bauen wie die Blockhütte | ⬜ |
| Echte Bilderkennung | 🔒 Konten bei Pl@ntNet und Cloudflare fehlen |
| Realistische 3D-Modelle (Fuchs-Pilot, echtes Reh), Alters-Regler | 🔒 GLB-Dateien fehlen |
| Diorama mit echten Bildern | 🔒 Bilder aus ChatGPT fehlen |
| Steckbriefe für Pilze und Pflanzen, „Biologie zerlegt“, Zeichnungen für Spuren, Bauten, Nester und Füße | ⬜ |
| Fachliche Prüfung aller Stellen mit `TODO fachlich prüfen` | ⬜ (Naturräume, Baumarten, Schutzstatus, Steckbriefe, Höchstalter, Verbreitung) |
| Vor Veröffentlichung: Datenschutzerklärung, Einwilligung unter 16, Pl@ntNet-Logo | ⬜ |

Grundsatz für Inhalte: **Keine Fakten erfinden.** Ungeprüfte Fachdaten werden im Code mit `// TODO fachlich prüfen` markiert. Texte werden selbst formuliert und nicht aus Wikipedia übernommen.
