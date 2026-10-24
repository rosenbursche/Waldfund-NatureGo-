# Fundstücke Vögel – Zusammenfassung

Stand: 24.10.2026. Daten: `voegel.json`. Pilotregion Lüneburger Heide.

## Ergebnis je Art

| Art | Fundstücke | Lüneburger Heide | Beleg |
|---|---|---|---|
| Amsel | 6 (Gesang, Warnruf, Männchen, Weibchen, gewendetes Laub, Mauserfeder) | ja | Rote Liste Nds. 2022, Region Tiefland-Ost: * |
| Kohlmeise | 4 (Gesang, Ruf, Sichtung, Männchen/Weibchen) | ja | wie oben |
| Rotkehlchen | 5 (Gesang, Warnruf, Sichtung, Nahbegegnung, Jungvogel) | ja | wie oben |
| Eichelhäher | 4 (Rätsch-Ruf, blaue Feder, Sichtung, Eichel-Transport) | ja | wie oben |
| Buntspecht | 5 (Trommeln, Kix-Ruf, Spechtschmiede, Feder, Sichtung) | ja | NABU Niedersachsen: flächendeckend in Niedersachsen |
| Schwarzspecht | 6 (Ruf, Flugruf, Trommeln, Hackspuren, Höhle nur außerhalb der Brutzeit, Sichtung) | ja, Schwerpunkt | NLWKN 2022: Schwerpunkt u. a. „Lüneburger Heide mit Wendland“, wertbestimmend in V24 |
| Eisvogel | 4 (Pfiff, Blauer Blitz, Warte, Wintergast) | ja, Schwerpunkt | NLWKN 2011: Verbreitungsschwerpunkt u. a. Lüneburger Heide (Wendland) |
| Uhu | 2 (Ruf, Sichtung) | ja, selten | NLWKN 2011: Vorkommen in V38 Große Heide bei Unterlüß; Schwerpunkt aber Bergland |
| Wiedehopf | 2 (Ruf, Sichtung) | ja, sehr selten | NLWKN 2017: wertbestimmend in V30 Truppenübungsplätze Munster; NNA 2025: Lüneburger Heide eins von drei Vorkommensgebieten in Nds. |
| Schwarzstorch | 2 (Segelflug, Nahrungssuche) | ja, selten | NLWKN 2017: wertbestimmend in V30 Munster, V32 Bergen, V34 Südheide (+ V31 Ostenholzer Moor) |

Insgesamt 40 Fundstücke, davon 15 Stimmen (inkl. Trommeln).

## Schutz-Grundsätze (in `schutz` eingetragen)
- **Federn:** nur fotografieren. Europäische Vogelarten sind besonders geschützt (§ 7 Abs. 2 Nr. 13 b bb BNatSchG), erkennbare Teile gelten als „Tiere“ (§ 7 Abs. 2 Nr. 1 c), Besitz ist verboten (§ 44 Abs. 2 Nr. 1). NABU Bremen: Federsammlung ohne Ausnahmegenehmigung verboten, „selbst eine wahrlich häufige Amselfeder muss im Wald verbleiben“.
- **Nester/Brutplätze:** keine Fundstücke für Nester, Brutröhren, Horste. Einzige Ausnahme: Schwarzspechthöhle, nur August–Januar (Brutzeit laut NLWKN Februar–Juli) und mit Hinweis auf § 44 Abs. 1 Nr. 3.
- **Uhu, Eisvogel, Schwarzstorch, Wiedehopf:** nur zufällige Sichtungen/Rufe vom Weg aus; Hinweis „nicht nachgehen, keine Rufe abspielen, Fundort nie genau teilen“. Gewölle (Uhu) und Brutröhre/Gräten (Eisvogel) bewusst weggelassen, weil sie an Brut- und Ruheplätzen liegen.

## Abweichungen von den App-Daten
- **Verbreitung (`src/data/verbreitung.ts`):** Schwarzspecht und Schwarzstorch stehen auf `mountain`, Uhu auf `mountainWide`, Wiedehopf auf `wiedehopf`. Keiner dieser Muster hat einen Schwerpunkt im Raum Lüneburger Heide (ca. 10° O / 53° N); Wiedehopf hat dort Grundwert 0. Laut NLWKN kommen aber alle vier in der Lüneburger Heide vor, der Schwarzspecht hat dort sogar einen Schwerpunkt. Prüfen.
- **`steckbriefe.ts` → `spuren`:**
  - Eisvogel: „Brutröhren in steilen Lehmufern, oft mit Fischgräten am Eingang“ lädt zum Aufsuchen von Brutplätzen ein. Vorschlag: auf Ruf und Flug umstellen.
  - Uhu: „Gewölle … unter dem Schlafplatz“ – laut NLWKN unter Sitzwarten in Brutplatznähe. Ebenso umstellen.
  - Schwarzstorch: „Große, dreizehige Trittsiegel im Schlamm an Bächen“ – keine Quelle gefunden.
  - Wiedehopf: „Kleine Stocherlöcher in kurzem Gras“ – keine Quelle gefunden.
  - Kohlmeise: „Aufgehackte Samenschalen“ – keine Quelle gefunden.
- **Schwarzspecht `lebensraum`:** „Alte Buchen- und Nadelwälder“ passt; NLWKN betont für Niedersachsen alte Kiefernwälder der Heideaufforstungen.
- **Buntspecht `wusstestDu`:** „bis zu 20 Schläge pro Sekunde“ – NABU Niedersachsen bestätigt „rund 20 Schläge pro Sekunde“. LBV nennt 10–15 Schläge pro Wirbel (bis 2 s); kein Widerspruch.
- **Rote Liste:** Wiedehopf `roteListe: '3'` = Deutschland (RL D 3). In Niedersachsen Kategorie 2. Schwarzstorch in Niedersachsen Kategorie 1, Deutschland ungefährdet (*); Eisvogel in Nds. Vorwarnliste.

## Auffälligkeiten
- nabu.de war während der Recherche offline. NABU-Seiten wurden über die Archivfassung (web.archive.org, Stand 2025) gelesen; in `quellen` steht die Archiv-URL.
- Viele Monate für Stimmen sind nur grob belegt („Vorfrühling“, „Herbst“). Was abgeleitet ist, steht je Art unter `offen`.
- Für Uhu, Wiedehopf und Schwarzstorch gibt es nur 2 Fundstücke (Regel 4–10). Mehr wäre nur über Brut- oder Ruheplätze möglich. Diese Arten bleiben echte Glückstreffer (Findbarkeit 4).

## Offene Punkte
1. Ende der Gesangszeit Kohlmeise; Rufmonate Wiedehopf; genaue Trommelmonate Buntspecht/Schwarzspecht. Mögliche Quelle: Südbeck et al., Methodenstandards (DDA). Die DDA-Tabelle der Erfassungstermine ist frei online, die Spalten ließen sich aber im PDF nicht sicher den Monaten zuordnen.
2. Buntspecht-Höhle (im Konzept genannt): Brutmonate und Merkmale fehlen noch.
3. Amsel-Nest im Winter (nach der Brutzeit) als mögliches Fundstück; Brutmonate fehlen.
4. Unterschied Spechtschmiede-Zapfen zu Eichhörnchen-Zapfen mit Quelle belegen (z. B. Bergmann & Klaus 2016, „Spuren und Zeichen der Vögel Mitteleuropas“).
5. Bestandszahlen Uhu und Wiedehopf in der Lüneburger Heide selbst.
6. Ob Niedersachsen Horstschutzzonen (Schwarzstorch) gesetzlich regelt.
7. Stimmen-Aufnahmen: Lizenz für Tonbeispiele (z. B. xeno-canto, tierstimmen.de) ist nicht Teil dieser Recherche.
