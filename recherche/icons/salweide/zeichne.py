"""Salweide (Salix caprea): dicke silbrige Palmkätzchen (männlich mit gelben Staubbeuteln) am rotbraunen Zweig + breit-elliptisches, runzliges Blatt mit grau-filziger Unterseite."""
import sys, math, random
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

BLATT = ('#5E7E44', '#3C5A2C', '#89A66A')
UNTEN = ('#A9AFA0', '#7C8276', '#D2D6CA')     # grau-filzig
ADER = '#B6C69A'
ZWEIG = ('#6E3A2A', '#45221A', '#9A5A44')     # dunkel rotbraun
SILBER = ('#D8D4CA', '#9E998E', '#F4F2EC')
GELB = ('#E2C24A', '#A88A26', '#F6E08A')

ELL = [(0, 0), (0.18, -0.05), (0.31, -0.2), (0.35, -0.42), (0.31, -0.64), (0.2, -0.82), (0.08, -0.95), (0, -1)]

ebenen = hg_licht()
# grau-filzige Unterseite: zweites Blatt dahinter, umgedreht
ebenen += blatt(ELL, 58, 70, 30, 195, UNTEN, n_zaehne=9, amp=0.02, adern=5, schatten_seite=-1, glatt=True,
                ader_farbe='#E6E8E0', ader_neigung=0.12)
# Hauptzweig
zw = [(20, 88), (40, 76), (60, 64), (78, 53), (92, 46)]
ebenen += zweig(zw, 3.6, 2.4, ZWEIG)
# Blatt oberseits, runzlig: viele, eng stehende Adern + Querfältchen
ebenen += blatt(ELL, 62, 66, 32, 128, BLATT, n_zaehne=9, amp=0.02, adern=8, schatten_seite=1, glatt=True,
                ader_farbe=ADER, ader_neigung=0.1)
d = ''
random.seed(3)
for i in range(12):
    y = -0.15 - i * 0.06
    for sg in (-1, 1):
        x0 = sg * (0.05 + random.uniform(0, 0.05))
        p = setzen([(x0, y), (x0 + sg * 0.08, y - 0.03)], 62, 66, 32, 128)
        d += f'M{p[0][0]} {p[0][1]} L{p[1][0]} {p[1][1]} '
ebenen.append(E(d.strip(), s=BLATT[1], sw=0.5, o=0.55, rolle='detail'))


def kaetzchen(cx, cy, L, W, grad, maennlich):
    """Eiförmiges Palmkätzchen, Basis am Zweig, Spitze in Richtung grad (0 = oben)."""
    T = lambda p: setzen(p, cx, cy, L, grad)
    w = W / L
    rechts = [(0, 0.04), (w * 0.35, 0.02), (w * 0.48, -0.25), (w * 0.5, -0.55), (w * 0.4, -0.82), (w * 0.2, -0.97), (0, -1)]
    q = catmull(rechts, 6)
    fr = zaehne(q, 16, 0.025, vorn=0.5)
    umr = fr + [(-x, y) for x, y in reversed(fr)][1:-1]
    e = [form(glatter_pfad(T(umr)), SILBER[0])]
    e.append(E(glatter_pfad(T([(0, 0)] + [p for p in fr] )), SILBER[1], o=0.45, rolle='schatten'))
    e.append(E(glatter_pfad(T([(-w * 0.12, -0.2), (-w * 0.36, -0.45), (-w * 0.28, -0.8), (-w * 0.06, -0.6)])), SILBER[2], o=0.85, rolle='licht'))
    # seidige Härchen
    dd = ''
    for i in range(6):
        y = -0.15 - i * 0.13
        a = T([(-w * 0.3, y), (-w * 0.42, y - 0.05)]); b = T([(w * 0.3, y), (w * 0.42, y - 0.05)])
        dd += f'M{a[0][0]} {a[0][1]} L{a[1][0]} {a[1][1]} M{b[0][0]} {b[0][1]} L{b[1][0]} {b[1][1]} '
    e.append(E(dd.strip(), s='#FFFFFF', sw=0.5, o=0.5, rolle='detail'))
    if maennlich:
        # gelbe Staubbeutel auf Stielchen, von der Spitze her aufgeblüht
        random.seed(int(cx * 7 + cy))
        for i in range(34):
            yy = -0.97 + random.uniform(0, 0.8)
            br = halb_breite(rechts, yy) * 1.0
            xx = random.uniform(-br, br)
            px, py = T([(xx, yy)])[0]
            e.append(E(kreis(px, py, 1.0), GELB[0], s=GELB[1], sw=0.4, rolle='detail'))
            e.append(E(kreis(round(px - 0.3, 1), round(py - 0.3, 1), 0.4), GELB[2], o=0.9, rolle='detail'))
    # Knospenschuppe am Grund
    bs = T([(-w * 0.26, 0.03), (0, -0.08), (w * 0.26, 0.03), (0, 0.09)])
    e.append(form(glatter_pfad(bs), ZWEIG[2]))
    return e


for cx, cy, L, W, g, m in ((40, 75, 21, 14, -28, False), (58, 63, 23, 15, 8, True), (78, 52, 22, 15, -14, False),
                           (85, 49, 17, 12, 40, True)):
    ebenen += kaetzchen(cx, cy, L, W, g, m)

speichern('salweide', ebenen, quellen=[
    {'titel': 'Referenzfoto: Salix caprea goat willow.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Salix_caprea_goat_willow.jpg'},
    {'titel': 'Referenzfoto: Salix caprea 006.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Salix_caprea_006.jpg'},
])
print('salweide geschrieben')
