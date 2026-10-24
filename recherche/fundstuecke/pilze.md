# Fundstücke Pilze (Gruppe `pilze`)

Stand: 24.10.2026. Daten: `pilze.json`. 9 Arten, zusammen 41 Fundstücke.

## Kurzfassung

| Art | Lüneburger Heide | Fundstücke | Hauptquellen |
|---|---|---|---|
| fliegenpilz | ja (GBIF: 1093 Nachweise) | 5 | DGfM Pilz des Jahres 2022, Spektrum, Merkblatt Wulstlinge (Pilzberater Südwestsachsen) |
| knolli | ja (94) | 6 | DGfM Pilz des Jahres 2019, Merkblatt Wulstlinge, DGfM-Flyer |
| tintling | ja (357) | 5 | DGfM Pilz des Jahres 2024, Spektrum |
| hallimasch | ja (A. mellea 6, A. ostoyae 53) | 7 | Pflanzenschutzamt Berlin, waldwissen.net (WSL), Spektrum |
| steinpilz | ja (197) | 4 | Spektrum, waldwissen.net, BArtSchV |
| pfifferling | ja (92) | 3 | Spektrum, waldwissen.net, BArtSchV |
| glucke | ja (126) | 4 | Pflanzenschutzamt Berlin |
| satan | nein (0) | 4 | Spektrum, DGfM-Flyer |
| stachelbart | ja, sehr selten (2) | 3 | DGfM Pilz des Jahres 2026 |

**Vorkommen in der Lüneburger Heide:** Ich habe GBIF-Nachweise (Deutschland, mit Koordinaten, ohne Geo-Fehler) im Rechteck um die Heide geholt und selbst mit dem Polygon aus `src/data/naturraeume.json` abgeglichen. Nichts davon wurde gespeichert, und `scripts/gbif-verbreitung.mjs` lief nicht, weil es Dateien in `src/` schreibt. Für eine Veröffentlichung braucht es noch einen GBIF-Download mit DOI.

**Monate:** Wo keine Fachquelle Monate nennt (Steinpilz, Pfifferling, Satans-Röhrling), stammen sie aus der Monatsverteilung der GBIF-Meldungen in Deutschland seit 2000. Gezählt sind Monate mit mindestens 3 % der Meldungen. Das steht so auch in den Quellen.

## Schutzhinweise

- Bei jedem Pilz steht: nur fotografieren, nichts essen, was nicht eine Pilzsachverständige geprüft hat. Den Rat, Sammelgut prüfen zu lassen, gibt die DGfM (2019).
- **Knollenblätterpilz:** tödlich giftig, schon etwa 50 g können tödlich sein (DGfM). Laut DGfM-Flyer gibt es **keine kontaktgiftigen Pilze** („Kinder dürfen alle Pilze anfassen“). Den Hinweis „nicht anfassen bzw. Hände waschen“ gibt es deshalb nur als Vorsichtsregel der App. Im Text steht er neben der DGfM-Aussage und ist im JSON unter `offen` vermerkt. Keine Quelle nennt Händewaschen.
- **Steinpilz und Pfifferling** sind nach BArtSchV Anlage 1 besonders geschützt. Erlaubt sind nur geringe Mengen für den Eigenbedarf (§ 2). Das passt zu `schutz: 1` in `arten.ts`.
- **Igel-Stachelbart:** Rote Liste Deutschland 2 (stark gefährdet). Die DGfM bittet, Wildbestände zu schonen. Nach BArtSchV ist er **nicht** geschützt, er steht nicht in Anlage 1. Bei ihm steht zusätzlich: Fundort nie genau teilen, Totholz liegen lassen.
- **Hallimasch:** Rinde nie abreißen, Myzel und Rhizomorphen nur dort ansehen, wo die Rinde schon fehlt.
- Unterseiten (Lamellen, Röhren, Leisten) mit einem Spiegel ansehen statt den Pilz abzubrechen. Das ist ein Tipp aus dem DGfM-Flyer.

## Auffälligkeiten

- **Hallimasch:** In der Heide stammen fast alle GBIF-Nachweise vom Dunklen Hallimasch (*A. ostoyae*, 53), nur 6 vom Honiggelben (*A. mellea*, der Art in der App). Laut WSL lassen sich die Arten meist nur im Labor sicher trennen. Die Fundstücke gelten deshalb für die Gattung.
- **Hallimasch-Rhizomorphen** sind gut belegt: Berlin beschreibt sie als 1–2 mm dick und dunkel-schwarz, Spektrum als schwarzbraun, meterlang und mit weißem Mark. Auch das Fächermyzel und das Leuchtholz (Spektrum: „bisweilen“) sind belegt.
- **Knollenblätterpilz, Ring:** Die DGfM nennt den Ring „oberseits gerieft“, das Merkblatt Wulstlinge „nicht oder nur undeutlich gerieft“. Wegen des Widerspruchs habe ich die Riefung weggelassen.
- **Hexenringe** erklärt der DGfM-Flyer nur allgemein. Für keine der 9 Arten fand ich einen Beleg, deshalb gibt es kein Fundstück dazu.

## Abweichungen von `src/data/arten.ts`

- **knolli:** Größe „Hut 5–15 cm“, laut DGfM bis 12 cm. In „wusstestDu“ steht „in Europa“, die DGfM schreibt „Mitteleuropa“.
- **hallimasch:** In „wusstestDu“ steht „in Oregon“. Spektrum nennt für *A. ostoyae* Washington (über 600 ha) und einen noch größeren Fund von ca. 880 ha, dessen Ort im gelesenen Text abgeschnitten war. Der DGfM-Flyer schreibt nur „in Amerika“, 880 ha. Der Ort „Oregon“ ist damit von mir **nicht belegt** (der TODO-Kommentar dort passt).
- **steinpilz:** Größe „Hut 8–25 cm“, laut Spektrum bis 35 cm. Lebensraum „Fichten- und Buchenwälder“, laut Spektrum Laub- und Nadelwald, bevorzugt Sandböden mit Rohhumus (passt gut zur Heide). Saison „Juli–Okt“, laut GBIF auch noch November.
- **glucke:** Saison „Aug–Nov“, laut Berlin Juli–November. Wirte laut Berlin: Kiefer, aber auch Fichte, Tanne, Douglasie.
- **satan:** Größe „Hut 8–25 cm“, laut Spektrum 6–25 cm. Saison „Juli–Sep“, laut GBIF Juli–Oktober. In der Lüneburger Heide nicht nachgewiesen.
- **stachelbart:** Lebensraum „Wunden alter Laubbäume“, laut DGfM 2026 frisches, stärkeres Totholz (stehend oder liegend) alter Buchen oder Eichen. Wunden erwähnt die DGfM nicht. Saison „Aug–Nov“, laut DGfM September–November.
- **tintling, fliegenpilz, pfifferling:** keine Abweichungen gefunden.

## Offene Punkte

- **Pfifferling** (3) und **Stachelbart** (3) liegen unter den gewünschten 4 Fundstücken. Hutgröße, Geruch, genaue Partnerbäume und Verwechslungsarten des Stachelbarts fand ich nicht in geöffneten Quellen.
- Für Steinpilz, Pfifferling und Satans-Röhrling stammen die Monate nur aus GBIF. Eine Fachquelle mit Monaten wäre besser.
- Die genauen Unterschiede zwischen Steinpilz und Gallenröhrling (Porenfarbe, Netz) waren in keiner geöffneten Quelle beschrieben.
- Die Monate für Hallimasch-Myzel, Rhizomorphen, Leuchtholz und Harzfluss sind als ganzjährig angenommen.
- Die Verbreitungskarte auf pilze-deutschland.de (DGfM) ließ sich nicht maschinell auslesen. Satans-Röhrling „nein“ beruht auf GBIF und auf seiner Bindung an Kalkböden.
- 123pilze.de habe ich nicht genutzt. Einige Lexikon-Einträge von Spektrum sind von 1999 und fachlich älter.
