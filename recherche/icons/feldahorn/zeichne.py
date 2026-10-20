"""Feldahorn (Acer campestre): kleines, 3–5-lappiges Blatt mit STUMPFEN, RUNDEN, ganzrandigen Lappen
(Mittellappen oft nochmals schwach dreilappig); Flügelfrüchte WAAGERECHT (180°), oft rötlich."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/rotbuche')
from icon_helfer import *  # noqa
from baum_helfer import *  # noqa

GRUEN = ('#4A7A34', '#284A1C', '#7AA854')
ADER = '#B6CC88'
LAPPEN = [(-112, 14), (-54, 24), (0, 27), (54, 24), (112, 14)]  # kürzere Lappen = stumpfer
BUCHTEN = [(1.5, 'k'), (9.5, 'c'), (11, 'c'), (11, 'c'), (9.5, 'c')]


def kante_fn(i, A, B, zur_spitze):
    L = LAPPEN[i][1]
    # ein flacher, runder Nebenlappen an den großen Lappen
    z = [(0.66, 2.6, 0.16, 'rund')] if L > 20 else []
    if not zur_spitze:
        z = [(1 - u, h, b, k) for u, h, b, k in z]
    return kante(A, B, 0.2, z, spitze_bei_B=zur_spitze, breiteste=0.45)


def spitze_fn(i, w, L):
    # stumpfe, runde Lappenspitze
    a, t, b = pol(w - 19, L - 5.5), pol(w, L + 0.2), pol(w + 19, L - 5.5)  # breit gerundet
    return [(a[0], a[1], 'c'), (t[0], t[1], 'c'), (b[0], b[1], 'c')]


pts, bidx, spitzen = ahorn_umriss(LAPPEN, BUCHTEN, kante_fn, spitze_fn)
S, GRAD, X, Y = 1.08, -8, 58, 60
T = lambda p: tf(p, S, GRAD, X, Y)

ebenen = hg_wald()
# Flügelfrüchte: Flügel in einer Linie waagerecht (180°), rötlich überlaufen
FR = ('#C88E6A', '#8A5640', '#E6B898')
FX, FY = 66, 86
ebenen.append(form(band([(FX + 6, FY - 16), (FX + 2, FY - 8), (FX, FY - 1)], 1.6, 1.4), '#7E6A44'))
ebenen += fluegelfrucht(FX - 1.4, FY, 180 + 90, 0.98, FR, nuss_r=3.0, nuss_farbe='#A87454')
ebenen += fluegelfrucht(FX + 1.4, FY, 180 - 90, 0.98, FR, nuss_r=3.0, spiegeln=True, nuss_farbe='#A87454')
ebenen.append(form(band(T([(0, 1), (1, 12), (3, 24)]), 2.0, 2.2), '#7E7A40'))
ebenen += ahorn_ebenen(pts, bidx, LAPPEN, S, GRAD, X, Y, GRUEN, ADER, schatten_o=0.45, licht_o=0.4)

speichern('feldahorn', ebenen, quellen=[
    {'titel': 'Referenzfoto: Acer campestre leaf 01 by Line1 (Blatt und Früchte)',
     'url': 'https://commons.wikimedia.org/wiki/File:Acer_campestre_leaf_01_by_Line1.JPG'},
])
print('feldahorn geschrieben')
