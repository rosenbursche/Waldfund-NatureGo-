# Konzept: die lebendige Tierseite

Branch: `feature/tierseite-lebendig` · Stand 18.10.2026 · Code: `src/app/konzept.tsx`, Bausteine in `src/components/lebendig/`
Ansehen: Reh oder Rotfuchs öffnen → Knopf **„Lebendig ✦“** im Foto oben.

## Problem
Die grafische Tierseite ist informativ, wirkt aber statisch: Jede Sektion ist ein gleicher Kasten, Fotos sind klein darin eingesetzt, Bewegung gibt es kaum. Man liest die Seite eher, als sie zu erleben.

## Idee: Die Seite erzählt, statt aufzulisten
Die Inhalte bleiben dieselben (gleiche Tierdaten, gleiche Sektionen). Es ändert sich, **wie** sie gezeigt werden.

### 1. Kapitel statt Kästen
- Jede Sektion wird ein **Kapitel** über die volle Breite: römische Zahl, großer Titel in Cinzel, eine kurze Zeile darunter („Wer ist hier entlanggelaufen?“).
- Kein Rahmen. Fotos laufen bis an den Bildschirmrand und gehen weich ins Dunkel über.
- Beim Hineinscrollen blendet ein Kapitel ein und gleitet nach oben. Die Seite „öffnet“ sich beim Lesen.

### 2. Echte Fotos sind die Bühne
- Fotos werden nicht als Kärtchen eingesetzt. Sie tragen den Abschnitt: Hero über ~80 % der Bildschirmhöhe, Jahreszeiten als ganze Seiten, Spuren als Abzüge auf dem Forschertisch.

### 3. Bewegung, die etwas bedeutet
| Bewegung | Bedeutung |
|---|---|
| Nebel zieht vor dem Tier vorbei, Glühwürmchen steigen auf | Stimmung: Dämmerung im Wald |
| Name erscheint Buchstabe für Buchstabe | Das Tier taucht aus dem Nebel auf |
| Foto bewegt sich beim Scrollen langsamer (Parallaxe) | Tiefe |
| Abdrücke erscheinen nacheinander | Das Tier ist gerade hier entlanggelaufen |
| Pollen, Glühwürmchen, Laub, Schnee je Jahreszeit | So fühlt sich die Jahreszeit an |
| Lupe springt auf | Genau hinschauen wie ein Forscher |

Alles steht bei „Bewegung reduzieren“ still und ist trotzdem vollständig sichtbar. Nur die gerade sichtbare Jahreszeit bewegt sich (spart Akku).

### 4. Entdecken statt Ablesen
- **Lupe:** Tippt man einen Leuchtpunkt an, öffnet sich eine runde Lupe mit der vergrößerten Stelle aus dem echten Foto.
- **Fundkarten:** Antippen hebt die Karte vom Tisch und zeigt Name und Größe.
- **Jahreszeiten wischen** statt ein Rad zu lesen.

## Was im Konzept schon gebaut ist (Stand nach deinem Feedback)
| Kapitel | Baustein | Inhalt |
|---|---|---|
| Hero | `LebendigHero` + `WappenReihe` | Foto mit Parallaxe und Heranzoomen, Nebelschwaden, Glühwürmchen, Name erscheint Buchstabe für Buchstabe. Darunter **Wappen**: Wild-Wert, Seltenheit, Schutz, Rote Liste, Gift |
| I Erkunden | `Lupe` | echtes Foto über die volle Breite, Lupe mit 2,6-facher Vergrößerung, Bock/Ricke |
| II Ein Jahr | `Jahreszeiten` + `Jahresrad` | vier Jahreszeiten zum Wischen (Teilchen je Jahreszeit), darunter das **bewährte Jahresrad** |
| III Ein Tag | `TagesUhr` | die **bewährte Tagesuhr** |
| IV Zuhause | `LebensraumPanorama` | **echte Landschaftsfotos** zum Verschieben (Waldrand, Buchenwald, Feld im Morgennebel, Bachaue), Orte als Marken im Foto, das Tier als Porträt wandert bei Tag ↔ Dämmerung mit Punktespur. Orte mit Punkt zeigen beim Antippen ein **Nahfoto** (Dickicht, Waldboden, Wiese, Hecke, Biberdamm). Tiere ohne eigenes Foto zeigen ihre Zeichnung. Daten: `lebensraum.panorama` je Tier |
| V Speiseplan | `Speiseplan` + `ArtVerweise` | bewährter Speiseplan mit **Links zu den Futterpflanzen** im Katalog, Monat gemeinsam mit dem Jahresrad |
| VI Spuren | `Spurensuche` | laufende Fährte mit **Untergrund** (Schnee, Matsch, Sand), **Gangart** (Gehen, Flucht mit gespreizten Schalen) und **Alttier / Jungtier**; Fundkarten mit echten Fotos |
| VII Fressfeinde | `Fressfeinde` | dunkles Kapitel: Gefahren warten als **Schatten mit leuchtenden, blinzelnden Augen**, Antippen holt sie ins Licht (Foto/Zeichnung, Name, Link zur Art); getrennt nach „für alle“ und „nur Jungtiere“ |
| Schluss | `Hinweis`, `Bildnachweis` | Sicherheits-Hinweis und Fotonachweis |

Bewährte Sektionen werden mit `<OhneRahmen>` ohne Kasten und ohne eigenen Kopf in ein Kapitel gesetzt.

### Wappen (`src/components/ui/Wappen.tsx`)
Gezeichnete Medaillons. Jede Art hat eine eigene **Form**, nicht nur eine eigene Farbe:
- Wild-Wert: runde Skala mit Zahl
- häufig: Kreis mit Blatt
- selten: Sechseck mit zwei Edelsteinen
- sehr selten: Schild mit Stern
- legendär: achtzackiger Stern mit Krone und Strahlen
- geschützt: Schild mit Haken (streng geschützt: doppelt umrandet)
- gefährdet: Dreieck mit Ausrufezeichen
- giftig: Raute mit Tropfen

Alle zu sehen unter Einstellungen → Bausteine.

## Noch offen
- „So groß“ bleibt bewusst kurz: zwei Kennzahlen unter der Lupe
- Igel: kein passendes Foto (Hecke, Wiese, Gärten), noch ohne Panorama
- Fotos für die übrigen acht Säugetiere
- Unterschied Bock/Ricke bei den Spuren: Dafür habe ich keine gesicherte Quelle gefunden. Deshalb ist er nicht eingebaut (keine erfundenen Fakten).

## Technik
- Nur React-Native-`Animated` mit `useNativeDriver` (flüssig, kein neues Paket, läuft in Expo Go).
- Scroll-Wert wird an Hero (Parallaxe) und Kapitel (Einblenden) weitergegeben.
- Daten kommen unverändert aus `src/data/tiere/*.ts`, es wurden keine neuen Fakten ergänzt.
- Funktioniert für alle Tiere mit echten Fotos (bisher Reh und Rotfuchs).

## Offene Fragen an dich
1. Gefällt die Richtung, also Kapitel ohne Kästen und große Fotos? Dann baue ich die übrigen Kapitel.
2. Soll die lebendige Seite die jetzige Tierseite ersetzen, oder als eigene Ansicht daneben bleiben?
3. Für die anderen acht Säugetiere braucht es dafür echte Fotos (wie bei Reh und Fuchs).
