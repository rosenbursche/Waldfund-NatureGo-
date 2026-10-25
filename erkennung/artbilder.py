"""Vergleichsbilder je Art für die Auswahl-Karten der App (Gesamtkonzept Abschnitt 17).

Holt Fotos aus GBIF, nur mit freier Bildlizenz (CC0, CC BY, CC BY-SA, je Bild geprüft), und merkt sie sich in
daten/artbilder.json. Jedes Bild kommt mit Urheber, Lizenz und Quelle, damit die App die Namensnennung zeigt.
Prototyp: Die Bilder werden direkt von der Quelle geladen. Vor dem Start: geprüfte Bilder selbst ablegen.
"""
import json
import re
import sqlite3
import ssl
import threading
import urllib.parse
import urllib.request
from pathlib import Path

import certifi

HIER = Path(__file__).resolve().parent
DB = HIER.parent / 'db' / 'wildfund.sqlite'
CACHE = HIER / 'daten' / 'artbilder.json'
UA = 'WildfundApp/0.1 (https://github.com/rosenbursche/Waldfund-NatureGo-)'
COL = '7ddf754f-d193-4cc9-b351-99906754a03b'  # Catalogue of Life, wie in scripts/db-stufe-a.mjs
SSL = ssl.create_default_context(cafile=certifi.where())
_sperre = threading.Lock()


def _lizenz(text):
    t = (text or '').lower()
    if re.search(r'\bnc\b|-nc|\bnd\b|-nd|non-?commercial|all rights|copyright|©', t):
        return None
    if 'publicdomain/zero' in t or re.search(r'\bcc0\b', t):
        return 'CC0'
    m = re.search(r'licenses/(by-sa|by)/(\d\.\d)', t)
    return f'CC {m.group(1).upper()} {m.group(2)}' if m else None


def _holen(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=20, context=SSL) as r:
        return json.load(r)


def _laden():
    return json.loads(CACHE.read_text()) if CACHE.exists() else {}


def bilder(art_id, wiss, anzahl=3):
    with _sperre:
        cache = _laden()
    if art_id in cache:
        return cache[art_id]
    con = sqlite3.connect(f'file:{DB}?mode=ro', uri=True)
    zeile = con.execute('SELECT col_id FROM art WHERE id = ?', (art_id,)).fetchone()
    q = [('mediaType', 'StillImage'), ('basisOfRecord', 'HUMAN_OBSERVATION'), ('limit', 60)]
    q += [('checklistKey', COL), ('taxonKey', zeile[0])] if zeile and zeile[0] else [('scientificName', wiss)]
    try:
        d = _holen('https://api.gbif.org/v1/occurrence/search?' + urllib.parse.urlencode(q))
    except Exception:
        return []  # ohne Netz: Karte ohne Bild, nicht im Cache merken
    aus, fotografen = [], set()
    for r in d.get('results', []):
        if r.get('recordedBy') in fotografen:
            continue
        for m in r.get('media', []):
            lz = _lizenz(m.get('license'))
            url = m.get('identifier', '')
            if lz and url.startswith('https://'):
                url = url.replace('/original.', '/medium.')  # iNaturalist: mittlere Größe reicht für die Karte
                aus.append({'url': url, 'lizenz': lz, 'urheber': m.get('creator') or m.get('rightsHolder')
                            or r.get('recordedBy') or 'unbekannt',
                            'quelle': f"https://www.gbif.org/occurrence/{r['key']}"})
                fotografen.add(r.get('recordedBy'))
                break
        if len(aus) == anzahl:
            break
    with _sperre:
        cache = _laden()
        cache[art_id] = aus
        CACHE.parent.mkdir(exist_ok=True)
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=1))
    return aus
