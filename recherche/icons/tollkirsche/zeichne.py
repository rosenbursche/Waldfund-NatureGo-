"""Tollkirsche: glänzend schwarze Beere auf sternförmigem Kelch, braunviolette Glockenblüte, ganzrandige Blätter."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

BLATT = ('#4E7A32', '#30501E', '#7EA45C')
KELCH = ('#6E9446', '#44622A', '#9CBC6E')
BEERE = ('#1E1A22', '#0A080C', '#4A4452')
GLOCKE = ('#6E3A4C', '#45222F', '#9A6474')
STIEL = ('#5E7E3E', '#3A5426', '#88A866')
# Blatt eiförmig, zugespitzt, ganzrandig
EI = [(0, 0), (0.12, -0.05), (0.24, -0.18), (0.3, -0.36), (0.29, -0.55), (0.22, -0.72), (0.12, -0.86), (0.04, -0.95), (0, -1)]


def kelch_stern(cx, cy, r, grad0):
    t = []
    for i in range(5):
        g = grad0 + i * 72
        pts = [(0, -0.2), (0.32, -0.5), (0.28, -0.85), (0, -1.15), (-0.26, -0.85), (-0.3, -0.5)]
        p = setzen(pts, cx, cy, r * 1.9, g)
        t.append(form(glatter_pfad(p), KELCH[0]))
        t.append(E(glatter_pfad(setzen([(0, -0.25), (0.3, -0.5), (0.26, -0.85), (0, -1.12)], cx, cy, r * 1.9, g)), KELCH[1], o=0.5, rolle='schatten'))
        m = setzen([(0, -0.5), (0, -1.05)], cx, cy, r * 1.9, g)
        t.append(linie(m, KELCH[2], 0.7, 0.8))
    return t


def glocke(cx, cy, L, grad):
    """hängende, röhrig-glockige Blüte; (cx, cy) = Ansatz oben, grad = Richtung der Öffnung (180 = nach unten)."""
    halb = [(0, 0), (0.22, -0.06), (0.3, -0.3), (0.31, -0.6), (0.36, -0.82), (0.46, -0.94), (0.4, -1.0), (0.26, -0.97), (0.14, -1.02), (0, -0.98)]
    umr = halb + [(-x, y) for x, y in reversed(halb)][1:-1]
    t = [form(glatter_pfad(setzen(umr, cx, cy, L, grad)), GLOCKE[0])]
    t.append(E(glatter_pfad(setzen(halb, cx, cy, L, grad)), GLOCKE[1], o=0.6, rolle='schatten'))
    t.append(E(glatter_pfad(setzen([(-0.06, -0.12), (-0.22, -0.3), (-0.24, -0.66), (-0.1, -0.7), (-0.08, -0.35)], cx, cy, L, grad)), GLOCKE[2], o=0.6, rolle='licht'))
    # gelbgrüner Schlund am Saum
    t.append(E(glatter_pfad(setzen([(-0.3, -0.92), (0, -0.88), (0.3, -0.92), (0.14, -0.99), (0, -0.96), (-0.14, -0.99)], cx, cy, L, grad)), '#B6B860', o=0.85, rolle='detail'))
    # Längsadern
    for x in (-0.16, 0, 0.16):
        p = setzen([(x * 0.6, -0.12), (x * 1.05, -0.55), (x * 1.6, -0.9)], cx, cy, L, grad)
        t.append(kurve(*p, GLOCKE[1], 0.6, 0.8))
    # Kelch oben (fünf grüne Zipfel)
    for w in (-28, 0, 28):
        p = setzen([(0, 0.06), (0.1, -0.12), (0, -0.36), (-0.1, -0.12)], cx, cy, L, grad + w * 0.6)
        p = [(r1(x + (cx - x) * 0), y) for x, y in p]
        t.append(form(glatter_pfad(p), KELCH[0]))
    return t


ebenen = hg_licht()
# Blätter (ganzrandig, ungleich groß) hinter allem
ebenen += zweig([(58, 106), (58, 92), (60, 80)], 3.2, 2.6, STIEL)
ebenen += blatt(EI, 59, 88, 44, 56, BLATT, adern=6, schatten_seite=1, glatt=True, ader_neigung=0.16)
ebenen += blatt(EI, 58, 92, 34, -62, BLATT, adern=5, schatten_seite=-1, glatt=True, ader_neigung=0.16)
# Blütenstiel und hängende Glocke oben links
ebenen += zweig([(60, 80), (52, 58), (46, 38), (42, 26)], 2.2, 1.6, STIEL, licht=False)
ebenen += zweig([(45, 31), (39, 25), (37, 29)], 1.6, 1.3, STIEL, licht=False)
ebenen += glocke(37, 29, 28, 172)
# Beere mit Sternkelch
ebenen += zweig([(60, 80), (64, 72), (68, 64)], 2.2, 2.0, STIEL, licht=False)
ebenen += kelch_stern(68, 62, 11, 18)
ebenen += beere(68, 62, 12.5, BEERE, glanz=0.95)
ebenen.append(E(oval(61.6, 55.6, 2.6, 1.6), '#FFFFFF', o=0.85, rolle='detail'))
ebenen.append(E(oval(75, 69, 2.6, 1.2), '#5A5466', o=0.6, rolle='detail'))

speichern('tollkirsche', ebenen, quellen=[
    {'titel': 'Referenzfoto Atropa belladonna 003.JPG (H. Zell, CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Atropa_belladonna_003.JPG'},
    {'titel': 'Referenzfoto Atropa belladonna 220605.jpg (CC BY-SA 2.5)', 'url': 'https://commons.wikimedia.org/wiki/File:Atropa_belladonna_220605.jpg'},
    {'titel': 'Referenzfoto Atropa belladonna Danny S. 007.jpg (CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Atropa_belladonna_Danny_S._007.jpg'},
])
