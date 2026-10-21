"""Schwarzer Holunder: Fiederblatt + hängende Dolde schwarzer Beeren an weinroten Stielen."""
import sys, math, random
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

BLATT = ('#4F7F34', '#30521F', '#7FA75A')
BEERE = ('#2A1A2C', '#0F0A12', '#6A4A6C')
STIEL = ('#8E2638', '#5E1626', '#B85462')
ZWEIG = ('#8A7A5E', '#5A4C38', '#B4A688')
# Fiederblättchen: elliptisch, lang zugespitzt, scharf gesägt
FIEDER = [(0, 0), (0.13, -0.08), (0.22, -0.28), (0.23, -0.5), (0.18, -0.7), (0.09, -0.86), (0.03, -0.95), (0, -1)]


def richtung(a, b):
    return math.degrees(math.atan2(b[0] - a[0], -(b[1] - a[1])))


ebenen = hg_licht()
# --- Fiederblatt oben links: Spindel mit 2 Fiederpaaren + Endfieder
sp = [(66, 60), (52, 50), (40, 42), (30, 36)]
ebenen += zweig(sp, 2.2, 1.4, BLATT, licht=False)
g = richtung(sp[0], sp[-1])
for (px, py), L, w, seite in (((56, 53), 24, 62, 1), ((56, 53), 23, -58, -1), ((42, 43), 22, 60, 1), ((42, 43), 22, -60, -1)):
    ebenen += blatt(FIEDER, px, py, L, g + w, BLATT, n_zaehne=10, amp=0.04, adern=5, schatten_seite=seite,
                    ader_neigung=0.12)
ebenen += blatt(FIEDER, 31, 37, 25, g, BLATT, n_zaehne=11, amp=0.04, adern=5, schatten_seite=1, ader_neigung=0.12)

# --- Zweig oben rechts, von dort hängt die Dolde
ebenen += zweig([(104, 26), (90, 34), (78, 40)], 4.0, 3.0, ZWEIG)
knoten = (74, 52)
ebenen += zweig([(80, 39), (77, 45), knoten], 3.0, 2.6, STIEL, licht=False)
# Doldenstrahlen: Endpunkte der Hauptstrahlen
strahlen = [(50, 72), (62, 80), (76, 83), (89, 77), (96, 65)]
for e in strahlen:
    m = ((knoten[0] + e[0]) / 2 + (e[1] - knoten[1]) * 0.08, (knoten[1] + e[1]) / 2 - 3)
    ebenen += zweig([knoten, m, e], 2.6, 2.0, STIEL, licht=False)

# Beeren: je Strahl ein Büschel an feinen roten Stielchen
random.seed(7)
beeren, stielchen = [], []
for i, (ex, ey) in enumerate(strahlen):
    for k in range(9):
        w = math.radians(-160 + k * 40 + random.uniform(-12, 12))
        r = (4.2 if k % 2 else 6.6) + random.uniform(0, 1.4)
        bx, by = ex + math.cos(w) * r, ey + math.sin(w) * r * 0.85 + 2
        stielchen.append(((ex, ey), (bx, by)))
        beeren.append((bx, by, 2.5 + random.uniform(-0.3, 0.3)))
    beeren.append((ex, ey + 1.5, 2.6))
for a, b in stielchen:
    ebenen.append(linie([a, b], STIEL[0], 1.1, 0.95))
# von hinten nach vorn (oben zuerst), damit untere Beeren vorn liegen
for bx, by, r in sorted(beeren, key=lambda b: b[1]):
    ebenen += beere(r1(bx), r1(by), r1(r), BEERE, glanz=0.85)

speichern('holunder', ebenen, quellen=[
    {'titel': 'Referenzfoto Elder berries (10456756784).jpg (CC BY 2.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Elder_berries_(10456756784).jpg'},
    {'titel': 'Referenzfoto Elder berries (Sambucus nigra) - Flickr - S. Rae.jpg (CC BY 2.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Elder_berries_(Sambucus_nigra)_-_Flickr_-_S._Rae.jpg'},
])
