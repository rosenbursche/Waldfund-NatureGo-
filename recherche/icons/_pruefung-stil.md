# Stil-Prüfung Art-Icons (Prüfregel 4 „Einheitlichkeit“)

Kontaktbögen aller 73 Icons: `_stil-1.png` … `_stil-5.png`; Nachbesserungen: `_stil-fix.png`, `_stil-fix2.png`.

## Gesamteindruck
Die Reihe ist einheitlich: gleiche Tintenkontur, gleiches Licht von oben links, dunkelgrüne Scheibe mit Bokeh bzw. Boden,
Motive füllen die Scheibe meist zu 60–75 %. Keine Art mit anderem Hintergrund-Typ oder abweichender Konturstärke.

## Gefundene Ausreißer
| Art | Befund | Maßnahme |
|---|---|---|
| satan | Hut füllte fast die ganze Scheibe (x 22–98), Stielfuß am Rand abgeschnitten – größtes Motiv der Reihe | Motiv auf 86 % verkleinert und 2 px angehoben (`skaliere()` im Skript). Stiel jetzt vollständig sichtbar. |
| feldhase | schwarze Ohrspitzen am Scheibenrand abgeschnitten | Ohren 7 px tiefer gesetzt; Spitzen klar sichtbar. |
| waldkiefer | unruhige, dichte Nadelmasse (Wirrwarr bei 44 px) | Ansätze von alle 3 auf alle 5 Zweigpunkte reduziert, Spitzenbüschel 4 → 3 Paare. Deutlich ruhiger, Paare erkennbar. |
| schwarzerle | loser heller Bogenstrich links im Blatt | Strich („klebriger Glanz“) entfernt. |
| feldahorn | Lappen zu spitz, nahe am Spitzahorn | 2 Runden: Lappen kürzer, Spitzen breiter gerundet. Etwas stumpfer, aber die Lappenenden wirken weiterhin eckig. |
| stachelbart | sehr helle, große weiße Fläche – hellstes Icon der Reihe | nicht geändert (artgerecht, Rang 4 hebt sich ohnehin ab). |
| amsel, schwarzstorch, wildschwein | dunkelste Icons, Motiv dunkel auf dunkler Scheibe | nicht geändert; Lichtkanten tragen die Silhouette, bei 44 px noch lesbar. |

## Offen
- **feldahorn:** Lappen noch nicht wirklich „rund“ – die Form kommt aus `ahorn_umriss()`/`kante()` (Helfer `recherche/icons/rotbuche/baum_helfer.py`); für echte Rundlappen müsste die Spitzen-Glättung dort angepasst werden (2-Runden-Grenze erreicht).
- hasel, hainbuche: bei 44 px nur grüne Flecken (bekannt aus Arttreue-Prüfung), stilistisch unauffällig.
- reh, fliegenpilz, buschwind (aus `scripts/icon_helfer.py`) nicht geprüft/geändert – passen optisch in die Reihe.
