"""Hainbuche (Carpinus betulus): eiförmiges, zugespitztes, DOPPELT gesägtes Blatt, entlang der vielen
parallelen Seitenadern gefaltet; Nüsschen am dreilappigen Flügel (Hochblatt) in hängendem Fruchtstand."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/rotbuche')
from icon_helfer import *  # noqa
from baum_helfer import *  # noqa

GRUEN = ('#3F7030', '#22441A', '#6E9C4C')
ADER = '#A9C47C'
L, W = 58, 15.5
N = 12
TV = [0.08 + 0.071 * j for j in range(N)]


def breite(t):
    return W * (t ** 0.6) * ((1 - t) ** 1.0) / 0.347


def rand(sx=1.0, dy=0.0):
    """Doppelt gesägt: großer Zahn am Aderende, ein kleiner dazwischen."""
    pts = [(breite(0.02) * sx, -L * 0.02 + dy, 'c')]
    for j, t in enumerate(TV):
        tz = t - 0.036  # kleiner Zahn
        for tc, h in ((tz, 0.8), (t, 1.7)):
            if tc <= 0.04:
                continue
            pts.append((breite(tc - 0.03) * sx, -L * (tc - 0.03) + dy, 'k'))
            pts.append((breite(tc) * sx + h, -L * tc - h * 0.9 + dy, 'k'))
    for tc in (0.93, 0.965):
        pts.append((breite(tc - 0.02) * sx, -L * (tc - 0.02) + dy, 'k'))
        pts.append((breite(tc) * sx + 0.6, -L * tc - 0.6 + dy, 'k'))
    return pts


rr = rand()
ll = rand(sx=0.95, dy=0.8)
umriss = [(0, 1.2, 'c')] + rr + [(0, -L - 2.5, 'k')] + [(-x, y, k) for x, y, k in reversed(ll)]

S, GRAD, BX, BY = 0.95, -34, 66, 79
T = lambda p: tf(p, S, GRAD, BX, BY)
basis, spitze = T([(0, 0)])[0], T([(0, -L)])[0]

ebenen = hg_wald()
# Fruchtstand: kurzer Stiel oben rechts, zwei hängende Flügel mit Nüsschen
ebenen.append(form(band([(74, 84), (80, 72), (84, 60), (86, 50)], 2.2, 1.6), '#7A6A3E'))
ebenen.append(form(band(T([(0, 6), (0, -1)]), 2.0, 1.6), '#6E7A3A'))
blatt, poly = blatt_ebenen(T(umriss), basis, spitze, GRUEN, licht_o=0.4, schatten_o=0.5)
ebenen += blatt
# Faltung: zwischen je zwei Seitenadern eine dunkle Falte (Licht oben links)
falten = []
for sx, test_dx in ((1, 1), (-1, -1)):
    for j in range(N - 1):
        t0, t1 = TV[j], TV[j + 1]
        a0, b0 = T([(0, -L * (t0 - 0.1)), (sx * breite(t0) * 1.3, -L * t0 - 3)])
        a1, b1 = T([(0, -L * (t1 - 0.1)), (sx * breite(t1) * 1.3, -L * t1 - 3)])
        tm = (t0 + t1) / 2
        am, bm = T([(0, -L * (tm - 0.1)), (sx * breite(tm) * 1.3, -L * tm - 3)])
        innen = T([(sx * breite(tm) * 0.5, -L * (tm - 0.02))])[0]
        mitte = T([(sx * 30, 0)])[0]
        st = clip_punkt(poly, am, bm, T([(sx * breite(t1) * 0.5, -L * (t1 - 0.03))])[0])
        st = clip_punkt(st, a1, b1, innen)
        st = clip_punkt(st, basis, spitze, mitte)
        if len(st) > 2:
            falten.append(poly_d(st))
ebenen.append(E(' '.join(falten), '#1E3A16', o=0.35, rolle='schatten'))
# Adern
ebenen.append(linie(T([(0, 0.5), (0.4, -30), (0, -L + 1)]), ADER, 1.0, 0.85))
for t in TV:
    for sx in (1, -0.95):
        ebenen.append(linie(T([(0, -L * (t - 0.1)), (sx * breite(t) * 0.5, -L * (t - 0.05)), (sx * breite(t) * 0.97, -L * t - 0.4)]), ADER, 0.6, 0.75))

# Fruchtflügel: dreilappig, Mittellappen lang, Nüsschen am Grund
FL = [(0, 0, 'k'), (3.0, 1.2, 'c'), (8.6, 2.4, 'k'), (3.8, 6.8, 'k'), (3.8, 11, 'c'), (4.2, 13.5, 'k'), (3.2, 14.6, 'k'),
      (2.6, 19.5, 'c'), (0.4, 24, 'k'), (-1.8, 19.5, 'c'), (-3.0, 12.5, 'c'), (-3.6, 7.0, 'k'), (-8.2, 3.6, 'k'), (-2.8, 1.2, 'c')]


def fluegel(x, y, grad, s=1.0):
    pts = tf(FL, s, grad, x, y)
    d, p = pfad(pts)
    ach = tf([(0, 0), (0.4, 24)], s, grad, x, y)
    e = [form(d, '#B2B76C'),
         E(poly_d(clip_linie(p, ach[0], ach[1], schatten_seite(ach[0], ach[1]))), '#7A8244', o=0.55, rolle='schatten'),
         linie(tf([(-1.6, 6), (-2, 13), (-0.8, 19)], s, grad, x, y), '#DCDC9C', 1.0, 0.7),
         linie(tf([(0, 4), (0.3, 14), (0.4, 22)], s, grad, x, y), '#7C844A', 0.7, 0.85),
         linie(tf([(0.5, 4), (4.8, 2.6)], s, grad, x, y), '#7C844A', 0.6, 0.8),
         linie(tf([(-0.5, 4), (-4.6, 3.2)], s, grad, x, y), '#7C844A', 0.6, 0.8)]
    nd, npoly = pfad(tf([(0, -0.6, 'c'), (2.4, 1.6, 'c'), (2.2, 5.2, 'c'), (0, 6.6, 'c'), (-2.2, 5.2, 'c'), (-2.4, 1.6, 'c')], s, grad, x, y))
    e += [form(nd, '#8E8048'),
          linie(tf([(-0.8, 1), (-0.9, 5)], s, grad, x, y), '#5E5228', 0.6, 0.9),
          linie(tf([(0.9, 1), (0.8, 5)], s, grad, x, y), '#5E5228', 0.6, 0.9),
          E(oval(*tf([(-1.1, 2.4)], s, grad, x, y)[0], 0.6, 1.0), '#C8BC80', o=0.8, rolle='licht')]
    return e


ebenen += fluegel(86, 50, 38, 1.2)
ebenen += fluegel(86, 50, -8, 1.38)

speichern('hainbuche', ebenen, quellen=[
    {'titel': 'Referenzfoto: Carpinus betulus leaf 01 by Line1',
     'url': 'https://commons.wikimedia.org/wiki/File:Carpinus_betulus_leaf_01_by_Line1.jpg'},
    {'titel': 'Referenzfoto: Carpinus betulus 06 ies (Fruchtstand)',
     'url': 'https://commons.wikimedia.org/wiki/File:Carpinus_betulus_06_ies.jpg'},
])
print('hainbuche geschrieben')
