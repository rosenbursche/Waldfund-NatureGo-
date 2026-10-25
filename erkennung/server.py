"""Erkennungs-Server (Prototyp). Start lokal:

    venv/bin/python -m uvicorn server:app --port 8765

Test im Browser: http://localhost:8765/docs (dort ein Foto hochladen).
Fotos werden nur im Arbeitsspeicher verarbeitet und nicht gespeichert.
"""
import io

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from erkenner import Erkenner

GRUPPEN = {'saeuger', 'voegel', 'pflanzen', 'pilze'}
MAX_BYTES = 15 * 1024 * 1024

app = FastAPI(title='Wildfund Erkennung (Prototyp)')
erkenner = Erkenner()


@app.get('/gesund')
def gesund():
    return {'ok': True, 'arten': len(erkenner.arten), 'geraet': erkenner.geraet}


@app.post('/erkennen')
async def erkennen(foto: UploadFile = File(...), gruppe: str | None = Form(None)):
    if gruppe and gruppe not in GRUPPEN:
        raise HTTPException(400, f'Unbekannte Gruppe. Erlaubt: {", ".join(sorted(GRUPPEN))}')
    daten = await foto.read()
    if len(daten) > MAX_BYTES:
        raise HTTPException(413, 'Foto ist zu groß (höchstens 15 MB).')
    try:
        bild = Image.open(io.BytesIO(daten))
    except UnidentifiedImageError:
        raise HTTPException(400, 'Das ist kein Bild, das wir lesen können (JPEG oder PNG).')
    return erkenner.erkennen(bild, gruppe=gruppe)
