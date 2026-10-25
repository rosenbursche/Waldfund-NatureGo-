# Sonderwissen Eibe (Taxus baccata)

artId `eibe`, colId `5527N`, 12 Einträge, Prüfung `pruefeSonderwissen` ohne Fehler. Taxol und die Volksmedizin sind bewusst weggelassen, weil es keine Heilversprechen geben soll.

## Zusammenfassung
Hauptquellen: das SDW-Faltblatt Eibe (Kalinke & Aas 2020), LWF Wissen 10, der Baumartensteckbrief der NW-FVA und der BfR-Giftgarten. Dazu waldwissen (Erhaltung der Eibe in Bayern 2021).

## Die 3 besten Einträge
1. **pferd-und-reh:** Pferde können 5 Minuten nach dem Fressen sterben (LWF), Rehe fressen die Nadeln dagegen gern (NW-FVA, SDW).
2. **alter-ueberschaetzt:** Fortingall soll 3.000–5.000 Jahre alt sein. Gesichert sind 600–1.000 Jahre, weil Scheinstämme täuschen (NW-FVA, SDW).
3. **oetzi-bogen / jura-baum:** Ötzi hatte einen Bogen aus Eibe, und die Gattung gibt es seit rund 150 Mio. Jahren.

## Monate für Saison-Meldungen
| Eintrag | Monate | Meldung |
|---|---|---|
| maennlein-weiblein | 10–4 (Knospen ab Herbst, Blüte 3–4) | nein |
| alles-giftig, vogelverbreitung | 8–10 | ja (Warnung beim Samenmantel) |

## Widersprüche
- Höhe: SDW bis 20 m, BfR bis 10 m.
- Ältester Holzfund: SDW 300.000 Jahre (Holsteinwarmzeit), NW-FVA bis 150.000 Jahre.
- Alter: SDW „über 1.000 Jahre“ und Fortingall 3.000–5.000. NW-FVA: gesichert 600–1.000, in Deutschland vermutlich 500–800.

## Abweichungen von den App-Daten
| Stelle | App | Quellen | Vorschlag |
|---|---|---|---|
| `arten.ts` `saison` | „Samen Aug–Okt“ | BfR: ab August. NW-FVA: Samen reifen im September/Oktober, Arillus ab August | passt |
| `arten.ts` `groesse` | „bis 15 m“ | SDW: bis 20 m. BfR: bis 10 m | „bis 20 m“ (SDW) oder offen lassen |
| `arten.ts` `schutz: 0` | 0 | SDW: Rote Liste. LWF laut Suchergebnis „besonders geschützt“ (nicht geöffnet) | **prüfen.** Wenn die Eibe besonders geschützt ist, muss `schutz` höher sein. Den BArtSchV-Status kläre ich gern als Nächstes |
| `baumarten.ts` `hoechstalter: 1000 // TODO` | 1000 | NW-FVA: gesichert 600–1.000 Jahre | passt, das TODO kann mit Quelle entfernt werden |
