# Startszene als 2,5D-Diorama – Prompts für ChatGPT

Pilot: **Lüneburger Heide in der Dämmerung.** Übersicht aller Anforderungen: `docs/ANFORDERUNGEN.md`.

## Prinzip

Die Startszene besteht aus **übereinanderliegenden Bildebenen**. Beim Kippen des Handys verschieben sie sich unterschiedlich stark – das wirkt räumlich. Nebel, Glühwürmchen, Lichtstrahlen, Rauch, Laternenflackern und die Runensteine kommen **aus dem Code** dazu (deshalb gehören sie nicht ins Bild).

```
Ebene 0  Himmel        Mond, erste Sterne, Abendrot am Horizont
Ebene 1  Ferne         flacher Waldrand am Horizont, Nebelbänke
Ebene 2  Mittelgrund   Heide mit Wacholder, Birken, Kiefern
Ebene 3  Lichtung      sandige Lichtung, Weg, kleiner Moortümpel
Ebene 4  Hütte         je Ausbaustufe ein eigenes Bild (Unterstand … Sternwarte)
Ebene 5  Vordergrund   Kiefernstamm links, Eichenzweige oben, Farn und Heidekraut unten
```

## Fachlich passend zur Lüneburger Heide

Flach (keine Berge, kein Wasserfall), Wacholderheide, blühende Besenheide (lila, Aug–Sep), Waldkiefern, Stieleichen, Sandbirken, sandige Wege, Moorbirken an nassen Stellen. *(TODO fachlich prüfen: Gesamteindruck von einer Fachperson bestätigen lassen.)*

## Technische Vorgaben (bei jedem Bild)

- **Hochformat 1024 × 1536** („portrait“ in ChatGPT)
- Gleicher Bildausschnitt, gleiche Perspektive, gleiches Licht wie das Hauptbild
- Oben etwa 18 % und unten etwa 15 % ruhig halten (dort liegen die Anzeigen der App)
- **Wichtiges in die Mitte:** Handys sind schmaler als 2:3, links und rechts werden je etwa 18 % abgeschnitten. Hütte, Weg und Tümpel gehören in die mittleren 60 % der Breite; der Kiefernstamm „am linken Rand“ sollte etwa bei einem Fünftel der Breite stehen.
- **Keine Runensteine, keine Tiere, keine Menschen, kein Text, keine Bedienelemente** im Bild
- Für freigestellte Ebenen: **reiner, flacher Magenta-Hintergrund `#FF00FF`** (ich mache ihn per Skript durchsichtig). Kein Schatten, kein Verlauf im Magenta.

---

## Schritt 1 – Hauptbild

Dein Referenzbild (Stil) mit hochladen und diesen Text verwenden:

```
Create a vertical 1024x1536 image. Use the uploaded image only as a STYLE reference
(mood, painterly-photorealistic detail, color grading, soft volumetric light), not
for the landscape itself.

Scene: a hidden clearing at the edge of the Lüneburg Heath in northern Germany at
dusk. The landscape is completely FLAT – no mountains, no waterfall, no cliffs.
Center of the image (slightly below the middle): a small, old wooden forest hut with
a moss-covered roof, warm amber light glowing from a small window, a thin line of
smoke rising from a stone chimney.
Around the clearing: Scots pines with reddish upper trunks, gnarled pedunculate oaks,
slender silver birches, dark columnar juniper bushes scattered across the heath,
blooming purple heather (Calluna) on sandy ground. A sandy footpath leads from the
bottom of the image to the hut. To the lower right a small dark bog pool with downy
birches. In the far background a flat, low line of forest on the horizon with soft
bands of mist.
Sky: deep blue-green dusk, first stars, a pale rising moon, a faint warm afterglow
on the horizon.
Light and mood: mysterious, calm, magical but natural; soft fog between the trees;
colors muted dark green, teal, moonlight blue with warm amber accents. No neon colors.
Foreground framing: a tall pine trunk on the left edge, oak twigs at the top right,
ferns and heather in the bottom corners.
Keep the top 18% (sky) and the bottom 15% (foreground) calm and uncluttered.
Do NOT include: animals, people, text, logos, user interface, rune stones, glowing
symbols, mountains, waterfalls.
```

Wenn dir das Ergebnis gefällt: als **Hauptbild** speichern. Alle weiteren Schritte sind **Bearbeitungen dieses Bildes** (im selben ChatGPT-Chat), damit Ausschnitt und Licht gleich bleiben.

---

## Schritt 2 – Ebenen aus dem Hauptbild

Jeweils im selben Chat, Hauptbild ist ausgewählt:

**Ebene 0 – Himmel**
```
Edit this image: keep ONLY the sky (stars, moon, afterglow). Replace everything
else – horizon, trees, hut, ground, foreground – with the same sky continued
naturally downward, as if the landscape did not exist. Same size, same colors.
```

**Ebene 1 – Ferne**
```
Edit this image: keep ONLY the distant flat forest line on the horizon and the mist
bands in front of it. Make the sky pure flat magenta #FF00FF. Everything closer than
the distant forest line (heath, bushes, trees, hut, clearing, foreground) must also
be pure flat magenta #FF00FF. No shadows or gradients in the magenta.
```

**Ebene 2 – Mittelgrund**
```
Edit this image: keep ONLY the heathland in the middle distance – juniper bushes,
birches, pines and oaks around the clearing, with the mist between them. Remove the
hut and fill its place naturally with heath and trees. Make the sky, the distant
horizon and the near foreground (bottom framing plants, left pine trunk, top right
oak twigs) pure flat magenta #FF00FF.
```

**Ebene 3 – Lichtung**
```
Edit this image: keep ONLY the ground of the clearing – the sandy path, heather,
the small bog pool with its reflections. Remove the hut and fill the ground where it
stood naturally (sand, grass, a few stones). Everything above the ground (trees,
sky, horizon) and the foreground framing plants must be pure flat magenta #FF00FF.
```

**Ebene 4 – Hütte (Stufe 1: Waldhütte)**
```
Edit this image: keep ONLY the wooden hut with its mossy roof, glowing window,
chimney and the small patch of ground directly under it. Everything else must be
pure flat magenta #FF00FF. Do not include the smoke (it is added by the app).
```

**Ebene 5 – Vordergrund**
```
Edit this image: keep ONLY the near foreground framing – the tall pine trunk on the
left edge, the oak twigs at the top right, the ferns and heather in the bottom
corners. Everything else must be pure flat magenta #FF00FF.
```

---

## Schritt 3 – Weitere Hütten-Stufen (später)

Auf Basis von Ebene 4, gleiche Position und Größe am Boden:

```
Edit this image: replace the hut with [VARIANTE], standing exactly on the same spot,
same perspective, same lighting, same painterly style. Background stays pure flat
magenta #FF00FF.
```
- Stufe 0: `a simple open wooden shelter with a slanted mossy roof on four posts, a lantern hanging inside, a small campfire in front`
- Stufe 2: `a larger forester's lodge with a small side annex, a stack of firewood and a lantern at the door`
- Stufe 3: `the hut with a round stone tower next to it, topped by a small observatory dome with a telescope and a faint teal glow`

## Schritt 4 – Tageszeiten (später)

Hauptbild bearbeiten: „Same image, same composition, but at [early morning with thick ground mist and soft cold light / daylight under a soft overcast sky / golden hour with warm low sun from the left / full moonlit night with many stars]“ – dann die Ebenen wie in Schritt 2.

---

## Ablage

Speichere die Bilder (PNG, so wie ChatGPT sie liefert) hier:

```
assets/szene/heide-daemmerung/
  hauptbild.png
  0-himmel.png
  1-ferne.png
  2-mittelgrund.png
  3-lichtung.png
  4-huette-1.png
  5-vordergrund.png
```

Danach (macht Claude, oder selbst im Terminal):

```
python3 scripts/ebenen-freistellen.py assets/szene/heide-daemmerung
```

Das macht das Magenta durchsichtig, entfernt den pinken Saum, speichert kleine WebP-Dateien in `assets/szene/heide-daemmerung/fertig/` und legt eine `vorschau.png` mit allen Ebenen übereinander an. Anschließend wird in `src/data/szenen.ts` eine neue Szene mit diesen Dateien eingetragen und die Punkte (Schornstein, Fenster, Tümpel, Runensteine) auf das echte Bild angepasst.

Bis dahin zeigt die App selbst gezeichnete Platzhalter (`scripts/platzhalter-szene.mjs`). Umschalten zwischen Diorama und 3D-Lichtung: Einstellungen → Darstellung.

## Rechtliches
- ChatGPT-Bilder: Nutzungsbedingungen von OpenAI prüfen (insbesondere für eine spätere Veröffentlichung) und in `DATENQUELLEN.md` vermerken.
- Das Referenzbild nur als Stilvorlage verwenden, nicht nachbauen lassen.
