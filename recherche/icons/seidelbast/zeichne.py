"""Echter Seidelbast: rosa-purpurne, vierzipflige Blüten direkt am kahlen Zweig, oben ein Schopf junger Blätter."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

BLUETE = ('#CC68A2', '#8E3A6E', '#EEB2D4')
ZWEIG = ('#8C7B66', '#5C4E3E', '#B8A890')
BLATT = ('#6E9A40', '#476A26', '#9CC468')
LANZETT = [(0, 0), (0.08, -0.12), (0.13, -0.36), (0.12, -0.62), (0.07, -0.84), (0.02, -0.96), (0, -1)]


def blume(cx, cy, r, rot):
    t = []
    zipfel = [(0, 0), (0.36, -0.3), (0.42, -0.68), (0.06, -1), (-0.42, -0.7), (-0.36, -0.3)]
    for i in range(4):
        g = rot + 45 + i * 90
        p = setzen(zipfel, cx, cy, r, g)
        t.append(form(glatter_pfad(p), BLUETE[0]))
        # Zipfel, die nach unten rechts zeigen, liegen im Schatten
        if 45 <= (g % 360) <= 225:
            t.append(E(glatter_pfad(p), BLUETE[1], o=0.45, rolle='schatten'))
        else:
            t.append(E(glatter_pfad(setzen([(0, -0.25), (-0.3, -0.45), (-0.24, -0.78), (0, -0.82)], cx, cy, r, g)), BLUETE[2], o=0.7, rolle='licht'))
        m = setzen([(0, -0.25), (0, -0.82)], cx, cy, r, g)
        t.append(linie(m, BLUETE[1], 0.5, 0.6))
    t.append(E(kreis(cx, cy, r * 0.22), '#F0C2DC', o=0.8, rolle='detail'))
    t.append(E(kreis(cx, cy, r * 0.13), '#5A1C40', rolle='detail'))
    return t


ebenen = hg_licht()
# zweiter, dünner Trieb hinten rechts
ebenen += zweig([(74, 106), (78, 84), (84, 64), (88, 50)], 3.0, 1.6, ZWEIG)
# Haupttrieb, leicht gebogen
haupt = [(50, 106), (54, 86), (58, 62), (60, 44), (61, 30)]
ebenen += zweig(haupt, 4.4, 2.6, ZWEIG)
# Blattnarben / Knospenschuppen am kahlen Zweig
ebenen.append(E(' '.join(oval(x, y, 0.9, 0.6) for x, y in ((53, 94), (56, 76), (59, 54), (80, 76), (86, 58))), '#4A3E32', o=0.8, rolle='detail'))
# Blattschopf am Triebende (junge, lanzettliche, ganzrandige Blätter)
for g, L, ss in ((-42, 20, -1), (38, 19, 1), (-14, 22, -1), (12, 21, 1)):
    ebenen += blatt(LANZETT, 61, 33, L, g, BLATT, adern=0, schatten_seite=ss, glatt=True)
for g, L, ss in ((-24, 12, -1), (24, 11, 1)):
    ebenen += blatt(LANZETT, 88, 52, L, g, BLATT, adern=0, schatten_seite=ss, glatt=True)
# Blütenbüschel direkt am Zweig (sitzend), unten zuerst gezeichnet = hinten
bueschel = [
    # Haupttrieb
    (53, 95, 7.2, 10), (45, 86, 6.8, -10), (61, 84, 7.4, 30),
    (51, 74, 7.4, 0), (62, 70, 7.6, 20),
    (54, 60, 7.4, -20), (65, 55, 7.0, 15), (56, 46, 6.4, 30), (66, 42, 5.6, 0),
    # Nebentrieb
    (84, 80, 6.4, 10), (74, 72, 6.0, -15), (88, 64, 6.0, 30),
]
for cx, cy, r, rot in sorted(bueschel, key=lambda b: -b[1]):
    ebenen += blume(cx, cy, r, rot)

speichern('seidelbast', ebenen, quellen=[
    {'titel': 'Referenzfoto Daphne mezereum 090308.jpg (CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Daphne_mezereum_090308.jpg'},
    {'titel': 'Referenzfoto Daphne mezereum Gewoehnlicher Seidelbast2.jpg (CC BY-SA 2.5)', 'url': 'https://commons.wikimedia.org/wiki/File:Daphne_mezereum_Gewoehnlicher_Seidelbast2.jpg'},
])
