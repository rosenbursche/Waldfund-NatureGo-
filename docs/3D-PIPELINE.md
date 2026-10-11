# Realistische 3D-Modelle – Vorgaben und Fuchs-Pilot

Ziel: realistische Modelle von Tieren, Pflanzen und Pilzen mit Animationen und Alters-Stufen, die in der App (Expo + react-three-fiber) laufen. Übersicht aller Anforderungen: `docs/ANFORDERUNGEN.md`.

## 1. Rechte zuerst

- **Keine fremden Renders oder Fotos** als Vorlage für Bild-zu-3D verwenden, ohne die Rechte zu haben. Das gilt besonders für Renders kommerzieller 3D-Modelle aus Shops.
- Sichere Wege: **eigene Fotos**, Fotos unter freier Lizenz (CC0/CC BY), **reine Text-Prompts** oder **Modelle kaufen**, deren Lizenz die Nutzung in einer App erlaubt.
- Bei generierten Modellen die Nutzungsbedingungen des Werkzeugs prüfen (kommerzielle Nutzung, Namensnennung).
- Quelle und Lizenz jedes Modells in `DATENQUELLEN.md` eintragen.

## 2. Technische Vorgaben (für alle Modelle)

| Punkt | Vorgabe |
|---|---|
| Format | **GLB** (glTF binär), Animationen eingebettet |
| Dreiecke | **15.000–30.000** pro Modell (Welpen/Pilze eher 10–15k) |
| Texturen | **2048 × 2048**, PBR: Farbe, Normal, Rauheit · Fell als Textur, keine Haar-Geometrie |
| Licht | kein eingebranntes Licht oder Schatten in der Textur |
| Pose | neutrale Stand-Pose, alle Füße am Boden, Kopf geradeaus |
| Maßstab/Lage | Füße auf y = 0, Mittelpunkt im Ursprung, Blick in **+Z** |
| Skelett (Tiere) | Vierbeiner-Rig mit eigenen Knochen für **beide Ohren, Kiefer, Schwanz (4–6 Glieder)** |
| Skelett (Vögel) | Flügel, Kopf/Hals, Schwanzfedern, Beine; optional Federhaube |
| Alters-Stufen | **gleiche Pose, Ausrichtung, gleicher Stil** wie das Grundmodell (für weiches Überblenden) |

## 3. Ablage im Projekt

```
assets/modelle/<art-id>/
  <art-id>_0.glb        jüngste Stufe
  <art-id>_05.glb       …
  <art-id>.glb          erwachsen (Grundmodell)
  <art-id>_alt.glb      alt
```

## 4. Animationen – Namen in der GLB-Datei

| Name | Tiere | Vögel | Länge |
|---|---|---|---|
| `idle` | Atmen, Gewicht verlagern | Atmen, kleines Kopfnicken | 4 s, Schleife |
| `ohren` | Ohren zucken/drehen einzeln | – | 2 s |
| `schwanz` | Schwanz schwingt | Schwanzfedern wippen | 3 s, Schleife |
| `umsehen` | Kopf links/rechts | Kopf ruckartig drehen | 3 s |
| `schnuppern` | Nase am Boden | – | 3 s |
| `putzen` | – | Gefieder mit dem Schnabel putzen | 3 s |
| `schuetteln` | Fell schütteln | Gefieder aufplustern und schütteln | 1,5 s |
| Spezial | z. B. Fuchs `maeusesprung` | z. B. Specht `trommeln` | 2 s |

Die App wählt zufällig zwischen den kurzen Abläufen und kehrt immer zu `idle` zurück.

## 5. Ablauf

1. Grundmodell erzeugen (Meshy oder Tripo) **oder** lizenziertes Modell kaufen.
2. In **Blender** aufräumen: auf die Dreieckszahl verkleinern, Texturen 2048, Pose und Lage nach Tabelle 2.
3. **Rigging**: Werkzeug-Auto-Rig nur verwenden, wenn es Vierbeiner/Vögel sauber unterstützt, sonst Blender.
4. **Animationen** nach Tabelle 4 erstellen bzw. übernehmen.
5. **Alters-Stufen** mit dem Render des Grundmodells als Referenz erzeugen (gleiche Pose).
6. Als GLB exportieren und in `assets/modelle/<art-id>/` ablegen.
7. In der App testen: Dateigröße, Ladezeit, **Bildrate** auf einem Mittelklasse-Handy.

---

## 6. Pilot: Rotfuchs (Vulpes vulpes)

### 6.1 Alters-Stufen (fachlich gegenprüfen)

Füchse werden in freier Wildbahn meist nur wenige Jahre alt. Welpen kommen blind und dunkel graubraun zur Welt, das rote Fell kommt nach einigen Wochen, nach etwa einem halben Jahr sind sie fast ausgewachsen.

| Stufe | Datei | Alter | Sichtbare Merkmale |
|---|---|---|---|
| 0 | `fuchs_0.glb` | ca. 2 Wochen | winzig, rund, großer Kopf, Augen gerade offen (blaugrau), dunkelgraubraun, Ohren halb gefaltet |
| 0,5 | `fuchs_05.glb` | ca. 5 Wochen | erstes Rot im Gesicht, Ohren aufgerichtet, Augen werden bernsteinfarben |
| 0,75 | `fuchs_075.glb` | ca. 3 Monate | schlaksig, lange Beine, sehr große Ohren, schon rötlich |
| 1 | `fuchs_1.glb` | ca. 7 Monate | fast ausgewachsen, Fell wie erwachsen, etwas schlanker |
| 2–5 | `fuchs.glb` | erwachsen | Grundmodell |
| 6+ | `fuchs_alt.glb` | alt | graue Schnauze, dünneres, verblasstes Fell, hagerer |

### 6.2 Prompt – Grundmodell (erwachsen)

```
Photorealistic adult European red fox (Vulpes vulpes), full body, standing in a
neutral four-legged pose, all paws on the ground, head facing forward, bushy tail
held slightly away from the body.
Anatomy: slender body, long thin legs, narrow pointed muzzle, large upright
triangular ears with black backs, amber eyes with vertical slit pupils, black nose,
whiskers.
Fur: rusty orange-red coat on back and flanks, white chin, throat and chest,
grey-white belly, dark brown to black "stockings" on lower legs and paws, black
ear backs, very bushy tail with darker tip area and a white tail tip.
Fur rendered as detailed texture with short directional strands, not as
separate hair geometry. Natural, slightly wild look, not cartoon, not stylized.
Game-ready asset for mobile: clean quad-based topology, 20k triangles, PBR
textures 2048 (albedo, normal, roughness), single UV set, neutral lighting baked
out (no shadows in the texture), centered at origin, feet on ground plane.
```

**Negativ-Prompt:**
```
cartoon, stylized, anime, toy, plush, extra legs, extra tail, fused legs, open
mouth, sitting pose, lying pose, baked shadows, hair cards, fur geometry, ground plane,
background, text, watermark
```

### 6.3 Prompts – Alters-Stufen

Immer den **Render des fertigen Grundmodells als Referenzbild** mitgeben.

**Stufe 0 – ca. 2 Wochen**
```
Same species, same art style, same neutral standing pose and orientation as the
reference. Red fox cub about 2 weeks old: very small and round, oversized head,
short stubby legs, short rounded ears still half folded, short muzzle, eyes just
opened and blue-grey, fluffy short coat in uniform dark grey-brown (chocolate
colored), no red fur yet, short thin tail. Game-ready, 15k triangles, PBR 2048.
```

**Stufe 0,5 – ca. 5 Wochen**
```
Same pose and style as reference. Red fox cub about 5 weeks old: still small and
fluffy, big head, upright ears growing, muzzle getting longer, first reddish-tan
fur on the face and legs, body still mostly grey-brown, eyes turning from blue to
amber, short fluffy tail. Game-ready, 15k triangles, PBR 2048.
```

**Stufe 0,75 – ca. 3 Monate**
```
Same pose and style as reference. Juvenile red fox about 3 months old: lanky body
with long thin legs, ears look very large for the head, slim muzzle, coat already
reddish-orange but less dense, white throat visible, dark leg stockings starting,
tail bushier but shorter than an adult's. Game-ready, 18k triangles, PBR 2048.
```

**Stufe 1 – ca. 7 Monate**
```
Same pose and style as reference. Young red fox about 7 months old: nearly adult
size and proportions, full rusty-red coat, white chin and chest, black leg
stockings and ear backs, bushy tail with white tip, slightly slimmer than the
adult reference. Game-ready, 20k triangles, PBR 2048.
```

**Stufe 6+ – alt**
```
Same pose and style as reference. Old red fox: same size as adult, slightly bony
and lean body, greying muzzle and face, coat less dense and a little faded, some
grey hairs on the back, tail still bushy but thinner. Game-ready, 20k triangles,
PBR 2048.
```

### 6.4 Animationen für den Fuchs
`idle`, `ohren`, `schwanz`, `umsehen`, `schnuppern`, `schuetteln`, `maeusesprung` (Welpen: `idle`, `ohren`, `schwanz`).

### 6.5 Was die App dafür baut (sobald GLB-Dateien da sind)
- GLB-Lader (offline aus dem Projekt bzw. später herunterladbar)
- Animations-Wechsel mit Rückkehr zu `idle`
- LiDAR-Enthüllung mit dem echten Modell
- Alters-Regler mit weichem Überblenden zwischen den Stufen, Beschriftung „Lebensjahr“
- Messung von Dateigröße, Ladezeit und Bildrate
