# Sonderwissen Stieleiche (Quercus robur)

artId `stieleiche`, colId `4R5YN`, 13 Einträge, Prüfung `pruefeSonderwissen` ohne Fehler.

## Zusammenfassung
Hauptquellen: waldwissen.net „In und an der Eiche“ (Insekten und Pilze), SDW-Steckbrief Eiche, LIFEGENMON-Leitfaden Eichen (LWF), LWF-Merkblatt 15 (Eichenprozessionsspinner), waldwissen/LWF zu Eichenschäden und Johannistrieb, Planet Wissen und Uni Münster (Gallustinte).

- **Ökologie:** Insektenrekord, Urwaldrelikt-Käfer, Totäste und Höhlen.
- **Beziehungen:** Eichelhäher pflanzt Eichen, Eichenprozessionsspinner (mit Sicherheitshinweis), Pilzpartner (Igel-Stachelbart, Riesenporling).
- **Nutzung und Geschichte:** Eisengallustinte, Schiffbau und Lohgerberei, Schweinemast.
- **Mitmachen:** Stiel oder Traube, Mehltau, Blüte.
- **Verhalten:** Johannistrieb.

## Die 3 besten Einträge
1. **haehersaat:** Ein Eichelhäher versteckt bis zu 5.000 Eicheln und trägt sie bis zu 5 km weit (SDW, LIFEGENMON). Mit Herbst-Meldung.
2. **gallustinte:** Galläpfel plus Eisensalz ergeben die meistbenutzte Tinte des Mittelalters (Planet Wissen, Uni Münster).
3. **insektenrekord / urwaldkaefer:** 179 Großschmetterlings- und über 1.000 Käferarten. 66 von 115 Urwaldreliktarten nutzen Eichen.

## Monate für Saison-Meldungen
| Eintrag | Monate | Meldung |
|---|---|---|
| bluete | 4–5 | ja |
| prozessionsspinner | 5–7 | ja (Warnung) |
| johannistrieb | 6–7 (abgeleitet) | ja |
| mehltau | 7–9 (grob) | nein |
| mast-schweine, stiel-oder-traube | 9–10 | nein |
| haehersaat | 9–11 | ja |

## Widersprüche
- Alter: SDW nennt „500jährige keine Seltenheit, in Einzelfällen bis 1000 Jahre“, waldwissen „Einzelbaumalter über 1.000 Jahren“.
- Eicheln für Menschen: Es gibt nur Ratgeberseiten, deshalb kein Eintrag zu essbar oder giftig.

## Abweichungen von den App-Daten
| Stelle | App | Quellen | Vorschlag |
|---|---|---|---|
| `arten.ts` `saison` | „Eicheln Sep–Okt“ | LIFEGENMON: reifen Ende Sep/Anfang Okt. `fundstuecke.json` 9–11 | passt (siehe `recherche/fundstuecke/baeume-a.md`) |
| `arten.ts` `groesse` | „bis 40 m“ | SDW: „bis über 40 m“ | passt |
| `arten.ts` `wusstestDu` | „Hunderte Insektenarten – mehr als fast jeder andere heimische Baum“ | waldwissen: „Von allen heimischen Baumarten leben in und an der Eiche die meisten Insektenarten“ | Man könnte „mehr als jeder andere heimische Baum“ schreiben. Es ist eher zu vorsichtig als falsch. |
| `baumarten.ts` `hoechstalter: 800 // TODO` | 800 | SDW: Einzelfälle bis 1000 Jahre. waldwissen: über 1.000 | Vorschlag: 1000 mit Quelle |
