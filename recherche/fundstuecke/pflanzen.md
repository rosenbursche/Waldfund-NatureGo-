# Fundstücke – Gruppe Pflanzen

Stand: 24.10.2026. Daten: `pflanzen.json` (16 Arten, 64 Fundstücke). Pilotregion: Lüneburger Heide.

## Kurzfassung

- **Hauptquelle** für Merkmale, Blühmonate, Giftigkeit und Schutzstatus ist **FloraWeb (BfN)**: Seiten „Morphologie“, „Gefährdung und Recht“ und „Nutzung“. Dazu kommen BfR (Giftpflanzen), BfN- und NLWKN-Artenschutzpapiere, BUND-Steckbriefe (SH, MV, Bayern), SDW/Forst BW, Uni Bayreuth, Amt für Wald Graubünden und BAFU (Schweiz, Sonnentau).
- **Lüneburger Heide** wurde mit GBIF geprüft: Nachweise seit 2000 im Polygon `lueneburger-heide` aus `src/data/naturraeume.json`. Ausgewertet wurden nur Zählungen, keine Koordinaten. Ergebnis:
  - **ja**: Buschwindröschen (658), Sauerklee (387), Sonnentau (281), Hasel (860), Holunder (600), Schlehe (438), Weißdorn (139) und Arnika (BfN: Verbreitungsschwerpunkt der atlantischen Region; GBIF nur 8).
  - **nein**: Frauenschuh. Laut NLWKN wächst er in Niedersachsen heute nur im Hügelland.
  - **unsicher**: Märzenbecher (31), Schlüsselblume (158), Türkenbund (4), Eisenhut (1), Tollkirsche (1), Herbstzeitlose (4), Seidelbast (1). Bei wenigen Nachweisen kann es sich um Gartenpflanzen oder verwilderte Pflanzen handeln. Eine Fachquelle, die das Vorkommen verneint, habe ich nicht gefunden.
- **Fraßspuren an Haselnüssen** sind gut belegt (Pro Natura/Wildtier Schweiz, ANL Bayern 2025): Eichhörnchen, Wald-/Rötelmaus, Haselmaus und Haselnussbohrer.
- **Seltene Arten** (Frauenschuh, Arnika, Sonnentau, Türkenbund): Alle Hinweise lauten „nur vom Weg aus“, der Fundort soll nicht genau geteilt werden, die Findbarkeit ist 3–4. Laut BAFU schaden Tritt und Fotografieren abseits der Wege dem Sonnentau. Laut LfU Bayern schaden „Orchideentouristen“ dem Frauenschuh durch Tritt.

## Abweichungen von den App-Daten (`src/data/arten.ts`)

| Art | App | Recherche |
|---|---|---|
| Buschwindröschen | kein `giftig` | FloraWeb: giftig |
| Märzenbecher | kein `giftig`, kein `roteListe` | FloraWeb: giftig; Rote Liste D **V**, Niedersachsen 3 |
| Sauerklee | „klappt bei Sonne **oder Regen** zusammen“ | belegt ist nur Sonnenlicht (Uni Bayreuth); FloraWeb: giftig (Haeupler & Muer) |
| Schlüsselblume | kein `roteListe` | Rote Liste D **V** |
| Türkenbund | kein `roteListe` | Rote Liste D *, Niedersachsen 3; Bestäuber Nachtfalter bestätigt (FloraWeb) |
| Arnika | Blüte Juni–Aug | FloraWeb 6–7; FFH-Anhang V; Niedersachsen RL 2 |
| Frauenschuh | – | FFH-Anhang II + IV, streng geschützt (passt zu `schutz: 2`) |
| Hasel | Blüte Jan–März | FloraWeb 2(–4), Uni Bayreuth Feb–März |
| Schlehe | Blüte März–April, Früchte Okt–Nov | FloraWeb April, BUND SH Blüte 4–5, Früchte 9–11 |
| Holunder | Blüte Mai–Juni | SDW Mai–Juni, FloraWeb 6–7, BUND SH 6–8; Beeren 8–9 bestätigt (BUND SH) |
| Weißdorn | Eingriffliger Weißdorn | BUND SH: Im Norden ist der **Zweigrifflige** Weißdorn weiter verbreitet, beide Arten kreuzen sich oft |
| Eisenhut | „giftigste Pflanze **Europas**“ | BfR: „giftigste Pflanze **Mitteleuropas**“; Hautaufnahme bei längerem Kontakt bestätigt |
| Tollkirsche | Beeren Aug–Okt | BfR: Juli–Oktober |
| Seidelbast | Beeren Juni–Aug | BUND Naturschutz: Juli–August; SDW: „im Herbst“ |
| Holunder | kein Gifthinweis | BfR: mittelschweres Vergiftungsrisiko (roh/unreif); FloraWeb: Kerne schwach giftig |

Schutzstatus (FloraWeb, BNatSchG): **besonders geschützt** sind Märzenbecher, Schlüsselblume, Türkenbund, Arnika, Sonnentau, Eisenhut und Seidelbast. **Streng geschützt** ist der Frauenschuh. **Nicht besonders geschützt** sind Buschwindröschen, Sauerklee, Hasel, Holunder, Schlehe, Weißdorn, Tollkirsche und Herbstzeitlose. Das passt zu den `schutz`-Werten der App.

## Offene Punkte

- **Wenige Fundstücke**: Türkenbund und Märzenbecher haben je 2, Buschwindröschen, Frauenschuh, Eisenhut und Herbstzeitlose je 3. Früchte und Kapseln sind zwar beschrieben, für sie fand ich aber keine belegten Monate. Deshalb habe ich sie weggelassen und unter `offen` vermerkt.
- **Abgeleitete Monate** sind in `offen` gekennzeichnet: Nüsse und Fraßspuren (Nussjagd-Zeitraum Sept.–Nov.), Schlüsselblumen-Kapsel und Arnika-Samen („ab Ende Mai/Juni“), Herbstzeitlosen-Blätter („im Frühjahr“ = März–Mai), Blätter sommergrüner Sträucher als Kernzeit Mai–Sept.
- **Für andere Gruppen** gefunden, hier nicht aufgenommen: Holunder als Fegeholz des Rehs (Graubünden) und Neuntöter-Beute auf Schlehendornen (SDW).
- Ob die **Haselmaus** in der Lüneburger Heide vorkommt, habe ich nicht geprüft. Nicht belegt sind auch Vögel als Nussöffner.
- Ein Beleg aus Niedersachsen, dass man im Moor auf Bohlenwegen bleiben soll, fehlt noch. Der Hinweis stützt sich auf BAFU und die Projektregel.
- Den Wildstatus von Schlüsselblume und Märzenbecher in der Heide sollte jemand prüfen, der die Flora vor Ort kennt (z. B. NLWKN Pflanzenarten-Erfassungsprogramm).

## Methode

FloraWeb-Seiten, PDFs (pdftotext) und BfR-Seiten habe ich vollständig als Text geladen und gelesen, teils mit `curl` statt WebFetch, um den Volltext zu bekommen. Die GBIF-Zählungen stammen aus der Occurrence-API (`hasGeospatialIssue=false`, Jahr 2000–2026). Wikipedia habe ich nicht verwendet.
