# Wildfund – Projektregeln

„Pokémon Go für Naturliebhaber“: Heimische Arten finden, fotografieren, im Katalog freischalten, Punkte sammeln. Der Reiz liegt in **seltenen** Arten. Zielgruppe 12–25 Jahre.

Vollständiger Auftrag: `wildfund-prompt.md`. Klickbarer Web-Prototyp (Struktur, Daten, Punktelogik, Zeichnungen, Karte): `prototyp-wildfund.html`. Das **Farbschema des Prototyps nicht übernehmen**. Expo-spezifische Hinweise: `AGENTS.md`.

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
- Vor „fertig“: `npx tsc --noEmit` und (ab Phase 1) `npm test`.

## Ordnerstruktur
- `src/app/` – Screens (nur Routen)
- `src/theme/theme.ts` – Design-Tokens (Farben, Schriften, Abstände). **Keine Farbwerte direkt in Komponenten.**
- `src/data/` – Artendaten, Baumarten, Naturräume
- `src/logic/` – Regel-Engine, Punkte, Level (mit Tests)
- `src/components/` – wiederverwendbare UI-Bausteine
- `src/scene/` – 3D-Szenen
- `src/store/` – Zustand-Store
- `assets/geo/` – vereinfachte GeoJSON-Dateien

## Look & Feel: mystisch statt neon
- Wald in der Dämmerung, altes Naturforscher-Tagebuch. **Kein Neongrün.** Leuchten weich (Bloom, Nebel, Licht in Schichten).
- Tokens: night #0B1414, forest #142420, moss #3D5A45, fog #9FB3AD, moon #D9E0E6, amber #E8B86A, rune #8FD1C4, rare #B79CE0, legend #E9C46A.
- Schriften: Kalam (Handschrift, Überschriften/Notizen), Lexend (Text), Special Elite (Etiketten/Zahlen).
- Lehrbuch-Zeichnungen: Tinte auf altem Papier, handgezeichnet mit Beschriftungslinien, nicht „KI-artig“.
- Alle Animationen bei „Bewegung reduzieren“ abschwächen.

## Fachliche Regel „heimisch“
„Heimisch“ = **von Natur aus dort vorkommend**, nicht „häufig gepflanzt“. Beispiele: Fichte nur Hochharz, hohe Lagen Erzgebirge/Bayerischer Wald, Alpen; Europäische Lärche nur Alpen; Douglasie und Roteiche nicht heimisch. Die App zeigt z. B. „Fichte – hier angepflanzt, nicht heimisch“.

## Schutz von Natur und Nutzern (nicht verhandelbar)
- Fundorte seltener/geschützter Arten **nie genau** anzeigen oder teilen, höchstens auf Rasterfeld-Ebene (TK25).
- Bei geschützten Arten: „Nur fotografieren, nicht pflücken, nicht stören“. Bei Pilzen immer: nichts essen, was nicht von Sachverständigen geprüft wurde.
- Keine Mechanik, die belohnt, Tiere zu verfolgen oder Wege zu verlassen.
- Datenschutz (teils Minderjährige): kein Konto im MVP, Daten nur lokal, Standort nur grob und nur mit Zustimmung. Kommen später Konten/Server dazu: auf DSGVO und Einwilligung bei unter 16-Jährigen hinweisen.
- **API-Schlüssel nie in die App einbauen**, sondern über einen Server/eine Serverless-Funktion.
