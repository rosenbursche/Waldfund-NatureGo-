"""Bergulme (Ulmus glabra): großes, verkehrt-eiförmiges Blatt mit sehr ungleichem Grund, doppelt gesägt,
rau, Spitze mit zwei seitlichen Zipfeln (dreispitzig); runde Flügelnüsse mit Samen in der Mitte."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/esche')
from blatt_helfer import *  # noqa

GRUEN = ('#3F6C2C', '#234318', '#6E9A4A')
ADER = '#A8C27A'
R = [(4.5, 0.6), (11, -3), (16, -10), (19, -19), (20.5, -28), (20, -36), (19.4, -42), (22.5, -50), (15, -46.5), (9.5, -50), (5, -54), (2, -59), (0, -64)]
Lk = [(-1.8, -59), (-4.6, -54), (-8.6, -50.2), (-13.4, -49.2), (-18.4, -53), (-15.6, -44), (-16, -36), (-15.2, -26), (-12.6, -17), (-8.4, -11.5), (-3.6, -8.6), (-1, -8)]

ebenen = hg_wald()
# Zweig unten rechts
ebenen.append(form(band([(106, 98), (94, 94), (82, 92)], 3.2, 2.6), '#6E5840'))
teile, info = blatt(R, Lk, 1.02, -36, 84, 96, GRUEN, ADER, adern=13, t0=0.1, t1=0.86, bogen=0,
                    saege={'abstand': 2.0, 'hoehe': 1.35, 'muster': (1, 0.45), 'von': 0.06, 'bis': 0.93},
                    stiel=[(1, 5), (0.5, 2), (0, -0.5)], stiel_farbe='#6E5840', licht_o=0.36, schatten_o=0.5,
                    ader_sw=0.6, ader_o=0.7)
ebenen += teile
T = info['T']
# raue Oberfläche: feine Netzadern zwischen den Seitenadern
netz = []
for sx, start, ende in info['enden'][2:-4]:
    for u in (0.35, 0.65):
        a = (ende[0] * u, start[1] + (ende[1] - start[1]) * u - 0.3)
        b = (a[0] + sx * 0.6, a[1] - 2.2)
        pa, pb = T([a, b])
        netz.append(f'M{r1(pa[0])} {r1(pa[1])} L{r1(pb[0])} {r1(pb[1])}')
ebenen.append(E(' '.join(netz), s='#1E3A14', sw=0.5, o=0.45, rolle='detail'))

# Flügelnüsse: rund, papierartig, Kerbe oben, Same in der Mitte
FRUCHT = [(0, -6.2, 'k'), (2.2, -7.6, 'c'), (6, -5.6, 'c'), (7.4, -0.6, 'c'), (6, 4.6, 'c'), (2.4, 7.4, 'c'), (0, 7.8, 'c'),
          (-2.4, 7.4, 'c'), (-6, 4.6, 'c'), (-7.4, -0.6, 'c'), (-6, -5.6, 'c'), (-2.2, -7.6, 'c')]


def flugnuss(x, y, grad, s):
    Tf = lambda p: tf(p, s, grad, x, y)
    d, poly = pfad(Tf(FRUCHT))
    ach = Tf([(-6, -6), (6, 6)])
    e = [linie(Tf([(0, 7.5), (0.4, 10), (1.4, 12)]), '#6E6A3A', 1.0, 0.95),
         form(d, '#C4CF8C'),
         E(poly_d(clip_punkt(poly, ach[0], ach[1], Tf([(6, -6)])[0])), '#8C9A58', o=0.0, rolle='schatten'),
         E(poly_d(clip_punkt(poly, *Tf([(-7, 4), (4, 7)]), Tf([(5, 7)])[0])), '#8C9A58', o=0.5, rolle='schatten'),
         E(pfad(Tf([(-4.6, -3.8), (-5.6, 0), (-4.4, 3.4), (-3.4, 0)]), closed=False)[0], s='#E6EAB8', sw=1.0, o=0.8, rolle='licht')]
    # Same in der Mitte
    sd, _ = pfad(Tf([(0, -2.8, 'c'), (1.9, -0.6, 'c'), (1.6, 2.4, 'c'), (0, 3.4, 'c'), (-1.6, 2.4, 'c'), (-1.9, -0.6, 'c')]))
    e += [E(sd, '#93944E', s='#5E5E30', sw=0.7, rolle='detail'),
          linie(Tf([(0, -6.0), (0, -2.8)]), '#8C9A58', 0.6, 0.8),
          linie(Tf([(-2.5, 2.5), (-4.6, 4.2)]), '#A6B270', 0.5, 0.7),
          linie(Tf([(2.5, 2.5), (4.6, 4.2)]), '#A6B270', 0.5, 0.7)]
    return e


ebenen += flugnuss(88, 52, 20, 1.15)
ebenen += flugnuss(78, 36, -14, 1.05)
ebenen += flugnuss(96, 70, 34, 0.95)

speichern('bergulme', ebenen, quellen=[
    {'titel': 'Referenzfoto: Wych Elm leaf, ex Fontley', 'url': 'https://commons.wikimedia.org/wiki/File:Wych_Elm_leaf,_ex_Fontley.jpg'},
    {'titel': 'Referenzfoto: UlmusGlabra1 (Blatt und Früchte)', 'url': 'https://commons.wikimedia.org/wiki/File:UlmusGlabra1.JPG'},
    {'titel': 'Referenzfoto: Ulmus glabra fruit', 'url': 'https://commons.wikimedia.org/wiki/File:Ulmus_glabra_fruit.JPG'},
])
print('bergulme geschrieben')
