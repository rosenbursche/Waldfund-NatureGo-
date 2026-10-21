"""Gewöhnliche Esche (Fraxinus excelsior): unpaarig gefiedertes Blatt (9 gesägte Fiederblättchen),
Zweigstück mit samtig schwarzer Endknospe, Büschel zungenförmiger Flügelnüsse."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/esche')
from blatt_helfer import *  # noqa

GRUEN = ('#4A7A32', '#2A4A1C', '#7AA654')
ADER = '#B2CC84'
FR = [(2.0, -2.2), (3.1, -6), (3.0, -10), (1.9, -13.6), (0, -16.5)]
FL = [(-1.9, -13.6), (-3.0, -10), (-3.1, -6), (-2.0, -2.2)]

# Spindel (Rhachis) als quadratische Kurve
P0, P1, P2 = (36, 108), (44, 70), (60, 40)


def spindel(u):
    m = 1 - u
    x = m * m * P0[0] + 2 * m * u * P1[0] + u * u * P2[0]
    y = m * m * P0[1] + 2 * m * u * P1[1] + u * u * P2[1]
    dx = 2 * m * (P1[0] - P0[0]) + 2 * u * (P2[0] - P1[0])
    dy = 2 * m * (P1[1] - P0[1]) + 2 * u * (P2[1] - P1[1])
    return x, y, math.degrees(math.atan2(dx, -dy))


ebenen = hg_wald()
# Zweig mit schwarzer Endknospe (rechts), daran der Fruchtbüschel
ebenen.append(form(band([(106, 47), (96, 50), (86, 54)], 3.4, 2.8), '#857B6A'))
ebenen.append(E(pfad([(104, 46.2), (95, 49), (88, 52.4)], closed=False)[0], s='#B4AA96', sw=0.8, o=0.7, rolle='licht'))
# Fruchtbüschel: zungenförmige Flügelnüsse, hängend
SAM = [(0, 0, 'k'), (1.1, 1.6, 'c'), (1.7, 5.5, 'c'), (2.4, 10, 'c'), (2.3, 13.6, 'c'), (1.2, 15.8, 'c'), (-0.2, 16.2, 'c'),
       (-1.5, 15.4, 'c'), (-2.1, 12.4, 'c'), (-1.8, 8, 'c'), (-1.2, 3.8, 'c'), (-0.8, 1.2, 'c')]
HANG = (90, 52)
samaras = [(-30, 1.45, 1.5), (-14, 1.6, 2.2), (2, 1.65, 1.0), (18, 1.55, 2.4), (34, 1.4, 1.4), (-4, 1.5, 4.5), (11, 1.45, 5.0)]
stiele = []
for grad, s, ab in samaras:
    sx, sy = tf([(0, ab)], 1, grad, *HANG)[0]
    stiele.append(f'M{HANG[0]} {HANG[1]} L{r1(sx)} {r1(sy)}')
ebenen.append(E(' '.join(stiele), s='#6E5A3A', sw=0.8, rolle='detail'))
for grad, s, ab in samaras:
    ox, oy = tf([(0, ab)], 1, grad, *HANG)[0]
    T = lambda p: tf(p, s, grad, ox, oy)
    d, poly = pfad(T(SAM))
    ach = T([(0, 0), (0, 16)])
    ebenen += [form(d, '#B99A5E'),
               E(poly_d(clip_linie(poly, ach[0], ach[1], schatten_seite(ach[0], ach[1]))), '#7E6438', o=0.5, rolle='schatten'),
               E(pfad(T([(0, 1.2, 'c'), (0.8, 3.5, 'c'), (0.6, 7.5, 'c'), (0, 8.6, 'c'), (-0.6, 7.5, 'c'), (-0.8, 3.5, 'c')]))[0],
                 '#8C6E3C', o=0.9, rolle='detail'),
               linie(T([(-1.3, 5), (-1.7, 10), (-1.0, 14.6)]), '#DCC48C', 0.8, 0.7),
               linie(T([(0, 8.6), (0.2, 12), (0, 15.4)]), '#8C6E3C', 0.5, 0.7)]
# schwarze, samtige Endknospe an der Zweigspitze
kn = tf([(0, 0, 'k'), (2.8, -1.4, 'c'), (2.4, -4.2, 'c'), (0, -6.4, 'k'), (-2.4, -4.2, 'c'), (-2.8, -1.4, 'c')], 1, -64, 86.5, 54)
ebenen.append(form(pfad(kn)[0], '#211C19'))
ebenen.append(E(oval(*tf([(-0.9, -3.2)], 1, -64, 86.5, 54)[0], 0.7, 1.1), '#6E6660', o=0.8, rolle='licht'))

# Blatt: 4 Fiederpaare + Endblättchen
fieder = []
for u, gr in ((0.2, 1.25), (0.42, 1.35), (0.63, 1.4), (0.82, 1.4)):
    x, y, w = spindel(u)
    for seite in (-1, 1):
        fieder.append((x, y, w + seite * 58, gr))
x, y, w = spindel(1.0)
fieder.append((x - 0.3, y + 0.5, w, 1.45))
for x, y, g, gr in fieder:
    teile, _ = blatt(FR, FL, gr, g, x, y, GRUEN, ADER, adern=4, t0=0.18, t1=0.75,
                     saege={'abstand': 1.7, 'hoehe': 0.55, 'von': 0.18, 'bis': 0.95},
                     ader_sw=0.5, mittel_sw=0.8, ader_o=0.65, licht_o=0.4, schatten_o=0.5)
    ebenen += teile
# Spindel über den Blättchen
sp = [spindel(u / 10)[:2] for u in range(0, 11)]
ebenen.append(form(band(sp, 3.0, 1.8), '#7E9A52'))
ebenen.append(linie(sp[1:9], '#A6C278', 0.6, 0.8))

speichern('esche', ebenen, quellen=[
    {'titel': 'Referenzfoto: 2020 year. Herbarium. Fraxinus. img-001 (Fiederblatt)',
     'url': 'https://commons.wikimedia.org/wiki/File:2020_year._Herbarium._Fraxinus._img-001.jpg'},
    {'titel': 'Referenzfoto: Fraxinus excelsior-fruits (Fruchtbüschel)',
     'url': 'https://commons.wikimedia.org/wiki/File:Fraxinus_excelsior-fruits.jpg'},
])
print('esche geschrieben')
