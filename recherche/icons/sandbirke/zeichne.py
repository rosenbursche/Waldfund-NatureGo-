"""Sandbirke (Betula pendula): rautenförmiges, doppelt gesägtes Blatt mit lang ausgezogener Spitze;
hängende, walzenförmige Fruchtkätzchen; im Hintergrund weiße Rinde mit schwarzen Rissen."""
import sys
sys.path.insert(0, 'recherche/icons/schwarzerle')
from erle import *  # noqa

GRUEN = ('#5A8A38', '#345A20', '#8EBA5E')
ADER = '#C2DA94'
R = [(5.5, -1.2), (11.5, -4.6), (15.6, -9.6), (14.2, -16), (10.6, -22), (6.6, -28), (3.4, -34), (1.2, -40), (0, -45)]
Lk = [(-1.2, -40), (-3.4, -34), (-6.6, -28), (-10.6, -22), (-14.8, -15.6), (-15.4, -9.8), (-11.2, -4.6), (-5.2, -1.2)]

ebenen = hg_licht()
# Hintergrund: Birkenstamm links, weiß mit schwarzen Rissen und Querstreifen (weich, ohne Kontur)
ebenen.append(E('M20 14 C24 40 23 80 22 110 L38 110 C37 80 38 40 35 14 Z', '#D6D4C8', o=0.55, rolle='detail'))
ebenen.append(E('M31 14 C34 40 33 80 33 110 L38 110 C37 80 38 40 35 14 Z', '#8E9488', o=0.4, rolle='detail'))
ebenen.append(E('M23 30 l7 -1 l-1 2 Z M26 44 l8 -0.6 l-2 1.6 Z M22 58 l6 -0.8 l-0.6 1.8 Z M27 70 l7 0 l-2 2 Z '
                'M22 84 l9 -1 l-3 2.4 Z M24 96 l6 0 l-1 1.6 Z', '#1E1A16', o=0.55, rolle='detail'))
ebenen.append(E('M25 50 c1 3 0 5 1 8 M31 76 c-1 3 0 6 -1 9', s='#1E1A16', sw=1.0, o=0.5, rolle='detail'))
# hängender dünner Zweig mit Fruchtkätzchen oben rechts
ebenen.append(form(band([(104, 44), (96, 34), (84, 30), (72, 32)], 2.0, 1.6), '#6A4A3A'))
ebenen.append(linie([(89, 31.5), (90.5, 36), (90.5, 39)], '#5A4232', 0.9, 0.95))
ebenen.append(linie([(79, 31), (78.5, 35.5), (77.5, 39)], '#5A4232', 0.9, 0.95))
ebenen += kaetzchen([(90.5, 38), (92.2, 46), (92.4, 55), (90.6, 62), (88.6, 65)], 6.4, '#94924E', 0.45)
ebenen += kaetzchen([(77.5, 38), (78.6, 45), (78.2, 52), (76.4, 58), (74.6, 60.5)], 6.0, '#94924E', 0.45)
teile, info = blatt(R, Lk, 1.14, -4, 58, 97, GRUEN, ADER, adern=7, t0=0.1, t1=0.7, bogen=0.2,
                    saege={'abstand': 2.0, 'hoehe': 1.1, 'muster': (1, 0.45), 'von': 0.12, 'bis': 0.93},
                    stiel=[(0.8, 8), (0.3, 3.5), (0, -0.5)], stiel_farbe='#6A5A3A', licht_o=0.35, schatten_o=0.45)
ebenen += teile

speichern('sandbirke', ebenen, quellen=[
    {'titel': 'Referenzfoto: Birch leaf 001', 'url': 'https://commons.wikimedia.org/wiki/File:Birch_leaf_001.JPG'},
    {'titel': 'Referenzfoto: Birch-Betula-pendula-Tromsø (Rinde)', 'url': 'https://commons.wikimedia.org/wiki/File:Birch-Betula-pendula-Troms%C3%B8.JPG'},
    {'titel': 'Referenzfoto: Betula pendula young fruits', 'url': 'https://commons.wikimedia.org/wiki/File:Betula_pendula_young_fruits.jpg'},
])
print('sandbirke geschrieben')
