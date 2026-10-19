# Häufigkeit und Dichte räumlich: Datenquellen für Reh und Wildschwein

Stand: 2026-10-19. Nichts davon wurde nach `src/` geladen. Geprüft heißt: Seite oder Datei geöffnet, Format und Lizenzhinweis angesehen.
Kurz vorweg: Jagdstrecken (erlegte Tiere plus Fallwild) sind **kein Bestand**. Sie zeigen nur grob, wie häufig eine Art ist, und hängen stark von der Bejagung ab (beim Wildschwein auch von Mastjahren und der ASP).

## Übersicht

| Quelle | Ebene | Arten | Format | Lizenz | maschinenlesbar |
|---|---|---|---|---|---|
| ENETWILD (EFSA-Projekt), Zenodo | Raster 2×2 km und 10×10 km, ganz Europa | Wildschwein, Reh | GeoTIFF, GeoPackage | **CC BY 4.0** | ja |
| DJV-Handbuch, Infografiken | Bundesland, Jagdjahre 2014/15–2024/25 | Reh, Wildschwein (und andere) | JPG | keine Angabe (Verband) | nein (Bild) |
| Bayern, StMWi „Jahresjagdstrecken Landkreise“ | Landkreis/kreisfreie Stadt, 5 Jagdjahre | alle Arten | HTML-Tabellen | „alle Rechte vorbehalten“ | halb (HTML auslesbar) |
| Niedersachsen, Landesjagdbericht 2024/25 | Landkreis (Tabelle), Karte je 100 ha | Reh, Wildschwein u. a. | PDF | Nutzung nur mit schriftlicher Genehmigung | halb (Text aus PDF) |
| Schleswig-Holstein, Open-Data-Portal (Jagdbericht-Tabellen) | Land; Kreise nur Niederwild | Schalenwild Land, Niederwild Kreise | CSV | **Public Domain Mark** | ja |
| Brandenburg, MLEUV | Land, einzelne Kreise im Text | Reh, Wildschwein | HTML | keine Angabe | nein |
| WILD-Monitoring (DJV/Länder) | Referenzgebiete, Jagdbezirke | v. a. Niederwild, Raubsäuger; **kein Reh/Wildschwein** | Portal, Jahresberichte | keine Angabe | – |

## Einzelheiten

### 1. ENETWILD: frei nutzbare Rasterkarten (beste Wahl für die App-Karte)
- **Wildschwein**
  - „Model outputs of ENETWILD density model for wild boar based on hunting yield data. August 2021“, Dichte-Modell als GeoTIFF 2×2 km und 10×10 km (EPSG:3035), CC BY 4.0: https://zenodo.org/records/5242838
  - „Modelling wild boar abundance at high resolution“ (2024): Raster 2×2 km als GeoPackage, darunter eine Datei mit 1,8 GB, CC BY 4.0: https://zenodo.org/records/10809293
  - „Using the latest data to model wild boar abundance at high spatial resolution“ (Mai 2026): Ausgaben als ZIP (7 MB), R-Skript, Bericht, CC BY 4.0: https://zenodo.org/records/20135759
  - „Modelled wild boar density estimation“ (Mai 2026): Jagdstrecken-Modell auf 10×10 km, ZIP (unter 1 MB), CC BY 4.0: https://zenodo.org/records/20072207
- **Reh**
  - „Wild ruminant distribution in Europe: occurrence and hunting yield models“ (Aug. 2026): `Predicted_HuntingYield_grid2km_RoeDeer_2026_v1.tif` und `Predicted_Density_grid2km_RoeDeer_2026_v1.tif` (je etwa 12 MB), CC BY 4.0: https://zenodo.org/records/21977770
  - Überarbeiteter Bericht dazu (Okt. 2026): https://zenodo.org/records/23192444. Laut Zusammenfassung erklärt die Lebensraum-Eignung die Reh-Dichte nur unzureichend. Die Dichtekarte ist also mit Vorsicht zu lesen.
- Was die Daten sind: Es sind **Modelle**, keine gezählten Tiere. Sie beruhen auf Jagdstrecken, GBIF-Nachweisen und Dichteschätzungen des European Observatory of Wildlife (EOW).
- Für die App: Man müsste die Raster auf Deutschland zuschneiden und vereinfachen, z. B. auf 10 km oder TK25. Namensnennung: „ENETWILD consortium et al., CC BY 4.0“. Vor der Übernahme in `DATENQUELLEN.md` eintragen. Die genaue Zitierweise steht im jeweiligen Zenodo-Eintrag.

### 2. DJV-Jagdstatistik je Bundesland
- Rehwild: https://www.jagdverband.de/sites/default/files/2026-03/2026-02_Infografik_Jahresjagdstrecke_Rehwild_2024_2025.jpg
- Schwarzwild: https://www.jagdverband.de/sites/default/files/2026-03/2026-02_Infografik_Jahresjagdstrecke_Schwarzwild_2024_2025.jpg
- Fallwild (Wildunfälle) je Land: https://www.jagdverband.de/sites/default/files/2026-02/2026-02_Infografik_Wildunfall_Statistik_2024_2025.jpg
- Inhalt: 16 Länder × 11 Jagdjahre. Gesamt 2024/25: Reh 1.265.740, Wildschwein 568.497.
- Es gibt nur absolute Zahlen, keine Werte je 100 ha. Für eine Dichte bräuchte man zusätzlich die Jagdfläche je Land, die fehlt.
- Lizenz: Auf den Seiten steht keine Lizenz. Die Zahlen selbst sind Fakten, die Grafik ist aber geschützt. Vor einer Übernahme beim DJV nachfragen (pressestelle@jagdverband.de, steht auf der Grafik).

### 3. Landkreis-Ebene in den Ländern (nur teilweise geprüft)
- **Bayern**: https://www.stmwi.bayern.de/jagd-forst/oberste-jagdbehoerde/jahresjagdstrecken/jahresjagdstrecken-landkreise/
  - Strecken je Landkreis und Jahr in aufklappbaren HTML-Tabellen (auf der Seite rund 578 Tabellen), Jagdjahre 2019–2024, alle Arten. Es gibt keine CSV und keine Werte je 100 ha.
  - Impressum: „© StMWi – alle Rechte vorbehalten“. Für eine Nutzung also eine Erlaubnis einholen.
- **Niedersachsen**: Landesjagdbericht 2024/25, https://www.ml.niedersachsen.de/download/222878/Landesjagdbericht_2024_2025.pdf
  - Je Art eine Tabelle „Strecke nach Landkreisen“ und eine Karte „Jagdstrecke pro 100 ha bejagbare Fläche“, die bis zu den Gemeindegrenzen reicht. Die Tabellen lassen sich als Text aus dem PDF lesen.
  - Impressum: Eine Veröffentlichung, auch in Auszügen, braucht die vorherige schriftliche Genehmigung des Herausgebers (Nds. ML).
  - Für ältere Jahre gibt es frühere Berichte, z. B. 2023/24: https://www.ml.niedersachsen.de/download/211767/Landesjagdbericht_2023_2024.pdf
- **Schleswig-Holstein**: Jagdbericht-Tabellen als CSV auf opendata.schleswig-holstein.de, alle mit der Lizenz „Public Domain Mark 1.0“, zuletzt geändert 2022:
  - „Schalenwildstrecken im Jahresvergleich“ (nur Landesebene)
  - „Fallwildverluste beim Schalenwild“
  - „Streckenergebnisse ausgewählter Arten je 100 ha Jagdfläche in den Kreisen“. Diese Tabelle enthält **nur Hase, Kaninchen, Fasan und Wildenten**, kein Reh und kein Wildschwein. Ich habe ihren Kopf geprüft.
  - „Anteil männlich/weiblich an der Schwarzwildstrecke 2020“
- **Brandenburg**: Die Pressemitteilung zur Jagdstrecke 2024/25 nennt 60.208 Wildschweine und 45.351 Rehe, aber keine Kreistabelle. Die Seite „Jagdstrecken der letzten Jahre“ (https://mleuv.brandenburg.de/mleuv/de/umwelt/jagd/jagdstatistik/jagdstrecken/) habe ich **nicht geöffnet**.
- **Baden-Württemberg**: Die WFS-Mitteilung 7/2024 zur Jagdstrecke 2023 ist ein PDF mit Fließtext, der einzelne Kreise nennt. Eine Kreistabelle oder Lizenz habe ich nicht gefunden. Das Wildtierportal BW habe ich nicht weiter geprüft.
- **NRW**: Der LJV NRW zeigt nur Landessummen. Das LANUV-PDF „Erläuterungen zur Jagdstrecke 2023/2024“ ist ein Fließtext ohne Kreistabelle. Kreisdaten habe ich nicht gefunden.
- **Rheinland-Pfalz**: Auf der LJV-Seite wurden keine Zahlen angezeigt. Auf GovData gibt es „Handlungsprogramm Schwarzwild“ als PDF, das ich nicht geöffnet habe.
- **Sachsen**: Ein PDF auf wolf.sachsen.de enthält nur die Kreise Bautzen und Görlitz und Sachsen gesamt, für die Jahre 2009/10–2016/17. Für eine Karte reicht das nicht.
- Hessen, Thüringen, Mecklenburg-Vorpommern, Saarland, Sachsen-Anhalt, Hamburg, Bremen und Berlin: **nicht geprüft**.

### 4. GovData (Bundesportal offener Daten)
- Ich habe in der CKAN-API nach „Jagdstrecke“, „Schwarzwild“, „Rehwild“ und „Wildunfall“ gesucht. Außer den Tabellen aus Schleswig-Holstein gab es keinen Datensatz mit Jagdstrecken je Kreis.
- Gefunden habe ich außerdem:
  - „Wildunfallhäufungsabschnitte“ aus Schleswig-Holstein (CSV/JSON). Das sind Straßenabschnitte, keine Tierdichte.
  - „Jagdbezirke Kreis Viersen“ (GeoJSON). Das sind Grenzen, keine Strecken.

### 5. Weitere Quellen
- **GBIF-Nachweise**: CC0 oder CC BY je Datensatz. Das Projekt nutzt sie schon (`scripts/gbif-verbreitung.mjs`). Sie zeigen, wo die Art vorkommt, aber nicht, wie häufig sie ist, denn sie hängen davon ab, wie oft dort gemeldet wird.
- **Tierfund-Kataster (DJV)**: Es sammelt Wildunfall-Meldungen. Ich habe keinen offenen Datenexport gefunden, nur Auswertungen in Pressemitteilungen.
- **WILD-Monitoring** (https://wild-monitoring.de): Es erfasst vor allem Niederwild und Raubsäuger, Reh und Wildschwein sind dort keine Kernarten. Ein Export ist laut DJV möglich, eine Lizenz ist nicht angegeben.

## Empfehlung
1. Für eine **Häufigkeitskarte**: Die ENETWILD-Raster sind offen (CC BY 4.0), maschinenlesbar und decken ganz Deutschland gleich ab. Man sollte sie in der App als „Modell, geschätzt“ kennzeichnen.
2. Als **Zahl im Text**: Die DJV-Landessummen eignen sich, z. B. „2024/25 rund 1,27 Mio. Rehe erlegt oder tot gefunden“. Vorher die Nutzung beim DJV klären oder nur einzelne Fakten mit Quelle nennen.
3. Landkreis-Tabellen aus Bayern und Niedersachsen nur mit Erlaubnis der Ministerien verwenden. Sie decken außerdem nicht ganz Deutschland ab.

## Offen
- Ob einzelne Länder Kreisstrecken unter einer offenen Lizenz anbieten (Hessen, Thüringen, MV, Sachsen-Anhalt, Brandenburg-Archivseite): nicht geprüft.
- Die genauen Zitier- und Namensnennungsangaben der ENETWILD-Dateien: im Zenodo-Eintrag nachlesen, bevor die Daten übernommen werden.
- Die rechtliche Frage, ob reine Zahlen aus „alle Rechte vorbehalten“-Tabellen übernommen werden dürfen (Datenbankrecht): nicht geklärt, im Zweifel nachfragen.
