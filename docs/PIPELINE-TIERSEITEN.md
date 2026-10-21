# Agenten-Pipeline für Tierseiten

Ziel: Jede Tierseite wird nach dem Vorbild der **Reh-Seite** gebaut, aber mit **echten, belegten Daten**
und **echten Fotos**: keine Demo-Werte, keine gewürfelten Karten, keine erfundenen Fakten.

Start in Claude Code: **`/tierseite <artId>`**, z. B. `/tierseite wildschwein`.
Die Pipeline arbeitet eine Art nach der anderen ab. Danach hält sie an und zeigt das Ergebnis zur Abnahme.

## Ablauf

```
             ┌──────────────────────┐
  /tierseite │ 1  tier-recherche    │  Fakten mit Quellen, Besonderheiten → recherche/<id>/fakten.json
             └──────────┬───────────┘
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│2 tier-       │ │3 tier-bilder │ │4 tier-spuren │   laufen parallel
│  verbreitung │ │  echte Fotos │ │  echte Form  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       └────────────────┼────────────────┘
                        ▼
             ┌──────────────────────┐
             │ 5  tier-pruefer      │  prüft jede Angabe unabhängig gegen ihre Quelle
             └──────────┬───────────┘
                        ▼
             ┌──────────────────────┐
             │ 6  tierseite-bauer   │  schreibt src/data/tiere/<id>.ts, Checks, Commit auf Branch
             └──────────────────────┘
```

| Agent | Datei | Aufgabe | Ergebnis |
|---|---|---|---|
| tier-recherche | `.claude/agents/tier-recherche.md` | liest Art und vorhandene Daten, recherchiert Fakten aus Fachquellen, schlägt Besonderheiten und zusätzliche Kapitel vor | `fakten.json`, `fakten.md` |
| tier-verbreitung | `.claude/agents/tier-verbreitung.md` | holt Nachweise aus GBIF (`scripts/gbif-verbreitung.mjs`), gleicht sie mit Fachkarten (BfN, Länder) ab, schließt Ausreißer begründet aus | `src/data/nachweise/<id>.json`, `verbreitung.md` |
| tier-bilder | `.claude/agents/tier-bilder.md` | sucht für **jeden Bildplatz** der Seite das passende echte Foto: richtige Art, Jahreszeit, Fellzustand, Region. Sieht jedes Foto an, bevor es genommen wird | `bilder.json`, Fotos in `assets/fotos/<id>/` |
| tier-spuren | `.claude/agents/tier-spuren.md` | sieht sich echte Trittsiegel (Fotos, Fachzeichnungen) an und zeichnet die Form maßstabsgetreu als SVG-Pfad nach, dazu Schrittlänge und Spurbreite | `spuren.json` |
| tier-pruefer | `.claude/agents/tier-pruefer.md` | prüft alle Angaben unabhängig: Stimmt die Quelle? Passt das Foto zum Bildplatz? Passt die Karte? | `pruefung.md` |
| tierseite-bauer | `.claude/agents/tierseite-bauer.md` | setzt alles in `src/data/tiere/<id>.ts` um, prüft mit tsc/lint/test | Commit auf Branch `tierseite/<id>` |

## Ablage je Art: `recherche/<artId>/`
| Datei | Inhalt |
|---|---|
| `fakten.json` | strukturierte Daten (Aufbau siehe unten), jede Angabe mit `quelle` |
| `fakten.md` | Recherche-Notizen in eigenen Worten, Besonderheiten, Vorschläge für zusätzliche Kapitel |
| `verbreitung.md` | GBIF-Abruf, Abgleich mit Fachkarten, ausgeschlossene Rasterfelder mit Begründung |
| `bilder.json` | Bildplatz → gewähltes Foto, warum es passt, verworfene Kandidaten mit Grund |
| `bilder/<platz>/` | Vorschaubilder der Kandidaten (nicht ins Repo, steht in `.gitignore`) |
| `spuren.json` | Trittsiegel-Pfade, Maße, Fährten-Muster, Referenzen |
| `pruefung.md` | Ergebnis des Prüfers: bestätigt / korrigiert / offen |

### Aufbau `fakten.json`
```jsonc
{
  "artId": "wildschwein",
  "quellen": [{ "id": "q1", "titel": "…", "herausgeber": "…", "url": "…", "art": "Behörde|Fachbuch|Wissenschaft|Verband", "abgerufen": "2026-10-18" }],
  "groesse": { "mass": "schulter", "cm": [80, 110], "gewicht": [50, 150], "einheit": "kg", "quelle": ["q1"] },
  "aktivitaet": { "phasen": [{ "von": 18, "bis": 6, "staerke": 2 }], "hinweis": "…", "quelle": ["q2"] },
  "jahr": [{ "id": "rauschzeit", "kurz": "Paarungszeit", "monate": [11, 12, 1], "quelle": ["q1"] }],
  "fell": { "monate": [0,0,0,0.5,1,1,1,1,0.5,0,0,0], "beschreibung": "…", "quelle": ["q3"] },
  "jung": { "name": "Frischling", "sichtbar": [3,4,5,6,7,8], "merkmal": "streifen", "merkmalMonate": [3,4,5,6], "quelle": ["q1"] },
  "nahrung": [{ "kurz": "Eicheln", "monate": [9,10,11,12], "anteil": "hoch", "quelle": ["q4"] }],
  "spuren": [{ "art": "tritt", "kurz": "Trittsiegel mit Afterklauen", "cm": [5, 7], "quelle": ["q5"] }],
  "gefahren": [{ "kurz": "Wolf", "nurJung": false, "quelle": ["q6"] }],
  "lebensraum": { "landschaft": "waldrand", "orte": ["…", "…", "…"], "tag": 0, "nacht": 2, "quelle": ["q1"] },
  "besonderheiten": [{ "titel": "Suhlen", "warum": "…", "kapitelVorschlag": "…", "bildplatz": "suhle", "quelle": ["q1"] }]
}
```
Fehlt eine sichere Angabe: Feld weglassen und in `fakten.md` unter **„Offen“** notieren. Nie schätzen oder erfinden.

## Bildplätze der Seite
Der Bilder-Agent sucht für jeden Platz ein eigenes, **inhaltlich passendes** Foto:

| Platz | Was das Foto zeigen muss |
|---|---|
| `hero` | das erwachsene Tier, gut erkennbar, ansprechend, Querformat oder breit genug |
| `erkunden.maennlich/weiblich/alle` | ganzes Tier seitlich, alle Körpermerkmale aus `koerper` sichtbar (Punkte werden darauf gesetzt) |
| `jahreszeiten.fruehling/sommer/herbst/winter` | Tier **in genau dieser Jahreszeit** (Vegetation, Schnee, Laubfarbe, Fellzustand passen) |
| `fellwechsel` | Tier sichtbar im Fellwechsel (struppig, zweifarbig) |
| `jung` | Jungtier mit seinem typischen Merkmal (Flecken, Streifen …) im passenden Alter |
| `aktiv` / `ruhe` | typische Haupttätigkeit (äsen, wühlen, jagen) bzw. Ruhen |
| `spuren.<art>` | echtes Trittsiegel, Losung, Fraßspur … der Art (keine verwechselbare Art) |
| `hinweis` | passt zum Sicherheits-Hinweis (z. B. Jungtier im Versteck, Tier auf Abstand) |
| `lebensraum.panorama` + `orte` | echte Landschaft des Lebensraums (Mitteleuropa), dazu Nahfotos der drei Orte |

Prüfregeln für jedes Foto:
1. **Richtige Art.** Keine Haustiere (Hausschwein, Hauskatze), keine Gehegetiere mit Zaun, keine Unterarten anderer Kontinente.
2. **Passender Zustand.** Jahreszeit, Fell, Alter und Tätigkeit passen zum Bildplatz. Ein Sommerbild steht nie im Winter.
3. **Region.** Bevorzugt Deutschland und Mitteleuropa.
4. **Qualität.** Scharf, Tier gut sichtbar, mindestens 1000 px breit.
5. **Lizenz.** Nur CC0, gemeinfrei, CC BY, CC BY-SA. Fotos nur verkleinern, nie beschneiden oder verändern.

## Verbreitung
- Quelle: **GBIF.org**, nur freie Datensätze (CC0, CC BY 4.0), ohne Museums- und Zoobelege (Filter `basisOfRecord`, einzelne Wildpark-Meldungen bleiben möglich), ab dem Jahr 2000.
- Raster: TK25-Messtischblatt (10′ × 6′), genau wie die App-Karte. **Genauer wird nie gespeichert.**
- Der Agent gleicht mit Fachkarten ab (BfN FFH-Bericht, Landesämter, Fachliteratur), schließt Ausreißer (Wildparks, Verwechslungen) mit `--ohne` aus und begründet das in `verbreitung.md`.
- Vor einer Veröffentlichung: GBIF-Download mit DOI anlegen und in der App zitieren.

## Spuren
- Untergründe in der App: **Schnee** und **Matsch**.
- Form des Trittsiegels: Der Agent sieht sich mindestens drei echte Referenzen an (Fotos auf Commons, Bestimmungsliteratur) und zeichnet Vorder- und Hinterfuß als **SVG-Pfad** im Raster −15 … 15 nach (Spitze oben, 30 Einheiten = Länge des Trittsiegels).
- Zur Kontrolle rendert er seine Zeichnung (`node scripts/spur-vorschau.mjs <artId>`) und vergleicht sie neben der Referenz.
- Fährte: Schrittlänge und Spurbreite in cm aus Quellen. Gangarten nur, wenn belegt.

## Qualitätsregeln (für alle Agenten)
- **Keine Fakten erfinden.** Jede Zahl und jede Monatsangabe braucht eine Quelle. Widersprechen sich Quellen, gilt die Spanne, und der Widerspruch wird notiert.
- Bevorzugte Quellen: BfN, Landesumwelt- und Forstbehörden, Wildtier-Informationssystem der Länder (WILD), Deutsche Wildtier Stiftung, Senckenberg, Fachbücher, wissenschaftliche Artikel. Wikipedia nur als Wegweiser zu Quellen, **nie Text übernehmen**.
- Alle Texte in eigenen, kurzen Worten (die Seite hat 2–4-Wort-Beschriftungen).
- Schutzregeln aus CLAUDE.md gelten: keine genauen Fundorte, keine Mechanik, die Verfolgen von Tieren belohnt.
- Neue Fotos und Daten stehen immer in DATENQUELLEN.md.
