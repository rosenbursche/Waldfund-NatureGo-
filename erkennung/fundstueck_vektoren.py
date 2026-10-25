"""Text-Fingerabdrücke für Fundstücke: Trittsiegel, Losung, Fraßspuren, Federn, Blätter, Rinde, Knospen, Früchte.

Hintergrund: Die Art-Vektoren in daten/artvektoren.npz beschreiben das ganze Lebewesen („an image of <Systematik>
with common name …“). Ein Foto von Losung oder Rinde passt dazu nur schlecht. Hier entstehen deshalb zusätzliche
Vektoren je Art UND Fundstück-Typ, z. B. „a photo of the droppings of Vulpes vulpes (red fox)“. Mehrere Formulierungen
werden gemittelt, mit demselben BioCLIP-2-Textkodierer wie in artvektoren.py.

Außerdem: Typ-Erkennung („Was ist das?“ – Trittsiegel, Losung, Feder, Blatt, Rinde …) über allgemeine Text-Prompts.

Test und Zahlen: recherche/erkennung/fundstuecke-test.md (25.10.2026). Benutzt wird es von fundstuecke_testen.py.
Die eigentliche Erkennung (erkenner.py) bleibt unverändert; dieses Modul nutzt nur ihr Modell.
"""
import json
from pathlib import Path

import numpy as np
import open_clip as oc
import torch
import torch.nn.functional as F

HIER = Path(__file__).resolve().parent
FUNDSTUECKE = HIER.parent / 'src' / 'data' / 'fundstuecke.json'

# Typ-Erkennung: je Typ mehrere englische Beschreibungen (der Textkodierer ist auf Englisch trainiert).
# 'tier' und 'pflanze' sind das ganze Lebewesen; 'bluete' ist eine Ablenk-Klasse.
TYP_TEXTE = {
    'trittsiegel': ['a photo of animal footprints in mud', 'a photo of animal tracks in the snow',
                    'a paw print of a wild animal on the ground', 'a hoof print in soft soil'],
    'losung': ['a photo of animal droppings on the ground', 'a photo of scat of a wild animal',
               'a pile of animal feces', 'dung pellets of a deer'],
    'frass': ['feeding signs of an animal: gnawed wood, chewed cones or pecked tree bark',
              'a tree trunk gnawed by a beaver', 'a pine cone chewed by a squirrel',
              'holes pecked into a tree by a woodpecker', 'ground rooted up by wild boar'],
    'feder': ['a photo of a single bird feather', 'a feather lying on the ground', 'a wing feather of a bird'],
    'blatt': ['a photo of a tree leaf', 'leaves on a branch of a tree', 'needles on a conifer twig'],
    'rinde': ['a photo of tree bark', 'close-up of the bark on a tree trunk', 'the trunk of a tree'],
    'knospe': ['a photo of a bud on a twig', 'winter buds on a bare tree branch', 'a bud opening in spring'],
    'frucht': ['a photo of tree fruits or seeds', 'acorns or nuts of a tree', 'a cone of a conifer',
               'winged seeds of a maple or ash tree'],
    'bluete': ['a photo of a flower', 'catkins and flowers of a tree'],
    'tier': ['a photo of a wild mammal', 'a photo of a bird', 'a wild animal in nature'],
    'pflanze': ['a photo of a whole tree', 'a photo of a wild plant', 'a forest with trees'],
}

# Fundstück-Typen der App → Prüf-Typ. 'spur' zählt nur als Trittsiegel, wenn es eine Fußspur ist
# (Trittsiegel, Hasen- oder Sprungspur), nicht Suhle, Myzel oder gewendetes Laub.
SPUR_ALS_TRITTSIEGEL = {'trittsiegel', 'spur'}
APP_TYP = {'faehrte': 'trittsiegel', 'losung': 'losung', 'frass': 'frass', 'feder': 'feder', 'blatt': 'blatt',
           'rinde': 'rinde', 'knospe': 'knospe', 'frucht': 'frucht', 'samen': 'frucht'}

NADELBAEUME = {'Pinus', 'Picea', 'Abies', 'Larix', 'Pseudotsuga', 'Taxus'}

# Fraßspuren sind je Art ganz verschieden. Darum eigene Beschreibungen ({n} = Name).
FRASS_TEXTE = {
    'Castor fiber': ['a tree trunk gnawed into an hourglass shape by {n}', 'wood chips and a felled tree gnawed by {n}'],
    'Sciurus vulgaris': ['a spruce or pine cone stripped and chewed by {n}', 'a hazelnut split open by {n}'],
    'Dendrocopos major': ['a woodpecker anvil: a cone wedged in bark, used by {n}', 'pile of pecked cones under a tree, left by {n}'],
    'Dryocopus martius': ['large rectangular feeding holes pecked into a tree trunk by {n}', 'wood chips below holes made by {n}'],
    'Sus scrofa': ['ground and meadow rooted up by {n}', 'soil turned over by foraging {n}'],
    'Capreolus capreolus': ['young tree shoots browsed by {n}'],
    'Lepus europaeus': ['twigs and bark browsed by {n}'],
    'Meles meles': ['small pits dug in the ground by {n}'],
    'Corylus avellana': ['a hazelnut opened by a rodent'],
}


def typ_texte_art(typ, wiss, en):
    """Formulierungen für ein Fundstück einer Art. en = englischer Name (oder None)."""
    n = f'{wiss} ({en})' if en else wiss
    gattung = wiss.split()[0]
    if typ == 'trittsiegel':
        return [f'a photo of the footprint of {n}', f'tracks of {n} in mud', f'tracks of {n} in snow',
                f'a paw print or hoof print of {n}']
    if typ == 'losung':
        return [f'a photo of the droppings of {n}', f'scat of {n} on the ground', f'feces of {n}']
    if typ == 'feder':
        return [f'a feather of {n}', f'a single feather of {n} lying on the ground', f'a wing feather of {n}']
    if typ == 'frass':
        eigene = [t.format(n=n) for t in FRASS_TEXTE.get(wiss, [])]
        return eigene + [f'feeding signs of {n}']
    if typ == 'blatt':
        if gattung in NADELBAEUME:
            return [f'needles of {n}', f'a twig with needles of {n}', f'a photo of the foliage of {n}']
        return [f'a leaf of {n}', f'leaves of {n}', f'a photo of the leaves of {n}']
    if typ == 'rinde':
        return [f'the bark of {n}', f'close-up of the bark of {n}', f'the trunk of {n}']
    if typ == 'knospe':
        return [f'a bud of {n}', f'winter buds on a twig of {n}', f'buds of {n} opening in spring']
    if typ == 'frucht':
        if gattung in NADELBAEUME:
            return [f'a cone of {n}', f'cones of {n}', f'seeds and cones of {n}']
        return [f'the fruit of {n}', f'fruits and seeds of {n}', f'a photo of the fruits of {n}']
    raise ValueError(typ)


def kandidaten_je_typ(datei=FUNDSTUECKE):
    """Welche App-Arten haben welchen Prüf-Typ? → {typ: [app-art-id, …]} aus src/data/fundstuecke.json."""
    aus = {}
    for art in json.load(open(datei)):
        for f in art['fundstuecke']:
            typ = APP_TYP.get(f['typ'])
            if f['typ'] == 'spur' and f['id'] in SPUR_ALS_TRITTSIEGEL:
                typ = 'trittsiegel'
            if typ:
                aus.setdefault(typ, [])
                if art['artId'] not in aus[typ]:
                    aus[typ].append(art['artId'])
    return aus


class FundstueckVektoren:
    """Rechnet Text-Vektoren mit dem Modell eines vorhandenen Erkenners (kein zweites Modell im Speicher)."""

    def __init__(self, modell, geraet, logit_skala):
        self.modell, self.geraet, self.skala = modell, geraet, logit_skala
        self.tok = oc.get_tokenizer('hf-hub:imageomics/bioclip-2')
        self._typen = None

    def text_vektor(self, texte):
        """Mittel mehrerer Formulierungen, wieder auf Länge 1 gebracht."""
        with torch.no_grad():
            v = F.normalize(self.modell.encode_text(self.tok(texte).to(self.geraet)).float(), dim=-1)
        return F.normalize(v.mean(0), dim=-1)

    def typ_vektoren(self):
        if self._typen is None:
            namen = list(TYP_TEXTE)
            self._typen = (namen, torch.stack([self.text_vektor(TYP_TEXTE[t]) for t in namen]))
        return self._typen

    def typ_erkennen(self, fingerabdruck):
        """→ Liste (typ, Wahrscheinlichkeit), beste zuerst."""
        namen, v = self.typ_vektoren()
        p = F.softmax(self.skala * (v @ fingerabdruck), dim=0).cpu().numpy()
        return sorted(zip(namen, p.tolist()), key=lambda x: -x[1])

    def art_vektoren(self, typ, arten):
        """arten: Liste von (wiss, en) → Matrix (n, 768)."""
        return torch.stack([self.text_vektor(typ_texte_art(typ, w, e)) for w, e in arten])

    def vergleichen(self, fingerabdruck, vektoren):
        """Wahrscheinlichkeit je Kandidat (ohne Vorwissen, ohne Gegenklassen)."""
        return F.softmax(self.skala * (vektoren @ fingerabdruck), dim=0).cpu().numpy()
