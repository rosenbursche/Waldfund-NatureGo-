# Sonderwissen Biber (Castor fiber)

artId `biber`, colId `RQPW`, 10 Einträge, Prüfung `pruefeSonderwissen` ohne Fehler.

## Zusammenfassung
Hauptquellen: Steckbrief der Deutschen Wildtier Stiftung und das BfN-Artenporträt. Dazu die Northwestern University (Pressemitteilung zu Gordon et al. 2015, Science) für den Zahnschmelz sowie das Jüdische Museum Berlin (Zitat Charlevoix 1754) und das Sonntagsblatt (2023) für die Fastenspeise.

## Die 3 besten Einträge
1. **eisenzaehne:** Der orange Zahnschmelz enthält Eisen und ist härter und säurefester als normaler Schmelz, sogar als Schmelz mit Fluorid.
2. **fastenfisch:** Der Biber galt in der Fastenzeit als „Fisch“. Laut Charlevoix (1754) hatte die Pariser Medizinische Fakultät ihn wegen des Schwanzes so eingestuft.
3. **comeback:** Mitte des 20. Jahrhunderts gab es in Deutschland nur noch Biber an der Mittelelbe, heute sind es mindestens 40.000.

## Monate für Saison-Meldungen
| Eintrag | Monate | Meldung |
|---|---|---|
| sanduhr | 10–3 (abgeleitet) | ja (mit Schutzhinweis) |
| fastenfisch | 2–3 | nein |
| familie | 5–6 | nein |
| wintervorrat | 11–2 | nein |

## Abweichungen von den App-Daten
| Stelle | App | Quellen | Vorschlag |
|---|---|---|---|
| `tiere/biber.ts` `jahr.junge` | 5–6 | DWS: April–Juni. BfN: Ende Mai bis Anfang Juni | passt |
| `tiere/biber.ts` `jahr.vorrat` | 10–11 | BfN: Vorräte für die Winterzeit, ohne Monate | passt |
| `tiere/biber.ts` `jahr.abwandern` | 4 | DWS: Die ältesten müssen gehen, wenn die neuen Jungen kommen (April–Juni). BfN: Umsiedeln meist im Spätsommer, wenn das Futter knapp ist | 4–6 wäre genauer. Dazu kommt ein Umsiedeln im Spätsommer |
| `tiere/biber.ts` `groesse.gewicht` | 20–30 kg | DWS: 20 bis 30 kg | passt |
| `arten.ts` `groesse` | Körper 80–100 cm | BfN: Gesamtlänge bis 1,35 m, Kelle bis 40 cm | passt ungefähr |
| `arten.ts` `roteListe` | fehlt (nur `schutz: 2`) | BfN: Rote Liste Deutschland V (Vorwarnliste, Meinig et al. 2020), FFH-Anhang II und IV | `roteListe: 'V'` ergänzen |
