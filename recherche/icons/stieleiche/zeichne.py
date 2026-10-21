"""Stieleiche (Quercus robur): Blatt mit Öhrchen und sehr kurzem Stiel, zwei Eicheln an LANGEM Fruchtstiel."""
import sys
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/rotbuche')
from icon_helfer import *  # noqa
from baum_helfer import *  # noqa

GRUEN = ('#4E7A32', '#2E4E1E', '#7FA853')
ADER = '#B7CC86'
STIEL = '#8A7546'

# rechte Blatthälfte, lokal: Ansatz 0/0, Spitze oben. Lappen gerundet, Buchten tief.
rechts = [
    (0.8, 2.6, 'c'), (4.6, 5.0, 'c'), (8.2, 3.2, 'c'), (7.6, -0.6, 'c'), (4.6, -3.6, 'k'),        # Öhrchen (am Grund zurückgebogen)
    (8.4, -6.0, 'c'), (10.2, -9.6, 'c'), (6.4, -12.6, 'k'),                     # Lappen 1
    (11.6, -15.0, 'c'), (14.0, -19.6, 'c'), (8.6, -23.4, 'k'),                  # Lappen 2
    (14.8, -26.4, 'c'), (17.4, -31.6, 'c'), (10.2, -35.4, 'k'),                 # Lappen 3
    (15.8, -38.6, 'c'), (17.0, -43.8, 'c'), (9.6, -46.6, 'k'),                  # Lappen 4
    (13.6, -49.6, 'c'), (13.0, -54.6, 'c'), (6.6, -56.4, 'k'),                  # Lappen 5
    (7.6, -59.4, 'c'), (4.0, -63.0, 'c'),
]
spitzen_r = [(6.4, 1.6), (10.0, -8.4), (13.6, -18.0), (17.0, -30.0), (17.0, -42.0), (13.6, -52.6), (0, -64.5)]
links = spiegel(rechts, versatz=(0, 1.8), sx=0.93)
umriss = [(0, -64.5, 'c')] + links[:0] + []  # Platzhalter, unten richtig zusammengesetzt
umriss = rechts + [(0, -64.6, 'c')] + spiegel(rechts, versatz=(0, 2.2), sx=0.93)
spitzen_l = [(-x * 0.93, y + 2.2) for x, y in spitzen_r[:-1]]

S, GRAD, BX, BY = 0.95, -30, 60, 88
T = lambda p: tf(p, S, GRAD, BX, BY)
basis, spitze = T([(0, 0)])[0], T([(0, -64.5)])[0]

ebenen = hg_wald()
# langer Fruchtstiel: kommt neben dem Blattgrund aus dem Zweig, zwei Eicheln am Ende
stiel_pts = [(57, 99), (67, 92), (74, 80), (77, 67)]
ebenen.append(form(band(stiel_pts, 2.8, 2.0), STIEL))
# sehr kurzer Blattstiel
ebenen.append(form(band(T([(0, 5.5), (0, -1)]), 2.0, 1.6), STIEL))
blatt, poly = blatt_ebenen(T(umriss), basis, spitze, GRUEN, licht_o=0.45, schatten_o=0.55)
ebenen += blatt
# Adern: Mittelrippe und Seitenadern zu den Lappen
ebenen.append(linie(T([(0, 1), (0.6, -30), (0, -61)]), ADER, 1.1, 0.85))
for x, y in spitzen_r[:-1] + spitzen_l:
    ym = y * 0.55 + 2 if y < 0 else 0
    ebenen.append(linie(T([(0, ym), (x * 0.5, (ym + y) / 2 - 0.8), (x * 0.86, y * 0.98)]), ADER, 0.7, 0.75))
# Eicheln am Ende des langen Stiels (Becher sitzt am Stielende)
def an_stiel(ex, ey, grad, L):
    dx, dy = -math.sin(math.radians(grad)), math.cos(math.radians(grad))
    return ex + dx * (L / 2 + 1.2), ey + dy * (L / 2 + 1.2)
FARBEN = {'nuss': ('#A27C3C', '#6A4E22', '#CDAA62'), 'becher': ('#80705A', '#544634', '#ADA084')}
cx, cy = an_stiel(77, 67, -122, 16)
ebenen += eichel(cx, cy, -122, 16, 9.4, becher=0.3, farben=FARBEN)
cx, cy = an_stiel(77, 67, -42, 16.5)
ebenen += eichel(cx, cy, -42, 16.5, 9.6, becher=0.3, farben=FARBEN)

speichern('stieleiche', ebenen, quellen=[
    {'titel': 'Referenzfoto: 2009-11-14 (17) Acorn Leaf, Eichelblatt (Vera Buhl, CC BY-SA 3.0)',
     'url': 'https://commons.wikimedia.org/wiki/File:2009-11-14_(17)_Acorn_Leaf,_Eichelblatt.JPG'},
    {'titel': 'Referenzfoto: Quercus Robur 031 (Laub und Eicheln)',
     'url': 'https://commons.wikimedia.org/wiki/File:Quercus_Robur_031.jpg'},
])
print('stieleiche geschrieben')
