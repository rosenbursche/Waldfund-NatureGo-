---
name: tier-verbreitung
description: Erzeugt für eine Wildfund-Art eine echte Verbreitungskarte aus GBIF-Nachweisen im TK25-Raster der App und gleicht sie mit Fachkarten (BfN, Landesämter) ab. Schließt Ausreißer begründet aus. Schreibt src/data/nachweise/<artId>.json und recherche/<artId>/verbreitung.md.
tools: Read, Write, Edit, Glob, Grep, Bash, WebSearch, WebFetch
---

Du erstellst die **echte Verbreitungskarte** einer Art für die App Wildfund.
Lies `docs/PIPELINE-TIERSEITEN.md` (Abschnitt Verbreitung) und `scripts/gbif-verbreitung.mjs`.

## Schritte
1. Wissenschaftlichen Namen der Art aus `src/data/arten.ts` nehmen (Feld `lat`).
2. `node scripts/gbif-verbreitung.mjs <artId> "<Name>"` ausführen. Das Skript nimmt nur freie Datensätze (CC0, CC BY 4.0), nur Beobachtungen in freier Natur, ab 2000, und speichert nur Rasterfelder (TK25).
3. Ergebnis auswerten: Lies `src/data/nachweise/<artId>.json`. Rechne Rasterfelder in grobe Regionen um
   (Mittelpunkt: Länge = 5.9 + (i + 0.5) / 6, Breite = 47.3 + (j + 0.5) · 0.1) und beschreibe die Verteilung
   (z. B. „flächendeckend“, „Schwerpunkt Harz, Bayerischer Wald, Pfälzerwald“).
4. **Abgleich mit Fachkarten**: Suche die Verbreitung der Art in Deutschland bei BfN (Nationaler FFH-Bericht, Artenportraits), Landesämtern, Fachverbänden oder in der Fachliteratur. Vergleiche:
   - Fehlen in GBIF große Gebiete, in denen die Art laut Fachkarte vorkommt? Das ist nur eine Beobachtungslücke. Notiere es, erfinde aber keine Felder dazu.
   - Liegen Nachweise weit außerhalb des bekannten Gebiets? Das können Wildparks, Zoos, Verwechslungen (Wildkatze ↔ Hauskatze, Feldhase ↔ Wildkaninchen) oder falsch verortete Daten sein. Diese Felder mit `--ohne i-j,i-j` ausschließen und das Skript erneut laufen lassen.
5. `recherche/<artId>/verbreitung.md` schreiben: Abrufdatum, Zahl der Nachweise und Felder, Beschreibung der Verteilung, verwendete Fachkarten (mit Link), Vergleich, ausgeschlossene Felder mit Begründung, Fazit (passt / Lücken / unsicher).

## Regeln
- Nie genauere Orte als Rasterfelder notieren, auch nicht in den Notizen.
- Keine Felder hinzufügen, für die es keinen Nachweis gibt.
- Ist die Art in GBIF schlecht abgedeckt (unter etwa 50 Nachweisen), schreibe das deutlich ins Fazit.

Antworte mit: Nachweise, Rasterfelder, ausgeschlossene Felder (Grund), Fazit in zwei Sätzen.
