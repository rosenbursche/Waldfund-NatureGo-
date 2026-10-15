# Wildfund – Konzept Veröffentlichung (vom heutigen Stand in den App Store)

Stand: Entwurf vom 15.10.2026 · Anforderungen: `docs/ANFORDERUNGEN.md` Abschnitt 2.9

Ziel: Eine erste Version **Wildfund 1.0**, die man sich im **Apple App Store** und bei **Google Play** kostenlos herunterladen kann.

Wer was macht:
- **Du**: Konten anlegen, Entscheidungen treffen, auf dem Handy testen, Fachleute finden
- **Claude**: Code, Einstellungen, Builds vorbereiten, Texte entwerfen
- **Fachleute**: Biologie und Pilze prüfen, Datenschutz prüfen

Regeln und Preise der Stores ändern sich. Alles, was hier zu Stores, Preisen und Fristen steht, vor dem jeweiligen Schritt in den offiziellen Hilfeseiten nachprüfen.

---

## 0. Wo wir stehen

**Fertig oder fast fertig:**
- Onboarding mit Naturraum, 3D-Lichtung mit Hütte, Katalog mit Stammbaum und Mystery-Zone
- Artenseiten (Reh und Fuchs grafisch ausgearbeitet), Karte, Wild-Wert
- Fotografieren, Punkte, Level, Serien, Erfolge, Feldtagebuch
- Icon, Splash, „Bewegung reduzieren“, Barrierefreiheit (Phase 9)
- Tests (186), Typprüfung, Lint, ausführliche Doku
- Kampf-Arena als Test

**Was vor dem Store fehlt (Überblick):**
| Bereich | Problem heute |
|---|---|
| Erkennung | Pilze, Vögel und Säugetiere werden nur **simuliert**. Die App sagt das ehrlich („Simulierte Prüfung (Demo)“), aber eine Demo-Funktion gehört nicht in eine Store-Version. Echte Pflanzenerkennung ist vorbereitet, der Server läuft noch nicht. |
| Fachinhalt | **62 Stellen** mit `TODO fachlich prüfen`, darunter Giftigkeit und Gefahren |
| Platzhalter | Reh-Modell ist ein Weißwedelhirsch; Test-Ansichten (3D-Test, Kampf-Arena, Diorama-Schalter) sind für Nutzer sichtbar |
| Recht | keine Datenschutzerklärung, keine Datenschutz-Seite in der App, Erlaubnis-Text der Kamera stimmt nicht ganz |
| Technik | keine App-IDs, kein `eas.json`, noch nie ein echter Build (nur Expo Go), keine automatischen Tests auf GitHub |
| Stores | keine Konten, kein Store-Eintrag |

---

## 1. Was in Version 1.0 hinein kommt

**Grundsatz:** Lieber eine kleine, ehrliche, stabile 1.0 als eine große mit Baustellen. Alles Weitere kommt als Update.

| In 1.0 | Nicht in 1.0 (später als Update) |
|---|---|
| Onboarding, Lichtung, Katalog, Artenseiten, Mystery-Zone | Kämpfe gegen andere Spieler |
| Sammeln mit Foto, Punkte, Level, Tagebuch | Konten, Ranglisten, Server für Spieler |
| Echte Erkennung für **Pflanzen** (Pl@ntNet) | Zoo-Funde, Wildform/Gehegeform |
| Pilze und Tiere: **ehrlich selbst eintragen** (siehe 1.1) | Spuren, Humus, Füttern |
| Kampf-Arena: ausgeblendet **oder** als „Vorschau“ gekennzeichnet (Entscheidung E4) | Realistische 3D-Modelle mit Skelett |

### 1.1 Ehrliche Erkennung statt Demo
Die App kennzeichnet die simulierte Prüfung schon ehrlich. Trotzdem gehört sie nicht in die Store-Version: Apple lässt keine Demo-, Beta- oder Testfunktionen in Apps im Store zu, und eine Prüfung mit erfundener Sicherheit („86 %“) wirkt wie eine echte, auch mit Hinweis.

Vorschlag für 1.0:
- **Pflanzen**: echte Prüfung über Pl@ntNet (wie vorbereitet).
- **Pilze, Vögel, Säugetiere**: „**Fund eintragen**“ mit Foto, ohne Prüfung. Die App sagt klar: „Für diese Art gibt es noch keine automatische Prüfung. Trag sie nur ein, wenn du dir sicher bist.“
- Weil es in 1.0 **keinen Wettkampf** gibt, schadet Schummeln niemandem (siehe `KONZEPT-WETTKAMPF.md`). Die strenge Prüfung kommt erst mit den Ranglisten.
- Der Demo-Modus bleibt nur für Entwicklung und Tests erhalten.

### 1.2 Was raus oder versteckt wird
- „3D-Test: realistisches Modell“, „Startszene als Bild-Diorama (Test)“, „Bildrate anzeigen“: nur in Entwicklungs-Builds sichtbar
- Weißwedelhirsch auf der Reh-Seite: durch das Low-Poly-Reh ersetzen, bis ein echtes Reh-Modell da ist
- `console.log` im Code entfernen (eine Stelle)

---

## 2. Die Schritte

Die Schritte 2.1–2.4 können **nebeneinander** laufen. Ab 2.5 geht es nacheinander.

### 2.1 Entscheidungen und Konten (Du)
| Schritt | Details | Kosten |
|---|---|---|
| **Name prüfen** | Gibt es „Wildfund“ schon als App oder als Marke? In beiden Stores suchen und im Markenregister (DPMA, EUIPO). | kostenlos |
| **App-ID festlegen** | z. B. `de.wildfund.app`. Lässt sich nach dem Start **nie mehr ändern**. Am besten eine eigene Domain dazu. | Domain ab wenigen Euro im Jahr |
| **Apple Developer Program** | als Privatperson oder Organisation anmelden | 99 $ pro Jahr |
| **Google Play Console** | Konto anlegen, Identität bestätigen | 25 $ einmalig |
| **Händlerstatus (EU)** | Beide Stores fragen, ob du „Händler“ im Sinne des EU-Gesetzes DSA bist. Bei einer kostenlosen Hobby-App ohne Einnahmen meist nicht, im Zweifel beraten lassen. Als Händler werden Name, Adresse und Telefon öffentlich gezeigt. | – |
| **Expo-Konto** | für EAS (Builds in der Cloud) | kostenloser Einstieg, Grenzen prüfen |
| **Pl@ntNet und Cloudflare** | Konten für die Pflanzenerkennung (Anleitung `server/README.md`) | kostenloser Einstieg, siehe 2.2 |

### 2.2 Pflanzenerkennung fertig machen (Du + Claude)
1. Server nach `server/README.md` einrichten und hochladen.
2. **Nutzungsbedingungen von Pl@ntNet lesen.** Der kostenlose Plan erlaubt laut den offiziellen Seiten 500 Erkennungen am Tag. Ob eine App in den Stores damit erlaubt ist, steht dort nicht eindeutig. Es gibt eigene Pläne für gemeinnützige und für bezahlte Nutzung. **Vor dem Start bei Pl@ntNet nachfragen.**
3. **Die Grenze ist klein:** Der Server erlaubt heute höchstens 450 Erkennungen am Tag **für alle Nutzer zusammen**. Schon 100 aktive Nutzer mit je 5 Fotos wären darüber. Was passiert dann? Vorschlag: freundlicher Hinweis „Die Erkennung ist für heute ausgelastet, dein Fund wird morgen geprüft“ und das Foto wird zum späteren Prüfen gemerkt.
4. Logo und Namensnennung von Pl@ntNet in der App, so wie es der gewählte Plan verlangt.

### 2.3 Inhalte fachlich prüfen (Du + Fachleute)
Die 62 `TODO fachlich prüfen`-Stellen nach Wichtigkeit:

| Stufe | Was | Wer |
|---|---|---|
| **A – Pflicht vor dem Start** | Giftigkeit von Pflanzen und Pilzen, Verwechslungsgefahr, Gefahren-Texte (Wildschwein, Fuchsbandwurm …), Schutzstatus und Rote Liste | Biologin/Biologe, für Pilze eine geprüfte Pilzsachverständige oder ein geprüfter Pilzsachverständiger (z. B. über die Deutsche Gesellschaft für Mykologie) |
| **B – vor dem Start, wenn möglich** | Steckbriefe, Lebensraum, Nahrung, Jahreszeiten, Verbreitung | Fachperson oder sorgfältig mit Quellen |
| **C – darf als „vereinfacht“ bleiben** | Spielwerte (Punkte, Wild-Wert, Kampfwerte) | in der App als Spiel-Vereinfachung kennzeichnen |

Gut: Die Warnung „Iss niemals Pilze, die nicht geprüft wurden“ steht schon auf der Artenseite und beim Sammeln. Sie muss überall erscheinen, wo es um Speisepilze geht.

Zusätzlich: Alle Lizenzen in `DATENQUELLEN.md` noch einmal prüfen. Jede Pflicht-Namensnennung muss in der App sichtbar sein.

### 2.4 Recht und Datenschutz (Du, mit Unterstützung)
| Schritt | Details |
|---|---|
| **Datenschutzerklärung** | als Webseite, z. B. kostenlos über GitHub Pages. Beide Stores verlangen den Link. Claude kann einen Entwurf schreiben, der genau beschreibt, was die App macht. **Prüfen lassen**, z. B. bei einer Datenschutz-Beratung. |
| **Datenschutz in der App** | eigene Seite in den Einstellungen mit Kurzfassung und Link |
| **Erlaubnis-Texte korrigieren** | Die Kamera-Erlaubnis in `app.json` sagt „Deine Fotos bleiben auf deinem Handy“. Mit echter Erkennung gehen Pflanzenfotos an Pl@ntNet. Neuer Vorschlag: „… Deine Fotos bleiben auf deinem Handy. Nur wenn du die Pflanzenerkennung nutzt, wird das Foto zur Bestimmung an Pl@ntNet geschickt und dort nicht gespeichert.“ (Was Pl@ntNet speichert, in deren Bedingungen prüfen.) |
| **Unter 16** | Der Hinweis „frag deine Eltern“ vor der echten Erkennung ist schon da. Ob das rechtlich reicht, gehört zur Datenschutz-Prüfung. |
| **Impressum** | Nur nötig, wenn die App geschäftsmäßig angeboten wird (z. B. Händlerstatus). Mit der Beratung klären. |

**Welche Daten die App verarbeitet** (Grundlage für Datenschutzerklärung und Store-Angaben):

| Daten | Wohin | Gespeichert |
|---|---|---|
| Fotos | bleiben auf dem Handy; bei Pflanzenerkennung über den eigenen Server an Pl@ntNet | Server: nein; Pl@ntNet: laut deren Bedingungen |
| Standort | nur grob (ca. 10 km), nur auf dem Handy, für den Naturraum | nur auf dem Handy |
| Zufällige Geräte-ID | an den eigenen Server, nur zum Zählen der Tagesgrenze | Zähler verfallen nach 2 Tagen |
| Sammlung, Punkte, Einstellungen | nur auf dem Handy | nur auf dem Handy |
| Konten, Namen, E-Mail, Werbung, Tracking | – | gibt es nicht |

### 2.5 Technik für den Store (Claude)
| Schritt | Details |
|---|---|
| **App-IDs** | in `app.json`: `ios.bundleIdentifier` und `android.package` |
| **Versionen** | `version` (für Menschen, z. B. 1.0.0) und Build-Nummern (`ios.buildNumber`, `android.versionCode`) |
| **EAS einrichten** | `eas.json` mit drei Profilen: `development` (Testen mit allen Test-Ansichten), `preview` (für Tester), `production` (Store) |
| **Test-Ansichten verstecken** | nur im Profil `development` sichtbar (siehe 1.2) |
| **Erster echter Build** | Expo Go ist nicht die echte App. Im eigenen Build können sich Dinge anders verhalten (Berechtigungen, 3D, Schriften). Deshalb früh einen `preview`-Build auf dein Handy bringen. |
| **Fehler abfangen** | Fehlerseite statt Absturz, wenn ein Bildschirm abstürzt („Da ist etwas schiefgelaufen – zurück zur Lichtung“) |
| **Leistung** | auf einem **älteren, günstigen Android-Handy** testen: Lichtung, Reh- und Fuchs-Seite, Arena. Ziel: flüssig, Handy wird nicht heiß, Akku hält. |
| **App-Größe** | Download-Größe prüfen (heute 1,6 MB Grafiken, gut) |
| **Offline** | alles außer der Pflanzenerkennung muss ohne Internet gehen, auch im Flugmodus testen |

### 2.6 Qualität sichern (Claude + Du)
| Schritt | Details |
|---|---|
| **Automatische Prüfung** | GitHub Actions: Tests, Typprüfung (App und Server) und Lint bei jedem Push |
| **Arbeiten mit Branches** | neue Funktionen auf eigenen Branches, `main` bleibt immer veröffentlichbar |
| **Test-Checkliste** | Liste aller Bildschirme mit dem, was man sehen soll. Vor jeder Version einmal durchgehen. |
| **Geräte** | mindestens: ein aktuelles iPhone, ein kleines iPhone, ein günstiges Android-Handy |
| **Barrierefreiheit** | einmal mit VoiceOver (iPhone) und TalkBack (Android) durch die App, große Schrift einstellen |

### 2.7 Testphase mit echten Menschen (Du)
| | Apple | Google |
|---|---|---|
| Werkzeug | **TestFlight** | **Geschlossener Test** in der Play Console |
| Pflicht | keine Mindestzahl | Für neue private Konten nach heutigem Stand **mindestens 12 Tester über 14 Tage am Stück**, bevor man veröffentlichen darf. Fällt die Zahl darunter, beginnt die Zeit neu. Firmenkonten sind ausgenommen. **In der Play Console prüfen.** |
| Wer | Freunde, Familie, Schulklasse, Naturschutzgruppe |

Tipp: Die 12 Tester **früh** zusammensuchen. Die 14 Tage sind oft die längste Wartezeit des ganzen Projekts.

Rückmeldungen sammeln: Was war unklar? Wo ruckelt es? Hat die Pflanzenerkennung funktioniert?

### 2.8 Store-Eintrag (Du + Claude)
| Teil | Details |
|---|---|
| Name und Untertitel | z. B. „Wildfund – Natur entdecken“ |
| Beschreibung | Claude schreibt einen Entwurf (Deutsch, später Englisch) |
| Screenshots | aus der echten App, in den Größen, die die Stores verlangen |
| Kategorie | Bildung oder Spiele (Entscheidung E5) |
| Altersfreigabe | Fragebogen in beiden Stores ehrlich ausfüllen (Gefahren-Sektion, keine Gewalt, keine Käufe, keine Werbung) |
| Datenschutz-Angaben | Apple „App-Datenschutz“ und Google „Datensicherheit“ nach der Tabelle in 2.4 |
| Links | Datenschutzerklärung, Support-Kontakt (E-Mail-Adresse) |
| Hinweis für die Prüfer | kurz erklären: Pflanzenerkennung über Pl@ntNet, Standort nur grob, wie man eine Art findet (z. B. „Beispielfunde laden“ in den Einstellungen) |

### 2.9 Einreichen und Start (Claude + Du)
1. `npx eas-cli build --profile production` für beide Plattformen
2. `npx eas-cli submit` lädt die Builds hoch
3. **Prüfung** durch Apple und Google. Kann wenige Tage dauern, bei Ablehnung gibt es eine Begründung. Dann nachbessern und neu einreichen.
4. **Android schrittweise** veröffentlichen (erst ein kleiner Teil der Nutzer)
5. In den ersten Tagen: Bewertungen lesen, Abstürze beobachten (in App Store Connect und der Play Console), schnell reagieren

---

## 3. Häufige Gründe für eine Ablehnung (und wie wir sie vermeiden)

| Grund | Bei Wildfund | Lösung |
|---|---|---|
| Demo- oder Testfunktionen in der Store-Version | simulierte Erkennung, Test-Ansichten | 1.1, 1.2 |
| Erlaubnis-Texte ungenau | Kamera-Text | 2.4 |
| Abstürze oder kaputte Bildschirme | Test-Ansichten, ungetestete Builds | 1.2, 2.5, 2.6 |
| Fehlende Datenschutzerklärung | fehlt | 2.4 |
| Unfertig wirkende Inhalte | Platzhalter-Modell | 1.2 |
| Inhalte, die Nutzern schaden können | falsche Gift-Angaben | 2.3 Stufe A |

---

## 4. Kosten im Überblick

| Posten | Kosten |
|---|---|
| Apple Developer Program | 99 $ pro Jahr |
| Google Play Console | 25 $ einmalig |
| Domain (optional, empfohlen) | wenige Euro im Jahr |
| Webseite für Datenschutzerklärung | kostenlos (GitHub Pages) |
| Expo/EAS, Cloudflare | kostenloser Einstieg, Grenzen prüfen |
| Pl@ntNet | kostenlos bis 500 am Tag; ob für eine Store-App erlaubt, klären (2.2) |
| Fachprüfung, Datenschutz-Beratung | je nachdem, wen du findest (Naturschutzvereine und Hochschulen helfen manchmal kostenlos) |

---

## 5. Reihenfolge und grobe Dauer

```
Woche  1   2   3   4   5   6   7   8
       ├─ 2.1 Konten, Name, App-ID
       ├─ 2.2 Pflanzenserver ─┤
       ├─ 2.3 Fachprüfung ─────────────┤        (dauert am längsten, früh starten)
       ├─ 2.4 Datenschutz ───────┤
           ├─ 2.5 Technik ───┤
           ├─ 2.6 Qualität ──┤
                     ├─ 2.7 Testphase (14 Tage Google) ─┤
                               ├─ 2.8 Store-Eintrag ┤
                                             ├─ 2.9 Einreichen
```

Grobe Schätzung: **6–10 Wochen** bis zur Veröffentlichung. Am meisten hängt davon ab, wie schnell sich Fachleute für die Prüfung finden.

---

## 6. Nach dem Start

- **Kleine Updates** (Texte, Fehler) gehen mit `EAS Update` ohne neue Store-Prüfung, solange sich am Kern der App nichts ändert. Größere Änderungen brauchen einen neuen Build und eine neue Prüfung.
- **Fahrplan danach** (Stufenplan aus dem Gespräch zu Servern und Konten):

| Version | Inhalt |
|---|---|
| 1.1 | weitere Tierseiten nach der Reh-Vorlage, Fehler aus den Rückmeldungen |
| 1.2 | Kampf gegen den Computer mit 6 Tieren (`KONZEPT-SPIELSYSTEM.md`, K1–K4) |
| 2.0 | anonyme Konten mit Spitzname (z. B. Supabase, Server in der EU), Ranglisten, **asynchrone Kämpfe** gegen gespeicherte Teams anderer Spieler, Echtheitsprüfung W1–W2 |
| später | echte Konten (mit „Mit Apple anmelden“ und Konto-Löschung in der App, beides von Apple verlangt), Community-Prüfung mit Melden und Blockieren, Live-Kämpfe |

Vor Version 2.0 noch einmal eine Datenschutz-Prüfung, weil dann zum ersten Mal Daten von Nutzern auf einem Server liegen.

---

## 7. Entscheidungen, die du treffen musst

| Nr. | Frage | Vorschlag |
|---|---|---|
| E1 | Name „Wildfund“ behalten? | ja, wenn die Prüfung in 2.1 frei ist |
| E2 | App-ID und Domain | `de.wildfund.app` o. ä. |
| E3 | Konto als Privatperson oder Organisation? | Privatperson für den Anfang. Eine Organisation (z. B. Verein) spart den 12-Tester-Test bei Google, braucht aber mehr Papierkram. |
| E4 | Kampf-Arena in 1.0? | als „Vorschau“ drin lassen **oder** ausblenden. Vorschlag: ausblenden, bis mehr Tiere da sind. |
| E5 | Kategorie im Store | Bildung |
| E6 | Pilze und Tiere ohne Prüfung eintragen (1.1)? | ja |
| E7 | Nur Deutsch oder auch Englisch? | erst Deutsch, Englisch mit 1.1 |
