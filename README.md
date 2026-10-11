# Wildfund

Ein „Pokémon Go für Naturliebhaber“: Heimische Arten finden, fotografieren, im Katalog freischalten und Punkte sammeln. Mystisch statt neon, offline, ohne Konto.

Expo (SDK 57) · React Native · TypeScript · expo-router · react-three-fiber · Zustand

## Starten

```
npm install
npx expo start
```

Auf dem Handy die App **Expo Go** öffnen und den QR-Code scannen. Handy und Computer müssen im selben WLAN sein.

## Die App einem Freund zeigen

**Am schnellsten (dein Computer muss laufen):**
```
npx expo start --tunnel
```
Dein Freund installiert **Expo Go** und scannt den QR-Code aus deinem Terminal. Mit `--tunnel` klappt das auch, wenn er nicht in deinem WLAN ist. Die App läuft, solange `expo start` bei dir läuft.

**Ohne laufenden Computer** braucht es einen eigenen App-Build über EAS (`npx eas-cli build`). Für Android entsteht eine installierbare Datei. Für iPhones ist ein Apple-Entwicklerkonto nötig, es kostet Geld. Das richten wir ein, wenn es so weit ist.

## Prüfen

```
npm test              # alle Tests
npx tsc --noEmit      # Typprüfung App
npx tsc -p server     # Typprüfung Erkennungsserver
npx expo lint         # Code-Regeln
```

## Ordner

| Ordner | Inhalt |
|---|---|
| `src/app/` | Screens (expo-router) |
| `src/scene/` | 3D-Lichtung, Hütte, Bäume, Artmodelle |
| `src/components/` | UI-Bausteine, Lehrbuch-Zeichnungen, Karte, Stammbaum |
| `src/data/` | Arten, Baumarten, Naturräume, Orte |
| `src/logic/` | Regel-Engine, Punkte, Erkennung, Karte (mit Tests) |
| `src/store/` | gespeicherter App-Zustand |
| `server/` | Erkennungsserver für Pl@ntNet (siehe `server/README.md`) |
| `scripts/` | Skripte zum Erzeugen von Naturräumen, Ortsliste und Icons |

Anforderungen und Stand: `docs/ANFORDERUNGEN.md` · 3D-Modelle: `docs/3D-PIPELINE.md` · Projektregeln: `CLAUDE.md` · Datenquellen und Lizenzen: `DATENQUELLEN.md` · Auftrag: `wildfund-prompt.md`

## Daten und Lizenzen

Naturraum-Grenzen © Thünen-Institut (dl-de/by-2-0) · Orte: GeoNames (CC BY 4.0) · Pflanzenerkennung: Pl@ntNet API (optional). Fachliche Angaben sind Demo-Stand und im Code mit `TODO fachlich prüfen` markiert.
