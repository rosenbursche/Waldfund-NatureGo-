"""Eingriffeliger Weißdorn: tief gelapptes Blatt + rote Mehlbeeren mit Kelchrest an langen Stielen."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

BLATT = ('#5C8A3A', '#3A5E22', '#8CB264')
FRUCHT = ('#B03A2C', '#72231A', '#DA6A52')
ZWEIG = ('#7E7466', '#4E463C', '#ABA190')
STIEL = ('#7A6A3E', '#4E4226', '#A6965E')
# rechte Blatthälfte: keilförmiger Grund, zwei tiefe Buchten, dreilappige Spitze
GELAPPT = [(0, 0), (0.06, -0.06), (0.16, -0.14), (0.3, -0.2), (0.44, -0.24), (0.34, -0.3), (0.16, -0.34), (0.07, -0.37),
           (0.18, -0.44), (0.34, -0.52), (0.46, -0.6), (0.32, -0.64), (0.14, -0.66), (0.08, -0.69), (0.16, -0.77),
           (0.22, -0.86), (0.13, -0.94), (0, -1)]
LAPPEN_SPITZEN = [(0.44, -0.24), (0.46, -0.6), (0.22, -0.86)]


def weissdorn_blatt(cx, cy, L, grad, schatten_seite=1):
    t = blatt(GELAPPT, cx, cy, L, grad, BLATT, n_zaehne=16, amp=0.022, adern=0, schatten_seite=schatten_seite)
    d = ''
    for sg in (1, -1):
        for (x, y) in LAPPEN_SPITZEN:
            yb = y * 0.62 + 0.02
            p = setzen([(0, yb), (sg * x * 0.45, y + 0.02), (sg * x * 0.9, y)], cx, cy, L, grad, 1.0 if sg > 0 else 0.94)
            d += f'M{p[0][0]} {p[0][1]} Q{p[1][0]} {p[1][1]} {p[2][0]} {p[2][1]} '
    t.append(E(d.strip(), s=BLATT[2], sw=0.6, o=0.75, rolle='detail'))
    return t


def mehlbeere(cx, cy, grad, s=1.0):
    """eiförmige rote Frucht; Spitze (mit Kelchrest) zeigt in Richtung grad."""
    halb = catmull([(0, 0.5), (3.2, 0.1), (5.0, -2.6), (5.1, -6.0), (3.6, -8.8), (1.2, -10.0), (0, -10.1)], 6)
    umr = halb + [(-x, y) for x, y in reversed(halb)][1:-1]
    k = lambda pts: setzen([(x / 10, y / 10) for x, y in pts], cx, cy, 10 * s, grad)
    t = [form(glatter_pfad(k(umr)), FRUCHT[0]),
         E(glatter_pfad(k(halb)), FRUCHT[1], o=0.55, rolle='schatten'),
         E(glatter_pfad(k([(-1.2, -2.4), (-3.8, -3.6), (-3.6, -6.8), (-1.6, -8.0), (-1.4, -5.0)])), FRUCHT[2], o=0.75, rolle='licht')]
    gl = k([(-2.4, -6.0)])[0]
    t.append(E(oval(gl[0], gl[1], 0.9 * s, 0.7 * s), '#F4D6C8', o=0.8, rolle='detail'))
    # Kelchrest: dunkler Kranz mit fünf kurzen Zipfeln
    sp = k([(0, -9.4)])[0]
    t.append(E(kreis(sp[0], sp[1], 1.7 * s), '#3A1E14', rolle='detail'))
    zip_d = ''
    for i in range(5):
        a = math.radians(grad + i * 72)
        zip_d += f'M{r1(sp[0])} {r1(sp[1])} L{r1(sp[0] + math.sin(a) * 2.6 * s)} {r1(sp[1] - math.cos(a) * 2.6 * s)} '
    t.append(E(zip_d.strip(), s='#3A1E14', sw=0.8, rolle='detail'))
    return t


ebenen = hg_licht()
# grauer Zweig mit kurzem Dorn
ebenen += zweig([(14, 72), (34, 64), (58, 58), (82, 52), (106, 48)], 4.0, 3.0, ZWEIG)
ebenen += zweig([(88, 51), (95, 58), (99, 64)], 2.4, 0.2, ZWEIG, licht=False)
# Blätter: zwei tief gelappte Blätter nach oben
ebenen += zweig([(42, 62), (44, 56)], 1.6, 1.4, BLATT, licht=False)
ebenen += weissdorn_blatt(44, 57, 33, -22, schatten_seite=1)
ebenen += zweig([(70, 55), (73, 50)], 1.6, 1.4, BLATT, licht=False)
ebenen += weissdorn_blatt(73, 51, 29, 36, schatten_seite=1)
# Fruchtstand (Doldentraube) unter dem Zweig
basis = (62, 64)
ebenen += zweig([(60, 58), (61, 61), basis], 2.0, 1.8, STIEL, licht=False)
fruechte = [(40, 80, 220, 1.12), (54, 90, 190, 1.18), (70, 88, 165, 1.15), (84, 78, 140, 1.1), (61, 77, 180, 1.12)]
for fx, fy, g, s in fruechte:
    a = math.radians(g)
    ansatz = (fx - math.sin(a) * 0.2, fy + math.cos(a) * 0.2)
    m = ((basis[0] + fx) / 2 + (fx - basis[0]) * 0.1, (basis[1] + fy) / 2)
    ebenen += zweig([basis, m, ansatz], 1.4, 1.1, STIEL, licht=False)
for fx, fy, g, s in sorted(fruechte, key=lambda f: f[1]):
    ebenen += mehlbeere(fx, fy, g, 1.0 * s)

speichern('weissdorn', ebenen, quellen=[
    {'titel': 'Referenzfoto Crataegus monogyna.jpg (CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Crataegus_monogyna.jpg'},
    {'titel': 'Referenzfoto Crataegus monogyna 2.jpg (CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Crataegus_monogyna_2.jpg'},
])
