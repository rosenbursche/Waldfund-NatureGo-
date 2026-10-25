"""Lernt den Typ-Klassifikator (typ_erkennung.py) aus Fotos mit bekanntem Typ.

    venv/bin/python typ_lernen.py <bilder.json> [<bilder2.json> …]

bilder.json: Liste von {"datei", "typ"} mit typ aus typ_erkennung.TYPEN ("ganz" = ganzes Lebewesen).
Fotos mit "quelle": "iNaturalist" werden nicht gelernt (Projektregel: keine iNaturalist-Bilder fürs Training),
Einträge mit "nur_typ": true werden übersprungen (doppelt mit dem ersten Test).
Ergebnis: typ_klassifikator.npz (rund 30 KB).
"""
import json
import sys

import numpy as np
import torch
from PIL import Image

from erkenner import Erkenner
from typ_erkennung import DATEI, TYPEN, lernen


def main(dateien):
    bilder = []
    for d in dateien:
        for b in json.load(open(d)):
            if b.get('quelle') == 'iNaturalist' or b.get('nur_typ'):
                continue
            bilder.append({'datei': b['datei'], 'typ': b.get('typ', 'ganz')})
    e = Erkenner()
    X = torch.stack([e.fingerabdruck(Image.open(b['datei'])).cpu() for b in bilder])
    y = torch.tensor([TYPEN.index(b['typ']) for b in bilder])
    W, c = lernen(X, y)
    np.savez(DATEI, W=W.numpy(), c=c.numpy(), typen=np.array(TYPEN))
    print(f'{len(bilder)} Fotos gelernt:', {t: int((y == i).sum()) for i, t in enumerate(TYPEN)}, '→', DATEI.name)


if __name__ == '__main__':
    main(sys.argv[1:])
