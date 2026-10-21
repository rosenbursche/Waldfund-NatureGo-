"""Krause-Glucke-Icon: krauser, cremegelber Ballen aus gewellten Lappen am Kiefernstumpf."""
import math, random, sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

def glatt(pts):
    n = len(pts); r = lambda v: round(v, 1)
    d = f'M{r(pts[0][0])} {r(pts[0][1])}'
    for i in range(n):
        p0, p1, p2, p3 = pts[(i-1) % n], pts[i], pts[(i+1) % n], pts[(i+2) % n]
        c1 = (p1[0] + (p2[0]-p0[0])/6, p1[1] + (p2[1]-p0[1])/6)
        c2 = (p2[0] - (p3[0]-p1[0])/6, p2[1] - (p3[1]-p1[1])/6)
        d += f' C{r(c1[0])} {r(c1[1])} {r(c2[0])} {r(c2[1])} {r(p2[0])} {r(p2[1])}'
    return d + ' Z'

G, G_D, G_H, KANTE = '#E6C98C', '#A8854E', '#F4E2B4', '#9A7444'
RINDE, RINDE_D, HOLZ = '#7A5038', '#43291C', '#B48E64'
# Rosetten (Teilballen) von hinten nach vorn
ROSETTEN = [(48, 50, 11.5), (64, 46, 12.5), (79, 55, 10.5), (37, 66, 11), (57, 63, 14), (76, 70, 12),
            (46, 83, 12.5), (65, 85, 13)]

def rosette_umriss(cx, cy, r, phase):
    pts = []
    for i in range(54):
        t = 2 * math.pi * i / 54
        w = 1 + 0.08 * math.sin(9 * t + phase) + 0.04 * math.sin(5 * t + phase * 2)
        pts.append((cx + r * w * math.cos(t), min(cy + r * 0.9 * w * math.sin(t), 98.5)))
    return glatt(pts)

def welle(x, y, b, h=1.9, n=4):
    """kurze, krause Lappenkante (gewellte Linie)"""
    st = b / n
    d = f'M{round(x - b/2,1)} {round(y,1)}'
    for i in range(n):
        d += f' q{round(st/2,1)} {round(-h if i % 2 == 0 else h,1)} {round(st,1)} 0'
    return d

random.seed(3)
ebenen = hg_boden() + [
    # Kiefernstumpf dahinter (Hintergrund, ohne Kontur)
    E('M70 100 L71 40 C71 35 99 35 99 40 L99 100 Z', RINDE, rolle='detail'),
    E(oval(85, 39, 14, 4.2), HOLZ, rolle='detail'),
    E(oval(85, 39, 8, 2.2), '#8A6A48', o=0.7, rolle='detail'),
    E('M75 44 l-0.6 10 M81 45 l0.8 9 M93 44 l-0.5 12 M88 46 l0.6 8', s=RINDE_D, sw=1.2, o=0.8, rolle='detail'),
    E('M74 50 h5 M84 48 h6 M90 56 h6', s='#9A6446', sw=1.1, o=0.7, rolle='detail'),
    E('M92 42 L99 42 L99 100 L92 100 Z', RINDE_D, o=0.45, rolle='detail'),
    # Kiefernnadeln am Boden
    E('M22 95 l9 -3 M27 98 l8 1.5 M86 97 l10 -2 M89 99 l7 -4', s='#9C7A4C', sw=0.9, rolle='detail'),
]
def wackel(cx, cy, r, phase, t):
    return r * (1 + 0.08 * math.sin(9 * t + phase) + 0.04 * math.sin(5 * t + phase * 2))
def drinnen(x, y, rand=0.0):
    for j, (cx, cy, r) in enumerate(ROSETTEN):
        t = math.atan2((y - cy) / 0.9, x - cx)
        if y <= 98.5 - rand and ((x - cx) ** 2 + ((y - cy) / 0.9) ** 2) ** 0.5 <= wackel(cx, cy, r, j * 1.7, t) - rand:
            return True
    return False
# gemeinsamer Außenumriss: je Richtung der äußerste Punkt, der noch im Ballen liegt
M = (59, 68); aussen = []
for i in range(120):
    t = 2 * math.pi * i / 120
    d = max(dd * 0.4 for dd in range(1, 120) if drinnen(M[0] + dd * 0.4 * math.cos(t), M[1] + dd * 0.4 * math.sin(t)))
    aussen.append((M[0] + d * math.cos(t), M[1] + d * math.sin(t)))
ebenen.append(form(glatt(aussen), G))
ebenen.append(E('M88 60 C90 78 80 94 60 97 C44 98 32 94 26 84 C40 90 58 90 70 84 C80 78 86 70 88 60 Z', G_D, o=0.5, rolle='schatten'))

def wellring(cx, cy, r, phase, freq=11, amp=0.13):
    """unregelmäßig gewellter Ring (krause Lappenkante)"""
    pts = []
    for i in range(66):
        t = 2 * math.pi * i / 66
        w = 1 + amp * (0.6 * math.sin(freq * t + phase) + 0.5 * math.sin((freq - 4) * t + phase * 1.7) + 0.3 * math.sin(3 * t + phase))
        pts.append((cx + r * w * math.cos(t), min(cy + r * 0.82 * w * math.sin(t), 98.5)))
    return glatt(pts)

# Rüschen-Rosetten von hinten (oben) nach vorn (unten)
kleine = []
for (cx, cy, r) in ROSETTEN:
    for k in range(6):
        ang = random.uniform(0, 2 * math.pi); rr = r * random.uniform(0.0, 0.75)
        kleine.append((cx + rr * math.cos(ang), cy + rr * 0.8 * math.sin(ang), r * random.uniform(0.55, 0.72)))
kleine.sort(key=lambda k: k[1])
for (x, y, r) in kleine:
    if not drinnen(x, y, rand=r * 0.75): continue
    ph = random.uniform(0, 6)
    wert = (x - 57) * 0.6 + (y - 66)
    grund = G_H if wert < -10 else (G if wert < 12 else '#CDAE72')
    ebenen.append(E(wellring(x + 0.8, y + 1.4, r, ph), '#6E5230', o=0.5, rolle='schatten'))
    ebenen.append(E(wellring(x, y, r, ph), grund, s=KANTE, sw=0.8, rolle='detail'))
    ebenen.append(E(wellring(x + 0.4, y + 0.6, r * 0.62, ph + 1.3, freq=9), G_D, o=0.55, rolle='schatten'))
    ebenen.append(E(wellring(x - 0.3, y - 0.3, r * 0.56, ph + 1.3, freq=9), grund, s=KANTE, sw=0.7, rolle='detail'))
    ebenen.append(E(wellring(x + 0.2, y + 0.3, r * 0.22, ph, freq=7, amp=0.2), G_D, o=0.7, rolle='schatten'))
    ebenen.append(E(f'M{round(x-r*0.8,1)} {round(y-r*0.25,1)} q{round(r*0.3,1)} {round(-r*0.55,1)} {round(r*0.85,1)} {round(-r*0.6,1)}', s='#FBF0D2', sw=0.9, o=0.85, rolle='licht'))
ebenen.append(E(glatt(aussen), s=INK, sw=1.6, rolle='detail'))  # Außenkontur nachziehen
quellen = [
    {'titel': 'Referenzfoto Krause Glucke Sparassis crispa.JPG', 'url': 'https://commons.wikimedia.org/wiki/File:Krause_Glucke_Sparassis_crispa.JPG'},
    {'titel': 'Referenzfoto Sparassis crispa 3.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Sparassis_crispa_3.jpg'},
    {'titel': 'Referenzfoto Sparassis crispa 103223634.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Sparassis_crispa_103223634.jpg'},
]
speichern('glucke', ebenen, quellen)
