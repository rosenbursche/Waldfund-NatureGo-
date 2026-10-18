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

## Was im Konzept schon gebaut ist
| Kapitel | Baustein | Inhalt |
|---|---|---|
| Hero | `LebendigHero` | Foto mit Parallaxe und Heranzoomen, Nebelschwaden, Glühwürmchen, Name erscheint Buchstabe für Buchstabe, Seltenheit, wippender Pfeil |
| I Erkunden | `Lupe` | echtes Foto über die volle Breite, Lupe mit 2,6-facher Vergrößerung, Bock/Ricke |
| II Ein Jahr | `Jahreszeiten` | vier Jahreszeiten zum Wischen, Teilchen je Jahreszeit, Fell und Ereignisse aus den Tierdaten, startet bei der aktuellen Jahreszeit |
| III Spuren | `Spurensuche` | laufende Fährte (versetzt oder geschnürt), Fundkarten mit echten Fotos bzw. Zeichnung |
| – | `Kapitel`, `Partikel` | Kapitel-Rahmen mit Einblenden, wiederverwendbare Teilchen (Schnee, Pollen, Laub, Glühen) |

## Nächste Kapitel (Vorschlag, noch nicht gebaut)
| Kapitel | Idee |
|---|---|
| So groß | Ein Kind (Umriss) steht neben dem Tier. Beim Ziehen läuft das Tier heran, bis beide gleich nah stehen. Das Maßband wächst mit. |
| Ein Tag | Der ganze Abschnitt ist ein Himmel. Beim Ziehen der Sonne wird es Morgen, Mittag, Dämmerung, Nacht. Das Foto wechselt zwischen aktiv und ruhend, nachts leuchten Augen im Gebüsch. |
| Zuhause | Die Landschaft in drei Ebenen mit Parallaxe beim Scrollen. Das Tier wandert je nach Tageszeit zwischen Deckung und Futterplatz. |
| Speiseplan | Futter wächst je Monat aus dem Boden (Knospen, Kräuter, Eicheln) und kann angetippt werden. |
| Gefahren | dunkleres Kapitel. Der Schatten des Fressfeinds zieht durchs Bild, ein Tippen zeigt ihn. |
| Hinweis | ruhiger Abschluss: großes Foto (Kitz im Gras), ein Satz, Stopp-Hand |

## Technik
- Nur React-Native-`Animated` mit `useNativeDriver` (flüssig, kein neues Paket, läuft in Expo Go).
- Scroll-Wert wird an Hero (Parallaxe) und Kapitel (Einblenden) weitergegeben.
- Daten kommen unverändert aus `src/data/tiere/*.ts`, es wurden keine neuen Fakten ergänzt.
- Funktioniert für alle Tiere mit echten Fotos (bisher Reh und Rotfuchs).

## Offene Fragen an dich
1. Gefällt die Richtung, also Kapitel ohne Kästen und große Fotos? Dann baue ich die übrigen Kapitel.
2. Soll die lebendige Seite die jetzige Tierseite ersetzen, oder als eigene Ansicht daneben bleiben?
3. Für die anderen acht Säugetiere braucht es dafür echte Fotos (wie bei Reh und Fuchs).
