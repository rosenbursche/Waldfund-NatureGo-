"""Zitterpappel/Espe (Populus tremula): rundes, grob buchtig gezähntes Blatt an langem, flachem Stiel + hängende graue Kätzchen."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

BLATT = ('#5E8A36', '#3C6024', '#8DB25A')
ADER = '#B4CC80'
STIEL = ('#9A5A3A', '#6A3A24', '#C08060')
ZWEIG = ('#7A6A58', '#4E4236', '#A49482')
KAETZ = ('#8E8A80', '#5E5A52', '#C9C4B6')

# rechte Blatthälfte: fast kreisrund, kurz zugespitzt, Grund breit gestutzt
RUND = [(0, 0), (0.22, 0.03), (0.42, -0.06), (0.54, -0.25), (0.56, -0.47), (0.48, -0.68), (0.32, -0.84), (0.14, -0.94), (0, -1)]

ebenen = hg_licht()
# Zweig oben rechts, daran die hängenden Kätzchen
ebenen += zweig([(106, 30), (96, 33), (82, 35)], 3.4, 2.4, ZWEIG)


def kaetzchen(x0, y0, laenge, grad, breite=4.4):
    """Hängendes, zottig behaartes Kätzchen (oben am Zweig, Spitze unten)."""
    T = lambda p: setzen(p, x0, y0, laenge, grad)
    rechts = [(0.0, 0.0), (0.42, 0.06), (0.55, 0.3), (0.52, 0.6), (0.4, 0.85), (0.16, 1.0), (0, 1.02)]
    k = [(x * breite / laenge * 2, y) for x, y in rechts]
    q = catmull(k, 6)
    # zottiger Rand: kleine Fransen
    fr = zaehne(q, 22, 0.018, vorn=0.5)
    umr = fr + [(-x, y) for x, y in reversed(fr)][1:-1]
    e = [form(glatter_pfad(T(umr)), KAETZ[0])]
    sch = [(0, 0.05)] + [(x, y) for x, y in fr if y > 0.05] + [(0, 1.0)]
    e.append(E(glatter_pfad(T(sch)), KAETZ[1], o=0.55, rolle='schatten'))
    li = [(-0.25 * breite / laenge * 2, 0.15), (-0.4 * breite / laenge * 2, 0.4), (-0.3 * breite / laenge * 2, 0.75), (-0.1 * breite / laenge * 2, 0.5)]
    e.append(E(glatter_pfad(T(li)), KAETZ[2], o=0.7, rolle='licht'))
    # Wollhaare
    d = ''
    for i in range(9):
        y = 0.1 + i * 0.095
        for sg in (-1, 1):
            a = T([(sg * 0.05 * breite / laenge * 2, y), (sg * 0.3 * breite / laenge * 2, y + 0.04)])
            d += f'M{a[0][0]} {a[0][1]} L{a[1][0]} {a[1][1]} '
    e.append(E(d.strip(), s='#E2DED2', sw=0.5, o=0.4, rolle='detail'))
    return e


for x0, y0, L, g in ((96, 33, 24, -4), (86, 35, 30, 6)):
    ebenen += zweig([(x0, y0 - 1), (x0 + 0.3, y0 + 2.5)], 1.4, 1.2, ZWEIG, licht=False)
    ebenen += kaetzchen(x0 + 0.3, y0 + 2, L, g, breite=5.0)

# langer, seitlich abgeflachter Blattstiel (gebogen, rötlich)
stiel = [(76, 102), (72, 93), (66, 84), (58, 78)]
ebenen += zweig(stiel, 2.2, 1.6, STIEL, licht=False)
# flache Stielkante (Detail: abgeflacht -> Mittellinie hell)
ebenen.append(E('M74.4 98 Q70 88 60.4 80', s=STIEL[2], sw=0.6, o=0.8, rolle='detail'))

# Blattspreite
ebenen += blatt(RUND, 58, 78, 42, -30, BLATT, n_zaehne=11, amp=0.045, adern=4, schatten_seite=1,
                links_skala=0.96, ader_neigung=0.16, glatt=True, ader_farbe=ADER, zahn_vorn=0.5)
# zwei kräftige Grundadern (Espe: handförmig-fiedrig)
for sg in (1, -1):
    p = setzen([(0, -0.02), (sg * 0.2, -0.1), (sg * 0.4, -0.3)], 58, 78, 42, -30)
    ebenen.append(E(f'M{p[0][0]} {p[0][1]} Q{p[1][0]} {p[1][1]} {p[2][0]} {p[2][1]}', s=ADER, sw=0.8, o=0.8, rolle='detail'))

speichern('zitterpappel', ebenen, quellen=[
    {'titel': 'Referenzfoto: 2020 year. Herbarium. Populus tremula. img-003.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:2020_year._Herbarium._Populus_tremula._img-003.jpg'},
    {'titel': 'Referenzfoto: 2020 year. Herbarium. Populus tremula. img-011.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:2020_year._Herbarium._Populus_tremula._img-011.jpg'},
])
print('zitterpappel geschrieben')
