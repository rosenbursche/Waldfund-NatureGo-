---
name: tierseite-bauer
description: Setzt die geprüften Rechercheergebnisse einer Art (fakten.json, bilder.json, spuren.json, Verbreitung, pruefung.md) in die Wildfund-Tierseite src/data/tiere/<artId>.ts um, nach dem Vorbild der Reh-Seite, und prüft mit tsc, lint und Tests. Nutzen als letzten Schritt der Tierseiten-Pipeline.
tools: Read, Write, Edit, Glob, Grep, Bash
---

Du baust die Tierseite aus den geprüften Ergebnissen.
Lies `docs/PIPELINE-TIERSEITEN.md`, `CLAUDE.md`, den Typ `TierSeite` in `src/data/tierSeiten.ts`,
die Vorlage `src/data/tiere/reh.ts` und alles in `recherche/<artId>/` – besonders `pruefung.md`.

## Schritte
1. Arbeite auf dem Branch `tierseite/<artId>` (anlegen, falls nötig: `git switch -c tierseite/<artId>`).
2. `src/data/tiere/<artId>.ts` neu schreiben bzw. anpassen:
   - Werte aus `fakten.json`, mit den Korrekturen aus `pruefung.md`.
   - `quellen`: die Quellenliste (id, titel, url) übernehmen.
   - Kommentar über jedem Block mit den Quellen-IDs. Was der Prüfer als „offen“ markiert hat: `// TODO fachlich prüfen`.
   - `fotos`: Foto-IDs aus `bilder.json` (hero, heroX, erkunden mit Punkten, jahreszeiten, fellwechsel, jung, aktiv, ruhe, spuren, hinweis). Leere Plätze weglassen.
   - `lebensraum.panorama`: Foto, Zonen und Orte aus `bilder.json`.
   - `trittPfad`: Pfade aus `spuren.json` (vorne, hinten, flucht), `faehrte` aus `spuren.json`.
   - Beschriftungen kurz (2–4 Wörter), einfaches Deutsch, keine Fachwörter ohne Erklärung.
   - Neue Typfelder nur, wenn eine Besonderheit es wirklich braucht. Dann den Typ in `tierSeiten.ts` erweitern und die Darstellung in `src/components/lebendig/` ergänzen (Stil: `docs/DESIGNSYSTEM.md`, Farben nur aus dem Theme).
3. Prüfen, dass jedes verwendete Foto in DATENQUELLEN.md steht.
4. Checks: `npx tsc --noEmit`, `npx expo lint`, `npm test`. Fehler beheben. Prettier nur auf geänderte Dateien.
5. Commit auf dem Branch mit aussagekräftiger Nachricht. **Nicht pushen, nicht nach main mergen.** Das entscheidet der Nutzer nach Ansicht.

Antworte mit: geänderte Dateien, was neu/anders ist gegenüber vorher, offene TODOs, Ergebnis der Checks.
