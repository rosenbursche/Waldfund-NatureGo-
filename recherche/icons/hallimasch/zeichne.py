"""Hallimasch (Armillaria mellea) – Icon: Büschel am Stumpf. Aufruf aus dem Projektordner:
python3 recherche/icons/hallimasch/zeichne.py"""
import random
import sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

HUT, HUT_D, HUT_H, HUT_M = '#C79E45', '#8A6A2A', '#E2C67A', '#6E5226'
SCHUPPE = '#4E3A1C'
LAM, LAM_D = '#EDE3C8', '#C2B48E'
STIEL, STIEL_D, STIEL_U = '#DCCBA0', '#AE9A6C', '#8E7346'
RING = '#F2EAD2'
HOLZ, HOLZ_D, HOLZ_H = '#6E5436', '#46331F', '#8E7149'

def pfad(pts):
    return bez(pts[0], pts[1:])

def stiel(oben, unten, b_oben, b_unten, kurve):
    (x1, y1), (x2, y2) = oben, unten
    mx, my = (x1 + x2) / 2 + kurve, (y1 + y2) / 2
    d = (f'M{x1-b_oben/2} {y1} C{mx-b_oben/2} {my} {x2-b_unten/2} {y2-6} {x2-b_unten/2} {y2} '
         f'L{x2+b_unten/2} {y2} C{x2+b_unten/2} {y2-6} {mx+b_oben/2} {my} {x1+b_oben/2} {y1} Z')
    sch = (f'M{x1+b_oben*0.1} {y1} C{mx+b_oben*0.1} {my} {x2+b_unten*0.1} {y2-6} {x2+b_unten*0.1} {y2} '
           f'L{x2+b_unten/2} {y2} C{x2+b_unten/2} {y2-6} {mx+b_oben/2} {my} {x1+b_oben/2} {y1} Z')
    # Fasern längs am Stiel
    fas = f'M{x1-b_oben*0.2} {y1+5} C{mx-b_oben*0.2} {my} {x2-b_unten*0.2} {y2-8} {x2-b_unten*0.2} {y2-3}'
    return [form(d, STIEL), E(sch, STIEL_D, o=0.8, rolle='schatten'), E(fas, s=STIEL_D, sw=0.6, o=0.7, rolle='detail')]

def ring(x, y, b):
    # weißlich-gelbe, häutige Manschette direkt unter dem Hut
    return [form(f'M{x-b/2-0.6} {y} C{x-b/4} {y+1.4} {x+b/4} {y+1.4} {x+b/2+0.6} {y} L{x+b/2+1.2} {y+2.4} C{x+b/4} {y+3.8} {x-b/4} {y+3.8} {x-b/2-1.2} {y+2.4} Z', RING),
            E(f'M{x+b/4} {y+1.6} C{x+b/2} {y+1.2} {x+b/2+0.8} {y+1.4} {x+b/2+1.2} {y+2.4} C{x+b/3} {y+3.4} {x+b/4} {y+3.2} {x+b/4} {y+1.6} Z', LAM_D, rolle='schatten')]

def hut(cx, cy, rx, h, grad, saat):
    """flach gewölbter, honiggelber Hut, leicht von unten gesehen (Lamellen sichtbar)"""
    D = lambda pts: dreh([(x - cx, y - cy) for x, y in pts], cx, cy, grad)
    lam = D([(cx-rx+1, cy), (cx-rx*0.6, cy+h*0.48), (cx+rx*0.6, cy+h*0.48), (cx+rx-1, cy),
             (cx+rx*0.5, cy+h*0.2), (cx-rx*0.5, cy+h*0.2), (cx-rx+1, cy)])
    kappe = D([(cx-rx, cy+0.6), (cx-rx*0.92, cy-h*0.5), (cx-rx*0.6, cy-h), (cx, cy-h),
               (cx+rx*0.6, cy-h), (cx+rx*0.92, cy-h*0.5), (cx+rx, cy+0.6),
               (cx+rx*0.5, cy+h*0.28), (cx-rx*0.5, cy+h*0.28), (cx-rx, cy+0.6)])
    schatten = D([(cx-rx+1, cy-1), (cx-rx*0.4, cy+h*0.1), (cx+rx*0.4, cy+h*0.1), (cx+rx, cy-h*0.55),
                  (cx+rx+0.2, cy-h*0.1), (cx+rx, cy), (cx+rx, cy+0.6),
                  (cx+rx*0.5, cy+h*0.28), (cx-rx*0.5, cy+h*0.28), (cx-rx+1, cy-1)])
    licht = D([(cx-rx*0.85, cy-h*0.35), (cx-rx*0.7, cy-h*0.8), (cx-rx*0.35, cy-h*0.98), (cx-rx*0.05, cy-h*0.95),
               (cx-rx*0.4, cy-h*0.8), (cx-rx*0.65, cy-h*0.62), (cx-rx*0.85, cy-h*0.45)])
    mitte = D([(cx-rx*0.42, cy-h*0.82), (cx-rx*0.3, cy-h*1.02), (cx+rx*0.3, cy-h*1.02), (cx+rx*0.42, cy-h*0.82),
               (cx+rx*0.3, cy-h*0.62), (cx-rx*0.3, cy-h*0.62), (cx-rx*0.42, cy-h*0.82)])
    rnd = random.Random(saat)
    sch = ''
    for _ in range(int(rx * 1.6)):
        # dunkle Schüppchen, zur Hutmitte dichter
        r = rnd.random() ** 1.6
        a = rnd.uniform(0, 2 * math.pi)
        x, y = cx + math.cos(a) * rx * 0.66 * r, cy - h * 0.78 + math.sin(a) * h * 0.26 * r
        (px, py), = D([(x, y)])
        sch += f' M{px:.1f} {py:.1f} l{rnd.uniform(0.6, 1.2):.1f} {rnd.uniform(-0.3, 0.4):.1f}'
    # gerieft-heller Rand
    rand = ''
    for i in range(1, 8):
        t = i / 8
        x = cx - rx + 2 * rx * t
        ya = cy - h * 0.12 - (h * 0.3) * (1 - (2 * t - 1) ** 2)
        (a1, b1), (a2, b2) = D([(x, cy + h * 0.14 * (1 - (2 * t - 1) ** 2)), (x, ya)])
        rand += f' M{a1} {b1} L{a2} {b2}'
    lamellen = ''
    for i in range(1, 7):
        t = i / 7
        (a1, b1), (a2, b2) = D([(cx - rx * 0.4 + rx * 0.8 * t, cy + h * 0.24), (cx - rx * 0.9 + rx * 1.8 * t, cy + h * 0.38)])
        lamellen += f' M{a1} {b1} L{a2} {b2}'
    return [form(pfad(lam), LAM), E(lamellen.strip(), s=LAM_D, sw=0.6, rolle='detail'),
            form(pfad(kappe), HUT), E(pfad(schatten), HUT_D, o=0.75, rolle='schatten'),
            E(pfad(mitte), HUT_M, o=0.7, rolle='schatten'), E(pfad(licht), HUT_H, o=0.85, rolle='licht'),
            E(rand.strip(), s=HUT_D, sw=0.5, o=0.6, rolle='detail'),
            E(sch.strip(), s=SCHUPPE, sw=1.1, o=0.9, rolle='detail')]

FUSS = (60, 95)
ebenen = hg_boden() + [
    # Stumpf / morsches Holz, an dem das Büschel wächst
    form('M36 102 C37 95 44 91.5 52 91 C58 90.6 66 90.6 72 91.2 C80 92 85 96 86 102 Z', HOLZ),
    E('M70 92 C78 93 83.5 96.5 84.6 102 L86 102 C85 96 80 92 72 91.2 Z', HOLZ_D, rolle='schatten'),
    E('M42 96 C46 93.4 52 92.4 58 92.2 C52 93.6 47 95 44 97 Z', HOLZ_H, o=0.8, rolle='licht'),
    E('M45 99 q5 -2 10 -1 M62 98 q6 -1.6 12 0.4 M52 95.6 q4 -1 8 -0.4', s=HOLZ_D, sw=0.7, rolle='detail'),
]
# hinterer, großer Pilz (Mitte)
ebenen += stiel((62, 40), (61, 94), 6.8, 8.4, 2) + ring(62, 42, 6.8) + hut(62, 35, 18, 11, -3, 1)
# rechter Pilz
ebenen += stiel((81, 56), (66, 94), 6, 7.4, 3) + ring(81, 58, 6) + hut(82, 52, 15.5, 9.5, 12, 2)
# linker Pilz
ebenen += stiel((39, 55), (55, 94), 6.2, 7.6, -2) + ring(39, 57, 6.2) + hut(38, 50, 16.5, 10, -12, 3)
# junger, kleiner Pilz vorn
ebenen += stiel((53, 77), (58, 95), 5, 6, -1) + hut(52.5, 74, 10, 7.5, -6, 4)
ebenen += [E('M48 95.4 C54 93.8 66 93.8 72 95.4', s=STIEL_U, sw=1.4, o=0.7, rolle='detail')]

speichern('hallimasch', ebenen, quellen=[
    {'titel': 'Referenzfoto Armillaria mellea 041031w – CC BY-SA 3.0', 'url': 'https://commons.wikimedia.org/wiki/File:Armillaria_mellea_041031w.jpg'},
    {'titel': 'Referenzfoto Armillaria mellea 2011 G1 – George Chernilevsky, gemeinfrei', 'url': 'https://commons.wikimedia.org/wiki/File:Armillaria_mellea_2011_G1.jpg'},
    {'titel': "Referenzfoto Armillaria mellea, Honey Fungus, Enfield – Stu's Images, CC BY-SA 3.0", 'url': 'https://commons.wikimedia.org/wiki/File:Armillaria_mellea,_Honey_Fungus,_Enfield,_UK.jpg'},
])
