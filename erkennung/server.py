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
from typ_erkennung import TypErkenner

GRUPPEN = {'saeuger', 'voegel', 'pflanzen', 'pilze'}
MAX_BYTES = 15 * 1024 * 1024

app = FastAPI(title='Wildfund Erkennung (Prototyp)')
erkenner = Erkenner()
fundstuecke = FundstueckVektoren(erkenner.modell, erkenner.geraet, erkenner.skala)
NACH_WISS = {a['wiss']: i for i, a in enumerate(erkenner.arten)}
# Fundstück-Typen, für die es eigene Text-Vektoren gibt (recherche/erkennung/fundstuecke-test.md, Variante CB)
FUNDSTUECK_TYPEN = {'trittsiegel', 'losung', 'feder', 'frass', 'blatt', 'rinde', 'knospe', 'frucht'}
_cb_cache = {}
typ_erkenner = TypErkenner(erkenner.geraet)
TYP_MINDESTENS = 0.05  # Typen, die unwahrscheinlicher sind, werden gar nicht erst verglichen


def fundstueck_vektor(typ, i):
    """Mischung aus Art-Vektor und Fundstück-Vektor (im Test am besten: 80 % Platz 1, 100 % unter den ersten 6)."""
    if (typ, i) not in _cb_cache:
        a = erkenner.arten[i]
        c = fundstuecke.text_vektor(typ_texte_art(typ, a['wiss'], a['en']))
        _cb_cache[(typ, i)] = F.normalize(c + erkenner.vektoren[i], dim=-1)
    return _cb_cache[(typ, i)]


def fundstueck_rangliste(f, typ, kandidaten):
    """Wahrscheinlichkeit je Kandidat für einen Fundstück-Typ → Liste (zeile, p), beste zuerst."""
    zeilen = [NACH_WISS[w] for w in dict.fromkeys(kandidaten) if w in NACH_WISS]
    if not zeilen:
        return []
    m = torch.stack([fundstueck_vektor(typ, i) for i in zeilen])
    p = F.softmax(erkenner.skala * (m @ f), dim=0).cpu().numpy()
    return [(zeilen[k], float(p[k])) for k in np.argsort(-p)[:VORSCHLAEGE]]


def fundstueck_erkennen(bild, typ, kandidaten):
    """Vergleicht nur mit den Arten, die die App für diesen Fundstück-Typ schickt."""
    rang = fundstueck_rangliste(erkenner.fingerabdruck(bild), typ, kandidaten)
    if not rang:
        raise HTTPException(400, 'Keine bekannten Kandidaten für diesen Fundstück-Typ.')
    top = [erkenner._art(i, p) | {'typ': typ} for i, p in rang]
    sicher = top[0]['sicherheit'] >= SCHWELLE
    return {
        'status': 'sicher' if sicher else 'unsicher',
        'art': top[0] if sicher else None,
        'gattung': None,
        'vorschlaege': top,
        'kandidaten': len(rang),
        'hinweis': PILZ_HINWEIS if any(t['gruppe'] == 'pilze' for t in top[:3]) else None,
    }


def automatisch_erkennen(bild, katalog, gruppe=None):
    """Der Server findet selbst heraus, ob das Foto ein ganzes Lebewesen oder ein Fundstück zeigt.

    1. Typ-Klassifikator: Wahrscheinlichkeit je Typ (ganz, trittsiegel, losung …).
    2. Für jeden Typ, der in Frage kommt: Wahrscheinlichkeit je Art (ganz: alle Arten, sonst nur die Arten mit
       diesem Fundstück, Variante CB).
    3. Gemeinsame Rangliste: P(Typ) · P(Art | Typ). So stehen bei einem unklaren Foto z. B. „Reh · Trittsiegel“ und
       „Wildschwein · Losung“ nebeneinander, und der Nutzer wählt.
    """
    f = erkenner.fingerabdruck(bild)
    pt = typ_erkenner.wahrscheinlichkeiten(f)
    eintraege = []  # (gemeinsame Wahrscheinlichkeit, Vorschlag)
    ganz = None
    if pt['ganz'] >= TYP_MINDESTENS:
        ganz = erkenner.erkennen(None, gruppe=gruppe, fingerabdruck=f)
        eintraege += [(pt['ganz'] * v['sicherheit'], v | {'typ': None}) for v in ganz['vorschlaege']]
    for typ, kandidaten in katalog.items():
        if typ in FUNDSTUECK_TYPEN and pt.get(typ, 0) >= TYP_MINDESTENS:
            eintraege += [(pt[typ] * p, erkenner._art(i, p) | {'typ': typ}) for i, p in fundstueck_rangliste(f, typ, kandidaten)]
    eintraege.sort(key=lambda x: -x[0])
    top = [v | {'sicherheit': round(p, 3)} for p, v in eintraege[:VORSCHLAEGE]]
    erste = top[0]
    if erste['typ'] is None and pt['ganz'] >= SCHWELLE:
        # klar ein ganzes Lebewesen: Entscheidung wie bisher (sicher / Gattung / kein Wildfund), im Test zu 97–99 % richtig
        status = ganz['status']
    elif erste['typ'] is not None and erste['sicherheit'] >= SCHWELLE:
        status = 'sicher'  # gibt bei Fundstücken trotzdem keine Punkte allein (Gesamtkonzept 17.4)
    else:
        status = 'unsicher'
    typ_beste = max(pt, key=pt.get)
    return {
        'status': status,
        'art': (ganz['art'] | {'typ': None} if erste['typ'] is None else erste) if status == 'sicher' else None,
        'gattung': ganz['gattung'] if status == 'gattung' else None,
        'vorschlaege': top,
        'typ': {'name': typ_beste, 'sicherheit': round(pt[typ_beste], 3)},
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
    fundstuecke: str | None = Form(None),
):
    """fundstuecke: JSON {typ: [wissenschaftliche Namen]} – dann erkennt der Server selbst, ob das Foto ein ganzes
    Lebewesen oder ein Fundstück zeigt (so arbeitet die App).
    typ + kandidaten: nur dieser Fundstück-Typ (zum Testen). Ohne alles: nur ganze Lebewesen."""
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
    if fundstuecke:
        try:
            katalog = json.loads(fundstuecke)
            assert isinstance(katalog, dict)
        except (json.JSONDecodeError, AssertionError):
            raise HTTPException(400, 'fundstuecke muss ein JSON-Objekt {typ: [Namen]} sein.')
        return automatisch_erkennen(bild, katalog, gruppe=gruppe)
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
