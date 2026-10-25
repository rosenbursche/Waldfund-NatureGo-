# Sonderwissen: Schwarzer Holunder (Sambucus nigra)

Datei: `recherche/sonderwissen/holunder.json`. Sie enthält 15 Einträge und 17 Quellen, alle am 25.10.2026 abgerufen. Die Prüfung mit `pruefeSonderwissen` ergibt eine leere Fehlerliste.

## Zusammenfassung
- **Giftig:** Sambunigrin (Quellen: LWF, BfR, gesundheit.gv.at, Wochenblatt, PZ), Zwerg-Holunder/Attich (Hamburg, ökoLeo), Trauben-Holunder mit braunem Mark und Vergleich der Früchte (LWF-Tabelle).
- **Rezepte:** Holunderblüten-Sirup (ökoLeo, Umweltportal für Kinder in Hessen) und Holunderbeersaft aus dem Topf (Wochenblatt für Landwirtschaft und Landleben). Beide haben einen Sicherheitshinweis.
- **Geschichte:** Frau Holle wohnt im Holunder, Badewasser von Neugeborenen, Schutz vor Blitz. Den Hut ziehen, Hausbaum/Schutzbaum, Umhauen bringt Unglück. Alles ist als Sage oder früherer Glaube gekennzeichnet.
- **Name** (Holler, Holder, Flieder; Herkunft ungeklärt), **Holundermark** (Mikroskopie-Handschnitt, Blasrohre), **Färben**.
- **Ökologie und Beziehungen:** 62 bzw. über 60 Vogelarten, Insekten (Käfer und Fliegen bestäuben, nur 13 pflanzenfressende Arten), Stickstoffzeiger N = 9, Judasohr.
- **Meldungen:** Blüte 5–7 („Der Holunder blüht gerade. Riech mal dran!“), Beeren 8–9 (Vögel beobachten), Judasohr 11–3.

## Die besten 3
1. **judasohr** (wow 3): Ein Pilz, der fast nur auf Holunder wächst und aussieht wie ein Ohr. Er trocknet zu einem harten Klümpchen und quillt bei Regen wieder auf. Im Winter findet man ihn am besten. Quellen: Botanischer Verein Hamburg, waldwissen/LWF.
2. **hut-ziehen / frau-holle** (wow 3): Vor dem Holunder nimmt man den Hut ab. Frau Holle wohnt der Sage nach darin. Quellen: Austria-Forum (Volkskunde, beruft sich auf das Handwörterbuch des deutschen Aberglaubens), Bezirksamt Wandsbek, Pharmazeutische Zeitung.
3. **vogelbuffet** (wow 3): 62 Vogelarten fressen die Beeren und säen dabei neue Sträucher aus, sogar auf alten Mauern. Quellen: waldwissen/LWF, LBV München, BUND SH, Uni Hohenheim.

Ebenfalls stark: **holundermark**. Mikroskopiker klemmen bis heute Pflanzenteile für Schnitte in Holundermark ein.

## Widersprüche und Abweichungen von den App-Daten (`src/data/arten.ts`, id `holunder`)
- `saison: 'Blüte Mai–Juni, Beeren Aug–Sep'`: Für die Blüte nennen die Quellen Mai–Juni (SDW, Hamburg), 6–7 (FloraWeb) und 6–8 (BUND SH). Für die Reife nennen sie 8–9 (BUND SH) und September–Oktober in Österreich, je nach Sorte ab Mitte August (gesundheit.gv.at). Mai–Juli wäre für die Blüte sicherer.
- `groesse: '3–7 m'`: SDW nennt „bis über 10 m“, BUND SH „bis zu 6 m“. Das ist kein harter Widerspruch, die Obergrenze schwankt.
- `wusstestDu`: Der Text „roh unverträglich, nur gekocht“ passt zu allen Quellen.
- `schutz: 0`: Das passt. Laut FloraWeb ist der Holunder nicht besonders geschützt (siehe `recherche/fundstuecke/pflanzen.md`).
- Insekten: BUND SH nennt bis zu 20 Falterarten (Raupen oder Nektar), waldwissen 13 pflanzenfressende Insekten- und Milbenarten. Die beiden zählen unterschiedlich. Im Text steht nur die Zahl 13.

## Offen
- Keine Originalquelle von Giftinformationszentrum, Verbraucherzentrale, BZfE oder Landwirtschaftskammer gefunden (die Seite schmeck-den-sueden.de war gesperrt). Die Angabe „mindestens 20 Minuten über 80 °C“ steht nur in Presseartikeln, die sich auf die LWK Niedersachsen berufen. Darum steht im Text nur „über 80 °C“.
- Für Gelee aus Beeren gibt es kein seriöses Rezept mit Mengen. Die Erzählung zum Judasohr-Namen (Judas am Holunder) und Holundermark-Spielzeug sind nicht belegt.
- Die Texte der PDF-Quellen habe ich mit WebFetch geladen und mit `pdftotext` ausgelesen.

## Übernommen in die App (25.10.2026, Phase C1)
- `src/data/arten.ts` `saison`: „Blüte Mai–Juni“ → „Blüte Mai–Juli“ (SDW, FloraWeb, BUND SH; passt zu `fundstuecke.json` Blüte 5–7). Beeren Aug–Sep und Größe 3–7 m (FloraWeb/Rothmaler) bleiben.
