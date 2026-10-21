# Prüfung Wildschwein (Sus scrofa)

Prüfer: tier-pruefer (unabhängig), Stand 19.10.2026.
Vorgehen: Alle 24 Quellen aus `fakten.json` heruntergeladen (PDF/HTML → Text) und jede Zahl und Monatsangabe im Originaltext gesucht. DWS-Spurenseite, ANL-Tafel und UZH-Arbeitsblatt als Bild geprüft. DJV-Infografik als Bild abgelesen. Alle 15 übernommenen Fotos angesehen, Commons-Metadaten (Ort, Datum, Lizenz, Urheber) für alle Fotos gelesen, außer Malbaum (API-Ratenlimit, Angaben aus `fotos.ts` übernommen). GBIF-Gesamtzahl über die API nachgezählt.

Abdeckung: Zahlen und Monate 100 %, übrige Angaben etwa 85 %.

---

## 1. Fakten (`fakten.json`)

### Größe und Gewicht
| Angabe | Ergebnis | Beleg / Korrektur |
|---|---|---|
| Keiler Kopf-Rumpf 150–180 cm, Schulter bis 110 cm, 100–150 kg, Bache 50–70 % | bestätigt | q6 Berlin wörtlich |
| Gewicht bis 200 kg, meist etwa 70 kg | bestätigt | q4 („bis zu 200 kg“), q5 („meist aber nur etwa 70 kg“) |
| `typisch`: „DJV: Durchschnitt etwa 80 kg“ | **korrigieren** | q17 nennt kein Durchschnittsgewicht, sondern nur ein Rechenbeispiel („Ein 80-Kilo-Wildschwein entspricht bereits einem Nashorn“). Richtig: typisch **etwa 70 kg (q5)**, q17 als Beleg streichen. |
| Schweiz: Keiler bis 150, Bache bis 90 kg | bestätigt | q10, q11 |
| `groesse.cm` [55, 110] | **offen** | 110 belegt (q6). Die Untergrenze 55 cm stammt nur aus dem Wildpark-Steckbrief q24 (schwache Quelle, nennt auch unplausible 100–300 kg). |
| `gewicht` Untergrenze 50 kg | **offen** | abgeleitet (50 % von 100 kg nach q6), so in fakten.json auch vermerkt. Rechnerisch korrekt, aber keine direkte Angabe. |

### Tagesrhythmus (q7, Wildforschungsstelle BW)
| Angabe | Ergebnis | Beleg |
|---|---|---|
| 41,3 % aktiv / Nacht 65,6 % / Tag 19,4 % | bestätigt | q7, Kap. 6 |
| Maximum ca. 80 % um Mitternacht, Minimum mittags 10–20 % | bestätigt | q7 |
| Tagesphasen-Definition (1,5 h vor/nach Sonne) | bestätigt | q7, Abb. 5.12 |
| Uhrzeiten 20–6 (2), 18:30–20 und 6–7:30 (1) | bestätigt (abgeleitet) | Rechnung nachvollzogen (Mitte Okt. Oberschwaben ca. 7:40 / 18:30 MESZ). Gilt nur für Mitte Oktober, das steht korrekt im Feld `bezug`. |
| Von Natur aus tag-/dämmerungsaktiv, durch Störung nachtaktiv | bestätigt | q11 wörtlich, q3 („von Natur aus als Tagtier“), q6 |
| Białowieża ~50 % Tag, Krakau 90 % Nacht | bestätigt | in q7 als Literatur zitiert (Podgórski et al. 2013) |

### Jahreslauf
| Angabe | Ergebnis | Beleg |
|---|---|---|
| Rauschzeit Schwerpunkt 11–1, Spanne 10–3 | bestätigt | q3 (Okt–Feb, Schwerpunkt Nov–Jan), q6 (Ende Okt–März, Schwerpunkt Nov–Jan), q4 (Nov–Jan) |
| Zweite Rausche 9–10 | bestätigt | q1 und q2 wörtlich („zweite Rauschzeit im September/Oktober“) |
| Frischzeit 3–5, Spanne bis 6 | bestätigt | q3 (März–Mai), q10/q11 (März–Juni), q1/q2 (April) |
| Tragzeit 108–120 Tage (Mittel 114) | bestätigt | q1, q2; q10: 115 Tage; q11: 16–17 Wochen |
| Wurfkessel bis 1 m, Bache bleibt einige Tage | bestätigt | q3 wörtlich |
| Mast 9–11, Spanne bis 2 | bestätigt | q21 (Stieleiche Ende Sep/Anf. Okt, Traubeneiche Okt), q22 (Bucheckern Sep–Nov), q20 (im Winter heruntergefallene Eicheln/Bucheckern) |
| Suhlen 6–8 | **offen** | q4: „im Sommer vor allem … abkühlen“. Die Monate 6–8 sind eine Zuordnung, keine Quellenangabe (in fakten.json ehrlich vermerkt). q16 bestätigt nur „suhlt nicht nur im Sommer“. |
| Haarwechsel 4, 8, 9 | bestätigt | q23 wörtlich („Loss of undercoat starts in April and re-growth commences in August/September“) |

### Fell (`fell.monate` [0,0,0,0.5,1,1,1,0.5,0.5,0,0,0])
| Angabe | Ergebnis | Beleg |
|---|---|---|
| Beginn Haarwechsel April, Neuwuchs Aug/Sep | bestätigt | q23 (britische Sekundärquelle mit Literaturangaben) |
| Winterfell lange dunkle Borsten + Wollhaare, wächst „vor dem Winter“ | bestätigt | q4 wörtlich |
| Werte Mai–Jul = 1 und Okt–Dez = 0 | **offen** | nicht direkt belegt, nur aus den zwei Startpunkten abgeleitet. Wann das Winterfell fertig ist, sagt keine Quelle. Für die App vertretbar, aber als Schätzung markieren. Deutsche Primärquelle fehlt (z. B. Briedermann, „Schwarzwild“). |

### Jungtiere
| Angabe | Ergebnis | Beleg |
|---|---|---|
| Streifen 3–4 Monate (q4), bis 4. Monat (q6), 0–4 Monate (q10), 4–5 Monate (q16) | bestätigt | alle vier im Original gefunden |
| Rotbraunes Jugendkleid 4–12 Monate | bestätigt | q10 („rothaariger Frischling 4–12 Monate“), q4 („bräunliches Jugendfell“) |
| Wurf meist 5–8 / 4–8 / bis 12 / Ø 6 | bestätigt | q1, q10, q11, q6, q4 |
| Säugezeit 3–4 Monate | bestätigt | q10, q11; q6: 3 Monate |
| Geburtsgewicht 740–1.090 g | bestätigt | q1, q2 |
| `merkmalMonate` 3–8 | bestätigt (abgeleitet) | Geburt 3–5 + 3–5 Monate Streifen ergibt März bis Aug, bei späten Würfen bis Sep/Okt. Rechnung stimmt. |
| `sichtbar` ganzjährig | bestätigt | q1 („während ihres gesamten ersten Lebensjahres Frischlinge“), q3 (nur einige Tage im Kessel) |

### Nahrung
| Angabe | Ergebnis | Beleg |
|---|---|---|
| Eicheln am liebsten, dazu Bucheckern | bestätigt | q3 wörtlich |
| bis 5 kg Eicheln/Bucheckern/Nüsse am Tag | bestätigt | q1 |
| Winter: Wurzeln, Knollen, Ernterückstände (12–2) | bestätigt | q20 (Graubünden) |
| Getreide 4–6, Mais 7–9 | bestätigt mit Einschränkung | q7: Ortungsanteil in Getreide ohne Mais April–Juni und in Mais Juli–September über dem Flächenanteil. **Aufenthalt, nicht Mageninhalt** (steht korrekt im Hinweis). |
| bis 900 Larven in einem Magen | bestätigt | q1 |
| Pilze (ohne Monate) | bestätigt | q4 |
| Überwiegend pflanzlich | bestätigt | q10, q11 |

### Spuren (Fakten)
| Angabe | Ergebnis | Beleg / Korrektur |
|---|---|---|
| Trittsiegel 6–10 cm lang, 5–7 cm breit (DWS) | bestätigt | q5 S. 4 (Bild geprüft), Maße laut S. 3 „durchschnittliche Männchen“ |
| ANL 9–12 cm, Tafel „zirka 10 cm“ | bestätigt | q8 |
| Freiburg 5–11 cm | bestätigt | q10 |
| Afterklauen berühren fast immer den Boden | bestätigt | q5, q8 („stets“), q10, UZH q30 |
| Quelle q16 für „Fährte eindeutig am Geäfter“ | **korrigieren** | Aussage in q16 nicht gefunden. q16 aus `spuren[tritt].quelle` streichen (q5, q8, q10 reichen). |
| Losung 4–7 cm, wurstförmig | bestätigt | q10 (Grafik 4,5–7 cm), q9 |
| Malbaum Rinde bis 1 m, Schlamm, Borsten | bestätigt | q12 wörtlich; q4 belegt „borkig, harzig“ |
| Maiskolben obere Hälfte, 30 % am Boden verzehrt | bestätigt | q10 |
| Schrittlänge / Spurbreite | **offen** | in keiner Quelle. Die „140 cm“ der DWS-Grafik sind die Länge des gezeichneten Fährtenstücks (Reh 110, Rothirsch 160 cm), keine Schrittlänge. Nicht übernehmen war richtig. |

### Gefahren
| Angabe | Ergebnis | Beleg / Korrektur |
|---|---|---|
| Wolf einziger wirklich gefährlicher Feind | bestätigt | q1 („praktisch nur Wölfe wirklich gefährlich“), q11 |
| 16,3 % der Wolfsbeute Lausitz | bestätigt | q19 |
| Fuchs als Feind | bestätigt, `nurJung` **offen** | q4 nennt nur „Feinde: Wolf Fuchs“. |
| Frischlingsanteil 70–80 % an der Strecke | bestätigt | q1 (in q16 nicht gefunden, q16 als Beleg streichen) |
| 40 % der Wildschwein-Unfälle Okt–Dez | bestätigt | q17 wörtlich |
| ASP in Deutschland seit 10.09.2020 | bestätigt | q18 („erstmals am 10.09.2020 in Schenkendöbern … bei einem Wildschwein“) |

### Lebensraum, Schutz
| Angabe | Ergebnis | Beleg / Korrektur |
|---|---|---|
| Laub-/Mischwald, feuchte Böden, Felder, Röhricht; meidet offenes Land und Hochlagen | bestätigt | q6 wörtlich, q10 |
| Ganzjährig überwiegend Wald, Feldnutzung ab April, Gipfel Juli | bestätigt | q7 |
| „Streifgebiete 39 ha bis 13.600 ha“ | **korrigieren** (Formulierung) | Die Werte sind keine BW-Ergebnisse, sondern Literatur in q7: 39 ha = eine Bache in Rostock (Brüsehaber 2016), 13.600 ha = Maillard et al. 1995 (Frankreich). Richtig: „Streifgebiete je nach Gebiet sehr verschieden, aus der Literatur 39 ha (Stadt Rostock) bis 13.600 ha“. |
| Rote Liste: ungefährdet, sehr häufig, deutliche Zunahme, Mais als Ursache | bestätigt | q14 |
| Jagdrecht § 2 BJagdG | bestätigt | q15 |
| BNatSchG-Status | **offen** | nicht geprüft (WISIA). |

### Besonderheiten
| Angabe | Ergebnis | Beleg / Korrektur |
|---|---|---|
| Keine funktionierenden Schweißdrüsen, Schlamm kühlt | bestätigt | q13 (Bracke 2011): „Pigs lack functional sweat glands“. Hinweis: q13 betont, dass es für andere Funktionen als Kühlung (Parasiten, Duft) **wenig wissenschaftliche Belege** gibt. q4 nennt Parasiten trotzdem. Text „hilft gegen Parasiten“ abschwächen („vermutlich auch“). |
| Gesuhlt wird auch im Winter | bestätigt | q16 (Antwort „suhlt nur in den Sommermonaten“ ist falsch markiert) |
| Malbaum borkig/harzig, immer derselbe Baum | bestätigt | q4, q12 |
| Rotte bis 30–40 Tiere | bestätigt | q1 („max. 30 bis 40 Stück“) |
| Junge Keiler spätestens mit 1,5 Jahren raus | bestätigt | q3 („spätestens 1½ Jahren“); q10 nennt 10–12 Monate (Widerspruch klein, Spanne nennen) |
| Leitbache stimmt Paarung ab | bestätigt | q6, q10, q3 |
| Gewaff über 20 cm, ein Drittel sichtbar | bestätigt | q4 wörtlich |
| Zuwachs 200–300 % pro Jahr | **korrigieren** | q1/q2 bestätigt (NRW, „bezogen auf Grundbestand und Jagdjahr“). **Widerspruch:** q11 (Wallis) nennt 100–150 %. Nach Qualitätsregel gilt die Spanne: **„100–300 % je nach Gebiet und Mast“** (q1, q11). |
| Frischlinge ab 8 Monaten fortpflanzungsfähig | bestätigt | q1 (8 Monate, 30 kg), q3 (7–10 Monate) |
| Warnlaut „Blasen“ | bestätigt | q16, Fragen 83 und 88 |
| Wühlen lockert Waldboden | bestätigt | q11 wörtlich; „Trüffelschwein“ steht in q1, nicht in q4 |

**Nachtrag zu „Offen“ in fakten.md:** Die Frischlingssterblichkeit durch Nässe und Kälte ist in einer guten Quelle belegt: q3 (LWF) „Nasskalte Witterung in den ersten Wochen bzw. Monaten nach der Geburt kann zu hohen Ausfällen führen.“ Kann als Gefahr „Nasskaltes Wetter (nur Frischlinge)“ aufgenommen werden.

---

## 2. Fotos (`bilder.json`, `assets/fotos/wildschwein/`)

Alle 15 Fotos stehen in `src/data/fotos.ts` und in `DATENQUELLEN.md` mit Urheber, Lizenz und Commons-Link. Lizenzen (CC BY, CC BY-SA, gemeinfrei) zulässig. Kein Hausschwein, kein Gehege, kein Zaun zu sehen. Alle Originale über 1000 px breit.

| Platz | Foto | Ergebnis | Bemerkung |
|---|---|---|---|
| hero | Locha(js) | bestätigt | Erwachsenes Tier seitlich, scharf, frei lebend, Łódź 10.05.2010. **Korrigieren (Text):** Commons sagt nur „Wild boar“; „Bache“ ist nicht belegt (kein Gewaff sichtbar, Geschlecht unsicher). DATENQUELLEN „Frühsommer“ → 10. Mai = **Frühling**. |
| jahreszeiten.fruehling | Lodz (js)41 | bestätigt | 15.03.2015, kahler Birkenwald, gestreifte Frischlinge. Passt. |
| jahreszeiten.sommer | Lodz (js)27 | bestätigt | 17.07.2012, sattes Laub, kurzes, helles Fell. |
| jahreszeiten.herbst | Bois de Roly, cropped | bestätigt (mit Hinweis) | Aufnahme 11.12.2022. Kalendarisch (astronomisch) noch Herbst bis 21.12., meteorologisch schon Winter. Bild zeigt eindeutig Herbst: braunes Falllaub, kein Schnee, Wühlen nach Mast. Für den Bildplatz vertretbar. Ein Foto aus Okt/Nov wäre besser, kein Pflichtersatz. Ausschnitt stammt vom Fotografen selbst (eigene Commons-Datei), also keine Bearbeitung durch uns. Belgien = Mitteleuropa. |
| jahreszeiten.winter | Deelerwoud | bestätigt | 26.01.2013, Schnee, dunkles Winterfell. Leichte Bewegungsunschärfe, Tier gut erkennbar. Veluwe, frei lebend. |
| jung | Frischling 0925 | bestätigt | Pfälzerwald 18.06.2014, Streifen deutlich (beginnen zu verblassen, passt zu ca. 2–3 Monaten). |
| jung.rotbraun | Ardennen-4 | bestätigt | Malmedy (B), 18.08.2013, Streifen verblasst, rotbraun. |
| aktiv | Dreckschwein | bestätigt | NSG Schellbruch Lübeck, 18.06.2020, Kopf voller Schlamm am Röhricht. Ob es wühlt oder suhlt, ist nicht eindeutig, beides passt zu „aktiv“. Könnte auch den leeren Platz „suhle“ füllen. |
| ruhe | Lodz (js)33 | bestätigt | Sitzt ruhend am Birkendickicht, 18.04.2013. |
| rotte | Lodz (js)38 | bestätigt (mit Hinweis) | Bache + sechs Frischlinge. **Gleicher Tag und gleiche Stelle wie das Frühlingsfoto (15.03.2015)**, wirkt auf der Seite wie eine Wiederholung. Bei Gelegenheit ersetzen (z. B. gemischte Rotte aus Deutschland). |
| hinweis | Wildschwein.jpg | bestätigt | Hambach a. d. Weinstraße 13.06.2014, Bache mit Frischlingen, frei lebend (Commons bestätigt). |
| spuren.tritt | Empreinte de sanglier | **offen** | Commons: Chris Le Jeune, CC BY-SA 4.0, 14.04.2008, Kategorie „Sus scrofa tracks“. **Kein Ort angegeben**, „Frankreich“ in bilder.json ist nicht belegt (Text korrigieren). Fachlich: Zwei lange Schalen, zwei Gruben dahinter. Die Afterklauen liegen aber recht weit hinten und kaum breiter als die Schalen. Bei Rothirsch in tiefem Schlamm sähe das ähnlich aus. Als Wildschwein plausibel, aber nicht eindeutig. Besser: `Empreinte_de_sanglier_-4.jpg` (gleicher Urheber, Afterklauen deutlich seitlich-hinten und breiter gestellt, siehe Referenzliste in spuren.json). |
| spuren.suhle | Schorlenberg | bestätigt | Pfälzerwald 17.08.2007, gemeinfrei (vom Urheber freigegeben). Typische Waldsuhle. |
| spuren.malbaum | Rehahn BAR | bestätigt | Schlammkruste und blanke Rinde bis Kniehöhe, Brandenburg. Passt zu q12. |
| spuren.gebraech | Schweinerei-…-001 | bestätigt | Commons: Mammolshain (Hessen), Januar 2010, CC BY-SA 3.0. „Deutschland“ ist korrekt, genauer ist Mammolshain (Taunus). |

**Herkunft Łódź:** 5 von 15 Fotos stammen von einem Fotografen am Stadtrand von Łódź. Alle frei lebend, Polen liegt in Mitteleuropa, die Regel (bevorzugt DE/Mitteleuropa) ist also erfüllt. Kein Ausschlussgrund. Wenn gleichwertige deutsche Freiland-Fotos auftauchen, für hero oder rotte tauschen.

**Leere Plätze** (fellwechsel, suhle, erkunden.maennlich, kessel): Begründungen nachvollziehbar. Schutzhinweis für den Kessel (nur Zeichnung) richtig.

## 3. Erkunden-Punkte (Foto `wildschwein/hero`, 1200 × 826)
| Punkt | Prozent | Ergebnis |
|---|---|---|
| ruessel | [6, 47] → ca. (72, 388) px | bestätigt, liegt auf der Rüsselscheibe |
| borsten | [45, 13] → ca. (540, 107) px | bestätigt, Kammborsten auf dem Rücken |
| ohr | [23, 14] → ca. (276, 116) px | bestätigt, auf dem linken Ohr |
| zahn, huf | weggelassen | richtig (nicht sichtbar) |

Lebensraum-Zonen auf `landschaft/waldrand-wiese`: [90,52] Waldrand, [78,64] Waldfuß/Wiesenrand, [30,78] Wiese. Plausibel.

## 4. Verbreitung (`verbreitung.md`, `src/data/nachweise/wildschwein.json`)
| Punkt | Ergebnis | Bemerkung |
|---|---|---|
| 16.531 Nachweise, 1.687 Felder, Verteilung 537/590/392/168 | bestätigt | in der JSON nachgezählt. GBIF-API gibt heute 16.543 (ohne basisOfRecord-Filter), passt. |
| DJV-Strecke 2024/25 (568.497; BY 69.116, RP 62.005, BB 60.208, MV 59.631, HE 57.859, BW 56.328, NI 41.760, NW 40.088; HB 14, HH 312, BE 1.875) | bestätigt | Infografik abgelesen, alle Zahlen stimmen |
| LWF: fast flächendeckend in Bayern, Vormarsch in die Alpen | bestätigt | q3 wörtlich |
| Petrak: Ausbreitung seit 1930, Grenze 50-cm-Schneehöhe | bestätigt | q2 wörtlich |
| Thünen Project Brief MV | offen | PDF nicht geladen, nur Suchergebnis. Für das Fazit nicht nötig. |
| „nur Beobachtungen in freier Natur (keine Gehege-/Zootiere)“ | **korrigieren** (Text) | Das Skript filtert nur `basisOfRecord` (keine Museums- und Lebendsammlungen). Gehege-Beobachtungen, die als HUMAN_OBSERVATION gemeldet sind, werden **nicht** sicher ausgefiltert. Richtig: „ohne Museums- und Zoobelege; einzelne Wildpark-Meldungen möglich“. Für diese Art ohne Folgen für das Kartenbild (Wildparks liegen im Verbreitungsgebiet). |
| Lücken Ost-/Südbayern, Erzgebirge, NW-Niedersachsen, dünn in MV/BB | bestätigt als Meldelücke | Begründung nachvollziehbar: höchste Strecken in BY, BB, MV bei dünnen GBIF-Daten. Felder **nicht** künstlich aufgefüllt, das ist richtig. |
| Ausreißer: keine ausgeschlossen | bestätigt | Einzelnachweise Allgäu/Werdenfels am Alpenrand passen zu q3. |

**Folge für die App:** Die Karte zeigt Meldungen, nicht die echte Verbreitung. Ohne Hinweis würde ein Nutzer in Ost-Bayern oder Brandenburg glauben, dort gebe es kaum Wildschweine. Das ist fachlich falsch, denn dort liegen die höchsten Jagdstrecken. Die Karte braucht einen sichtbaren Satz wie „Gemeldete Funde (GBIF). Das Wildschwein lebt fast überall in Deutschland, leere Felder heißen nur: keine Meldung.“ Vor einer Veröffentlichung: GBIF-Download mit DOI (steht schon in verbreitung.md).

## 5. Spuren (`spuren.json`, `spuren-vorschau.png`)
| Punkt | Ergebnis | Bemerkung |
|---|---|---|
| Form: 2 Schalen, dazwischen ein Spalt, 2 Afterklauen hinten-seitlich, breiter als die Schalen, schräg gestellt (außen vorn, innen hinten) | bestätigt | Deckt sich mit UZH-Zeichnung (q30), ANL-Tafel (q8) und DWS-Grafik (q5). Keine Krallen, keine Ballen-Extras, richtig für einen Paarhufer. |
| Länge 6–10 cm, Breite 5–7 cm | bestätigt | q5 (über Afterklauen gemessen, so in spuren.json erklärt) |
| Abweichung zu fakten.json (Länge 6–12 cm) | Hinweis | spuren.json zeichnet nach DWS (6–10), fakten.json nennt die Spanne aller Quellen (6–12). Beides belegt. Der Bauer soll **eine** Zahl verwenden und die Spanne 6–12 cm (q5, q8, q10) zeigen. |
| Vorder- = Hinterfuß | offen | keine Quelle für getrennte Formen/Maße. Gleiche Zeichnung ist vertretbar. |
| Fährte „versetzt“ (ziehend) | bestätigt | ANL-Tafel „Wildschwein (ziehend)“: Tritte abwechselnd links/rechts |
| Schrittlänge, Spurbreite in cm | **offen** | nicht belegt. Pipeline verlangt sie. Nicht schätzen, sondern Fährte nur als Muster ohne cm zeigen. Bei der nächsten Recherche Bestimmungsbuch prüfen (z. B. Bang/Dahlström „Tierspuren“). |
| Untergründe Schnee/Matsch | bestätigt | ANL „im Schnee“, Fotos im Schlamm |

---

## Freigabe: **ja** (mit Auflagen)

Keine falsche Art, kein Gehegefoto, keine erfundene Zahl gefunden. Die Fehler sind Zuordnungs- und Formulierungsfehler. Der `tierseite-bauer` darf bauen, wenn er die folgenden Korrekturen übernimmt:

1. `groesse.typisch`: „DJV Durchschnitt 80 kg“ streichen → „meist etwa 70 kg“ (q5).
2. Besonderheit „Rekord-Nachwuchs“: „200–300 %“ → „100–300 % je nach Gebiet und Mast“ (q1, q11).
3. Lebensraum-Hinweis Streifgebiete: als Literaturwerte kennzeichnen (Rostock 39 ha, Frankreich 13.600 ha), nicht als BW-Ergebnis.
4. Quellen-IDs: q16 aus `spuren[tritt]` und aus `gefahren[Jagd]` streichen. Bei „Wühlen“ steht „Trüffelschwein“ in q1, nicht in q4.
5. Suhlen-Text: „hilft gegen Parasiten“ → „vermutlich auch gegen Parasiten“ (q13).
6. Bildtexte: hero nicht als „Bache“ bezeichnen, Datum = Frühling. Bei spur-tritt „Frankreich“ streichen. Gebräch: Mammolshain (Taunus). Verbreitung: „keine Gehegetiere“ → „ohne Museums- und Zoobelege“.
7. Karte: sichtbarer Hinweis „gemeldete Funde, nicht vollständige Verbreitung“.

Empfehlungen (nicht Pflicht): spur-tritt durch `Empreinte_de_sanglier_-4.jpg` ersetzen. Rotte-Foto gegen ein Foto von einem anderen Tag tauschen. Gefahr „nasskaltes Wetter (Frischlinge)“ mit q3 ergänzen. `aktiv`-Foto zusätzlich für „suhle“ prüfen.

## Muss im Code mit `// TODO fachlich prüfen` markiert werden
- `groesse.cm` Untergrenze 55 cm (nur Wildpark-Quelle q24)
- `groesse.gewicht` Untergrenze 50 kg (abgeleitet)
- `fell.monate`: Werte Mai–Jul (1), Aug (0,5) und Okt–Dez (0); nur der Beginn der Wechsel ist belegt, Quelle q23 sekundär
- `jahr.suhlen` Monate 6–8 (Zuordnung „Sommer“, nicht aus Quelle)
- `jung.merkmalMonate` 3–8 (aus Geburtszeit + Streifendauer abgeleitet)
- `nahrung` Getreide 4–6 / Mais 7–9 (Aufenthaltsdaten BW, kein Mageninhalt)
- `gefahren.Fuchs.nurJung` (offen)
- `schutz.bnatschg` (nicht geprüft)
- Zuwachsrate (Widerspruch 100–150 % vs. 200–300 %)
- Junge Keiler verlassen die Rotte: 10–12 Monate (q10) bis spätestens 1,5 Jahre (q3)
- Trittsiegel: gleiche Form für Vorder- und Hinterfuß (keine Quelle für Unterschiede)
- Fährte: keine Schrittlänge/Spurbreite (offen, nicht anzeigen)
- Aktivitäts-Uhrzeiten (nur Mitte Oktober, Oberschwaben; mit Sonnenstand verschieben)
- Foto `spuren.tritt` (Art nicht eindeutig, Ort unbekannt)
- Verbreitungskarte (Meldeaufwand, keine echte Verbreitungsgrenze)
