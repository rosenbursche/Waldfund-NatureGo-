"""Schopf-Tintling (Coprinus comatus) – Icon. Aufruf aus dem Projektordner:
python3 recherche/icons/tintling/zeichne.py"""
import sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

WEISS, WEISS_D, WEISS_H = '#EFEBE0', '#C3BCAB', '#FBF9F3'
SCHEITEL = '#D6C29C'
SCHUPPE = '#9A8064'
TINTE, TINTE_H = '#2A2226', '#5B4E56'

def schuppen(cx, top, unten, breite, reihen, n, saat=3):
    """abstehende, zerrissene Schuppen in unregelmäßig versetzten Reihen (oben bräunlicher, unten heller)"""
    import random
    rnd = random.Random(saat)
    dunkel, hell = '', ''
    for r in range(reihen):
        y0 = top + (unten - top) * (r + 0.5) / reihen
        t = (y0 - top) / (unten - top)
        b = breite * min(1, 0.7 + 0.5 * t)
        k = n + (1 if r % 2 else 0)
        for i in range(k):
            x = cx - b / 2 + b * (i + 0.5) / k + rnd.uniform(-1.2, 1.2)
            if abs(x - cx) > b / 2 - 1.2:
                continue
            y = y0 + rnd.uniform(-1, 1)
            w = rnd.uniform(2.2, 3.2) * (1 if x < cx else -1) * (0.6 + 0.4 * (1 - abs(x - cx) / (b / 2)))
            h = rnd.uniform(1.8, 2.8)
            stueck = f' M{x:.1f} {y - h:.1f} c{w*0.2:.1f} {h*0.7:.1f} {w*0.6:.1f} {h*1.1:.1f} {w:.1f} {h*1.2:.1f}'
            if r < reihen * 0.45:
                dunkel += stueck
            else:
                hell += stueck
    return dunkel.strip(), hell.strip()

def tintling(cx, top, unten, b, stiel_unten, ring_y, tinte=True):
    l, r = cx - b / 2, cx + b / 2
    teile = [
        # schlanker, weißer Stiel mit schmalem Ring
        form(f'M{cx-3.6} {unten-2} C{cx-3.8} {unten+8} {cx-4.2} {stiel_unten-6} {cx-5} {stiel_unten} L{cx+5} {stiel_unten} C{cx+4.2} {stiel_unten-6} {cx+3.8} {unten+8} {cx+3.6} {unten-2} Z', WEISS),
        E(f'M{cx+1.2} {unten} C{cx+1.6} {unten+8} {cx+2} {stiel_unten-6} {cx+2.4} {stiel_unten} L{cx+5} {stiel_unten} C{cx+4.2} {stiel_unten-6} {cx+3.8} {unten+8} {cx+3.6} {unten-2} Z', WEISS_D, rolle='schatten'),
        form(f'M{cx-4.6} {ring_y} C{cx-2} {ring_y+1.2} {cx+2} {ring_y+1.2} {cx+4.6} {ring_y} L{cx+4.8} {ring_y+1.5} C{cx+2} {ring_y+2.6} {cx-2} {ring_y+2.6} {cx-4.8} {ring_y+1.5} Z', WEISS),
        # hoher, walzenförmiger Hut
        form(f'M{l} {unten} C{l-0.6} {top+(unten-top)*0.45} {l+1.2} {top+5} {cx-b*0.2} {top+0.8} C{cx-b*0.08} {top-0.6} {cx+b*0.08} {top-0.6} {cx+b*0.2} {top+0.8} C{r-1.2} {top+5} {r+0.6} {top+(unten-top)*0.45} {r} {unten} C{cx+b*0.25} {unten+2.4} {cx-b*0.25} {unten+2.4} {l} {unten} Z', WEISS),
        E(f'M{cx+b*0.18} {top+3} C{r-2} {top+8} {r} {top+(unten-top)*0.45} {r} {unten} C{cx+b*0.3} {unten+2} {cx+b*0.15} {unten+2.2} {cx+b*0.1} {unten+2.3} C{cx+b*0.3} {top+(unten-top)*0.6} {cx+b*0.3} {top+12} {cx+b*0.18} {top+3} Z', WEISS_D, o=0.85, rolle='schatten'),
        E(f'M{l+2} {unten-8} C{l+1} {top+(unten-top)*0.45} {l+2.5} {top+7} {cx-b*0.12} {top+2.4} C{l+5} {top+10} {l+3.6} {top+(unten-top)*0.5} {l+4} {unten-10} Z', WEISS_H, o=0.9, rolle='licht'),
        # glatter, ockerfarbener Scheitel
        E(f'M{cx-b*0.2} {top+1.2} C{cx-b*0.08} {top-0.2} {cx+b*0.08} {top-0.2} {cx+b*0.2} {top+1.2} C{cx+b*0.24} {top+3.6} {cx-b*0.24} {top+3.6} {cx-b*0.2} {top+1.2} Z', SCHEITEL, rolle='detail'),
    ]
    dunkel, hell = schuppen(cx, top + 4, unten - (6 if tinte else 2), b - 2, 7 if tinte else 5, 4 if b > 20 else 3, saat=int(cx))
    teile += [E(dunkel, s=SCHUPPE, sw=0.9, o=0.9, rolle='detail'), E(hell, s='#B3A48E', sw=0.8, o=0.85, rolle='detail')]
    if tinte:
        # Rand färbt sich schwarz und zerfließt zu Tinte (Tropfen)
        teile += [
            # Übergang: der Hut wird zum Rand hin rosa-grau
            E(f'M{l-0.1} {unten-12} C{cx-b*0.25} {unten-9} {cx+b*0.25} {unten-9} {r+0.1} {unten-12} L{r+0.2} {unten-4} C{cx+b*0.25} {unten-2} {cx-b*0.25} {unten-2} {l-0.2} {unten-4} Z', '#A8969C', o=0.45, rolle='schatten'),
            form(f'M{l-0.2} {unten-5} C{cx-b*0.25} {unten-2.6} {cx+b*0.25} {unten-2.6} {r+0.2} {unten-5} L{r} {unten} C{r-0.6} {unten+2} {r-1.4} {unten+4.4} {r-2.2} {unten+5.6} C{r-3} {unten+4.4} {r-3.4} {unten+3} {r-4.4} {unten+2.4} C{cx+2} {unten+3} {cx+1} {unten+6.6} {cx-0.2} {unten+7.4} C{cx-1.4} {unten+6.6} {cx-1.6} {unten+3.6} {cx-3} {unten+2.6} C{l+5} {unten+2.4} {l+3.6} {unten+4.2} {l+2.6} {unten+4.6} C{l+1.6} {unten+3.6} {l+0.6} {unten+2} {l} {unten} Z', TINTE),
            E(f'M{l+1} {unten-3.6} C{cx-b*0.22} {unten-1.6} {cx-2} {unten-1.4} {cx-0.4} {unten-1.3} C{cx-2} {unten-0.2} {l+4} {unten-0.4} {l+1.2} {unten-2} Z', TINTE_H, o=0.8, rolle='licht'),
            E(f'M{l+1} {unten-6.5} q2 2 4.5 2.4 M{cx+3} {unten-4.4} q3 0.4 6 -1 M{cx-5} {unten-4.6} q2 0.8 4 0.6', s='#8C7F86', sw=0.8, o=0.8, rolle='detail'),
        ]
    else:
        teile.append(E(f'M{l+0.6} {unten-2.4} C{cx-b*0.25} {unten} {cx+b*0.25} {unten} {r-0.6} {unten-2.4} L{r} {unten} C{cx+b*0.25} {unten+2.4} {cx-b*0.25} {unten+2.4} {l} {unten} Z', '#B9A9AE', o=0.9, rolle='schatten'))
    return teile

ebenen = hg_boden() + tintling(77, 47, 77, 15, 97, 90, tinte=False) + tintling(50, 24, 74, 25, 99, 90)

speichern('tintling', ebenen, quellen=[
    {'titel': 'Referenzfoto Coprinus comatus LC0117 – Jörg Hempel, CC BY-SA 2.0 de', 'url': 'https://commons.wikimedia.org/wiki/File:Coprinus_comatus_LC0117.jpg'},
    {'titel': "Referenzfoto 'Lawyers Wig'. Coprinus comatus – gailhampshire, CC BY 2.0", 'url': 'https://commons.wikimedia.org/wiki/File:%27Lawyers_Wig%27._Coprinus_comatus_-_Flickr_-_gailhampshire.jpg'},
    {'titel': 'Referenzfoto Coprinus comatus 103107960 – Riccardo Riva, CC BY 4.0', 'url': 'https://commons.wikimedia.org/wiki/File:Coprinus_comatus_103107960.jpg'},
])
