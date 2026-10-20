"""Silberweide (Salix alba): schmal-lanzettliche, fein gesägte Blätter, eins zeigt die silbrig behaarte Unterseite; schlankes Kätzchen."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

OBEN = ('#6F8A55', '#4A6038', '#9AAF7E')      # oberseits grau-grün
UNTEN = ('#B8C1B6', '#87918A', '#E4E9E2')     # unterseits silbrig-seidig
ADER_O = '#B9C79A'
ADER_U = '#F2F4EE'
ZWEIG = ('#B98A3E', '#7E5A24', '#DDB46A')     # gelblich-orange Rute
KAETZ = ('#D9C66A', '#A08E3A', '#F0E3A0')

# schmal lanzettlich: breiteste Stelle unter der Mitte, lang zugespitzt
LANZ = [(0, 0), (0.05, -0.06), (0.085, -0.22), (0.095, -0.42), (0.08, -0.62), (0.05, -0.8), (0.02, -0.93), (0, -1)]

ebenen = hg_licht()
zw = [(104, 96), (90, 84), (76, 70), (60, 55), (46, 41)]
ebenen += zweig(zw, 3.4, 2.0, ZWEIG)


def kaetzchen(x0, y0, L, grad):
    T = lambda p: setzen(p, x0, y0, L, grad)
    rechts = [(0, 0), (0.1, 0.02), (0.14, 0.15), (0.15, 0.5), (0.13, 0.8), (0.08, 0.97), (0, 1.0)]
    q = catmull(rechts, 6)
    fr = zaehne(q, 12, 0.03, vorn=0.5)
    umr = fr + [(-x, y) for x, y in reversed(fr)][1:-1]
    e = [form(glatter_pfad(T(umr)), KAETZ[0])]
    e.append(E(glatter_pfad(T([(0, 0.05)] + [p for p in fr if p[1] > 0.05] + [(0, 1)])), KAETZ[1], o=0.5, rolle='schatten'))
    e.append(E(glatter_pfad(T([(-0.04, 0.12), (-0.11, 0.35), (-0.09, 0.75), (-0.03, 0.5)])), KAETZ[2], o=0.7, rolle='licht'))
    pts = []
    for i in range(10):
        y = 0.1 + i * 0.085
        x = (-0.07 if i % 2 else 0.06)
        pts.append(T([(x, y)])[0])
    e += [E(kreis(px, py, 0.7), '#F3DC6A', o=0.9, rolle='detail') for px, py in pts]
    return e


# Blätter (hinten nach vorn); fein gesägt = viele kleine Zähne
blaetter = [
    ((92, 85), 38, -82, OBEN, ADER_O, -1),
    ((84, 77), 40, -6, UNTEN, ADER_U, 1),
    ((76, 70), 38, -86, UNTEN, ADER_U, -1),
    ((67, 61), 38, -10, OBEN, ADER_O, 1),
    ((59, 54), 34, -84, OBEN, ADER_O, -1),
    ((52, 47), 30, -18, UNTEN, ADER_U, 1),
]
for (x, y), L, g, f, a, sg in blaetter:
    ebenen += blatt(LANZ, x, y, L, g, f, n_zaehne=18, amp=0.006, adern=0, schatten_seite=sg,
                    ader_neigung=0.1, ader_farbe=a, zahn_vorn=0.7)
    if f is UNTEN:
        # seidiger Glanz der anliegenden Haare
        p = setzen([(-0.02, -0.15), (-0.04, -0.5), (-0.01, -0.82)], x, y, L, g)
        ebenen.append(E(f'M{p[0][0]} {p[0][1]} Q{p[1][0]} {p[1][1]} {p[2][0]} {p[2][1]}', s='#FFFFFF', sw=0.9, o=0.55, rolle='detail'))

ebenen += kaetzchen(45, 40, 22, 133)

speichern('silberweide', ebenen, quellen=[
    {'titel': 'Referenzfoto: Salix alba leaves.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Salix_alba_leaves.jpg'},
    {'titel': 'Referenzfoto: Salix alba 022.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Salix_alba_022.jpg'},
])
print('silberweide geschrieben')
