"""Schlehe: dorniger, schwarzbrauner Zweig mit blau bereiften Früchten und kleinen gesägten Blättern."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

ZWEIG = ('#3E302A', '#1E1612', '#7E6A5C')
BLATT = ('#5B8236', '#38561F', '#8AAE5E')
FRUCHT = ('#34466F', '#1B2644', '#5A6E9C')
REIF = '#A3B5D0'
BLATTF = [(0, 0), (0.17, -0.12), (0.25, -0.36), (0.24, -0.6), (0.17, -0.8), (0.07, -0.94), (0, -1)]


def schlehe(cx, cy, r, reif_dx=0):
    t = [form(kreis(cx, cy, r), FRUCHT[0]),
         E(kreis(r1(cx + r * 0.15), r1(cy + r * 0.15), r1(r * 0.8)), FRUCHT[1], o=0.5, rolle='schatten'),
         E(kreis(r1(cx - r * 0.1), r1(cy - r * 0.12), r1(r * 0.74)), FRUCHT[0], rolle='licht'),
         # Wachsreif: matter, hellblauer Schleier oben links
         E(oval(r1(cx - r * 0.12 + reif_dx), r1(cy - r * 0.12), r1(r * 0.78), r1(r * 0.74)), REIF, o=0.42, rolle='licht'),
         E(oval(r1(cx - r * 0.25), r1(cy - r * 0.25), r1(r * 0.5), r1(r * 0.45)), REIF, o=0.4, rolle='licht'),
         E(oval(r1(cx - r * 0.3), r1(cy - r * 0.34), r1(r * 0.3), r1(r * 0.22)), '#D3DDEA', o=0.5, rolle='licht'),
         # feine Längsfurche (Bauchnaht)
         kurve((cx + r * 0.2, cy - r * 0.92), (cx + r * 0.55, cy), (cx + r * 0.25, cy + r * 0.9), FRUCHT[1], 0.6, 0.6),
         # abgeriebene, dunkle Stelle im Reif
         E(oval(r1(cx + r * 0.38), r1(cy + r * 0.3), r1(r * 0.18), r1(r * 0.14)), '#1B2644', o=0.5, rolle='detail')]
    return t


ebenen = hg_licht()
# Hauptzweig unten links -> oben rechts
haupt = [(18, 96), (34, 82), (52, 66), (72, 50), (92, 36), (106, 26)]
# Dornen (Kurztriebe, die spitz enden) – hinter dem Hauptzweig
for p0, p1 in (((40, 77), (28, 60)), ((60, 59), (68, 40)), ((86, 40), (80, 24)), ((30, 87), (38, 102))):
    m = ((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2)
    ebenen += zweig([p0, m, p1], 2.6, 0.3, ZWEIG, licht=False)
ebenen += zweig(haupt, 5.0, 3.2, ZWEIG)
# vordere Dornen, deutlich spitz
for p0, p1 in (((44, 75), (66, 96)), ((94, 35), (102, 50)), ((24, 92), (14, 84)), ((62, 58), (78, 34))):
    m = ((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - 1)
    ebenen += zweig([p0, m, p1], 2.8, 0.2, ZWEIG, licht=False)
# Rindenporen
ebenen.append(E(' '.join(kreis(x, y, 0.6) for x, y in ((28, 88), (46, 72), (64, 57), (84, 41))), '#8C7868', o=0.7, rolle='detail'))
# kleine Blätter
for cx, cy, L, g, ss in ((50, 66, 17, -60, -1), (74, 49, 16, 20, 1), (90, 37, 15, 60, 1), (36, 80, 15, -100, -1)):
    ebenen += blatt(BLATTF, cx, cy, L, g, BLATT, n_zaehne=9, amp=0.035, adern=4, schatten_seite=ss, ader_neigung=0.12)
# Früchte auf kurzen Stielen
for (sx, sy), (cx, cy, r) in (((58, 62), (49, 54, 9.0)), ((64, 58), (70, 69, 9.6)), ((44, 73), (52, 82, 8.8)), ((78, 47), (86, 58, 7.8))):
    ebenen += zweig([(sx, sy), (cx, cy)], 1.6, 1.4, BLATT, licht=False)
for cx, cy, r in sorted([(49, 54, 9.0), (86, 58, 7.8), (70, 69, 9.6), (52, 82, 8.8)], key=lambda f: f[1]):
    ebenen += schlehe(cx, cy, r)

speichern('schlehe', ebenen, quellen=[
    {'titel': 'Referenzfoto Closeup of blackthorn aka sloe aka prunus spinosa sweden 20050924.jpg (CC BY-SA 3.0)',
     'url': 'https://commons.wikimedia.org/wiki/File:Closeup_of_blackthorn_aka_sloe_aka_prunus_spinosa_sweden_20050924.jpg'},
    {'titel': 'Referenzfoto Prunus spinosa 002.jpg (H. Zell, CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Prunus_spinosa_002.jpg'},
])
