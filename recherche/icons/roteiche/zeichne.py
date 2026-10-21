"""Roteiche (Quercus rubra): großes Blatt mit SPITZEN, begrannten Lappen (Herbstrot) + dicke, kurze Eichel im flachen Becher."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/rotbuche')
from icon_helfer import *  # noqa
from baum_helfer import *  # noqa

ROT = ('#B4442C', '#74281A', '#DA7A4E')       # Herbstfärbung rot bis rotbraun
ADER = '#E6A57A'
STIEL = '#8A4A30'
GRANNE = '#3A1E12'

# rechte Blatthälfte, lokal: Ansatz 0/0, Spitze oben (-y). Lappen spitz mit Nebenzähnen, Buchten bis etwa zur halben Breite.
rechts = [
    (1.2, 1.4, 'c'), (4.6, -3.0, 'c'),
    (10, -6, 'c'), (13.4, -6.8, 'k'), (12.2, -8.8, 'k'), (16, -12.6, 'k'), (10.4, -14.2, 'c'), (6.4, -18.6, 'c'),     # Lappen 1
    (12.4, -20, 'c'), (17.4, -21, 'k'), (16, -23.2, 'k'), (21.6, -27.2, 'k'), (18.2, -28.6, 'k'), (19.6, -31.4, 'k'),
    (12.4, -30.4, 'c'), (7.2, -33.4, 'c'),                                                                         # Lappen 2
    (13.4, -35.4, 'c'), (18.4, -36.8, 'k'), (16.6, -38.6, 'k'), (19.6, -42.6, 'k'), (13.2, -42.4, 'c'), (5.6, -46.4, 'c'),  # Lappen 3
    (9.4, -48.4, 'c'), (12.6, -51.6, 'k'), (8.2, -52.6, 'c'), (3.4, -55.4, 'c'),                                    # Lappen 4
    (5.4, -58.4, 'k'), (3.2, -58.8, 'k'),
]
spitzen_r = [(13.4, -6.8), (16, -12.6), (17.4, -21), (21.6, -27.2), (19.6, -31.4), (18.4, -36.8), (19.6, -42.6), (12.6, -51.6), (5.4, -58.4)]
haupt_r = [(16, -12.6), (21.6, -27.2), (19.6, -42.6), (12.6, -51.6)]
SX, VY = 0.94, 1.6
umriss = rechts + [(0, -65, 'k')] + spiegel(rechts, versatz=(0, VY), sx=SX)
spitzen = spitzen_r + [(0, -65)] + [(-x * SX, y + VY) for x, y in spitzen_r]
haupt = haupt_r + [(-x * SX, y + VY) for x, y in haupt_r]

S, GRAD, BX, BY = 0.98, -30, 58, 94
T = lambda p: tf(p, S, GRAD, BX, BY)
basis, spitze = T([(0, 0)])[0], T([(0, -65)])[0]

ebenen = hg_wald()
# langer Blattstiel
ebenen.append(form(band(T([(0.4, 11), (0.2, 5), (0, -1)]), 2.2, 1.7), STIEL))
blatt, poly = blatt_ebenen(T(umriss), basis, spitze, ROT, licht_o=0.42, schatten_o=0.55)
ebenen += blatt
# Adern: Mittelrippe + Seitenadern in die Hauptlappen
ebenen.append(linie(T([(0, 1), (0.5, -32), (0, -62)]), ADER, 1.1, 0.85))
for x, y in haupt:
    ym = y * 0.6 + 2
    ebenen.append(linie(T([(0, ym), (x * 0.5, (ym + y) / 2 - 0.6), (x * 0.9, y * 0.99)]), ADER, 0.75, 0.75))
# Grannen: feine Borsten an jeder Lappenspitze (Kennmerkmal der Roteiche)
d = ''
for x, y in spitzen:
    l = math.hypot(x, y + 32) or 1
    ux, uy = x / l, (y + 32) / l
    if (x, y) == (0, -65):
        ux, uy = 0, -1
    a, b = T([(x, y), (x + ux * 2.6, y + uy * 2.6)])
    d += f'M{r1(a[0])} {r1(a[1])} L{r1(b[0])} {r1(b[1])} '
ebenen.append(E(d.strip(), s=GRANNE, sw=0.9, rolle='detail'))

# Eichel: dick und kurz, flacher untertassenförmiger Becher
FARBEN = {'nuss': ('#9A6A34', '#64421E', '#C69A5E'), 'becher': ('#8A6E4E', '#5A4630', '#B49A76')}
ebenen.append(form(band([(80, 103), (83, 97), (84, 90)], 2.8, 2.4), '#6E5638'))
ebenen += eichel(84, 77, 172, 21, 18, becher=0.22, farben=FARBEN)

speichern('roteiche', ebenen, quellen=[
    {'titel': 'Referenzfoto: Northern Red Oak Quercus rubra leaf and acorn 01.jpg',
     'url': 'https://commons.wikimedia.org/wiki/File:Northern_Red_Oak_Quercus_rubra_leaf_and_acorn_01.jpg'},
])
print('roteiche geschrieben')
