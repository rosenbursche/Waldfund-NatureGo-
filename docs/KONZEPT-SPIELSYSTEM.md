# Wildfund – Konzept Spielsystem (Kämpfe, Fähigkeiten, Pflanzen und Pilze)

Stand: Entwurf vom 15.10.2026 · noch nichts davon umgesetzt · baut auf `docs/KONZEPT-WETTKAMPF.md` auf · Anforderungen: `docs/ANFORDERUNGEN.md` Abschnitt 2.8

Ziel: Wildfund soll sich spielen wie Pokémon GO, aber mit echten heimischen Arten. Alles, was im Spiel passiert, soll sich aus **echter Biologie** ableiten. Wer spielt, lernt nebenbei, wer wen frisst, wer wo lebt und wer was kann.

Alle Werte und Zuordnungen in diesem Konzept sind Spiel-Vereinfachungen und `// TODO fachlich prüfen`.

---

## 1. So ist Pokémon GO aufgebaut (Recherche)

| Baustein | So funktioniert es in Pokémon GO |
|---|---|
| **Karte** | Die echte Umgebung als Karte. Pokémon erscheinen je nach Ort, Lebensraum, Tageszeit und Wetter. |
| **Fangen** | Pokémon antippen, Ball werfen. Jeder Fang bringt **Bonbons** (nur für diese Art) und **Sternenstaub** (allgemeine Währung). |
| **Stärker machen** | „Power-up“ kostet Bonbons und Sternenstaub. **Entwicklung** kostet Bonbons, manche Arten brauchen zusätzlich einen besonderen Gegenstand (z. B. Sinnoh-Stein). |
| **PokéStops** | Echte Orte (Denkmäler, Kunstwerke). Dort gibt es Gegenstände und Eier, man muss dafür in der Nähe sein. |
| **Arenen** | Echte Orte, an denen Teams um die Kontrolle kämpfen. |
| **Raids** | Starke Boss-Pokémon an Arenen, die mehrere Spieler zusammen besiegen und dann fangen können. Dazu kommen „Max-Kämpfe“ an „Power-Spots“. |
| **Kämpfe gegen Spieler** (GO-Kampfliga) | 3 gegen 3. Jedes Pokémon hat einen **Sofortangriff** (schwach, lädt Energie auf) und einen **Lade-Angriff** (stark, braucht Energie, mit Mini-Spiel). Jeder Spieler hat **2 Schutzschilde**. Ligen nach Höchst-WP (1500 / 2500 / offen), damit nicht nur die stärksten Pokémon gewinnen. |
| **Typen** | Typen (Feuer, Wasser, Pflanze …) mit „sehr effektiv“ und „nicht sehr effektiv“. Laut gängigen Guides etwa ×1,6 und ×0,625, eigener Typ des Angreifers ×1,2. |
| **Kumpel** | Ein Pokémon läuft mit. Wer zu Fuß geht, bekommt Bonbons. Eier schlüpfen nach einer gelaufenen Strecke. |
| **Routen** | Von Spielern angelegte Wege zwischen PokéStops. Auf Routen erscheinen mehr Pokémon. |
| **Forschung und Events** | Tägliche Aufgaben, wechselnde Jahreszeiten-Events mit besonderen Pokémon. |

Was Pokémon GO so stark macht: Es gibt **immer einen Grund rauszugehen**, und jeder Fund ist nützlich, auch das hundertste Taubsi (Bonbons, Staub).

---

## 2. Übersetzung für Wildfund

| Pokémon GO | Wildfund | Warum das passt |
|---|---|---|
| Pokémon fangen | Art fotografieren (wie bisher) | schon vorhanden |
| Bonbons (je Art) | **Spuren** der Art, z. B. „Fuchs-Spuren“ | Jeder weitere Fund dieser Art bringt Spuren |
| Sternenstaub | **Humus** (allgemeine Währung) | Kommt vor allem von **Pilzen**, weil Pilze in echt Totes zu Humus zersetzen |
| Power-up | **Füttern** mit echtem Futter aus dem Nahrungsnetz | Das Eichhörnchen wird mit Haselnüssen stärker, die man selbst gefunden hat |
| Entwicklung | **Heranwachsen** über die Alters-Stufen (Kitz → Reh → alter Bock) | Der Alters-Regler ist schon geplant (`ANFORDERUNGEN.md` 2.3) |
| Entwicklungs-Gegenstand | besondere Pflanze oder besonderer Pilz | siehe 4 |
| Wetter-Boost | **Tageszeit und Jahreszeit** (echte Uhrzeit) | Uhu nachts stärker, Zugvögel nur in ihrer Saison. Logik gibt es schon (`tageszeit.ts`, `jahreszeit.ts`) |
| Typen | **Lebensweisen** (siehe 3.2) | aus der echten Biologie |
| Schutzschild | **Tarnen/Ausweichen** | Tiere fliehen oder verstecken sich, statt einzustecken |
| PokéStops | **Naturpunkte**: Infotafeln, Lehrpfade, Aussichtspunkte | Echte Orte zum Lernen, liegen an Wegen |
| Arenen | **Hüterbäume**: alte Bäume, die als Naturdenkmal geschützt sind | siehe 4.3 |
| Raids | **Legenden-Begegnung**: Spieler treten gemeinsam gegen ein „Waldgeist“-Tier an | Gemeinsam statt gegeneinander |
| Kumpel | **Begleiter** läuft mit, gelaufene Kilometer bringen Spuren | Belohnt Bewegung auf Wegen |
| Routen | **Wanderwege** aus OpenStreetMap | Bleibt auf Wegen (Regel 4.5) |
| Events | **Naturkalender**: Krötenwanderung, Brunft, Pilzsaison, Vogelzug | Echte Ereignisse statt erfundener |

**Wichtig bleibt (Regel 4.5):** Keine Mechanik belohnt es, Tieren zu folgen oder Wege zu verlassen. Fotografiert wird nur, nichts wird gepflückt oder gesammelt. „Spuren“ und „Futter“ gibt es **nur im Spiel**.

---

## 3. Kämpfe

### 3.1 Ablauf (angelehnt an die GO-Kampfliga)
- **3 gegen 3**, jeder Spieler wählt ein Team aus drei Tieren.
- Jedes Tier hat:
  - einen **Sofortangriff**: schnell, schwach, lädt **Kraft** (= Energie) auf
  - einen oder zwei **Spezialangriffe**: stark, brauchen Kraft, mit kurzem Mini-Spiel (Tippen im Takt, Wischen)
  - **Ausdauer** statt Lebenspunkten. Ist sie leer, ist das Tier **erschöpft und zieht sich zurück**, es stirbt nicht.
- Jeder Spieler hat **2× Tarnen**: blockt einen Spezialangriff, wie ein Schutzschild.
- **Ligen nach Größenklasse** statt nach WP: „Kleintiere“ (Igel, Eichhörnchen, Meise), „Mittel“ (Fuchs, Dachs, Uhu), „Offen“. So hat auch eine Kohlmeise eine Chance.
- Kämpfe sind ein Kräftemessen im Stil des Naturforscher-Tagebuchs: mystisch, kein Blut, Tiere werden nie verletzt gezeigt.

### 3.2 Lebensweisen statt Typen
Sechs Lebensweisen, jedes Tier hat eine oder zwei. Vorschlag:

| Lebensweise | Beispiele | stark gegen | schwach gegen |
|---|---|---|---|
| **Jäger** | Fuchs, Luchs, Wildkatze, Uhu | Sammler | Panzer, Wasser |
| **Sammler** (frisst Pflanzen, Samen, Früchte) | Reh, Eichhörnchen, Feldhase, Eichelhäher | Gräber | Jäger |
| **Gräber** (lebt im Boden, wühlt) | Dachs, Wildschwein | Panzer | Sammler |
| **Panzer** (Stacheln, dickes Fell, Schutz) | Igel, Wildschwein | Jäger, Flieger | Gräber |
| **Flieger** | alle Vögel | Wasser | Panzer |
| **Wasser** | Eisvogel, Biber, Schwarzstorch | Jäger | Flieger |

Der Kern ist ein Kreis: Jäger → Sammler → Gräber → Panzer → Jäger. Flieger und Wasser kommen dazu, damit Vögel und Wassertiere einen eigenen Platz haben.

Plus ein **Tag/Nacht-Bonus**: Nachtaktive Tiere (Uhu, Dachs, Wildkatze) sind zwischen Dämmerung und Morgen stärker, tagaktive am Tag. Das nutzt die echte Uhrzeit wie der Wetter-Boost in Pokémon GO.

Die Tabelle ist ein erster Kreis zum Ausprobieren und muss im Spieltest ausbalanciert werden.

### 3.3 Werte aus echten Eigenschaften
| Spielwert | abgeleitet aus |
|---|---|
| Ausdauer | Körpergröße und Gewicht (`groesse` in `arten.ts`) |
| Tempo (wer zuerst trifft, wie schnell Kraft lädt) | Höchstgeschwindigkeit, Wendigkeit |
| Stärke | Beißkraft, Krallen, Schnabel |
| Tarnung (Bonus beim Ausweichen) | Fellfarbe, Lebensweise |

Die Werte stehen pro Art in einer eigenen Datei, z. B. `src/data/kampfwerte.ts`, mit `// TODO fachlich prüfen`.

### 3.4 Angriffe aus echtem Verhalten
Jeder Angriff ist ein echtes Verhalten und bekommt eine eigene Animation (siehe 5). Beispiele:

| Tier | Sofortangriff | Spezialangriff | Echtes Vorbild |
|---|---|---|---|
| Rotfuchs | Schnappen | **Mäusesprung** | Fuchs springt in hohem Bogen auf Mäuse im Gras |
| Wildschwein | Rempeln | **Ansturm**, Suhlen (heilt Ausdauer) | Schlammbad gegen Hitze und Parasiten |
| Igel | Stupsen | **Stachelkugel** (blockt und kontert) | rollt sich bei Gefahr ein |
| Eichhörnchen | Kratzen | **Vorratsversteck** (speichert Kraft für später) | versteckt Nüsse für den Winter |
| Buntspecht | Picken | **Trommelwirbel** | trommelt auf Holz |
| Uhu | Krallengriff | **Lautloser Flug** (kann nicht getarnt werden) | Federn dämpfen das Fluggeräusch |
| Eichelhäher | Picken | **Warnruf** (Team bekommt Tarn-Bonus) | warnt den ganzen Wald vor Gefahr |
| Dachs | Graben | **Bau** (zieht sich zurück und erholt sich) | lebt in großen Bauten |
| Biber | Nagen | **Damm** (Wall für 2 Runden) | baut Dämme |
| Luchs | Pirschen | **Überraschungssprung** | Lauerjäger |

**Wildform-Bonus** (aus dem Wettkampf-Konzept): Tiere aus der Natur können einen zweiten Spezialangriff lernen, Gehegeformen aus dem Zoo nur einen.

---

## 4. Pflanzen, Bäume und Pilze: Warum sammeln?

Pflanzen und Pilze kämpfen nicht, aber **ohne sie wird kein Tier stark**. Sie sind das, was in Pokémon GO Bonbons, Staub, Beeren und Entwicklungs-Steine sind.

### 4.1 Futter: Pflanzen machen Tiere stärker
Das Nahrungsnetz gibt es schon (`src/data/steckbriefe.ts` → `nahrungIds`, `src/logic/nahrungsnetz.ts`). Jeder Fund einer Pflanze bringt **Futter** dieser Art. Ein Tier wird nur mit dem gefüttert, **was es in echt frisst**:

| Tier | frisst laut `steckbriefe.ts` |
|---|---|
| Eichhörnchen | Hasel, Rotbuche, Stieleiche, Fichte, Waldkiefer, Steinpilz |
| Reh | Weißtanne, Bergahorn, Stieleiche, Rotbuche, Hainbuche, Vogelbeere |
| Amsel | Holunder, Vogelbeere, Weißdorn, Vogelkirsche |
| Biber | Silberweide, Salweide, Zitterpappel |

Wer also ein starkes Eichhörnchen will, muss Haseln, Buchen und Eichen finden. Und lernt dabei, was Eichhörnchen fressen.

- **Lieblingsfutter** (das erste in der Liste) wirkt doppelt.
- Für Jäger (Fuchs, Luchs, Uhu) ist das Futter **kein anderes Tier aus der Sammlung**. Das wäre seltsam (das eigene Reh an den Luchs verfüttern). Stattdessen: Jäger werden durch **Kämpfe und gelaufene Kilometer** stärker.
- Lücke: Viele Tiere fressen Insekten, Würmer oder Fische (Igel, Spechte, Eisvogel …), die es in der App noch nicht gibt. Bis dahin gibt es neutrales Futter aus Humus. Später vielleicht eine Kategorie Insekten.

### 4.2 Humus: Pilze sind die Währung
- In echt zersetzen Pilze totes Holz und Laub zu Humus. Im Spiel bringt **jeder Pilzfund Humus**. Humus ist die allgemeine Währung (wie Sternenstaub), damit bezahlt man Füttern und Heranwachsen.
- Tiere, die man doppelt hat, kann man **„zurück in den Wald“ geben**. Das bringt Humus und Spuren (wie das Verschicken an den Professor in Pokémon GO).

### 4.3 Bäume: Heimat und Hüterbäume
- **Heimatbaum:** Jedes Tier hat Bäume, in oder bei denen es lebt (Eichhörnchen: Kobel in Nadel- und Laubbäumen, Specht: Höhlen in alten Bäumen). Hat man den passenden Baum gefunden, bekommt das Tier einen **Heimvorteil** und Ausdauer-Bonus im Kampf.
- **Hütte und Lichtung:** Gefundene Baumarten wachsen auf der eigenen Lichtung. Das gibt es ähnlich schon (`baumGenerator.ts`, wachsende Hütte), es bekommt dadurch einen Spielzweck.
- **Hüterbäume (wie Arenen):** Alte Bäume, die als **Naturdenkmal** geschützt sind, werden zu Orten, an denen man Kämpfe austrägt oder Legenden-Begegnungen startet. Sie stehen meist an Wegen und sind besondere Orte zum Lernen. Datenquelle: Naturdenkmal-Listen der Bundesländer. Lizenzen prüfen, bevor etwas übernommen wird.

### 4.4 Besondere Gegenstände aus seltenen Funden
Seltene Pflanzen und Pilze bringen **einmalige Gegenstände**, die man nirgends sonst bekommt. Die Gegenstände leiten sich aus echten Eigenschaften ab:

| Fund | Gegenstand | Wirkung im Spiel | Echtes Vorbild |
|---|---|---|---|
| Hallimasch | **Leuchtholz** | Nachtkampf-Bonus für das ganze Team | Hallimasch-befallenes Holz kann im Dunkeln schwach leuchten (in der Lichtung schon zu sehen) |
| Arnika (sehr selten) | **Arnika-Salbe** | Ausdauer im Kampf einmal auffüllen | alte Heilpflanze für Prellungen |
| Holunder | **Holunder-Trank** | schneller Kraft aufladen | |
| Fliegenpilz + Birke | **Myzel-Band** | zwei Tiere im Team teilen ihre Kraft | Fliegenpilz lebt in Partnerschaft (Mykorrhiza) mit Birken |
| Steinpilz + Fichte | **Myzel-Band** | wie oben | Steinpilz und Fichte |
| Eisenhut, Tollkirsche, Herbstzeitlose (giftig) | **Warnfarben-Abzeichen** | Gegner greifen dieses Tier seltener an | Pflanzen wehren sich mit Gift gegen Fraß |
| Sonnentau | **Klebefalle** | bremst den Gegner eine Runde | fängt Insekten mit klebrigen Tropfen |
| Gelber Frauenschuh (legendär) | **Frauenschuh-Essenz** | schaltet bei einem Tier eine **legendäre Fähigkeit** frei | seltene, streng geschützte Orchidee |
| Igel-Stachelbart (legendär) | **Stachelbart-Essenz** | wie oben | sehr seltener Pilz an altem Laubholz |

Bei giftigen Arten zeigt die App beim Gegenstand immer den Hinweis aus der Sektion „Gefährlich & tödlich“: **in echt nie anfassen oder essen.** Heilpflanzen im Spiel sind keine Anleitung für echte Anwendung.

### 4.5 Myzel-Netz: Pilze verbinden das Team
In echt verbinden Pilzfäden im Boden die Wurzeln vieler Bäume. Im Spiel: Je mehr **Pilz-Baum-Paare** man gefunden hat, desto größer wird das **Myzel-Netz** auf der Lichtung. Es schaltet Team-Fähigkeiten frei (z. B. Tauschen im Kampf ohne Zeitverlust). Als Bild: ein leuchtendes Netz unter dem Boden der Lichtung, passt zum mystischen Look.

### 4.6 Sammelaufgaben
- **Rezepte:** „Finde 3 Frühblüher in einer Woche → Frühlings-Trank.“
- **Naturkalender:** Im Herbst bringen Pilze doppelten Humus, im Frühling Frühblüher seltene Gegenstände.
- **Herbarium:** Alle Bäume eines Naturraums gefunden → Titel und Bonus für alle Tiere aus diesem Naturraum.

---

## 5. 3D-Modelle

Grundlage sind die Vorgaben in `docs/3D-PIPELINE.md` (GLB, 15.000–30.000 Dreiecke, Vierbeiner-Rig mit Ohren, Kiefer und Schwanz).

### 5.1 Neue Animationen für Kämpfe
| Name | Inhalt | Länge |
|---|---|---|
| `kampf_bereit` | Kampfhaltung, angespannt | 2 s, Schleife |
| `angriff_schnell` | Sofortangriff | 0,8 s |
| `angriff_spezial` | Spezialangriff, je Art eigen (z. B. `maeusesprung`, `trommeln`, schon in der Pipeline genannt) | 1,5–2,5 s |
| `ausweichen` | Tarnen/Ausweichen | 0,8 s |
| `getroffen` | kurzes Zurückzucken, keine Verletzung | 0,5 s |
| `erschoepft` | setzt sich hin oder zieht sich zurück | 1,5 s |
| `sieg` | z. B. Fell schütteln, Kopf heben | 2 s |

### 5.2 Damit es nicht zu aufwendig wird
- **Gemeinsame Skelette:** Ein Vierbeiner-Rig für Fuchs, Wildkatze, Luchs, Dachs; eins für Vögel. Animationen werden auf ähnliche Tiere übertragen (Retargeting) und nur der Spezialangriff wird je Art neu gemacht.
- **Klein anfangen:** Erst die Kampflogik mit den vorhandenen Low-Poly-Modellen bauen. Die GLB-Modelle werden später ausgetauscht, ohne die Logik zu ändern.
- **Pflanzen und Pilze** brauchen kein Skelett. Wiegen im Wind und Leuchten reichen, das kann der Code (wie bei den Wassertropfen und Sporen).
- **Startaufstellung:** 6 Tiere zuerst (Fuchs als Pilot, dann Wildschwein, Igel, Eichhörnchen, Buntspecht, Uhu). Damit lässt sich jede Lebensweise einmal testen.
- **Kampfbühne:** Die vorhandene 3D-Lichtung wird die Arena. Tageszeit-Licht ist schon da.

Grobe Schätzung: Pro Tier sind das 7 Animationen zusätzlich zum Modell. Mit gemeinsamen Skeletten bleibt vor allem der Spezialangriff als Einzelarbeit.

---

## 6. Reihenfolge der Umsetzung

| Schritt | Inhalt | Braucht |
|---|---|---|
| K1 | Datenmodell: Lebensweisen, Kampfwerte, Angriffe für 6 Tiere; Rechenlogik für Kämpfe in `src/logic/kampf.ts` mit Tests | Expo Go |
| K2 | Spuren, Humus, Futter aus Funden; Füttern im Katalog | Expo Go |
| K3 | Kampf gegen den Computer auf der Lichtung mit Low-Poly-Modellen | Expo Go |
| K4 | Besondere Gegenstände, Myzel-Netz, Rezepte | Expo Go |
| K5 | Kampfanimationen für die 6 Start-Tiere als GLB | Blender, Modelle |
| K6 | Kämpfe gegen andere Spieler, Hüterbäume, Legenden-Begegnungen | Server aus `KONZEPT-WETTKAMPF.md` (W3) |

Kämpfe gegen den Computer (K3) kommen bewusst vor den Kämpfen gegen Spieler. So lässt sich das Spiel testen und ausbalancieren, ohne dass schon ein Server nötig ist.

---

## 7. Offene Entscheidungen

1. Gefallen die **sechs Lebensweisen** oder lieber eine andere Einteilung (z. B. nach Lebensraum: Wald, Wasser, Feld, Luft)?
2. Wie sollen **Jäger** stärker werden: nur über Kämpfe und Kilometer, oder doch über „Beute“ im Spiel?
3. Sollen **Insekten** als neue Kategorie kommen (Futter für Igel, Spechte, Meisen)?
4. **Hüterbäume:** Naturdenkmäler oder einfach besonders alte Bäume, die Spieler vorschlagen?
5. Die **Namen** (Spuren, Humus, Tarnen, Myzel-Band …) sind Vorschläge.
