# Wildfund – Konzept Wettkampf, Zoo-Funde und Echtheitsprüfung

Stand: Entwurf vom 15.10.2026 · noch nichts davon umgesetzt · Anforderungen: `docs/ANFORDERUNGEN.md` Abschnitt 2.7

Ziel: Spieler sollen gegeneinander antreten können (Ranglisten, Kämpfe), ohne dass man mit einem Foto vom Foto oder einem Bild aus dem Internet gewinnt. Zoos sind dabei **erwünscht**: Wer in den Zoo geht, bekommt Tiere für Kämpfe. Wer ein Tier in der freien Natur findet, bekommt mehr.

---

## 1. Grundidee

### 1.1 Zwei Arten von Funden
| | **Wildfund** (freie Natur) | **Zoofund** (Zoo, Wildpark, Tierpark) |
|---|---|---|
| Wo | außerhalb von Zoo-Flächen | innerhalb einer Zoo-Fläche (Geofence, siehe 3.2) |
| Tier im Spiel | **Wildform** | **Gehegeform** |
| Für Kämpfe nutzbar | ja, mit **Wild-Bonus** | ja, ohne Wild-Bonus |
| Sammelpunkte (Rangliste „Sammeln“) | volle Punkte (10 / 60 / 300 / 1000) | keine (oder wenige, offen) |
| Prüfung | streng, steigt mit der Seltenheit | leicht |

So lohnt sich der Zoo für Kämpfe, aber die Natur bleibt das Wertvollste.

### 1.2 Fairer Rückfall statt „Betrug!“
Kann ein Wildfund nicht sicher bestätigt werden, wird er **nicht abgelehnt**, sondern zählt erst einmal wie ein Zoofund (Gehegeform). Wird er später bestätigt (z. B. durch die Community), wird er zur Wildform. Ehrliche Spieler verlieren nichts, Betrüger gewinnen nichts.

Nur Funde, die eindeutig gefälscht sind (Bildschirm, Ausdruck, doppeltes Foto), zählen gar nicht.

### 1.3 Je seltener, desto stärker der Beweis
| Seltenheit | Wildfund braucht |
|---|---|
| 1 Häufig | Foto mit der App-Kamera, Bilderkennung passt |
| 2 Selten | zusätzlich: Ort, Jahreszeit und Tageszeit plausibel |
| 3 Sehr selten | zusätzlich: Kurzvideo mit Bewegungsprüfung (siehe 3.3) |
| 4 Legendär | zusätzlich: Bestätigung durch andere Spieler (siehe 3.4) |

### 1.4 Zwei Ranglisten
- **Sammeln**: nur bestätigte Wildfunde. Hier lohnt sich Schummeln am meisten, deshalb ist hier die Prüfung am strengsten.
- **Kämpfe**: Siege gegen andere Spieler. Zoo-Tiere sind erlaubt, Wildformen haben einen Vorteil.

---

## 2. Kämpfe (erster Entwurf)

Nur die Richtung. Ausgearbeitet in `docs/KONZEPT-SPIELSYSTEM.md`.

- Werte eines Tiers (z. B. Kraft, Tempo, Ausdauer, Tarnung) leiten sich aus **echten Eigenschaften** der Art ab, damit man beim Spielen etwas lernt. `// TODO fachlich prüfen` für jede Zuordnung.
- **Wild-Bonus** für Wildformen, z. B. etwas höhere Werte oder eine Zusatzfähigkeit. Werte später im Spieltest abstimmen.
- Kämpfe als Kräftemessen im Stil des Naturforscher-Tagebuchs (mystisch, kein Blut). Tiere werden nicht verletzt dargestellt.
- Kämpfe finden in der App statt, man muss dafür **nicht** zu Tieren hin (Regel 4.5: keine Mechanik, die das Verfolgen von Tieren belohnt).

---

## 3. Die vier Bausteine der Echtheitsprüfung

Jeder Baustein liefert Signale. Zusammen ergeben sie einen **Vertrauenswert 0–100** pro Fund (siehe 4).

### 3.1 Baustein 1: Nur die App-Kamera zählt
**Problem heute:** `fotoAufnehmen('galerie')` in `src/logic/foto.ts` nimmt jedes Bild aus der Galerie, auch aus dem Internet.

**Lösung:**
- Für Wettkampf-Funde nur Fotos, die **in diesem Moment** mit der Kamera aufgenommen werden. Die Galerie bleibt für das Tagebuch erlaubt, bringt aber keine Wettkampf-Punkte.
- Am besten die Kamera in der App selbst (`expo-camera`) statt der System-Kamera (`launchCameraAsync`). Dann kann die App sicher sagen, dass das Bild gerade entstanden ist.
- **Zeit und grober Ort werden beim Auslösen** über `expo-location` gemessen und getrennt vom Bild gespeichert. Das Bild selbst bleibt ohne EXIF wie bisher (Datenschutz).
- Jeder Fund speichert, woher er kommt: `quelle: 'kamera' | 'galerie'`.

Aufwand: klein. Läuft in Expo Go.

### 3.2 Baustein 2: Ort, Zeit und Lebensraum prüfen
**Zoo oder Natur?**
- Zoo-Flächen aus OpenStreetMap: `tourism=zoo` mit den Untertypen `zoo=wildlife_park`, `zoo=safari_park`, `zoo=petting_zoo`, `zoo=enclosure`.
- Ein Skript (wie `scripts/orte-bauen.mjs`) baut daraus offline eine Liste von Flächen. Punkt-in-Polygon gibt es schon (`src/logic/geo.ts`).
- Etwas Puffer um jede Fläche, weil GPS ungenau ist. Grenzfälle zählen als Zoofund (Rückfall 1.2).
- **Lizenz:** OpenStreetMap steht unter ODbL. Vor der Nutzung prüfen, was das für die Flächenliste bedeutet, und in `DATENQUELLEN.md` eintragen.

**Ist der Fund in der Natur plausibel?** Vorhandene Logik nutzen:
- `verbreitung.ts`: Kommt die Art in diesem Gebiet vor?
- `jahreszeit.ts`: Ist sie um diese Jahreszeit zu sehen (Zugvögel, Pilze, Frühblüher)?
- `tageszeit.ts`: Passt die Uhrzeit (Uhu nachts, nicht mittags)?
- Lebensraum: Wald, Wiese, Gewässer, Stadt? Daten dafür noch suchen (z. B. CORINE Land Cover, Lizenz prüfen).

Unplausibel heißt nicht automatisch Betrug (Tiere halten sich nicht an Karten). Es senkt nur den Vertrauenswert.

**Später:** Bilderkennung auf Zoo-Merkmale (Zaun, Gitter, Glasscheibe, Schild). Ein Gitter außerhalb eines Zoos macht stutzig.

Aufwand: mittel. Läuft in Expo Go.

### 3.3 Baustein 3: Kurzvideo statt Foto (für sehr seltene und legendäre Wildfunde)
Fängt das **Foto vom Foto**, den **Bildschirm** und den **mitgebrachten Ausdruck im Wald**.

- Die App nimmt **1–2 Sekunden Video** auf und zeichnet gleichzeitig Gyroskop und Beschleunigung auf (`expo-sensors`).
- **Zufällige Aufgabe** beim Auslösen, z. B. „Schwenk langsam nach links“. Ein vorbereitetes Video passt dann nicht.
- Der Server prüft:
  - **Parallaxe:** In einer echten Szene bewegen sich Vorder- und Hintergrund unterschiedlich. Bei einem Ausdruck oder Bildschirm bewegt sich alles gleich (flach).
  - **Sensoren passen zum Bild:** Die gemessene Drehung muss zur Bewegung im Video passen.
  - **Bildschirm-Merkmale:** Moiré-Muster, Pixelraster, Flimmern, Spiegelungen.
- Optional: Tiefendaten auf Handys mit LiDAR oder Tiefenkamera. Ein Ausdruck ist eine glatte Fläche.
- Das Video wird **nach der Prüfung gelöscht**. Gespeichert bleibt nur ein Standbild für das Tagebuch.

Offene Punkte:
- Eine verlässliche Parallaxe-Prüfung ist der schwierigste Teil des Konzepts. Vorher recherchieren, welche fertigen Verfahren es gibt.
- Echte Tiere bewegen sich. Die Prüfung darf ein laufendes Reh nicht als „unecht“ werten.
- Videoaufnahme mit `expo-camera` sollte in Expo Go laufen. Eine Auswertung direkt auf dem Handy bräuchte einen Development Build, deshalb erst einmal auf dem Server.

Aufwand: groß.

### 3.4 Baustein 4: Server, Konten und Community
Ein Wettkampf braucht einen gemeinsamen Ort für Funde und Ranglisten. Der vorhandene Cloudflare-Worker (`server/`) wird ausgebaut.

- **Konten:** anonym mit Spitzname, keine echten Namen. Unter 16 braucht es nach DSGVO die Einwilligung der Eltern (vor Veröffentlichung rechtlich prüfen).
- **Echtes Gerät:** Play Integrity (Android) und App Attest (iPhone) zeigen, ob die App unverändert auf einem echten Gerät läuft. Ein Handy mit gefälschtem GPS (Mock Location) wird erkannt. Braucht einen Development Build, läuft nicht in Expo Go.
- **Bewegungsspur:** In 10 Minuten von Berlin in den Harz ist unmöglich und senkt den Vertrauenswert.
- **Doppelte Bilder:** Jedes Bild bekommt einen Bild-Fingerabdruck (Perceptual Hash). Der Server vergleicht mit allen bisherigen Funden. So fällt auf, wenn ein Foto weitergegeben wird.
- **Community-Prüfung:** Legendäre und unsichere Wildfunde sehen andere Spieler (ohne Ort) und stimmen ab: „richtige Art?“, „echte Natur?“.
- **Vertrauen der Spieler:** Wer oft richtig bestätigt wird oder richtig bestätigt, bekommt mehr Gewicht. Neue Konten haben weniger Gewicht.
- **Statistik:** Ein Spieler mit auffällig vielen legendären Funden wird zur Prüfung markiert.

**Schutz (Regel 4.5 bleibt):**
- Fundorte werden auf dem Server **nur auf Rasterebene** gespeichert, nie genau.
- Ranglisten und die Community-Prüfung zeigen **keine Orte**.
- Bei streng geschützten Arten (Wolf, Luchs, Uhu …) wird nicht einmal das Raster angezeigt.

Aufwand: groß.

---

## 4. Der Vertrauenswert

Startwerte, im Spieltest abstimmen (`// TODO fachlich prüfen`).

| Signal | Wirkung |
|---|---|
| Foto aus der Galerie | kein Wettkampf-Fund |
| Bildschirm oder Ausdruck erkannt (3.3) | kein Fund |
| Bild schon einmal eingereicht (3.4) | kein Fund |
| Gefälschtes GPS oder unmögliche Bewegung (3.4) | kein Fund, Konto markieren |
| Bilderkennung passt sicher | + |
| Ort, Jahreszeit, Tageszeit plausibel (3.2) | + |
| Kurzvideo mit passenden Sensoren bestanden (3.3) | ++ |
| Community bestätigt (3.4) | ++ |
| Unplausibler Ort oder Zeitpunkt | − |
| Auffällige Statistik des Spielers | − |

Ergebnis:
- **Hoch:** Wildform, volle Punkte sofort.
- **Mittel:** Gehegeform, Community prüft, bei Bestätigung Wildform.
- **Niedrig:** Gehegeform (bzw. kein Fund bei den harten Signalen oben).
- **Im Zoo:** immer Zoofund, Gehegeform.

---

## 5. Reihenfolge der Umsetzung

| Schritt | Inhalt | Braucht |
|---|---|---|
| W1 | Nur App-Kamera zählt, Quelle, Zeit und grober Ort je Fund speichern | Expo Go |
| W2 | Zoo-Flächen (OSM-Skript), Wildfund/Zoofund, Plausibilität aus vorhandener Logik, Gehegeform/Wildform im Katalog | Expo Go, Lizenz-Prüfung OSM |
| W3 | Server mit Konten, Ranglisten, Bild-Fingerabdruck, Community-Prüfung, Vertrauenswert | Cloudflare-Konto, Datenschutz-Prüfung |
| W4 | Kurzvideo mit Sensoren und Parallaxe-Prüfung, Geräteprüfung | Development Build, Recherche |
| danach | Kampfsystem | eigenes Konzept |

W1 und W2 bringen auch ohne Server schon etwas: Der Katalog zeigt ehrlich, ob ein Tier aus der Natur oder aus dem Zoo stammt.

---

## 6. Offene Entscheidungen

1. **Regel 4.5 „Kein Konto, Daten lokal“** steht in `ANFORDERUNGEN.md` als nicht verhandelbar. Ein Wettkampf braucht Konten. Vorschlag: Konto nur für den Wettkampf-Modus. Das Spiel allein bleibt offline und ohne Konto.
2. **Exotische Zoo-Tiere** (Löwe, Elefant …): nur heimische Arten wie bisher, oder eine eigene Kategorie „Zoo“ nur für Kämpfe?
3. **Sammelpunkte für Zoofunde:** gar keine oder wenige (z. B. 10 %)?
4. **Wie stark der Wild-Bonus** im Kampf sein soll.
5. **Kampfsystem:** rundenbasiert, Karten, Werte vergleichen? Eigenes Konzept.

---

## 7. Was bewusst nicht versprochen wird

- Keine Prüfung ist hundertprozentig sicher. Das Ziel ist, dass Betrug **mehr Aufwand kostet, als er bringt**, und dass er auffällt.
- Die Werte im Vertrauenswert und der Wild-Bonus sind Startwerte, keine Fakten.
