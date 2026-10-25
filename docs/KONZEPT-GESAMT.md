# Wildfund – Gesamtkonzept: Warum man rausgeht und dranbleibt

Stand: 25.10.2026 · Entwurf, noch nichts davon umgesetzt · Anforderungen: `docs/ANFORDERUNGEN.md` Abschnitt 2.12 · baut auf `docs/KONZEPT-SPIELSYSTEM.md` und `docs/KONZEPT-WETTKAMPF.md` auf

Ziel: Ein echter Hype. Junge und alte Menschen gehen in die Natur, und daraus wächst eine feste Community, die **alles sammeln will** wie bei Pokémon.

Alle Fachangaben in diesem Konzept (Fundstücke je Art, Zeiträume im Naturkalender, Rechtslage) sind `TODO fachlich prüfen`.

---

## 1. Das Problem

- **Pokémon GO garantiert Begegnungen, die Natur nicht.** Ein normaler Mensch sieht selten ein Wildschwein, einen Dachs oder einen Uhu. Wer drei Wochenenden nichts findet, löscht die App.
- Neue Nutzer zu gewinnen ist schwer, **sie zu halten ist noch schwerer.** Dafür braucht es einen Grund, jeden Tag und jede Jahreszeit wiederzukommen.

**Das Versprechen von Wildfund: Jeder Spaziergang bringt einen Fund.**

---

## 2. Fundstücke: Jede Art ist eine Album-Seite

Eine Art ist nicht nur „gefunden“ oder „nicht gefunden“. Jede Art hat **höchstens 4 Fundstücke plus die Sichtung** (Entscheidung 24.10.2026, vorher 6–10). Die Sichtung ist der fünfte Platz und wird hervorgehoben. Ausgewählt werden die 4 Zeichen, die man am leichtesten findet. Zuerst nur das **regionale Tierreich** (eine Pilotregion, siehe 9).

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
Der **Art-Taler** wechselt sichtbar das Material, ganz ohne Text (wie Bronze/Silber/Gold bei Duolingo-Ligen). Entschieden am 24.10.2026. Das Metall zeigt nur noch den Fortschritt; die Seltenheit zeigen Edelstein, Email und Schmuck (`docs/ICONS.md`). Vor dem ersten Fund ist der Taler ein grauer Rohling.

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
- **Nur Vogelstimmen** (Entscheidung 24.10.2026). Laute von Säugetieren (Rehbellen, Fuchsbellen …) zählen nicht als Fundstück.

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

### 5.1 Fund-Karte: Wo wurde was gefunden? (Idee 24.10.2026)
- Eine Karte zeigt, wo andere Nutzer eine Art **mit bestätigtem Fotobeweis** gefunden haben. Wer die Art noch nicht hat, weiß, wo er suchen kann. Das senkt die Hürde, rauszugehen.
- **Der Nutzer entscheidet bei jedem Fund selbst**, ob er den Ort teilt. Voreinstellung: **nicht teilen**.
- **Grenzen durch die Schutzregeln (gelten immer, auch wenn der Nutzer teilen will):**
  - **Häufige, ungeschützte Arten** (Holunder, Rotbuche, Fliegenpilz …): Ort auf einige 100 m genau, wenn freigegeben.
  - **Geschützte oder seltene Arten** (ab Seltenheit 3, besonders oder streng geschützt): höchstens das Rasterfeld.
  - **Streng geschützte und störungsempfindliche Arten** (Luchs, Wildkatze, Uhu, Schwarzstorch, Orchideen …): **gar kein Ort**, nur „in deiner Region gefunden“.
  - Keine Orte an Brutplätzen, Bauen oder Nestern, und nie in Echtzeit (Verzögerung, z. B. am nächsten Tag), damit niemand einem Tier hinterherläuft.
  - Unter 16: Ort teilen nur mit Einwilligung der Eltern.

### 5.2 „Jetzt in Saison“ im Startbildschirm (Idee 24.10.2026)
- Kleine Karten oder Widgets auf der Startseite: „Holunder blüht gerade“, „Bucheckern liegen“, „Pfifferlings-Zeit“. Grundlage sind die Monate der Fundstücke und der Jahreslauf aus der Datenbank, in der Region des Nutzers.
- Dazu passend: Naturkalender-Events (Abschnitt 4).
- Später als echtes Widget auf dem Handy-Startbildschirm (braucht einen Development Build, nicht Expo Go).

### 5.3 Müll melden (Idee 24.10.2026)
- Die App macht auf Müll in der Natur aufmerksam: Müll fotografieren, optional aufsammeln und entsorgen. Dafür gibt es Punkte oder ein eigenes Abzeichen („Waldhüter“).
- Gemeinsame Aktionen mit Gemeinden oder Vereinen (Clean-up-Tage) als Events.
- Keine Belohnung dafür, Wege zu verlassen; Sicherheitshinweis bei Scherben, Spritzen und Sondermüll (nicht anfassen, melden).
- Offen: Meldung an die Gemeinde (z. B. über vorhandene Mängelmelder) – später prüfen.

### 5.4 Ranglisten wie bei Strava (Idee 24.10.2026)
- **Erstfunde:** „Du bist die erste Person in deiner Region, die diese Art gefunden hat.“
- **Seltenheit unter Nutzern:** „Du bist eine von 10 Personen, die diese Art gefunden haben.“
- Ranglisten **je Region** (Naturraum oder Landkreis), je Woche, Monat und Jahr, auch nur unter Freunden.
- Wie die „Local Legend“ bei Strava: wer in einer Region die meisten Arten einer Gruppe gefunden hat.
- Zählt nur mit bestätigtem Fund (Echtheitsprüfung, Abschnitt 7). Region wird grob angegeben, nie der Fundort.

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

**Vorrang ab 25.10.2026: zuerst die Arten-Datenbank mit Sonderwissen je Art (Abschnitt 11), dann die Seiten.**

| Schritt | Inhalt |
|---|---|
| G1 | **Fundstücke-System** für eine Pilotregion: ca. 40 Arten × 6–8 Fundstücke = rund 300 Sammelziele. Dazu der Bestimmungsschlüssel für Spuren. |
| G2 | **Tagesaufgaben**, **„Nebel lichtet sich“** und **teilbare Karte**. |
| G3 | **Naturkalender-Events**, **„Jetzt in Saison“ auf der Startseite (5.2)**, **Müll melden (5.3)** und **Vogelstimmen** (nach Lizenzklärung). |
| G4 | **Testen:** 10 echte Leute aus der Zielgruppe (jung und alt) nutzen die App 2 Wochen lang. Wer öffnet sie nach 7 Tagen noch? |
| G5 | **Konten, Community, Ranglisten je Naturraum (Strava-Stil, 5.4), Fund-Karte mit Freigabe (5.1), Feed und Folgen (12), Familien-Modus**, Echtheitsprüfung W1–W3. |
| G6 | **Rückblick und Saison-Benachrichtigungen:** Jahresrückblick, Jahrestage, Naturkalender, Entdeckerkarte (13), Lückenanalyse, Regionsübersicht, Saison-Benachrichtigungen (14). |
| danach | Kämpfe (`KONZEPT-SPIELSYSTEM.md`), erst wenn das Sammeln allein schon fesselt. |

---

## 10. Offene Entscheidungen

1. **Pilotregion:** Lüneburger Heide (dort ist schon die Startszene geplant) oder deine eigene Gegend?
2. **Welche ~40 Arten** und welche Fundstücke je Art. Am besten über die Recherche-Agenten mit Quellen.
3. ✅ **Stufen** (24.10.2026): Holz-, Bronze-, Silber-, Gold-Taler.
4. **Vogelstimmen:** BirdNET-Lizenz klären oder Alternative.
5. ✅ **Zielgruppe** (24.10.2026): Kern 12–25 Jahre, aber universell wie Duolingo, auch Kinder, Familien und Ältere.
6. **Punkte für Fundstücke** im Verhältnis zur echten Sichtung.
7. ⏸ **Heimisch oder angepflanzt** (24.10.2026): kommt erst in einer späteren Iteration. Abzeichen „angepflanzt“ gestrichen, Hinweis „hier angepflanzt“ und Naturraum-Karte auf der Baumseite entfernt.
8. ✅ **Fichte in der Heide** (24.10.2026): möglicherweise heimisch an feuchten Standorten, normale Forste angepflanzt (`CLAUDE.md`).
9. **Startphase mit Beispielprofilen** (25.10.2026, siehe 12.3): Entscheidung des Nutzers steht; `TODO rechtlich prüfen` (UWG, Digital Services Act, Jugendschutz), bevor es live geht.
10. **Essbar, Rezepte, Sammeln** (25.10.2026, siehe 11.2): Wie passt „Holunder sammeln, Rezept kochen“ zur Regel „nichts pflücken, nichts essen“ (2.5, `CLAUDE.md`)? Vorschlag: Rezepte nur für häufige, ungeschützte, sicher bestimmbare Arten, bei Pilzen immer „nur nach Prüfung durch Pilzsachverständige“.
12. **Spenden: Woher kommt das Geld?** (25.10.2026, siehe 16.3): z. B. Sponsoren, Teil der Einnahmen, Partner. `TODO rechtlich prüfen` (Werbung mit Spenden, Gemeinnützigkeit der Empfänger, App-Store-Regeln).
13. **Events von Nutzern** (25.10.2026, siehe 16.2): Moderation, Haftung und Teilnahme unter 16 klären.
11. **Monatliche Challenges** (25.10.2026, siehe 14.3): Idee angefangen, Ausgestaltung offen.

---

## 11. Daten zuerst, dann die Oberfläche (Entscheidung 25.10.2026)

**Der Wow-Effekt ist der Hauptantrieb.** Die Leute sollen denken: „Da hat sich wirklich jemand Gedanken gemacht, über *jede einzelne* Art.“ Das soll sich nicht anfühlen wie eine Vorlage, die tausendmal ausgefüllt wurde, und nicht wie ein Biobuch zum Nachschlagen. Ziel ist, Natur zu erleben und dabei zu lernen.

### 11.1 Reihenfolge der Arbeit
1. **Erst die Datenbank** (`docs/DATENBANK-ARTEN.md`): so viele Daten wie möglich je Art, gut belegt.
2. **Dann je Art entscheiden:** Was ist an *dieser* Art besonders? Was wollen wir über sie erzählen?
3. **Erst danach die Seiten:** Gemeinsame Kapitel wie Lebensraum, Spuren, Jahr oder Karte bleiben als Bausteine. Jede Art bekommt zusätzlich **eigene Bausteine** für ihr Sonderwissen. Feste Vorlagen „Baum“, „Tier“, „Pilz“ allein reichen nicht.

### 11.2 Sonderwissen je Art
Jede Art bekommt eigene, **gut belegte** Datenpunkte, die es nur bei ihr gibt. Beispiele (Fachangaben `TODO fachlich prüfen`, mit Quelle belegen):

| Art | Sonderwissen (Beispiel) |
|---|---|
| Walnuss | Blätter und Wurzeln enthalten Juglon. Der Stoff hemmt andere Pflanzen unter dem Baum. Die Nüsse sind essbar. |
| Holunder | Blütezeit, Rezept (Holunderblüten-Sirup), Hinweis: Beeren nur gekocht essen |
| Pilze | Saison, Partnerbaum, „damit kannst du kochen“ nur zusammen mit dem Hinweis auf Pilzsachverständige |

In der Datenbank heißt das: Neben dem festen Feldkatalog gibt es frei erweiterbare Felder je Art (z. B. `sonderwissen`, `rezept`, `essbar`, `inhaltsstoff`), jedes mit Quelle und Prüfstatus. Die Seite zeigt dann genau die Bausteine, für die es Daten gibt.

---

## 12. Community-Feed wie Komoot oder Instagram (Idee 25.10.2026)

### 12.1 Der Feed
- **Der Feed ist die Startseite** (Entscheidung 25.10.2026): Wer die App öffnet, sieht zuerst die Community, also Funde anderer Nutzer, Beispielprofile in der Startphase (12.3) und lokale Events (16.2).
- Eigener Tab **„Feed“**: Leute aus der Region und Leute, denen man folgt. Man sieht, was sie gefunden haben, welche Taler und Abzeichen sie bekommen haben und was sie gerade machen.
- Beispiele: „Andrea hat einen Walnussbaum gefunden, schau ihn dir auch an“ (mit ihrem Foto und Ort, wenn sie ihn freigibt). „Andrea war Holunder sammeln“ (mit Bildern).
- Ziel: sich gegenseitig inspirieren und **gemeinsam** Neues entdecken.
- Orte im Feed folgen den Regeln der Fund-Karte (5.1). Bei Tieren gibt es kein „geh hin“, sondern nur „in deiner Region gesehen“ (Schutzregel 8).

### 12.2 Folgen und Freunde
- Man kann sich gegenseitig **folgen**, ähnlich wie bei Duolingo.
- Benachrichtigung, wenn ein Freund etwas gefunden oder geschafft hat. Freunde können einem auch Funde direkt schicken.
- **Kein** direkter Vergleich wie „Lena hat 3 Pilze mehr als du“.

### 12.3 Startphase mit Beispielprofilen (Entscheidung des Nutzers 25.10.2026)
Damit der Feed am Anfang nicht leer ist, gibt es in der Startphase erfundene Profile, die wie echte Nutzer aussehen:
- Zufällige Namen (Andrea, Jens, Caitlin, Annika, Niklas …) und Profilbilder aus einer Auswahl (Blume, Feld, Sonnenuntergang …).
- Erfundene Sichtungen und Funde an zufälligen Orten im Wald oder auf dem Feld, so individuell und ausführlich, dass sie echt wirken.

**Leitplanken** (Vorschlag Claude, damit echte Daten und Schutzregeln nicht leiden):
- Erfundene Funde zählen **nie** für Erstfunde, „eine von 10“, Ranglisten, Regionsübersicht (14.1), Fund-Karte oder die Datenbank. Sonst wäre „Du bist die erste Person in deiner Region“ für echte Nutzer falsch.
- Erfundene Funde gehen **nie** an GBIF oder an die Forschung weiter.
- Keine seltenen oder geschützten Arten, keine Orte in Schutzgebieten, kein „geh hin“ bei Tieren. Orte nur an Wegen.
- Erfundene Profile schreiben keine Nachrichten an echte Nutzer.
- Sie verschwinden schrittweise, sobald es in einer Region genug echte Aktivität gibt.
- **Risiko:** Erfundene Nutzer, die als echt auftreten, können als Irreführung gelten (UWG, Verbot manipulativer Gestaltung im Digital Services Act), besonders bei Minderjährigen. Fliegt es auf, leidet das Vertrauen der Community. `TODO rechtlich prüfen` vor dem Start. Ein milderer Weg wäre ein Hinweis in den Nutzungsbedingungen („In der Startphase zeigen wir Beispielprofile“).
- Alternative ohne dieses Risiko, auch zusätzlich: echte Nachweise aus GBIF im Feed („1,2 km von dir wurde ein Walnussbaum nachgewiesen“) und erkennbare Figuren wie eine Försterin oder ein Ranger.

---

## 13. Deine eigenen Daten: Rückblick und Erinnerung (Idee 25.10.2026)

- **Jahresrückblick** wie Spotify Wrapped: dein Naturjahr mit Anzahl der Arten, seltenstem Fund und schönsten Fotos. Zum Teilen gemacht.
- **Jahrestage:** „Heute vor einem Jahr hast du deinen ersten Eisvogel gesehen“, mit dem eigenen Foto, als Benachrichtigung.
- **Naturkalender** wie die Beitragsübersicht bei GitHub: Jeder Tag mit Fund wird grün.
- **Entdeckerkarte:** eine Übersicht aller eigenen Funde, keine echte geografische Karte, sondern gestaltet wie eine Entdeckerkarte aus dem 18. Jahrhundert (altes Papier, Tinte, Kompassrose, eingezeichnete Funde). Passt zum Lehrbuch-Stil der App.
- Statt persönlicher Rekorde: der Strava-Stil aus 5.4 („erste Person in dieser Region“, „eine von 5 Personen“).

---

## 14. Personalisiert und regional (Idee 25.10.2026)

Grundsatz: **Alles auf die Region des Nutzers beziehen.**

### 14.1 Region im Blick
- **Lückenanalyse:** „In deiner Region gibt es 34 Vogelarten, die du noch nicht hast. Diese 3 sind gerade leicht zu finden.“
- **„Fast geschafft“:** „Dir fehlt nur noch 1 Fundstück bis zum Gold-Taler bei der Buche.“
- **Regionsübersicht** statt „Ort gegen Ort“: „In dieser Region wurden so viele Rehe gesichtet“, „Hier gibt es besonders viele Walnussbäume.“ Regionen als grobe Flächen, nicht einzelne Orte.
- **Gemeinsame Ziele:** „Unsere Region hat zusammen 500 Arten gefunden.“

### 14.2 Saison-Benachrichtigungen (wichtig)
- Die App kennt die Arten in der Region und ihren Jahreslauf (Blüte, Früchte, Pilzsaison) aus der Datenbank. Daraus kommen Benachrichtigungen: „Der Holunder blüht gerade, schau ihn dir an“, „Dieser Pilz ist gerade in Saison“, „Gerade ist Pilzsaison.“
- **Auch für Arten, die man noch nicht gefunden hat**, damit man Neues entdeckt.
- Mit Rezept oder Verwendung, wo es passt (siehe 11.2 und offene Entscheidung 10.10).
- **Mitwachsende Aufgaben** daran koppeln: Einsteiger bekommen leichte Saison-Aufgaben, Erfahrene seltene Fundstücke.
- **Zur passenden Zeit** senden, z. B. dann, wenn diese Person sonst unterwegs ist.

### 14.3 Monatliche Challenges
- Idee: jeden Monat eine Challenge, z. B. passend zur Saison. Ausgestaltung offen (offene Entscheidung 10.11).

### 14.4 Verworfen oder zurückgestellt (25.10.2026)
| Idee | Stand |
|---|---|
| Artenkurve | ✗ nicht nötig |
| Persönliche Rekorde | ✗ ersetzt durch Strava-Stil (5.4) |
| Wetter (z. B. „nach Regen Pilzwetter“) | ✗ in der Praxis zu ungenau |
| Ligen wie bei Duolingo | ✗ höchstens ein Status nach gesammelten Arten in der Region |
| Freunde-Vergleich („Lena hat 3 Pilze mehr“) | ✗ |
| Ort gegen Ort | ⏸ zurückgestellt, stattdessen Regionsübersicht (14.1) |

---

## 15. Welche Daten wir dafür brauchen

- **Ereignis-Protokoll** je Nutzer: Fund, App geöffnet, Aufgabe erledigt, geteilt, gefolgt. Daraus entstehen Rückblick, Jahrestage, Naturkalender und Benachrichtigungen.
- **Profilwerte:** Region, Lieblingsgruppen, übliche Uhrzeit, Niveau.
- **Je Art:** Jahreslauf (Blüte, Früchte, Saison) und Vorkommen je Region aus der Datenbank. Das ist die Grundlage für 14.2.
- Datenschutz: Standort nur grob, erst nach Einwilligung, unter 16 mit Einwilligung der Eltern (DSGVO), Daten nie verkaufen.

---

## 16. Community ist alles (Entscheidung 25.10.2026)

Die wichtigste Änderung am Konzept: Wildfund ist vor allem eine **Community naturliebender Menschen**. Sammeln, Daten und Seiten dienen dazu, dass diese Gemeinschaft entsteht und zusammen rausgeht.

### 16.1 Startseite = Feed
Siehe 12.1. Die alte Startseite (Sammlung, Karte) rückt in eigene Tabs.

### 16.2 Lokale Events
- **Groß angekündigt:** Events in der Region erscheinen prominent im Feed, z. B. „Müllsammeln in Würzburg am Samstag“ (Stadt, Verein, Naturpark, NABU …).
- **Nutzer erstellen Events selbst**, eigenverantwortlich und sehr einfach: Titel, Ort (Treffpunkt), Zeit, kurze Beschreibung. Zum Beispiel Pilzwanderung, Vogelstimmen am Morgen, Clean-up.
- Teilnahme mit einem Klick, danach sehen die Teilnehmer ihre gemeinsamen Funde.
- **Leitplanken** (Vorschlag Claude):
  - Treffpunkt öffentlich, keine Events an Brutplätzen, Bauen oder Fundorten seltener Arten, in Schutzgebieten nur auf Wegen.
  - Melden-Knopf und Moderation.
  - Unter 16: nur mit Einwilligung der Eltern oder bei Events geprüfter Veranstalter (Schutz vor Treffen mit Fremden).
  - Hinweis, dass der Ersteller verantwortlich ist. Haftung `TODO rechtlich prüfen`.
- Passt zu Müll melden (5.3) und zu den Partnern (Abschnitt 5).

### 16.3 Punkte spenden
- Wer Punkte sammelt, kann sie **spenden**. Wildfund rechnet sie in einen kleinen Geldbetrag um (ein paar Euro) und zahlt an die gewählte Organisation.
- In der App gibt es eine **Liste lokaler Organisationen** in der Region: Tierheime, Wildtierstationen, Umwelt- und Naturschutzvereine. Der Nutzer entscheidet, wohin seine Punkte gehen.
- Das schafft **Aufmerksamkeit** für lokale Organisationen, auch wenn der Betrag klein ist. Im Feed: „Die Community in Würzburg hat diesen Monat 340 € an das Tierheim gespendet.“
- Organisationen stellen sich mit einer kurzen Seite vor und können eigene Events anlegen (16.2).
- Offen (Entscheidung 10.12):
  - Woher kommt das Geld (Sponsoren, Teil der Einnahmen)?
  - Wie viele Euro sind ein Punkt?
  - Nur geprüfte, gemeinnützige Organisationen aufnehmen.
  - Offen zeigen, wie viel Geld wirklich fließt (Werbung mit Spenden muss nachvollziehbar sein, `TODO rechtlich prüfen`).
- Der Nutzer zahlt dabei selbst nichts. Die Spende kommt von Wildfund, also braucht es keinen Kauf in der App.
