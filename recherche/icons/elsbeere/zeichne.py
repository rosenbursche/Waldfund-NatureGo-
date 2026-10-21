"""Elsbeere: ahornähnlich gelapptes Blatt mit spitzen, fein gesägten Lappen (unterstes Paar weit abstehend)
+ Doldenrispe brauner, hell gepunkteter Früchte mit Kelchrest."""
import sys, math, random
sys.path.insert(0, 'recherche/icons/waldkiefer')
from baum3_helfer import *

BLATT = ('#4A7C34', '#2E521E', '#7CA656')
FRUCHT = ('#8E5632', '#5A341C', '#BC8458')
STIEL = ('#8A5E3E', '#5A3C26', '#B68A66')
ZWEIG = ('#6E5E4E', '#463C32', '#9A8A78')
PUNKT = '#E2CFA2'
# rechte Blatthälfte: drei spitze Lappen, der unterste weit abstehend
HALB = [(0, 0), (0.12, 0.02), (0.28, -0.03), (0.45, -0.09), (0.62, -0.17), (0.46, -0.25), (0.27, -0.31),
        (0.35, -0.42), (0.49, -0.54), (0.32, -0.58), (0.17, -0.63), (0.22, -0.73), (0.27, -0.81), (0.14, -0.85),
        (0.07, -0.91), (0.02, -0.97), (0, -1)]
SPITZEN = [(0.62, -0.17), (0.49, -0.54), (0.27, -0.81)]


def elsbeer_blatt(cx, cy, L, grad):
    t = blatt(HALB, cx, cy, L, grad, BLATT, n_zaehne=24, amp=0.018, adern=0, schatten_seite=1, zahn_vorn=0.6)
    d = ''
    for sg, sk in ((1, 1.0), (-1, 0.94)):
        for (x, y) in SPITZEN:
            p = setzen([(0, y * 0.45 + 0.02), (sg * x * 0.45, y * 0.75), (sg * x * 0.88, y * 0.97)], cx, cy, L, grad, sk)
            d += f'M{p[0][0]} {p[0][1]} Q{p[1][0]} {p[1][1]} {p[2][0]} {p[2][1]} '
    t.append(E(d.strip(), s=BLATT[2], sw=0.6, o=0.75, rolle='detail'))
    return t


def frucht(cx, cy, grad, s=1.0):
    """ovale braune Frucht mit hellen Lentizellen; Kelchrest zeigt nach grad."""
    halb = catmull([(0, 0.4), (3.0, 0.0), (4.4, -2.6), (4.4, -6.2), (3.0, -8.8), (1.0, -9.8), (0, -9.9)], 6)
    k = lambda pts: setzen([(x / 10, y / 10) for x, y in pts], cx, cy, 10 * s, grad)
    umr = halb + [(-x, y) for x, y in reversed(halb)][1:-1]
    t = [form(glatter_pfad(k(umr)), FRUCHT[0]),
         E(glatter_pfad(k(halb)), FRUCHT[1], o=0.55, rolle='schatten'),
         E(glatter_pfad(k([(-1.0, -2.6), (-3.4, -3.6), (-3.2, -6.6), (-1.4, -7.6), (-1.2, -5.0)])), FRUCHT[2], o=0.7, rolle='licht')]
    random.seed(int(cx * 7 + cy))
    pkt = ''
    for _ in range(9):
        x, y = random.uniform(-3.4, 3.4), random.uniform(-8.4, -1.2)
        if abs(x) < 3.6 - abs(y + 4.8) * 0.3:
            p = k([(x, y)])[0]
            pkt += kreis(p[0], p[1], 0.45 * s) + ' '
    t.append(E(pkt.strip(), PUNKT, o=0.9, rolle='detail'))
    sp = k([(0, -9.3)])[0]
    t.append(E(kreis(sp[0], sp[1], 1.3 * s), '#2E1A10', rolle='detail'))
    return t


ebenen = hg_licht()
ebenen += zweig([(108, 30), (94, 36), (80, 42)], 4.0, 3.2, ZWEIG)
ebenen.append(E(kreis(98, 34, 0.7) + ' ' + kreis(88, 38.5, 0.6), '#C8B8A0', o=0.8, rolle='detail'))
# langer Blattstiel, Blatt nach links oben
st = [(82, 42), (72, 50), (62, 58)]
ebenen += zweig(st, 1.8, 1.5, BLATT, licht=False)
ebenen += elsbeer_blatt(62, 58, 42, -48)
# Fruchtstand unten rechts
basis = (86, 44)
fr = [(66, 76, 200, 1.25), (79, 82, 180, 1.3), (92, 74, 160, 1.25), (74, 66, 195, 1.15), (88, 62, 165, 1.1)]
for fx, fy, g, s in fr:
    a = math.radians(g)
    m = ((basis[0] + fx) / 2 + 2, (basis[1] + fy) / 2)
    ebenen += zweig([basis, m, (fx, fy)], 1.4, 1.1, STIEL, licht=False)
for fx, fy, g, s in sorted(fr, key=lambda f: f[1]):
    ebenen += frucht(fx, fy, g, s)

speichern('elsbeere', ebenen, quellen=quellen('elsbeere'))
