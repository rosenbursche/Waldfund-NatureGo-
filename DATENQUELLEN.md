# Datenquellen und Lizenzen

Stand der Recherche: 11.10.2026

## Verwendet

### Forstliche Wuchsgebiete und Wuchsbezirke (Thünen-Institut)
- **Was:** „Waldökologische Naturräume Deutschlands“: 82 Wuchsgebiete, rund 800 Wuchsbezirke, 7 forstliche Großlandschaften, mit echten Grenzen.
- **Wo:** WFS-Download-Dienst `https://inspire.thuenen.de/geoserver/wgwb/ows` (Layer `wgwb:wb_2020`, `wgwb:wg_2020`, `wgwb:forstl_gl_2011`). Ansicht im [Thünen-Atlas](https://atlas.thuenen.de/maps/72), Metadaten im [BMEL-Geodatenkatalog](https://gdi-catalog.bmel.de/srv/api/records/a53745d7-635e-4e3c-ba2c-2c15d6441628).
- **Lizenz:** Datenlizenz Deutschland – Namensnennung – 2.0 (dl-de/by-2-0) bzw. GeoNutzV. Kostenlos, auch kommerziell nutzbar.
- **Pflicht:** Namensnennung **„© Thünen-Institut“ plus Jahr des Abrufs**. Sie muss in der App sichtbar sein, z. B. in den Einstellungen oder im Impressum. Der Text steht in `NATURRAUM_QUELLE` (`src/data/naturraeume.ts`).
- **Im Projekt:** `scripts/naturraeume-bauen.mjs` lädt die Daten, verschmilzt die Wuchsbezirke zu 10 Demo-Naturräumen, vereinfacht sie und schreibt `src/data/naturraeume.json` (ca. 38 KB).
- **Wichtig:** Die Daten enthalten **nur Namen und Grenzen**. Höhenstufe, Boden und Großlandschaft der Demo-Naturräume habe ich selbst eingestuft. Sie sind als `TODO fachlich prüfen` markiert.

### Lebendige Deutschlandkarte
- **Wuchsgebiete 2020** (82 Flächen für die Verbreitung) und **Forstliche Großlandschaften 2011** (Untergrund, Umriss): Thünen-Institut, dl-de/by-2-0, Namensnennung „© Thünen-Institut“.
- **Flüsse:** Natural Earth 1:10 Mio. „rivers_lake_centerlines“, **gemeinfrei (Public Domain)**, keine Namensnennung nötig. Quelle: [Natural Earth – Nutzungsbedingungen](https://www.naturalearthdata.com/about/terms-of-use/)
- **Gebirge und Waldgebiete:** von Hand gesetzte Kartensymbole (Lage ungefähr); Waldgebiete nach Bekanntheit, nicht nach gemessenem Waldanteil.
- **Im Projekt:** `scripts/karte-bauen.mjs` → `src/data/karte.json` (ca. 150 KB).

### Orte und Postleitzahlen (GeoNames)
- **Was:** rund 19.000 Postleitzahlen und Orte in Deutschland mit Koordinaten, für die Offline-Ortssuche im Onboarding.
- **Wo:** https://download.geonames.org/export/zip/DE.zip
- **Lizenz:** Creative Commons Namensnennung 4.0 (CC BY 4.0). Die Namensnennung „GeoNames“ steht in der App unter Einstellungen → Datenquellen.
- **Im Projekt:** `scripts/orte-bauen.mjs` → `src/data/orte.json` (ca. 720 KB, Koordinaten auf ~1 km gerundet, ohne Firmen-Postleitzahlen).

### Realistische 3D-Modelle
| Modell | Zeigt | Autor | Lizenz | Quelle | Verwendung |
|---|---|---|---|---|---|
| „Realistic Deer“ | Weißwedelhirsch (kein Reh) | pighunt3r15 | CC BY 4.0 (Namensnennung) | [Sketchfab](https://sketchfab.com/3d-models/realistic-deer-76039b75cdc0492a80680c2404725496) | vorläufig auf der Reh-Seite (als Platzhalter gekennzeichnet) und im 3D-Test |

Namensnennung erscheint in der App unter Einstellungen → Datenquellen und in der Test-Ansicht. Liste im Code: `src/data/modelle.ts`.

### Fotos der Tierseiten (Wikimedia Commons)
- **Was:** echte Fotos für die Tierseiten von Reh und Fuchs (Hero, Erkunden, Jahresrad, Tagesuhr, Spuren, Hinweis).
- **Lizenzen:** CC0, gemeinfrei, CC BY oder CC BY-SA – jeweils auf der Dateiseite geprüft. Gemeinfreie Fotos nur mit nachvollziehbarem Grund (z. B. „PD-self“: vom Fotografen freigegeben).
- **Bearbeitung:** nur verkleinert (max. 1200 px) und als JPEG gespeichert, **nicht beschnitten oder verändert**. Die Anzeige in der App schneidet nur den sichtbaren Ausschnitt zu (wie ein Bilderrahmen).
- **Pflicht:** Urheber und Lizenz sichtbar – in der App am Foto (kleiner Hinweis) und im Abschnitt „Fotos“ jeder Tierseite mit Link zur Quelle. Liste im Code: `src/data/fotos.ts`.
- Ein zunächst gewähltes gemeinfreies Fuchsfoto (US Fish & Wildlife Service) wurde ersetzt, weil es die nordamerikanische Unterart zeigt.

| Datei | Zeigt | Urheber | Lizenz | Quelle |
|---|---|---|---|---|
| `assets/fotos/reh/bock.jpg` | Rehbock mit Geweih | Uoaei1 | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Capreolus_capreolus_Wien_Zentralfriedhof_20221021_05.jpg) |
| `assets/fotos/reh/ricke-sommer.jpg` | Ricke im Sommerfell | caroline legg | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Roe_Deer_-_Doe.jpg) |
| `assets/fotos/reh/bock-aest-winter.jpg` | äsender Rehbock, Winterfell | W.carter | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Roe_deer_in_Brastad_3.jpg) |
| `assets/fotos/reh/kitz.jpg` | Rehkitz im Gras | Gilles San Martin from Namur, Belgium | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Roe_deer_fawn_(3722431080).jpg) |
| `assets/fotos/reh/trittsiegel.jpg` | Reh-Trittsiegel im Schnee | Tomasz Kuran aka Meteor2017 | CC BY 2.5 | [Commons](https://commons.wikimedia.org/wiki/File:Roe_deer_track01.jpg) |
| `assets/fotos/reh/losung.jpg` | Reh-Losung | Ejdzej | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Roe_deer_droppings.jpg) |
| `assets/fotos/fuchs/sitzt-sommer.jpg` | sitzender Rotfuchs | Malene Thyssen | CC BY 2.5 | [Commons](https://commons.wikimedia.org/wiki/File:R%C3%B8d_r%C3%A6v_(Vulpes_vulpes).jpg) |
| `assets/fotos/fuchs/maeusesprung.jpg` | Rotfuchs beim Mäusesprung | Justin Jensen | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Redfox_Pounce_(4453887453).jpg) |
| `assets/fotos/fuchs/ruht.jpg` | ruhender Rotfuchs im Winter | Böhringer Friedrich | CC BY-SA 2.5 | [Commons](https://commons.wikimedia.org/wiki/File:Rotfuchs,_Vulpes_vulpes_1.JPG) |
| `assets/fotos/fuchs/welpe.jpg` | Fuchswelpe | Karl Pinnow | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Vulpes_vulpes_puppy_Naturschutzgebiet_Z%C3%BClowgrabenniederung_11.05.25.jpg) |
| `assets/fotos/fuchs/spur.jpg` | Fuchsspur im Schnee | BorealFox | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Red_fox_track_in_snow.jpg) |
| `assets/fotos/fuchs/losung.jpg` | Fuchs-Losung | gailhampshire from Cradley, Malvern, U.K | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Scat...Fox_-_Flickr_-_gailhampshire.jpg) |
| `assets/fotos/fuchs/steht.jpg` | stehender Rotfuchs (Alpen) | Uoaei1 | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Vulpes_vulpes_Mallnitz_01.jpg) |

### Artendaten aus dem Prototyp
- 39 Arten aus `prototyp-wildfund.html`, übernommen nach `src/data/arten.ts`.
- Verbreitungskarten sind **Demo-Daten** (`src/data/verbreitung.ts`), keine echten Funde.

### Schriften (Google Fonts)
- **Was:** Cinzel (Natanael Gama), Alegreya Sans (Juan Pablo del Peral, Huerta Tipográfica), Kalam (Indian Type Foundry).
- **Wo:** über die Expo-Pakete `@expo-google-fonts/cinzel`, `@expo-google-fonts/alegreya-sans` und `@expo-google-fonts/kalam`. Die Lizenzdatei liegt jeweils als `LICENSE_FONT` im Paket.
- **Lizenz:** SIL Open Font License 1.1. Frei nutzbar, auch kommerziell und eingebettet in Apps. Die Schriften dürfen nur nicht einzeln verkauft werden.

### GBIF – nur Belastungstest (nicht für die Store-Version)
- **Was:** Namensabgleich (Ordnung, Familie, gültiger Name) und Zahl der Beobachtungen in Deutschland für ca. 500 Testarten.
- **Wo:** GBIF-API `https://api.gbif.org/v1/species/match` und `/occurrence/search?country=DE`, Abruf mit `scripts/testarten-bauen.mjs`, Ergebnis `src/data/testarten.json`.
- **Lizenz:** Die GBIF-Backbone-Taxonomie gibt GBIF mit CC BY 4.0 an. Die Beobachtungen stammen aus vielen Datensätzen mit eigenen Lizenzen (CC0, CC BY, teils CC BY-NC). Wir nutzen nur die Gesamtzahl. **Vor einer Nutzung außerhalb des Tests Lizenz und Zitierregeln von GBIF prüfen** (Zitiervorgabe: „GBIF.org (Datum) GBIF Occurrence Download“).
- **Wichtig:** Die Beobachtungszahl ist kein Maß für echte Seltenheit (Meldeverhalten, Kleinarten, Namenswechsel).

## Geprüft, (noch) nicht verwendet

| Quelle | Ergebnis |
|---|---|
| BfN: Naturräumliche Gliederung (Haupteinheiten) | Im Geodatenkatalog gelistet, Nutzung nach GeoNutzV. Einen direkten, frei erreichbaren Download habe ich nicht gefunden. Die Thünen-Wuchsgebiete sind für Bäume ohnehin passender. |
| BfN: Karte der potentiellen natürlichen Vegetation (PNV, 1:500.000) | Bundesweit nur als gedrucktes Kartenwerk (BfN-Schriftenvertrieb) gefunden. Keinen freien bundesweiten Geodaten-Download gefunden. |
| Bayern (LfU): PNV als Geopackage | Frei verfügbar unter **CC BY 4.0**, aber nur für Bayern. Damit ließe sich später die Regel-Engine für bayerische Naturräume genauer prüfen. Quelle: [LfU Bayern PNV](https://www.lfu.bayern.de/natur/potentielle_natuerliche_vegetation/index.htm) |

## Später nötig
- Echte Verbreitungsdaten auf Rasterebene (TK25), z. B. FloraWeb, GBIF oder Atlas-Projekte. Lizenzen sind dann je Datensatz zu prüfen.
- Bilderkennung: siehe unten.

## Bilderkennung (Recherche Phase 8, Stand 11.10.2026)

### Pl@ntNet API – nur Pflanzen
- **Kosten:** kostenlos bis **500 Erkennungen pro Tag**. Darüber hinaus kostenpflichtig (Einstieg 1.000 € für 200.000 Anfragen, danach 2–5 € je 1.000). Für gemeinnützige Bildungs- oder Forschungszwecke auf Anfrage auch darüber hinaus kostenlos.
- **API-Schlüssel:** nötig, kostenloses Konto auf my.plantnet.org. Pro Person bzw. Organisation ist nur **ein** kostenloses Konto erlaubt.
- **Pflicht:** Hinweis in der App: „The image-based plant species identification service used, is based on the Pl@ntNet recognition API“ plus Logo.
- **Fotos:** werden laut Bedingungen **nicht gespeichert**, nur während der Erkennung im Arbeitsspeicher gehalten.
- Quellen: [Nutzungsbedingungen](https://my.plantnet.org/terms_of_use), [Preise](https://my.plantnet.org/pricing), [Kontingente](https://my.plantnet.org/doc/api/quota)

### iNaturalist – alle Gruppen
- Die Bilderkennung (Computer Vision) ist **nicht öffentlich** nutzbar. iNaturalist gibt nur ausgewählten Organisationen **kostenpflichtigen** Zugang für Forschung oder Citizen-Science-Apps, auf Anfrage per E-Mail.
- Die öffentliche iNaturalist-API (Beobachtungen, Arten) enthält die Bilderkennung nicht.
- Quellen: [iNaturalist-Forum: Computer Vision API](https://forum.inaturalist.org/t/computer-vision-suggestion-api/12336), [Forum: Species from photograph](https://forum.inaturalist.org/t/inaturalist-api-species-from-photograph/24686)
