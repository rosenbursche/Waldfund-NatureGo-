# Recherche Sonderwissen (`docs/KONZEPT-GESAMT.md` Abschnitt 11)

Ziel: Der Nutzer soll staunen. Gesucht ist, was es **nur bei dieser einen Art** gibt und was man gern weitererzählt. Katalogwissen wie „wird 30 m hoch“ ist hier nicht gemeint, das steht schon im festen Feldkatalog. Ein gutes Beispiel ist die Walnuss: Ihre Blätter und Wurzeln geben Juglon ab, das andere Pflanzen unter dem Baum hemmt.

## Regeln
- **Nichts erfinden.** Jeder Eintrag braucht mindestens eine Quelle, die du mit WebFetch geöffnet hast und in der es wirklich steht. Bei Wow-Fakten (wow 3) sind es möglichst zwei unabhängige Quellen.
- Gute Quellen sind Fachartikel und Übersichtsarbeiten (PubMed, Verlage, Universitäten), BfN, FloraWeb, Landesämter, Forstverwaltungen, das Bundesinstitut für Risikobewertung (BfR), Giftinformationszentren, die Deutsche Wildtier Stiftung, NABU und LWF. Wikipedia dient nur als Wegweiser, Text daraus nicht übernehmen.
- Mythen und Aberglaube sind erlaubt, wenn sie **als solche** gekennzeichnet sind („Früher glaubte man …“), mit einer Quelle für den Brauch.
- **Keine Heilversprechen.** Volksmedizin nur als Geschichte („wurde früher genutzt gegen …“), nie als Empfehlung.
- Bei **essbar, rezept und giftig** ist ein Sicherheitshinweis Pflicht (`sicherheit`): welche Teile, roh oder gekocht, Verwechslungsgefahr. Bei Pilzen steht immer der Hinweis, sie von Pilzsachverständigen prüfen zu lassen.
- Wenn die Art geschützt ist: nichts, was zum Pflücken, Graben oder Stören einlädt. `mitmachen` heißt beobachten, riechen, hören oder fühlen, ohne etwas zu beschädigen.
- Schreib in eigenen Worten, in einfachem Deutsch, 2–4 Sätze je Eintrag (höchstens 600 Zeichen).
- 8–15 Einträge je Art, davon mehrere mit `wow: 3`. Lieber weniger und belegt als viele und geraten.
- Saisonales mit `monate` versehen und, wo es passt, mit einer `meldung`. Das ist der Text der Benachrichtigung, z. B. „Der Holunder blüht gerade. Riech mal dran!“. Die Meldung ist kurz, macht neugierig und sagt nie „pflück“ oder „iss“.

## Themen (`db/felder/sonderwissen.mjs`)
`verblueffend`, `chemie`, `beziehung`, `koerper`, `verhalten`, `oekologie`, `essbar`, `rezept`, `giftig`, `nutzung`, `geschichte`, `name`, `mitmachen`

## Ausgabe: `recherche/sonderwissen/<artId>.json`
```json
{
  "artId": "walnuss",
  "colId": "6NFN8",
  "wissName": "Juglans regia",
  "gruppe": "pflanzen",
  "eintraege": [
    {
      "id": "juglon",
      "thema": "chemie",
      "titel": "Kurz und neugierig machend",
      "text": "2–4 Sätze.",
      "details": null,
      "monate": null,
      "meldung": null,
      "sicherheit": null,
      "wow": 3,
      "quellen": ["q1", "q2"]
    }
  ],
  "quellen": { "q1": { "titel": "…", "url": "https://…", "abgerufen": "2026-10-25" } },
  "offen": ["was du nicht belegen konntest oder was widersprüchlich war"]
}
```
- `wow`: 1 = nett zu wissen, 2 = interessant, 3 = erzählt man weiter.
- `details` bei `rezept`: `{ "zutaten": ["…"], "schritte": ["…"], "portionen": "…" }`. Bei `essbar`: `{ "teile": ["…"], "zubereitung": "…" }`. Sonst `null` oder ein kleines Objekt mit Zahlen und Einheiten.

Prüfen: `node -e "import('./db/felder/sonderwissen.mjs').then(m=>console.log(m.pruefeSonderwissen(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')))))" recherche/sonderwissen/<artId>.json`. Eine leere Liste bedeutet, dass alles stimmt.

Zusätzlich `recherche/sonderwissen/<artId>.md`: kurze Zusammenfassung, die besten 3 Einträge, Widersprüche und Abweichungen von den App-Daten (`src/data/arten.ts`, `src/data/steckbriefe.ts`, `src/data/tiere/`, `src/data/baumarten.ts`).

Vorhandene Recherchen nutzen: `recherche/<artId>/` (falls vorhanden) und `recherche/fundstuecke/`.
