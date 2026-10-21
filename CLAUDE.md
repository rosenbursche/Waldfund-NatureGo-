# Wildfund – Projektregeln

„Pokémon Go für Naturliebhaber“: Heimische Arten finden, fotografieren, im Katalog freischalten, Punkte sammeln. Der Reiz liegt in **seltenen** Arten. Zielgruppe 12–25 Jahre.

Vollständiger Auftrag: `wildfund-prompt.md`. **Gesamtdokumentation (Bedienung, Spielregeln, Daten, 3D, Technik): `docs/DOKUMENTATION.md`** – bei Änderungen mitpflegen. **Alle Anforderungen mit Stand: `docs/ANFORDERUNGEN.md`** (bei neuen Wünschen dort ergänzen und Status pflegen). Vorgaben für realistische 3D-Modelle: `docs/3D-PIPELINE.md`. Klickbarer Web-Prototyp (Struktur, Daten, Punktelogik, Zeichnungen, Karte): `prototyp-wildfund.html`. Das **Farbschema des Prototyps nicht übernehmen**. Expo-spezifische Hinweise: `AGENTS.md`.

## Tierseiten-Pipeline
- Neue oder überarbeitete Tierseiten entstehen über **`/tierseite <artId>`** (Skill in `.claude/skills/tierseite/`) mit den Agenten in `.claude/agents/`: Recherche → Verbreitung (GBIF), Bilder (Commons), Spuren → Prüfer → Bauer. Beschreibung: **`docs/PIPELINE-TIERSEITEN.md`**.
- Werkzeuge: `scripts/gbif-verbreitung.mjs`, `scripts/commons-suche.mjs`, `scripts/commons-laden.mjs`, `scripts/spur-vorschau.mjs`. Rechercheergebnisse liegen in `recherche/<artId>/`.
- Jede Angabe braucht eine Quelle (`quellen` in der Tierseite). Fotos nur nach Ansicht und mit freier Lizenz.

## Zusammenarbeit
- Der Nutzer ist Einsteiger. Jeden Schritt kurz in einfachem Deutsch erklären, genaue Befehle nennen und sagen, was auf dem Handy zu sehen sein soll.
- **Phase für Phase** arbeiten (Phasen 0–9, siehe `wildfund-prompt.md` Abschnitt 9). Nach jeder Phase anhalten, berichten, auf OK warten.
- Nach jeder Phase einen Git-Commit machen und **fragen**, bevor `git push` läuft. Repo: `rosenbursche/Waldfund-NatureGo-`, Branch `main`.
- Kleine, verständliche Schritte. Code-Kommentare auf Deutsch, wo sie beim Verstehen helfen.
- Nicht raten (Daten, Lizenzen, API-Bedingungen): recherchieren oder nachfragen. **Keine Fakten erfinden.** Ungeprüfte Fachdaten im Code mit `// TODO fachlich prüfen` markieren.
- Läuft eine Bibliothek nicht in Expo Go, das sagen und eine Alternative vorschlagen (z. B. Development Build).

## Tech-Stack
- Expo (SDK 57) + React Native + TypeScript, **expo-router** (Routen in `src/app/`).
- 3D: `@react-three/fiber` (native) + `expo-gl` + `@react-three/drei`.
- 2D-Effekte (Leuchten, Nebel, Partikel): `@shopify/react-native-skia`. Lehrbuch-Zeichnungen und Karte: `react-native-svg` + `roughjs`.
- `expo-camera` / `expo-image-picker`, `expo-location`, `expo-sensors`.
- Zustand: **Zustand** + AsyncStorage. Alles **offline**, Daten als JSON/TS im Projekt.
- Pakete immer mit `npx expo install <paket>` installieren.
- `@react-three/drei` wird bewusst nicht genutzt (viele Helfer laden aus dem Netz oder laufen nicht nativ). Leuchten/Nebel/Partikel entstehen in three.js selbst (additive Sprites mit `leuchtTextur()`), Skia ist dafür nicht nötig.
- `expo-gl` rendert immer in voller Pixeldichte – Leistung über wenige, geteilte Geometrien/Materialien sichern (`src/scene/material.ts`).
- Vor „fertig“: `npx tsc --noEmit`, `npx expo lint` und `npm test`.

## Ordnerstruktur
- `src/app/` – Screens (nur Routen)
- `src/theme/theme.ts` – Design-Tokens (Farben, Schriften, Abstände). **Keine Farbwerte direkt in Komponenten.**
- `src/data/` – Artendaten (`arten.ts`), Baumarten (`baumarten.ts`), Naturräume (`naturraeume.json`, erzeugt), Spielregeln (`spiel.ts`)
- `src/logic/` – Regel-Engine, Geo (Punkt-in-Polygon), Punkte/Level/Serien/Erfolge; Tests in `src/logic/__tests__/`
- `src/components/` – wiederverwendbare UI-Bausteine
- `src/scene/` – 3D-Szenen
- `src/store/` – Zustand-Store
- `server/` – Erkennungsserver (Cloudflare Worker) zwischen App und Pl@ntNet, eigene `tsconfig.json`, Anleitung in `server/README.md`. Typprüfung: `npx tsc -p server`
- `scripts/icons-bauen.mjs` – erzeugt App-Icon, Android-Icons, Splash und Favicon aus `assets/icon-quelle/` (Vektor)
- `scripts/naturraeume-bauen.mjs` – erzeugt `src/data/naturraeume.json` aus Thünen-Wuchsbezirken (`node scripts/naturraeume-bauen.mjs`)

## Code-Regeln
- Keine eigenen Namen, die JavaScript-Globals überdecken (`Symbol`, `Map`, …) – Lint-Regel `id-denylist`. Hat in Phase 2 einen Absturz verursacht.
- React-Compiler-Lint ist streng: In 3D-Szenen Werte nur über Refs (`ref.current`) oder Klassen mit Methoden ändern (siehe `src/scene/steuerZustand.ts`), nicht über Props oder useMemo-Werte.
- Formatierung: Prettier mit `.prettierrc` (einfache Anführungszeichen, 120 Zeichen). Nur geänderte Dateien formatieren, nicht das ganze Projekt.
- Render-Tests in `src/app/__tests__/` stellen jeden Screen einmal dar; die 3D-Szene wird dort gemockt.

## Daten
- Quellen und Lizenzen stehen in `DATENQUELLEN.md`. Neue Daten nur mit geprüfter Lizenz übernehmen und dort eintragen.
- Geodaten: © Thünen-Institut (dl-de/by-2-0), Namensnennung muss in der App sichtbar sein.
- Baumarten liegen als `baumarten.ts` statt JSON vor, damit `// TODO fachlich prüfen`-Kommentare möglich sind.
- Anteile der Regel-Engine (haupt 6 / neben 3 / begleiter 1) sind eine Spiel-Vereinfachung, keine forstlichen Flächenanteile.

## Look & Feel: mystisch statt neon
- Farbwelt „Hohlweg“: fast schwarzes Waldgrün, Licht nur von oben, Moos im Licht, warmes Laternenlicht. **Kein Neongrün, kein Türkis.** Leuchten weich (Nebel, Licht in Schichten, Vignette).
- Tokens: night #060907, forest #101A13, moss #4F6B36, rune (Mooslicht) #A9BC6A, fog #A3B0A5, moon #DCE3D6, amber (Laterne) #D9A24E, rare #A595CC, legend #E2B85C.
- Schriften: Cinzel (Titel, Etiketten, Abzeichen), Alegreya Sans (Text, kursiv für Notizen), Kalam nur in Lehrbuch-Zeichnungen.
- **Designsystem: `docs/DESIGNSYSTEM.md`.** Neue Seiten nur aus den Bausteinen in `src/components/ui/` bauen (Sektion, Kapitelkopf, Abzeichen, Kennzahl, Schalter, Zierlinie, Knopf). Vorlage ist die Reh-Seite. Übersicht im Handy: Einstellungen → Bausteine.
- **So wenig Text wie möglich:** keine Erklär- oder Bedientexte auf den Seiten, Erklärungen nur hinter dem „i“ am Titel (`Info`, siehe `docs/DESIGNSYSTEM.md` Abschnitt 6). Immer sichtbar bleiben nur kurze Schutz-/Sicherheitshinweise und Pflicht-Namensnennungen.
- Lehrbuch-Zeichnungen: Tinte auf altem Papier, handgezeichnet mit Beschriftungslinien, nicht „KI-artig“.
- Alle Animationen bei „Bewegung reduzieren“ abschwächen.

## Fachliche Regel „heimisch“
„Heimisch“ = **von Natur aus dort vorkommend**, nicht „häufig gepflanzt“. Beispiele: Fichte nur Hochharz, hohe Lagen Erzgebirge/Bayerischer Wald, Alpen; Europäische Lärche nur Alpen; Douglasie und Roteiche nicht heimisch. Die App zeigt z. B. „Fichte – hier angepflanzt, nicht heimisch“.

## Schutz von Natur und Nutzern (nicht verhandelbar)
- Fundorte seltener/geschützter Arten **nie genau** anzeigen oder teilen, höchstens auf Rasterfeld-Ebene (TK25).
- Bei geschützten Arten: „Nur fotografieren, nicht pflücken, nicht stören“. Bei Pilzen immer: nichts essen, was nicht von Sachverständigen geprüft wurde.
- Keine Mechanik, die belohnt, Tiere zu verfolgen oder Wege zu verlassen.
- Datenschutz (teils Minderjährige): kein Konto im MVP, Daten nur lokal, Standort nur grob und nur mit Zustimmung. Kommen später Konten/Server dazu: auf DSGVO und Einwilligung bei unter 16-Jährigen hinweisen.
- **API-Schlüssel nie in die App einbauen**, sondern über einen Server/eine Serverless-Funktion (`server/`). In `app.json → extra` steht nur die öffentliche Server-Adresse.
- Echte Erkennung ist standardmäßig aus und wird erst nach Hinweis (inkl. „unter 16: Eltern fragen“) eingeschaltet. Pilze, Vögel, Säugetiere: nur Demo-Prüfung, ehrlich gekennzeichnet (`Fund.geprueft`).
