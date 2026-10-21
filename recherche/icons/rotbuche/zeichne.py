"""Rotbuche (Fagus sylvatica): ovales, ganzrandiges, leicht welliges Blatt mit parallelen Seitenadern;
geöffneter, weichstacheliger Fruchtbecher (vier Klappen) mit zwei dreikantigen Bucheckern."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/rotbuche')
from icon_helfer import *  # noqa
from baum_helfer import *  # noqa

GRUEN = ('#4F8636', '#2E5520', '#82B25A')
ADER = '#BCD68E'
L, W = 58, 18.5
ADERN = 8


def breite(t):
    f = (t ** 0.5) * ((1 - t) ** 0.8)
    return W * f / 0.42


def umriss_rechts(sx=1.0, dy=0.0, phase=0.0):
    pts = []
    tv = [0.1 + 0.104 * j + phase for j in range(ADERN)]
    for j, t in enumerate(tv):
        tm = t - 0.052
        if tm > 0.02:
            pts.append((breite(tm) * sx - 0.5, -L * tm + dy, 'c'))   # leichte Einbuchtung (wellig)
        pts.append((breite(t) * sx + 0.5, -L * t + dy, 'c'))         # Aderende, leicht vorgewölbt
    pts.append((breite(0.95) * sx, -L * 0.95 + dy, 'c'))
    return pts, tv


r, tv_r = umriss_rechts()
lpts, tv_l = umriss_rechts(sx=0.94, dy=0.0, phase=0.03)
umriss = [(0, 0.8, 'c')] + r + [(0, -L - 1.5, 'k')] + [(-x, y, k) for x, y, k in reversed(lpts)]

S, GRAD, BX, BY = 0.9, 30, 40, 80
T = lambda p: tf(p, S, GRAD, BX, BY)
basis, spitze = T([(0, 0)])[0], T([(0, -L)])[0]

ebenen = hg_wald()
# Zweig mit Fruchtbecher unten rechts
ebenen.append(form(band([(103, 96), (92, 91), (80, 87)], 2.8, 2.4), '#7A5E3E'))
ebenen.append(form(band(T([(0, 6), (0, -1)]), 2.0, 1.7), '#7A6A3A'))
blatt, poly = blatt_ebenen(T(umriss), basis, spitze, GRUEN, licht_o=0.42, schatten_o=0.55)
ebenen += blatt
# Glanz (Buchenblätter glänzen) als weicher Streifen
ebenen.append(E(pfad(T([(-4, -14), (-10, -26), (-11, -38), (-7, -46), (-6, -34), (-5, -22)]))[0], '#B6D88A', o=0.35, rolle='licht'))
# Adern: Mittelrippe, parallele Seitenadern
ebenen.append(linie(T([(0, 0.5), (0.4, -30), (0, -L + 2)]), ADER, 1.1, 0.85))
for t in tv_r:
    ebenen.append(linie(T([(0, -L * (t - 0.11)), (breite(t) * 0.5, -L * (t - 0.035)), (breite(t) * 0.92, -L * t + 0.3)]), ADER, 0.7, 0.75))
for t in tv_l:
    ebenen.append(linie(T([(0, -L * (t - 0.11)), (-breite(t) * 0.47, -L * (t - 0.035)), (-breite(t) * 0.86, -L * t + 0.3)]), ADER, 0.7, 0.75))
# feine Wimperhaare am Rand (junge Blätter) – nur angedeutet
# Fruchtbecher: vier aufgesprungene Klappen, außen weichstachelig
CX, CY = 79, 84
K = 1.2
KN = 1.08
KLAPPE = [(0, 0, 'k'), (3.6, -3.5, 'c'), (3.4, -9.5, 'c'), (0.6, -13.4, 'c'), (-2.6, -11.5, 'c'), (-3.8, -4.5, 'c')]
klappen = []
for w in (-62, -24, 24, 62):
    pts = tf(KLAPPE, K, w, CX, CY)
    d, p = pfad(pts)
    stacheln = []
    for (x, y) in p[4::3]:
        dx, dy = x - CX, y - CY
        ln = math.hypot(dx, dy) or 1
        if ln < 4:
            continue
        stacheln.append(f'M{r1(x)} {r1(y)} l{r1(dx / ln * 3)} {r1(dy / ln * 3)}')
    klappen.append((w, d, p, stacheln))
for w, d, p, st in klappen:
    ebenen.append(E(' '.join(st), s='#8A6A40', sw=1.0, rolle='detail'))
for w, d, p, st in klappen:
    ebenen.append(form(d, '#9A7444'))
    ach = tf([(0, 0), (0, -13)], K, w, CX, CY)
    ebenen.append(E(poly_d(clip_linie(p, ach[0], ach[1], schatten_seite(ach[0], ach[1]))), '#5E4426', o=0.65, rolle='schatten'))
    ebenen.append(linie(tf([(-1.6, -2.5), (-1.8, -7), (-0.4, -11)], K, w, CX, CY), '#C9A877', 1.1, 0.7))
# zwei dreikantige Bucheckern
NUSS = [(0, -12, 'k'), (3.0, -6.5, 'c'), (4.6, -1.2, 'c'), (3.0, 0.8, 'c'), (-3.0, 0.8, 'c'), (-4.6, -1.2, 'c'), (-3.0, -6.5, 'c')]
for w, dx in ((-14, -3.4), (12, 3.4)):
    pts = tf(NUSS, KN, w, CX + dx, CY)
    d, p = pfad(pts)
    ebenen.append(form(d, '#8A5230'))
    ach = tf([(0.8, 1), (0, -12)], KN, w, CX + dx, CY)
    ebenen.append(E(poly_d(clip_linie(p, ach[0], ach[1], schatten_seite(ach[0], ach[1]))), '#552E18', o=0.7, rolle='schatten'))
    ebenen.append(linie(tf([(-2.2, -0.5), (-2.4, -5), (-0.6, -9.5)], KN, w, CX + dx, CY), '#C99366', 1.0, 0.8))
    ebenen.append(linie(tf([(0.8, 0.6), (0.5, -6), (0, -11.4)], KN, w, CX + dx, CY), '#3E2212', 0.7, 0.8))

# Becherboden (unten, weichstachelig) und kurzer Stiel
bd, bp = pfad([(CX - 6.5, CY - 1.5, 'k'), (CX - 5.2, CY + 3.2, 'c'), (CX, CY + 5.6, 'c'), (CX + 5.2, CY + 3.2, 'c'), (CX + 6.5, CY - 1.5, 'k'), (CX, CY + 0.6, 'c')])
st = []
for (x, y) in bp[2:20:2]:
    dx, dy = x - CX, y - (CY - 2)
    ln = math.hypot(dx, dy) or 1
    st.append(f'M{r1(x)} {r1(y)} l{r1(dx / ln * 2.4)} {r1(dy / ln * 2.4)}')
ebenen.append(E(' '.join(st), s='#8A6A40', sw=1.0, rolle='detail'))
ebenen.append(form(bd, '#86643A'))
ebenen.append(E(poly_d(clip_linie(bp, (CX, CY - 4), (CX, CY + 8), -1)), '#5E4426', o=0.6, rolle='schatten'))

speichern('rotbuche', ebenen, quellen=[
    {'titel': 'Referenzfoto: Fagus sylvatica leaf P', 'url': 'https://commons.wikimedia.org/wiki/File:Fagus_sylvatica_leaf_P.jpg'},
    {'titel': 'Referenzfoto: Fagus sylvatica - fruits and leaves',
     'url': 'https://commons.wikimedia.org/wiki/File:Fagus_sylvatica_-_fruits_and_leaves.jpg'},
])
print('rotbuche geschrieben')
