"""Erkennungs-Server (Prototyp). Start lokal:

    venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8765

--host 0.0.0.0: auch das Handy im selben WLAN erreicht den Server (http://<IP des Macs>:8765).

Test im Browser: http://localhost:8765/docs (dort ein Foto hochladen).
Fotos werden nur im Arbeitsspeicher verarbeitet und nicht gespeichert.
"""
import io
import json

import numpy as np
import torch
import torch.nn.functional as F
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from artbilder import bilder
from erkenner import PILZ_HINWEIS, SCHWELLE, VORSCHLAEGE, Erkenner
from fundstueck_vektoren import FundstueckVektoren, typ_texte_art

GRUPPEN = {'saeuger', 'voegel', 'pflanzen', 'pilze'}
MAX_BYTES = 15 * 1024 * 1024

app = FastAPI(title='Wildfund Erkennung (Prototyp)')
erkenner = Erkenner()
fundstuecke = FundstueckVektoren(erkenner.modell, erkenner.geraet, erkenner.skala)
NACH_WISS = {a['wiss']: i for i, a in enumerate(erkenner.arten)}
# Fundstück-Typen, für die es eigene Text-Vektoren gibt (recherche/erkennung/fundstuecke-test.md, Variante CB)
FUNDSTUECK_TYPEN = {'trittsiegel', 'losung', 'feder', 'frass', 'blatt', 'rinde', 'knospe', 'frucht'}
_cb_cache = {}


def fundstueck_vektor(typ, i):
    """Mischung aus Art-Vektor und Fundstück-Vektor (im Test am besten: 80 % Platz 1, 100 % unter den ersten 6)."""
    if (typ, i) not in _cb_cache:
        a = erkenner.arten[i]
        c = fundstuecke.text_vektor(typ_texte_art(typ, a['wiss'], a['en']))
        _cb_cache[(typ, i)] = F.normalize(c + erkenner.vektoren[i], dim=-1)
    return _cb_cache[(typ, i)]


def fundstueck_erkennen(bild, typ, kandidaten):
    """Vergleicht nur mit den Arten, die die App für diesen Fundstück-Typ schickt."""
    zeilen = [NACH_WISS[w] for w in dict.fromkeys(kandidaten) if w in NACH_WISS]
    if not zeilen:
        raise HTTPException(400, 'Keine bekannten Kandidaten für diesen Fundstück-Typ.')
    f = erkenner.fingerabdruck(bild)
    m = torch.stack([fundstueck_vektor(typ, i) for i in zeilen])
    p = F.softmax(erkenner.skala * (m @ f), dim=0).cpu().numpy()
    ordnung = np.argsort(-p)[:VORSCHLAEGE]
    top = [erkenner._art(zeilen[k], p[k]) for k in ordnung]
    sicher = top[0]['sicherheit'] >= SCHWELLE
    return {
        'status': 'sicher' if sicher else 'unsicher',
        'art': top[0] if sicher else None,
        'gattung': None,
        'vorschlaege': top,
        'kandidaten': len(zeilen),
        'hinweis': PILZ_HINWEIS if any(t['gruppe'] == 'pilze' for t in top[:3]) else None,
    }


@app.get('/gesund')
def gesund():
    return {'ok': True, 'arten': len(erkenner.arten), 'geraet': erkenner.geraet}


@app.post('/erkennen')
async def erkennen(
    foto: UploadFile = File(...),
    gruppe: str | None = Form(None),
    typ: str | None = Form(None),
    kandidaten: str | None = Form(None),
):
    """typ: Fundstück-Typ (trittsiegel, losung …) oder leer für das ganze Lebewesen.
    kandidaten: bei Fundstücken JSON-Liste wissenschaftlicher Namen, die dieses Fundstück haben."""
    if typ and typ not in FUNDSTUECK_TYPEN:
        raise HTTPException(400, f'Unbekannter Typ. Erlaubt: {", ".join(sorted(FUNDSTUECK_TYPEN))}')
    if gruppe and gruppe not in GRUPPEN:
        raise HTTPException(400, f'Unbekannte Gruppe. Erlaubt: {", ".join(sorted(GRUPPEN))}')
    daten = await foto.read()
    if len(daten) > MAX_BYTES:
        raise HTTPException(413, 'Foto ist zu groß (höchstens 15 MB).')
    try:
        bild = Image.open(io.BytesIO(daten))
    except UnidentifiedImageError:
        raise HTTPException(400, 'Das ist kein Bild, das wir lesen können (JPEG oder PNG).')
    if typ:
        try:
            liste = json.loads(kandidaten or '[]')
        except json.JSONDecodeError:
            raise HTTPException(400, 'kandidaten muss eine JSON-Liste sein.')
        return fundstueck_erkennen(bild, typ, liste)
    return erkenner.erkennen(bild, gruppe=gruppe)


@app.get('/artbilder/{art_id}')
def artbilder(art_id: str):
    """Bis zu 3 Vergleichsfotos einer Art mit Lizenz und Urheber (für die Auswahl-Karten)."""
    art = next((a for a in erkenner.arten if a['id'] == art_id), None)
    if not art:
        raise HTTPException(404, 'Diese Art kennt die Erkennung nicht.')
    return {'id': art_id, 'bilder': bilder(art_id, art['wiss'])}
