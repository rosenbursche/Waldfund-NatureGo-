# Wildfund – Konzept: Gliederung der vier Lebensbäume

Stand: 18.10.2026 · Entwurf auf Branch `feature/stammbaum-gliederung` · Grundlage: Belastungstest mit 500 echten Arten (siehe `docs/ANFORDERUNGEN.md` 2.10)

**Ziel in einem Satz:** Auch mit hunderten Arten findet man sich in jedem Lebensbaum sofort zurecht, sieht aber immer, **wie groß die ganze Sammlung ist**, und hat ständig ein **kleines, erreichbares nächstes Ziel**. Das Zweite ist das Wichtigste.

---

## 1. Was der Belastungstest zeigt

| Rune | Arten | davon ab „sehr selten“ | gefährlich | Gruppen heute (Vorschlag) | Ordnungen | Familien |
|---|---|---|---|---|---|---|
| Säugetiere | 91 | 19 | 3 | 9 | 8 | 23 |
| Vögel | 152 | 31 | 0 | 14 | 19 | 49 |
| Pilze | 108 | 22 | 20 | 9 | 14 | 47 |
| Pflanzen | 149 (+ Bäume des Naturraums) | 30 | 26 | 7 | 32 | 63 |

Probleme mit dem heutigen Aufbau (Ast = Gruppe, darunter eine lange Liste):

1. **Zu lange Äste.** Ein offener Ast wächst je Art 112 Punkte nach unten. „Fledermäuse“ (23 Arten) wird so etwa 2,6 m lang, „Wiese & Feld“ (40 Arten) fast 4,5 m. Man scrollt und verliert den Überblick.
2. **Zu viele Äste.** 14 Vogel-Äste passen nicht lesbar an einen Baum.
3. **Zu viele Sterne.** Alle Arten ab „sehr selten“ hängen als Sterne über der Krone, bei den Vögeln sind das 31. Der Sternenhimmel wird zur Wolke, Sterne sind dann nichts Besonderes mehr.
4. **Ordnung ist unbrauchbar.** Die Ordnungen sind sehr ungleich groß: „Passeriformes“ hat 76 Arten, bei den Pflanzen gibt es 32 Ordnungen und viele davon mit nur einer Art. Lateinische Namen sagen 12- bis 25-Jährigen außerdem nichts.
5. **Familie ist zu fein.** 47 bis 63 Familien je Rune sind zu viele Gruppen, und viele haben nur eine einzige Art.
6. **Gefährliche Arten sind aus ihrer Verwandtschaft gerissen.** Der Knollenblätterpilz steht nur in den Schattenwurzeln, nicht bei den Wulstlingen. Wer ihn sucht, findet ihn nicht dort, wo er hingehört.

---

## 2. Leitidee: drei Ebenen, alles sichtbar

```
Rune (Kategorie)          ── Runenring:  37 / 152
 └─ Ast  (4–7 je Baum)    ── Knopf:      9 / 26   ●●●●●●●●●○○○○○○○○○○○○○○○○○   ← jede Art eine Knospe
     └─ Zweig (2–12 Arten)── Zweig:      Meisen 5 / 8
         └─ Art           ── Blatt (gefunden) · Knospe (fehlt) · verhüllte Knospe (Rätsel)
```

**Regeln für die Einteilung (gelten für alle vier Runen):**

| Regel | Warum |
|---|---|
| Höchstens **7 Äste** je Baum | Mehr kann man auf einem Handybildschirm nicht auf einen Blick unterscheiden. |
| Ein Zweig hat **2–12 Arten**, Ziel 4–10 | Ein Zweig ist ein **Sammelset**: klein genug, dass man ihn in ein paar Wochen vollbekommt. |
| Namen auf **Deutsch**, so wie ein Laie gruppiert | Man soll eine neue Art erraten können: „Das ist bestimmt ein Specht“. Lateinische Ordnungen bleiben auf der Artenseite. |
| **Tiere und Pilze:** Gliederung nach Verwandtschaft und Gestalt | Ein Fuchs lebt überall, deshalb taugt der Lebensraum nicht. Verwandtschaft ist eindeutig und lehrreich. |
| **Pflanzen:** Gliederung nach Lebensraum und Jahreszeit | Pflanzen erkennt man zuerst daran, wo und wann sie wachsen. Ihre Verwandtschaft (Korbblütler und so weiter) kommt als Zweig darunter, wo sie hilft. |
| **Jede Art steht genau einmal** an einem Zweig | So gibt es keine doppelte Zählung. Die Schattenwurzeln und die Sterne zeigen dieselben Arten nur als zweite Sicht (siehe 3.4 und 3.5). |

Die vorgeschlagene Einteilung für alle 500 Testarten steht in **Abschnitt 5**. Sie ist mit einem Skript geprüft: jede Art kommt genau einmal vor, und kein Zweig hat mehr als 12 Arten.

---

## 3. Gemeinsame Bausteine (gelten für jede Rune)

### 3.1 Die Gesamtgröße bleibt immer sichtbar
- **Knospen statt Zahlen allein.** In der Baum-Übersicht trägt jeder Ast **eine Knospe pro Art**:
  - gefunden: leuchtendes Blatt (Feder, Hut oder Blüte, je nach Baum)
  - fehlt: dunkle Knospe
  - Rätselart: verhüllte Knospe
  Bei 152 Vögeln hängen also 152 kleine Punkte am Baum. Man **sieht** sofort, wie viel noch fehlt, ohne etwas zu lesen. Das ist der Kern des Konzepts, ähnlich wie im Pokédex, der von Anfang an alle Plätze zeigt.
- **Runenring:** 12 Runenzeichen um den Baum. Jedes Zeichen leuchtet bei weiteren 1/12 der Rune auf, dazu steht die Zahl daneben (z. B. „37 / 152“).
- **Waldbuch auf dem Start-Screen:** Unter den vier Runensteinen steht die Summe über alle Runen, z. B. „112 von 500 Arten“.
- **Nichts wird versteckt.** Filter dimmen Arten nur ab (siehe 3.6), sie blenden sie nie aus. So bleibt die Größe der Sammlung immer im Bild.

### 3.2 Zurechtfinden: Ast → Zweige → Art
- **Ast antippen:** Der Baum zoomt wie heute auf den Ast. Darunter fächern sich **die Zweige** auf, nicht mehr eine lange Artenliste. Jeder Zweig ist eine kurze Reihe mit seinen 2–12 Arten als Miniaturen, häufige innen und seltene an der Zweigspitze (diese Regel bleibt).
- **Höhe:** Ein offener Ast ist höchstens so lang wie seine Zahl an Zweigen, also etwa 5 Zweige × 1 Reihe statt 26 Reihen. Ein Zweig mit mehr als 6 Arten bricht in eine zweite Reihe um.
- **Brotkrumen oben:** `Vögel › Kleine Sänger › Meisen`. Ein Tipp darauf springt zurück.
- **Suche (Lupe):** Name eintippen, dann zoomt der Baum zum Ast, öffnet den Zweig und lässt die Art kurz aufleuchten. Nicht gefundene Arten erscheinen dabei als Schatten mit Namen. Rätselarten findet die Suche erst, wenn man sie gefunden hat.
- **Liste als Ausweg:** Für Bildschirmleser und für alle, die lieber lesen, gibt es dieselbe Gliederung als einfache Liste (Ast und Zweig als Überschriften).

### 3.3 Motivation: immer ein Ziel in Reichweite
Das ist der wichtigste Teil. Es wirken vier Dinge zusammen:

1. **Kleine Sets (Zweige).** Man kann einen Zweig vollenden. Je näher man am Ziel ist, desto mehr strengt man sich an („Zielgradient“). Ein Zweig mit 5 von 8 Arten zieht stärker als ein Ast mit 31 von 152.
2. **„Fast geschafft“ sichtbar machen.** Fehlen einem Zweig nur noch 1 oder 2 Arten, schimmert er leicht, und der Ast-Knopf bekommt einen kleinen Funken. Auf der Rune steht dann zum Beispiel:
   > *Noch 1 Art, dann blüht der Meisen-Zweig: Haubenmeise (Nadelwald, ganzjährig).*
3. **Sichtbare Belohnung beim Vollenden.**
   - **Zweig voll:** Er blüht auf (passend zu jedem Baum, siehe 4.x), und ein kleines Siegel erscheint am Zweig.
   - **Ast voll:** Das gruselige Gruppen-Symbol am Knopf **öffnet die Augen ganz** und glimmt golden. Die blinzelnden Augen gibt es schon, sie bekommen so eine Bedeutung.
   - **Rune voll:** Der ganze Runenring brennt, und der Baum bekommt eine besondere Krone.
4. **Vorschläge „Als Nächstes“.** Auf der Baum-Übersicht stehen 3 Vorschläge. Gewählt werden Arten, die
   - einen fast vollen Zweig abschließen,
   - in der Gegend des Nutzers vorkommen (Naturraum),
   - gerade Saison haben und
   - eher häufig sind, also schnelle Erfolge bringen.

   Seltene Arten bleiben ein Reiz für später.

**Punkte (Vorschlag, Entscheidung E3):** Ein kleiner Bonus für jeden vollen Zweig, z. B. +25 AP, und für jeden vollen Ast, z. B. +150 AP. Die Werte gehören in `src/data/spiel.ts`. Der Bonus muss klein bleiben, damit **seltene Arten der größte Reiz** bleiben (ein Fund „Legendär“ bringt 1000 AP).

### 3.4 Seltenheit und Rätsel
- **Sterne über der Krone nur noch für „Legendär“.** Das sind je Rune etwa 6–10 Sterne statt bis zu 31. Jeder Stern bleibt so etwas Besonderes.
- **„Sehr selten“ bleibt an seinem Zweig**, als **verhüllte Knospe** mit Rätseltext. Man weiß also, dass bei den Spechten noch etwas Geheimnisvolles fehlt. Das macht neugierig und hilft beim Einordnen.
- Ein legendärer Stern ist mit einem feinen Lichtfaden mit seinem Zweig verbunden. Diesen Faden sieht man erst, wenn man die Art gefunden hat. Beim Fund „fällt“ der Stern einmal kurz auf seinen Zweig und kehrt dann an den Himmel zurück.
- Die Art zählt weiter **einmal**, und zwar für ihren Zweig. Ein Zweig mit einer legendären Art ist deshalb nur mit Glück voll zu bekommen. Diese Zweige tragen ein kleines Sternsymbol als ehrlichen Hinweis.

### 3.5 Gefährliche Arten
- Sie stehen **an ihrem Zweig** (der Knollenblätterpilz bei den Wulstlingen) und tragen dort einen roten Dorn. So lernt man: „Diese Gruppe hat einen giftigen Doppelgänger“.
- Die **Schattenwurzeln** bleiben als zweite Sicht: Tippt man sie an, öffnet sich wie heute die Sektion „Gefährlich & tödlich“ mit genau diesen Arten. Sie zählen dort nicht noch einmal.
- **Pilze:** Am Zweig stehen **Verwechslungspaare** nebeneinander und sind mit einer dünnen roten Linie verbunden, z. B. Pfifferling ↔ Falscher Pfifferling oder Steinpilz ↔ Gallenröhrling. `// TODO fachlich prüfen`: Welche Paare gezeigt werden, muss jemand mit Fachwissen festlegen.
- Wichtig: Essbarkeit wird **nie** belohnt. Bei Pilzen gilt weiter der Hinweis „nichts essen, was nicht von Sachverständigen geprüft wurde“.

### 3.6 Filter, die nichts verstecken
Die Filter sitzen als Schalter über dem Baum: **Alle · Fehlt noch · Hier möglich · Jetzt in Saison**.
- Arten, die nicht zum Filter passen, werden **abgedunkelt, aber nicht entfernt**. So sieht man zum Beispiel: „In meiner Gegend fehlen mir noch 12 Vögel, insgesamt gibt es 152.“
- **Hier möglich** nutzt die Verbreitung und den Naturraum. Seehund und Alpensteinbock sind in Sachsen dann dunkel.
- Unter dem Runenring steht klein eine zweite Zahl: **„In deiner Gegend: 34 / 96“**. Das ist das faire, erreichbare Ziel, während die große Zahl die ganze Sammlung zeigt.

### 3.7 Fair bleiben: schwer findbare Gruppen
Manche Gruppen sind kaum zu fotografieren, zum Beispiel Fledermäuse, Spitzmäuse und nachtaktive Eulen.
- Solche Äste tragen ein **Mond-Symbol** („Meisterast“) und den Hinweis: *Schwer zu finden: nachts, sehr klein oder sehr scheu.*
- Hinweise geben **nie** genaue Orte. Sie nennen nur Lebensraum, Spuren und Jahreszeit. Bei Fledermäusen und Eulen steht immer dabei: *Nur aus der Ferne beobachten, Quartiere und Nester nie stören.* So verlangen es die Schutzregeln in `CLAUDE.md`.
- Wie man solche Arten belegen kann, ohne ein Foto vom Tier (Spuren, Fraßspuren, später Ruf-Aufnahmen), ist eine eigene Frage (Entscheidung E6).

### 3.8 Verbindung zur Waldansicht
Mit vielen Arten passt nicht mehr alles auf eine Lichtung (offener Punkt in ANFORDERUNGEN 2.10). Vorschlag:
- Im Wald gibt es **eine Lichtung je Ast**. Ein Wegweiser am Hohlweg nennt die Äste, und Antippen wechselt die Lichtung.
- Innerhalb der Lichtung steht jeder Zweig als kleine Gruppe (Hain) zusammen.

So ist die Gliederung in beiden Ansichten gleich, und es stehen nie mehr als etwa 30 Figuren auf einmal im Bild.

---

## 4. Die vier Runen im Einzelnen

Die Arten in den Tabellen von Abschnitt 5 sind die **Testarten**. Für die echte Datenbank gilt dieselbe Einteilung, sie wird nur mit den echten Arten gefüllt.

### 4.1 Säugetiere – Uralter Baumhirte (91 Arten, 6 Äste, 16 Zweige)
| Ast | Arten | Zweige | Besonderheit |
|---|---|---|---|
| Huftiere | 10 | 2 | Gutes Einstiegsziel: Das Reh ist meist die erste Art. |
| Raubtiere | 17 | 3 | Fuchs ⚠ und Braunbär ⚠ mit Dorn |
| Nagetiere & Hasen | 28 | 5 | Größter Ast, aber in 5 kleine Sets geteilt |
| Insektenfresser | 10 | 2 | 🌙 Meisterast (Spitzmäuse) |
| Fledermäuse | 23 | 3 | 🌙 Meisterast; 7 Arten ab „sehr selten“ |
| Meer & Küste | 3 | 1 | Kleinstes Set, nur an der Küste („Hier möglich“) |

**So sieht es aus:** Die Zweige wachsen als knorrige Seitenäste mit Eichenlaub. Jede Art ist eine **Eichel**: dunkel, solange sie fehlt, und golden, wenn sie gefunden ist. Ist ein Zweig voll, treibt er frisches Laub aus, und ein Glühwürmchen setzt sich dauerhaft darauf. Ist ein Ast voll, öffnet das Gruppen-Symbol (z. B. der Hirschschädel) die Augen ganz.

**Heute in den App-Daten:** Die Gruppen „Wald“, „Feld & Garten“ und „Am Wasser“ werden zu den Ästen oben (siehe Umsetzung, Schritt 1).

### 4.2 Vögel – Federbaum im Wind (152 Arten, 6 Äste, 25 Zweige)
| Ast | Arten | Zweige | Besonderheit |
|---|---|---|---|
| Kleine Sänger | 26 | 5 | Meisen sind ein ideales erstes Set, man sieht sie im Garten. |
| Drosseln & Finken | 28 | 4 | Viele häufige Arten, also schnelle Erfolge |
| Rabenvögel & Offenland | 21 | 4 | |
| Spechte, Tauben & Juwelen | 25 | 4 | **Schatzast:** 12 von 25 Arten ab „sehr selten“ (Eisvogel, Wiedehopf, Raufußhühner …) |
| Jäger der Lüfte | 21 | 3 | Greifvögel und Eulen; 🌙 für den Eulen-Zweig |
| Am Wasser | 31 | 5 | |

Die 76 Singvögel (eine einzige Ordnung) sind so auf drei Äste verteilt, die man auseinanderhalten kann.

**So sieht es aus:** Jeder Zweig ist eine **große Feder**, jede Art ein Federast (Fahne) daran. Fehlt die Art, ist der Federast grau, ist sie gefunden, leuchtet er in der Farbe der Art. Ist ein Zweig voll, löst sich eine Feder und schwebt einmal über den Baum, danach sitzt ein kleiner Vogel auf dem Zweig.

### 4.3 Pilze – Myzelbaum (108 Arten, 5 Äste, 16 Zweige)
| Ast | Arten | Zweige | Besonderheit |
|---|---|---|---|
| Röhrlinge | 19 | 3 | Verwechslungspaar Steinpilz ↔ Gallenröhrling; Satans-Röhrling ⚠ |
| Wulstlinge, Champignons & Täublinge | 19 | 3 | 6 gefährliche Arten, z. B. Knollenblätterpilze ⚠ |
| Weitere Blätterpilze | 32 | 4 | Zweig „Häublinge, Risspilze & Rauköpfe“: nur giftige Arten ⚠ |
| Leisten, Stacheln & Porlinge | 17 | 3 | Verwechslungspaar Pfifferling ↔ Falscher Pfifferling |
| Wunderliche Formen | 21 | 3 | Korallen, Erdsterne, Stinkmorcheln, Trüffel; macht neugierig |

Die Äste folgen der **Gestalt** (Röhren, Lamellen, Leisten, Poren, Sonderformen). Danach unterscheiden auch Pilzbücher für Einsteiger, und man erkennt es auf jedem Foto.

**So sieht es aus:** Jeder Zweig ist ein leuchtender **Myzelstrang** im Boden, jede Art ein kleiner Fruchtkörper darauf. Fehlt die Art, ist es nur ein Knötchen, ist sie gefunden, ein kleiner Hut. Ist ein Zweig voll, pulsiert das Myzel einmal hell bis zum Stamm, und es steigen Sporen auf. Gefährliche Arten glimmen rot statt hell.

### 4.4 Pflanzen – Silberner Blütenbaum (149 Arten + Bäume, 7 Äste, 21 Zweige + Bäume)
| Ast | Arten | Zweige | Besonderheit |
|---|---|---|---|
| Bäume | je Naturraum | Laubbäume · Nadelbäume | Wie heute: heimische Bäume des Naturraums; „angepflanzt, nicht heimisch“ bleibt sichtbar. |
| Sträucher & Ranken | 27 | 3 | |
| Frühblüher | 19 | 3 | Nur im Frühjahr findbar, „Jetzt in Saison“ hilft. |
| Waldboden | 25 | 3 | Zweig „Giftige Schönheiten“ (Maiglöckchen, Eisenhut …) ⚠ |
| Wiese & Feld | 40 | 6 | Größter Ast, deshalb 6 Zweige |
| Wasser & Moor | 20 | 3 | |
| Orchideen & Farne | 18 | 3 | **Schatzast:** 8 von 18 ab „sehr selten“; geschützte Arten nur fotografieren, nicht pflücken |

**So sieht es aus:** Jeder Zweig ist eine **Blütendolde**, jede Art eine Blüte daran. Fehlt die Art, bleibt die Knospe geschlossen, ist sie gefunden, öffnet sich die Blüte. Ist ein Zweig voll, steht die Dolde in voller Blüte, und Blütenblätter fallen. Der Ast „Bäume“ hängt vom Naturraum ab. Seine Zahl ändert sich deshalb, wenn man umzieht, und das muss im Text klar stehen.

---

## 5. Vorgeschlagene Einteilung der 500 Testarten

Zeichen: ☆ sehr selten · ★ legendär (wird Stern über der Krone) · ⚠ gefährlich (roter Dorn, auch in den Schattenwurzeln)

Die Seltenheit der Testarten stammt grob aus den GBIF-Beobachtungen und ist **nicht** die echte Seltenheit (siehe `src/data/testarten.ts`). Die Zuordnung zu Zweigen folgt der Familie und dem Aussehen. `// TODO fachlich prüfen`: Grenzfälle sind zum Beispiel Wachtelkönig bei den Rallen, Nutria bei Hörnchen & Biber und Herbstzeitlose bei den Wiesenblumen.

#### Säugetiere

| Ast | Zweig | Arten |
|---|---|---|
| **Huftiere** | Hirsche (5) | Reh, Rothirsch, Damhirsch, Sikahirsch, Elch ☆ |
|  | Wildrinder, Wildschafe & Wildschwein (5) | Gämse, Alpensteinbock, Mufflon, Wisent ☆, Wildschwein ⚠ |
| **Raubtiere** | Hunde & Waschbär (5) | Rotfuchs ⚠, Wolf, Goldschakal ★, Marderhund, Waschbär |
|  | Marder (9) | Dachs, Fischotter, Baummarder, Steinmarder, Iltis, Hermelin, Mauswiesel, Europäischer Nerz ★, Amerikanischer Nerz |
|  | Katzen & Bär (3) | Europäische Wildkatze, Eurasischer Luchs, Braunbär ☆ ⚠ |
| **Nagetiere & Hasen** | Hörnchen & Biber (5) | Eichhörnchen, Sibirisches Streifenhörnchen ★, Alpenmurmeltier, Biber, Nutria |
|  | Bilche (4) | Siebenschläfer, Haselmaus, Gartenschläfer, Baumschläfer ★ |
|  | Wühlmäuse & Hamster (8) | Feldhamster, Rötelmaus, Feldmaus, Erdmaus, Nordische Wühlmaus ☆, Kleinwühlmaus, Schermaus, Bisamratte |
|  | Mäuse & Ratten (8) | Zwergmaus, Waldmaus, Gelbhalsmaus, Brandmaus, Hausmaus, Wanderratte, Hausratte, Waldbirkenmaus ★ |
|  | Hasen (3) | Feldhase, Schneehase ☆, Wildkaninchen |
| **Insektenfresser** | Igel & Maulwurf (2) | Braunbrustigel, Maulwurf |
|  | Spitzmäuse (8) | Waldspitzmaus, Zwergspitzmaus, Alpenspitzmaus ☆, Wasserspitzmaus, Sumpfspitzmaus ☆, Hausspitzmaus, Feldspitzmaus, Gartenspitzmaus |
| **Fledermäuse** | Mausohren (9) | Großes Mausohr, Wasserfledermaus, Fransenfledermaus, Bechsteinfledermaus, Kleine Bartfledermaus, Große Bartfledermaus ☆, Nymphenfledermaus ★, Teichfledermaus ☆, Wimperfledermaus ☆ |
|  | Abendsegler & Zwergfledermäuse (6) | Großer Abendsegler, Kleiner Abendsegler, Zwergfledermaus, Mückenfledermaus, Rauhautfledermaus, Weißrandfledermaus ☆ |
|  | Langohren, Hufeisennasen & Co. (8) | Breitflügelfledermaus, Nordfledermaus ☆, Zweifarbfledermaus, Braunes Langohr, Graues Langohr, Mopsfledermaus, Große Hufeisennase ☆, Kleine Hufeisennase |
| **Meer & Küste** | Robben & Wal (3) | Seehund, Kegelrobbe, Schweinswal |

#### Vögel

| Ast | Zweig | Arten |
|---|---|---|
| **Kleine Sänger** | Meisen (8) | Kohlmeise, Blaumeise, Tannenmeise, Haubenmeise, Sumpfmeise, Weidenmeise, Schwanzmeise, Bartmeise ☆ |
|  | Kleiber & Baumläufer (3) | Kleiber, Waldbaumläufer, Gartenbaumläufer |
|  | Winzlinge (4) | Zaunkönig, Wintergoldhähnchen, Sommergoldhähnchen, Heckenbraunelle |
|  | Laubsänger & Grasmücken (7) | Zilpzalp, Fitis, Waldlaubsänger ☆, Mönchsgrasmücke, Gartengrasmücke, Dorngrasmücke, Klappergrasmücke |
|  | Rohrsänger (4) | Teichrohrsänger, Sumpfrohrsänger, Drosselrohrsänger, Gelbspötter |
| **Drosseln & Finken** | Drosseln (4) | Amsel, Singdrossel, Misteldrossel, Wacholderdrossel |
|  | Schnäpper & Rotschwänze (9) | Rotkehlchen, Nachtigall, Hausrotschwanz, Gartenrotschwanz, Braunkehlchen, Schwarzkehlchen, Steinschmätzer, Grauschnäpper, Trauerschnäpper |
|  | Finken (10) | Buchfink, Bergfink, Grünfink, Stieglitz, Erlenzeisig, Bluthänfling, Gimpel, Kernbeißer, Fichtenkreuzschnabel ☆, Girlitz |
|  | Sperlinge & Ammern (5) | Haussperling, Feldsperling, Goldammer, Rohrammer, Grauammer |
| **Rabenvögel & Offenland** | Rabenvögel (7) | Eichelhäher, Elster, Dohle, Saatkrähe, Rabenkrähe, Kolkrabe, Tannenhäher ☆ |
|  | Würger, Star & Pirol (4) | Neuntöter, Raubwürger ☆, Star, Pirol |
|  | Schwalben (3) | Rauchschwalbe, Mehlschwalbe, Uferschwalbe |
|  | Lerchen, Pieper & Stelzen (7) | Feldlerche, Heidelerche ☆, Bachstelze, Gebirgsstelze, Schafstelze, Baumpieper, Wiesenpieper |
| **Spechte, Tauben & Juwelen** | Spechte (8) | Buntspecht, Mittelspecht, Kleinspecht, Dreizehenspecht ★, Schwarzspecht, Grünspecht, Grauspecht ☆, Wendehals ☆ |
|  | Tauben & Kuckuck (5) | Ringeltaube, Hohltaube, Türkentaube, Turteltaube ☆, Kuckuck |
|  | Bunte Juwelen (6) | Eisvogel, Wiedehopf ☆, Bienenfresser ☆, Mauersegler, Ziegenmelker ★, Wasseramsel |
|  | Hühnervögel (6) | Fasan, Rebhuhn ☆, Wachtel ☆, Auerhuhn ★, Birkhuhn ★, Haselhuhn ★ |
| **Jäger der Lüfte** | Bussarde, Milane & Adler (7) | Mäusebussard, Wespenbussard ☆, Rotmilan, Schwarzmilan, Seeadler, Steinadler ★, Fischadler |
|  | Habichte, Weihen & Falken (6) | Habicht, Sperber, Rohrweihe, Turmfalke, Baumfalke, Wanderfalke |
|  | Eulen (8) | Waldkauz, Waldohreule ☆, Sumpfohreule ★, Steinkauz ☆, Sperlingskauz ★, Raufußkauz ★, Uhu ☆, Schleiereule ☆ |
| **Am Wasser** | Enten, Gänse & Schwäne (9) | Stockente, Krickente, Reiherente, Tafelente, Gänsesäger, Höckerschwan, Graugans, Kanadagans, Nilgans |
|  | Taucher & Kormoran (3) | Haubentaucher, Zwergtaucher, Kormoran |
|  | Rallen (4) | Blässhuhn, Teichhuhn, Wasserralle, Wachtelkönig ★ |
|  | Reiher, Störche & Kraniche (6) | Graureiher, Silberreiher, Rohrdommel ☆, Weißstorch, Schwarzstorch ☆, Kranich |
|  | Watvögel & Möwen (9) | Lachmöwe, Silbermöwe, Flussseeschwalbe, Kiebitz, Großer Brachvogel, Bekassine, Waldschnepfe ☆, Flussuferläufer, Austernfischer |

#### Pilze

| Ast | Zweig | Arten |
|---|---|---|
| **Röhrlinge** | Steinpilze & Hexen (7) | Fichten-Steinpilz, Sommer-Steinpilz, Kiefern-Steinpilz ☆, Flockenstieliger Hexen-Röhrling ★, Netzstieliger Hexen-Röhrling, Satans-Röhrling ☆ ⚠, Gallenröhrling |
|  | Maronen, Rotkappen & Birkenpilze (6) | Maronen-Röhrling, Rotfußröhrling, Ziegenlippe, Gemeiner Birkenpilz, Heide-Rotkappe ☆, Pfefferröhrling |
|  | Schmierröhrlinge & Krempling (6) | Butterpilz, Goldröhrling, Kuhröhrling, Sandröhrling, Kornblumen-Röhrling ☆, Kahler Krempling ⚠ |
| **Wulstlinge, Champignons & Täublinge** | Wulstlinge (7) | Fliegenpilz ⚠, Pantherpilz ⚠, Grüner Knollenblätterpilz ⚠, Kegelhütiger Knollenblätterpilz ☆ ⚠, Gelber Knollenblätterpilz, Perlpilz, Grauer Wulstling |
|  | Schirmlinge & Champignons (4) | Parasol, Safranschirmling, Wiesen-Champignon, Karbol-Champignon ⚠ |
|  | Täublinge & Milchlinge (8) | Speise-Täubling, Frauen-Täubling, Spei-Täubling ☆ ⚠, Ocker-Täubling, Echter Reizker, Fichten-Reizker, Birken-Milchling, Brätling ★ |
| **Weitere Blätterpilze** | Büschel am Holz (9) | Hallimasch, Dunkler Hallimasch, Stockschwämmchen, Grünblättriger Schwefelkopf ⚠, Rauchblättriger Schwefelkopf, Sparriger Schüppling, Austernseitling, Samtfußrübling, Buchen-Schleimrübling |
|  | Ritterlinge & Rötlinge (8) | Violetter Rötelritterling, Nebelkappe, Mönchskopf, Grünling ☆ ⚠, Tiger-Ritterling ★ ⚠, Gemeiner Erdritterling, Mairitterling, Riesen-Rötling ★ ⚠ |
|  | Tintlinge, Schwindlinge & Rüblinge (10) | Schopf-Tintling, Glimmer-Tintling, Nelken-Schwindling, Knoblauch-Schwindling ☆, Mäuseschwanz, Fichtenzapfen-Rübling, Grubiger Wurzelrübling, Rosa Rettich-Helmling, Violetter Lacktrichterling, Rötlicher Lacktrichterling |
|  | Häublinge, Risspilze & Rauköpfe (5) | Gifthäubling ⚠, Spitzkegeliger Kahlkopf ☆ ⚠, Ziegelroter Risspilz ★ ⚠, Orangefuchsiger Raukopf ★ ⚠, Spitzgebuckelter Raukopf ☆ ⚠ |
| **Leisten, Stacheln & Porlinge** | Pfifferlinge & Stoppelpilze (5) | Pfifferling, Trompeten-Pfifferling, Herbsttrompete, Semmel-Stoppelpilz, Falscher Pfifferling |
|  | Porlinge & Baumschwämme (9) | Schwefelporling, Zunderschwamm, Schmetterlings-Tramete, Flacher Lackporling, Schuppiger Porling, Birkenporling, Rotrandiger Baumschwamm, Riesenporling, Leberreischling |
|  | Glucke & Stachelbärte (3) | Krause Glucke, Igel-Stachelbart ☆, Ästiger Stachelbart |
| **Wunderliche Formen** | Korallen, Keulen & Gallert (7) | Goldgelbe Koralle ☆, Herkuleskeule ☆, Judasohr, Goldgelber Zitterling, Vielgestaltige Holzkeule, Geweihförmige Holzkeule, Mutterkorn ⚠ |
|  | Boviste, Erdsterne & Stinkmorcheln (6) | Riesenbovist, Flaschen-Stäubling, Dickschaliger Kartoffelbovist ⚠, Halskrausen-Erdstern, Gemeine Stinkmorchel, Tintenfischpilz |
|  | Morcheln, Becherlinge & Trüffel (8) | Speise-Morchel, Spitz-Morchel ☆, Frühjahrs-Lorchel ⚠, Herbst-Lorchel, Orangeroter Becherling, Zinnoberroter Kelchbecherling, Sommer-Trüffel ★, Hirschtrüffel ☆ |

#### Pflanzen

| Ast | Zweig | Arten |
|---|---|---|
| **Sträucher & Ranken** | Beeren- & Dornsträucher (7) | Schlehe, Eingriffeliger Weißdorn, Hunds-Rose, Echte Brombeere ★, Himbeere, Gewöhnliche Berberitze, Sanddorn ☆ |
|  | Holunder, Schneeball & Heckensträucher (11) | Schwarzer Holunder, Roter Holunder, Gewöhnlicher Schneeball, Wolliger Schneeball, Roter Hartriegel, Gewöhnliche Hasel, Faulbaum, Purgier-Kreuzdorn, Gewöhnliches Pfaffenhütchen ⚠, Gewöhnlicher Liguster ⚠, Rote Heckenkirsche |
|  | Ranken, Immergrüne & Ginster (9) | Gemeiner Efeu ⚠, Gewöhnliche Waldrebe, Wald-Geißblatt ☆, Mistel ⚠, Europäische Stechpalme ⚠, Gewöhnlicher Wacholder, Besenginster, Gewöhnlicher Goldregen ★ ⚠, Echter Seidelbast ⚠ |
| **Frühblüher** | Weiße & gelbe Teppiche (8) | Buschwindröschen, Gelbes Windröschen, Scharbockskraut, Bärlauch, Wald-Sauerklee, Wald-Gelbstern, Wechselblättriges Milzkraut, Moschuskraut ☆ |
|  | Glöckchen, Sporne & Veilchen (8) | Märzenbecher ☆, Schneeglöckchen, Hohler Lerchensporn, Gefingerter Lerchensporn ☆, Echtes Lungenkraut ☆, Leberblümchen, Wald-Veilchen, Frühlings-Platterbse |
|  | Schlüsselblumen & Huflattich (3) | Echte Schlüsselblume, Hohe Schlüsselblume, Huflattich |
| **Waldboden** | Beeren, Heide & Schattenlilien (5) | Heidelbeere, Preiselbeere, Besenheide, Schattenblümchen, Vielblütige Weißwurz |
|  | Kräuter im Schatten (11) | Waldmeister, Gewöhnliche Goldnessel, Wald-Ziest, Großes Hexenkraut, Echte Nelkenwurz, Wald-Geißbart ☆, Kleines Springkraut, Großes Springkraut, Große Brennnessel, Knoblauchsrauke, Giersch |
|  | Giftige Schönheiten (9) | Maiglöckchen ⚠, Einbeere ⚠, Wald-Bingelkraut ⚠, Gefleckter Aronstab ⚠, Roter Fingerhut ⚠, Tollkirsche ⚠, Christophskraut ☆ ⚠, Blauer Eisenhut ★ ⚠, Gelber Eisenhut ☆ ⚠ |
| **Wiese & Feld** | Korbblüten der Wiese (6) | Gänseblümchen, Gewöhnlicher Löwenzahn, Wiesen-Margerite, Gemeine Schafgarbe, Arnika, Wiesen-Flockenblume |
|  | Klee & Glockenblumen (5) | Rotklee, Weißklee, Gewöhnlicher Hornklee, Wiesen-Glockenblume, Rundblättrige Glockenblume |
|  | Bunte Wiesenblumen (9) | Wiesen-Salbei, Arznei-Thymian, Kuckucks-Lichtnelke, Rote Lichtnelke, Scharfer Hahnenfuß, Kriechender Hahnenfuß, Wiesen-Schaumkraut, Großer Wiesenknopf, Herbstzeitlose ⚠ |
|  | Ackerblumen & Schuttplätze (7) | Kornblume, Echte Kamille, Klatschmohn, Kornrade ★ ⚠, Schwarzes Bilsenkraut ★ ⚠, Gemeiner Stechapfel ☆ ⚠, Beifuß-Ambrosie ★ ⚠ |
|  | Am Wegrand (8) | Acker-Kratzdistel, Gewöhnliche Wegwarte, Echtes Johanniskraut, Gewöhnlicher Natternkopf, Kleinblütige Königskerze, Spitzwegerich, Breitwegerich, Jakobs-Greiskraut ⚠ |
|  | Doldenblütler (5) | Wiesen-Bärenklau, Wilde Möhre, Wiesen-Kerbel, Gefleckter Schierling ★ ⚠, Riesen-Bärenklau ☆ ⚠ |
| **Wasser & Moor** | Ufer & Bach (9) | Sumpfdotterblume, Sumpf-Schwertlilie, Blut-Weiderich, Echtes Mädesüß, Wasser-Minze, Gewöhnliche Pestwurz, Drüsiges Springkraut, Sumpf-Vergissmeinnicht, Bachbunge |
|  | Im Wasser & Röhricht (6) | Breitblättriger Rohrkolben, Schilfrohr, Weiße Seerose, Gelbe Teichrose, Gewöhnlicher Froschlöffel, Wasserschierling ★ ⚠ |
|  | Moor (5) | Fieberklee, Rundblättriger Sonnentau ☆, Schmalblättriges Wollgras, Gewöhnliche Moosbeere ☆, Sumpf-Porst ★ ⚠ |
| **Orchideen & Farne** | Orchideen & Türkenbund (9) | Türkenbund-Lilie, Fuchs’ Knabenkraut ☆, Breitblättriges Knabenkraut, Gelber Frauenschuh ☆, Rotes Waldvögelein ☆, Breitblättrige Stendelwurz, Vogel-Nestwurz, Großes Zweiblatt, Bienen-Ragwurz ☆ |
|  | Farne (6) | Adlerfarn, Gewöhnlicher Wurmfarn, Wald-Frauenfarn, Rippenfarn ☆, Gewöhnlicher Tüpfelfarn ☆, Hirschzunge ☆ |
|  | Schachtelhalme & Bärlapp (3) | Wald-Schachtelhalm, Acker-Schachtelhalm, Keulen-Bärlapp ☆ |

---

## 6. Umsetzung in kleinen Schritten

1. **Daten:** `Art` bekommt `ast` und `zweig` statt `gruppe`. `GRUPPEN_REIHENFOLGE` wird zu einer festen Gliederung je Kategorie in `src/data/gliederung.ts`: Äste, Zweige, Reihenfolge und Mond-Symbol. Die Testarten bekommen eine vierte Gruppierung „Konzept“ im Belastungstest-Umschalter, damit man die Einteilung neben „Vorschlag / Familie / Ordnung“ auf dem Handy vergleichen kann.
2. **Logik:** `lebensbaum()` liefert `aeste: { name, zweige: { name, eintraege }[] }[]`. Sterne gibt es nur noch für „Legendär“, und gefährliche Arten bleiben in ihrem Zweig. Tests prüfen:
   - höchstens 7 Äste je Rune,
   - jeder Zweig hat 2–12 Arten,
   - jede Art kommt genau einmal vor,
   - Schattenwurzeln = alle Arten mit Gefahr.
3. **Neue Funktionen:** `zweigFortschritt()`, `fastVolleZweige()` und `naechsteVorschlaege(naturraum, monat)`, alle als reine Logik mit Tests.
4. **Baum-Übersicht:** Knospen je Art an den Ästen, Runenring mit 12 Zeichen, die Zahl „In deiner Gegend“ und die Filter.
5. **Offener Ast:** Zweige statt Liste (`AstPanel.tsx`), Brotkrumen und Suche.
6. **Belohnungen:** Zweig blüht, Ast-Augen öffnen sich, Vorschläge „Als Nächstes“, Bonuspunkte (nach Entscheidung E3).
7. **Waldansicht:** eine Lichtung je Ast mit Wegweiser.
8. Doku pflegen (`DOKUMENTATION.md` 8, `ANFORDERUNGEN.md` 2.10) und bei „Bewegung reduzieren“ alle neuen Animationen abschwächen.

Jeder Schritt lässt sich einzeln testen und auf dem Handy anschauen. Schritt 1 allein reicht schon, um die Einteilung im Belastungstest zu vergleichen.

---

## 7. Offene Entscheidungen

| Nr. | Frage | Vorschlag |
|---|---|---|
| E1 | Einteilung wie in Abschnitt 5 übernehmen? | Ja, nach einem Blick im Belastungstest (Schritt 1) und Korrekturen |
| E2 | Sterne nur noch für „Legendär“, „sehr selten“ als verhüllte Knospe am Zweig? | Ja |
| E3 | Bonuspunkte für volle Zweige und Äste, und wie viele? | +25 AP je Zweig, +150 AP je Ast |
| E4 | Gefährliche Arten an ihrem Zweig **und** als zweite Sicht in den Schattenwurzeln? | Ja |
| E5 | Zweite Zahl „In deiner Gegend“ unter dem Runenring? | Ja, klein |
| E6 | Belege für schwer fotografierbare Arten (Spuren, Rufe)? | Eigenes Konzept, nicht Teil dieses Schritts |
| E7 | Pflanzen nach Lebensraum, Tiere und Pilze nach Verwandtschaft – unterschiedliche Logik ok? | Ja, weil Laien Pflanzen nach Ort und Zeit, Tiere nach Aussehen ordnen |
