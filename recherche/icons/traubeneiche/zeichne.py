"""Traubeneiche (Quercus petraea): Blatt mit deutlichem Stiel, keilförmigem Grund (ohne Öhrchen),
gleichmäßigen, flacheren Lappen; Eicheln SITZEND gehäuft direkt am Zweig."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/rotbuche')
from icon_helfer import *  # noqa
from baum_helfer import *  # noqa

GRUEN = ('#4A7430', '#2C4A1C', '#7CA450')
ADER = '#B5C984'
ZWEIG = '#86704C'

# rechte Blatthälfte: keilförmiger Grund, 6 gleichmäßige, flache Lappen
rechts = [
    (1.4, -1.6, 'c'), (4.6, -5.0, 'c'), (8.0, -8.6, 'c'), (7.4, -11.4, 'k'),
    (11.2, -13.6, 'c'), (13.2, -17.4, 'c'), (10.8, -20.2, 'k'),
    (14.4, -22.6, 'c'), (15.8, -26.8, 'c'), (12.4, -29.6, 'k'),
    (15.6, -32.4, 'c'), (16.2, -36.8, 'c'), (12.4, -39.4, 'k'),
    (15.0, -42.4, 'c'), (14.4, -46.8, 'c'), (10.4, -48.6, 'k'),
    (12.0, -51.4, 'c'), (10.0, -55.0, 'c'), (6.2, -55.8, 'k'),
    (6.0, -58.6, 'c'), (3.0, -61.2, 'c'),
]
spitzen_r = [(7.6, -8.0), (12.8, -16.8), (15.6, -26.0), (16.2, -36.0), (14.8, -45.4), (11.4, -53.2)]
umriss = rechts + [(0, -62.4, 'c')] + spiegel(rechts, versatz=(0, 1.6), sx=0.96)
spitzen_l = [(-x * 0.96, y + 1.6) for x, y in spitzen_r]

S, GRAD, BX, BY = 0.92, -28, 58, 79
T = lambda p: tf(p, S, GRAD, BX, BY)
basis, spitze = T([(0, 0)])[0], T([(0, -62.4)])[0]

ebenen = hg_wald()
# Zweig unten rechts, daran die sitzenden Eicheln und der lange Blattstiel
ebenen.append(form(band([(58, 98), (72, 91.5), (87, 84.5), (102, 77)], 4.4, 3.2), ZWEIG))
ebenen.append(E(band([(60, 96.6), (73, 90.2), (88, 83.2)], 1.2, 0.8), '#B09A72', o=0.7, rolle='licht'))
# deutlicher Blattstiel (etwa ein Fünftel der Blattlänge)
ebenen.append(form(band([(68, 92.5), (65, 88), (62, 82), T([(0, 1)])[0]], 2.2, 1.7), '#7E8A44'))
blatt, poly = blatt_ebenen(T(umriss), basis, spitze, GRUEN, licht_o=0.45, schatten_o=0.55)
ebenen += blatt
ebenen.append(linie(T([(0, 1), (0.5, -30), (0, -59)]), ADER, 1.1, 0.85))
for x, y in spitzen_r + spitzen_l:
    ym = y * 0.62
    ebenen.append(linie(T([(0, ym), (x * 0.5, (ym + y) / 2 - 0.6), (x * 0.86, y * 0.98)]), ADER, 0.7, 0.75))
# drei Eicheln sitzend gehäuft am Zweig (kein Fruchtstiel)
FARBEN = {'nuss': ('#9E7A3A', '#664A20', '#CBA862'), 'becher': ('#7E7058', '#524634', '#AA9E82')}
ebenen += eichel(89, 69, -162, 14, 10, becher=0.36, farben=FARBEN)
ebenen += eichel(76.5, 73, 160, 14, 10, becher=0.36, farben=FARBEN)
ebenen += eichel(83, 76, 178, 14.5, 10.4, becher=0.36, farben=FARBEN)

speichern('traubeneiche', ebenen, quellen=[
    {'titel': 'Referenzfoto: Leaf & light (Blätter der Traubeneiche)',
     'url': 'https://commons.wikimedia.org/wiki/File:Leaf_%26_light.jpg'},
    {'titel': 'Referenzfoto: Quercus petraea foliage acorns Bulgaria',
     'url': 'https://commons.wikimedia.org/wiki/File:Quercus_petraea_foliage_acorns_Bulgaria.jpg'},
])
print('traubeneiche geschrieben')
