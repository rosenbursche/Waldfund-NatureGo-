# Wildfund – Designsystem

Stand: 18.10.2026. Richtung: **Farbwelt „Hohlweg“ + Schrift „Runenhain“**.
Vorlage für alle Seiten ist die **Reh-Seite**. Neue Seiten werden nur aus diesen Bausteinen gebaut.
Im Handy ansehen: **Einstellungen → Darstellung → Bausteine** (`src/app/bausteine.tsx`).

## 1. Stimmung
- Fast schwarzes Waldgrün. Licht fällt nur von oben ein, wie am Ende eines Hohlwegs.
- Moos leuchtet im Licht, Laternenlicht markiert das Wichtigste.
- Viel Dunkel und wenig Licht. Weicher Nebel, dunkle Ränder (Vignette). **Kein Neongrün, kein Türkis.**
- Alle Animationen werden bei „Bewegung reduzieren“ abgeschwächt oder angehalten.

## 2. Farben (`src/theme/theme.ts`)
| Token | Name | Wert | Wofür |
|---|---|---|---|
| `night` | Nacht | `#060907` | Hintergrund |
| `forest` | Tiefgrün | `#101A13` | Flächen |
| `sektion` | – | `#0C140F` (90 %) | Fläche einer Sektion, Wald schimmert durch |
| `moss` | Moos | `#4F6B36` | Rahmen, Linien |
| `rune` | Mooslicht | `#A9BC6A` | Leuchten, Fortschritt, „selten“ |
| `fog` | Nebel | `#A3B0A5` | Nebentext |
| `nebel` | Nebel hell | `#BAC5BB` | Nebelschwaden, Lichtschein |
| `moon` | – | `#DCE3D6` | Haupttext |
| `amber` | Laterne | `#D9A24E` | wichtigste Aktion, Auswahl, Siegel |
| `rare` | – | `#A595CC` | „sehr selten“ |
| `legend` | – | `#E2B85C` | „legendär“ |
| `warn` | – | `#E07A5F` | Gefahren, Gift, Rote Liste 1–3 |

Regeln:
- **Laterne nur für das Wichtigste:** ein Hauptknopf pro Screen, die aktive Option im Schalter, Siegel.
- Die Seltenheit hat immer dieselbe Farbe: häufig = Nebel, selten = Mooslicht, sehr selten = Violett, legendär = Gold (mit Schein).
- Durchsichtigkeit als Hex-Anhang an ein Token (`${colors.moss}AA`), nie als neue Farbe.

## 3. Schrift
| Rolle | Schrift | `Schrift art=` / Token |
|---|---|---|
| Titel, Logo | Cinzel Bold | `titel` · `fonts.titel` |
| Überschrift | Cinzel SemiBold | `ueberschrift` · `fonts.titelLeicht` |
| Etikett, Abzeichen, Zahlen | Cinzel SemiBold, klein, gesperrt, Großbuchstaben | `etikett` · `fonts.etikett` |
| Text | Alegreya Sans | `text`, `klein` · `fonts.body` |
| Notiz, Beschriftung in Grafiken | Alegreya Sans Kursiv | `notiz` · `fonts.notiz` |
| Lehrbuch-Zeichnung auf Papier | Kalam | `fonts.hand` (nur dort) |

Cinzel kennt nur Großbuchstaben-Formen und wirkt deshalb schnell laut. Sie ist für kurze Wörter gedacht (Titel 1–3 Wörter, Etiketten). Längerer Text steht immer in Alegreya Sans.

## 4. Formen und Abstände
- Radien klein (`radius.s 4`, `m 8`, `l 12`), damit Kanten eher geschnitzt als weich wirken.
- Abstände nur aus `spacing` (4 · 8 · 16 · 24 · 32 · 64). Seitenrand 16, Abstand zwischen Sektionen 16.

## 5. Bausteine (`src/components/ui/`)

### Sektion (`Sektion.tsx`)
Der Rahmen für **jeden Abschnitt** einer Seite. Auf den Tierseiten heißt er noch `TierTafel`, das ist derselbe Baustein.
```tsx
<Sektion symbol="rad" titel="Ein Jahr" geste="ziehen">…</Sektion>
<Sektion symbol="wolf" titel="Gefahren" art="warnung" geste="tippen">…</Sektion>
```
- Siegel mit Symbol (doppelter Ring), Titel in Cinzel (1–2 Wörter), rechts Gesten-Hinweis oder `rechts={<Abzeichen …/>}`
- Zierlinie unter dem Kopf, oben ein schwacher Lichtschein, Symbol groß als Wasserzeichen
- `art="warnung"` für Gefahren (rötlicher Rahmen und Siegel)

### Kapitelkopf (`Kapitelkopf.tsx`)
Name einer Seite oder großer Abschnitt: Etikett zwischen zwei Strichen, Titel in Cinzel, Unterzeile kursiv.
```tsx
<Kapitelkopf etikett="Hirsche" titel="Reh" unter="Capreolus capreolus" groesse="gross" />
```

### Abzeichen (`Abzeichen.tsx`)
Kurzer Status in Cinzel, gesperrt, mit Rahmen.
```tsx
<SeltenheitAbzeichen stufe={3} punkte />   // Edelsteine + „Sehr selten · 300 AP“
<SchutzAbzeichen schutz={2} />
<RoteListeAbzeichen stufe="2" />
<Abzeichen text="Gesammelt" farbe={colors.amber} art="voll" />
<Abzeichen text="Neu" farbe={colors.rune} klein />
```
- `art="rand"` (Standard) für Eigenschaften, `art="voll"` nur für den wichtigsten Status
- `leuchten` nur für Legendäres und Belohnungen

### Wappen (`Wappen.tsx`)
Gezeichnete Medaillons. Sie stehen auf **jeder Artenseite** (Hero bzw. Seitenkopf) und beim **Sammeln** nach einem Fund: `WildWertWappen`, `SeltenheitWappen`, `SchutzWappen`, `RoteListeWappen`, `GiftWappen`. `WappenReihe` zeigt alle passenden auf einmal. Jede Art hat eine eigene Form (Kreis, Sechseck, Schild, Stern, Dreieck, Raute), damit sie auch ohne Farbe unterscheidbar ist.
```tsx
<WappenReihe id="reh" art={artById.reh} />
```

### Kennzahl (`Kennzahl.tsx`)
Große Zahl in Cinzel, Einheit klein daneben, Etikett darunter.
```tsx
<Kennzahl wert="60–90" einheit="cm" etikett="Schulter" />
```

### Schalter (`Schalter.tsx`)
Zwei bis vier Optionen mit Symbol. Die gewählte ist mit Laternenlicht gefüllt.
```tsx
<Schalter wahl={g} onWahl={setG} optionen={[{ wert: 'bock', symbol: 'geweih', name: 'Bock' }, …]} />
```

### Knopf (`src/components/Knopf.tsx`)
- `art="haupt"`: mit Laternenlicht gefüllt, **höchstens einmal pro Screen**
- `art="leise"`: dunkel mit Moos-Rahmen, für alles andere

### Zierlinie (`Zierlinie.tsx`)
Linie – Raute – Punkt – Raute – Linie. Trennt Kopf und Inhalt oder zwei Teile einer Seite.

### Schleier (`Schleier.tsx`)
Lichtschein oben und Vignette an den Rändern. Liegt automatisch in `Hintergrund` und `TierHintergrund` und muss nicht selbst eingebaut werden.

### Weitere Bausteine der Tierseite (`src/components/tier/`)
`Leuchtpunkt` (antippbarer Punkt mit Puls), `Fingerflaeche` (Tippen und Ziehen für Rad und Uhr), `TierFoto` / `FotoHero` / `Bildnachweis` (echte Fotos mit Namensnennung).

## 6. Aufbau einer Seite (Vorlage Reh)
1. **Hero** (470 hoch): Foto oder 3D. Unten ein Verlauf ins Dunkel, darauf `Kapitelkopf groesse="gross"` und eine Zeile Abzeichen (Seltenheit, Schutz, Gesammelt).
2. **Sektionen** untereinander, Abstand 16. Jede Sektion hat ein Symbol, einen Titel aus 1–2 Wörtern und einen Gesten-Hinweis, wenn man etwas antippen oder ziehen kann.
3. **Bildnachweis** als letzte Sektion, sobald Fotos vorkommen.

## 7. Noch offen
- Feines Filmkorn über allen Seiten (braucht eine kleine Rausch-Textur)
- „Der Nebel lichtet sich“ beim Freischalten einer Art
- Logo und App-Icon als Siegel neu zeichnen
- 3D-Lichtung (Nebel, Licht) an die neuen Farben angleichen
- Ältere Screens (Katalog, Tagebuch, Sammeln) Schritt für Schritt auf die Bausteine umstellen
