"""Pfifferling-Icon: dottergelber Trichter mit welligem Rand und herablaufenden Leisten."""
import math, sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

def glatt(pts, zu=True):
    """Catmull-Rom-Kurve durch Punkte als Bézier-Pfad."""
    n = len(pts); r = lambda v: round(v, 1)
    d = f'M{r(pts[0][0])} {r(pts[0][1])}'
    rng = range(n) if zu else range(n - 1)
    for i in rng:
        p0 = pts[(i - 1) % n] if (zu or i > 0) else pts[i]
        p1 = pts[i]; p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n] if (zu or i + 2 < n) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f' C{r(c1[0])} {r(c1[1])} {r(c2[0])} {r(c2[1])} {r(p2[0])} {r(p2[1])}'
    return d + (' Z' if zu else '')

G, G_D, G_H, LEISTE, LINIE = '#E9A92C', '#A86E14', '#F7CF62', '#DE9A24', '#9A6212'
CX, CY, RX, RY = 60, 44, 34, 12

def rand(t):
    """Welliger Hutrand (Winkel t): Radius schwankt, vorne leicht heruntergebogen."""
    w = 1 + 0.07 * math.sin(5 * t + 0.6) + 0.04 * math.sin(9 * t)
    x = CX + RX * w * math.cos(t)
    y = CY + RY * w * math.sin(t) + 2.2 * math.sin(7 * t + 1)
    return (x, y)

N = 40
randpkt = [rand(2 * math.pi * i / N) for i in range(N)]
# vorderer Rand (unten, t von 0 bis pi) für die Unterseite
vorne = [rand(math.pi * i / 20) for i in range(21)]

# Unterseite (Trichterkegel mit Leisten): vom vorderen Hutrand zum Stiel
unter = [(53.5, 80)] + [vorne[0]] + vorne[1:-1][::-1][::-1] + [vorne[-1], (66.5, 80)]
# als Pfad: rechts vom Rand runter zum Stiel, dann vorderer Rand zurück
def unterseite():
    p = f'M{round(vorne[0][0],1)} {round(vorne[0][1],1)} C{vorne[0][0]-2} 60 70 68 68 78 C68 86 65 93 65.5 100 L53.5 100 C54.5 93 52 86 52 78 C50 68 {vorne[-1][0]+2} 60 {round(vorne[-1][0],1)} {round(vorne[-1][1],1)}'
    # vorderen Rand zurück (von links nach rechts = t von pi nach 0)
    for i in range(19, -1, -1):
        p += f' L{round(vorne[i][0],1)} {round(vorne[i][1],1)}'
    return p + ' Z'

# Leisten: gegabelte Linien vom Rand zum Stiel
leisten = ''
for i in range(1, 20):
    x0, y0 = vorne[i]
    if y0 < CY + 2 or not 31 < x0 < 89: continue
    ziel_x = 53.5 + (x0 - 26) / 68 * 13
    if i % 2 == 1: continue
    leisten += f' M{round(x0,1)} {round(y0,1)} Q{round((x0+ziel_x)/2 + (60-x0)*0.22,1)} {round((y0+80)/2,1)} {round(ziel_x,1)} 89'
    if i % 4 == 0:  # Gabelung
        leisten += f' M{round((x0*0.65+ziel_x*0.35),1)} {round(y0*0.65+82*0.35,1)} L{round(x0+ (2 if x0<60 else -2),1)} {round(y0+0.5,1)}'

ebenen = hg_boden() + [
    # Stiel, nach unten verjüngt, leicht gebogen
    # Unterseite mit Leisten
    form(unterseite(), LEISTE),
    E('M63 78 C63.5 88 62 94 62 100 L65.5 100 C65 93 68 86 68 76 Z', G_D, o=0.7, rolle='schatten'),
    E('M54.8 82 C55 88 56.2 93 56 98 L57.4 98 C57.6 92 56.8 87 56.6 82 Z', G_H, o=0.7, rolle='licht'),
    E(leisten.strip(), s=LINIE, sw=0.8, o=0.85, rolle='detail'),
    E('M80 50 C78 60 70 68 66.5 80 L62 80 C66 68 74 58 78 49 Z', G_D, o=0.55, rolle='schatten'),
    # Hutoberseite (Trichter von schräg oben)
    form(glatt(randpkt), G),
    # Vertiefung in der Mitte (Trichter)
    E(oval(61, 45, 17, 5.2), G_D, o=0.55, rolle='schatten'),
    E(oval(62, 46, 9, 2.6), G_D, o=0.5, rolle='schatten'),
    # Licht oben links auf dem Rand
    E('M34 44 C38 38.5 47 35.5 58 35 C49 37.5 41.5 40.5 37.5 45.5 Z', G_H, o=0.9, rolle='licht'),
    E('M38 50 C42 52.5 48 53.5 52 53.5 C47 55 41 54 37 51.5 Z', G_H, o=0.6, rolle='licht'),
    # feine Wellenlinien auf dem Hut (eingerollter Rand)
    E('M33 47 q4 3 9 3.5 M72 52.5 q7 -0.5 12 -4 M44 36 q6 -2 12 -2', s=LINIE, sw=0.7, o=0.6, rolle='detail'),
    # ein Moosbüschel am Fuß
    E('M45 100 q3 -6 5 0 M68 100 q2 -5 5 -1 M70 100 q3 -7 6 -2', s='#7C9A48', sw=1.1, rolle='detail'),
]
quellen = [
    {'titel': 'Referenzfoto 2007-07-14 Cantharellus cibarius.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:2007-07-14_Cantharellus_cibarius.jpg'},
    {'titel': 'Referenzfoto Cantharellus cibarius 93147036.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Cantharellus_cibarius_93147036.jpg'},
    {'titel': 'Referenzfoto Cantharellus cibarius 55979173.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Cantharellus_cibarius_55979173.jpg'},
]
speichern('pfifferling', ebenen, quellen)
