# Wildfund – Gesamtkonzept: Warum man rausgeht und dranbleibt

Stand: 23.10.2026 · Entwurf, noch nichts davon umgesetzt · Anforderungen: `docs/ANFORDERUNGEN.md` Abschnitt 2.12 · baut auf `docs/KONZEPT-SPIELSYSTEM.md` und `docs/KONZEPT-WETTKAMPF.md` auf

Ziel: Ein echter Hype. Junge und alte Menschen gehen in die Natur, und daraus wächst eine feste Community, die **alles sammeln will** wie bei Pokémon.

Alle Fachangaben in diesem Konzept (Fundstücke je Art, Zeiträume im Naturkalender, Rechtslage) sind `TODO fachlich prüfen`.

---

## 1. Das Problem

- **Pokémon GO garantiert Begegnungen, die Natur nicht.** Ein normaler Mensch sieht selten ein Wildschwein, einen Dachs oder einen Uhu. Wer drei Wochenenden nichts findet, löscht die App.
- Neue Nutzer zu gewinnen ist schwer, **sie zu halten ist noch schwerer.** Dafür braucht es einen Grund, jeden Tag und jede Jahreszeit wiederzukommen.

**Das Versprechen von Wildfund: Jeder Spaziergang bringt einen Fund.**

---

## 2. Fundstücke: Jede Art ist eine Album-Seite

Eine Art ist nicht nur „gefunden“ oder „nicht gefunden“. Jede Art hat **6–10 Fundstücke**, und jedes zählt einzeln. Zuerst nur das **regionale Tierreich** (eine Pilotregion, siehe 9).

### 2.1 Beispiele
| Art | Fundstücke |
|---|---|
| Wildschwein | Trittsiegel · Suhle · Malbaum (Scheuerstelle mit Schlamm) · Wühlstelle · Losung · Borste · Sichtung · Foto |
| Rotbuche | Blatt (Frühling, Sommer, Herbst) · Rinde · Knospe · Buchecker · Keimling · ganzer Baum |
| Buntspecht | Feder · Trommeln (Ton) · Spechtschmiede (eingeklemmte Zapfen) · Höhle · Ruf · Sichtung |
| Rotfuchs | Trittsiegel · geschnürte Fährte · Losung · Bau · Rupfung · Sichtung |
| Biber | Sanduhr-Nagespur · gefällter Baum · Damm · Burg · Sichtung |

Grundsatz: **Bäume** über Blätter, Rinde, Früchte, Knospen. **Vögel** über Federn, Nester, Stimmen. **Säugetiere** über Spuren, Losung, Bauten, Fraßspuren.

### 2.2 Stufen je Art
Der **Art-Taler** wechselt sichtbar das Material, ganz ohne Text (wie Bronze/Silber/Gold bei Duolingo-Ligen). Entschieden am 24.10.2026.

1. **Holz-Taler**: erstes Fundstück. Die Art kommt als Silhouette aus dem Nebel.
2. **Bronze-Taler**: drei Zeichen. Die Seite bekommt Farbe.
3. **Silber-Taler**: das Lebewesen selbst gesehen (Sichtung oder Foto).
4. **Gold-Taler**: alle Fundstücke.

### 2.3 Warum das wirkt
- Man findet **fast bei jedem Spaziergang etwas**. Wühlstellen, Spechtschmieden, Federn und Blätter sind viel häufiger als die Tiere selbst.
- **Häufige Arten bleiben spannend.** Die Buche hat Fundstücke für jede Jahreszeit.
- **Panini-Effekt:** „Mir fehlt nur noch die Suhle!“ Genau dieses Gefühl macht Sammler süchtig.

### 2.4 Bestimmen als Spiel
Für Spuren gibt es kaum Bilderkennung. Stattdessen ein **Bestimmungsschlüssel als Rätsel**: „4 Zehen? Krallen sichtbar? Größer als 5 cm?“ Das macht Spaß, bringt etwas bei und braucht keine KI. Die Antworten fließen in die Echtheitsprüfung ein (siehe 7).

### 2.5 Sammeln heißt fotografieren, nicht mitnehmen
Passt zur Schutzregel und ist auch rechtlich nötig (`TODO fachlich prüfen`):
- **Federn:** Fast alle heimischen Vögel sind besonders geschützt. Federn dieser Arten zu behalten ist grundsätzlich verboten. Fotografieren ist erlaubt.
- **Nester:** Nie anfassen, Abstand halten. Während der Brutzeit gibt es für Nester keine Belohnung.
- **Rinde:** Nur fotografieren, nie abziehen.
- **Losung:** Nicht anfassen (Fuchsbandwurm).
- **Blätter:** vom Boden aufheben ist in Ordnung.

Hinweis in der App kurz und ohne erhobenen Zeigefinger, z. B. „Echte Naturforscher nehmen nur Bilder mit.“

---

## 3. Vogelstimmen

Vögel **hört** man viel öfter, als man sie sieht. Eine Tonaufnahme als Fundstück („Ruf gehört“) macht schon den Weg zum Bäcker zur Expedition.

- Erkennung prüfen: **BirdNET** (Open Source). **Achtung:** Die Lizenz ist nicht kommerziell. Vor der Nutzung klären, ob das für Wildfund geht, sonst eine Alternative suchen.
- Aufnahmen nur kurz, Ton wird nach der Erkennung gelöscht (Datenschutz: keine Gespräche speichern).
- Später auch andere Stimmen: Frösche, Kröten, Heuschrecken, Hirschröhren.

---

## 4. Rhythmus: Warum man jeden Tag wiederkommt

| Rhythmus | Mechanik |
|---|---|
| **Täglich (10 Min., auch in der Stadt)** | 3 kleine Tagesaufgaben, die vor der Haustür lösbar sind: „Finde ein Blatt mit gesägtem Rand“, „Höre eine Amsel“, „Fotografiere eine Rinde mit Rissen“. |
| **Wöchentlich** | **Fährte der Woche**: ein Rätsel zu einer unbekannten Art („Hinterlässt Sanduhr-Spuren am Ufer …“). Wer es löst, schaltet die Art frei. |
| **Jahreszeitlich** | **Naturkalender als Events**: Krötenwanderung, Brunft, Kranichzug, Pilzsaison, erster Zitronenfalter. Die Natur liefert jedes Jahr neue Events, kostenlos. Manche Fundstücke gibt es **nur in ihrer Saison**. Wer sie verpasst, wartet ein Jahr, und das bindet. |
| **Langfristig** | Sammelsets (gibt es schon), Lebensbaum, wachsende Hütte, Gold-Taler. |

**Serie (Streak), aber gnädig:** Ein Regentag oder eine kranke Woche zerstört sie nicht (z. B. Ruhetage sammeln).

---

## 5. Hype und Community

- **Teilbare Karten:** Jeder Fund ergibt eine schöne Karte im Taler- und Runen-Stil mit Seltenheit, gemacht für WhatsApp-Status, Instagram und TikTok. Ohne genauen Ort (Schutzregel).
- **„Nebel lichtet sich“** beim Freischalten wird das Herzstück und kommt ganz nach oben auf die Liste. Das ist der Moment, den Leute filmen und teilen.
- **Regionaler Stolz:** „Erster in der Lüneburger Heide, der eine Wildkatze gespürt hat.“ Ranglisten **je Naturraum** statt weltweit, damit jeder eine Chance hat.
- **Jung und Alt zusammen:** **Familien- bzw. Expeditions-Modus**: Mehrere Konten gehen zusammen los, ein Handy reicht, Funde zählen für alle. Opa kennt die Vögel, das Enkelkind bedient die App. Das ist Zielgruppe und Werbekanal zugleich.
- **Partner mit Reichweite** (Ideen, noch nichts angefragt): NABU (z. B. „Stunde der Gartenvögel“, „Stunde der Wintervögel“), Naturparks, Schulen, Pfadfinder, Förster. Naturpunkte und Lehrpfade als „Stops“ sind für sie ein Gewinn.
- **Rätsel statt Liste:** Unbekannte Arten überall als „???“ mit Hinweisen, nicht nur ganz oben auf der Startseite.

---

## 6. Jeder hat ein Nutzerkonto (Entscheidung 23.10.2026)

- Ersetzt die alte Regel „Kein Konto, Daten lokal“ (`ANFORDERUNGEN.md` 4.5) und den Vorschlag „Konto nur für den Wettkampf“ (`KONZEPT-WETTKAMPF.md` 6.1).
- Konto mit **Spitzname**, keine echten Namen sichtbar.
- **Datenschutz bleibt Pflicht:** DSGVO, Einwilligung der Eltern unter 16, Datenschutzerklärung. Vor der Veröffentlichung rechtlich prüfen.
- Die App sollte trotzdem **offline sammeln** können (im Wald gibt es oft kein Netz). Funde werden später hochgeladen.
- Fundorte auf dem Server **nur auf Rasterebene**, bei streng geschützten Arten gar nicht sichtbar.

---

## 7. Echtheitsprüfung für Fundstücke

Grundlage ist die bestehende Liste in `docs/KONZEPT-WETTKAMPF.md` (Abschnitte 3 und 4: App-Kamera, Ort/Zeit/Lebensraum, Kurzvideo, Server mit Geräteprüfung, Bild-Fingerabdruck, Community, Vertrauenswert). Für Fundstücke kommt dazu:

| Signal | Beispiel |
|---|---|
| **Nur App-Kamera** (W1) | Spurenfoto aus dem Internet zählt nicht. Ton nur live aus der App. |
| **Standort passt zum Fundstück** (W2) | Biber-Nagespur nur in Ufernähe, Suhle im oder am Wald. |
| **Zoo- und Wildpark-Flächen** (W2) | Suhle im Wildpark = Gehegefund, keine vollen Punkte. |
| **Jahreszeit passt** | Kranichruf im Juli in der Heide senkt den Vertrauenswert. |
| **Bestimmungsschlüssel passt zum Foto** | Antworten „5 Zehen“ und Foto werden später von der Community verglichen. |
| **Bild-Fingerabdruck** (W3) | Dasselbe Spurenfoto zweimal eingereicht = kein Fund. |
| **Mock-GPS und unmögliche Bewegung** (W3) | Kein Fund, Konto markieren. |
| **Community bestätigt** (W3) | Seltene Spuren zählen zuerst als **unbestätigt** und werden nach Bestätigung voll gewertet (wie der faire Rückfall in `KONZEPT-WETTKAMPF.md` 1.2). |

Häufige Fundstücke (Buchenblatt, Amselruf) brauchen wenig Prüfung, seltene (Luchs-Trittsiegel) viel, wie in `KONZEPT-WETTKAMPF.md` 1.3.

---

## 8. Schutzregeln (bleiben)

- Keine Mechanik, die belohnt, Tieren zu folgen, Wege zu verlassen oder Nester aufzusuchen.
- Fundorte seltener Arten nie genau zeigen (Luchs, Wildkatze, Orchideen). Sonst lockt man Störer und Wilderer an.
- Nichts mitnehmen, nichts pflücken, nichts essen (siehe 2.5).

---

## 9. Reihenfolge

| Schritt | Inhalt |
|---|---|
| G1 | **Fundstücke-System** für eine Pilotregion: ca. 40 Arten × 6–8 Fundstücke = rund 300 Sammelziele. Dazu der Bestimmungsschlüssel für Spuren. |
| G2 | **Tagesaufgaben**, **„Nebel lichtet sich“** und **teilbare Karte**. |
| G3 | **Naturkalender-Events** und **Vogelstimmen** (nach Lizenzklärung). |
| G4 | **Testen:** 10 echte Leute aus der Zielgruppe (jung und alt) nutzen die App 2 Wochen lang. Wer öffnet sie nach 7 Tagen noch? |
| G5 | **Konten, Community, Ranglisten je Naturraum, Familien-Modus**, Echtheitsprüfung W1–W3. |
| danach | Kämpfe (`KONZEPT-SPIELSYSTEM.md`), erst wenn das Sammeln allein schon fesselt. |

---

## 10. Offene Entscheidungen

1. **Pilotregion:** Lüneburger Heide (dort ist schon die Startszene geplant) oder deine eigene Gegend?
2. **Welche ~40 Arten** und welche Fundstücke je Art. Am besten über die Recherche-Agenten mit Quellen.
3. ✅ **Stufen** (24.10.2026): Holz-, Bronze-, Silber-, Gold-Taler.
4. **Vogelstimmen:** BirdNET-Lizenz klären oder Alternative.
5. ✅ **Zielgruppe** (24.10.2026): Kern 12–25 Jahre, aber universell wie Duolingo, auch Kinder, Familien und Ältere.
6. **Punkte für Fundstücke** im Verhältnis zur echten Sichtung.
