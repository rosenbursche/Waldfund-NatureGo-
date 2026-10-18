---
name: tierseite
description: Baut eine Wildfund-Tierseite nach Vorbild der Reh-Seite mit echten, belegten Daten und echten Fotos über die Agenten-Pipeline (Recherche → Verbreitung, Bilder, Spuren → Prüfung → Bau). Aufruf mit der artId, z. B. /tierseite wildschwein.
---

# /tierseite <artId>

Führt die Agenten-Pipeline aus `docs/PIPELINE-TIERSEITEN.md` für **eine** Art aus.

## Vorbereitung
1. Prüfe, dass `<artId>` in `src/data/arten.ts` existiert und ein Säugetier ist. Sonst abbrechen und den Nutzer fragen.
2. Lege `recherche/<artId>/` an.
3. Sage dem Nutzer kurz in einfachem Deutsch, was jetzt passiert und dass es eine Weile dauert.

## Ablauf (Agenten über das Agent-Werkzeug starten)
1. **tier-recherche** mit dem Auftrag: „Recherchiere die Art `<artId>`.“ Warten, bis fertig.
2. Gleichzeitig starten (in einer Nachricht):
   - **tier-verbreitung**: „Erstelle die Verbreitungskarte für `<artId>`.“
   - **tier-bilder**: „Suche alle Fotos für `<artId>`.“
   - **tier-spuren**: „Zeichne die Spuren für `<artId>`.“
3. **tier-pruefer**: „Prüfe alle Ergebnisse für `<artId>`.“
   - Bei **Freigabe nein**: Die Punkte unter „korrigieren“ an den zuständigen Agenten zurückgeben (höchstens eine Runde), dann erneut prüfen lassen.
4. **tierseite-bauer**: „Baue die Tierseite für `<artId>`.“

Falls die Agenten-Typen nicht verfügbar sind (z. B. weil Claude Code neu gestartet werden muss, damit `.claude/agents/` geladen wird):
einen `general-purpose`-Agenten starten und ihm den Inhalt der jeweiligen Datei aus `.claude/agents/` als Auftrag mitgeben.

## Abschluss
- Zusammenfassung für den Nutzer in einfachem Deutsch:
  - neue Fakten mit Quellen (Anzahl) und wichtigste Änderungen gegenüber vorher
  - Fotos je Bildplatz (und welche leer geblieben sind)
  - Verbreitung (Nachweise, Fazit)
  - offene Punkte (`TODO fachlich prüfen`)
- Sagen, wie man es auf dem Handy ansieht (Branch `tierseite/<artId>`, Reload, Art öffnen).
- **Nicht pushen und nicht nach main mergen**, ohne zu fragen.
