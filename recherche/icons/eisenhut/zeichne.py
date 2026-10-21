"""Blauer Eisenhut: Traube dunkelblauer Helmblüten, handförmig tief geteilte Blätter."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

BLUETE = ('#4A47A8', '#2B2870', '#8584D6')
BLATT = ('#3F6A33', '#26431E', '#6E9858')
STENGEL = ('#4E7A3A', '#2F4E22', '#7EA462')

# Blüte in Seitenansicht, Blick nach links; Ansatz am Stiel bei (3, 0)
HELM = [(4, 1), (5.8, -4), (5.6, -9.4), (2.8, -13.4), (-2, -13.6), (-5.2, -11), (-6.2, -7.6), (-9.4, -4.4), (-5.4, -4.6),
        (-2.6, -3.6), (0.4, -2), (2.4, 0.4)]
SEITE = [(-5.4, -4.8), (-7.8, -2.2), (-7.2, 1.6), (-3.6, 3.4), (0.6, 2.8), (3.4, 0.8), (0.4, -2.2), (-2.6, -3.8)]
UNTEN = [[(-4.6, 2.6), (-6.2, 6.2), (-4.4, 7.0), (-2.6, 3.2)], [(-1.4, 3.0), (-1.4, 7.0), (0.6, 6.8), (0.8, 2.8)]]


def k(pts, cx, cy, s, sx):
    return [(r1(cx + x * s * sx), r1(cy + y * s)) for x, y in pts]


def bluete(cx, cy, s, sx=1):
    """sx=1: Blick nach links, sx=-1: gespiegelt (Blick nach rechts)."""
    t = []
    for u in UNTEN:
        t.append(form(glatter_pfad(k(u, cx, cy, s, sx)), BLUETE[1]))
    t.append(form(glatter_pfad(k(catmull(SEITE, 3), cx, cy, s, sx)), BLUETE[0]))
    t.append(E(glatter_pfad(k([(-3.6, 3.2), (0.6, 2.8), (3.2, 0.8), (0.4, -1.2), (-3, 0.6)], cx, cy, s, sx)), BLUETE[1], o=0.6, rolle='schatten'))
    t.append(form(glatter_pfad(k(catmull(HELM, 3), cx, cy, s, sx)), BLUETE[0]))
    # Schatten an der Rückseite des Helms, Licht vorn oben
    t.append(E(glatter_pfad(k([(4, 0.4), (5.4, -4), (5, -8.6), (2.6, -11.6), (2.2, -7), (1.6, -2)], cx, cy, s, sx)), BLUETE[1], o=0.6, rolle='schatten'))
    hl = [(-1.8, -11.8), (-4.4, -9.8), (-5.4, -7.2), (-3.6, -7.6), (-1.4, -9.6)] if sx > 0 else [(-1.8, -11.8), (1.6, -11.8), (3.6, -9.6), (1.6, -9.2), (-1, -10.4)]
    t.append(E(glatter_pfad(k(hl, cx, cy, s, sx)), BLUETE[2], o=0.6, rolle='licht'))
    # Helmöffnung (dunkler Schlund) und Adern
    t.append(E(glatter_pfad(k([(-7.6, -4.6), (-5.2, -4.4), (-3, -3.6), (-5.6, -3.2)], cx, cy, s, sx)), '#1A1840', o=0.85, rolle='detail'))
    for a, b, c in (((-4.4, -9.6), (-2.6, -6.6), (-1, -4)), ((-1.6, -11.6), (0, -7.8), (0.8, -3)), ((-5.6, -1), (-3, 0.6), (0, 0.8))):
        t.append(kurve(*k([a, b, c], cx, cy, s, sx), BLUETE[1], 0.6, 0.8))
    return t


def knospe(cx, cy, s, sx=1):
    pts = [(3, 0.6), (4.2, -3), (2.6, -6.6), (-1.4, -7), (-3.8, -4), (-3.4, -0.6), (0, 1.4)]
    t = [form(glatter_pfad(k(pts, cx, cy, s, sx)), BLUETE[0]),
         E(glatter_pfad(k([(3, 0.6), (4.2, -3), (2.6, -6.6), (1.2, -3), (0, 1.4)], cx, cy, s, sx)), BLUETE[1], o=0.6, rolle='schatten'),
         E(oval(r1(cx - 1.4 * s * sx), r1(cy - 4.4 * s), r1(1.2 * s), r1(1.6 * s)), BLUETE[2], o=0.6, rolle='licht')]
    return t


# Blattabschnitt: schmal, fiederspaltig mit spitzen Zipfeln (lokal, Grund (0,0) -> Spitze (0,-1))
ZIPFEL_R = [(0, 0), (0.05, -0.18), (0.09, -0.36), (0.22, -0.46), (0.1, -0.5), (0.12, -0.64), (0.2, -0.74), (0.08, -0.78),
            (0.05, -0.9), (0, -1)]
ZIPFEL_L = [(0, 0), (0.05, -0.22), (0.08, -0.48), (0.18, -0.58), (0.07, -0.63), (0.06, -0.8), (0.03, -0.92), (0, -1)]


def eisenhut_blatt(cx, cy, L, grad, spreiz=34, n=5):
    t = []
    for i in range(n):
        w = grad + (i - (n - 1) / 2) * spreiz
        ll = L * (1 - abs(i - (n - 1) / 2) * 0.12)
        umr = ZIPFEL_R + [(-x, y) for x, y in reversed(ZIPFEL_L)][1:-1]
        p = setzen(umr, cx, cy, ll, w)
        t.append(form(pfad(p), BLATT[0]))
        t.append(E(pfad(setzen(ZIPFEL_R, cx, cy, ll, w)), BLATT[1], o=0.5, rolle='schatten'))
        m = setzen([(0, -0.04), (0, -0.92)], cx, cy, ll, w)
        t.append(linie(m, BLATT[2], 0.7, 0.8))
    return t


ebenen = hg_licht()
# Blätter unten (hinter dem Stängel)
ebenen += eisenhut_blatt(52, 100, 30, -52, spreiz=28)
ebenen += eisenhut_blatt(70, 100, 28, 50, spreiz=28)
# Stängel, leicht gebogen
ebenen += zweig([(62, 106), (61, 80), (58, 52), (57, 26)], 3.0, 1.8, STENGEL)
ebenen += eisenhut_blatt(61, 92, 18, 70, spreiz=30, n=3)
# Blüten von oben nach unten (untere liegen vorn), mit kurzen Stielchen
plan = [  # (Ansatz am Stängel, Blüte, Größe, Art, Richtung)
    ((57, 24), (54, 22), 0.6, 'k', 1),
    ((57.2, 28), (61.5, 28.5), 0.65, 'k', -1),
    ((57.5, 35), (51, 35), 0.85, 'b', 1),
    ((58, 45), (66, 45), 0.95, 'b', -1),
    ((58.5, 56), (49, 56), 1.05, 'b', 1),
    ((59.5, 67), (70, 67), 1.1, 'b', -1),
    ((60, 78), (48, 78), 1.15, 'b', 1),
]
for (sx0, sy0), (bx, by), s, art, sx in plan:
    ebenen += zweig([(sx0, sy0), ((sx0 + bx + 3 * s * sx) / 2, by + 2), (bx + 3 * s * sx, by + 0.5)], 1.4, 1.2, STENGEL, licht=False)
    ebenen += (knospe if art == 'k' else bluete)(bx, by, s, sx)

speichern('eisenhut', ebenen, quellen=[
    {'titel': 'Referenzfoto Aconitum napellus - flor - Encamp, Andorra 02.jpg (CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Aconitum_napellus_-_flor_-_Encamp,_Andorra_02.jpg'},
    {'titel': 'Referenzfoto Aconitum napellus Grigna.JPG (CC BY-SA 4.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Aconitum_napellus_Grigna.JPG'},
    {'titel': 'Köhler’s Medizinal-Pflanzen, Tafel 151 (gemeinfrei)', 'url': 'https://commons.wikimedia.org/wiki/File:Aconitum_napellus_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-151.jpg'},
])
