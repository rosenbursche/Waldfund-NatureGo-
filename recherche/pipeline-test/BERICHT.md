# Pipeline-Test C3: Sonderwissen aus geladenen Quellen, nur mit dem Claude-Abo

Stand: 26.10.2026 · 10 Arten · ohne API-Kosten

## Kurz gesagt
- **Das Verfahren funktioniert und ist deutlich sparsamer als die freie Recherche.** Es läuft so: Quellen vorher automatisch laden, dann Einträge nur aus diesen Texten schreiben, jeder mit wörtlichem Zitat, und zum Schluss alle Zitate per Skript prüfen.
- **Die Zitate stimmen alle:** 205 von 205 Zitaten stehen wörtlich in der gespeicherten Quelle. Das Skript prüft das ohne KI.
- **Aber ein echtes Zitat heißt noch nicht, dass der Text stimmt.** Bei der Inhaltsprüfung waren 3 von 95 Einträgen (3 %) **nicht gedeckt**: eigenes Vorwissen war hineingerutscht. 15 Einträge (16 %) waren **teilweise** gedeckt, mit kleinen Ausschmückungen oder Verallgemeinerungen. 77 (81 %) waren sauber.
- **Wikipedia allein reicht für Wow-Wissen erstaunlich gut**, hat aber Fehler. Gefunden habe ich einen Quellenfehler (Skateboards aus „kanadischem Berg-Ahorn“) und ungeprüfte Heilwirkungen (Giersch, Zunderschwamm). Für Sicherheitsthemen und Wow-3-Fakten braucht es zusätzlich eine Fachquelle.
- **Mit dem Abo schafft man realistisch etwa 10 bis 20 Arten pro Nutzungsfenster**, wenn jede Charge in einer **frischen, kurzen Sitzung** läuft. In dieser langen Sitzung war das Limit schon nach 4 Arten erreicht, weil der ganze Verlauf aus C1 und C2 bei jedem Schritt mitgeschickt wurde.

## Ablauf
1. **Quellen laden** (`scripts/db-pipeline-quellen.mjs`, kostenlos): 50 Arten ausgewählt, die meisten GBIF-Nachweise je Gruppe ohne vorhandenes Sonderwissen. Gespeichert wurden die deutsche und die englische Wikipedia mit Versionsnummer. Die Texte liegen in `quellen/<artId>/`, sie sind nicht eingecheckt.
2. **Schreiben** (Claude im Abo): 10 Arten, nur aus den geladenen Texten. Ab der Amsel habe ich lange Artikel **gezielt** gelesen, erst die Gliederung und dann die passenden Abschnitte.
3. **Zitatprüfung ohne KI** (`scripts/db-pipeline-zitate.mjs`): Jedes Zitat wird wörtlich im Quelltext gesucht. Dazu laufen die bekannten Prüfregeln (`pruefeSonderwissen`). Ergebnis in `zitatpruefung.json`.
4. **Inhaltsprüfung**: Jeder Eintrag wird Satz für Satz mit der Quelle verglichen. Ergebnis in `inhaltspruefung.json`, mit dem Stand vor der Korrektur.

## Zahlen

| Art | Einträge | Wow 3 | gelesen (Zeichen) | Lesart |
|---|---|---|---|---|
| Große Brennnessel | 11 | 3 | 37.000 | DE ganz, EN gezielt |
| Giersch | 8 | 1 | 22.000 | DE ganz |
| Berg-Ahorn | 10 | 5 | 34.000 | DE ganz |
| Zunderschwamm | 10 | 3 | 28.000 | DE ganz |
| Judasohr | 7 | 2 | 18.000 | DE ganz |
| Amsel | 11 | 3 | 31.000 | 8 von 34 Abschnitten |
| Kohlmeise | 9 | 4 | 22.000 | 7 von 28 Abschnitten |
| Mäusebussard | 9 | 3 | 20.000 | 7 von 19 Abschnitten |
| Europäischer Maulwurf | 10 | 3 | 35.000 | 9 von 23 Abschnitten |
| Dachs | 10 | 4 | 17.000 | 13 von 17 Abschnitten |
| **Summe** | **95** | **31** | **264.000** | |

- **Zitate:** 205, davon 205 gefunden. Keines war zu lang, keines fehlte, die Prüfregeln meldeten 0 Fehler.
- **Inhalt (vor der Korrektur):** 77 gedeckt, 15 teilweise, 3 nicht gedeckt. Die 3 Fehler und 2 Übertreibungen sind inzwischen korrigiert.
- **Gezieltes Lesen** über die Gliederung brauchte bei langen Artikeln nur 25 bis 40 % des Textes. Bei der Qualität habe ich keinen Unterschied gesehen.

## Gute Beispiele
- **Maulwurf, Speisekammer:** bis zu 790 Regenwürmer in einer Vorratskammer, mit abgebissenen Kopfsegmenten betäubt. Wow 3, zwei wörtliche Zitate, mit Monaten.
- **Kohlmeise, Schlangenzischen:** Das brütende Weibchen täuscht in der Höhle eine Schlange vor. Wow 3, mit Schutzhinweis für Nistkästen.
- **Berg-Ahorn, Propeller:** 16 Umdrehungen pro Sekunde, oft über 100 m Flug. Dazu eine Mitmach-Meldung für September und Oktober.
- **Mäusebussard, Katzenadler-Irrtum:** eine falsche Herleitung, die bis heute in Vogelbüchern steht. Belegt mit dem Brehm-Zitat.

## Schlechte Beispiele (aus der Inhaltsprüfung)
- **Berg-Ahorn:** „In Dänemark wächst er nicht von Natur aus.“ Die Quelle nennt Dänemark sogar bei den Fundorten. Das Zitat dazu war echt, die Zusatzaussage nicht. → **Genau diesen Fehler findet die reine Zitatprüfung nicht.**
- **Dachs:** „Begasung der Fuchsbaue, um die Tollwut zu bekämpfen.“ Die Tollwut stand nicht in der Quelle, das war Vorwissen. Ähnlich bei der Herleitung von „Dachshund“.
- **Mäusebussard:** „Die meisten deutschen Bussarde …“ und „jedes Jahr über 10.000“. Die Quelle sagt „ein großer Teil“ und nennt Zählungen nur von 1987 bis 1990.
- **Quelle selbst falsch:** Wikipedia (de) schreibt von Skateboards aus „kanadischem Berg-Ahorn“. Der Berg-Ahorn wächst in Kanada nicht von Natur aus, gemeint ist vermutlich der Zucker-Ahorn. Ich habe das nicht übernommen. Die Zitatprüfung hätte den Fehler trotzdem als „gedeckt“ durchgelassen.

## Vergleich mit der Hand-Recherche (C2, 10 Arten mit Fachquellen)
| | C2: freie Suche, Fachquellen | C3: Wikipedia, vorher geladen |
|---|---|---|
| Einträge je Art | 7–15 (Schnitt 11) | 7–11 (Schnitt 9,5) |
| Wow 3 je Art | 2–5 | 1–5 (Schnitt 3,1) |
| Quellen je Eintrag | meist 2–3, unabhängig | fast immer nur 1 (Wikipedia) |
| Monate und Meldungen | etwa gleich | etwa gleich |
| Aufwand | viele Suchen und Seitenabrufe, Sackgassen (404, Paywall, NABU offline) | keine Suche, keine Sackgassen, etwa 26.000 Zeichen Lesen je Art |
| Schwäche | langsam und teuer | eine einzige Quelle, Quellenfehler gehen durch |

## Was das für das Abo bedeutet
- Ich kann die Token je Art in Claude Code **nicht genau messen**, die Abrechnung des Abos zeigt keine Einzelwerte. Gemessen habe ich das Lesen: etwa 26.000 Zeichen je Art, also rund 7.000 Tokens. Dazu kommt das Schreiben, etwa 10.000 Zeichen je Art.
- **Der größte Kostentreiber ist die Länge der Sitzung, nicht die Art.** Bei jedem Schritt wird der ganze bisherige Verlauf mitgeschickt. In dieser Sitzung (C1, C2 und C3 zusammen) kam das Limit nach 4 Arten. In einer frischen Sitzung, die nur die Anleitung und die Quelltexte enthält, sollten deutlich mehr Arten in ein Fenster passen. Das ist eine Schätzung, ich habe es nicht gemessen.
- **Nicht geprüft:** ob die Abo-Bedingungen so eine Dauerarbeit erlauben.

## Empfehlung
1. **Das Verfahren als Standard nehmen:** erst Quellen laden, dann mit Zitat schreiben, dann Zitate per Skript prüfen. Die Skripte sind fertig.
2. **Die Inhaltsprüfung sollte von einer anderen Sitzung kommen** als der, die geschrieben hat. Meine eigene Prüfung ist nicht unabhängig. Ich habe zwar Fehler gefunden, aber eine frische Sitzung würde wahrscheinlich mehr finden.
3. **Wikipedia als Startquelle, Fachquelle für das Wichtige:**
   - Einträge mit Wow 3 brauchen zusätzlich eine Fachquelle, zum Beispiel BfN, LWF, DWS oder eine Uni.
   - Einträge zu Giftigkeit, Essbarkeit, Schutz und Gesundheit brauchen immer eine Fachquelle.
   - Dafür reicht eine gezielte Suche je Eintrag. Eine ganze Recherche ist nicht nötig.
4. **Arbeiten in Chargen:** je **5 bis 10 Arten in einer neuen Sitzung**, mit einem eigenen Skill als kurzer Anleitung, zum Beispiel `/sonderwissen-wiki <artIds>`. Danach eine zweite kurze Sitzung nur für die Inhaltsprüfung.
5. **Nicht alle 11.547 Arten:** zuerst die 48 Arten in der App, dann die häufigsten 200 bis 500. Die 40 Arten aus der geladenen Liste sind schon vorbereitet.
6. **Vor einer Übernahme in die App:** Wikipedia (CC BY-SA) dient nur als Faktenquelle. Die Texte sind eigene Worte. Falls Einträge in die Datenbank kommen, muss Wikipedia in `DATENQUELLEN.md` als Faktenquelle eingetragen werden.

## Dateien
- `arten.json`: die 50 ausgewählten Arten. 10 davon sind bearbeitet, 40 sind vorbereitet.
- `quellen/<artId>/meta.json`: URL, Version und Lizenz je Quelle. Die Volltexte sind nicht eingecheckt.
- `ergebnis/<artId>.json`: Einträge im Sonderwissen-Format, zusätzlich mit dem Feld `zitate`.
- `zitatpruefung.json`: Ergebnis des Skripts. `inhaltspruefung.json`: Urteil je Eintrag. `protokoll.csv`: gelesene Zeichen je Art.
