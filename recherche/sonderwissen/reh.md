# Sonderwissen Reh (Capreolus capreolus)

artId `reh`, colId `QSF3`, 13 Einträge, Prüfung `pruefeSonderwissen` ohne Fehler.

## Zusammenfassung
Hauptquellen: Steckbrief der Deutschen Wildtier Stiftung (DWS), Tiersteckbrief des DJV und Infoblatt Reh 2025 des Kantons Wallis. Ergänzt durch die DWS-Meldung zum Mähtod und Reissmann et al. 2020 (Genetik schwarzer Rehe).

## Die 3 besten Einträge
1. **keimruhe:** Die Paarung ist im Juli/August, dann pausiert der Keim von August bis Dezember. Die Tragzeit dauert so 42 statt 24 Wochen (DWS, Wallis, DJV).
2. **trughirsch:** Das Reh ist mit dem Elch näher verwandt als mit dem Rothirsch (DWS, DJV).
3. **schwarze-rehe:** In Norddeutschland gibt es schwarze Rehe. Die Farbe wird rezessiv über das ASIP-Gen vererbt (DWS, Reissmann 2020).

## Monate für Saison-Meldungen
| Eintrag | Monate | Meldung |
|---|---|---|
| geweih-zyklus (Fegen) | 3–5 | ja |
| hohle-haare (Fellwechsel) | 4–5, 9–10 | nein |
| kitz-allein (Setzzeit) | 5–6 | ja (Schutzhinweis) |
| brunft | 7–8 | ja |
| keimruhe | 8–12 | nein |
| spiegel | 11–3 (abgeleitet) | nein |

## Abweichungen von den App-Daten (`src/data/tiere/reh.ts`)
| Stelle | App | Quellen | Vorschlag |
|---|---|---|---|
| `jahr.abwurf` | Monate 10–11 | DWS und Wallis: Abwurf Oktober bis Dezember | Monate 10–12 |
| `geweih` (Monatsbilder) | Dezember „bast 0.3“, November „keins“ | Abwurf Okt–Dez, Neubildung sofort (DWS) | passt als Vereinfachung |
| `groesse.gewicht` [15, 30], `// TODO` | 15–30 kg | DJV: 17–22 kg, sehr gut entwickelt bis 25 kg. Wallis: Böcke bis 30 kg, Geißen bis 25 kg. DWS: Durchschnitt etwa 18 kg | Obergrenze 30 ist belegt (Wallis). Die Untergrenze 15 hat keine Quelle, Vorschlag 17 (DJV) |
| `jung.sichtbar` | ab Juni | Kitze kommen im Mai/Juni (DWS, DJV, Wallis) | ab Mai |
| `fell` | Wechsel um Mai und Oktober | DJV: Haarwechsel April/Mai und September/Oktober | passt ungefähr |
