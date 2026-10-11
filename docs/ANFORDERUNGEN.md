# Wildfund – Anforderungen und Stand

Stand: 11.10.2026 · Ursprünglicher Auftrag: `wildfund-prompt.md` · Projektregeln: `CLAUDE.md` · Datenquellen: `DATENQUELLEN.md` · 3D-Modelle: `docs/3D-PIPELINE.md`

Legende: ✅ erledigt · 🟡 teilweise / vorbereitet · ⬜ offen · 🔒 wartet auf Material, Konto oder Entscheidung von außen

---

## 1. Grundauftrag (Phasen 0–9)

| Phase | Inhalt | Stand |
|---|---|---|
| 0 | Expo-Projekt, Ordner, Theme-Tokens, Schriften | ✅ |
| 1 | Arten aus dem Prototyp, Baumarten, Naturräume (Thünen-Grenzen), Regel-Engine, Tests | ✅ |
| 2 | Onboarding: Naturraum per Standort (grob), Ortssuche (offline), Liste; Ergebnisscreen | ✅ |
| 3 | 3D-Lichtung: Hütte, prozedurale Bäume, Runensteine, Nebel, Glühwürmchen, Tageszeit-Licht, Parallaxe | ✅ |
| 4 | Katalog mit Stammbaum und Mystery-Zone | ✅ (seither umgebaut, siehe 2.2) |
| 5 | Artenseite: 3D-Modell, Steckbrief, Lehrbuch-Zeichnung, Karte, Schutzstatus | ✅ |
| 6 | Fotografieren und Prüfen (Demo-Modus) | ✅ |
| 7 | Punkte, Level, Serien, Erfolge, wachsende Hütte, dauerhaft gespeichert | ✅ |
| 8 | Echte Bilderkennung | 🟡 App + Server vorbereitet (Pl@ntNet, nur Pflanzen) · 🔒 Konten Pl@ntNet und Cloudflare fehlen, Anleitung: `server/README.md` |
| 9 | Feinschliff: Icon, Splash, Barrierefreiheit, Bewegung reduzieren, Leistung | ✅ |

---

## 2. Erweiterungen nach dem Grundauftrag

### 2.1 Kategorie-Wald und Runen
| Anforderung | Stand |
|---|---|
| Antippen einer Rune: Kamera zoomt hinein, dann öffnet sich die Kategorie | ✅ |
| Umschalter **Wald / Stammbaum** in jeder Kategorie (Auswahl wird gemerkt) | ✅ |
| Wald-Ansicht: Arten an ihrem natürlichen Platz, gefunden farbig, sonst **grau mit grauem Schloss** | ✅ |
| Um jede Rune kreisen bis zu 3 gefundene Arten (seltenste zuerst) | ✅ |
| Gefährliche Arten im Wald rot hervorgehoben (Ring, Nebel, Dornen) | ✅ |

### 2.2 Stammbaum, Gruppen, Gefahr, Punkte
| Anforderung | Stand |
|---|---|
| Stammbaum nach Seltenheit: Krone (legendär) → Äste → Stamm → Wurzeln (häufig) | ✅ |
| Punkte je Stufe und je Art sichtbar | ✅ |
| Sinnvolle Gruppen je Kategorie (Pflanzen: Bäume, Büsche, Frühblüher …) | ✅ |
| Individuelle Miniatur je Art (statt allgemeiner Symbole) | ✅ |
| Sektion **„Gefährlich & tödlich“** in jeder Kategorie, mit gruseliger Animation beim Scrollen/Antippen | ✅ |
| Vögel: ehrlicher Text statt erfundener Gefahren | ✅ |
| Neue Pflanzen: Hasel, Holunder, Schlehe, Weißdorn, Eisenhut, Tollkirsche, Herbstzeitlose, Seidelbast, Eibe | ✅ (Daten zu prüfen) |
| Punkte überproportional nach Seltenheit: **10 / 60 / 300 / 1000**, Level-Grenzen angepasst | ✅ |

### 2.3 Artenseite – neue Inhalte

**Alle Arten**
| Anforderung | Stand |
|---|---|
| **Wild-Wert 1–100** ganz oben + Hinweis „bedroht / nicht bedroht“ | ✅ (Formel siehe 4.2, Demo-Daten) |
| **LiDAR-Effekt**: Laser-Punktwolke wird zum Modell | ✅ (für jedes Modell, auch später GLB) |
| Lebensraum mit Begründung („Warum gerade dort?“) | ✅ Tiere/Vögel · ⬜ Pilze/Pflanzen |

**Tiere (Säugetiere)**
| Anforderung | Stand |
|---|---|
| Key Features | ✅ |
| Nahrung, verknüpft mit Arten in der App | ✅ |
| Spuren (Trittsiegel, Losung, Fraßspuren) | ✅ Text · ⬜ eigene Spuren-Zeichnungen |
| Wohnen & Schlafen | ✅ Text · ⬜ Zeichnung/3D (Bau, Kobel …) |
| Ohren wackeln | ✅ (Low-Poly) · 🔒 realistisch mit GLB |
| **Alters-Regler** (z. B. Kitz → Bock, Welpe → alter Fuchs) | ⬜ 🔒 braucht Modelle je Alters-Stufe |

**Vögel**
| Anforderung | Stand |
|---|---|
| Füße & Krallen, Nest, „Warum so gebaut?“ | ✅ Text · ⬜ Zeichnungen |
| Federn putzen / schütteln | ✅ Schütteln + Plustern (Low-Poly) · 🔒 Putzen realistisch mit GLB |
| **Alters-Regler** Ei → Küken → Vogel | ⬜ 🔒 braucht Modelle je Stufe |
| Nahrung, Spuren, Schlafen | ✅ |

**Pilze**
| Anforderung | Stand |
|---|---|
| Wassertropfen fallen auf den Hut | ✅ |
| Sporen werden ausgestoßen | ✅ (rieseln) · ⬜ sichtbarer „Ausstoß“-Moment |
| Steckbrief-Sektionen (Lebensraum-Warum, Partnerbaum/Mykorrhiza, Verwechslung) | ⬜ |

**Pflanzen**
| Anforderung | Stand |
|---|---|
| Blätter wackeln | ✅ |
| „Wer frisst mich?“ – verknüpft mit Tieren in der App | ✅ (automatisch aus der Tier-Nahrung) |
| Wild-Wert | ✅ |
| **Biologie zerlegt** (Wurzel, Stamm/Stängel, Blatt, Blüte) – interaktive Explosionsansicht | ⬜ |
| **Blüten-/Frucht-Sektion mit Jahreszeiten-Regler** (Pflanze verändert sich über das Jahr) | ⬜ (prozedural machbar, braucht Monatsdaten je Art) |
| **Wachstums-Regler** Keimling → großer Baum (Stufen je nach Art, z. B. bis 300 bei Bäumen) | ⬜ (prozedural machbar) |
| Lebensraum-Sektionen | ⬜ |

### 2.4 Deutschlandkarte
| Anforderung | Stand |
|---|---|
| Statt Punkten: **gefüllte bzw. halb gefüllte Flächen** | ⬜ |
| Lebendiger: Berge, Mittelgebirge, große Wälder | ⬜ (Geodaten: Copernicus-Höhenmodell, CORINE-Landbedeckung – Lizenz vor Nutzung prüfen) |
| Eigene Position einzeichnen | ⬜ (nur **grob**, ca. 10 km – Datenschutz) |
| Fundorte seltener Arten nie genauer als Rasterebene | ✅ gilt weiter |

### 2.5 Realistische 3D-Modelle
| Anforderung | Stand |
|---|---|
| Realistische, pixelgenaue 3D-Modelle von Tier, Pflanze, Pilz | 🔒 extern erzeugen/kaufen, siehe `docs/3D-PIPELINE.md` |
| Realistische Animationen (Ohren, Putzen, Schütteln, Tropfen …) | 🔒 Rigging/Animation extern, Einbau durch App |
| **Pilot: Fuchs** (Grundmodell + Alters-Stufen) | 🔒 Prompts fertig, wartet auf GLB-Dateien |
| GLB-Lader, Animations-Wechsel, Alters-Regler mit Überblenden | ⬜ (kann mit Platzhalter vorbereitet werden) |

---

## 3. Vorgeschlagene Reihenfolge

1. **Schritt 1 – jetziges System (ohne externe Modelle)**
   - ✅ Wild-Wert, Tier-/Vogel-Sektionen, Nahrungsnetz, LiDAR, Tropfen/Schütteln/Blätter
   - ⬜ Pflanzen: Jahreszeiten-Regler, Wachstums-Regler, Biologie zerlegt
   - ⬜ Lebendige Karte (Flächen, Relief, Wälder, grober Standort)
   - ⬜ Steckbriefe für Pilze und Pflanzen
   - ⬜ Zeichnungen für Spuren, Bauten, Nester, Vogelfüße (Tinten-Stil)
2. **Schritt 2 – Pilot mit realistischen Modellen** (Fuchs, ggf. Rotkehlchen, Fliegenpilz): GLB-Lader, Animationen, Alters-Regler, Größe/Bildrate auf dem Handy testen
3. **Schritt 3 – auf alle Arten ausweiten**, wenn der Pilot überzeugt

---

## 4. Entscheidungen und Regeln

### 4.1 Technik
- App bleibt bei **Expo + react-three-fiber**. Realistische Modelle als **GLB** mit eingebetteten Animationen.
- **Nicht** Unity (spaltet die App, kein Expo Go) und **nicht** Spline (für Web gedacht).
- KI-Bilder (z. B. ChatGPT) nur als Referenz, nicht für die Lehrbuch-Zeichnungen (die sollen nicht nach KI aussehen).
- Große Modelle später bei Bedarf herunterladen und offline speichern (App-Größe).

### 4.2 Wild-Wert
- Formel: 55 % Verbreitung (Anteil Rasterfelder ohne Nachweis) + 30 % Seltenheitsstufe + 15 % Rote Liste → 1–100.
- Solange die Verbreitung Demo-Daten sind, ist der Wild-Wert ein **Demo-Wert** (so angezeigt).

### 4.3 „Level“ für das Alter
- „Level“ ist bereits der Spieler-Fortschritt. Für das Alter von Arten: **„Lebensjahr“ / „Alters-Stufe“**.
- Länge des Reglers richtet sich nach der **echten Lebensdauer** der Art (nicht pauschal 0–30 bzw. 0–300). Im ersten Lebensjahr Zwischenstufen (z. B. 2 Wochen, 5 Wochen, 3 Monate, 7 Monate).

### 4.4 Inhalte und Fakten
- Nichts erfinden. Alle neuen Texte selbst formuliert und mit `TODO fachlich prüfen` markiert.
- Keine Texte aus Wikipedia übernehmen (Weitergabe-Pflicht der Lizenz).
- Gefahren ehrlich: Tiere nicht gefährlicher darstellen, als sie sind.

### 4.5 Schutz von Natur und Nutzern (unverändert, nicht verhandelbar)
- Fundorte nie genauer als Rasterebene; Standort nur grob und mit Zustimmung.
- Keine Mechanik, die Verfolgen von Tieren oder Verlassen der Wege belohnt.
- Kein Konto, Daten lokal. Echte Bilderkennung erst nach Hinweis einschaltbar (inkl. „unter 16: Eltern fragen“).
- Vor Veröffentlichung: Datenschutzerklärung, Einwilligung unter 16 (DSGVO) rechtlich prüfen, Pl@ntNet-Logo ergänzen.

---

## 5. Offene fachliche Prüfungen (`TODO fachlich prüfen`)
- Höhenstufe und Boden der 10 Demo-Naturräume; Baumarten-Zuordnung (u. a. Kiefer in der Lüneburger Heide)
- Schutzstatus und Rote Liste der Baumarten und der neuen Pflanzen
- Steckbrief-Texte der Tiere und Vögel (`src/data/steckbriefe.ts`)
- Gefahren-Texte (Wildschwein, Fuchs) und Giftigkeit der Pflanzen
- Verbreitungskarten (bisher Demo-Modell, später echte Rasterdaten)
