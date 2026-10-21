"""Gewöhnliche Hasel: rundliches, doppelt gesägtes Blatt mit Haselnüssen im grünen Fruchtbecher."""
import sys
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

BLATT = ('#4F7E34', '#30521F', '#7FA858')
HUELLE = ('#A2BE5C', '#6C8A38', '#CADB8C')
NUSS = ('#A86A35', '#6E4220', '#D29A5E')
ZWEIG = ('#7A5A3E', '#4E3826', '#A88466')

# Blatt: rundlich, Grund herzförmig, kurz zugespitzt
HALB = [(0, 0), (0.1, 0.05), (0.3, 0.0), (0.45, -0.16), (0.5, -0.36), (0.47, -0.56), (0.38, -0.73), (0.24, -0.85),
        (0.1, -0.91), (0.03, -0.96), (0, -1)]


def nuss(cx, cy, grad, s=1.0):
    t = []
    halb = catmull([(0, 0), (3.6, -1.2), (4.8, -5), (3.8, -8.6), (1.6, -10.8), (0, -11.4)], 6)
    umriss = halb + [(-x, y) for x, y in reversed(halb)][1:-1]
    p = setzen([(x / 11.4, y / 11.4) for x, y in umriss], cx, cy, 11.4 * s, grad)
    t.append(form(glatter_pfad(p), NUSS[0]))
    rechts = setzen([(x / 11.4, y / 11.4) for x, y in halb], cx, cy, 11.4 * s, grad)
    t.append(E(glatter_pfad(rechts), NUSS[1], o=0.6, rolle='schatten'))
    hl = setzen([(-1.2 / 11.4, -5 / 11.4), (-3.2 / 11.4, -6.5 / 11.4), (-2.4 / 11.4, -9.5 / 11.4), (-0.6 / 11.4, -10.2 / 11.4), (-1 / 11.4, -7 / 11.4)],
                cx, cy, 11.4 * s, grad)
    t.append(E(glatter_pfad(hl), NUSS[2], o=0.8, rolle='licht'))
    # feine Längsstreifen und dunkle Spitze
    for x in (-1.6, 0.6, 2.4):
        a = setzen([(x / 11.4, -5 / 11.4), (x * 0.6 / 11.4, -10 / 11.4)], cx, cy, 11.4 * s, grad)
        t.append(linie(a, NUSS[1], 0.5, 0.6))
    sp = setzen([(0, -11.4 / 11.4)], cx, cy, 11.4 * s, grad)[0]
    t.append(E(kreis(sp[0], sp[1], 0.9 * s), '#3A2614', rolle='detail'))
    return t


def huelle(cx, cy, grad, s=1.0, hinten=False):
    """zerschlitzter, fransiger Fruchtbecher (umhüllt die untere Hälfte der Nuss)"""
    zaehne_oben = [(5.4, -3.0), (7.4, -6.8), (3.8, -3.8), (2.4, -6.6), (0.4, -3.4), (-1.8, -6.6), (-3.2, -3.4),
                   (-6.6, -6.2), (-5.4, -2.8)]
    pts = [(0, 1.8), (4.2, 0.6), (5.8, -2.2)] + zaehne_oben + [(-5.6, -2.0), (-3.8, 0.8)]
    p = setzen([(x / 10, y / 10) for x, y in pts], cx, cy, 10 * s, grad)
    t = [form(pfad(p), HUELLE[0])]
    sh = setzen([(x / 10, y / 10) for x, y in [(0, 1.8), (4.2, 0.6), (5.8, -2.2), (5.4, -3.0), (7.4, -6.8), (3.8, -3.8), (2.4, -3.2), (1.2, -1)]],
                cx, cy, 10 * s, grad)
    t.append(E(pfad(sh), HUELLE[1], o=0.6, rolle='schatten'))
    hl = setzen([(x / 10, y / 10) for x, y in [(-4.6, -2.0), (-5.0, -6.2), (-3.6, -4.2), (-2.6, -1.6)]], cx, cy, 10 * s, grad)
    t.append(E(pfad(hl), HUELLE[2], o=0.7, rolle='licht'))
    adern = []
    for x0, x1, y1 in ((0, 0.4, -6.4), (-2, -2.6, -6.8), (2, 3.4, -7.0), (-4, -5.6, -6.4), (4, 6.2, -6.8)):
        a = setzen([(x0 / 10, 0.8 / 10), (x1 / 10, y1 / 10)], cx, cy, 10 * s, grad)
        adern.append(linie(a, HUELLE[1], 0.5, 0.75))
    return t + adern


ebenen = hg_licht()
# Zweig von unten rechts zum Blattgrund
ebenen += zweig([(96, 104), (80, 90), (64, 80), (52, 74)], 4.2, 2.6, ZWEIG)
ebenen.append(E(kreis(82, 92, 0.7) + ' ' + kreis(72, 85, 0.6) + ' ' + kreis(88, 97, 0.6), '#C9B496', o=0.8, rolle='detail'))
# Blattstiel + großes Blatt nach oben rechts
ebenen += zweig([(60, 78), (65, 71), (69, 65)], 2.0, 1.6, BLATT, licht=False)
ebenen += blatt(HALB, 69, 65, 45, 38, BLATT, n_zaehne=17, amp=0.05, doppelt=True, adern=7, schatten_seite=1,
                ader_neigung=0.16, links_skala=0.95)
# Fruchtstand: drei Nüsse in Hüllen, vorn links
ebenen += zweig([(58, 79), (50, 82), (44, 84)], 1.8, 1.4, HUELLE, licht=False)
for cx, cy, g, s in ((31, 76, -42, 1.5), (53, 94, 8, 1.6), (45, 66, -12, 1.55)):
    ebenen += nuss(cx, cy, g, s)
    ebenen += huelle(cx, cy + 1, g, s)

speichern('hasel', ebenen, quellen=[
    {'titel': 'Referenzfoto Corylus avellana 0005.JPG (H. Zell, CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Corylus_avellana_0005.JPG'},
    {'titel': 'Referenzfoto Corylus avellana 0009.jpg (H. Zell, CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Corylus_avellana_0009.jpg'},
])
