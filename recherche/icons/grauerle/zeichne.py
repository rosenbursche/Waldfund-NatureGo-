"""Grauerle (Alnus incana): spitz-eiförmiges, doppelt gesägtes Blatt mit vielen parallelen Adern,
Unterseite grau (zweites, umgewendetes Blatt); kleine, fast sitzende Fruchtzäpfchen."""
import sys
sys.path.insert(0, 'recherche/icons/schwarzerle')
from erle import *  # noqa

GRUEN = ('#4C7436', '#2A4A1E', '#7CA05A')
GRAU = ('#9EAA9A', '#6E7A6C', '#C6CEC0')
R = [(3.5, -0.8), (9, -4.5), (13, -11), (14.6, -19), (13.4, -27), (10, -34), (5.4, -40), (2, -44), (0, -47.5)]
Lk = [(-2, -44), (-5.4, -40), (-10, -34), (-13.4, -27), (-14.6, -19), (-13, -11), (-9, -4.5), (-3.5, -0.8)]
SAEGE = {'abstand': 2.0, 'hoehe': 1.15, 'muster': (1, 0.45), 'von': 0.06, 'bis': 0.95}

ebenen = hg_wald()
# Zweig oben rechts
ebenen.append(form(band([(106, 46), (94, 39), (82, 36), (70, 37)], 3.0, 2.3), '#7A7266'))
# zweites Blatt: graue Unterseite
teile, _ = blatt(R, Lk, 0.8, -72, 72, 37, GRAU, '#E2E6DA', adern=9, t0=0.12, t1=0.82, bogen=0.2, saege=SAEGE,
                 licht_o=0.3, schatten_o=0.4, ader_sw=0.6)
ebenen += teile
# Zäpfchen: sitzend, dicht am Zweig
ebenen += zapfen(80, 42, -6, 0.88)
ebenen += zapfen(87.5, 44, 12, 0.92)
ebenen += zapfen(95, 47, -20, 0.85)
# Hauptblatt: Oberseite
teile, info = blatt(R, Lk, 1.1, 8, 54, 104, GRUEN, '#A8C47E', adern=10, t0=0.1, t1=0.84, bogen=0.2, saege=SAEGE,
                    stiel=[(0.8, 7), (0.3, 3), (0, -0.5)], stiel_farbe='#6E6A50', licht_o=0.32, schatten_o=0.48)
ebenen += teile

speichern('grauerle', ebenen, quellen=[
    {'titel': 'Referenzfoto: Alnus incana 010701', 'url': 'https://commons.wikimedia.org/wiki/File:Alnus_incana_010701.jpg'},
    {'titel': 'Referenzfoto: Alnus incana Leaf', 'url': 'https://commons.wikimedia.org/wiki/File:Alnus_incana_Leaf.jpg'},
])
print('grauerle geschrieben')
