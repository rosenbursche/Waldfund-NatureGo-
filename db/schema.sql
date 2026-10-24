-- Wildfund Arten-Datenbank (Entwurf: docs/DATENBANK-ARTEN.md)
-- Schicht 1 Wissen · Schicht 2 Medien · Schicht 3 Gestaltung.
-- Bewusst einfaches SQL, das auch in Postgres (Supabase) läuft. Werte mit Struktur stehen als JSON-Text.

CREATE TABLE art (
  id          TEXT PRIMARY KEY,            -- unser Kurzname, z. B. 'wildschwein'
  gruppe      TEXT NOT NULL,               -- saeuger | voegel | pflanzen | baeume | pilze
  wiss_name   TEXT NOT NULL,
  gbif_key    INTEGER,
  wikidata_id TEXT
);

CREATE TABLE name (
  art_id  TEXT NOT NULL REFERENCES art(id),
  sprache TEXT NOT NULL,                   -- 'de', 'en' …
  name    TEXT NOT NULL,
  haupt   INTEGER NOT NULL DEFAULT 0,      -- 1 = Hauptname
  PRIMARY KEY (art_id, sprache, name)
);

-- Feldkatalog: alle festen Datenpunkte je Gruppe (db/felder/*.mjs)
CREATE TABLE feld (
  id           TEXT NOT NULL,
  gruppe       TEXT NOT NULL,
  kapitel      TEXT NOT NULL,              -- kopf | erkunden | jahr | tag | zuhause | speiseplan | spuren | fressfeinde | gefahr | karte | hinweis
  typ          TEXT NOT NULL,              -- zahl | spanne | monate | text | liste | objekt | stunden | artverweise …
  pflicht      INTEGER NOT NULL DEFAULT 0,
  beschreibung TEXT NOT NULL,              -- Auftrag für die Recherche
  reihenfolge  INTEGER NOT NULL,
  PRIMARY KEY (id, gruppe)
);

-- Eine Angabe je Art und Datenpunkt
CREATE TABLE angabe (
  art_id     TEXT NOT NULL REFERENCES art(id),
  feld_id    TEXT NOT NULL,
  wert       TEXT NOT NULL,                -- JSON
  quelle_ids TEXT NOT NULL DEFAULT '[]',   -- JSON-Liste von quelle.id
  status     TEXT NOT NULL,                -- belegt | uebernommen | abgeleitet | offen | geprueft
  PRIMARY KEY (art_id, feld_id)
);

CREATE TABLE quelle (
  id         TEXT PRIMARY KEY,             -- '<artId>:<id>' oder global
  titel      TEXT NOT NULL,
  url        TEXT NOT NULL,
  abgerufen  TEXT
);

-- Status und Häufigkeit je Gebiet (Land 'DE', Region 'DE-NI', Naturraum 'lueneburger-heide' …)
CREATE TABLE vorkommen (
  art_id     TEXT NOT NULL REFERENCES art(id),
  gebiet     TEXT NOT NULL,
  status     TEXT NOT NULL,                -- heimisch | eingefuehrt | invasiv | unsicher | fehlt | ja | nein
  nachweise  INTEGER,
  seltenheit INTEGER,                      -- 1–4
  quelle_ids TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (art_id, gebiet)
);

-- Verbreitung als Raster: nur Zelle und Anzahl, nie ein genauer Ort
CREATE TABLE zelle (
  art_id    TEXT NOT NULL REFERENCES art(id),
  raster    TEXT NOT NULL,                 -- 'tk25' (heute) | 'h3-5' …
  zelle     TEXT NOT NULL,
  nachweise INTEGER NOT NULL,
  PRIMARY KEY (art_id, raster, zelle)
);

-- Herkunft einer Verbreitung (GBIF-Abfrage)
CREATE TABLE verbreitung_quelle (
  art_id         TEXT NOT NULL REFERENCES art(id),
  raster         TEXT NOT NULL,
  info           TEXT NOT NULL,            -- JSON: quelle, taxonKey, abgerufen, seit, lizenzen, ausgeschlossen, funde
  PRIMARY KEY (art_id, raster)
);

CREATE TABLE fundstueck (
  art_id      TEXT NOT NULL REFERENCES art(id),
  id          TEXT NOT NULL,
  reihenfolge INTEGER NOT NULL,
  daten       TEXT NOT NULL,               -- JSON wie src/data/fundstueckTypen.ts
  PRIMARY KEY (art_id, id)
);

-- Bilder und Töne mit Lizenz
CREATE TABLE medium (
  id         TEXT PRIMARY KEY,             -- z. B. 'wildschwein/hero'
  art        TEXT NOT NULL DEFAULT 'bild', -- bild | ton
  datei      TEXT,                         -- Pfad im Projekt (assets/…), falls offline vorhanden
  seite      TEXT NOT NULL,                -- Herkunftsseite (z. B. Wikimedia Commons)
  autor      TEXT NOT NULL,
  lizenz     TEXT NOT NULL,
  lizenz_url TEXT,
  breite     INTEGER,
  hoehe      INTEGER,
  rolle      TEXT NOT NULL DEFAULT 'anzeige', -- anzeige | referenz | test
  geprueft   INTEGER NOT NULL DEFAULT 0
);

-- Wo ein Medium auf der Seite einer Art steht (ein Foto kann bei mehreren Arten vorkommen, z. B. ein Panorama)
CREATE TABLE medium_platz (
  medium_id TEXT NOT NULL REFERENCES medium(id),
  art_id    TEXT NOT NULL REFERENCES art(id),
  platz     TEXT NOT NULL,                 -- hero, jahreszeiten.winter, spuren.suhle, panorama.foto …
  PRIMARY KEY (medium_id, art_id, platz)
);

-- Schicht 3: wie die App die Art zeichnet (nur für Arten in der App)
CREATE TABLE gestaltung (
  art_id TEXT PRIMARY KEY REFERENCES art(id),
  daten  TEXT NOT NULL                     -- JSON
);

-- Wie viel wir wissen
CREATE TABLE datenstand (
  art_id           TEXT PRIMARY KEY REFERENCES art(id),
  vollstaendig     INTEGER NOT NULL,       -- 0–100
  fehlt            TEXT NOT NULL,          -- JSON-Liste fehlender Pflicht-Datenpunkte
  app_vorschlag    TEXT NOT NULL,          -- ja | nein | offen
  app_entscheidung TEXT                    -- deine Entscheidung
);
