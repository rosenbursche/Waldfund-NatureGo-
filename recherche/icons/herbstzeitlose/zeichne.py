"""Herbstzeitlose: blassviolette, krokusartige Blüten ohne Blätter auf langer weißer Röhre, Herbstwiese."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

HUELLE = ('#D0A0D0', '#9C6CA6', '#ECD4EC')
ROEHRE = ('#EEE6EC', '#C8B6C8', '#FFFFFF')
STAUB = '#E4A23A'
GRAS = '#6F8A44'
# Blütenhüllblatt: länglich-elliptisch, stumpf zugespitzt
TEPAL = [(0, 0), (0.12, -0.14), (0.2, -0.42), (0.2, -0.7), (0.14, -0.88), (0.06, -0.98), (0, -1)]


def tepal(cx, cy, L, grad, sseite=1, hell=False):
    t = blatt(TEPAL, cx, cy, L, grad, HUELLE, adern=0, schatten_seite=sseite, glatt=True, ader_farbe=HUELLE[1])
    # feine Längsnerven statt Fiederadern
    d = ''
    for x in (-0.08, 0.08):
        p = setzen([(x * 0.5, -0.12), (x * 1.2, -0.5), (x * 0.6, -0.86)], cx, cy, L, grad)
        d += f'M{p[0][0]} {p[0][1]} Q{p[1][0]} {p[1][1]} {p[2][0]} {p[2][1]} '
    t.append(E(d.strip(), s=HUELLE[1], sw=0.5, o=0.6, rolle='detail'))
    return t


def roehre(x0, y0, x1, y1, b0, b1):
    return zweig([(x0, y0), ((x0 + x1) / 2 + 1, (y0 + y1) / 2), (x1, y1)], b0, b1, ROEHRE)


ebenen = hg_licht()
# Herbstwiese: Boden und Grasbüschel im Hintergrund
ebenen.append(E('M19 84 Q40 78 60 82 T101 80 L101 102 L19 102 Z', '#33482A', rolle='detail'))
ebenen.append(E('M24 90 l2 -14 M30 92 l-1 -12 M40 88 l3 -11 M70 90 l-2 -13 M88 88 l2 -12 M94 92 l-3 -10 M50 94 l1 -10',
                s='#5E7A3C', sw=1.0, o=0.8, rolle='detail'))

# Blüte 2 (hinten rechts, halb geschlossen) auf langer Röhre
ebenen += roehre(80, 104, 82, 64, 3.2, 2.6)
for g, L, ss in ((-14, 22, -1), (14, 22, 1), (0, 23, 1)):
    ebenen += tepal(82, 66, L, g, ss)

# Blüte 3 (klein, links, Knospe)
ebenen += roehre(36, 104, 34, 74, 2.8, 2.4)
for g, L, ss in ((-8, 16, -1), (8, 16, 1)):
    ebenen += tepal(34, 76, L, g, ss)

# Blüte 1 (groß, offen)
cx, cy = 58, 60
ebenen += roehre(60, 106, cx, cy + 2, 4.2, 3.4)
for g, L, ss in ((-34, 28, -1), (34, 28, 1), (0, 30, 1)):   # hintere Hüllblätter
    ebenen += tepal(cx, cy, L, g, ss)
# Schlund: Staubblätter (6) mit orangegelben Beuteln und 3 weiße Griffel
ebenen.append(E(oval(cx, cy - 9, 7, 6), '#F1E4F2', o=0.8, rolle='detail'))
gr = ''
for dx in (-1.6, 0, 1.6):
    gr += f'M{cx} {cy - 2} Q{cx + dx} {cy - 10} {cx + dx * 1.6} {cy - 19} '
ebenen.append(E(gr.strip(), s='#FAF6F2', sw=0.8, rolle='detail'))
for i, dx in enumerate((-8, -5, -1.8, 1.8, 5, 8)):
    hy = cy - 15 - (3 - abs(dx) * 0.3)
    ebenen.append(linie([(cx + dx * 0.3, cy - 3), (cx + dx, hy + 2)], '#F2E6B8', 0.7))
    ebenen.append(E(oval(r1(cx + dx), r1(hy), 1.0, 2.2), STAUB, s='#8A5A1A', sw=0.4, rolle='detail'))
for g, L, ss in ((-52, 24, -1), (52, 24, 1), (-10, 13, -1), (10, 13, 1)):  # vordere Hüllblätter
    ebenen += tepal(cx, cy + 1, L, g, ss)

# Grashalme im Vordergrund
ebenen.append(E('M44 102 q1 -10 4 -18 M52 103 q-1 -8 -4 -14 M70 103 q0 -9 3 -16 M28 100 q2 -6 6 -10 M90 100 q-1 -8 -4 -12',
                s=GRAS, sw=1.2, o=0.9, rolle='detail'))

speichern('herbstzeitlose', ebenen, quellen=[
    {'titel': 'Referenzfoto Colchicum autumnale 01.JPG (CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Colchicum_autumnale_01.JPG'},
    {'titel': 'Referenzfoto Colchicum autumnale2.jpg (CC BY-SA 4.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Colchicum_autumnale2.jpg'},
    {'titel': 'Referenzfoto 2 Colchicum Autumnale.jpg (CC BY-SA 4.0)', 'url': 'https://commons.wikimedia.org/wiki/File:2_Colchicum_Autumnale.jpg'},
])
