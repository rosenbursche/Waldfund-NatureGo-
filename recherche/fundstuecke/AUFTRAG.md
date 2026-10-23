# Recherche Fundstücke (G1, `docs/KONZEPT-GESAMT.md` Abschnitt 2)

Pilotregion: **Lüneburger Heide** (Naturraum in `src/data/naturraeume.json`). Vorläufige Wahl, kann sich ändern.

Je Art ermitteln, **welche Zeichen ein normaler Spaziergänger auf Wegen finden und fotografieren kann**: Spuren, Fährten, Losung, Fraßspuren, Bauten, Nester, Federn, Stimmen, Blätter, Rinde, Knospen, Blüten, Früchte, Keimlinge, Fruchtkörper, Sporenabdruck usw. Dazu immer „Sichtung“ bzw. „ganze Pflanze“.

## Regeln
- **Nichts erfinden.** Jedes Fundstück braucht mindestens eine Quelle, die du mit WebFetch geöffnet hast und in der es wirklich steht. Bevorzugt: BfN, Landesämter, Forstverwaltungen, Deutsche Wildtier Stiftung, NABU, LBV, Universitäten, Bestimmungsliteratur. Wikipedia nur als Wegweiser, kein Text übernehmen.
- Nur Fundstücke, die man **von Wegen aus** finden kann. Nichts, wofür man Tiere verfolgen, Nester aufsuchen oder Baue stören müsste. Solche Fundstücke weglassen oder mit `schutz` klar begrenzen.
- Sammeln heißt **nur fotografieren**. Rechtliche Hinweise (Federn geschützter Vögel, Nester, geschützte Pflanzen, Losung/Fuchsbandwurm, Giftpilze anfassen) gehören in `schutz`, mit Quelle.
- Eigene Worte, kurz, einfaches Deutsch.
- 4–10 Fundstücke je Art. Lieber weniger und belegt als viele und geraten.

## Ausgabe: `recherche/fundstuecke/<gruppe>.json`
```json
{
  "gruppe": "saeuger",
  "arten": [
    {
      "artId": "wildschwein",
      "lueneburgerHeide": "ja | nein | unsicher",
      "lueneburgerHeideQuelle": "q1",
      "fundstuecke": [
        {
          "id": "suhle",
          "name": "Suhle",
          "typ": "spur | faehrte | losung | frass | bau | nest | feder | stimme | haar | blatt | rinde | knospe | bluete | frucht | samen | keimling | fruchtkoerper | sichtung | ganz | sonstiges",
          "kurz": "Schlammige Mulde, in der sich Wildschweine wälzen.",
          "erkennen": ["Merkmal 1", "Merkmal 2"],
          "verwechslung": "womit, und woran man den Unterschied sieht (oder null)",
          "monate": [1,2,3,4,5,6,7,8,9,10,11,12],
          "findbarkeit": 1,
          "wo": "kurz: wo am Weg man es findet",
          "schutz": "Hinweis oder null",
          "quellen": ["q1", "q2"]
        }
      ],
      "quellen": { "q1": { "titel": "…", "url": "https://…" } },
      "offen": ["was du nicht belegen konntest"]
    }
  ]
}
```
- `findbarkeit`: 1 = fast jeder Spaziergang, 2 = öfter, 3 = selten, 4 = Glückstreffer.
- `monate`: Monate, in denen man das Fundstück findet (z. B. Herbstlaub 10–11).
- Stimmen (`typ: "stimme"`) nur bei Vögeln und nur, wenn die Art regelmäßig ruft oder singt.

Zusätzlich `recherche/fundstuecke/<gruppe>.md`: kurze Zusammenfassung, Auffälligkeiten, Abweichungen von den App-Daten (`src/data/arten.ts`, `src/data/baumarten.ts`, `src/data/steckbriefe.ts`, `src/data/tiere/`), offene Punkte.

Vorhandene Recherchen nutzen: `recherche/<artId>/` (falls vorhanden) und Spuren in `src/data/tiere/*.ts`.
