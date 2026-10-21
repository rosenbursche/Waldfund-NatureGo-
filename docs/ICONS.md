# Art-Taler: Icons und Rang-Hierarchie

Jede Art bekommt einen **Taler**: einen runden Rahmen nach Seltenheit, darin ein eigenes, lebendiges Icon.
Code: `src/logic/taler/taler.ts` (Rahmen und Icon als Daten), Icons in `src/data/icons/<artId>.json`.
Vorschau: `node scripts/taler-vorschau.mjs <artId> … [--gross] [--stufe 1-4]` · Zeichenhilfe mit Vorbildern: `scripts/icon_helfer.py` · nach neuen Icons: `node scripts/icons-verzeichnis.mjs`.

## 1. Rang-Embleme (Rahmen)
Alle vier Ränge bilden eine Familie. Sie steigern sich über **Metall, Email-Farbe und Edelstein**, nicht über immer mehr Schmuck.
Farben: `talerRang` in `src/theme/theme.ts`.

| Stufe | Emblem | Schmuck |
|---|---|---|
| 1 häufig | **Kupfer und Patina** (Türkis-Email) | ein kleines Blatt je Seite, kleiner Stein oben, schlichter Anhänger |
| 2 selten | **Bronze und Smaragd** (grünes Email) | drei Blätter je Seite, Blattkamm, Smaragd im Anhänger, leichter grüner Schein |
| 3 sehr selten | **Silber und Amethyst** (violettes Email) | vier Blätter je Seite, Blattkamm, Amethyst, leiser violetter Schein, Funkeln |
| 4 legendär | **Gold und Rubinfeuer** (rotes Email) | wie 3, größerer Rubin, warmer goldener Schein |

Alle haben: geschwungene Metallblätter mit Mittelrippe und Glanzkante, Metallrand mit Glanzstreifen, ein Email-Band mit eingravierter Ranke, Perlen auf dem Rand und einen Innenrand, der in der Rangfarbe leuchtet.

Zustände:
- **gefunden:** Icon in Farbe.
- **noch nicht gefunden:** das Icon in Farbe unter einem leichten Nachtschleier (gewünscht: Icons sollen immer sichtbar sein). Das Emblem bleibt sichtbar, damit man den Wert erkennt.
- **Mystery** (verborgen): „?“.
- In der App: `<ArtTaler id seltenheit zustand groesse />` (`src/components/taler/ArtTaler.tsx`). Er steht überall, wo Arten erscheinen: Stammbaum (Äste, gefundene Sterne), Suche, Tagebuch (als Abzeichen auf dem eigenen Foto), Sammeln (nach dem Fund), Artenseite (unter dem Titel), Artverweise, Gefahren und Fressfeinde.

## 2. Icon-Stil (für alle Arten gleich)
- **Raster** 120 × 120, Mitte 60/60. Das Icon liegt in der Scheibe mit Radius 41 (alles außerhalb wird abgeschnitten).
- **Bildausschnitt**
  - Säugetiere und Vögel: **Kopf-Porträt**, Kopf und Hals oder Brust, schräg von vorn (3/4), Blick nach links.
  - Pilze: der ganze Fruchtkörper.
  - Blumen: Blüte groß, dazu typisches Blatt.
  - Bäume: **Blatt mit Frucht** (Eichenblatt mit Eichel, Buchenblatt mit Buchecker, Nadelzweig mit Zapfen).
  - Das wichtigste Merkmal muss auch bei **44 px** erkennbar sein (Ohren, Schnabelform, Hutfarbe, Blütenform).
- **Ebenen** (von hinten nach vorn), jede mit `rolle`:
  1. `detail`: weicher **Hintergrund** je Kategorie (Wald, Boden, Licht, Himmel), ohne Kontur, gedämpfte Grüntöne
  2. `form`: Grundformen mit **Tinten-Kontur** `#1A120C`, Breite 1,6. Das ergibt den Umriss für die Silhouette.
  3. `schatten`: dunklere Flächen **unten rechts**, ohne Kontur
  4. `licht`: hellere Flächen **oben links**, ohne Kontur
  5. `detail`: Augen mit **Glanzlicht**, Nase, Fellstriche, Blattadern, Staubgefäße, Flocken (feine Linien 0,6–1,0)
- **Licht kommt immer von oben links.**
- **Farben:** naturgetreu nach Referenzfotos, je Art höchstens etwa 10 Farbtöne. Jeweils Grundfarbe, Schatten (etwa 35 % dunkler) und Licht (etwa 25 % heller). Kein Neon und keine reinen Farben (#FF0000).
- **Lebendig:** Augen immer mit Glanzlicht, leichte Bewegung (geneigter Kopf, gebogener Stängel), dazu ein Detail, das nur diese Art hat.
- **Nicht:** Text, Comic-Gesichter bei Pflanzen und Pilzen, Strichmännchen, Clipart-Glanz.

## 3. Datenformat `src/data/icons/<artId>.json`
```json
{ "id": "reh",
  "ebenen": [
    { "d": "M…Z", "f": "#16261B", "rolle": "detail" },
    { "d": "M…Z", "f": "#A0602F", "s": "#1A120C", "sw": 1.6, "rolle": "form" },
    { "d": "M…Z", "f": "#6B3B1C", "o": 0.9, "rolle": "schatten" }
  ],
  "quellen": [{ "titel": "Referenzfoto …", "url": "https://commons.wikimedia.org/…" }] }
```

## 4. Prüfregeln (für Prüf-Agenten)
1. **Arttreue:** Stimmen Form, Proportionen, Farben und Kennmerkmal mit den Referenzfotos überein? Ist die Art nicht mit einer ähnlichen verwechselbar (Stieleiche ↔ Traubeneiche, Amsel ↔ Star, Fliegenpilz ↔ Kaiserling)?
2. **44-px-Test:** Ist die Art in der kleinen Ansicht erkennbar?
3. **Silhouette:** Ist der Umriss allein erkennbar und stimmig?
4. **Einheitlichkeit:** Gleiche Konturstärke, gleiches Licht, gleiche Hintergrundart, ähnliche Füllung der Scheibe wie bei den anderen Icons der Reihe (Kontaktbogen mit `--alle` ansehen).
5. **Sauberkeit:** keine Lücken, keine Kanten, die aus der Form ragen, keine überlappenden Konturen an falscher Stelle.
