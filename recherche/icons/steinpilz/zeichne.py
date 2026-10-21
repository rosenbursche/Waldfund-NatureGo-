"""Fichten-Steinpilz (Boletus edulis) – Icon. Aufruf aus dem Projektordner:
python3 recherche/icons/steinpilz/zeichne.py"""
import sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

HUT, HUT_D, HUT_H = '#8C5732', '#5A341C', '#B88252'
SAUM = '#E3D3AE'
ROEHR, ROEHR_D = '#D9D19A', '#A9A06A'
STIEL, STIEL_D, NETZ = '#E2D5B6', '#B9A784', '#F7F1E2'

def netz(cx, y0, y1, breite_fn):
    """feine weiße Netzzeichnung auf dem oberen Stiel"""
    d = ''
    y = y0
    reihe = 0
    while y < y1:
        b = breite_fn(y) - 3
        n = max(3, int(b / 3.4))
        for i in range(n):
            x = cx - b / 2 + b * (i + (0.5 if reihe % 2 else 0)) / n
            d += f' M{x:.1f} {y:.1f} l1.5 1.7 l-1.5 1.7 l-1.5 -1.7 Z'
        y += 1.7
        reihe += 1
    return d.strip()

def steinpilz(cx, hut_y, rx, h, stiel_oben, stiel_bauch, stiel_unten, unten):
    """hut_y = Unterkante des Huts; Stiel bauchig: Breite oben, am Bauch, am Fuß"""
    bauch_y = hut_y + (unten - hut_y) * 0.64
    so, sb, su = stiel_oben / 2, stiel_bauch / 2, stiel_unten / 2
    stiel = (f'M{cx-so} {hut_y} C{cx-so-2} {hut_y+(bauch_y-hut_y)*0.4} {cx-sb} {bauch_y-7} {cx-sb} {bauch_y} '
             f'C{cx-sb} {bauch_y+6} {cx-su-1.5} {unten-3} {cx-su} {unten-0.8} C{cx-su*0.5} {unten+1} {cx+su*0.5} {unten+1} {cx+su} {unten-0.8} '
             f'C{cx+su+1.5} {unten-3} {cx+sb} {bauch_y+6} {cx+sb} {bauch_y} C{cx+sb} {bauch_y-7} {cx+so+2} {hut_y+(bauch_y-hut_y)*0.4} {cx+so} {hut_y} Z')
    stiel_sch = (f'M{cx+so*0.35} {hut_y} C{cx+so*0.6} {hut_y+(bauch_y-hut_y)*0.5} {cx+sb*0.5} {bauch_y-6} {cx+sb*0.5} {bauch_y} '
                 f'C{cx+sb*0.5} {bauch_y+5} {cx+su*0.4} {unten-2} {cx+su*0.4} {unten} L{cx+su} {unten} '
                 f'C{cx+su+1} {unten-2} {cx+sb} {bauch_y+5} {cx+sb} {bauch_y} C{cx+sb} {bauch_y-6} {cx+so+1} {hut_y+(bauch_y-hut_y)*0.5} {cx+so} {hut_y} Z')
    stiel_li = (f'M{cx-so+1.6} {hut_y+4} C{cx-so} {hut_y+(bauch_y-hut_y)*0.5} {cx-sb+2} {bauch_y-6} {cx-sb+2.2} {bauch_y+2} '
                f'C{cx-sb+4.5} {bauch_y-4} {cx-so+3} {hut_y+(bauch_y-hut_y)*0.5} {cx-so+1.6} {hut_y+4} Z')
    def breite(y):
        t = (y - hut_y) / (bauch_y - hut_y)
        return stiel_oben + (stiel_bauch - stiel_oben) * min(1, t) ** 1.4
    teile = [form(stiel, STIEL), E(stiel_sch, STIEL_D, o=0.85, rolle='schatten'), E(stiel_li, NETZ, o=0.7, rolle='licht'),
             E(netz(cx, hut_y + 2, hut_y + (bauch_y - hut_y) * 0.5, breite), s=NETZ, sw=0.5, o=0.75, rolle='detail'),
             E(f'M{cx-sb*0.6} {bauch_y+2} q1 4 0.4 8 M{cx-sb*0.15} {bauch_y-3} q0.6 5 0 10', s=STIEL_D, sw=0.6, o=0.6, rolle='detail')]
    # Röhrenschicht (Unterseite des Huts, schwammig, gelblich)
    teile += [form(f'M{cx-rx+1.5} {hut_y-3} C{cx-rx*0.6} {hut_y+4.2} {cx+rx*0.6} {hut_y+4.2} {cx+rx-1.5} {hut_y-3} '
                   f'C{cx+rx*0.5} {hut_y+0.4} {cx-rx*0.5} {hut_y+0.4} {cx-rx+1.5} {hut_y-3} Z', ROEHR)]
    teile += [E(f'M{cx+rx*0.25} {hut_y+0.9} C{cx+rx*0.55} {hut_y+0.4} {cx+rx*0.8} {hut_y-1} {cx+rx-1.5} {hut_y-3} '
                f'C{cx+rx*0.5} {hut_y+0.4} {cx+rx*0.35} {hut_y+0.2} {cx+rx*0.25} {hut_y+0.9} Z', ROEHR_D, o=0.8, rolle='schatten')]
    poren = ' '.join(f'M{cx - rx*0.7 + rx*1.4*i/9:.1f} {hut_y - 0.4 + 2.4*(1-((2*i/9-1)**2)):.1f} l0.6 0' for i in range(10))
    teile += [E(poren, s=ROEHR_D, sw=0.8, rolle='detail')]
    # polsterförmiger, brauner Hut mit hellem Saum
    top = hut_y - h
    teile += [
        form(f'M{cx-rx} {hut_y-2.6} C{cx-rx-0.6} {top+h*0.35} {cx-rx*0.6} {top} {cx} {top} C{cx+rx*0.6} {top} {cx+rx+0.6} {top+h*0.35} {cx+rx} {hut_y-2.6} '
             f'C{cx+rx*0.6} {hut_y+0.6} {cx-rx*0.6} {hut_y+0.6} {cx-rx} {hut_y-2.6} Z', HUT),
        E(f'M{cx-rx} {hut_y-2.6} C{cx-rx*0.6} {hut_y+0.6} {cx+rx*0.6} {hut_y+0.6} {cx+rx} {hut_y-2.6} C{cx+rx+0.4} {top+h*0.5} {cx+rx*0.85} {top+h*0.25} {cx+rx*0.7} {top+h*0.15} '
          f'C{cx+rx*0.8} {top+h*0.6} {cx+rx*0.3} {hut_y-4} {cx} {hut_y-4} C{cx-rx*0.5} {hut_y-4} {cx-rx*0.8} {hut_y-5} {cx-rx} {hut_y-2.6} Z', HUT_D, o=0.75, rolle='schatten'),
        E(f'M{cx-rx*0.78} {top+h*0.5} C{cx-rx*0.7} {top+h*0.15} {cx-rx*0.35} {top+0.8} {cx-rx*0.05} {top+0.9} C{cx-rx*0.35} {top+h*0.25} {cx-rx*0.55} {top+h*0.4} {cx-rx*0.66} {top+h*0.68} Z', HUT_H, o=0.85, rolle='licht'),
        E(f'M{cx-rx*0.95} {hut_y-2.4} C{cx-rx*0.55} {hut_y+0.4} {cx+rx*0.55} {hut_y+0.4} {cx+rx*0.95} {hut_y-2.4}', s=SAUM, sw=0.9, o=0.85, rolle='detail'),
    ]
    return teile

ebenen = hg_boden() + steinpilz(83, 68, 12, 10, 10, 18, 13, 97) + steinpilz(52, 56, 25, 24, 17, 29, 19, 99) + [
    # ein paar Fichtennadeln am Fuß
    E('M38 99.5 l7 -2.4 M70 100 l6.5 1.6 M64 97.6 l5 -3', s='#7A5A34', sw=0.9, rolle='detail'),
]

speichern('steinpilz', ebenen, quellen=[
    {'titel': 'Referenzfoto Boletus edulis 1 – Michael Wood, CC BY-SA 3.0', 'url': 'https://commons.wikimedia.org/wiki/File:Boletus_edulis_1.jpg'},
    {'titel': 'Referenzfoto AD2009Sep13 Boletus edulis 01 – Bernie, gemeinfrei', 'url': 'https://commons.wikimedia.org/wiki/File:AD2009Sep13_Boletus_edulis_01.jpg'},
    {'titel': 'Referenzfoto Boletus-edulis-296 – Mars 2002, CC BY-SA 3.0', 'url': 'https://commons.wikimedia.org/wiki/File:Boletus-edulis-296.jpg'},
])
