"""Spitzahorn (Acer platanoides): 5(–7) Lappen mit wenigen großen Zähnen, die in LANGE, FEINE Spitzen
ausgezogen sind; Buchten RUND und flacher; Flügelfrüchte fast WAAGERECHT gespreizt, Nüsschen flach."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/rotbuche')
from icon_helfer import *  # noqa
from baum_helfer import *  # noqa

GRUEN = ('#4C8432', '#2A501C', '#7EB252')
ADER = '#C2D88E'
LAPPEN = [(-118, 20), (-58, 31), (0, 35), (58, 31), (118, 20)]
BUCHTEN = [(1.5, 'k'), (14, 'c'), (16, 'c'), (16, 'c'), (14, 'c')]


def kante_fn(i, A, B, zur_spitze):
    L = LAPPEN[i][1]
    z = [(0.42, 5.2, 0.14, 'lang')] if L > 25 else [(0.45, 3.6, 0.14, 'lang')]
    if not zur_spitze:
        z = [(1 - u, h, b, k) for u, h, b, k in z]
    return kante(A, B, 0.1, z, spitze_bei_B=zur_spitze, breiteste=0.5)


def spitze_fn(i, w, L):
    # Lappenspitze lang und fein ausgezogen: Schultern, dann schmale Spitze
    a = pol(w - 7, L - 5)
    t = pol(w, L + 4)
    b = pol(w + 7, L - 5)
    return [(a[0], a[1], 'c'), (t[0], t[1], 'k'), (b[0], b[1], 'c')]


pts, bidx, spitzen = ahorn_umriss(LAPPEN, BUCHTEN, kante_fn, spitze_fn)
S, GRAD, X, Y = 0.95, 8, 58, 62
T = lambda p: tf(p, S, GRAD, X, Y)

ebenen = hg_wald()
# Flügelfrüchte: fast waagerecht gespreizt, hinter dem Blatt unten
FR = ('#C2B47A', '#857A48', '#E0D8A6')
FX, FY = 62, 84
ebenen.append(form(band([(FX + 6, FY - 16), (FX + 2, FY - 8), (FX, FY - 1)], 1.6, 1.4), '#7E8A44'))
ebenen += fluegelfrucht(FX - 1.4, FY, 180 + 78, 1.08, FR, nuss_r=3.0, nuss_farbe='#A99C62')
ebenen += fluegelfrucht(FX + 1.4, FY, 180 - 78, 1.08, FR, nuss_r=3.0, spiegeln=True, nuss_farbe='#A99C62')
# langer Blattstiel
ebenen.append(form(band(T([(0, 1), (-1, 14), (-4, 30)]), 2.0, 2.3), '#8A9A48'))
ebenen += ahorn_ebenen(pts, bidx, LAPPEN, S, GRAD, X, Y, GRUEN, ADER, schatten_o=0.45, licht_o=0.4)

speichern('spitzahorn', ebenen, quellen=[
    {'titel': 'Referenz: Acer platanoides watercolor (Lisa Nicvert, CC BY-SA 4.0)',
     'url': 'https://commons.wikimedia.org/wiki/File:Acer_platanoides_watercolor.png'},
    {'titel': 'Referenzfoto: Acer platanoides in La Jaysinia (1) (Früchte)',
     'url': 'https://commons.wikimedia.org/wiki/File:Acer_platanoides_in_La_Jaysinia_(1).jpg'},
])
print('spitzahorn geschrieben')
