"""Schwarzerle (Alnus glutinosa): rundliches, dunkelgrün glänzendes Blatt mit eingebuchteter Spitze,
doppelt gesägt; gestielte, verholzte Fruchtzäpfchen und ein männliches Kätzchen am Zweig."""
import sys
sys.path.insert(0, 'recherche/icons/schwarzerle')
from erle import *  # noqa

GRUEN = ('#36602A', '#1E3C16', '#629050')
ADER = '#9CBA74'
R = [(3.5, -0.6), (9, -3.6), (14, -9.5), (16.6, -17), (16.4, -24.5), (13.6, -30.5), (8.6, -34.4), (3.6, -35.4), (0, -31.4)]
Lk = [(-3.6, -35.4), (-8.8, -34.6), (-13.8, -30.6), (-16.4, -24.4), (-16.2, -17), (-13.4, -9.6), (-8.4, -3.8), (-3.2, -0.8)]

ebenen = hg_wald()
# Zweig oben rechts
ebenen.append(form(band([(106, 46), (94, 38), (82, 34), (70, 33)], 3.0, 2.2), '#5E4A3A'))
# Kätzchen (männlich), hängend
ebenen += kaetzchen([(94, 38.5), (97, 47), (97.5, 56), (96, 64)], 5.2, '#8A5A44')
# Zäpfchen an Stielen
stiele = [((84, 34.5), (80, 46)), ((84, 34.5), (87, 50)), ((76, 33.5), (71, 43))]
for a, b in stiele:
    ebenen.append(form(band([a, ((a[0] + b[0]) / 2 + 0.6, (a[1] + b[1]) / 2), b], 1.4, 1.2), '#5E4A3A'))
ebenen += zapfen(70, 48.5, 14, 1.05)
ebenen += zapfen(79.5, 51.5, 4, 1.12)
ebenen += zapfen(87.5, 55.5, -10, 1.05)
teile, info = blatt(R, Lk, 1.3, 2, 58, 100, GRUEN, ADER, adern=6, t0=0.14, t1=0.8, bogen=0.3,
                    saege={'abstand': 2.2, 'hoehe': 1.0, 'muster': (1, 0.5), 'von': 0.06, 'bis': 0.97},
                    stiel=[(0.8, 7), (0.3, 3), (0, -0.5)], stiel_farbe='#6A5A3A', licht_o=0.32, schatten_o=0.5)
ebenen += teile
T = info['T']
# klebriger Glanz
ebenen.append(linie(T([(-5, -12), (-9.5, -19), (-10, -26)]), '#C4E0A4', 1.6, 0.35))

speichern('schwarzerle', ebenen, quellen=[
    {'titel': 'Referenzfoto: Alnus glutinosa 051 (Zäpfchen am Zweig)', 'url': 'https://commons.wikimedia.org/wiki/File:Alnus_glutinosa_051.jpg'},
    {'titel': 'Referenzfoto: Alnus glutinosa sl1 (gestielte Knospen)', 'url': 'https://commons.wikimedia.org/wiki/File:Alnus_glutinosa_sl1.jpg'},
])
print('schwarzerle geschrieben')
