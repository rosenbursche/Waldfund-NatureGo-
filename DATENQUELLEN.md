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

### Orte und Postleitzahlen (GeoNames)
- **Was:** rund 19.000 Postleitzahlen und Orte in Deutschland mit Koordinaten, für die Offline-Ortssuche im Onboarding.
- **Wo:** https://download.geonames.org/export/zip/DE.zip
- **Lizenz:** Creative Commons Namensnennung 4.0 (CC BY 4.0). Die Namensnennung „GeoNames“ steht in der App unter Einstellungen → Datenquellen.
- **Im Projekt:** `scripts/orte-bauen.mjs` → `src/data/orte.json` (ca. 720 KB, Koordinaten auf ~1 km gerundet, ohne Firmen-Postleitzahlen).

### Artendaten aus dem Prototyp
- 39 Arten aus `prototyp-wildfund.html`, übernommen nach `src/data/arten.ts`.
- Verbreitungskarten sind **Demo-Daten** (`src/data/verbreitung.ts`), keine echten Funde.

## Geprüft, (noch) nicht verwendet

| Quelle | Ergebnis |
|---|---|
| BfN: Naturräumliche Gliederung (Haupteinheiten) | Im Geodatenkatalog gelistet, Nutzung nach GeoNutzV. Einen direkten, frei erreichbaren Download habe ich nicht gefunden. Die Thünen-Wuchsgebiete sind für Bäume ohnehin passender. |
| BfN: Karte der potentiellen natürlichen Vegetation (PNV, 1:500.000) | Bundesweit nur als gedrucktes Kartenwerk (BfN-Schriftenvertrieb) gefunden. Keinen freien bundesweiten Geodaten-Download gefunden. |
| Bayern (LfU): PNV als Geopackage | Frei verfügbar unter **CC BY 4.0**, aber nur für Bayern. Damit ließe sich später die Regel-Engine für bayerische Naturräume genauer prüfen. Quelle: [LfU Bayern PNV](https://www.lfu.bayern.de/natur/potentielle_natuerliche_vegetation/index.htm) |

## Später nötig
- Echte Verbreitungsdaten auf Rasterebene (TK25), z. B. FloraWeb, GBIF oder Atlas-Projekte. Lizenzen sind dann je Datensatz zu prüfen.
- Bilderkennung (Pl@ntNet, iNaturalist): Recherche folgt in Phase 8.
